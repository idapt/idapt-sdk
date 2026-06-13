/**
 * ChatsApi — `/api/v1/chats` CRUD + sub-resources.
 *
 * Sub-resources are exposed as flat methods keyed by chat id so consumers
 * don't need an extra factory step: `chats.listMessages(chatId)` instead of
 * `chats.messages(chatId).list()`.
 *
 * `sendMessage` wraps the "post user message, wait for assistant reply"
 * flow. With `wait: true` (default) the server holds the connection until
 * the reply is ready (up to `timeout` seconds); with `wait: false` the
 * server responds `202`-style with a pending reference.
 */

import { type HttpContext, request } from "../http.js";
import type {
  AgentRun,
  AgentRunState,
  CallOptions,
  Chat,
  ChatCost,
  ChatStopResult,
  DeletedResponse,
  ListEnvelope,
  Message,
  MessageCosts,
  RepromptResult,
  SendMessageResult,
  SingleEnvelope,
} from "../types.js";

export interface ListChatsQuery {
  limit?: number;
  /** Opaque pagination cursor — echo `pagination.next_cursor`. */
  cursor?: string;
  agent_id?: string;
  workspace_id?: string;
}

export interface CreateChatInput {
  title?: string;
  agent_id?: string;
  workspace_id?: string;
  default_model?: string;
}

export interface UpdateChatInput {
  title?: string;
  icon?: string | null;
  default_model?: string | null;
}

export interface ListMessagesQuery {
  limit?: number;
  /** Opaque pagination cursor — echo `pagination.next_cursor`. */
  cursor?: string;
}

export interface SendMessageInput {
  content: string;
  model_id?: string;
  /** Default `true`. Set false to get a pending reference. */
  wait?: boolean;
  /** Seconds the server is allowed to block. Default `120`. Max `300`. */
  timeout?: number;
  /**
   * Optional idempotency tag — repeat POSTs with the same key (within the
   * server's dedupe window) return the original result instead of sending
   * the message twice. Safe to set on retried requests.
   */
  idempotency_key?: string;
}

export interface RepromptMessageInput {
  /** Override the chat's default model. `"auto"` routes via auto-router. */
  model_id?: string;
  effort_level?: "fast" | "smart" | "expert";
  /** 0–100, power-user override for explicit reasoning effort. */
  reasoning_level?: number;
  /** 0–100, only meaningful when `model_id` is `"auto"`. */
  cost_level?: number;
  /** Default `true`. Set false to get an immediate `queued` response. */
  wait?: boolean;
  /** Seconds the server is allowed to block. Default `120`. Max `300`. */
  timeout?: number;
}

export interface ListRunsQuery {
  limit?: number;
  /**
   * Opaque pagination cursor — `GET /chats/:id/runs` is cursor-paginated.
   * Echo `pagination.next_cursor` from the previous page.
   */
  cursor?: string;
  /** Filter by run lifecycle state. */
  state?: AgentRunState;
}

export interface StopChatInput {
  mode?: "soft" | "hard";
}

export interface ExportChatQuery {
  format?: "markdown" | "text" | "json" | "pdf";
}

export interface CopyChatToAgentInput {
  agent_id: string;
}

export interface CopyChatToWorkspaceInput {
  workspace_id: string;
  agent_id: string;
}

export class ChatsApi {
  constructor(private readonly ctx: HttpContext) {}

  // ---------------------------------------------------------------------------
  //  CRUD
  // ---------------------------------------------------------------------------

  async list(
    query: ListChatsQuery = {},
    opts: CallOptions = {},
  ): Promise<Chat[]> {
    const res = await request<ListEnvelope<Chat>>(this.ctx, {
      method: "GET",
      path: "/api/v1/chats",
      query,
      signal: opts.signal,
    });
    return res.data;
  }

  async create(input: CreateChatInput, opts: CallOptions = {}): Promise<Chat> {
    const res = await request<SingleEnvelope<Chat>>(this.ctx, {
      method: "POST",
      path: "/api/v1/chats",
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async get(id: string, opts: CallOptions = {}): Promise<Chat> {
    const res = await request<SingleEnvelope<Chat>>(this.ctx, {
      method: "GET",
      path: `/api/v1/chats/${id}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async update(
    id: string,
    input: UpdateChatInput,
    opts: CallOptions = {},
  ): Promise<Chat> {
    const res = await request<SingleEnvelope<Chat>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/chats/${id}`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/chats/${id}`,
      signal: opts.signal,
    });
  }

  async archive(id: string, opts: CallOptions = {}): Promise<Chat> {
    const res = await request<SingleEnvelope<Chat>>(this.ctx, {
      method: "POST",
      path: `/api/v1/chats/${id}/archive`,
      signal: opts.signal,
    });
    return res.data;
  }

  async unarchive(id: string, opts: CallOptions = {}): Promise<Chat> {
    const res = await request<SingleEnvelope<Chat>>(this.ctx, {
      method: "POST",
      path: `/api/v1/chats/${id}/unarchive`,
      signal: opts.signal,
    });
    return res.data;
  }

  async restore(id: string, opts: CallOptions = {}): Promise<Chat> {
    const res = await request<SingleEnvelope<Chat>>(this.ctx, {
      method: "POST",
      path: `/api/v1/chats/${id}/restore`,
      signal: opts.signal,
    });
    return res.data;
  }

  async permanentDelete(
    id: string,
    opts: CallOptions = {},
  ): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/chats/${id}/permanent-delete`,
      signal: opts.signal,
    });
  }

  // ---------------------------------------------------------------------------
  //  Sub-resources
  // ---------------------------------------------------------------------------

  /** `GET /chats/:id/cost` — token usage + spend snapshot. */
  async cost(id: string, opts: CallOptions = {}): Promise<ChatCost> {
    const res = await request<SingleEnvelope<ChatCost>>(this.ctx, {
      method: "GET",
      path: `/api/v1/chats/${id}/cost`,
      signal: opts.signal,
    });
    return res.data;
  }

  /** `GET /chats/:id/message-costs` - per-message and per-run cost details. */
  async messageCosts(
    id: string,
    opts: CallOptions = {},
  ): Promise<MessageCosts> {
    const res = await request<SingleEnvelope<MessageCosts>>(this.ctx, {
      method: "GET",
      path: `/api/v1/chats/${id}/message-costs`,
      signal: opts.signal,
    });
    return res.data;
  }

  /** `POST /chats/:id/stop` - request cancellation of the active run. */
  async stop(
    id: string,
    input: StopChatInput = {},
    opts: CallOptions = {},
  ): Promise<ChatStopResult> {
    const res = await request<SingleEnvelope<ChatStopResult>>(this.ctx, {
      method: "POST",
      path: `/api/v1/chats/${id}/stop`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  /** `GET /chats/:id/export` - stream a transcript as a Blob. */
  async export(
    id: string,
    query: ExportChatQuery = {},
    opts: CallOptions = {},
  ): Promise<Blob> {
    return request<Blob>(this.ctx, {
      method: "GET",
      path: `/api/v1/chats/${id}/export`,
      query,
      expectBlob: true,
      signal: opts.signal,
    });
  }

  async copyToAgent(
    id: string,
    input: CopyChatToAgentInput,
    opts: CallOptions = {},
  ): Promise<Chat> {
    const res = await request<SingleEnvelope<Chat>>(this.ctx, {
      method: "POST",
      path: `/api/v1/chats/${id}/copy-to-agent`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async copyToWorkspace(
    id: string,
    input: CopyChatToWorkspaceInput,
    opts: CallOptions = {},
  ): Promise<Chat> {
    const res = await request<SingleEnvelope<Chat>>(this.ctx, {
      method: "POST",
      path: `/api/v1/chats/${id}/copy-to-workspace`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async forkToWorkspace(id: string, opts: CallOptions = {}): Promise<Chat> {
    const res = await request<SingleEnvelope<Chat>>(this.ctx, {
      method: "POST",
      path: `/api/v1/chats/${id}/fork-to-workspace`,
      signal: opts.signal,
    });
    return res.data;
  }

  /** `GET /chats/:id/messages` — paginated history. */
  async listMessages(
    id: string,
    query: ListMessagesQuery = {},
    opts: CallOptions = {},
  ): Promise<Message[]> {
    const res = await request<ListEnvelope<Message>>(this.ctx, {
      method: "GET",
      path: `/api/v1/chats/${id}/messages`,
      query,
      signal: opts.signal,
    });
    return res.data;
  }

  /**
   * `POST /chats/:id/messages` — send a user message + (optionally) wait
   * for the assistant reply synchronously. Responds HTTP 201 with a
   * `oneOf`: a completed `{status, chat_id, model_id, user_message_id,
   * message}` or a pending `{status, pending_token, chat_id}`. The pending
   * handle is `pending_token` — an opaque workflow handle, NOT a
   * resourceId. See `SendMessageResult`.
   */
  async sendMessage(
    id: string,
    input: SendMessageInput,
    opts: CallOptions = {},
  ): Promise<SendMessageResult> {
    return request<SendMessageResult>(this.ctx, {
      method: "POST",
      path: `/api/v1/chats/${id}/messages`,
      body: input,
      signal: opts.signal,
    });
  }

  /** `GET /chats/:id/runs` — model execution runs tied to this chat. */
  async listRuns(
    id: string,
    query: ListRunsQuery = {},
    opts: CallOptions = {},
  ): Promise<AgentRun[]> {
    const res = await request<ListEnvelope<AgentRun>>(this.ctx, {
      method: "GET",
      path: `/api/v1/chats/${id}/runs`,
      query,
      signal: opts.signal,
    });
    return res.data;
  }

  /**
   * `POST /chats/:id/messages/:message_id/reprompt` — regenerate the
   * assistant response to an existing user message. The original AI reply
   * is preserved; a sibling assistant message is created so branching
   * stays intact.
   *
   *   Before:  [User A] → [AI B]
   *   After:   [User A] ─┬─ [AI B]
   *                      └─ [AI C]   ← C.prevMessageId = A
   *
   * With `wait=true` (default) the server blocks until the new sibling is
   * available; with `wait=false` returns `{ status: "pending", ... }` and
   * the new message can be polled via `listMessages`.
   */
  async repromptMessage(
    chatId: string,
    messageId: string,
    input: RepromptMessageInput = {},
    opts: CallOptions = {},
  ): Promise<RepromptResult> {
    // The reprompt route wraps via `v1Created`/`v1Success`, so the wire
    // shape is `{ data: { status, ... } }` — unwrap here so callers get
    // the discriminated union directly.
    const res = await request<SingleEnvelope<RepromptResult>>(this.ctx, {
      method: "POST",
      path: `/api/v1/chats/${chatId}/messages/${messageId}/reprompt`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }
}
