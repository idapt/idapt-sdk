import { describe, expect, it, vi } from "vitest";
import { SkillApi } from "./skill.js";

describe("SkillApi", () => {
  it("get() unwraps the {content, format} JSON envelope", async () => {
    const fetch = vi.fn().mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: { content: "# SKILL.md contents\n", format: "markdown" },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );
    const api = new SkillApi({
      apiUrl: "https://api.example",
      key: "ap_x",
      fetch: fetch as never,
    });
    const res = await api.get();
    expect(res.content).toBe("# SKILL.md contents\n");
    expect(res.format).toBe("markdown");
    const [url] = fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/skill");
  });
});
