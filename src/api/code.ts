/**
 * CodeRunsApi — `/api/v1/code-runs`.
 *
 * Two surfaces:
 *   - `POST /code-runs` — execute a code file in a sandboxed Lambda
 *     environment. Returns stdout, stderr, exit code, timing.
 *   - `GET /code-runs` + `GET /code-runs/:id` — history browsing.
 *
 * Browser-apps use `runs.run()` to invoke a file owned by the user (e.g., a
 * Python helper in the data folder) without needing a full computer.
 */

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
  /** Hard upper bound on wall-clock runtime. Default 30s server-side. */
  timeout_seconds?: number;
  /**
   * Environment variables passed to the running code. `IDAPT_API_KEY` is
   * allowed. `AWS_*` and runtime-hijacking vars are stripped server-side.
   */
  env?: Record<string, string>;
}

/**
 * `GET /v1/code-runs` query params. Cursor-paginated (opaque `cursor`);
 * `backend` and `status` are closed enums.
 */
export interface ListExecutionsQuery {
  limit?: number;
  /** Opaque pagination cursor — echo `pagination.next_cursor`. */
  cursor?: string;
  backend?: ExecutionBackend;
  status?: ExecutionRunStatus;
}

export class CodeRunsApi {
  constructor(private readonly ctx: HttpContext) {}

  /**
   * Execute a code file. Returns the full `ExecutionRun` row — `id`,
   * `status`, `stdout`, `stderr`, `exit_code`, and the run timestamps —
   * the same shape as `GET /code-runs/:id`.
   */
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

  /** List recent execution runs. */
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

  /** Get a single execution run by id. */
  async get(id: string, opts: CallOptions = {}): Promise<ExecutionRun> {
    const res = await request<SingleEnvelope<ExecutionRun>>(this.ctx, {
      method: "GET",
      path: `/api/v1/code-runs/${id}`,
      signal: opts.signal,
    });
    return res.data;
  }
}
