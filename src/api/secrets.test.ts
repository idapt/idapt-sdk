import { beforeEach, describe, expect, it, vi } from "vitest";
import { SecretsApi } from "./secrets.js";

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

describe("SecretsApi", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: SecretsApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new SecretsApi(ctx as never);
  });

  it("list() hits /workspaces/:id/secrets", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [{ id: "s1", name: "DB_URL" }],
        pagination: { has_more: false },
      }),
    );
    const res = await api.list("p-1");
    expect(res).toEqual([{ id: "s1", name: "DB_URL" }]);
    expect(String(ctx.fetch.mock.calls[0][0])).toBe(
      "https://api.example/api/v1/workspaces/p-1/secrets",
    );
  });

  it("create() POSTs name/value/description and the snake_case expires_at", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, { data: { id: "s-new", name: "DB_URL", type: "credential" } }),
    );
    const created = await api.create("p-1", {
      name: "DB_URL",
      value: "postgres://...",
      description: "prod db",
      expires_at: "2026-12-31T00:00:00Z",
    });
    expect(created.type).toBe("credential");
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe(
      "https://api.example/api/v1/workspaces/p-1/secrets",
    );
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({
      name: "DB_URL",
      value: "postgres://...",
      description: "prod db",
      expires_at: "2026-12-31T00:00:00Z",
    });
  });

  it("get/update/delete address by nested secretId", async () => {
    ctx.fetch.mockResolvedValueOnce(json(200, { data: { id: "s1" } }));
    await api.get("p-1", "s1");
    expect(String(ctx.fetch.mock.calls[0][0])).toBe(
      "https://api.example/api/v1/workspaces/p-1/secrets/s1",
    );

    ctx.fetch.mockResolvedValueOnce(json(200, { data: { id: "s1" } }));
    await api.update("p-1", "s1", { value: "new-value" });
    expect(ctx.fetch.mock.calls[1][1].method).toBe("PATCH");
    expect(JSON.parse(ctx.fetch.mock.calls[1][1].body as string)).toEqual({
      value: "new-value",
    });

    ctx.fetch.mockResolvedValueOnce(json(200, { deleted: true, id: "s1" }));
    const r = await api.delete("p-1", "s1");
    expect(r).toEqual({ deleted: true, id: "s1" });
  });
});
