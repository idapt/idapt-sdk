

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
  | "unknown";

export type IdaptErrorType =
  | "invalid_request"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "rate_limit"
  | "service_unavailable"
  | "internal_error";

export type IdaptErrorSubCode = "model_not_available_for_tier" | (string & {});

export interface IdaptErrorInit {
  message: string;
  code: IdaptErrorCode;
  status?: number;
  body?: unknown;
  cause?: unknown;

  type?: IdaptErrorType;

  subCode?: IdaptErrorSubCode;
}

export class IdaptError extends Error {

  readonly code: IdaptErrorCode;

  readonly type?: IdaptErrorType;

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

export class ServiceUnavailableError extends IdaptError {

  readonly retryable = true;

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
