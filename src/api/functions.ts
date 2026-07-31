

import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  DeletedResponse,
  FunctionDeployment,
  FunctionInvokeResult,
  FunctionResource,
  ListEnvelope,
  SingleEnvelope,
} from "../types.js";

export interface ListFunctionsQuery {
  limit?: number;
}

export interface FunctionPermissionInput {
  resource: string;
  access: "read" | "write" | "admin";
  scope?: string;
}

export interface CreateFunctionInput {
  name: string;
  description?: string;
  runtime?: "node" | "python";
  entrypoint?: string;
  auth_mode?: "bearer" | "secret" | "public";
  timeout_seconds?: number;
  permissions?: FunctionPermissionInput[];

  secrets?: string[];
  source_repo_id?: string;
  branch?: string;
  browser_app_id?: string;
}

export interface UpdateFunctionInput {
  description?: string | null;
  auth_mode?: "bearer" | "secret" | "public";
  timeout_seconds?: number;
  permissions?: FunctionPermissionInput[] | null;
  secrets?: string[] | null;
  branch?: string | null;
}

export interface DeployFunctionFile {
  path: string;
  content_b64: string;
}

export interface DeployFunctionInput {
  files: DeployFunctionFile[];
  entrypoint?: string;
  runtime?: "node" | "python";

  promote?: boolean;
}

export interface InvokeFunctionInput {
  method?: string;
  path?: string;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  body?: unknown;
}

const enc = encodeURIComponent;

export class FunctionsApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(
    query: ListFunctionsQuery = {},
    opts: CallOptions = {},
  ): Promise<FunctionResource[]> {
    const res = await request<ListEnvelope<FunctionResource>>(this.ctx, {
      method: "GET",
      path: "/api/v1/functions",
      query,
      signal: opts.signal,
    });
    return res.data;
  }

  async get(id: string, opts: CallOptions = {}): Promise<FunctionResource> {
    const res = await request<SingleEnvelope<FunctionResource>>(this.ctx, {
      method: "GET",
      path: `/api/v1/functions/${enc(id)}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async create(
    input: CreateFunctionInput,
    opts: CallOptions = {},
  ): Promise<FunctionResource> {
    const res = await request<SingleEnvelope<FunctionResource>>(this.ctx, {
      method: "POST",
      path: "/api/v1/functions",
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async update(
    id: string,
    patch: UpdateFunctionInput,
    opts: CallOptions = {},
  ): Promise<FunctionResource> {
    const res = await request<SingleEnvelope<FunctionResource>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/functions/${enc(id)}`,
      body: patch,
      signal: opts.signal,
    });
    return res.data;
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/functions/${enc(id)}`,
      signal: opts.signal,
    });
  }

  async deploy(
    id: string,
    input: DeployFunctionInput,
    opts: CallOptions = {},
  ): Promise<FunctionDeployment> {
    const res = await request<SingleEnvelope<FunctionDeployment>>(this.ctx, {
      method: "POST",
      path: `/api/v1/functions/${enc(id)}/deploy`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async deployments(
    id: string,
    opts: CallOptions = {},
  ): Promise<FunctionDeployment[]> {
    const res = await request<ListEnvelope<FunctionDeployment>>(this.ctx, {
      method: "GET",
      path: `/api/v1/functions/${enc(id)}/deployments`,
      signal: opts.signal,
    });
    return res.data;
  }

  async promote(
    id: string,
    input: { deployment_id: string },
    opts: CallOptions = {},
  ): Promise<FunctionResource> {
    const res = await request<SingleEnvelope<FunctionResource>>(this.ctx, {
      method: "POST",
      path: `/api/v1/functions/${enc(id)}/promote`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async invoke(
    id: string,
    input: InvokeFunctionInput = {},
    opts: CallOptions = {},
  ): Promise<FunctionInvokeResult> {
    const res = await request<SingleEnvelope<FunctionInvokeResult>>(this.ctx, {
      method: "POST",
      path: `/api/v1/functions/${enc(id)}/invoke`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }
}
