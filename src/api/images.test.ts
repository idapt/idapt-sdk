import { beforeEach, describe, expect, it, vi } from "vitest";
import { ImagesApi } from "./images.js";

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

describe("ImagesApi", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: ImagesApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new ImagesApi(ctx as never);
  });

  it("listModels() returns data[] with nested pricing/capabilities", async () => {
    // Image models carry `pricing: {per_image}` and a `capabilities`
    // object.
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [
          {
            id: "dalle-3",
            display_name: "DALL·E 3",
            provider: "openai",
            modality: "image",
            pricing: { per_image: 0.04 },
            capabilities: { sizes: ["1024x1024"] },
            paid: true,
            required_tier: "basic",
            locked: false,
          },
        ],
        pagination: { has_more: false },
      }),
    );
    const res = await api.listModels();
    expect(res[0].id).toBe("dalle-3");
    expect(res[0].modality).toBe("image");
    expect(res[0].pricing.per_image).toBe(0.04);
    expect(res[0].required_tier).toBe("basic");
    expect(res[0].locked).toBe(false);
  });

  it("generate() POSTs the input", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: {
          path: "images/out.png",
          file_id: "f-new",
          url: "https://signed.example/x",
          model: "dalle-3",
          cost_usd: 0.04,
        },
      }),
    );
    const res = await api.generate({
      prompt: "a cat",
      workspace_id: "p-1",
      aspect_ratio: "1:1",
    });
    expect(res.file_id).toBe("f-new");
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/images/generations");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({
      prompt: "a cat",
      workspace_id: "p-1",
      aspect_ratio: "1:1",
    });
  });
});
