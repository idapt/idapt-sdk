import { describe, expect, it } from "vitest";
import {
  AuthError,
  ConflictError,
  errorFromStatus,
  IdaptError,
  InvalidRequestError,
  NotFoundError,
  OffIdaptError,
  PermissionError,
  RateLimitError,
  ServerError,
  ServiceUnavailableError,
} from "./errors.js";

describe("IdaptError hierarchy", () => {
  it("extends Error with code + status + body", () => {
    const err = new IdaptError({
      message: "boom",
      code: "unknown",
      status: 418,
      body: { raw: 1 },
    });
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("IdaptError");
    expect(err.code).toBe("unknown");
    expect(err.status).toBe(418);
    expect(err.body).toEqual({ raw: 1 });
  });

  it("preserves cause when provided (ES2022)", () => {
    const root = new Error("root");
    const err = new IdaptError({
      message: "wrapper",
      code: "unknown",
      cause: root,
    });
    expect(err.cause).toBe(root);
  });

  it("AuthError defaults code to auth_expired", () => {
    const err = new AuthError({ message: "401" });
    expect(err.code).toBe("auth_expired");
    expect(err.name).toBe("AuthError");
  });

  it("AuthError accepts auth_missing override", () => {
    const err = new AuthError({ message: "missing", code: "auth_missing" });
    expect(err.code).toBe("auth_missing");
  });
});

describe("errorFromStatus", () => {
  it("401 → AuthError", () => {
    const err = errorFromStatus(401, "unauthorized", {});
    expect(err).toBeInstanceOf(AuthError);
  });

  it("403 → PermissionError", () => {
    const err = errorFromStatus(403, "forbidden", {});
    expect(err).toBeInstanceOf(PermissionError);
  });

  it("404 → NotFoundError", () => {
    const err = errorFromStatus(404, "not found", {});
    expect(err).toBeInstanceOf(NotFoundError);
  });

  it("409 → ConflictError", () => {
    const err = errorFromStatus(409, "conflict", {});
    expect(err).toBeInstanceOf(ConflictError);
  });

  it("429 → RateLimitError with retryAfter", () => {
    const err = errorFromStatus(429, "slow down", { retry_after: 30 });
    expect(err).toBeInstanceOf(RateLimitError);
    expect((err as RateLimitError).retryAfter).toBe(30);
  });

  it("422 → InvalidRequestError (the only status that maps to invalid_request)", () => {
    const err = errorFromStatus(422, "invalid", {});
    expect(err).toBeInstanceOf(InvalidRequestError);
    expect(err.code).toBe("invalid_request");
  });

  it("a bare 400 is NOT labelled invalid_request — falls back to the base", () => {
    const err = errorFromStatus(400, "bad request", {});
    expect(err).not.toBeInstanceOf(InvalidRequestError);
    expect(err.code).toBe("unknown");
  });

  it("500 → ServerError", () => {
    const err = errorFromStatus(500, "oops", {});
    expect(err).toBeInstanceOf(ServerError);
  });

  it("502 → ServerError (any non-503 5xx)", () => {
    const err = errorFromStatus(502, "bad gateway", {});
    expect(err).toBeInstanceOf(ServerError);
  });

  it("503 → ServiceUnavailableError (retryable, NOT a plain ServerError)", () => {
    const err = errorFromStatus(503, "unavailable", {});
    expect(err).toBeInstanceOf(ServiceUnavailableError);
    expect(err).not.toBeInstanceOf(ServerError);
    expect(err.code).toBe("service_unavailable");
    expect((err as ServiceUnavailableError).retryable).toBe(true);
  });

  it("503 carries the server retry_after hint when present", () => {
    const err = errorFromStatus(503, "unavailable", { retry_after: 15 });
    expect((err as ServiceUnavailableError).retryAfter).toBe(15);
  });

  it("unknown status → IdaptError base", () => {
    const err = errorFromStatus(100, "info", {});
    expect(err).toBeInstanceOf(IdaptError);
    expect(err.code).toBe("unknown");
  });
});

describe("errorFromStatus — wire error envelope (type + code sub-code)", () => {
  it("lifts error.type onto .type", () => {
    const err = errorFromStatus(403, "forbidden", {
      error: { type: "forbidden", message: "forbidden" },
    });
    expect(err).toBeInstanceOf(PermissionError);
    expect(err.type).toBe("forbidden");
  });

  it("lifts the optional error.code finer sub-code onto .subCode", () => {
    // 403 from POST /v1/images/generations on a tier-locked model.
    const err = errorFromStatus(403, "model not available", {
      error: {
        type: "forbidden",
        message: "model not available",
        code: "model_not_available_for_tier",
      },
    });
    expect(err).toBeInstanceOf(PermissionError);
    expect(err.type).toBe("forbidden");
    expect(err.subCode).toBe("model_not_available_for_tier");
  });

  it("threads type onto a 503 ServiceUnavailableError", () => {
    const err = errorFromStatus(503, "daemon unreachable", {
      error: { type: "service_unavailable", message: "daemon unreachable" },
    });
    expect(err.type).toBe("service_unavailable");
  });

  it("leaves .type / .subCode undefined when the body is not a v1 error envelope", () => {
    const err = errorFromStatus(404, "not found", { whatever: true });
    expect(err.type).toBeUndefined();
    expect(err.subCode).toBeUndefined();
  });

  it("tolerates a malformed error object without throwing", () => {
    const err = errorFromStatus(409, "conflict", { error: "a string" });
    expect(err).toBeInstanceOf(ConflictError);
    expect(err.type).toBeUndefined();
  });
});

describe("OffIdaptError", () => {
  it("is an IdaptError with code off_idapt and status 0 (no wire round-trip)", () => {
    const err = new OffIdaptError({ surface: "agents.list" });
    expect(err).toBeInstanceOf(IdaptError);
    expect(err).toBeInstanceOf(OffIdaptError);
    expect(err.code).toBe("off_idapt");
    expect(err.status).toBe(0);
    expect(err.name).toBe("OffIdaptError");
  });

  it("carries the unavailable surface name and a helpful default message", () => {
    const err = new OffIdaptError({ surface: "chats.sendMessage" });
    expect(err.surface).toBe("chats.sendMessage");
    expect(err.message).toContain("chats.sendMessage");
    expect(err.message).toContain("local");
  });

  it("falls back to a generic message when no surface is given", () => {
    const err = new OffIdaptError();
    expect(err.surface).toBeUndefined();
    expect(err.message).toContain("local");
  });

  it("allows a custom message override", () => {
    const err = new OffIdaptError({ message: "custom" });
    expect(err.message).toBe("custom");
  });
});
