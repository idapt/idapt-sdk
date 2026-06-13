import { describe, expect, it, vi } from "vitest";
import { DocsApi } from "./docs.js";

describe("DocsApi", () => {
  it("get() returns the OpenAPI spec as-is", async () => {
    const spec = {
      openapi: "3.1.0",
      info: { title: "Idapt API", version: "1.0" },
      paths: {},
    };
    const fetch = vi.fn().mockResolvedValueOnce(
      new Response(JSON.stringify(spec), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const api = new DocsApi({
      apiUrl: "https://api.example",
      key: "ap_x",
      fetch: fetch as never,
    });
    const res = await api.get();
    expect(res).toEqual(spec);
    const [url] = fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/docs");
  });
});
