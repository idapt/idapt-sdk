/**
 * NotificationsApi — `/api/v1/notifications`.
 *
 * Notifications are per-recipient rows attached to underlying notification
 * "events". The SDK exposes only the per-recipient view — events themselves
 * are an internal audit surface.
 *
 * Three sub-surfaces on the same module for ergonomics:
 *   - per-row verbs: list, get, markRead, archive, unarchive, delete
 *   - bulk: readAll
 *   - settings: getConfig / updateConfig (toasts, quiet hours, digest)
 *   - matrix: getPreferences / updatePreferences (per-(type, subtype?, channel))
 *   - send: send a notification to workspace members (admin/owner verb)
 *
 * `id` parameters are notification recipient resourceIds. Resolution of
 * profile/workspace FKs to resourceIds is handled server-side; both lists
 * and singles come back already in wire shape.
 */

import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  DeletedResponse,
  ListEnvelope,
  Notification,
  NotificationConfig,
  NotificationPreference,
  SingleEnvelope,
} from "../types.js";

export interface ListNotificationsQuery {
  limit?: number;
  /** Opaque pagination cursor — echo `pagination.next_cursor`. */
  cursor?: string;
  unread_only?: boolean;
  archived_only?: boolean;
  type?: string;
  subtype?: string;
  workspace_id?: string;
  search?: string;
}

export interface UpdateNotificationInput {
  /**
   * Mark the row read. Only `true` is accepted — the v1 contract does not
   * support reverting a row to unread via this field.
   */
  is_read?: true;
  /** `true` → archive, `false` → unarchive. */
  archived?: boolean;
}

export type NotificationAudience =
  | string[]
  | "all_members"
  | "admins"
  | "owner";

export interface SendNotificationInput {
  workspace_id: string;
  title: string;
  message?: string;
  /**
   * One of:
   *   - An array of profile resourceIds — only those people get the row
   *   - `"all_members" | "admins" | "owner"` — broadcast within the workspace
   *
   * Exactly one form must be supplied.
   */
  audience: NotificationAudience;
  channels?: ("in_app" | "email" | "web_push")[];
  urgency?: "low" | "normal" | "high";
  /** Idempotency tag — repeat calls with the same key dedupe. */
  dedup_key?: string;
  data?: Record<string, unknown>;
  /** Click-through target. See `backend/platform/notifications/src/internal/notifications/deep-links.ts`. */
  deep_link?: Record<string, unknown>;
}

export interface SendNotificationResult {
  recipientCount: number;
  deduped: boolean;
  deepLink?: Record<string, unknown>;
}

/** Single entry in the bulk-update payload for the preferences matrix. */
export interface NotificationPreferenceUpdate {
  type: string;
  subtype?: string;
  channel: "in_app" | "email" | "web_push";
  enabled: boolean;
}

export class NotificationsApi {
  constructor(private readonly ctx: HttpContext) {}

  // ---------------------------------------------------------------------------
  //  Per-row verbs
  // ---------------------------------------------------------------------------

  /**
   * List notification rows. Returns the `data` array directly; the
   * unfiltered unread tally lives at the TOP LEVEL of the wire envelope
   * (`unread_count`, a sibling of `data`/`pagination`) — use `listWithMeta`
   * when you need it.
   */
  async list(
    query: ListNotificationsQuery = {},
    opts: CallOptions = {},
  ): Promise<Notification[]> {
    const res = await this.listWithMeta(query, opts);
    return res.data;
  }

  /**
   * Like `list()` but returns the full envelope so callers can read the
   * top-level `unread_count` (e.g. to drive an unread badge).
   */
  async listWithMeta(
    query: ListNotificationsQuery = {},
    opts: CallOptions = {},
  ): Promise<ListEnvelope<Notification> & { unread_count: number }> {
    return request<ListEnvelope<Notification> & { unread_count: number }>(
      this.ctx,
      {
        method: "GET",
        path: "/api/v1/notifications",
        query,
        signal: opts.signal,
      },
    );
  }

  async get(id: string, opts: CallOptions = {}): Promise<Notification> {
    const res = await request<SingleEnvelope<Notification>>(this.ctx, {
      method: "GET",
      path: `/api/v1/notifications/${id}`,
      signal: opts.signal,
    });
    return res.data;
  }

  /**
   * PATCH a single recipient row. The body accepts only the `is_read` and
   * `archived` booleans; at least one must be supplied (422 otherwise).
   * Returns the full updated `Notification`.
   */
  async update(
    id: string,
    input: UpdateNotificationInput,
    opts: CallOptions = {},
  ): Promise<Notification> {
    const res = await request<SingleEnvelope<Notification>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/notifications/${id}`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  /** Shorthand for `update(id, { is_read: true })`. */
  markRead(id: string, opts: CallOptions = {}) {
    return this.update(id, { is_read: true }, opts);
  }

  /** Shorthand for `update(id, { archived: true })`. */
  archive(id: string, opts: CallOptions = {}) {
    return this.update(id, { archived: true }, opts);
  }

  /** Shorthand for `update(id, { archived: false })`. */
  unarchive(id: string, opts: CallOptions = {}) {
    return this.update(id, { archived: false }, opts);
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/notifications/${id}`,
      signal: opts.signal,
    });
  }

  // ---------------------------------------------------------------------------
  //  Bulk
  // ---------------------------------------------------------------------------

  /**
   * Mark every unread, non-archived, non-deleted notification as read.
   * Resolves once the bulk update lands — the v1 response is an empty
   * `{ data: {} }` envelope.
   */
  async readAll(opts: CallOptions = {}): Promise<void> {
    await request<SingleEnvelope<Record<string, never>>>(this.ctx, {
      method: "POST",
      path: "/api/v1/notifications/read-all",
      signal: opts.signal,
    });
  }

  // ---------------------------------------------------------------------------
  //  Send (admin / owner)
  // ---------------------------------------------------------------------------

  /**
   * Send a notification to workspace members. The caller must be an admin/owner
   * of the workspace; `recipient_ids` (profile resourceIds) and the broadcast
   * targets are mutually exclusive — pass one via `audience`.
   */
  async send(
    input: SendNotificationInput,
    opts: CallOptions = {},
  ): Promise<SendNotificationResult> {
    // Wire flattens audience into `recipient_ids[]` OR `target` — keep the
    // ergonomic union here and map it for the server. Both forms are
    // accepted by the route schema.
    const body: Record<string, unknown> = {
      workspace_id: input.workspace_id,
      title: input.title,
      message: input.message,
      channels: input.channels,
      urgency: input.urgency,
      dedup_key: input.dedup_key,
      data: input.data,
      deep_link: input.deep_link,
    };
    if (Array.isArray(input.audience)) {
      body.recipient_ids = input.audience;
    } else {
      body.target = input.audience;
    }
    const res = await request<SingleEnvelope<SendNotificationResult>>(
      this.ctx,
      {
        method: "POST",
        path: "/api/v1/notifications",
        body,
        signal: opts.signal,
      },
    );
    return res.data;
  }

  // ---------------------------------------------------------------------------
  //  Config + preferences
  // ---------------------------------------------------------------------------

  /**
   * Fetch the per-user toast/sound/quiet-hours/digest config. The response
   * is flat — the config object IS `data`, with no inner `{config}` wrapper.
   */
  async getConfig(opts: CallOptions = {}): Promise<NotificationConfig> {
    const res = await request<SingleEnvelope<NotificationConfig>>(this.ctx, {
      method: "GET",
      path: "/api/v1/notifications/config",
      signal: opts.signal,
    });
    return res.data;
  }

  /** PATCH a subset of the config. Returns the full flat config. */
  async updateConfig(
    input: Partial<NotificationConfig>,
    opts: CallOptions = {},
  ): Promise<NotificationConfig> {
    const res = await request<SingleEnvelope<NotificationConfig>>(this.ctx, {
      method: "PATCH",
      path: "/api/v1/notifications/config",
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  /**
   * Fetch the (type, subtype?, channel) preference matrix. The response is
   * flat — `data` IS the preference array, with no inner `{preferences}`
   * wrapper.
   */
  async getPreferences(
    opts: CallOptions = {},
  ): Promise<NotificationPreference[]> {
    const res = await request<SingleEnvelope<NotificationPreference[]>>(
      this.ctx,
      {
        method: "GET",
        path: "/api/v1/notifications/preferences",
        signal: opts.signal,
      },
    );
    return res.data;
  }

  /**
   * Bulk-update preferences. Each entry sets one (type, subtype?, channel)
   * row. Empty `updates[]` → 422. Returns the full flat preference array.
   */
  async updatePreferences(
    updates: NotificationPreferenceUpdate[],
    opts: CallOptions = {},
  ): Promise<NotificationPreference[]> {
    const res = await request<SingleEnvelope<NotificationPreference[]>>(
      this.ctx,
      {
        method: "PATCH",
        path: "/api/v1/notifications/preferences",
        body: { updates },
        signal: opts.signal,
      },
    );
    return res.data;
  }
}
