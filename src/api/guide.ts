

import { type HttpContext, request } from "../http.js";
import type { CallOptions, SingleEnvelope } from "../types.js";

export interface GuideContent {

  content: string;

  format: string;
}

export class GuideApi {
  constructor(private readonly ctx: HttpContext) {}

  async get(opts: CallOptions = {}): Promise<GuideContent> {
    const res = await request<SingleEnvelope<GuideContent>>(this.ctx, {
      method: "GET",
      path: "/api/v1/guide",
      signal: opts.signal,
    });
    return res.data;
  }
}
