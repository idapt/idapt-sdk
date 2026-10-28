

import { executeCommand } from "../core/execute.js";
import { COMMAND_BINDINGS } from "../generated/command-bindings.generated.js";
import { AutomationsApiBase } from "../generated/resources.generated.js";
import type { HttpContext } from "../http.js";
import type { CallOptions } from "../types.js";

export interface FireAutomationInput {

  secret: string;

  body?: Record<string, unknown>;
}

export interface FireAutomationResult {

  id: string;

  run_id: string;

  status: string;
}

export class AutomationsApi extends AutomationsApiBase {

  async fire(
    id: string,
    input: FireAutomationInput,
    opts: CallOptions = {},
  ): Promise<FireAutomationResult> {
    const localCtx: HttpContext = {
      apiUrl: this.ctx.apiUrl,
      key: input.secret,
      fetch: this.ctx.fetch,
    };
    return executeCommand<FireAutomationResult>(
      COMMAND_BINDINGS["automation fire"],
      { id, ...(input.body ?? {}) },
      localCtx,
      opts,
    );
  }
}
