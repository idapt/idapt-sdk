/**
 * UserApi — identity + usage.
 *
 * `me()` is always callable (implicit `user:read` grant). `usage()` may
 * require elevated permissions depending on deployment — check the
 * manifest if you get a 403.
 */

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
  /** Opaque pagination cursor — echo `pagination.next_cursor`. */
  cursor?: string;
  /** Filter history by call type (e.g. "chat", "image"). */
  call_type?: string;
}

export class UserApi {
  constructor(private readonly ctx: HttpContext) {}

  /** Current authenticated user's profile. */
  async me(opts: CallOptions = {}): Promise<User> {
    const res = await request<SingleEnvelope<User>>(this.ctx, {
      method: "GET",
      path: "/api/v1/me",
      signal: opts.signal,
    });
    return res.data;
  }

  /**
   * Storage usage summary — bytes used / total, snapshot footprint.
   * Corresponds to `GET /me/usage?view=summary` (the default).
   */
  async usage(opts: CallOptions = {}): Promise<UsageSummary> {
    const res = await request<SingleEnvelope<UsageSummary>>(this.ctx, {
      method: "GET",
      path: "/api/v1/me/usage",
      query: { view: "summary" },
      signal: opts.signal,
    });
    return res.data;
  }

  /**
   * Paginated history of LLM / image / audio calls + cost.
   * Corresponds to `GET /me/usage?view=history`.
   */
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
