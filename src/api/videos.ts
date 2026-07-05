

import { awaitOperation, type ExecuteCommandOptions } from "../core/execute.js";
import { COMMAND_BINDINGS } from "../generated/command-bindings.generated.js";
import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  ListEnvelope,
  OperationHandle,
  SingleEnvelope,
  VideoGenerationResult,
  VideoModel,
  VideoModelSearchResult,
} from "../types.js";

export interface GenerateVideoInput {
  prompt: string;
  workspace_id: string;
  model?: string;

  duration_seconds?: number;

  resolution?: string;
  aspect_ratio?: string;

  generate_audio?: boolean;
  output_path?: string;

  reference_image_ids?: string[];
  reference_image_paths?: string[];

  video_reference_id?: string;
  video_reference_path?: string;
}

export interface GenerateVideoOptions extends CallOptions {

  wait?: boolean;

  pollIntervalMs?: number;

  maxPollAttempts?: number;
}

export interface SearchVideoModelsInput {
  query?: string;
  provider?: string;
  mode?: "t2v" | "i2v" | "v2v";
  resolution?: string;
  audio?: boolean;
  limit?: number;
  offset?: number;
}

const GENERATE_BINDING = COMMAND_BINDINGS["video generate"];

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

  async generate(
    input: GenerateVideoInput,
    opts: GenerateVideoOptions & { wait: false },
  ): Promise<OperationHandle>;
  async generate(
    input: GenerateVideoInput,
    opts?: GenerateVideoOptions,
  ): Promise<VideoGenerationResult>;
  async generate(
    input: GenerateVideoInput,
    opts: GenerateVideoOptions = {},
  ): Promise<VideoGenerationResult | OperationHandle> {
    const res = await request<SingleEnvelope<OperationHandle>>(this.ctx, {
      method: "POST",
      path: "/api/v1/videos/generations",
      body: input,
      signal: opts.signal,
    });
    const handle = res.data;
    if (opts.wait === false) return handle;

    const pollOpts: ExecuteCommandOptions = {
      signal: opts.signal,
      pollIntervalMs: opts.pollIntervalMs,
      maxPollAttempts: opts.maxPollAttempts,
    };
    return (await awaitOperation(
      GENERATE_BINDING,
      handle.id,
      this.ctx,
      pollOpts,
    )) as VideoGenerationResult;
  }
}
