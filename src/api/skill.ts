

import { type HttpContext, request } from "../http.js";
import type { CallOptions, SingleEnvelope } from "../types.js";

export interface SkillContent {

  content: string;

  format: string;
}

export class SkillApi {
  constructor(private readonly ctx: HttpContext) {}

  async get(opts: CallOptions = {}): Promise<SkillContent> {
    const res = await request<SingleEnvelope<SkillContent>>(this.ctx, {
      method: "GET",
      path: "/api/v1/skill",
      signal: opts.signal,
    });
    return res.data;
  }
}
