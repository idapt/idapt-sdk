

import { errorFromStatus, IdaptError, NetworkError } from "./errors.js";

export type QueryInput = object;

export interface HttpRequest {
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  path: string;
  query?: QueryInput;
  headers?: Record<string, string>;
  body?: unknown;
  bodyRaw?: BodyInit;
  signal?: AbortSignal;

  expectJson?: boolean;
  expectBlob?: boolean;
}

export type AuthMode = "bearer" | "cookie";

export interface HttpContext {
  apiUrl: string;
  key: string;

  auth?: AuthMode;

  getToken?: () => Promise<string>;

  onUnauthorized?: () => void;

  headers?: Record<string, string>;

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

  const callerSetsAuth = hasAuthorizationHeader(req.headers);
  const mintedBearer = !!ctx.getToken && !callerSetsAuth;
  const cookieMode = !mintedBearer && ctx.auth === "cookie";

  const body = buildBody(req);

  const doSend = async (authHeader: string | null): Promise<Response> => {
    const headers: Record<string, string> = {
      ...(authHeader ? { Authorization: authHeader } : {}),

      ...(ctx.headers ?? {}),
      ...(req.headers ?? {}),
    };
    if (body.contentType) headers["Content-Type"] ??= body.contentType;
    try {
      return await doFetch(url, {
        method: req.method,
        headers,
        body: body.value,
        signal: req.signal,

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

    if (res.status === 401 && ctx.onUnauthorized) {
      ctx.onUnauthorized();
      res = await doSend(`Bearer ${await ctx.getToken()}`);
    }
    return res;
  }

  return doSend(cookieMode ? null : `Bearer ${ctx.key}`);
}

function hasAuthorizationHeader(headers?: Record<string, string>): boolean {
  if (!headers) return false;
  return Object.keys(headers).some((k) => k.toLowerCase() === "authorization");
}

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
