

import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  ExecutionBackend,
  ExecutionRun,
  ExecutionRunStatus,
  ListEnvelope,
  SingleEnvelope,
} from "../types.js";

export interface RunCodeInput {
  file_id: string;

  timeout_seconds?: number;

  env?: Record<string, string>;
}

export interface ListExecutionsQuery {
  limit?: number;

  cursor?: string;
  backend?: ExecutionBackend;
  status?: ExecutionRunStatus;
}

export class CodeRunsApi {
  constructor(private readonly ctx: HttpContext) {}

  async run(
    input: RunCodeInput,
    opts: CallOptions = {},
  ): Promise<ExecutionRun> {
    const res = await request<SingleEnvelope<ExecutionRun>>(this.ctx, {
      method: "POST",
      path: "/api/v1/code-runs",
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async list(
    query: ListExecutionsQuery = {},
    opts: CallOptions = {},
  ): Promise<ExecutionRun[]> {
    const res = await request<ListEnvelope<ExecutionRun>>(this.ctx, {
      method: "GET",
      path: "/api/v1/code-runs",
      query,
      signal: opts.signal,
    });
    return res.data;
  }

  async get(id: string, opts: CallOptions = {}): Promise<ExecutionRun> {
    const res = await request<SingleEnvelope<ExecutionRun>>(this.ctx, {
      method: "GET",
      path: `/api/v1/code-runs/${id}`,
      signal: opts.signal,
    });
    return res.data;
  }
}
