import { beforeEach, describe, expect, it, vi } from "vitest";
import { WorkspacesApi } from "./workspaces.js";

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

describe("WorkspacesApi — CRUD", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: WorkspacesApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new WorkspacesApi(ctx as never);
  });

  it("list()/get()/create()/update()/delete() hit the right URLs", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [{ id: "p1" }],
        pagination: { has_more: false },
      }),
    );
    await api.list();
    expect(String(ctx.fetch.mock.calls[0][0])).toBe(
      "https://api.example/api/v1/workspaces",
    );

    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [{ id: "p-archived" }],
        pagination: { has_more: false },
      }),
    );
    await api.list({ archived_only: true });
    expect(String(ctx.fetch.mock.calls[1][0])).toBe(
      "https://api.example/api/v1/workspaces?archived_only=true",
    );

    ctx.fetch.mockResolvedValueOnce(
      json(201, { data: { id: "p-new", name: "X", slug: "x" } }),
    );
    await api.create({ name: "X", slug: "x" });
    expect(ctx.fetch.mock.calls[2][1].method).toBe("POST");

    ctx.fetch.mockResolvedValueOnce(json(200, { data: { id: "p1" } }));
    await api.get("p1");
    expect(String(ctx.fetch.mock.calls[3][0])).toBe(
      "https://api.example/api/v1/workspaces/p1",
    );

    ctx.fetch.mockResolvedValueOnce(json(200, { data: { id: "p1" } }));
    await api.update("p1", { name: "N" });
    expect(ctx.fetch.mock.calls[4][1].method).toBe("PATCH");

    ctx.fetch.mockResolvedValueOnce(json(200, { deleted: true, id: "p1" }));
    const res = await api.delete("p1");
    expect(res).toEqual({ deleted: true, id: "p1" });
  });

  it("update() accepts a slug rename", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, { data: { id: "p1", slug: "renamed" } }),
    );
    await api.update("p1", { slug: "renamed" });
    const [, init] = ctx.fetch.mock.calls[0];
    expect(init.method).toBe("PATCH");
    expect(JSON.parse(init.body as string)).toEqual({ slug: "renamed" });
  });

  it("archive()/unarchive() call the v1 lifecycle actions", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, { data: { id: "p1", archived_at: "2026-01-01T00:00:00Z" } }),
    );
    const archived = await api.archive("p1");
    expect(archived.archived_at).toBe("2026-01-01T00:00:00Z");
    expect(String(ctx.fetch.mock.calls[0][0])).toBe(
      "https://api.example/api/v1/workspaces/p1/archive",
    );
    expect(ctx.fetch.mock.calls[0][1].method).toBe("POST");

    ctx.fetch.mockResolvedValueOnce(
      json(200, { data: { id: "p1", archived_at: null } }),
    );
    const unarchived = await api.unarchive("p1");
    expect(unarchived.archived_at).toBeNull();
    expect(String(ctx.fetch.mock.calls[1][0])).toBe(
      "https://api.example/api/v1/workspaces/p1/unarchive",
    );
    expect(ctx.fetch.mock.calls[1][1].method).toBe("POST");
  });
});

describe("WorkspacesApi — members", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: WorkspacesApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new WorkspacesApi(ctx as never);
  });

  it("listMembers() hits /workspaces/:id/members", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [{ id: "m1" }],
        pagination: { has_more: false },
      }),
    );
    await api.listMembers("p1");
    expect(String(ctx.fetch.mock.calls[0][0])).toBe(
      "https://api.example/api/v1/workspaces/p1/members",
    );
  });

  it("addMember() POSTs body", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, { data: { id: "m-new", role: "editor" } }),
    );
    await api.addMember("p1", { actor_id: "a-1", role: "editor" });
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe(
      "https://api.example/api/v1/workspaces/p1/members",
    );
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({
      actor_id: "a-1",
      role: "editor",
    });
  });

  it("updateMember() PATCHes by memberId", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, { data: { id: "m-1", role: "admin" } }),
    );
    await api.updateMember("p1", "m-1", { role: "admin" });
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe(
      "https://api.example/api/v1/workspaces/p1/members/m-1",
    );
    expect(init.method).toBe("PATCH");
  });

  it("removeMember() DELETEs by memberId", async () => {
    ctx.fetch.mockResolvedValueOnce(json(200, { deleted: true, id: "m-1" }));
    const res = await api.removeMember("p1", "m-1");
    expect(res).toEqual({ deleted: true, id: "m-1" });
  });
});

describe("WorkspacesApi — invitations", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: WorkspacesApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new WorkspacesApi(ctx as never);
  });

  it("listInvitations() hits /workspaces/:id/invitations (rows keyed by invitee_slug)", async () => {
    // Invitations have no `id` — they are keyed by `invitee_slug`.
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [
          {
            status: "pending",
            invitee_slug: "alice",
            role: "viewer",
            created_at: "2026-01-01T00:00:00Z",
          },
        ],
        pagination: { has_more: false },
      }),
    );
    const res = await api.listInvitations("p1");
    expect(res).toHaveLength(1);
    expect(res[0].invitee_slug).toBe("alice");
    expect(String(ctx.fetch.mock.calls[0][0])).toBe(
      "https://api.example/api/v1/workspaces/p1/invitations",
    );
  });

  it("createInvitation() POSTs slug + default role=viewer, returns invitee_slug-keyed result", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, {
        data: { invitee_slug: "alice", role: "viewer", status: "pending" },
      }),
    );
    const result = await api.createInvitation("p1", { slug: "alice" });
    expect(result.invitee_slug).toBe("alice");
    expect("invitationId" in result).toBe(false);
    expect(JSON.parse(ctx.fetch.mock.calls[0][1].body as string)).toEqual({
      slug: "alice",
      role: "viewer",
    });
  });

  it("createInvitation() forwards an explicit role", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, {
        data: { invitee_slug: "bob", role: "editor", status: "pending" },
      }),
    );
    await api.createInvitation("p1", { slug: "bob", role: "editor" });
    expect(JSON.parse(ctx.fetch.mock.calls[0][1].body as string)).toEqual({
      slug: "bob",
      role: "editor",
    });
  });

  it("deleteInvitation() DELETEs with invitee_slug on the query, returns top-level {deleted,id}", async () => {
    ctx.fetch.mockResolvedValueOnce(json(200, { deleted: true, id: "p1" }));
    const res = await api.deleteInvitation("p1", "alice");
    expect(res).toEqual({ deleted: true, id: "p1" });
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(init.method).toBe("DELETE");
    expect(String(url)).toContain("/api/v1/workspaces/p1/invitations?");
    expect(String(url)).toContain("invitee_slug=alice");
  });
});
