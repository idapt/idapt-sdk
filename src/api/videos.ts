

import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  ListEnvelope,
  SingleEnvelope,
  VideoModel,
  VideoModelSearchResult,
} from "../types.js";

export interface SearchVideoModelsInput {
  query?: string;
  provider?: string;
  mode?: "t2v" | "i2v" | "v2v";
  resolution?: string;
  audio?: boolean;
  limit?: number;
  offset?: number;
}

export class VideosApi {
  constructor(private readonly ctx: HttpContext) {}

  async listModels(opts: CallOptions = {}): Promise<VideoModel[]> {
    const res = await request<ListEnvelope<VideoModel>>(this.ctx, {
      method: "GET",
      path: "/api/v1/videos/models",
      signal: opts.signal,
    });
    return res.data;
  }

  async searchModels(
    input: SearchVideoModelsInput = {},
    opts: CallOptions = {},
  ): Promise<VideoModelSearchResult> {
    const res = await request<SingleEnvelope<VideoModelSearchResult>>(
      this.ctx,
      {
        method: "GET",
        path: "/api/v1/videos/models/search",
        query: input as Record<string, unknown>,
        signal: opts.signal,
      },
    );
    return res.data;
  }
}
