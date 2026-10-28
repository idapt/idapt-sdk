

import { type ExecuteCommandOptions, executeCommand } from "../core/execute.js";
import { COMMAND_BINDINGS } from "../generated/command-bindings.generated.js";
import type { HttpContext } from "../http.js";
import type {
  ImageGenerationResult,
  OperationHandle,
  SpeechResult,
  VideoGenerationResult,
} from "../types.js";

export interface InferenceTextMessage {
  role: "system" | "user" | "assistant" | "tool";
  content?: string | Array<Record<string, unknown>> | null;
  name?: string;
  tool_call_id?: string;
  tool_calls?: Array<Record<string, unknown>>;
}

export interface InferenceTextInput {
  messages: InferenceTextMessage[];
  model?: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stop?: string | string[];
  response_format?: Record<string, unknown>;
  tools?: Array<Record<string, unknown>>;
  tool_choice?: string | Record<string, unknown>;
  workspace_id?: string;

  background?: boolean;
}

export interface InferenceTextResult {
  id?: string | null;
  model: string;
  content: string;
  finish_reason?: string | null;
  tool_calls?: Array<Record<string, unknown>> | null;
  usage?: {
    input_tokens?: number | null;
    output_tokens?: number | null;
    cost_usd?: number | null;
  } | null;
}

export interface InferenceImageInput {
  prompt: string;
  workspace_id: string;
  model?: string;
  output_path?: string;
  reference_image_ids?: string[];
  reference_image_paths?: string[];
  aspect_ratio?: string;
  background?: boolean;
}

export interface InferenceVideoInput {
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

export interface InferenceSpeechInput {
  text: string;
  workspace_id: string;
  model?: string;
  voice?: string;
  speed?: number;
  pitch?: number;
  emotion?: string;
  output_path?: string;
  background?: boolean;
}

export type InferenceOptions = ExecuteCommandOptions;

export class InferenceApi {
  constructor(private readonly ctx: HttpContext) {}

  text(
    input: InferenceTextInput,
    opts: InferenceOptions = {},
  ): Promise<InferenceTextResult | OperationHandle> {
    return executeCommand(
      COMMAND_BINDINGS["inference text"],
      input as unknown as Record<string, unknown>,
      this.ctx,
      opts,
    ) as Promise<InferenceTextResult | OperationHandle>;
  }

  image(
    input: InferenceImageInput,
    opts: InferenceOptions = {},
  ): Promise<ImageGenerationResult | OperationHandle> {
    return executeCommand(
      COMMAND_BINDINGS["inference image"],
      input as unknown as Record<string, unknown>,
      this.ctx,
      opts,
    ) as Promise<ImageGenerationResult | OperationHandle>;
  }

  video(
    input: InferenceVideoInput,
    opts: InferenceOptions = {},
  ): Promise<VideoGenerationResult | OperationHandle> {
    return executeCommand(
      COMMAND_BINDINGS["inference video"],
      input as unknown as Record<string, unknown>,
      this.ctx,
      opts,
    ) as Promise<VideoGenerationResult | OperationHandle>;
  }

  speech(
    input: InferenceSpeechInput,
    opts: InferenceOptions = {},
  ): Promise<SpeechResult | OperationHandle> {
    return executeCommand(
      COMMAND_BINDINGS["inference speech"],
      input as unknown as Record<string, unknown>,
      this.ctx,
      opts,
    ) as Promise<SpeechResult | OperationHandle>;
  }

}
