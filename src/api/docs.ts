

import { type HttpContext, request } from "../http.js";
import type { CallOptions } from "../types.js";

export class DocsApi {
  constructor(private readonly ctx: HttpContext) {}

  async get(opts: CallOptions = {}): Promise<Record<string, unknown>> {
    return request<Record<string, unknown>>(this.ctx, {
      method: "GET",
      path: "/api/v1/docs",
      signal: opts.signal,
    });
  }
}
