/**
 * SearchApi — `GET /api/v1/search`.
 *
 * Full-text search across the user's accessible content (files, chats,
 * agents, etc.). Results are loosely shaped — caller narrows via `.type`.
 */

import { type HttpContext, request } from "../http.js";
import type { CallOptions, ListEnvelope, SearchResult } from "../types.js";

export interface SearchInput {
  q: string;
  /** Page size — capped at 50 server-side for search (default 50). */
  limit?: number;
  /**
   * Opaque pagination cursor — `GET /v1/search` is cursor-paginated.
   * Echo `pagination.next_cursor` from the previous page.
   */
  cursor?: string;
  /** Comma-separated source filter, e.g. `file` or `chat_message,chat`. */
  source?: string;
  /** File type filter when searching files. */
  type?: "documents" | "images" | "videos" | "audio" | "folders";
  /** Workspace resourceId to scope results. */
  workspace_id?: string;
  /** Chat-only search mode when source is omitted. */
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
