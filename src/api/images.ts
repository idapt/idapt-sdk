

import { type HttpContext, request } from "../http.js";
import type { CallOptions, ImageModel, ListEnvelope } from "../types.js";

export class ImagesApi {
  constructor(private readonly ctx: HttpContext) {}

  async listModels(opts: CallOptions = {}): Promise<ImageModel[]> {
    const res = await request<ListEnvelope<ImageModel>>(this.ctx, {
      method: "GET",
      path: "/api/v1/images/models",
      signal: opts.signal,
    });
    return res.data;
  }
}
