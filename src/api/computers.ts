

import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  Computer,
  ComputerEnvVar,
  ComputerExecResult,
  ComputerPort,
  ComputerServerInfo,
  ComputerUser,
  DeletedResponse,
  ListEnvelope,
  SftpEntry,
  SingleEnvelope,
  TmuxWindow,
} from "../types.js";

export interface ListComputersQuery {
  workspace_id: string;
  limit?: number;

  cursor?: string;
  include_archived?: boolean;
}

export interface CreateComputerInput {
  workspace_id: string;

  intended_name?: string;
}

export interface CreateComputerResult {
  token: string;
  expires_at: string;
  install_command: string;
}

export interface UpdateComputerInput {
  name?: string;
  description?: string | null;
  icon?: string | null;
  logging_level?: "minimal" | "standard" | "full";
}

export interface ExecCommandInput {
  command: string;

  timeout_seconds?: number;

  user?: string;
}

export type SftpOp =
  | "list"
  | "stat"
  | "write"
  | "mkdir"
  | "rename"
  | "delete"
  | "chmod"
  | "chown";

export interface SftpInput {
  op: SftpOp;
  path: string;

  content?: string;

  destination?: string;

  mode?: string;

  owner?: string;

  group?: string;
}

export interface SftpListResult {
  path: string;
  entries: SftpEntry[];
}

export interface SftpUploadInput {

  file: Blob;

  path: string;

  relative_path?: string;

  conflict_mode?: "replace" | "skip";
}

export type TmuxOp = "list" | "run" | "capture" | "send" | "kill";

export interface TmuxInput {
  op: TmuxOp;

  name?: string;

  command?: string;

  working_dir?: string;

  keys?: string;

  lines?: number;
}

export interface PatchPortInput {
  port: number;
  protocol: string;
  hidden?: boolean;
  display_name?: string | null;
  icon?: string | null;
  description?: string | null;
}

export interface CreateComputerUserInput {
  username: string;
  groups?: string[];
  shell?: string;
}

export interface UpdateComputerUserInput {
  groups?: string[];
}

export type CreateUserEnvVarInput =
  | {

      file_id: string;
      name?: never;
      value?: never;
    }
  | {

      name: string;

      value: string;
      file_id?: never;
    };

export interface PairComputerInput {

  token: string;
  hostname: string;
  os: string;
  arch: string;
  cli_version: string;
  default_user: string;
  host_kind: "server" | "desktop";
  kernel_version?: string;
}

export interface PairComputerResult {
  computer_id: string;
  computer_token: string;
  domain: string;
}

export interface ComputerWorkspaceLink {
  id: string;
  computer_id: string;
  workspace_id: string;
  workspace_resource_id: string | null;
  permissions: unknown[] | null;
  created_by_actor_id: string;
  created_at: number;
  updated_at: number;
}

export class ComputersApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(
    query: ListComputersQuery,
    opts: CallOptions = {},
  ): Promise<Computer[]> {
    const res = await request<ListEnvelope<Computer>>(this.ctx, {
      method: "GET",
      path: "/api/v1/computers",
      query,
      signal: opts.signal,
    });
    return res.data;
  }

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

  async get(id: string, opts: CallOptions = {}): Promise<Computer> {
    const res = await request<SingleEnvelope<Computer>>(this.ctx, {
      method: "GET",
      path: `/api/v1/computers/${id}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async update(
    id: string,
    input: UpdateComputerInput,
    opts: CallOptions = {},
  ): Promise<Computer> {
    const res = await request<SingleEnvelope<Computer>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/computers/${id}`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/computers/${id}`,
      signal: opts.signal,
    });
  }

  async archive(id: string, opts: CallOptions = {}): Promise<Computer> {
    const res = await request<SingleEnvelope<Computer>>(this.ctx, {
      method: "POST",
      path: `/api/v1/computers/${id}/archive`,
      signal: opts.signal,
    });
    return res.data;
  }

  async unarchive(id: string, opts: CallOptions = {}): Promise<Computer> {
    const res = await request<SingleEnvelope<Computer>>(this.ctx, {
      method: "POST",
      path: `/api/v1/computers/${id}/unarchive`,
      signal: opts.signal,
    });
    return res.data;
  }

  async start(id: string, opts: CallOptions = {}): Promise<Computer> {
    const res = await request<SingleEnvelope<Computer>>(this.ctx, {
      method: "POST",
      path: `/api/v1/computers/${id}/start`,
      signal: opts.signal,
    });
    return res.data;
  }

  async stop(id: string, opts: CallOptions = {}): Promise<Computer> {
    const res = await request<SingleEnvelope<Computer>>(this.ctx, {
      method: "POST",
      path: `/api/v1/computers/${id}/stop`,
      signal: opts.signal,
    });
    return res.data;
  }

  async hibernate(id: string, opts: CallOptions = {}): Promise<Computer> {
    const res = await request<SingleEnvelope<Computer>>(this.ctx, {
      method: "POST",
      path: `/api/v1/computers/${id}/hibernate`,
      signal: opts.signal,
    });
    return res.data;
  }

  async testConnection(
    id: string,
    opts: CallOptions = {},
  ): Promise<{
    success: boolean;
    durationMs: number | null;
    serverInfo: ComputerServerInfo | null;
    error: string | null;
  }> {
    const res = await request<
      SingleEnvelope<{
        success: boolean;
        durationMs: number | null;
        serverInfo: ComputerServerInfo | null;
        error: string | null;
      }>
    >(this.ctx, {
      method: "POST",
      path: `/api/v1/computers/${id}/test-connection`,
      signal: opts.signal,
    });
    return res.data;
  }

  async exec(
    id: string,
    input: ExecCommandInput,
    opts: CallOptions = {},
  ): Promise<ComputerExecResult> {
    const res = await request<SingleEnvelope<ComputerExecResult>>(this.ctx, {
      method: "POST",
      path: `/api/v1/computers/${id}/exec`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async tmux(
    id: string,
    input: TmuxInput,
    opts: CallOptions = {},
  ): Promise<Record<string, unknown>> {
    const res = await request<SingleEnvelope<Record<string, unknown>>>(
      this.ctx,
      {
        method: "POST",
        path: `/api/v1/computers/${id}/tmux`,
        body: input,
        signal: opts.signal,
      },
    );
    return res.data;
  }

  async listTmuxWindows(
    id: string,
    opts: CallOptions = {},
  ): Promise<TmuxWindow[]> {
    const result = (await this.tmux(id, { op: "list" }, opts)) as {
      windows: TmuxWindow[];
    };
    return result.windows ?? [];
  }

  async sftp(
    id: string,
    input: SftpInput,
    opts: CallOptions = {},
  ): Promise<Record<string, unknown>> {
    const res = await request<SingleEnvelope<Record<string, unknown>>>(
      this.ctx,
      {
        method: "POST",
        path: `/api/v1/computers/${id}/sftp`,
        body: input,
        signal: opts.signal,
      },
    );
    return res.data;
  }

  async sftpList(
    id: string,
    path: string,
    opts: CallOptions = {},
  ): Promise<SftpListResult> {
    const result = (await this.sftp(id, { op: "list", path }, opts)) as {
      path: string;
      entries: SftpEntry[];
    };
    return result;
  }

  async sftpUpload(
    id: string,
    input: SftpUploadInput,
    opts: CallOptions = {},
  ): Promise<Record<string, unknown>> {
    const form = new FormData();
    form.append("file", input.file);
    form.append("path", input.path);
    if (input.relative_path) form.append("relative_path", input.relative_path);
    if (input.conflict_mode) form.append("conflict_mode", input.conflict_mode);
    const res = await request<SingleEnvelope<Record<string, unknown>>>(
      this.ctx,
      {
        method: "POST",
        path: `/api/v1/computers/${id}/sftp/upload`,
        bodyRaw: form,
        signal: opts.signal,
      },
    );
    return res.data;
  }

  async sftpDownload(
    id: string,
    remotePath: string,
    opts: CallOptions = {},
  ): Promise<Blob> {
    return request<Blob>(this.ctx, {
      method: "GET",
      path: `/api/v1/computers/${id}/sftp/download`,
      query: { path: remotePath },
      expectBlob: true,
      signal: opts.signal,
    });
  }

  async listPorts(
    id: string,
    query: { refresh?: boolean } = {},
    opts: CallOptions = {},
  ): Promise<{
    ports: ComputerPort[];
    discoveryStatus: string;
    discoveryError: string | null;
  }> {
    const res = await request<
      SingleEnvelope<{
        ports: ComputerPort[];
        discoveryStatus: string;
        discoveryError: string | null;
      }>
    >(this.ctx, {
      method: "GET",
      path: `/api/v1/computers/${id}/ports`,
      query: query.refresh ? { refresh: "true" } : undefined,
      signal: opts.signal,
    });
    return res.data;
  }

  async updatePort(
    id: string,
    input: PatchPortInput,
    opts: CallOptions = {},
  ): Promise<ComputerPort> {
    const res = await request<SingleEnvelope<ComputerPort>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/computers/${id}/ports`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
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
      path: `/api/v1/computers/${id}/users`,
      signal: opts.signal,
    });
  }

  async getUser(
    id: string,
    username: string,
    opts: CallOptions = {},
  ): Promise<ComputerUser> {
    const res = await request<SingleEnvelope<ComputerUser>>(this.ctx, {
      method: "GET",
      path: `/api/v1/computers/${id}/users/${username}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async createUser(
    id: string,
    input: CreateComputerUserInput,
    opts: CallOptions = {},
  ): Promise<ComputerUser> {
    const res = await request<SingleEnvelope<ComputerUser>>(this.ctx, {
      method: "POST",
      path: `/api/v1/computers/${id}/users`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async updateUser(
    id: string,
    username: string,
    input: UpdateComputerUserInput,
    opts: CallOptions = {},
  ): Promise<ComputerUser> {
    const res = await request<SingleEnvelope<ComputerUser>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/computers/${id}/users/${username}`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async deleteUser(
    id: string,
    username: string,
    opts: CallOptions = {},
  ): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/computers/${id}/users/${username}`,
      signal: opts.signal,
    });
  }

  async listUserEnvVars(
    id: string,
    username: string,
    opts: CallOptions = {},
  ): Promise<ComputerEnvVar[]> {
    const res = await request<ListEnvelope<ComputerEnvVar>>(this.ctx, {
      method: "GET",
      path: `/api/v1/computers/${id}/users/${username}/env`,
      signal: opts.signal,
    });
    return res.data;
  }

  async createUserEnvVar(
    id: string,
    username: string,
    input: CreateUserEnvVarInput,
    opts: CallOptions = {},
  ): Promise<ComputerEnvVar> {
    const res = await request<SingleEnvelope<ComputerEnvVar>>(this.ctx, {
      method: "POST",
      path: `/api/v1/computers/${id}/users/${username}/env`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async deleteUserEnvVar(
    id: string,
    username: string,
    name: string,
    opts: CallOptions = {},
  ): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/computers/${id}/users/${username}/env/${name}`,
      signal: opts.signal,
    });
  }

  async setupUserEnv(
    id: string,
    username: string,
    opts: CallOptions = {},
  ): Promise<Record<string, unknown>> {
    const res = await request<SingleEnvelope<Record<string, unknown>>>(
      this.ctx,
      {
        method: "POST",
        path: `/api/v1/computers/${id}/users/${username}/env/setup`,
        signal: opts.signal,
      },
    );
    return res.data;
  }

  async checkUserEnvSetup(
    id: string,
    username: string,
    opts: CallOptions = {},
  ): Promise<Record<string, unknown>> {
    const res = await request<SingleEnvelope<Record<string, unknown>>>(
      this.ctx,
      {
        method: "GET",
        path: `/api/v1/computers/${id}/users/${username}/env/setup`,
        signal: opts.signal,
      },
    );
    return res.data;
  }

  async syncUserEnv(
    id: string,
    username: string,
    opts: CallOptions = {},
  ): Promise<Record<string, unknown>> {
    const res = await request<SingleEnvelope<Record<string, unknown>>>(
      this.ctx,
      {
        method: "POST",
        path: `/api/v1/computers/${id}/users/${username}/env/sync`,
        signal: opts.signal,
      },
    );
    return res.data;
  }

  async checkUserEnvSync(
    id: string,
    username: string,
    opts: CallOptions = {},
  ): Promise<Record<string, unknown>> {
    const res = await request<SingleEnvelope<Record<string, unknown>>>(
      this.ctx,
      {
        method: "GET",
        path: `/api/v1/computers/${id}/users/${username}/env/sync`,
        signal: opts.signal,
      },
    );
    return res.data;
  }

  async listWorkspaceLinks(
    id: string,
    opts: CallOptions = {},
  ): Promise<ComputerWorkspaceLink[]> {
    const res = await request<
      SingleEnvelope<{ links: ComputerWorkspaceLink[] }>
    >(this.ctx, {
      method: "GET",
      path: `/api/v1/computers/${id}/workspace-links`,
      signal: opts.signal,
    });
    return res.data.links;
  }

  async linkWorkspace(
    id: string,
    workspaceId: string,
    opts: CallOptions = {},
  ): Promise<ComputerWorkspaceLink> {
    const res = await request<SingleEnvelope<{ link: ComputerWorkspaceLink }>>(
      this.ctx,
      {
        method: "POST",
        path: `/api/v1/computers/${id}/workspace-links`,
        body: { workspace_id: workspaceId },
        signal: opts.signal,
      },
    );
    return res.data.link;
  }

  async unlinkWorkspace(
    id: string,
    workspaceId: string,
    opts: CallOptions = {},
  ): Promise<{ unlinked: boolean }> {
    const res = await request<SingleEnvelope<{ unlinked: boolean }>>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/computers/${id}/workspace-links/${workspaceId}`,
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
    const res = await request<SingleEnvelope<PairComputerResult>>(localCtx, {
      method: "POST",
      path: "/api/v1/computers/pair",
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }
}
