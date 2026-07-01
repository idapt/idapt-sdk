

import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  DeletedResponse,
  ListEnvelope,
  Secret,
  SecretWithValue,
  SingleEnvelope,
} from "../types.js";

export interface ListSecretsOptions extends CallOptions {

  workspaceId?: string;
}

export interface CreateSecretInput {
  name: string;
  value: string;
  description?: string | null;

  type?:
    | "generic"
    | "password"
    | "api_key"
    | "ssh_private_key"
    | "ssh_public_key";

  workspace_id?: string;
}

export interface UpdateSecretInput {

  value?: string;
  description?: string | null;
}

export class SecretsApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(opts: ListSecretsOptions = {}): Promise<Secret[]> {
    const query = opts.workspaceId
      ? `?workspace_id=${encodeURIComponent(opts.workspaceId)}`
      : "";
    const res = await request<ListEnvelope<Secret>>(this.ctx, {
      method: "GET",
      path: `/api/v1/secrets${query}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async get(secretId: string, opts: CallOptions = {}): Promise<Secret> {
    const res = await request<SingleEnvelope<Secret>>(this.ctx, {
      method: "GET",
      path: `/api/v1/secrets/${secretId}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async create(
    input: CreateSecretInput,
    opts: CallOptions = {},
  ): Promise<Secret> {
    const res = await request<SingleEnvelope<Secret>>(this.ctx, {
      method: "POST",
      path: "/api/v1/secrets",
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async update(
    secretId: string,
    input: UpdateSecretInput,
    opts: CallOptions = {},
  ): Promise<Secret> {
    const res = await request<SingleEnvelope<Secret>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/secrets/${secretId}`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async delete(
    secretId: string,
    opts: CallOptions = {},
  ): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/secrets/${secretId}`,
      signal: opts.signal,
    });
  }

  async reveal(
    secretId: string,
    opts: CallOptions = {},
  ): Promise<SecretWithValue> {
    const res = await request<SingleEnvelope<SecretWithValue>>(this.ctx, {
      method: "POST",
      path: `/api/v1/secrets/${secretId}/reveal`,
      signal: opts.signal,
    });
    return res.data;
  }
}
