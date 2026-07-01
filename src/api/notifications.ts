

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

  cursor?: string;
  unread_only?: boolean;
  archived_only?: boolean;
  type?: string;
  subtype?: string;
  workspace_id?: string;
  search?: string;
}

export interface UpdateNotificationInput {

  is_read?: true;

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

  audience: NotificationAudience;
  channels?: ("in_app" | "email" | "web_push")[];
  urgency?: "low" | "normal" | "high";

  dedup_key?: string;
  data?: Record<string, unknown>;

  deep_link?: Record<string, unknown>;
}

export interface SendNotificationResult {
  recipientCount: number;
  deduped: boolean;
  deepLink?: Record<string, unknown>;
}

export interface NotificationPreferenceUpdate {
  type: string;
  subtype?: string;
  channel: "in_app" | "email" | "web_push";
  enabled: boolean;
}

export class NotificationsApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(
    query: ListNotificationsQuery = {},
    opts: CallOptions = {},
  ): Promise<Notification[]> {
    const res = await this.listWithMeta(query, opts);
    return res.data;
  }

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

  markRead(id: string, opts: CallOptions = {}) {
    return this.update(id, { is_read: true }, opts);
  }

  archive(id: string, opts: CallOptions = {}) {
    return this.update(id, { archived: true }, opts);
  }

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

  async readAll(opts: CallOptions = {}): Promise<void> {
    await request<SingleEnvelope<Record<string, never>>>(this.ctx, {
      method: "POST",
      path: "/api/v1/notifications/read-all",
      signal: opts.signal,
    });
  }

  async send(
    input: SendNotificationInput,
    opts: CallOptions = {},
  ): Promise<SendNotificationResult> {

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

  async getConfig(opts: CallOptions = {}): Promise<NotificationConfig> {
    const res = await request<SingleEnvelope<NotificationConfig>>(this.ctx, {
      method: "GET",
      path: "/api/v1/notifications/config",
      signal: opts.signal,
    });
    return res.data;
  }

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
