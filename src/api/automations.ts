

import { type HttpContext, request } from "../http.js";
import type {
  Automation,
  AutomationCostStats,
  AutomationRun,
  AutomationWithSecret,
  CallOptions,
  CreateAutomationInput,
  DeletedResponse,
  ListEnvelope,
  SingleEnvelope,
  UpdateAutomationInput,
} from "../types.js";

export interface FireAutomationInput {

  secret: string;

  body?: Record<string, unknown>;
}

export interface ListAutomationRunsQuery {
  limit?: number;

  cursor?: string;
}

export interface ListAutomationsQuery {
  workspace_id?: string;
  include_archived?: boolean;
  archived_only?: boolean;
}

export interface BulkAutomationCostStatsQuery {
  workspace_id?: string;
}

export class AutomationsApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(
    query: ListAutomationsQuery = {},
    opts: CallOptions = {},
  ): Promise<Automation[]> {
    const res = await request<ListEnvelope<Automation>>(this.ctx, {
      method: "GET",
      path: "/api/v1/automations",
      query,
      signal: opts.signal,
    });
    return res.data;
  }

  async create(
    workspaceId: string,
    input: CreateAutomationInput,
    opts: CallOptions = {},
  ): Promise<AutomationWithSecret | Automation> {
    const res = await request<
      SingleEnvelope<AutomationWithSecret | Automation>
    >(this.ctx, {
      method: "POST",
      path: "/api/v1/automations",
      body: { workspace_id: workspaceId, ...input },
      signal: opts.signal,
    });
    return res.data;
  }

  async get(id: string, opts: CallOptions = {}): Promise<Automation> {
    const res = await request<SingleEnvelope<Automation>>(this.ctx, {
      method: "GET",
      path: `/api/v1/automations/${id}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async update(
    id: string,
    input: UpdateAutomationInput,
    opts: CallOptions = {},
  ): Promise<Automation> {
    const res = await request<SingleEnvelope<Automation>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/automations/${id}`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/automations/${id}`,
      signal: opts.signal,
    });
  }

  async archive(id: string, opts: CallOptions = {}): Promise<Automation> {
    const res = await request<SingleEnvelope<Automation>>(this.ctx, {
      method: "POST",
      path: `/api/v1/automations/${id}/archive`,
      signal: opts.signal,
    });
    return res.data;
  }

  async unarchive(id: string, opts: CallOptions = {}): Promise<Automation> {
    const res = await request<SingleEnvelope<Automation>>(this.ctx, {
      method: "POST",
      path: `/api/v1/automations/${id}/unarchive`,
      signal: opts.signal,
    });
    return res.data;
  }

  async fire(
    id: string,
    input: FireAutomationInput,
    opts: CallOptions = {},
  ): Promise<{ id: string }> {
    const localCtx: HttpContext = {
      apiUrl: this.ctx.apiUrl,
      key: input.secret,
      fetch: this.ctx.fetch,
    };
    const res = await request<SingleEnvelope<{ id: string }>>(localCtx, {
      method: "POST",
      path: `/api/v1/automations/${id}/fire`,
      body: input.body ?? {},
      signal: opts.signal,
    });
    return res.data;
  }

  async rotateSecret(
    id: string,
    opts: CallOptions = {},
  ): Promise<AutomationWithSecret> {
    const res = await request<SingleEnvelope<AutomationWithSecret>>(this.ctx, {
      method: "POST",
      path: `/api/v1/automations/${id}/rotate-secret`,
      signal: opts.signal,
    });
    return res.data;
  }

  async listRuns(
    id: string,
    query: ListAutomationRunsQuery = {},
    opts: CallOptions = {},
  ): Promise<AutomationRun[]> {
    const res = await request<ListEnvelope<AutomationRun>>(this.ctx, {
      method: "GET",
      path: `/api/v1/automations/${id}/runs`,
      query,
      signal: opts.signal,
    });
    return res.data;
  }

  async getCostStats(
    id: string,
    opts: CallOptions = {},
  ): Promise<AutomationCostStats> {
    const res = await request<SingleEnvelope<AutomationCostStats>>(this.ctx, {
      method: "GET",
      path: `/api/v1/automations/${id}/cost-stats`,
      signal: opts.signal,
    });
    return res.data;
  }

  async getCostStatsMap(
    query: BulkAutomationCostStatsQuery = {},
    opts: CallOptions = {},
  ): Promise<Record<string, AutomationCostStats>> {
    const res = await request<
      SingleEnvelope<{ by_id: Record<string, AutomationCostStats> }>
    >(this.ctx, {
      method: "GET",
      path: "/api/v1/automations/cost-stats",
      query,
      signal: opts.signal,
    });
    return res.data.by_id;
  }
}
