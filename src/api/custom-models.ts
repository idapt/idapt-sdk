

import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  DeletedResponse,
  ListEnvelope,
  SingleEnvelope,
} from "../types.js";

const enc = encodeURIComponent;

export interface CustomModel {
  id: string;
  custom_id: string;
  display_name: string;
  icon: string | null;
  color: string | null;
  display_image_url: string | null;
  supports_tools: boolean;
  reasoning: boolean;
  reasoning_mandatory: boolean;
  context_length: number;
  max_output_tokens: number;
  target_provider_connection_id: string;
  api_model_id: string;
  created_at: string;
  updated_at: string;
}

export interface CustomModelCreateInput {
  displayName: string;
  slug?: string;
  icon?: string | null;
  color?: string | null;
  targetProviderConnectionId: string;
  apiModelId: string;
  supportsTools?: boolean;
  reasoning?: boolean;
  reasoningMandatory?: boolean;
  contextLength?: number;
  maxOutputTokens?: number;
  workspaceId?: string;
}

export interface CustomModelUpdateInput {
  displayName?: string;
  icon?: string | null;
  color?: string | null;
  targetProviderConnectionId?: string;
  apiModelId?: string;
  supportsTools?: boolean;
  reasoning?: boolean;
  reasoningMandatory?: boolean;
  contextLength?: number;
  maxOutputTokens?: number;
}

export class CustomModelsApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(
    workspaceId?: string,
    opts: CallOptions = {},
  ): Promise<CustomModel[]> {
    const q = new URLSearchParams();
    if (workspaceId) q.set("workspace_id", workspaceId);
    const qs = q.toString() ? `?${q.toString()}` : "";
    const res = await request<ListEnvelope<CustomModel>>(this.ctx, {
      method: "GET",
      path: `/api/v1/custom-models${qs}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async create(
    input: CustomModelCreateInput,
    opts: CallOptions = {},
  ): Promise<CustomModel> {
    const res = await request<SingleEnvelope<CustomModel>>(this.ctx, {
      method: "POST",
      path: "/api/v1/custom-models",
      body: {
        display_name: input.displayName,
        slug: input.slug,
        icon: input.icon,
        color: input.color,
        target_provider_connection_id: input.targetProviderConnectionId,
        api_model_id: input.apiModelId,
        supports_tools: input.supportsTools,
        reasoning: input.reasoning,
        reasoning_mandatory: input.reasoningMandatory,
        context_length: input.contextLength,
        max_output_tokens: input.maxOutputTokens,
        workspace_id: input.workspaceId,
      },
      signal: opts.signal,
    });
    return res.data;
  }

  async get(ref: string, opts: CallOptions = {}): Promise<CustomModel> {
    const res = await request<SingleEnvelope<CustomModel>>(this.ctx, {
      method: "GET",
      path: `/api/v1/custom-models/${enc(ref)}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async update(
    ref: string,
    patch: CustomModelUpdateInput,
    opts: CallOptions = {},
  ): Promise<CustomModel> {
    const res = await request<SingleEnvelope<CustomModel>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/custom-models/${enc(ref)}`,
      body: {
        display_name: patch.displayName,
        icon: patch.icon,
        color: patch.color,
        target_provider_connection_id: patch.targetProviderConnectionId,
        api_model_id: patch.apiModelId,
        supports_tools: patch.supportsTools,
        reasoning: patch.reasoning,
        reasoning_mandatory: patch.reasoningMandatory,
        context_length: patch.contextLength,
        max_output_tokens: patch.maxOutputTokens,
      },
      signal: opts.signal,
    });
    return res.data;
  }

  async delete(ref: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/custom-models/${enc(ref)}`,
      signal: opts.signal,
    });
  }
}
