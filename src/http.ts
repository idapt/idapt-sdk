/**
 * Typed fetch wrapper used by every API-calling module.
 *
 * Responsibilities:
 *   - Build the URL (base + path + query) safely
 *   - Serialise JSON bodies or pass through `BodyInit` (multipart)
 *   - Attach the bearer token
 *   - Honour AbortSignal
 *   - Parse JSON responses (respecting Content-Type)
 *   - Map non-2xx responses to the typed error hierarchy
 *
 * Everything else in the SDK calls through this single surface so behaviours
 * (retries, 401 handling, etc.) can be evolved in one place.
 */

import { errorFromStatus, IdaptError, NetworkError } from "./errors.js";

/**
 * Query params.
 *
 * Typed as `object` rather than `Record<string, unknown>` because named
 * interfaces (e.g. `ListAgentsQuery`) don't satisfy `Record`'s implicit
 * index signature — a known TS papercut. Any typed object satisfies
 * `object`, so call sites don't need casts. `buildQuery` reads the value
 * via `Object.entries` and skips non-primitives.
 */
export type QueryInput = object;

export interface HttpRequest {
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  path: string;
  query?: QueryInput;
  headers?: Record<string, string>;
  body?: unknown;
  bodyRaw?: BodyInit;
  signal?: AbortSignal;
  /**
   * Response decoding mode. Exactly one of these is honoured:
   *   - `expectBlob: true`  → return `res.blob()` (binary)
   *   - `expectJson: false` → return `res.text()` (raw string)
   *   - otherwise            → parse JSON when Content-Type says so,
   *                            fall back to text
   */
  expectJson?: boolean;
  expectBlob?: boolean;
}

/**
 * How the SDK proves identity on every request:
 *
 *   - `"bearer"` (default) — send `Authorization: Bearer <key>`. Used by
 *     library mode (explicit `uk_`/`pk_`/`ap_` key) and any caller holding a
 *     raw key.
 *   - `"cookie"` — send `credentials: "include"` and NO `Authorization`
 *     header. Used by the hosted cookie-bootstrap flow: the raw `ap_` key
 *     lives only in the httpOnly `__Secure-idapt_app_key` cookie planted on the
 *     app subdomain, so the SDK never sees it — the browser attaches it
 *     automatically. `key` is unused (and typically empty) in this mode.
 *
 * A third, derived strategy exists when {@link HttpContext.getToken} is set
 * (cookie-mode v1 surfaces): a **minted bearer**. The provider lazily mints an
 * `idapt-api`-audience JWT from the app cookie (via `/api/browser-app/token`),
 * the request sends it as `Authorization: Bearer <jwt>` with NO ambient cookie,
 * and a 401 triggers a single re-mint-and-retry (via {@link HttpContext.onUnauthorized}).
 */
export type AuthMode = "bearer" | "cookie";

export interface HttpContext {
  apiUrl: string;
  key: string;
  /**
   * Auth transport. Defaults to `"bearer"` when omitted (back-compat). In
   * `"cookie"` mode the httpOnly app-key cookie carries auth instead — the
   * request is sent with `credentials: "include"` and no bearer header.
   *
   * Ignored when {@link getToken} is set: a minted-bearer context always
   * attaches the provider's JWT and never sends ambient cookies.
   */
  auth?: AuthMode;
  /**
   * Dynamic bearer provider (cookie-mode v1 surfaces). When present it
   * supersedes both `key` and `auth`: every request awaits it for the
   * `Authorization` bearer and omits `credentials: "include"`. Implementations
   * cache the minted token and re-mint on expiry; {@link onUnauthorized} lets
   * the request layer force a re-mint when the server still rejects (401).
   */
  getToken?: () => Promise<string>;
  /**
   * Called once on a 401 from a {@link getToken}-backed request so the provider
   * can invalidate its cached token; the request is then retried a single time
   * with a freshly-minted bearer. No-op / absent ⇒ no retry.
   */
  onUnauthorized?: () => void;
  /** Custom fetch — used in tests and for polyfills. */
  fetch?: typeof fetch;
}

export async function request<T = unknown>(
  ctx: HttpContext,
  req: HttpRequest,
): Promise<T> {
  const res = await send(ctx, req);
  return handleResponse<T>(res, {
    expectJson: req.expectJson !== false,
    expectBlob: req.expectBlob === true,
  });
}

export async function requestRaw(
  ctx: HttpContext,
  req: HttpRequest,
): Promise<Response> {
  const res = await send(ctx, req);
  if (!res.ok) {
    await handleResponse<never>(res, {
      expectJson: req.expectJson !== false,
      expectBlob: false,
    });
  }
  return res;
}

async function send(ctx: HttpContext, req: HttpRequest): Promise<Response> {
  const doFetch = ctx.fetch ?? globalThis.fetch;
  if (!doFetch) {
    throw new NetworkError({
      message: "No fetch implementation available",
    });
  }

  const url = buildUrl(ctx.apiUrl, req.path, req.query);

  // Three auth strategies, in precedence order:
  //   1. minted-bearer — `getToken` set (cookie-mode v1): await the provider
  //      for the JWT bearer, never send ambient cookies, retry once on 401.
  //   2. cookie — `auth: "cookie"` (the app-data KV): no bearer, send the
  //      httpOnly app-key cookie via `credentials: "include"`.
  //   3. static bearer (default) — `Authorization: Bearer <key>`.
  // Per-request `headers` always win so callers can override (e.g. a one-off
  // explicit bearer). A caller-supplied Authorization also suppresses the
  // provider call AND the 401 re-mint (the caller owns that token).
  const callerSetsAuth = hasAuthorizationHeader(req.headers);
  const mintedBearer = !!ctx.getToken && !callerSetsAuth;
  const cookieMode = !mintedBearer && ctx.auth === "cookie";

  const body = buildBody(req);

  const doSend = async (authHeader: string | null): Promise<Response> => {
    const headers: Record<string, string> = {
      ...(authHeader ? { Authorization: authHeader } : {}),
      ...(req.headers ?? {}),
    };
    if (body.contentType) headers["Content-Type"] ??= body.contentType;
    try {
      return await doFetch(url, {
        method: req.method,
        headers,
        body: body.value,
        signal: req.signal,
        // Send the httpOnly app-key cookie ONLY in cookie mode (same-origin on
        // the app subdomain). Bearer / minted-bearer omit it to avoid leaking
        // ambient cookies — the minted JWT is the sole credential there.
        ...(cookieMode ? { credentials: "include" as RequestCredentials } : {}),
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      throw new NetworkError({
        message: err instanceof Error ? err.message : "Network failure",
        cause: err,
      });
    }
  };

  if (mintedBearer && ctx.getToken) {
    let res = await doSend(`Bearer ${await ctx.getToken()}`);
    // A 401 means the cached token lapsed (or was revoked) between mint and
    // use. Invalidate it and retry exactly once with a freshly-minted bearer;
    // a second 401 surfaces to the caller as a normal AuthError.
    if (res.status === 401 && ctx.onUnauthorized) {
      ctx.onUnauthorized();
      res = await doSend(`Bearer ${await ctx.getToken()}`);
    }
    return res;
  }

  return doSend(cookieMode ? null : `Bearer ${ctx.key}`);
}

/** True when the caller pinned an `Authorization` header (case-insensitive). */
function hasAuthorizationHeader(headers?: Record<string, string>): boolean {
  if (!headers) return false;
  return Object.keys(headers).some((k) => k.toLowerCase() === "authorization");
}

/** Resolve the request body + its inferred Content-Type (JSON vs raw passthrough). */
function buildBody(req: HttpRequest): {
  value: BodyInit | undefined;
  contentType?: string;
} {
  if (req.bodyRaw !== undefined) return { value: req.bodyRaw };
  if (req.body !== undefined) {
    return {
      value: JSON.stringify(req.body),
      contentType: "application/json",
    };
  }
  return { value: undefined };
}

async function handleResponse<T>(
  res: Response,
  mode: { expectJson: boolean; expectBlob: boolean },
): Promise<T> {
  const ct = res.headers.get("content-type") ?? "";
  const isJson = ct.includes("application/json");

  if (!res.ok) {
    let parsed: unknown;
    let message = `API error: ${res.status}`;
    try {
      if (isJson) {
        parsed = await res.json();
        if (
          parsed &&
          typeof parsed === "object" &&
          "error" in parsed &&
          parsed.error &&
          typeof parsed.error === "object" &&
          "message" in parsed.error &&
          typeof (parsed.error as { message?: unknown }).message === "string"
        ) {
          message = (parsed.error as { message: string }).message;
        }
      } else {
        parsed = await res.text();
      }
    } catch {
      // response body not readable — keep default message
    }
    throw errorFromStatus(res.status, message, parsed);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  try {
    if (mode.expectBlob) return (await res.blob()) as unknown as T;
    if (mode.expectJson && isJson) return (await res.json()) as T;
    return (await res.text()) as unknown as T;
  } catch (err) {
    throw new IdaptError({
      code: "server_error",
      message: "Invalid response body",
      status: res.status,
      cause: err,
    });
  }
}

export function buildUrl(
  apiUrl: string,
  path: string,
  query?: QueryInput,
): string {
  const base = apiUrl.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const qs = buildQuery(query);
  return base + cleanPath + qs;
}

function buildQuery(query: QueryInput | undefined): string {
  if (!query) return "";
  const entries: [string, string][] = [];
  for (const [k, v] of Object.entries(query as Record<string, unknown>)) {
    if (v === null || v === undefined) continue;
    if (
      typeof v !== "string" &&
      typeof v !== "number" &&
      typeof v !== "boolean"
    ) {
      continue;
    }
    entries.push([k, String(v)]);
  }
  if (entries.length === 0) return "";
  const sp = new URLSearchParams(entries);
  return `?${sp.toString()}`;
}
