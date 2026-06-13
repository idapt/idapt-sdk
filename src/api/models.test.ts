import { describe, expect, it, vi } from "vitest";
import { ModelsApi } from "./models.js";

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("ModelsApi", () => {
  it("list() hits /api/v1/models and exposes nested pricing/capabilities", async () => {
    // Model rows carry nested `pricing` / `capabilities` objects.
    const fetch = vi.fn().mockResolvedValueOnce(
      json(200, {
        data: [
          {
            id: "openai/gpt-4o",
            display_name: "GPT-4o",
            provider: "openai",
            modality: "chat",
            pricing: { input_per_million: 2.5, output_per_million: 10 },
            capabilities: {
              context_length: 128000,
              max_output_tokens: 16384,
              image_input: true,
            },
          },
        ],
        pagination: { has_more: false },
      }),
    );
    const api = new ModelsApi({
      apiUrl: "https://api.example",
      key: "ap_x",
      fetch: fetch as never,
    });
    const res = await api.list();
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe("openai/gpt-4o");
    expect(res[0].display_name).toBe("GPT-4o");
    expect(res[0].modality).toBe("chat");
    expect(res[0].pricing?.input_per_million).toBe(2.5);
    expect(res[0].capabilities.context_length).toBe(128000);
    expect(res[0].capabilities.image_input).toBe(true);
    const [url] = fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/models");
  });
});
