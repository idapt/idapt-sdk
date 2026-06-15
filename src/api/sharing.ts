

import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  ListEnvelope,
  Share,
  ShareDeletedResult,
  SharedWithMeItem,
  SharePermission,
  ShareResourceType,
  SingleEnvelope,
} from "../types.js";

export interface ListSharesQuery {
  resource_type: ShareResourceType;
  resource_id: string;
}

export interface CreateShareInput {
  resource_type: ShareResourceType;
  resource_id: string;

  grantee_actor_id: string;
  permission: SharePermission;
}

export type UpdateShareInput = CreateShareInput;

export interface RemoveShareInput {
  resource_type: ShareResourceType;
  resource_id: string;
  grantee_actor_id: string;
}

export interface ListSharedWithMeQuery {
  resource_type?: ShareResourceType;
  limit?: number;

  cursor?: string;
}

export class SharingApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(query: ListSharesQuery, opts: CallOptions = {}): Promise<Share[]> {
    const res = await request<ListEnvelope<Share>>(this.ctx, {
      method: "GET",
      path: "/api/v1/shares",
      query,
      signal: opts.signal,
    });
    return res.data;
  }

  async add(input: CreateShareInput, opts: CallOptions = {}): Promise<Share> {
    const res = await request<SingleEnvelope<Share>>(this.ctx, {
      method: "POST",
      path: "/api/v1/shares",
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async update(
    input: UpdateShareInput,
    opts: CallOptions = {},
  ): Promise<Share> {
    const res = await request<SingleEnvelope<Share>>(this.ctx, {
      method: "PATCH",
      path: "/api/v1/shares",
      query: {
        resource_type: input.resource_type,
        resource_id: input.resource_id,
        grantee_actor_id: input.grantee_actor_id,
      },
      body: { permission: input.permission },
      signal: opts.signal,
    });
    return res.data;
  }

  async remove(
    input: RemoveShareInput,
    opts: CallOptions = {},
  ): Promise<ShareDeletedResult> {
    return request<ShareDeletedResult>(this.ctx, {
      method: "DELETE",
      path: "/api/v1/shares",
      query: input,
      signal: opts.signal,
    });
  }

  async listSharedWithMe(
    query: ListSharedWithMeQuery = {},
    opts: CallOptions = {},
  ): Promise<SharedWithMeItem[]> {
    const res = await request<ListEnvelope<SharedWithMeItem>>(this.ctx, {
      method: "GET",
      path: "/api/v1/shared-with-me",
      query,
      signal: opts.signal,
    });
    return res.data;
  }
}
