

import { type HttpContext, request } from "../http.js";
import type {
  AiGatewayProvider,
  AiGatewayRoutePreview,
  AiGatewayRoutePreviewCapabilities,
  AiGatewayUsageRow,
  CallOptions,
  ListEnvelope,
  SingleEnvelope,
} from "../types.js";

export interface AiGatewayProvidersOptions extends CallOptions {

  modelId?: string;
}

export interface AiGatewayUsageOptions extends CallOptions {

  view?: "model" | "provider";

  workspaceId?: string;

  windowDays?: number;
}

export interface AiGatewayRoutePreviewInput extends CallOptions {

  modelId: string;

  workspaceId?: string;

  promptTokens?: number;

  requiredCapabilities?: AiGatewayRoutePreviewCapabilities;
}

export class AiGatewayApi {
  constructor(private readonly ctx: HttpContext) {}

  async providers(
    opts: AiGatewayProvidersOptions = {},
  ): Promise<AiGatewayProvider[]> {
    const res = await request<ListEnvelope<AiGatewayProvider>>(this.ctx, {
      method: "GET",
      path: "/api/v1/ai-gateway/providers",
      query: opts.modelId ? { model_id: opts.modelId } : undefined,
      signal: opts.signal,
    });
    return res.data;
  }

  async usage(opts: AiGatewayUsageOptions = {}): Promise<AiGatewayUsageRow[]> {
    const res = await request<ListEnvelope<AiGatewayUsageRow>>(this.ctx, {
      method: "GET",
      path: "/api/v1/ai-gateway/usage",
      query: {
        ...(opts.view ? { view: opts.view } : {}),
        ...(opts.workspaceId ? { workspace_id: opts.workspaceId } : {}),
        ...(opts.windowDays ? { window_days: opts.windowDays } : {}),
      },
      signal: opts.signal,
    });
    return res.data;
  }

  async routePreview(
    input: AiGatewayRoutePreviewInput,
  ): Promise<AiGatewayRoutePreview> {
    const { signal, modelId, workspaceId, promptTokens, requiredCapabilities } =
      input;
    const res = await request<SingleEnvelope<AiGatewayRoutePreview>>(this.ctx, {
      method: "POST",
      path: "/api/v1/ai-gateway/routing-preview",
      body: {
        model_id: modelId,
        ...(workspaceId ? { workspace_id: workspaceId } : {}),
        ...(promptTokens !== undefined ? { prompt_tokens: promptTokens } : {}),
        ...(requiredCapabilities
          ? { required_capabilities: requiredCapabilities }
          : {}),
      },
      signal,
    });
    return res.data;
  }
}
