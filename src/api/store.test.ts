import { beforeEach, describe, expect, it, vi } from "vitest";
import { StoreApi } from "./store.js";

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

describe("StoreApi", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: StoreApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new StoreApi(ctx as never);
  });

  it("search() forwards q/type/sort/limit/cursor", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [{ id: "tpl-1", type: "skill", name: "ssh-helper" }],
        pagination: { has_more: false, next_cursor: null },
      }),
    );
    const res = await api.search({
      q: "ssh",
      type: "skill",
      sort: "recent",
      limit: 10,
      cursor: "ck_store",
    });
    expect(res).toHaveLength(1);
    const [url] = ctx.fetch.mock.calls[0];
    expect(String(url)).toContain("/api/v1/store/search?");
    expect(String(url)).toContain("q=ssh");
    expect(String(url)).toContain("type=skill");
    expect(String(url)).toContain("sort=recent");
    expect(String(url)).toContain("limit=10");
    expect(String(url)).toContain("cursor=ck_store");
  });

  it("search() works with no query params (default sort=popular server-side)", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [],
        pagination: { has_more: false, next_cursor: null },
      }),
    );
    await api.search();
    expect(String(ctx.fetch.mock.calls[0][0])).toBe(
      "https://api.example/api/v1/store/search",
    );
  });

  it("install() POSTs to the per-item endpoint", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, {
        data: {
          installed: true,
          folder_id: "f-new",
          resource_type: "skill",
          resource_id: "tpl-1",
        },
      }),
    );
    const res = await api.install("tpl-1", {
      workspace_id: "p-1",
      folder_name: "ssh-helper",
    });
    expect(res.installed).toBe(true);
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/store/tpl-1/install");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({
      workspace_id: "p-1",
      folder_name: "ssh-helper",
    });
  });

  it("install() forwards target_parent_id when provided", async () => {
    ctx.fetch.mockResolvedValueOnce(json(201, { data: { installed: true } }));
    await api.install("tpl-1", {
      workspace_id: "p-1",
      target_parent_id: "f-parent",
    });
    expect(JSON.parse(ctx.fetch.mock.calls[0][1].body as string)).toEqual({
      workspace_id: "p-1",
      target_parent_id: "f-parent",
    });
  });
});
