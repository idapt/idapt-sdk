import { beforeEach, describe, expect, it, vi } from "vitest";
import { AgentsApi } from "./agents.js";

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

describe("AgentsApi", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: AgentsApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new AgentsApi(ctx as never);
  });

  it("list() hits /api/v1/agents and returns data[]", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [{ id: "a1", name: "A" }],
        pagination: { has_more: false, next_cursor: null },
      }),
    );
    const res = await api.list();
    expect(res).toEqual([{ id: "a1", name: "A" }]);
    const [url] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/agents");
  });

  it("list() forwards workspace_id + limit + cursor query", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [],
        pagination: { has_more: false, next_cursor: null },
      }),
    );
    await api.list({ workspace_id: "p-1", limit: 20, cursor: "ck_agent" });
    const [url] = ctx.fetch.mock.calls[0];
    expect(String(url)).toContain("workspace_id=p-1");
    expect(String(url)).toContain("limit=20");
    expect(String(url)).toContain("cursor=ck_agent");
  });

  it("create() POSTs the input and returns the agent", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, { data: { id: "a-new", name: "New" } }),
    );
    const res = await api.create({ name: "New", icon: "emoji/🤖" });
    expect(res).toEqual({ id: "a-new", name: "New" });
    const [, init] = ctx.fetch.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({
      name: "New",
      icon: "emoji/🤖",
    });
  });

  it("get() hits /agents/:id", async () => {
    ctx.fetch.mockResolvedValueOnce(json(200, { data: { id: "a1" } }));
    const res = await api.get("a1");
    expect(res).toEqual({ id: "a1" });
    const [url] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/agents/a1");
  });

  it("update() PATCHes with body", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, { data: { id: "a1", name: "Renamed" } }),
    );
    await api.update("a1", { name: "Renamed" });
    const [, init] = ctx.fetch.mock.calls[0];
    expect(init.method).toBe("PATCH");
    expect(JSON.parse(init.body as string)).toEqual({ name: "Renamed" });
  });

  it("delete() returns the deleted response", async () => {
    ctx.fetch.mockResolvedValueOnce(json(200, { deleted: true, id: "a1" }));
    const res = await api.delete("a1");
    expect(res).toEqual({ deleted: true, id: "a1" });
    const [, init] = ctx.fetch.mock.calls[0];
    expect(init.method).toBe("DELETE");
  });

  it("archive/unarchive/restore return the updated agent", async () => {
    ctx.fetch
      .mockResolvedValueOnce(
        json(200, { data: { id: "a1", archived_at: "2026-01-01T00:00:00Z" } }),
      )
      .mockResolvedValueOnce(json(200, { data: { id: "a1" } }))
      .mockResolvedValueOnce(json(200, { data: { id: "a1" } }));

    await expect(api.archive("a1")).resolves.toEqual({
      id: "a1",
      archived_at: "2026-01-01T00:00:00Z",
    });
    await expect(api.unarchive("a1")).resolves.toEqual({ id: "a1" });
    await expect(api.restore("a1")).resolves.toEqual({ id: "a1" });

    expect(String(ctx.fetch.mock.calls[0]?.[0])).toBe(
      "https://api.example/api/v1/agents/a1/archive",
    );
    expect(String(ctx.fetch.mock.calls[1]?.[0])).toBe(
      "https://api.example/api/v1/agents/a1/unarchive",
    );
    expect(String(ctx.fetch.mock.calls[2]?.[0])).toBe(
      "https://api.example/api/v1/agents/a1/restore",
    );
  });

  it("permanentDelete() hits the hard-delete action endpoint", async () => {
    ctx.fetch.mockResolvedValueOnce(json(200, { deleted: true, id: "a1" }));
    const res = await api.permanentDelete("a1");
    expect(res).toEqual({ deleted: true, id: "a1" });
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe(
      "https://api.example/api/v1/agents/a1/permanent-delete",
    );
    expect(init.method).toBe("DELETE");
  });

  it("move() and copyToWorkspace() POST workspace_id", async () => {
    ctx.fetch
      .mockResolvedValueOnce(json(200, { data: { id: "a1" } }))
      .mockResolvedValueOnce(json(201, { data: { id: "a2" } }));

    await api.move("a1", { workspace_id: "w2" });
    await api.copyToWorkspace("a1", { workspace_id: "w2" });

    expect(String(ctx.fetch.mock.calls[0]?.[0])).toBe(
      "https://api.example/api/v1/agents/a1/move",
    );
    expect(
      JSON.parse((ctx.fetch.mock.calls[0]?.[1] as RequestInit).body as string),
    ).toEqual({ workspace_id: "w2" });
    expect(String(ctx.fetch.mock.calls[1]?.[0])).toBe(
      "https://api.example/api/v1/agents/a1/copy-to-workspace",
    );
    expect(
      JSON.parse((ctx.fetch.mock.calls[1]?.[1] as RequestInit).body as string),
    ).toEqual({ workspace_id: "w2" });
  });
});
