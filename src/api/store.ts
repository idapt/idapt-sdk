

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

  cursor?: string;
}

export interface InstallStoreItemInput {

  workspace_id: string;
  folder_name?: string;

  target_parent_id?: string | null;
}

export class StoreApi {
  constructor(private readonly ctx: HttpContext) {}

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
