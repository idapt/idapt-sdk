

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
