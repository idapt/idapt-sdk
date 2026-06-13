import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProviderEndpointsApi } from "./provider-endpoints.js";

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

describe("ProviderEndpointsApi", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: ProviderEndpointsApi;

  beforeEach(() => {
    ctx = mkCtx();
    api = new ProviderEndpointsApi(ctx as never);
  });

  it("list() returns provider endpoint data without secrets", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [
          {
            id: "pe_1",
            provider_key: "openai",
            connection_type: "managed",
            display_name: "OpenAI",
            api_key_preview: "sk-...1234",
            enabled: true,
            default_modalities: ["text-completion"],
            supported_modalities: ["text-completion", "image-generation"],
            model_mappings: [],
          },
        ],
        pagination: { has_more: false, next_cursor: null },
      }),
    );

    const res = await api.list();
    expect(res[0].id).toBe("pe_1");
    expect(res[0]).not.toHaveProperty("api_key");
    expect(String(ctx.fetch.mock.calls[0][0])).toBe(
      "https://api.example/api/v1/provider-endpoints",
    );
  });

  it("presets() reads the stable provider catalog", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [
          {
            provider_key: "openai",
            connection_type: "managed",
            label: "OpenAI",
            description: "Use your OpenAI key.",
            supported_modalities: ["text-completion"],
            requires_api_key: true,
          },
        ],
        pagination: { has_more: false, next_cursor: null },
      }),
    );

    const res = await api.presets();
    expect(res).toHaveLength(1);
    expect(res[0].provider_key).toBe("openai");
    expect(String(ctx.fetch.mock.calls[0][0])).toBe(
      "https://api.example/api/v1/provider-endpoints/presets",
    );
  });

  it("create() sends snake_case endpoint fields", async () => {
    ctx.fetch.mockResolvedValueOnce(json(201, { data: { id: "pe_new" } }));

    await api.create({
      provider_key: "custom_openai_compatible",
      connection_type: "custom",
      display_name: "Gateway",
      api_key: "sk-provider-key",
      base_url: "https://gateway.example.test/v1",
      default_for_kind: true,
      model_mappings: [
        {
          model_id: "openai/gpt-5.4",
          api_model_id: "upstream-gpt",
        },
      ],
    });

    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/provider-endpoints");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({
      provider_key: "custom_openai_compatible",
      connection_type: "custom",
      display_name: "Gateway",
      api_key: "sk-provider-key",
      base_url: "https://gateway.example.test/v1",
      default_for_kind: true,
      model_mappings: [
        {
          model_id: "openai/gpt-5.4",
          api_model_id: "upstream-gpt",
        },
      ],
    });
  });

  it("update(), delete(), and test() hit the per-endpoint routes", async () => {
    ctx.fetch
      .mockResolvedValueOnce(
        json(200, { data: { id: "pe_1", enabled: false } }),
      )
      .mockResolvedValueOnce(json(200, { data: { ok: true, message: "OK" } }))
      .mockResolvedValueOnce(json(200, { deleted: true, id: "pe_1" }));

    await api.update("pe_1", { enabled: false });
    expect(String(ctx.fetch.mock.calls[0][0])).toBe(
      "https://api.example/api/v1/provider-endpoints/pe_1",
    );
    expect(JSON.parse(ctx.fetch.mock.calls[0][1].body as string)).toEqual({
      enabled: false,
    });

    await expect(api.test("pe_1")).resolves.toEqual({
      ok: true,
      message: "OK",
    });
    expect(String(ctx.fetch.mock.calls[1][0])).toBe(
      "https://api.example/api/v1/provider-endpoints/pe_1/test",
    );

    await expect(api.delete("pe_1")).resolves.toEqual({
      deleted: true,
      id: "pe_1",
    });
    expect(String(ctx.fetch.mock.calls[2][0])).toBe(
      "https://api.example/api/v1/provider-endpoints/pe_1",
    );
  });
});
