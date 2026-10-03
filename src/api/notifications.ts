

import { executeCommand } from "../core/execute.js";
import { COMMAND_BINDINGS } from "../generated/command-bindings.generated.js";
import {
  type ListNotificationsQuery,
  NotificationsApiBase,
  type V1Args,
  type V1Result,
} from "../generated/resources.generated.js";
import { request } from "../http.js";
import type { CallOptions, ListEnvelope, Notification } from "../types.js";

export type {
  ListNotificationsQuery,
  NotificationPreferenceUpdate,
} from "../generated/resources.generated.js";

export type NotificationAudience =
  | string[]
  | "all_members"
  | "admins"
  | "owner";

export type SendNotificationInput = Omit<
  V1Args<"notification send">,
  "recipient_ids" | "target"
> & {

  audience: NotificationAudience;
};

export type SendNotificationResult = V1Result<"notification send">;

export class NotificationsApi extends NotificationsApiBase {

  async list(
    query: ListNotificationsQuery = {},
    opts: CallOptions = {},
  ): Promise<Notification[]> {
    return (await this.listWithMeta(query, opts)).data;
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

  markRead(id: string, opts: CallOptions = {}) {
    return this.update(id, { is_read: true }, opts);
  }

  archive(id: string, opts: CallOptions = {}) {
    return this.update(id, { archived: true }, opts);
  }

  unarchive(id: string, opts: CallOptions = {}) {
    return this.update(id, { archived: false }, opts);
  }

  async readAll(opts: CallOptions = {}): Promise<void> {
    await executeCommand(
      COMMAND_BINDINGS["notification read-all"],
      {},
      this.ctx,
      opts,
    );
  }

  async send(
    input: SendNotificationInput,
    opts: CallOptions = {},
  ): Promise<SendNotificationResult> {
    const { audience, ...rest } = input;
    const args: Record<string, unknown> = { ...rest };
    if (Array.isArray(audience)) args.recipient_ids = audience;
    else args.target = audience;
    return executeCommand<SendNotificationResult>(
      COMMAND_BINDINGS["notification send"],
      args,
      this.ctx,
      opts,
    );
  }
}
