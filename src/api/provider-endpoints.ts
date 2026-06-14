/**
 * ProviderEndpointsApi — `/api/v1/provider-endpoints`.
 *
 * User-owned BYOK and daemon-local endpoints used by model routing. Provider
 * secrets are write-only: create/update accept `api_key`, but reads only expose
 * `api_key_preview`.
 */

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
  /** Idapt model id, for example `openai/gpt-5.4`. */
  model_id: string;
  /** Upstream provider model id. Defaults server-side to `model_id`. */
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
      path: "/api/v1/provider-endpoints",
      signal: opts.signal,
    });
    return res.data;
  }

  async presets(opts: CallOptions = {}): Promise<ManagedProviderPreset[]> {
    const res = await request<ListEnvelope<ManagedProviderPreset>>(this.ctx, {
      method: "GET",
      path: "/api/v1/provider-endpoints/presets",
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
      path: "/api/v1/provider-endpoints",
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
      path: `/api/v1/provider-endpoints/${id}`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/provider-endpoints/${id}`,
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
        path: `/api/v1/provider-endpoints/${id}/test`,
        signal: opts.signal,
      },
    );
    return res.data;
  }
}
