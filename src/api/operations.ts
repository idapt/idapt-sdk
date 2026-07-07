

import { type HttpContext, request } from "../http.js";
import type { CallOptions, ListEnvelope, SingleEnvelope } from "../types.js";

export interface Operation {
  id: string;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";

  tool: string | null;

  result: unknown;

  error: unknown;
  created_at?: string;
  started_at: string | null;
  completed_at: string | null;
}

export interface ListOperationsInput {
  status?: "pending" | "running" | "completed" | "failed" | "cancelled";
  limit?: number;
  cursor?: string;
}

export class OperationsApi {
  constructor(private readonly ctx: HttpContext) {}

  async get(id: string, opts: CallOptions = {}): Promise<Operation> {
    const res = await request<SingleEnvelope<Operation>>(this.ctx, {
      method: "GET",
      path: `/api/v1/operations/${encodeURIComponent(id)}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async list(
    input: ListOperationsInput = {},
    opts: CallOptions = {},
  ): Promise<ListEnvelope<Operation>> {
    return request<ListEnvelope<Operation>>(this.ctx, {
      method: "GET",
      path: "/api/v1/operations",
      query: input as Record<string, unknown>,
      signal: opts.signal,
    });
  }

  async cancel(id: string, opts: CallOptions = {}): Promise<Operation> {
    const res = await request<SingleEnvelope<Operation>>(this.ctx, {
      method: "POST",
      path: `/api/v1/operations/${encodeURIComponent(id)}/cancel`,
      signal: opts.signal,
    });
    return res.data;
  }
}
