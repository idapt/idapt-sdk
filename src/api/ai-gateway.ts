

import { type HttpContext, request } from "../http.js";
import type {
  AiGatewayProvider,
  AiGatewayUsageRow,
  CallOptions,
  ListEnvelope,
} from "../types.js";

export interface AiGatewayProvidersOptions extends CallOptions {

  modelId?: string;
}

export interface AiGatewayUsageOptions extends CallOptions {

  view?: "model" | "provider";

  workspaceId?: string;

  windowDays?: number;
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
}
