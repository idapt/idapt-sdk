import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChatsApi } from "./chats.js";

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

describe("ChatsApi — CRUD", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: ChatsApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new ChatsApi(ctx as never);
  });

  it("list() forwards pagination + filters", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [{ id: "c1" }],
        pagination: { has_more: false, next_cursor: null },
      }),
    );
    await api.list({ limit: 10, cursor: "ck_xyz", agent_id: "ag-1" });
    const [url] = ctx.fetch.mock.calls[0];
    const qs = String(url).split("?")[1];
    expect(qs).toContain("limit=10");
    expect(qs).toContain("cursor=ck_xyz");
    expect(qs).toContain("agent_id=ag-1");
  });

  it("create() POSTs to /chats with default model when supplied", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, {
        data: {
          id: "c-new",
          title: "Hi",
          default_model: "openai/gpt-4o-mini",
        },
      }),
    );
    const res = await api.create({
      title: "Hi",
      default_model: "openai/gpt-4o-mini",
    });
    expect(res).toEqual({
      id: "c-new",
      title: "Hi",
      default_model: "openai/gpt-4o-mini",
    });
    expect(JSON.parse(ctx.fetch.mock.calls[0][1].body as string)).toEqual({
      title: "Hi",
      default_model: "openai/gpt-4o-mini",
    });
  });

  it("get() hits /chats/:id", async () => {
    ctx.fetch.mockResolvedValueOnce(json(200, { data: { id: "c1" } }));
    await api.get("c1");
    const [url] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/chats/c1");
  });

  it("update() PATCHes default_model changes", async () => {
    ctx.fetch.mockResolvedValueOnce(json(200, { data: { id: "c1" } }));
    await api.update("c1", { title: "T", default_model: null });
    const [, init] = ctx.fetch.mock.calls[0];
    expect(init.method).toBe("PATCH");
    expect(JSON.parse(init.body as string)).toEqual({
      title: "T",
      default_model: null,
    });
  });

  it("delete() issues DELETE", async () => {
    ctx.fetch.mockResolvedValueOnce(json(200, { deleted: true, id: "c1" }));
    const res = await api.delete("c1");
    expect(res).toEqual({ deleted: true, id: "c1" });
  });

  it("lifecycle methods hit archive, restore, stop, and permanent-delete", async () => {
    ctx.fetch
      .mockResolvedValueOnce(
        json(200, { data: { id: "c1", archived_at: "2026-01-01T00:00:00Z" } }),
      )
      .mockResolvedValueOnce(
        json(200, { data: { id: "c1", archived_at: null } }),
      )
      .mockResolvedValueOnce(
        json(200, { data: { id: "c1", is_trashed: false } }),
      )
      .mockResolvedValueOnce(
        json(200, { data: { id: "c1", run_active: true } }),
      )
      .mockResolvedValueOnce(json(200, { deleted: true, id: "c1" }));

    await expect(api.archive("c1")).resolves.toMatchObject({
      archived_at: "2026-01-01T00:00:00Z",
    });
    await expect(api.unarchive("c1")).resolves.toMatchObject({
      archived_at: null,
    });
    await expect(api.restore("c1")).resolves.toMatchObject({
      is_trashed: false,
    });
    await expect(api.stop("c1", { mode: "hard" })).resolves.toMatchObject({
      run_active: true,
    });
    await expect(api.permanentDelete("c1")).resolves.toEqual({
      deleted: true,
      id: "c1",
    });

    expect(ctx.fetch.mock.calls.map(([url]) => String(url))).toEqual([
      "https://api.example/api/v1/chats/c1/archive",
      "https://api.example/api/v1/chats/c1/unarchive",
      "https://api.example/api/v1/chats/c1/restore",
      "https://api.example/api/v1/chats/c1/stop",
      "https://api.example/api/v1/chats/c1/permanent-delete",
    ]);
    expect(JSON.parse(ctx.fetch.mock.calls[3][1].body as string)).toEqual({
      mode: "hard",
    });
    expect(ctx.fetch.mock.calls[4][1].method).toBe("DELETE");
  });
});

describe("ChatsApi — sub-resources", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: ChatsApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new ChatsApi(ctx as never);
  });

  it("cost() returns the cost envelope", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: {
          total_cost_usd: 0.02,
          total_input_tokens: 100,
          total_output_tokens: 50,
          total_cached_tokens: 0,
        },
      }),
    );
    const res = await api.cost("c1");
    expect(res.total_cost_usd).toBe(0.02);
    const [url] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/chats/c1/cost");
  });

  it("messageCosts() returns resourceId-keyed maps", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: {
          by_message: {
            msg1: [
              {
                cost_usd: 0.01,
                input_tokens: 10,
                output_tokens: 20,
                cached_tokens: 0,
                call_type: "chat",
                is_estimated: false,
                duration_seconds: 1.2,
              },
            ],
          },
          by_run: {
            run1: {
              total_cost_usd: 0.01,
              total_input_tokens: 10,
              total_output_tokens: 20,
              total_cached_tokens: 0,
              duration_seconds: 1.2,
              state: "completed",
            },
          },
        },
      }),
    );
    const res = await api.messageCosts("c1");
    expect(res.by_message.msg1[0]?.call_type).toBe("chat");
    expect(res.by_run.run1?.total_cost_usd).toBe(0.01);
    const [url] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe(
      "https://api.example/api/v1/chats/c1/message-costs",
    );
  });

  it("export() returns a Blob and forwards the format query", async () => {
    ctx.fetch.mockResolvedValueOnce(
      new Response("# Chat", {
        status: 200,
        headers: { "Content-Type": "text/markdown" },
      }),
    );
    const res = await api.export("c1", { format: "markdown" });
    expect(res).toBeInstanceOf(Blob);
    expect(await res.text()).toBe("# Chat");
    const [url] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe(
      "https://api.example/api/v1/chats/c1/export?format=markdown",
    );
  });

  it("copy and fork methods POST to stable v1 routes", async () => {
    ctx.fetch
      .mockResolvedValueOnce(json(201, { data: { id: "c-agent" } }))
      .mockResolvedValueOnce(json(201, { data: { id: "c-workspace" } }))
      .mockResolvedValueOnce(json(201, { data: { id: "c-fork" } }));

    await expect(
      api.copyToAgent("c1", { agent_id: "ag1" }),
    ).resolves.toMatchObject({ id: "c-agent" });
    await expect(
      api.copyToWorkspace("c1", { workspace_id: "ws1", agent_id: "ag2" }),
    ).resolves.toMatchObject({ id: "c-workspace" });
    await expect(api.forkToWorkspace("c1")).resolves.toMatchObject({
      id: "c-fork",
    });

    expect(ctx.fetch.mock.calls.map(([url]) => String(url))).toEqual([
      "https://api.example/api/v1/chats/c1/copy-to-agent",
      "https://api.example/api/v1/chats/c1/copy-to-workspace",
      "https://api.example/api/v1/chats/c1/fork-to-workspace",
    ]);
    expect(JSON.parse(ctx.fetch.mock.calls[0][1].body as string)).toEqual({
      agent_id: "ag1",
    });
    expect(JSON.parse(ctx.fetch.mock.calls[1][1].body as string)).toEqual({
      workspace_id: "ws1",
      agent_id: "ag2",
    });
  });

  it("listMessages() returns data[] and forwards the cursor", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [{ id: "m1" }],
        pagination: { has_more: true, next_cursor: "ck_next" },
      }),
    );
    const res = await api.listMessages("c1", { limit: 5, cursor: "ck_prev" });
    expect(res).toEqual([{ id: "m1" }]);
    const [url] = ctx.fetch.mock.calls[0];
    expect(String(url)).toContain("/chats/c1/messages?");
    const qs = String(url).split("?")[1];
    expect(qs).toContain("limit=5");
    expect(qs).toContain("cursor=ck_prev");
  });

  it("sendMessage() returns the pending variant keyed by pending_token", async () => {
    // `pending_token` is an opaque workflow handle, not a resourceId.
    ctx.fetch.mockResolvedValueOnce(
      json(201, {
        status: "pending",
        pending_token: "pndtok_abc",
        chat_id: "c1",
      }),
    );
    const res = await api.sendMessage("c1", {
      content: "hi",
      wait: false,
    });
    expect(res).toEqual({
      status: "pending",
      pending_token: "pndtok_abc",
      chat_id: "c1",
    });
    if (res.status === "pending") {
      expect(res.pending_token).toBe("pndtok_abc");
    }
    const [, init] = ctx.fetch.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({
      content: "hi",
      wait: false,
    });
  });

  it("sendMessage() forwards idempotency_key when supplied", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, {
        status: "pending",
        pending_token: "pndtok_xyz",
        chat_id: "c1",
      }),
    );
    await api.sendMessage("c1", {
      content: "hi",
      wait: false,
      idempotency_key: "idem-123",
    });
    expect(JSON.parse(ctx.fetch.mock.calls[0][1].body as string)).toEqual({
      content: "hi",
      wait: false,
      idempotency_key: "idem-123",
    });
  });

  it("sendMessage() returns the completed variant with a single message", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, {
        status: "completed",
        chat_id: "c1",
        model_id: "openai/gpt-5",
        user_message_id: "msg_user",
        message: {
          id: "msg_asst",
          role: "assistant",
          content: "hello",
          created_at: "2026-01-01T00:00:00Z",
        },
      }),
    );
    const res = await api.sendMessage("c1", { content: "hi" });
    expect(res.status).toBe("completed");
    if (res.status === "completed") {
      expect(res.chat_id).toBe("c1");
      expect(res.model_id).toBe("openai/gpt-5");
      expect(res.user_message_id).toBe("msg_user");
      expect(res.message.content).toBe("hello");
    }
  });

  it("listRuns() forwards the state filter + cursor", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [],
        pagination: { has_more: false, next_cursor: null },
      }),
    );
    await api.listRuns("c1", { state: "streaming", cursor: "ck_run" });
    const [url] = ctx.fetch.mock.calls[0];
    expect(String(url)).toContain("state=streaming");
    expect(String(url)).toContain("cursor=ck_run");
  });
});

describe("ChatsApi — repromptMessage", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: ChatsApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new ChatsApi(ctx as never);
  });

  it("repromptMessage() POSTs to /chats/:id/messages/:mid/reprompt and unwraps", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, {
        data: {
          status: "completed",
          chat_id: "c1",
          reprompted_message_id: "m1",
          model_id: "openai/gpt-5",
          message: {
            id: "m2",
            role: "assistant",
            content: "regenerated",
            created_at: "2026-01-01T00:00:00Z",
          },
        },
      }),
    );
    const res = await api.repromptMessage("c1", "m1");
    expect(res.status).toBe("completed");
    if (res.status === "completed") {
      expect(res.reprompted_message_id).toBe("m1");
      expect(res.model_id).toBe("openai/gpt-5");
      expect(res.message?.content).toBe("regenerated");
    }
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe(
      "https://api.example/api/v1/chats/c1/messages/m1/reprompt",
    );
    expect(init.method).toBe("POST");
  });

  it("repromptMessage() returns the pending variant when wait=false", async () => {
    // The async reprompt status is `"pending"` (was `"queued"`).
    ctx.fetch.mockResolvedValueOnce(
      json(201, {
        data: {
          status: "pending",
          chat_id: "c1",
          reprompted_message_id: "m1",
        },
      }),
    );
    const res = await api.repromptMessage("c1", "m1", { wait: false });
    expect(res.status).toBe("pending");
    expect(JSON.parse(ctx.fetch.mock.calls[0][1].body as string)).toEqual({
      wait: false,
    });
  });

  it("repromptMessage() forwards model_id + effort_level + cost_level", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, {
        data: {
          status: "completed",
          chat_id: "c1",
          reprompted_message_id: "m1",
          model_id: "auto",
          message: null,
        },
      }),
    );
    await api.repromptMessage("c1", "m1", {
      model_id: "auto",
      effort_level: "smart",
      cost_level: 50,
    });
    expect(JSON.parse(ctx.fetch.mock.calls[0][1].body as string)).toEqual({
      model_id: "auto",
      effort_level: "smart",
      cost_level: 50,
    });
  });
});
