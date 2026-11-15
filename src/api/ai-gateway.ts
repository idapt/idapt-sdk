

import { executeCommand } from "../core/execute.js";
import { COMMAND_BINDINGS } from "../generated/command-bindings.generated.js";
import type { V1Args, V1Result } from "../generated/resources.generated.js";
import type { HttpContext } from "../http.js";
import type { CallOptions } from "../types.js";

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

  requiredCapabilities?: V1Args<"ai-gateway route-preview">["required_capabilities"];
}

export class AiGatewayApi {
  constructor(private readonly ctx: HttpContext) {}

  async providers(
    opts: AiGatewayProvidersOptions = {},
  ): Promise<V1Result<"ai-gateway providers">["data"]> {
    const res = await executeCommand<V1Result<"ai-gateway providers">>(
      COMMAND_BINDINGS["ai-gateway providers"],
      opts.modelId ? { model_id: opts.modelId } : {},
      this.ctx,
      { signal: opts.signal },
    );
    return res.data;
  }

  async usage(
    opts: AiGatewayUsageOptions = {},
  ): Promise<V1Result<"ai-gateway usage">["data"]> {
    const res = await executeCommand<V1Result<"ai-gateway usage">>(
      COMMAND_BINDINGS["ai-gateway usage"],
      {
        ...(opts.view ? { view: opts.view } : {}),
        ...(opts.workspaceId ? { workspace_id: opts.workspaceId } : {}),
        ...(opts.windowDays ? { window_days: opts.windowDays } : {}),
      },
      this.ctx,
      { signal: opts.signal },
    );
    return res.data;
  }

  routePreview(
    input: AiGatewayRoutePreviewInput,
  ): Promise<V1Result<"ai-gateway route-preview">> {
    const { signal, modelId, workspaceId, promptTokens, requiredCapabilities } =
      input;
    return executeCommand<V1Result<"ai-gateway route-preview">>(
      COMMAND_BINDINGS["ai-gateway route-preview"],
      {
        model_id: modelId,
        ...(workspaceId ? { workspace_id: workspaceId } : {}),
        ...(promptTokens !== undefined ? { prompt_tokens: promptTokens } : {}),
        ...(requiredCapabilities
          ? { required_capabilities: requiredCapabilities }
          : {}),
      },
      this.ctx,
      { signal },
    );
  }
}
