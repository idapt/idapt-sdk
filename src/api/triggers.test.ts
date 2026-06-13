import { beforeEach, describe, expect, it, vi } from "vitest";
import { TriggersApi } from "./triggers.js";

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

describe("TriggersApi — CRUD", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: TriggersApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new TriggersApi(ctx as never);
  });

  it("list() returns data[]", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [{ id: "t1" }],
        pagination: { has_more: false, next_cursor: null },
      }),
    );
    const res = await api.list();
    expect(res).toEqual([{ id: "t1" }]);
  });

  it("list() forwards workspace and archive filters", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [{ id: "t-archived" }],
        pagination: { has_more: false, next_cursor: null },
      }),
    );
    await api.list({ workspace_id: "wrk_1", archived_only: true });
    const [url] = ctx.fetch.mock.calls[0];
    expect(String(url)).toContain("/api/v1/triggers?");
    expect(String(url)).toContain("workspace_id=wrk_1");
    expect(String(url)).toContain("archived_only=true");
  });

  it("create() includes workspace_id and the flat trigger fields in the body", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, {
        data: {
          id: "t-new",
          name: "t",
          enabled: true,
          workspace_id: "p-1",
          trigger_type: "schedule",
          action_type: "run_chat",
          cron_expression: "* * * * *",
          prompt_template: "summarise",
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        },
      }),
    );
    // Trigger create bodies are FLAT — no nested trigger_config /
    // action_config objects.
    await api.create("p-1", {
      name: "t",
      trigger_type: "schedule",
      action_type: "run_chat",
      cron_expression: "* * * * *",
      prompt_template: "summarise",
    });
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/triggers");
    expect(String(url)).not.toContain("workspace_id");
    const body = JSON.parse(init.body as string);
    expect(body.workspace_id).toBe("p-1");
    expect(body.name).toBe("t");
    expect(body.cron_expression).toBe("* * * * *");
    expect(body.prompt_template).toBe("summarise");
    // No nested config objects.
    expect(body.trigger_config).toBeUndefined();
    expect(body.action_config).toBeUndefined();
  });

  it("create() of a webhook trigger surfaces the one-time secret", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, {
        data: {
          id: "t-wh",
          name: "hook",
          enabled: true,
          workspace_id: "p-1",
          trigger_type: "webhook",
          action_type: "run_code",
          file_id: "fil_1",
          secret: "whk_one_time",
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        },
      }),
    );
    const created = await api.create("p-1", {
      name: "hook",
      trigger_type: "webhook",
      action_type: "run_code",
      file_id: "fil_1",
    });
    expect((created as { secret?: string }).secret).toBe("whk_one_time");
  });

  it("update() PATCHes", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, { data: { id: "t1", enabled: false } }),
    );
    await api.update("t1", { enabled: false });
    const [, init] = ctx.fetch.mock.calls[0];
    expect(init.method).toBe("PATCH");
    expect(JSON.parse(init.body as string)).toEqual({ enabled: false });
  });

  it("delete() returns deleted response", async () => {
    ctx.fetch.mockResolvedValueOnce(json(200, { deleted: true, id: "t1" }));
    const res = await api.delete("t1");
    expect(res).toEqual({ deleted: true, id: "t1" });
  });

  it("archive()/unarchive() call lifecycle routes", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, { data: { id: "t1", archived_at: "2026-01-01T00:00:00Z" } }),
    );
    const archived = await api.archive("t1");
    expect(archived.archived_at).toBe("2026-01-01T00:00:00Z");
    expect(String(ctx.fetch.mock.calls[0][0])).toBe(
      "https://api.example/api/v1/triggers/t1/archive",
    );

    ctx.fetch.mockResolvedValueOnce(
      json(200, { data: { id: "t1", archived_at: null } }),
    );
    const active = await api.unarchive("t1");
    expect(active.archived_at).toBeNull();
    expect(String(ctx.fetch.mock.calls[1][0])).toBe(
      "https://api.example/api/v1/triggers/t1/unarchive",
    );
  });
});

describe("TriggersApi — fire / rotate / runs", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: TriggersApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new TriggersApi(ctx as never);
  });

  it("fire() swaps the bearer token to the provided secret and returns id (202)", async () => {
    // The v1 contract dropped the constant `status: "fired"` — the body is
    // just `{ data: { id } }`.
    ctx.fetch.mockResolvedValueOnce(json(202, { data: { id: "t1" } }));
    const res = await api.fire("t1", {
      secret: "wh_secret",
      body: { hello: "world" },
    });
    expect(res.id).toBe("t1");
    expect(res).toEqual({ id: "t1" });
    const [, init] = ctx.fetch.mock.calls[0];
    expect(init.headers.Authorization).toBe("Bearer wh_secret");
    expect(JSON.parse(init.body as string)).toEqual({ hello: "world" });
  });

  it("fire() defaults to empty body when none provided", async () => {
    ctx.fetch.mockResolvedValueOnce(json(202, { data: { id: "t1" } }));
    await api.fire("t1", { secret: "wh_secret" });
    const [, init] = ctx.fetch.mock.calls[0];
    expect(JSON.parse(init.body as string)).toEqual({});
  });

  it("rotateSecret() returns trigger with fresh secret", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, { data: { id: "t1", secret: "sk_new" } }),
    );
    const res = await api.rotateSecret("t1");
    expect(res.secret).toBe("sk_new");
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe(
      "https://api.example/api/v1/triggers/t1/rotate-secret",
    );
    expect(init.method).toBe("POST");
  });

  it("listRuns() returns TriggerRun[]", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [
          {
            id: "tr1",
            trigger_id: "t1",
            success: true,
            fired_at: "2026-01-01T00:00:00Z",
          },
        ],
        pagination: { has_more: false, next_cursor: null },
      }),
    );
    const res = await api.listRuns("t1", { limit: 25, cursor: "ck_trun" });
    expect(res).toHaveLength(1);
    const [url] = ctx.fetch.mock.calls[0];
    expect(String(url)).toContain("/triggers/t1/runs?");
    expect(String(url)).toContain("limit=25");
    expect(String(url)).toContain("cursor=ck_trun");
  });

  it("getCostStats() returns aggregate stats", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: {
          runs_with_cost: 2,
          total_cost_usd: 0.12,
          today_cost_usd: 0.03,
          this_month_cost_usd: 0.12,
          last24h_cost_usd: 0.03,
          last7d_cost_usd: 0.08,
          first_fired_at: "2026-01-01T00:00:00Z",
        },
      }),
    );
    const res = await api.getCostStats("t1");
    expect(res.total_cost_usd).toBe(0.12);
    expect(String(ctx.fetch.mock.calls[0][0])).toBe(
      "https://api.example/api/v1/triggers/t1/cost-stats",
    );
  });

  it("getCostStatsMap() returns by-id aggregate stats", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: {
          by_id: {
            t1: {
              runs_with_cost: 1,
              total_cost_usd: 0.04,
              today_cost_usd: 0.04,
              this_month_cost_usd: 0.04,
              last24h_cost_usd: 0.04,
              last7d_cost_usd: 0.04,
              first_fired_at: null,
            },
          },
        },
      }),
    );
    const res = await api.getCostStatsMap({ workspace_id: "wrk_1" });
    expect(res.t1.total_cost_usd).toBe(0.04);
    const [url] = ctx.fetch.mock.calls[0];
    expect(String(url)).toContain("/api/v1/triggers/cost-stats?");
    expect(String(url)).toContain("workspace_id=wrk_1");
  });
});
