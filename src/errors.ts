/**
 * Typed error hierarchy for @idapt/sdk.
 *
 * Every API-originated failure is surfaced as an `IdaptError` or a subclass.
 * Consumers can branch on `error.code` (stable string) or `instanceof`
 * (preferred in TypeScript). The raw HTTP status is preserved on `.status`.
 *
 * Why a class hierarchy (not just codes)?
 *   - `catch (err) { if (err instanceof AuthError) ... }` reads cleanly
 *   - Each subclass has a `.name` that matches its constructor, so stack
 *     traces and devtools show the right label
 *   - Adding a subclass is a non-breaking change
 *
 * ## Wire error envelope — `{ error: { type, message, code? } }`
 *
 * The v1 error envelope splits its old flat `code` field into two:
 *   - **`type`** — the coarse category (`invalid_request`, `unauthorized`,
 *     `forbidden`, `not_found`, `conflict`, `rate_limit`,
 *     `service_unavailable`, `internal_error`). This is what clients branch
 *     on for coarse handling — the SDK mirrors it onto `IdaptError.type`.
 *   - **`code`** — an OPTIONAL finer computer-branchable sub-code carried
 *     alongside `type`, present only on specific errors (today the only
 *     value is `model_not_available_for_tier`). The SDK surfaces it as
 *     `IdaptError.subCode`. A client that does not recognise a sub-code
 *     falls back to `type`, so new sub-codes are never breaking.
 *
 * Note: `IdaptError.code` is the SDK's own stable discriminant (it predates
 * the wire split and pairs 1:1 with the `instanceof` subclasses). The wire
 * `error.type` lands on `.type`; the wire `error.code` lands on `.subCode`.
 */

/**
 * SDK-internal stable error discriminant. Pairs 1:1 with the `instanceof`
 * subclasses. This is NOT the wire `error.type` — see `IdaptErrorType` for
 * that — it is the SDK's own long-stable code (kept for back-compat).
 */
export type IdaptErrorCode =
  | "network_error"
  | "auth_expired"
  | "auth_missing"
  | "permission_denied"
  | "not_found"
  | "conflict"
  | "rate_limited"
  | "invalid_request"
  | "service_unavailable"
  | "server_error"
  | "off_idapt"
  | "unknown";

/**
 * The wire `error.type` enum — the coarse category the v1 API stamps on
 * every error envelope. Mirrored onto `IdaptError.type` verbatim.
 */
export type IdaptErrorType =
  | "invalid_request"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "rate_limit"
  | "service_unavailable"
  | "internal_error";

/**
 * The wire `error.code` finer sub-code enum. Optional — present only on
 * specific errors. Typed as a union with `string` so an unrecognised
 * future sub-code still type-checks (consumers fall back to `.type`).
 */
export type IdaptErrorSubCode = "model_not_available_for_tier" | (string & {});

export interface IdaptErrorInit {
  message: string;
  code: IdaptErrorCode;
  status?: number;
  body?: unknown;
  cause?: unknown;
  /** Wire `error.type` — the coarse category. */
  type?: IdaptErrorType;
  /** Wire `error.code` — the optional finer sub-code. */
  subCode?: IdaptErrorSubCode;
}

export class IdaptError extends Error {
  /** SDK-internal stable discriminant (back-compat; pairs with subclasses). */
  readonly code: IdaptErrorCode;
  /** Wire `error.type` — the coarse category the server reported. */
  readonly type?: IdaptErrorType;
  /**
   * Wire `error.code` — the optional finer sub-code, present only on
   * specific errors (e.g. `model_not_available_for_tier`). Branch on this
   * for fine-grained handling and fall back to `type` / the subclass when
   * it is absent or unrecognised.
   */
  readonly subCode?: IdaptErrorSubCode;
  readonly status: number;
  readonly body: unknown;

  constructor(init: IdaptErrorInit) {
    super(init.message, init.cause ? { cause: init.cause } : undefined);
    this.name = "IdaptError";
    this.code = init.code;
    this.type = init.type;
    this.subCode = init.subCode;
    this.status = init.status ?? 0;
    this.body = init.body;
  }
}

export class NetworkError extends IdaptError {
  constructor(init: Omit<IdaptErrorInit, "code"> & { code?: "network_error" }) {
    super({ ...init, code: "network_error" });
    this.name = "NetworkError";
  }
}

export class AuthError extends IdaptError {
  constructor(
    init: Omit<IdaptErrorInit, "code"> & {
      code?: "auth_expired" | "auth_missing";
    },
  ) {
    super({ ...init, code: init.code ?? "auth_expired" });
    this.name = "AuthError";
  }
}

export class PermissionError extends IdaptError {
  constructor(init: Omit<IdaptErrorInit, "code">) {
    super({ ...init, code: "permission_denied" });
    this.name = "PermissionError";
  }
}

export class NotFoundError extends IdaptError {
  constructor(init: Omit<IdaptErrorInit, "code">) {
    super({ ...init, code: "not_found" });
    this.name = "NotFoundError";
  }
}

export class ConflictError extends IdaptError {
  constructor(init: Omit<IdaptErrorInit, "code">) {
    super({ ...init, code: "conflict" });
    this.name = "ConflictError";
  }
}

export class RateLimitError extends IdaptError {
  constructor(init: Omit<IdaptErrorInit, "code"> & { retryAfter?: number }) {
    super({ ...init, code: "rate_limited" });
    this.name = "RateLimitError";
    this.retryAfter = init.retryAfter;
  }
  readonly retryAfter?: number;
}

export class InvalidRequestError extends IdaptError {
  constructor(init: Omit<IdaptErrorInit, "code">) {
    super({ ...init, code: "invalid_request" });
    this.name = "InvalidRequestError";
  }
}

/**
 * HTTP 503 — an upstream dependency the request needed (a computer daemon,
 * an inference provider) was unreachable. The request itself was valid, so
 * this is **retryable**: `retryable` is always `true` and `retryAfter`
 * carries the server's `retry_after` hint when one is present.
 *
 * Returned by the computer `exec` / `tmux` / `sftp` endpoints and
 * `POST /v1/audio/transcriptions`.
 */
export class ServiceUnavailableError extends IdaptError {
  /** Always `true` — a 503 means "retry later", the request was fine. */
  readonly retryable = true;
  /** Server-suggested seconds to wait before retrying, when provided. */
  readonly retryAfter?: number;
  constructor(init: Omit<IdaptErrorInit, "code"> & { retryAfter?: number }) {
    super({ ...init, code: "service_unavailable" });
    this.name = "ServiceUnavailableError";
    this.retryAfter = init.retryAfter;
  }
}

export class ServerError extends IdaptError {
  constructor(init: Omit<IdaptErrorInit, "code">) {
    super({ ...init, code: "server_error" });
    this.name = "ServerError";
  }
}

/**
 * Thrown when a server-backed SDK surface is invoked while the client is
 * running **off Idapt** — i.e. in local / standalone mode with no credential
 * (e.g. `idapt app run` on `localhost`, a static host, or a `file://` page).
 *
 * In that mode the SDK degrades gracefully: `client.app.*` still reads the
 * bundle's own assets over relative `fetch`, and `client.data.*` transparently
 * persists to IndexedDB (or an in-memory fallback). But everything that needs
 * the Idapt backend — `client.agents`, `client.chats`, `client.files`,
 * `client.workspaces`, `client.triggers`, `client.models`, `client.images`,
 * `client.audio`, `client.code`, `client.search`, `client.web`,
 * `client.skill`, `client.docs`, plus `getAuthToken()` and `escalate()` —
 * has no server to talk to and throws this typed error instead.
 *
 * Branch on it (`err instanceof OffIdaptError` / `err.code === "off_idapt"`)
 * to feature-detect and hide hosted-only UI when running standalone. `.surface`
 * names the API surface that was unavailable (e.g. `"agents.list"`).
 *
 * This is NOT a wire error — there is no HTTP round-trip (`status` is `0`).
 */
export class OffIdaptError extends IdaptError {
  /** The SDK surface that is unavailable off Idapt, e.g. `"agents.list"`. */
  readonly surface?: string;
  constructor(
    init: Omit<IdaptErrorInit, "code" | "message"> & {
      surface?: string;
      message?: string;
    } = {},
  ) {
    const surface = init.surface;
    super({
      ...init,
      code: "off_idapt",
      message:
        init.message ??
        (surface
          ? `\`${surface}\` is unavailable in local (off-Idapt) mode — connect to Idapt with a credential (cookie or key) to use server-backed APIs. \`client.app\` and \`client.data\` keep working locally.`
          : "This API is unavailable in local (off-Idapt) mode — connect to Idapt with a credential to use server-backed APIs."),
    });
    this.name = "OffIdaptError";
    this.surface = surface;
  }
}

/**
 * Map an HTTP response status code to the correct error subclass.
 * Centralised so the mapping stays consistent across every SDK call site.
 *
 * The v1 contract pins each failure mode to a specific status:
 *   - `invalid_request`     → always HTTP 422 (validation failures)
 *   - `not_found`           → always HTTP 404 (missing resource)
 *   - `permission_denied`   → 403, `auth_*` → 401, `conflict` → 409,
 *     `rate_limited`        → 429
 *   - `service_unavailable` → 503 (upstream dependency down — retryable)
 *   - `server_error`        → any other 5xx (500, 502, …)
 * Any other 4xx the server emits is unmapped and surfaces as the
 * `IdaptError` base with code `unknown` — we do NOT label a bare 400 as
 * `invalid_request`, since that code is reserved for 422.
 *
 * `type` / `subCode` are the wire `error.type` / `error.code` lifted off
 * the response envelope by `extractErrorFields`; they ride along so
 * consumers can branch on the fine-grained sub-code.
 */
export function errorFromStatus(
  status: number,
  message: string,
  body: unknown,
): IdaptError {
  const { type, subCode } = extractErrorFields(body);
  const base = { message, status, body, type, subCode };
  if (status === 401) return new AuthError(base);
  if (status === 403) return new PermissionError(base);
  if (status === 404) return new NotFoundError(base);
  if (status === 409) return new ConflictError(base);
  if (status === 422) {
    return new InvalidRequestError(base);
  }
  if (status === 429) {
    const retryAfter = extractRetryAfter(body);
    return new RateLimitError({ ...base, retryAfter });
  }
  if (status === 503) {
    const retryAfter = extractRetryAfter(body);
    return new ServiceUnavailableError({ ...base, retryAfter });
  }
  if (status >= 500) return new ServerError(base);
  return new IdaptError({ ...base, code: "unknown" });
}

/**
 * Pull the wire `error.type` / `error.code` out of a v1 error envelope
 * (`{ error: { type, message, code? } }`). Tolerant of any non-conforming
 * body — returns `{}` rather than throwing so error mapping never fails.
 */
function extractErrorFields(body: unknown): {
  type?: IdaptErrorType;
  subCode?: IdaptErrorSubCode;
} {
  if (!body || typeof body !== "object" || !("error" in body)) return {};
  const err = (body as { error?: unknown }).error;
  if (!err || typeof err !== "object") return {};
  const out: { type?: IdaptErrorType; subCode?: IdaptErrorSubCode } = {};
  const t = (err as { type?: unknown }).type;
  if (typeof t === "string") out.type = t as IdaptErrorType;
  const c = (err as { code?: unknown }).code;
  if (typeof c === "string") out.subCode = c as IdaptErrorSubCode;
  return out;
}

function extractRetryAfter(body: unknown): number | undefined {
  if (body && typeof body === "object" && "retry_after" in body) {
    const v = (body as { retry_after?: unknown }).retry_after;
    if (typeof v === "number") return v;
  }
  return undefined;
}
