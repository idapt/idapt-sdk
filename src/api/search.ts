

import { type HttpContext, request } from "../http.js";
import type { CallOptions, ListEnvelope, SearchResult } from "../types.js";

export interface SearchInput {
  q: string;

  limit?: number;

  cursor?: string;

  source?: string;

  type?: "documents" | "images" | "videos" | "audio" | "folders";

  workspace_id?: string;

  chat_mode?: "title" | "content";
}

export class SearchApi {
  constructor(private readonly ctx: HttpContext) {}

  async search(
    input: SearchInput,
    opts: CallOptions = {},
  ): Promise<SearchResult[]> {
    const res = await request<ListEnvelope<SearchResult>>(this.ctx, {
      method: "GET",
      path: "/api/v1/search",
      query: {
        q: input.q,
        limit: input.limit,
        cursor: input.cursor,
        source: input.source,
        type: input.type,
        workspace_id: input.workspace_id,
        chat_mode: input.chat_mode,
      },
      signal: opts.signal,
    });
    return res.data;
  }
}
