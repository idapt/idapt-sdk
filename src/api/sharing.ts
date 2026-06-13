/**
 * SharingApi — `/api/v1/shares` + `/api/v1/shared-with-me`.
 *
 * One unified surface for managing shares across every resource type
 * (chat / agent / file / workspace) — the v1 route is intentionally a
 * single endpoint that discriminates by `resource_type`, rather than
 * `/v1/chats/:id/shares` etc. The SDK mirrors that shape so we keep
 * the wire and the SDK at parity.
 *
 *   list({ resource_type, resource_id })    → GET    /v1/shares  (query)
 *   add({ resource_type, resource_id, ... }) → POST   /v1/shares  (body)
 *   update({ ... })                         → PATCH  /v1/shares  (triple
 *                                              on query, {permission} body)
 *   remove({ ... })                         → DELETE /v1/shares  (triple
 *                                              on query, no body)
 *   listSharedWithMe(query)                  → GET    /v1/shared-with-me
 *
 * Grantee actor ids on the wire are profile resourceIds. The route
 * resolves them to internal uuids server-side. A share has no standalone
 * `id` — it is keyed by its `(resource_type, resource_id,
 * grantee_actor_id)` triple. PATCH/DELETE carry that triple as QUERY
 * params (not a JSON body); `remove()` echoes the triple back at the
 * top level of the response.
 */

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
  /** Grantee profile resourceId. */
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
  /** Opaque pagination cursor — echo `pagination.next_cursor`. */
  cursor?: string;
}

export class SharingApi {
  constructor(private readonly ctx: HttpContext) {}

  // ---------------------------------------------------------------------------
  //  /v1/shares — share rows on a single resource
  // ---------------------------------------------------------------------------

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

  /**
   * Update a share's permission. The keying triple
   * (`resource_type`, `resource_id`, `grantee_actor_id`) goes on the QUERY
   * string; the request BODY carries only `{ permission }`.
   */
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

  /**
   * Remove a share. The keying triple goes on the QUERY string; the
   * request takes NO body. The response is the removed triple at the TOP
   * LEVEL — `{ deleted, resource_type, resource_id, grantee_actor_id }` —
   * not nested under `data` (a share has no standalone id).
   */
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

  // ---------------------------------------------------------------------------
  //  /v1/shared-with-me — inverse list
  // ---------------------------------------------------------------------------

  /**
   * List resources others have shared with the caller. Omit `resource_type`
   * for the unified view across chats / agents / files / workspaces.
   */
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
