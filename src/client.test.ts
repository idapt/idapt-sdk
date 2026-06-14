import { describe, expect, it, vi } from "vitest";
import { IdaptClient } from "./client.js";
import { connect, Idapt } from "./connect.js";

/** A `fetch` mock returning a JSON body with the given status. */
function mockFetch(body: unknown, status = 200) {
  return vi.fn(
    async () =>
      new Response(JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json" },
      }),
  );
}

const V1_SURFACES = [
  "user",
  "files",
  "agents",
  "chats",
  "workspaces",
  "triggers",
  "computers",
  "secrets",
  "apiKeys",
  "notifications",
  "settings",
  "subscription",
  "sharing",
  "store",
  "models",
  "providerEndpoints",
  "images",
  "audio",
  "code",
  "search",
  "web",
  "skill",
  "docs",
] as const;

describe("IdaptClient (generic bearer client)", () => {
  it("connect() builds a client with every v1 surface wired", async () => {
    const client = await connect({
      apiUrl: "https://idapt.ai",
      key: "uk_test",
      fetch: mockFetch({}) as unknown as typeof fetch,
    });
    expect(client).toBeInstanceOf(IdaptClient);
    expect(client.getApiUrl()).toBe("https://idapt.ai");
    expect(client.getApiKey()).toBe("uk_test");
    for (const surface of V1_SURFACES) {
      expect(client[surface], `surface ${surface}`).toBeDefined();
    }
    // Idapt.connect is the same entry point.
    expect(Idapt.connect).toBe(connect);
  });

  it("connect() requires apiUrl and key", async () => {
    await expect(connect({ apiUrl: "", key: "k" })).rejects.toThrow(/apiUrl/);
    await expect(
      connect({ apiUrl: "https://idapt.ai", key: "" }),
    ).rejects.toThrow(/key/);
  });

  it("getAuthToken() mints via /api/auth/token with the bearer key", async () => {
    const fetch = mockFetch({ token: "jwt_minted" });
    const client = await connect({
      apiUrl: "https://idapt.ai",
      key: "uk_secret",
      fetch: fetch as unknown as typeof fetch,
    });
    const token = await client.getAuthToken();
    expect(token).toBe("jwt_minted");
    expect(fetch).toHaveBeenCalledOnce();
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect(String(url)).toContain("/api/auth/token");
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer uk_secret",
    );
  });
});
