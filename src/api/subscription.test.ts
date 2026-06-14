import { beforeEach, describe, expect, it, vi } from "vitest";
import { SubscriptionApi } from "./subscription.js";

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

describe("SubscriptionApi", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: SubscriptionApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new SubscriptionApi(ctx as never);
  });

  it("get() returns the unwrapped account/credit view", async () => {
    // Pay-as-you-go: the payload is the credit-account view (tier + balance +
    // auto top-up), not a subscription with periods/trials.
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: {
          plan: "paid",
          is_paid: true,
          balance: 42.5,
          auto_reload_enabled: true,
          auto_reload_amount_cents: 1000,
          auto_reload_threshold_cents: 500,
          monthly_limit_usd: 50,
        },
      }),
    );
    const res = await api.get();
    expect(res.plan).toBe("paid");
    expect(res.is_paid).toBe(true);
    expect(res.balance).toBe(42.5);
    expect(res.auto_reload_enabled).toBe(true);
    expect(String(ctx.fetch.mock.calls[0][0])).toBe(
      "https://api.example/api/v1/subscription",
    );
  });

  it("get() relays the free view for anonymous callers", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: { plan: "free", is_paid: false, balance: 0 },
      }),
    );
    const res = await api.get();
    expect(res.plan).toBe("free");
    expect(res.is_paid).toBe(false);
  });
});
