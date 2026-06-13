import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserApi } from "./user.js";

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

describe("UserApi", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: UserApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new UserApi(ctx as never);
  });

  it("me() unwraps data envelope", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: {
          id: "u-1",
          name: "Jane",
          email: "jane@example.com",
          created_at: "2026-01-01T00:00:00Z",
        },
      }),
    );
    const me = await api.me();
    expect(me.id).toBe("u-1");
    expect(me.name).toBe("Jane");
    const [url] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/me");
  });

  it("usage() forwards view=summary and returns storage info", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: {
          storage: {
            used_bytes: 1000,
            capacity_bytes: 5000,
            snapshot_bytes: 0,
          },
        },
      }),
    );
    const usage = await api.usage();
    expect(usage.storage.used_bytes).toBe(1000);
    const [url] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe(
      "https://api.example/api/v1/me/usage?view=summary",
    );
  });

  it("usageHistory() forwards view=history and additional filters", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [
          {
            id: "u-r1",
            call_type: "chat",
            input_tokens: 100,
            output_tokens: 50,
            created_at: "2026-01-01T00:00:00Z",
          },
        ],
        pagination: { has_more: false, next_cursor: null },
      }),
    );
    const records = await api.usageHistory({
      limit: 20,
      call_type: "chat",
      cursor: "ck_usage",
    });
    expect(records).toHaveLength(1);
    const [url] = ctx.fetch.mock.calls[0];
    const qs = String(url).split("?")[1];
    expect(qs).toContain("view=history");
    expect(qs).toContain("limit=20");
    expect(qs).toContain("call_type=chat");
    expect(qs).toContain("cursor=ck_usage");
  });
});
