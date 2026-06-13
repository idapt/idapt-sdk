import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotificationsApi } from "./notifications.js";

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

describe("NotificationsApi — per-row", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: NotificationsApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new NotificationsApi(ctx as never);
  });

  it("list() forwards filters + cursor", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [{ id: "n1", type: "agent", title: "Done" }],
        pagination: { has_more: false, next_cursor: null },
      }),
    );
    const res = await api.list({
      unread_only: true,
      workspace_id: "p-1",
      limit: 5,
      cursor: "ck_notif",
    });
    expect(res).toEqual([{ id: "n1", type: "agent", title: "Done" }]);
    const [url] = ctx.fetch.mock.calls[0];
    expect(String(url)).toContain("unread_only=true");
    expect(String(url)).toContain("workspace_id=p-1");
    expect(String(url)).toContain("limit=5");
    expect(String(url)).toContain("cursor=ck_notif");
  });

  it("listWithMeta() exposes the top-level unread_count + next_cursor", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [{ id: "n1", type: "agent", title: "Done" }],
        pagination: { has_more: true, next_cursor: "ck_more" },
        unread_count: 3,
      }),
    );
    const res = await api.listWithMeta();
    expect(res.unread_count).toBe(3);
    expect(res.data).toHaveLength(1);
    expect(res.pagination.has_more).toBe(true);
    expect(res.pagination.next_cursor).toBe("ck_more");
  });

  it("get() returns a single notification", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, { data: { id: "n1", title: "Hi" } }),
    );
    const n = await api.get("n1");
    expect(n.id).toBe("n1");
  });

  it("markRead() is shorthand for update({is_read:true}) and returns the full notification", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: {
          id: "n1",
          type: "agent",
          title: "Done",
          is_read: true,
          read_at: "2026-01-01T00:00:00Z",
          archived_at: null,
          created_at: "2026-01-01T00:00:00Z",
        },
      }),
    );
    const n = await api.markRead("n1");
    expect(n.id).toBe("n1");
    expect(n.is_read).toBe(true);
    expect(ctx.fetch.mock.calls[0][1].method).toBe("PATCH");
    expect(JSON.parse(ctx.fetch.mock.calls[0][1].body as string)).toEqual({
      is_read: true,
    });
  });

  it("archive()/unarchive() use the same PATCH path", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: {
          id: "n1",
          type: "agent",
          title: "Done",
          is_read: false,
          archived_at: "2026-01-01T00:00:00Z",
          created_at: "2026-01-01T00:00:00Z",
        },
      }),
    );
    await api.archive("n1");
    expect(JSON.parse(ctx.fetch.mock.calls[0][1].body as string)).toEqual({
      archived: true,
    });

    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: {
          id: "n1",
          type: "agent",
          title: "Done",
          is_read: false,
          archived_at: null,
          created_at: "2026-01-01T00:00:00Z",
        },
      }),
    );
    await api.unarchive("n1");
    expect(JSON.parse(ctx.fetch.mock.calls[1][1].body as string)).toEqual({
      archived: false,
    });
  });

  it("delete() returns the deleted envelope", async () => {
    ctx.fetch.mockResolvedValueOnce(json(200, { deleted: true, id: "n1" }));
    const res = await api.delete("n1");
    expect(res).toEqual({ deleted: true, id: "n1" });
  });
});

describe("NotificationsApi — bulk + send", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: NotificationsApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new NotificationsApi(ctx as never);
  });

  it("readAll() POSTs /read-all and resolves to void (empty {data:{}})", async () => {
    // The v1 response is an empty `{ data: {} }` envelope — the SDK
    // method resolves to `void`.
    ctx.fetch.mockResolvedValueOnce(json(200, { data: {} }));
    const r = await api.readAll();
    expect(r).toBeUndefined();
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toContain("/notifications/read-all");
    expect(init.method).toBe("POST");
  });

  it("send() with an array audience maps to recipient_ids[]", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, { data: { recipientCount: 2, deduped: false } }),
    );
    await api.send({
      workspace_id: "p-1",
      title: "hi",
      audience: ["u-1", "u-2"],
    });
    const body = JSON.parse(ctx.fetch.mock.calls[0][1].body as string);
    expect(body.recipient_ids).toEqual(["u-1", "u-2"]);
    expect(body.target).toBeUndefined();
  });

  it("send() with a target string maps to target", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, { data: { recipientCount: 5, deduped: false } }),
    );
    await api.send({
      workspace_id: "p-1",
      title: "hi",
      audience: "all_members",
    });
    const body = JSON.parse(ctx.fetch.mock.calls[0][1].body as string);
    expect(body.target).toBe("all_members");
    expect(body.recipient_ids).toBeUndefined();
  });
});

describe("NotificationsApi — config + prefs", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: NotificationsApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new NotificationsApi(ctx as never);
  });

  it("getConfig() returns the flat config (no inner wrapper)", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, { data: { toasts_enabled: true } }),
    );
    const r = await api.getConfig();
    expect(r.toasts_enabled).toBe(true);
  });

  it("updateConfig() PATCHes a subset and returns the flat config", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, { data: { sound_enabled: false } }),
    );
    const r = await api.updateConfig({ sound_enabled: false });
    expect(r.sound_enabled).toBe(false);
    expect(ctx.fetch.mock.calls[0][1].method).toBe("PATCH");
    expect(JSON.parse(ctx.fetch.mock.calls[0][1].body as string)).toEqual({
      sound_enabled: false,
    });
  });

  it("getPreferences() returns the flat preference array", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [{ type: "agent", channel: "email", enabled: true }],
      }),
    );
    const r = await api.getPreferences();
    expect(r).toHaveLength(1);
    expect(r[0].channel).toBe("email");
  });

  it("updatePreferences() wraps updates[] in the body and returns the flat array", async () => {
    ctx.fetch.mockResolvedValueOnce(json(200, { data: [] }));
    const r = await api.updatePreferences([
      { type: "agent", channel: "email", enabled: false },
    ]);
    expect(r).toEqual([]);
    expect(JSON.parse(ctx.fetch.mock.calls[0][1].body as string)).toEqual({
      updates: [{ type: "agent", channel: "email", enabled: false }],
    });
  });
});
