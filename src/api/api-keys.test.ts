import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiKeysApi } from "./api-keys.js";

function mkCtx() {
  return {
    apiUrl: "https://api.example",
    key: "ap_x",
    fetch: vi.fn(),
  };
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("ApiKeysApi", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: ApiKeysApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new ApiKeysApi(ctx as never);
  });

  it("list() hits /api-keys and returns data[]", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [{ id: "k1", name: "ci" }],
        pagination: { has_more: false, next_cursor: null },
      }),
    );
    const res = await api.list();
    expect(res).toEqual([{ id: "k1", name: "ci" }]);
    expect(String(ctx.fetch.mock.calls[0][0])).toBe(
      "https://api.example/api/v1/api-keys",
    );
  });

  it("list() forwards limit/cursor", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [],
        pagination: { has_more: false, next_cursor: null },
      }),
    );
    await api.list({ limit: 10, cursor: "ck_abc" });
    const [url] = ctx.fetch.mock.calls[0];
    expect(String(url)).toContain("limit=10");
    expect(String(url)).toContain("cursor=ck_abc");
  });

  it("create() returns the plaintext key once", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, {
        data: {
          id: "k-new",
          name: "ci",
          prefix: "uk_",
          enabled: true,
          created_at: "2026-01-01T00:00:00Z",
          key: "uk_PLAINTEXT_VALUE",
        },
      }),
    );
    const res = await api.create({
      name: "ci",
      permissions: [{ resource: "*", access: "read" }],
    });
    expect(res.key).toBe("uk_PLAINTEXT_VALUE");
    expect(JSON.parse(ctx.fetch.mock.calls[0][1].body as string)).toEqual({
      name: "ci",
      permissions: [{ resource: "*", access: "read" }],
    });
  });

  it("create() accepts expires_in=0 (never-expire on Max tier)", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, { data: { id: "k-new", name: "perm", key: "uk_x" } }),
    );
    await api.create({ name: "perm", expires_in: 0 });
    expect(JSON.parse(ctx.fetch.mock.calls[0][1].body as string)).toEqual({
      name: "perm",
      expires_in: 0,
    });
  });

  it("update() PATCHes permissions/enabled", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, { data: { id: "k1", enabled: false } }),
    );
    await api.update("k1", { enabled: false });
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/api-keys/k1");
    expect(init.method).toBe("PATCH");
    expect(JSON.parse(init.body as string)).toEqual({ enabled: false });
  });

  it("delete() revokes the key", async () => {
    ctx.fetch.mockResolvedValueOnce(json(200, { deleted: true, id: "k1" }));
    const res = await api.delete("k1");
    expect(res).toEqual({ deleted: true, id: "k1" });
    expect(ctx.fetch.mock.calls[0][1].method).toBe("DELETE");
  });

  it("rotate() returns replacement plaintext once", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, {
        data: {
          id: "k2",
          name: "ci",
          key: "uk_REPLACEMENT",
          old_key_preview: "uk_oldprev",
          grace_period_expires_at: "2026-01-01T01:00:00Z",
        },
      }),
    );

    const res = await api.rotate("k1", { grace_period_seconds: 3600 });

    expect(res.key).toBe("uk_REPLACEMENT");
    expect(res.old_key_preview).toBe("uk_oldprev");
    expect(String(ctx.fetch.mock.calls[0][0])).toBe(
      "https://api.example/api/v1/api-keys/k1/rotate",
    );
    expect(ctx.fetch.mock.calls[0][1].method).toBe("POST");
    expect(JSON.parse(ctx.fetch.mock.calls[0][1].body as string)).toEqual({
      grace_period_seconds: 3600,
    });
  });
});
