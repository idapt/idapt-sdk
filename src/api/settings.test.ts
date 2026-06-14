import { beforeEach, describe, expect, it, vi } from "vitest";
import { SettingsApi } from "./settings.js";

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

describe("SettingsApi", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: SettingsApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new SettingsApi(ctx as never);
  });

  it("get() hits /settings and unwraps", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: { name: "Ada", slug: "ada", is_public: true },
      }),
    );
    const res = await api.get();
    expect(res).toMatchObject({ name: "Ada", slug: "ada" });
    expect(String(ctx.fetch.mock.calls[0][0])).toBe(
      "https://api.example/api/v1/settings",
    );
  });

  it("update() PATCHes the supplied subset", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, { data: { is_auto_compact_enabled: false } }),
    );
    await api.update({ is_auto_compact_enabled: false });
    const [, init] = ctx.fetch.mock.calls[0];
    expect(init.method).toBe("PATCH");
    expect(JSON.parse(init.body as string)).toEqual({
      is_auto_compact_enabled: false,
    });
  });

  it("update() can rename slug (server runs through rename pipeline)", async () => {
    ctx.fetch.mockResolvedValueOnce(json(200, { data: { slug: "new-slug" } }));
    await api.update({ slug: "new-slug" });
    expect(JSON.parse(ctx.fetch.mock.calls[0][1].body as string)).toEqual({
      slug: "new-slug",
    });
  });
});
