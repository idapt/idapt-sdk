

import { type HttpContext, request } from "../http.js";
import type {
  AudioModel,
  CallOptions,
  ListEnvelope,
  TtsVoice,
} from "../types.js";

export interface ListVoicesInput {
  language?: string;
  gender?: "male" | "female" | "neutral";
}

export class AudioApi {
  constructor(private readonly ctx: HttpContext) {}

  async listModels(opts: CallOptions = {}): Promise<AudioModel[]> {
    const res = await request<ListEnvelope<AudioModel>>(this.ctx, {
      method: "GET",
      path: "/api/v1/audio/models",
      signal: opts.signal,
    });
    return res.data;
  }

  async listVoices(
    input: ListVoicesInput = {},
    opts: CallOptions = {},
  ): Promise<TtsVoice[]> {
    const res = await request<ListEnvelope<TtsVoice>>(this.ctx, {
      method: "GET",
      path: "/api/v1/audio/voices",
      query: input as Record<string, unknown>,
      signal: opts.signal,
    });
    return res.data;
  }
}
