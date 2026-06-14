/**
 * ModelsApi — `GET /api/v1/models`.
 *
 * Returns the catalogue of LLMs available to the authenticated user.
 * Pricing and capability fields drive the model-picker UX in any app that
 * lets users swap models.
 */

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
