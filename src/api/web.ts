

import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  SingleEnvelope,
  WebSearchResponse,
} from "../types.js";

export interface WebSearchInput {
  query: string;

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
