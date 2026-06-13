import { beforeEach, describe, expect, it, vi } from "vitest";
import { SharingApi } from "./sharing.js";

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

describe("SharingApi — /shares", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: SharingApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new SharingApi(ctx as never);
  });

  it("list() forwards resource_type and resource_id on the querystring", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [
          {
            resource_type: "chat",
            resource_id: "c1",
            grantee_actor_id: "u-2",
            permission: "read",
            shared_at: "2026-01-01T00:00:00Z",
          },
        ],
        pagination: { has_more: false, next_cursor: null },
      }),
    );
    const res = await api.list({ resource_type: "chat", resource_id: "c1" });
    expect(res).toHaveLength(1);
    const [url] = ctx.fetch.mock.calls[0];
    expect(String(url)).toContain("/api/v1/shares?");
    expect(String(url)).toContain("resource_type=chat");
    expect(String(url)).toContain("resource_id=c1");
  });

  it("add() POSTs the body and returns the new share", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, {
        data: {
          resource_type: "agent",
          resource_id: "a1",
          grantee_actor_id: "u-2",
          permission: "write",
          shared_at: "2026-01-01T00:00:00Z",
        },
      }),
    );
    const res = await api.add({
      resource_type: "agent",
      resource_id: "a1",
      grantee_actor_id: "u-2",
      permission: "write",
    });
    expect(res.permission).toBe("write");
    expect(ctx.fetch.mock.calls[0][1].method).toBe("POST");
  });

  it("update() PATCHes with the triple on the query and {permission} body", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: {
          resource_type: "file",
          resource_id: "f1",
          grantee_actor_id: "u-2",
          permission: "admin",
          shared_at: "2026-01-01T00:00:00Z",
        },
      }),
    );
    await api.update({
      resource_type: "file",
      resource_id: "f1",
      grantee_actor_id: "u-2",
      permission: "admin",
    });
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(init.method).toBe("PATCH");
    // The keying triple moves to the query string.
    expect(String(url)).toContain("resource_type=file");
    expect(String(url)).toContain("resource_id=f1");
    expect(String(url)).toContain("grantee_actor_id=u-2");
    // The body carries only the new permission.
    expect(JSON.parse(init.body as string)).toEqual({ permission: "admin" });
  });

  it("remove() DELETEs with the triple on the query, no body, top-level echo", async () => {
    // The DELETE response is the removed triple at the TOP LEVEL — not
    // nested under `data`.
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        deleted: true,
        resource_type: "chat",
        resource_id: "c1",
        grantee_actor_id: "u-2",
      }),
    );
    const res = await api.remove({
      resource_type: "chat",
      resource_id: "c1",
      grantee_actor_id: "u-2",
    });
    expect(res).toEqual({
      deleted: true,
      resource_type: "chat",
      resource_id: "c1",
      grantee_actor_id: "u-2",
    });
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(init.method).toBe("DELETE");
    // The triple is on the query string; the request carries no body.
    expect(String(url)).toContain("resource_type=chat");
    expect(String(url)).toContain("resource_id=c1");
    expect(String(url)).toContain("grantee_actor_id=u-2");
    expect(init.body).toBeUndefined();
  });
});

describe("SharingApi — /shared-with-me", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: SharingApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new SharingApi(ctx as never);
  });

  it("listSharedWithMe() works without any filters", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [
          { id: "c1", resource_type: "chat", permission: "read" },
          { id: "a1", resource_type: "agent", permission: "write" },
        ],
        pagination: { has_more: false, next_cursor: null },
      }),
    );
    const res = await api.listSharedWithMe();
    expect(res).toHaveLength(2);
    expect(String(ctx.fetch.mock.calls[0][0])).toBe(
      "https://api.example/api/v1/shared-with-me",
    );
  });

  it("listSharedWithMe() forwards resource_type filter + cursor paging", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [],
        pagination: { has_more: false, next_cursor: null },
      }),
    );
    await api.listSharedWithMe({
      resource_type: "file",
      limit: 25,
      cursor: "ck_swm",
    });
    const [url] = ctx.fetch.mock.calls[0];
    expect(String(url)).toContain("resource_type=file");
    expect(String(url)).toContain("limit=25");
    expect(String(url)).toContain("cursor=ck_swm");
  });
});
