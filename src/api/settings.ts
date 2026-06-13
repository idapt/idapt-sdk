/**
 * SettingsApi — `/api/v1/settings`.
 *
 * Account-level preferences: profile display name, slug, public visibility,
 * Hub publisher username, AI auto-compact opt-in, analytics/marketing consent.
 *
 * Slug renames go through the dedicated rename pipeline server-side
 * (uniqueness + cooldown + audit). Pass `slug` in `update()`; the route
 * dispatches to the rename path under the hood. A rejected slug surfaces
 * as an `invalid_request` (422) error.
 *
 * UI-only state (sidebar hints, theme, modal counters) is intentionally
 * NOT on the public surface.
 */

import { type HttpContext, request } from "../http.js";
import type { CallOptions, Settings, SingleEnvelope } from "../types.js";

export interface UpdateSettingsInput {
  name?: string | null;
  /** Lowercase 3–30 chars, `[a-z0-9-]`. Routed through the rename pipeline. */
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
