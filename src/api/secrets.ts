

import { executeCommand } from "../core/execute.js";
import { COMMAND_BINDINGS } from "../generated/command-bindings.generated.js";
import {
  SecretsApiBase,
  type V1Result,
} from "../generated/resources.generated.js";
import type { CallOptions } from "../types.js";

export interface ListSecretsOptions extends CallOptions {

  workspaceId?: string;
}

export class SecretsApi extends SecretsApiBase {

  async list(
    opts: ListSecretsOptions = {},
  ): Promise<V1Result<"secret list">["data"]> {
    const res = await executeCommand<V1Result<"secret list">>(
      COMMAND_BINDINGS["secret list"],
      opts.workspaceId ? { workspace_id: opts.workspaceId } : {},
      this.ctx,
      { signal: opts.signal },
    );
    return res.data;
  }
}
