/**
 * TriggersApi — `/api/v1/triggers`.
 *
 * Triggers fire actions (run code, run chat) on events (webhook, schedule,
 * manual). The `fire` endpoint is unauthenticated — it validates the
 * per-trigger webhook secret instead of the bearer token. This SDK handles
 * both modes: regular calls use `this.ctx.key`; `fire` can be called with
 * an explicit secret override.
 */

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
  /**
   * Webhook secret for this trigger. Overrides the client's `ap_` key.
   * Required when calling `fire` outside the creating user's session.
   */
  secret: string;
  /** Optional context overrides forwarded to the action. */
  body?: Record<string, unknown>;
}

export interface ListTriggerRunsQuery {
  limit?: number;
  /** Opaque pagination cursor — echo `pagination.next_cursor`. */
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

  // ---------------------------------------------------------------------------
  //  CRUD
  // ---------------------------------------------------------------------------

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

  /**
   * Create a trigger. `workspace_id` is passed in the request BODY (alongside
   * the flat trigger definition) — it is not a query param. The request
   * body is flat: every scheduling field (`cron_expression`, …) and every
   * action field (`agent_id`, `prompt_template`, `file_id`, …) sits at the
   * top level — there are no nested `trigger_config` / `action_config`
   * objects any more.
   *
   * For a `webhook` trigger the response additionally carries a one-time
   * plaintext `secret` (use `TriggerWithSecret`); other trigger types
   * resolve to a plain `Trigger`.
   */
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

  // ---------------------------------------------------------------------------
  //  Fire + rotate-secret + runs
  // ---------------------------------------------------------------------------

  /**
   * Fire a trigger via its webhook secret. This endpoint does NOT use the
   * client's `ap_` key — the bearer is the trigger's secret — so we build a
   * one-off HttpContext for it rather than mutating the shared one.
   *
   * Responds HTTP 202. The response identifies the fired trigger via `id`
   * only.
   */
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

  /**
   * Rotate the webhook secret. Returns the trigger with a fresh one-time
   * plaintext `secret` populated (`TriggerWithSecret`). The old secret
   * immediately stops working.
   */
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

  /** Recent fires + their success/error outcome. */
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
