

import { executeCommand } from "../core/execute.js";
import { COMMAND_BINDINGS } from "../generated/command-bindings.generated.js";
import type { V1Result } from "../generated/resources.generated.js";
import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  ListEnvelope,
  UsageRecord,
  UsageSummary,
} from "../types.js";

export interface ListUsageHistoryQuery {
  limit?: number;

  cursor?: string;

  call_type?: string;
}

export class UserApi {
  constructor(private readonly ctx: HttpContext) {}

  me(opts: CallOptions = {}): Promise<V1Result<"me get">> {
    return executeCommand<V1Result<"me get">>(
      COMMAND_BINDINGS["me get"],
      {},
      this.ctx,
      opts,
    );
  }

  usage(opts: CallOptions = {}): Promise<UsageSummary> {
    return executeCommand<UsageSummary>(
      COMMAND_BINDINGS["me usage"],
      { view: "summary" },
      this.ctx,
      opts,
    );
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
