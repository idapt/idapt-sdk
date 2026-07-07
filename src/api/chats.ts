

import {
  type ExecuteCommandOptions,
  executeCommand,
  type SseEvent,
} from "../core/execute.js";
import { COMMAND_BINDINGS } from "../generated/command-bindings.generated.js";
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

  cursor?: string;
}

export interface SendMessageInput {
  content: string;
  model_id?: string;

  wait?: boolean;

  timeout?: number;

  idempotency_key?: string;
}

export interface StreamMessageInput {
  content: string;
  model_id?: string;

  reasoning_level?: number;
  effort_level?: "fast" | "smart" | "expert";

  cost_level?: number;

  branch_from?: string;

  idempotency_key?: string;

  timeout?: number;
}

export interface RepromptMessageInput {

  model_id?: string;
  effort_level?: "fast" | "smart" | "expert";

  reasoning_level?: number;

  cost_level?: number;

  wait?: boolean;

  timeout?: number;
}

export interface ListRunsQuery {
  limit?: number;

  cursor?: string;

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

  async cost(id: string, opts: CallOptions = {}): Promise<ChatCost> {
    const res = await request<SingleEnvelope<ChatCost>>(this.ctx, {
      method: "GET",
      path: `/api/v1/chats/${id}/cost`,
      signal: opts.signal,
    });
    return res.data;
  }

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

  stream(
    id: string,
    input: StreamMessageInput,
    opts: ExecuteCommandOptions = {},
  ): Promise<AsyncIterable<SseEvent>> {
    return executeCommand<AsyncIterable<SseEvent>>(
      COMMAND_BINDINGS["chat stream"],
      { id, ...input },
      this.ctx,
      opts,
    );
  }

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

  async repromptMessage(
    chatId: string,
    messageId: string,
    input: RepromptMessageInput = {},
    opts: CallOptions = {},
  ): Promise<RepromptResult> {

    const res = await request<SingleEnvelope<RepromptResult>>(this.ctx, {
      method: "POST",
      path: `/api/v1/chats/${chatId}/messages/${messageId}/reprompt`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }
}
