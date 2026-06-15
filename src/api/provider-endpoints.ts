

import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  DeletedResponse,
  ListEnvelope,
  ManagedProviderPreset,
  ProviderEndpoint,
  ProviderEndpointConnectionType,
  ProviderEndpointKind,
  ProviderEndpointModality,
  ProviderEndpointProtocol,
  ProviderEndpointProviderKey,
  ProviderEndpointRuntime,
  ProviderEndpointTestResult,
  ProviderEndpointTransport,
  ProviderEndpointVisibility,
  SingleEnvelope,
} from "../types.js";

export interface ProviderEndpointModelMappingInput {

  model_id: string;

  api_model_id: string;
}

export interface CreateProviderEndpointInput {
  kind?: ProviderEndpointKind;
  provider_key?: ProviderEndpointProviderKey;
  connection_type?: ProviderEndpointConnectionType;
  display_name: string;
  api_key?: string;
  transport?: ProviderEndpointTransport;
  runtime?: ProviderEndpointRuntime | null;
  protocol?: ProviderEndpointProtocol | null;
  computer_id?: string | null;
  local_base_url?: string | null;
  visibility?: ProviderEndpointVisibility;
  base_url?: string | null;
  default_for_kind?: boolean;
  default_modalities?: ProviderEndpointModality[];
  model_mappings?: ProviderEndpointModelMappingInput[];
}

export type UpdateProviderEndpointInput = Partial<
  Omit<CreateProviderEndpointInput, "kind">
> & {
  enabled?: boolean;
};

export class ProviderEndpointsApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(opts: CallOptions = {}): Promise<ProviderEndpoint[]> {
    const res = await request<ListEnvelope<ProviderEndpoint>>(this.ctx, {
      method: "GET",
      path: "/api/v1/ai-gateway/provider-endpoints",
      signal: opts.signal,
    });
    return res.data;
  }

  async presets(opts: CallOptions = {}): Promise<ManagedProviderPreset[]> {
    const res = await request<ListEnvelope<ManagedProviderPreset>>(this.ctx, {
      method: "GET",
      path: "/api/v1/ai-gateway/provider-endpoints/presets",
      signal: opts.signal,
    });
    return res.data;
  }

  async create(
    input: CreateProviderEndpointInput,
    opts: CallOptions = {},
  ): Promise<ProviderEndpoint> {
    const res = await request<SingleEnvelope<ProviderEndpoint>>(this.ctx, {
      method: "POST",
      path: "/api/v1/ai-gateway/provider-endpoints",
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async update(
    id: string,
    input: UpdateProviderEndpointInput,
    opts: CallOptions = {},
  ): Promise<ProviderEndpoint> {
    const res = await request<SingleEnvelope<ProviderEndpoint>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/ai-gateway/provider-endpoints/${id}`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/ai-gateway/provider-endpoints/${id}`,
      signal: opts.signal,
    });
  }

  async test(
    id: string,
    opts: CallOptions = {},
  ): Promise<ProviderEndpointTestResult> {
    const res = await request<SingleEnvelope<ProviderEndpointTestResult>>(
      this.ctx,
      {
        method: "POST",
        path: `/api/v1/ai-gateway/provider-endpoints/${id}/test`,
        signal: opts.signal,
      },
    );
    return res.data;
  }
}
