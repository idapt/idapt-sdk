

import { type HttpContext, request } from "../http.js";
import type { CallOptions, Settings, SingleEnvelope } from "../types.js";

export interface UpdateSettingsInput {
  name?: string | null;

  slug?: string;
  is_public?: boolean;
  is_auto_compact_enabled?: boolean;
  consent_analytics?: boolean;
  consent_marketing?: boolean;
  consent_decided_at?: string;
  locale?: string | null;
  icon?: string | null;
  github_username?: string | null;
}

export class SettingsApi {
  constructor(private readonly ctx: HttpContext) {}

  async get(opts: CallOptions = {}): Promise<Settings> {
    const res = await request<SingleEnvelope<Settings>>(this.ctx, {
      method: "GET",
      path: "/api/v1/settings",
      signal: opts.signal,
    });
    return res.data;
  }

  async update(
    input: UpdateSettingsInput,
    opts: CallOptions = {},
  ): Promise<Settings> {
    const res = await request<SingleEnvelope<Settings>>(this.ctx, {
      method: "PATCH",
      path: "/api/v1/settings",
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }
}
