/**
 * StoreApi — `/api/v1/store/*`.
 *
 * Hub / store surface for browsing and installing community items: skills,
 * agent templates, computer images, workspace templates.
 *
 * Both verbs are feature-gated by FF42 (Hub) server-side. With the flag
 * OFF the routes 404; the SDK relays that as a `NotFoundError`. The CLI's
 * `idapt store` tree gates on the same flag client-side, so visibility of
 * the verbs in `idapt help` matches what the server actually accepts.
 */

import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  ListEnvelope,
  SingleEnvelope,
  StoreInstallResult,
  StoreItem,
  StoreItemType,
} from "../types.js";

export interface SearchStoreQuery {
  q?: string;
  type?: "all" | StoreItemType;
  sort?: "popular" | "recent" | "updated";
  limit?: number;
  /** Opaque pagination cursor — echo `pagination.next_cursor`. */
  cursor?: string;
}

export interface InstallStoreItemInput {
  /** Destination workspace resourceId. */
  workspace_id: string;
  folder_name?: string;
  /** Parent file resourceId to land the installed folder under. */
  target_parent_id?: string | null;
}

export class StoreApi {
  constructor(private readonly ctx: HttpContext) {}

  /**
   * Search the hub. Open envelope — items are heterogeneous (skills carry
   * version/license, agents carry icons/prompts, computer templates carry
   * sizing) so we surface them as `StoreItem` with an open index signature.
   */
  async search(
    query: SearchStoreQuery = {},
    opts: CallOptions = {},
  ): Promise<StoreItem[]> {
    const res = await request<ListEnvelope<StoreItem>>(this.ctx, {
      method: "GET",
      path: "/api/v1/store/search",
      query,
      signal: opts.signal,
    });
    return res.data;
  }

  /**
   * Install a hub item into one of the caller's workspaces. Returns whatever
   * the per-template installer produces (folder ids, agent ids, ...) —
   * `StoreInstallResult` carries the common fields and leaves the rest
   * open.
   */
  async install(
    resourceId: string,
    input: InstallStoreItemInput,
    opts: CallOptions = {},
  ): Promise<StoreInstallResult> {
    const res = await request<SingleEnvelope<StoreInstallResult>>(this.ctx, {
      method: "POST",
      path: `/api/v1/store/${resourceId}/install`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }
}
