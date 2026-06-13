/**
 * ImagesApi — `/api/v1/images/*`.
 *
 * Two endpoints:
 *   - `GET /images/models`        → catalogue of image models. Each item is
 *                                   `{id, display_name, provider, modality}`
 *                                   plus image-specific fields.
 *   - `POST /images/generations`  → generate an image, returns a file ref.
 *                                   Responds HTTP 201 (resource created).
 *
 * `generate()` writes the output into the caller's workspace (required) at
 * an optional path; the response includes a `file_id` you can turn around
 * and pass to `files.get(id)` for the bytes, or use `url` for a signed
 * download link.
 */

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

  /** Generate an image. Responds HTTP 201 with the written file ref under `data`. */
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
