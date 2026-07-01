

import { type HttpContext, request } from "../http.js";
import type { CallOptions, ListEnvelope, LLMModel } from "../types.js";

export class ModelsApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(opts: CallOptions = {}): Promise<LLMModel[]> {
    const res = await request<ListEnvelope<LLMModel>>(this.ctx, {
      method: "GET",
      path: "/api/v1/models",
      signal: opts.signal,
    });
    return res.data;
  }
}
