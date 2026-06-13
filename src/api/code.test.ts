import { beforeEach, describe, expect, it, vi } from "vitest";
import { CodeRunsApi } from "./code.js";

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

describe("CodeRunsApi", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: CodeRunsApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new CodeRunsApi(ctx as never);
  });

  it("run() POSTs file_id + timeout + env and returns the full ExecutionRun", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, {
        data: {
          id: "run-1",
          backend: "lambda",
          status: "completed",
          exit_code: 0,
          stdout: "hi",
          stderr: "",
          runtime: "python",
          created_at: "2026-01-01T00:00:00Z",
          completed_at: "2026-01-01T00:00:01Z",
        },
      }),
    );
    const res = await api.run({
      file_id: "f-1",
      timeout_seconds: 10,
      env: { IDAPT_API_KEY: "ap_x" },
    });
    expect(res.id).toBe("run-1");
    expect(res.status).toBe("completed");
    expect(res.exit_code).toBe(0);
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/code-runs");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string).env.IDAPT_API_KEY).toBe("ap_x");
  });

  it("list() forwards filters (backend + status enums, cursor)", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [],
        pagination: { has_more: false, next_cursor: null },
      }),
    );
    await api.list({
      backend: "lambda",
      status: "interrupted",
      limit: 5,
      cursor: "ck_code",
    });
    const [url] = ctx.fetch.mock.calls[0];
    const qs = String(url).split("?")[1];
    expect(qs).toContain("backend=lambda");
    expect(qs).toContain("status=interrupted");
    expect(qs).toContain("limit=5");
    expect(qs).toContain("cursor=ck_code");
  });

  it("get() hits /code-runs/:id", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, { data: { id: "r1", backend: "lambda", status: "completed" } }),
    );
    const res = await api.get("r1");
    expect(res.id).toBe("r1");
  });
});
