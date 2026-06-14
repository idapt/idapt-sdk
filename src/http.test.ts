import { describe, expect, it, vi } from "vitest";
import {
  AuthError,
  ConflictError,
  NetworkError,
  NotFoundError,
  PermissionError,
  RateLimitError,
  ServerError,
  ServiceUnavailableError,
} from "./errors.js";
import { buildUrl, request } from "./http.js";

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function textResponse(
  status: number,
  text: string,
  ct = "text/plain",
): Response {
  return new Response(text, {
    status,
    headers: { "Content-Type": ct },
  });
}

describe("buildUrl", () => {
  it("strips trailing slashes on base and adds leading slash to path", () => {
    expect(buildUrl("https://a.example///", "files")).toBe(
      "https://a.example/files",
    );
  });

  it("serialises query params", () => {
    expect(
      buildUrl("https://a.example", "/files", { parent_id: "abc", limit: 50 }),
    ).toBe("https://a.example/files?parent_id=abc&limit=50");
  });

  it("omits null and undefined query params", () => {
    expect(
      buildUrl("https://a.example", "/files", {
        parent_id: "abc",
        cursor: null,
        missing: undefined,
      }),
    ).toBe("https://a.example/files?parent_id=abc");
  });

  it("returns just base+path when no query entries", () => {
    expect(buildUrl("https://a.example", "/x", {})).toBe("https://a.example/x");
  });
});

describe("request — success paths", () => {
  it("parses JSON when Content-Type is application/json", async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse(200, { data: 1 }));
    const res = await request<{ data: number }>(
      { apiUrl: "https://a.example", key: "ap_x", fetch: fetch as never },
      { method: "GET", path: "/x" },
    );
    expect(res).toEqual({ data: 1 });
  });

  it("returns raw text when expectJson=false", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(textResponse(200, "hello", "text/plain"));
    const res = await request<string>(
      { apiUrl: "https://a.example", key: "ap_x", fetch: fetch as never },
      { method: "GET", path: "/x", expectJson: false },
    );
    expect(res).toBe("hello");
  });

  it("returns undefined for 204 No Content", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }));
    const res = await request(
      { apiUrl: "https://a.example", key: "ap_x", fetch: fetch as never },
      { method: "DELETE", path: "/x" },
    );
    expect(res).toBeUndefined();
  });

  it("returns a Blob when expectBlob=true (bytes preserved, MIME honoured)", async () => {
    const bytes = new Uint8Array([1, 2, 3, 4]);
    const fetch = vi.fn().mockResolvedValue(
      new Response(bytes, {
        status: 200,
        headers: { "Content-Type": "application/octet-stream" },
      }),
    );
    const res = await request<Blob>(
      { apiUrl: "https://a.example", key: "ap_x", fetch: fetch as never },
      { method: "GET", path: "/bin", expectBlob: true },
    );
    expect(res).toBeInstanceOf(Blob);
    expect(res.type).toBe("application/octet-stream");
    const arr = new Uint8Array(await res.arrayBuffer());
    expect(Array.from(arr)).toEqual([1, 2, 3, 4]);
  });

  it("attaches Authorization header", async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse(200, {}));
    await request(
      { apiUrl: "https://a.example", key: "ap_abc", fetch: fetch as never },
      { method: "GET", path: "/x" },
    );
    const [, init] = fetch.mock.calls[0];
    expect(init.headers.Authorization).toBe("Bearer ap_abc");
  });

  it("bearer mode (default) does NOT send credentials: include", async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse(200, {}));
    await request(
      { apiUrl: "https://a.example", key: "ap_abc", fetch: fetch as never },
      { method: "GET", path: "/x" },
    );
    const [, init] = fetch.mock.calls[0];
    expect(init.credentials).toBeUndefined();
  });

  it("cookie mode sends credentials: include and NO Authorization header", async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse(200, {}));
    await request(
      {
        apiUrl: "https://a.example",
        key: "",
        auth: "cookie",
        fetch: fetch as never,
      },
      { method: "GET", path: "/x" },
    );
    const [, init] = fetch.mock.calls[0];
    expect(init.credentials).toBe("include");
    expect(init.headers.Authorization).toBeUndefined();
  });

  it("cookie mode still lets a per-request Authorization override through", async () => {
    // `getAuthToken()`-minted bearers and other explicit headers always win.
    const fetch = vi.fn().mockResolvedValue(jsonResponse(200, {}));
    await request(
      {
        apiUrl: "https://a.example",
        key: "",
        auth: "cookie",
        fetch: fetch as never,
      },
      {
        method: "GET",
        path: "/x",
        headers: { Authorization: "Bearer override" },
      },
    );
    const [, init] = fetch.mock.calls[0];
    expect(init.headers.Authorization).toBe("Bearer override");
    expect(init.credentials).toBe("include");
  });

  it("serialises JSON body and sets Content-Type", async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse(200, {}));
    await request(
      { apiUrl: "https://a.example", key: "ap_x", fetch: fetch as never },
      { method: "POST", path: "/x", body: { hello: "world" } },
    );
    const [, init] = fetch.mock.calls[0];
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(init.body).toBe(JSON.stringify({ hello: "world" }));
  });

  it("passes bodyRaw through unchanged (multipart)", async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse(201, {}));
    const form = new FormData();
    form.set("file", new Blob(["x"]), "name.txt");
    await request(
      { apiUrl: "https://a.example", key: "ap_x", fetch: fetch as never },
      { method: "POST", path: "/x", bodyRaw: form },
    );
    const [, init] = fetch.mock.calls[0];
    expect(init.body).toBe(form);
    // We do NOT set Content-Type for FormData — fetch infers it with boundary.
    expect(init.headers["Content-Type"]).toBeUndefined();
  });

  it("forwards AbortSignal", async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse(200, {}));
    const controller = new AbortController();
    await request(
      { apiUrl: "https://a.example", key: "ap_x", fetch: fetch as never },
      { method: "GET", path: "/x", signal: controller.signal },
    );
    const [, init] = fetch.mock.calls[0];
    expect(init.signal).toBe(controller.signal);
  });
});

describe("request — error mapping", () => {
  const ctx = {
    apiUrl: "https://a.example",
    key: "ap_x",
  };

  it("401 → AuthError", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(jsonResponse(401, { error: { message: "nope" } }));
    await expect(
      request({ ...ctx, fetch: fetch as never }, { method: "GET", path: "/x" }),
    ).rejects.toBeInstanceOf(AuthError);
  });

  it("403 → PermissionError", async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse(403, {}));
    await expect(
      request({ ...ctx, fetch: fetch as never }, { method: "GET", path: "/x" }),
    ).rejects.toBeInstanceOf(PermissionError);
  });

  it("404 → NotFoundError", async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse(404, {}));
    await expect(
      request({ ...ctx, fetch: fetch as never }, { method: "GET", path: "/x" }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("409 → ConflictError", async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse(409, {}));
    await expect(
      request({ ...ctx, fetch: fetch as never }, { method: "GET", path: "/x" }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("429 → RateLimitError with retryAfter", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(jsonResponse(429, { retry_after: 12 }));
    await request(
      { ...ctx, fetch: fetch as never },
      { method: "GET", path: "/x" },
    ).catch((err) => {
      expect(err).toBeInstanceOf(RateLimitError);
      expect(err.retryAfter).toBe(12);
    });
  });

  it("500 → ServerError", async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse(500, {}));
    await expect(
      request({ ...ctx, fetch: fetch as never }, { method: "GET", path: "/x" }),
    ).rejects.toBeInstanceOf(ServerError);
  });

  it("503 → ServiceUnavailableError (retryable)", async () => {
    const fetch = vi.fn().mockResolvedValue(
      jsonResponse(503, {
        error: { type: "service_unavailable", message: "daemon down" },
      }),
    );
    await request(
      { ...ctx, fetch: fetch as never },
      { method: "GET", path: "/x" },
    ).catch((err) => {
      expect(err).toBeInstanceOf(ServiceUnavailableError);
      expect((err as ServiceUnavailableError).retryable).toBe(true);
      expect((err as ServiceUnavailableError).type).toBe("service_unavailable");
    });
  });

  it("surfaces the optional error.code sub-code on the thrown error", async () => {
    const fetch = vi.fn().mockResolvedValue(
      jsonResponse(403, {
        error: {
          type: "forbidden",
          message: "model not available for your tier",
          code: "model_not_available_for_tier",
        },
      }),
    );
    await request(
      { ...ctx, fetch: fetch as never },
      { method: "POST", path: "/v1/images/generations" },
    ).catch((err) => {
      expect(err).toBeInstanceOf(PermissionError);
      expect((err as PermissionError).subCode).toBe(
        "model_not_available_for_tier",
      );
    });
  });

  it("network failure → NetworkError", async () => {
    const fetch = vi.fn().mockRejectedValue(new Error("ECONNREFUSED"));
    await expect(
      request({ ...ctx, fetch: fetch as never }, { method: "GET", path: "/x" }),
    ).rejects.toBeInstanceOf(NetworkError);
  });

  it("rethrows AbortError (not wrapped)", async () => {
    const err = new Error("aborted");
    err.name = "AbortError";
    const fetch = vi.fn().mockRejectedValue(err);
    await expect(
      request({ ...ctx, fetch: fetch as never }, { method: "GET", path: "/x" }),
    ).rejects.toBe(err);
  });

  it("extracts server-supplied error message for the thrown Error message", async () => {
    const fetch = vi.fn().mockResolvedValue(
      jsonResponse(400, {
        error: { message: "bad request", code: "invalid_x" },
      }),
    );
    try {
      await request(
        { ...ctx, fetch: fetch as never },
        { method: "POST", path: "/x" },
      );
      expect.unreachable();
    } catch (err) {
      expect((err as Error).message).toBe("bad request");
    }
  });
});
