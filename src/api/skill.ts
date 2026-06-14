/**
 * SkillApi — `GET /api/v1/skill`.
 *
 * Returns the canonical SKILL.md — Markdown instructions that LLMs (or
 * other browser-apps) can load to learn what the idapt API offers. Served as
 * a JSON envelope (`{ data: { content, format } }`).
 */

import { type HttpContext, request } from "../http.js";
import type { CallOptions, SingleEnvelope } from "../types.js";

/** Payload of `GET /v1/skill` — the SKILL.md body plus its format tag. */
export interface SkillContent {
  /** The SKILL.md document body. */
  content: string;
  /** Content format — `"markdown"` today. */
  format: string;
}

export class SkillApi {
  constructor(private readonly ctx: HttpContext) {}

  /**
   * Fetch the SKILL.md document. Returns `{ content, format }` — the route
   * responds with a JSON envelope, not raw text.
   */
  async get(opts: CallOptions = {}): Promise<SkillContent> {
    const res = await request<SingleEnvelope<SkillContent>>(this.ctx, {
      method: "GET",
      path: "/api/v1/skill",
      signal: opts.signal,
    });
    return res.data;
  }
}
