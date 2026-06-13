import { describe, expect, it, vi } from "vitest";
import { WebSearchApi } from "./web.js";

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("WebSearchApi", () => {
  it("search() POSTs body and unwraps data envelope", async () => {
    const fetch = vi.fn().mockResolvedValueOnce(
      json(200, {
        data: {
          query: "typescript",
          results: [{ title: "TS Handbook", url: "https://ts.example" }],
        },
      }),
    );
    const api = new WebSearchApi({
      apiUrl: "https://api.example",
      key: "ap_x",
      fetch: fetch as never,
    });
    const res = await api.search({ query: "typescript", num_results: 5 });
    expect(res.query).toBe("typescript");
    expect(res.results).toHaveLength(1);
    const [url, init] = fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/web/search");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({
      query: "typescript",
      num_results: 5,
    });
  });
});
