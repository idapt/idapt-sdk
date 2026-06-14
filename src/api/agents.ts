/**
 * AgentsApi — `/api/v1/agents` CRUD.
 *
 * Agents are standalone resources scoped to a workspace (personal or
 * user-created). See `lib/browser-app/authorize.ts` for the permission model.
 */

import { type HttpContext, request } from "../http.js";
import type {
  Agent,
  CallOptions,
  DeletedResponse,
  ListEnvelope,
  SingleEnvelope,
} from "../types.js";

/**
 * `GET /v1/agents` query params. Cursor-paginated (`limit` + opaque
 * `cursor`); `workspace_id` narrows the listing to one workspace.
 */
export interface ListAgentsQuery {
  workspace_id?: string;
  scope?: "all";
  type?: "user" | "generated";
  include_archived?: boolean;
  archived_only?: boolean;
  limit?: number;
  /** Opaque pagination cursor — echo `pagination.next_cursor`. */
  cursor?: string;
}

export interface CreateAgentInput {
  name: string;
  icon: string;
  description?: string;
  system_prompt?: string;
  workspace_id?: string;
  authorization?: Record<string, unknown> | null;
  confirmation_required?: string[];
  compaction_preset?: "minimal" | "normal" | "detailed" | null;
  compaction_summary_percent?: number | null;
  compaction_summary_max_tokens?: number | null;
  compaction_preserved_percent?: number | null;
  compaction_preserved_max_tokens?: number | null;
  compaction_msg_percent?: number | null;
  compaction_msg_max_tokens?: number | null;
  type?: "user" | "generated";
  memory_folder?: string | null;
  default_model_id?: string;
  default_reasoning_effort?: number | null;
  default_auto_cost_level?: number | null;
  default_cost_budget_limit_usd?: number | null;
}

export interface UpdateAgentInput {
  name?: string;
  icon?: string;
  description?: string | null;
  system_prompt?: string | null;
  authorization?: Record<string, unknown> | null;
  confirmation_required?: string[];
  compaction_preset?: "minimal" | "normal" | "detailed" | null;
  compaction_summary_percent?: number | null;
  compaction_summary_max_tokens?: number | null;
  compaction_preserved_percent?: number | null;
  compaction_preserved_max_tokens?: number | null;
  compaction_msg_percent?: number | null;
  compaction_msg_max_tokens?: number | null;
  type?: "user" | "generated";
  memory_folder?: string | null;
  default_model_id?: string | null;
  default_reasoning_effort?: number | null;
  default_auto_cost_level?: number | null;
  default_cost_budget_limit_usd?: number | null;
}

export interface MoveAgentInput {
  workspace_id: string;
}

export interface CopyAgentToWorkspaceInput {
  workspace_id: string;
}

export class AgentsApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(
    query: ListAgentsQuery = {},
    opts: CallOptions = {},
  ): Promise<Agent[]> {
    const res = await request<ListEnvelope<Agent>>(this.ctx, {
      method: "GET",
      path: "/api/v1/agents",
      query,
      signal: opts.signal,
    });
    return res.data;
  }

  async create(
    input: CreateAgentInput,
    opts: CallOptions = {},
  ): Promise<Agent> {
    const res = await request<SingleEnvelope<Agent>>(this.ctx, {
      method: "POST",
      path: "/api/v1/agents",
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async get(id: string, opts: CallOptions = {}): Promise<Agent> {
    const res = await request<SingleEnvelope<Agent>>(this.ctx, {
      method: "GET",
      path: `/api/v1/agents/${id}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async update(
    id: string,
    input: UpdateAgentInput,
    opts: CallOptions = {},
  ): Promise<Agent> {
    const res = await request<SingleEnvelope<Agent>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/agents/${id}`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/agents/${id}`,
      signal: opts.signal,
    });
  }

  async archive(id: string, opts: CallOptions = {}): Promise<Agent> {
    const res = await request<SingleEnvelope<Agent>>(this.ctx, {
      method: "POST",
      path: `/api/v1/agents/${id}/archive`,
      signal: opts.signal,
    });
    return res.data;
  }

  async unarchive(id: string, opts: CallOptions = {}): Promise<Agent> {
    const res = await request<SingleEnvelope<Agent>>(this.ctx, {
      method: "POST",
      path: `/api/v1/agents/${id}/unarchive`,
      signal: opts.signal,
    });
    return res.data;
  }

  async restore(id: string, opts: CallOptions = {}): Promise<Agent> {
    const res = await request<SingleEnvelope<Agent>>(this.ctx, {
      method: "POST",
      path: `/api/v1/agents/${id}/restore`,
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
      path: `/api/v1/agents/${id}/permanent-delete`,
      signal: opts.signal,
    });
  }

  async move(
    id: string,
    input: MoveAgentInput,
    opts: CallOptions = {},
  ): Promise<Agent> {
    const res = await request<SingleEnvelope<Agent>>(this.ctx, {
      method: "POST",
      path: `/api/v1/agents/${id}/move`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async copyToWorkspace(
    id: string,
    input: CopyAgentToWorkspaceInput,
    opts: CallOptions = {},
  ): Promise<Agent> {
    const res = await request<SingleEnvelope<Agent>>(this.ctx, {
      method: "POST",
      path: `/api/v1/agents/${id}/copy-to-workspace`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }
}
