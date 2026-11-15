

import { executeCommand } from "../core/execute.js";
import { COMMAND_BINDINGS } from "../generated/command-bindings.generated.js";
import {
  ComputersApiBase,
  type V1Args,
  type V1Result,
} from "../generated/resources.generated.js";
import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  ComputerUser,
  ListEnvelope,
  SingleEnvelope,
  TerminalWindow,
} from "../types.js";

export type {
  CreateComputerUserInput,
  ExecCommandInput,
  FsInput,
  FsOp,
  ListComputersQuery,
  PatchPortInput,
  TerminalInput,
  TerminalOp,
  UpdateComputerInput,
  UpdateComputerUserInput,
} from "../generated/resources.generated.js";

export interface CreateComputerInput {
  workspace_id: string;

  intended_name?: string;
}

export interface CreateComputerResult {
  token: string;
  expires_at: string;
  install_command: string;
}

export type PairComputerInput = V1Args<"computer pair">;

export type PairComputerResult = V1Result<"computer pair">;

export type FsUploadInput = V1Args<"computer upload"> & {

  file: Blob;
};

export type FsListResult = Extract<
  V1Result<"computer fs">,
  { entries: unknown }
>;

export class ComputersApi extends ComputersApiBase {

  readonly localInference = {

    install: (
      id: string,
      input: V1Args<"computer add-local-model">,
      opts: CallOptions = {},
    ): Promise<V1Result<"computer add-local-model">> =>
      executeCommand<V1Result<"computer add-local-model">>(
        COMMAND_BINDINGS["computer add-local-model"],
        { id, ...input },
        this.ctx,
        opts,
      ),

    list: (
      id: string,
      opts: CallOptions = {},
    ): Promise<V1Result<"computer local-models">> =>
      executeCommand<V1Result<"computer local-models">>(
        COMMAND_BINDINGS["computer local-models"],
        { id },
        this.ctx,
        opts,
      ),

    remove: (
      id: string,
      ollamaId: string,
      opts: CallOptions = {},
    ): Promise<V1Result<"computer remove-local-model">> =>
      executeCommand<V1Result<"computer remove-local-model">>(
        COMMAND_BINDINGS["computer remove-local-model"],
        { id, ollama_id: ollamaId },
        this.ctx,
        opts,
      ),

    map: (
      id: string,
      ollamaId: string,
      input: V1Args<"computer local-inference-map"> = {},
      opts: CallOptions = {},
    ): Promise<V1Result<"computer local-inference-map">> =>
      executeCommand<V1Result<"computer local-inference-map">>(
        COMMAND_BINDINGS["computer local-inference-map"],
        { id, ollama_id: ollamaId, ...input },
        this.ctx,
        opts,
      ),

    operations: (
      id: string,
      query: V1Args<"computer local-inference-operations"> = {},
      opts: CallOptions = {},
    ): Promise<V1Result<"computer local-inference-operations">> =>
      executeCommand<V1Result<"computer local-inference-operations">>(
        COMMAND_BINDINGS["computer local-inference-operations"],
        { id, ...query },
        this.ctx,
        opts,
      ),

    cancel: (
      id: string,
      operationId: string,
      opts: CallOptions = {},
    ): Promise<V1Result<"computer local-inference-cancel">> =>
      executeCommand<V1Result<"computer local-inference-cancel">>(
        COMMAND_BINDINGS["computer local-inference-cancel"],
        { id, operation_id: operationId },
        this.ctx,
        opts,
      ),
  };

  async create(
    input: CreateComputerInput,
    opts: CallOptions = {},
  ): Promise<CreateComputerResult> {
    const res = await request<SingleEnvelope<CreateComputerResult>>(this.ctx, {
      method: "POST",
      path: "/api/v1/computers/pair-tokens",
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async pair(
    input: PairComputerInput,
    opts: CallOptions = {},
  ): Promise<PairComputerResult> {
    const localCtx: HttpContext = {
      apiUrl: this.ctx.apiUrl,
      key: input.token,
      fetch: this.ctx.fetch,
    };
    return executeCommand<PairComputerResult>(
      COMMAND_BINDINGS["computer pair"],
      input,
      localCtx,
      opts,
    );
  }

  async fsUpload(
    id: string,
    input: FsUploadInput,
    opts: CallOptions = {},
  ): Promise<V1Result<"computer upload">> {
    return executeCommand<V1Result<"computer upload">>(
      COMMAND_BINDINGS["computer upload"],
      { id, ...input },
      this.ctx,
      opts,
    );
  }

  async listUsers(id: string, opts: CallOptions = {}): Promise<ComputerUser[]> {
    return (await this.listUsersWithMeta(id, opts)).data;
  }

  async listUsersWithMeta(
    id: string,
    opts: CallOptions = {},
  ): Promise<
    ListEnvelope<ComputerUser> & {
      current_user?: string | null;
      has_root_access?: boolean;
      has_sudo_access?: boolean;
    }
  > {
    return request<
      ListEnvelope<ComputerUser> & {
        current_user?: string | null;
        has_root_access?: boolean;
        has_sudo_access?: boolean;
      }
    >(this.ctx, {
      method: "GET",
      path: `/api/v1/computers/${encodeURIComponent(id)}/users`,
      signal: opts.signal,
    });
  }

  async listTerminals(
    id: string,
    opts: CallOptions = {},
  ): Promise<TerminalWindow[]> {
    const result = (await this.terminal(id, { op: "list" }, opts)) as {
      windows?: TerminalWindow[];
    };
    return result.windows ?? [];
  }

  async fsList(
    id: string,
    path: string,
    opts: CallOptions = {},
  ): Promise<FsListResult> {
    return (await this.fs(id, { op: "list", path }, opts)) as FsListResult;
  }
}
