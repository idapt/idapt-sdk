/**
 * DocsApi — `GET /api/v1/docs`.
 *
 * Returns the computer-readable OpenAPI 3.1 spec for the v1 API. Useful for
 * tools that generate clients / validators at runtime. Most consumers of
 * this SDK don't need it — the typed wrappers cover the same surface.
 */

import { type HttpContext, request } from "../http.js";
import type { CallOptions } from "../types.js";

export class DocsApi {
  constructor(private readonly ctx: HttpContext) {}

  /**
   * Fetch the OpenAPI spec as a plain object. Shape is `OpenAPI.Document`
   * from the standard spec — typed as `Record<string, unknown>` here so
   * consumers can narrow as needed without pulling in an openapi-types
   * dependency.
   */
  async get(opts: CallOptions = {}): Promise<Record<string, unknown>> {
    return request<Record<string, unknown>>(this.ctx, {
      method: "GET",
      path: "/api/v1/docs",
      signal: opts.signal,
    });
  }
}
