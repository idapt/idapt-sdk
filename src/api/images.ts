

import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  ImageGenerationResult,
  ImageModel,
  ListEnvelope,
  SingleEnvelope,
} from "../types.js";

export interface GenerateImageInput {
  prompt: string;
  workspace_id: string;
  model?: string;
  output_path?: string;
  reference_image_ids?: string[];
  reference_image_paths?: string[];
  aspect_ratio?: string;
}

export class ImagesApi {
  constructor(private readonly ctx: HttpContext) {}

  async listModels(opts: CallOptions = {}): Promise<ImageModel[]> {
    const res = await request<ListEnvelope<ImageModel>>(this.ctx, {
      method: "GET",
      path: "/api/v1/images/models",
      signal: opts.signal,
    });
    return res.data;
  }

  async generate(
    input: GenerateImageInput,
    opts: CallOptions = {},
  ): Promise<ImageGenerationResult> {
    const res = await request<SingleEnvelope<ImageGenerationResult>>(this.ctx, {
      method: "POST",
      path: "/api/v1/images/generations",
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }
}
