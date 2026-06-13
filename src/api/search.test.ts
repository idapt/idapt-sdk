import { describe, expect, it, vi } from "vitest";
import { SearchApi } from "./search.js";

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("SearchApi", () => {
  it("search() forwards q + limit + cursor query", async () => {
    const fetch = vi.fn().mockResolvedValueOnce(
      json(200, {
        data: [{ id: "r1", type: "file", title: "match.md" }],
        pagination: { has_more: false, next_cursor: null },
      }),
    );
    const api = new SearchApi({
      apiUrl: "https://api.example",
      key: "ap_x",
      fetch: fetch as never,
    });
    const res = await api.search({
      q: "hello world",
      limit: 10,
      cursor: "ck_search",
    });
    expect(res).toHaveLength(1);
    const [url] = fetch.mock.calls[0];
    const qs = String(url).split("?")[1];
    expect(qs).toContain("q=hello+world");
    expect(qs).toContain("limit=10");
    expect(qs).toContain("cursor=ck_search");
  });
});
