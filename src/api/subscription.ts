/**
 * SubscriptionApi — `/api/v1/subscription`.
 *
 * Single-read surface: the caller's current account/credit state. Idapt is
 * pay-as-you-go — there are no subscription plans, periods, or trials. The
 * payload carries the account tier (`plan` = `free` / `paid`, `is_paid`), the
 * credit `balance` (USD), and the auto top-up settings.
 *
 * Anonymous / unauthenticated callers receive the `free` view rather than a
 * 401 — the route deliberately mirrors the cookie-route behaviour so CLI/SDK
 * users that haven't signed up still get a usable answer.
 *
 * Internal correlation ids and implementation-detail fields are dropped at
 * the route boundary; they never appear on the v1 wire.
 */

import { type HttpContext, request } from "../http.js";
import type { CallOptions, SingleEnvelope, Subscription } from "../types.js";

export class SubscriptionApi {
  constructor(private readonly ctx: HttpContext) {}

  async get(opts: CallOptions = {}): Promise<Subscription> {
    const res = await request<SingleEnvelope<Subscription>>(this.ctx, {
      method: "GET",
      path: "/api/v1/subscription",
      signal: opts.signal,
    });
    return res.data;
  }
}
