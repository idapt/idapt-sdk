

import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  CreateTriggerInput,
  DeletedResponse,
  ListEnvelope,
  SingleEnvelope,
  Trigger,
  TriggerCostStats,
  TriggerRun,
  TriggerWithSecret,
  UpdateTriggerInput,
} from "../types.js";

export interface FireTriggerInput {

  secret: string;

  body?: Record<string, unknown>;
}

export interface ListTriggerRunsQuery {
  limit?: number;

  cursor?: string;
}

export interface ListTriggersQuery {
  workspace_id?: string;
  include_archived?: boolean;
  archived_only?: boolean;
}

export interface BulkTriggerCostStatsQuery {
  workspace_id?: string;
}

export class TriggersApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(
    query: ListTriggersQuery = {},
    opts: CallOptions = {},
  ): Promise<Trigger[]> {
    const res = await request<ListEnvelope<Trigger>>(this.ctx, {
      method: "GET",
      path: "/api/v1/triggers",
      query,
      signal: opts.signal,
    });
    return res.data;
  }

  async create(
    workspaceId: string,
    input: CreateTriggerInput,
    opts: CallOptions = {},
  ): Promise<TriggerWithSecret | Trigger> {
    const res = await request<SingleEnvelope<TriggerWithSecret | Trigger>>(
      this.ctx,
      {
        method: "POST",
        path: "/api/v1/triggers",
        body: { workspace_id: workspaceId, ...input },
        signal: opts.signal,
      },
    );
    return res.data;
  }

  async get(id: string, opts: CallOptions = {}): Promise<Trigger> {
    const res = await request<SingleEnvelope<Trigger>>(this.ctx, {
      method: "GET",
      path: `/api/v1/triggers/${id}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async update(
    id: string,
    input: UpdateTriggerInput,
    opts: CallOptions = {},
  ): Promise<Trigger> {
    const res = await request<SingleEnvelope<Trigger>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/triggers/${id}`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/triggers/${id}`,
      signal: opts.signal,
    });
  }

  async archive(id: string, opts: CallOptions = {}): Promise<Trigger> {
    const res = await request<SingleEnvelope<Trigger>>(this.ctx, {
      method: "POST",
      path: `/api/v1/triggers/${id}/archive`,
      signal: opts.signal,
    });
    return res.data;
  }

  async unarchive(id: string, opts: CallOptions = {}): Promise<Trigger> {
    const res = await request<SingleEnvelope<Trigger>>(this.ctx, {
      method: "POST",
      path: `/api/v1/triggers/${id}/unarchive`,
      signal: opts.signal,
    });
    return res.data;
  }

  async fire(
    id: string,
    input: FireTriggerInput,
    opts: CallOptions = {},
  ): Promise<{ id: string }> {
    const localCtx: HttpContext = {
      apiUrl: this.ctx.apiUrl,
      key: input.secret,
      fetch: this.ctx.fetch,
    };
    const res = await request<SingleEnvelope<{ id: string }>>(localCtx, {
      method: "POST",
      path: `/api/v1/triggers/${id}/fire`,
      body: input.body ?? {},
      signal: opts.signal,
    });
    return res.data;
  }

  async rotateSecret(
    id: string,
    opts: CallOptions = {},
  ): Promise<TriggerWithSecret> {
    const res = await request<SingleEnvelope<TriggerWithSecret>>(this.ctx, {
      method: "POST",
      path: `/api/v1/triggers/${id}/rotate-secret`,
      signal: opts.signal,
    });
    return res.data;
  }

  async listRuns(
    id: string,
    query: ListTriggerRunsQuery = {},
    opts: CallOptions = {},
  ): Promise<TriggerRun[]> {
    const res = await request<ListEnvelope<TriggerRun>>(this.ctx, {
      method: "GET",
      path: `/api/v1/triggers/${id}/runs`,
      query,
      signal: opts.signal,
    });
    return res.data;
  }

  async getCostStats(
    id: string,
    opts: CallOptions = {},
  ): Promise<TriggerCostStats> {
    const res = await request<SingleEnvelope<TriggerCostStats>>(this.ctx, {
      method: "GET",
      path: `/api/v1/triggers/${id}/cost-stats`,
      signal: opts.signal,
    });
    return res.data;
  }

  async getCostStatsMap(
    query: BulkTriggerCostStatsQuery = {},
    opts: CallOptions = {},
  ): Promise<Record<string, TriggerCostStats>> {
    const res = await request<
      SingleEnvelope<{ by_id: Record<string, TriggerCostStats> }>
    >(this.ctx, {
      method: "GET",
      path: "/api/v1/triggers/cost-stats",
      query,
      signal: opts.signal,
    });
    return res.data.by_id;
  }
}
