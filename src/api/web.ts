/**
 * WebSearchApi — `POST /api/v1/web/search`.
 *
 * External web search. Needs the elevated `web:search` permission. Apps
 * that want this must declare it in their manifest; `client.escalate()`
 * can request it at runtime.
 */

import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  SingleEnvelope,
  WebSearchResponse,
} from "../types.js";

export interface WebSearchInput {
  query: string;
  /** Min 1, max 25. Default 12. */
  num_results?: number;
}

export class WebSearchApi {
  constructor(private readonly ctx: HttpContext) {}

  async search(
    input: WebSearchInput,
    opts: CallOptions = {},
  ): Promise<WebSearchResponse> {
    const res = await request<SingleEnvelope<WebSearchResponse>>(this.ctx, {
      method: "POST",
      path: "/api/v1/web/search",
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }
}
