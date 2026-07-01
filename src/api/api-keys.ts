

import { type HttpContext, request } from "../http.js";
import type {
  ApiKey,
  CallOptions,
  DeletedResponse,
  ListEnvelope,
  Permission,
  SingleEnvelope,
} from "../types.js";

export interface ListApiKeysQuery {
  limit?: number;

  cursor?: string;
}

export interface CreateApiKeyInput {
  name: string;

  permissions?: Permission[] | null;

  expires_in?: number;
}

export interface UpdateApiKeyInput {
  permissions?: Permission[] | null;
  enabled?: boolean;
}

export interface RotateApiKeyInput {

  grace_period_seconds: 3600 | 86400 | 604800;
}

export interface RotateApiKeyResult extends ApiKey {

  key: string;

  old_key_preview?: string | null;

  grace_period_expires_at: string;
}

export class ApiKeysApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(
    query: ListApiKeysQuery = {},
    opts: CallOptions = {},
  ): Promise<ApiKey[]> {
    const res = await request<ListEnvelope<ApiKey>>(this.ctx, {
      method: "GET",
      path: "/api/v1/api-keys",
      query,
      signal: opts.signal,
    });
    return res.data;
  }

  async create(
    input: CreateApiKeyInput,
    opts: CallOptions = {},
  ): Promise<ApiKey> {
    const res = await request<SingleEnvelope<ApiKey>>(this.ctx, {
      method: "POST",
      path: "/api/v1/api-keys",
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async update(
    id: string,
    input: UpdateApiKeyInput,
    opts: CallOptions = {},
  ): Promise<ApiKey> {
    const res = await request<SingleEnvelope<ApiKey>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/api-keys/${id}`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/api-keys/${id}`,
      signal: opts.signal,
    });
  }

  async rotate(
    id: string,
    input: RotateApiKeyInput,
    opts: CallOptions = {},
  ): Promise<RotateApiKeyResult> {
    const res = await request<SingleEnvelope<RotateApiKeyResult>>(this.ctx, {
      method: "POST",
      path: `/api/v1/api-keys/${id}/rotate`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }
}
