

import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  ListEnvelope,
  SingleEnvelope,
  UsageRecord,
  UsageSummary,
  User,
} from "../types.js";

export interface ListUsageHistoryQuery {
  limit?: number;

  cursor?: string;

  call_type?: string;
}

export class UserApi {
  constructor(private readonly ctx: HttpContext) {}

  async me(opts: CallOptions = {}): Promise<User> {
    const res = await request<SingleEnvelope<User>>(this.ctx, {
      method: "GET",
      path: "/api/v1/me",
      signal: opts.signal,
    });
    return res.data;
  }

  async usage(opts: CallOptions = {}): Promise<UsageSummary> {
    const res = await request<SingleEnvelope<UsageSummary>>(this.ctx, {
      method: "GET",
      path: "/api/v1/me/usage",
      query: { view: "summary" },
      signal: opts.signal,
    });
    return res.data;
  }

  async usageHistory(
    query: ListUsageHistoryQuery = {},
    opts: CallOptions = {},
  ): Promise<UsageRecord[]> {
    const res = await request<ListEnvelope<UsageRecord>>(this.ctx, {
      method: "GET",
      path: "/api/v1/me/usage",
      query: { view: "history", ...query },
      signal: opts.signal,
    });
    return res.data;
  }
}
