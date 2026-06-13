/**
 * ComputersApi — `/api/v1/computers`.
 *
 * Idapt manages daemon-connected computers (user-managed boxes and
 * Idapt-provisioned VMs) as first-class workspace resources. This module is the
 * flat surface over the entire `/api/v1/computers` tree.
 *
 * Verb groups (the route layout is `/computers/:id/<sub>`; flattened here so
 * call sites don't have to instantiate per-computer factories):
 *
 *   - CRUD              — list / create pair token / get / update / delete
 *   - Lifecycle         — archive / unarchive / start / hibernate /
 *                          testConnection
 *   - Exec              — exec (one-shot daemon command)
 *   - Tmux              — tmux (re-attachable windows under `idapt` session)
 *   - SFTP              — sftp (dispatcher), upload / download (binary)
 *   - Firewall          — getFirewall / addFirewallRule / removeFirewallRule
 *                          (managed only)
 *   - Ports             — listPorts / updatePort (managed only)
 *   - Unix users        — listUsers / createUser / updateUser / deleteUser
 *   - User env vars     — listUserEnvVars / createUserEnvVar /
 *                          deleteUserEnvVar / setupUserEnv /
 *                          checkUserEnvSetup / syncUserEnv / checkUserEnvSync
 *   - Pair              — pair (daemon token bootstrap; bearer-overridden,
 *                          mirrors the trigger-fire pattern)
 *
 * Permissions on every authenticated verb default to the caller's
 * `computers:read` / `computers:write` scope. See `lib/computers/Computers.md`
 * for the end-to-end computer model.
 */

import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  Computer,
  ComputerEnvVar,
  ComputerExecResult,
  ComputerFirewallRule,
  ComputerPort,
  ComputerServerInfo,
  ComputerUser,
  DeletedResponse,
  ListEnvelope,
  SftpEntry,
  SingleEnvelope,
  TmuxWindow,
} from "../types.js";

// ============================================================================
//  CRUD inputs
// ============================================================================

export interface ListComputersQuery {
  workspace_id: string;
  limit?: number;
  /** Opaque pagination cursor — echo `pagination.next_cursor`. */
  cursor?: string;
  include_archived?: boolean;
}

export interface CreateComputerInput {
  workspace_id: string;
  /** Preferred computer name; the daemon row is created when this token is redeemed. */
  intended_name?: string;
}

/**
 * Result of `POST /v1/computers/pair-tokens` — a one-time pair token plus
 * the install command. A pair token has no addressable id.
 */
export interface CreateComputerResult {
  token: string;
  expires_at: string;
  install_command: string;
}

/**
 * `PATCH /v1/computers/{id}` body. `name` must match
 * `^[a-z0-9](?:[a-z0-9]|-(?!-))*[a-z0-9]$` (max 64 chars) server-side.
 */
export interface UpdateComputerInput {
  name?: string;
  description?: string | null;
  icon?: string | null;
  logging_level?: "minimal" | "standard" | "full";
}

// ============================================================================
//  Sub-resource inputs
// ============================================================================

export interface ExecCommandInput {
  command: string;
  /** Hard upper bound; default 60s, max 900s. */
  timeout_seconds?: number;
  /** Run as a different POSIX user via `sudo -u`. */
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
  /** `write` — utf-8 content. */
  content?: string;
  /** `rename` — target path. */
  destination?: string;
  /** `chmod` — octal mode string, e.g. "0755". */
  mode?: string;
  /** `chown` — owner name. */
  owner?: string;
  /** `chown` — optional group name (appended as `owner:group`). */
  group?: string;
}

export interface SftpListResult {
  path: string;
  entries: SftpEntry[];
}

export interface SftpUploadInput {
  /** Binary content. Browser `File`/`Blob` both work. */
  file: Blob;
  /** Destination path on the remote computer. */
  path: string;
  /** Relative path when uploading a folder tree; intermediate dirs created. */
  relative_path?: string;
  /** Conflict resolution. Default: `replace`. */
  conflict_mode?: "replace" | "skip";
}

export type TmuxOp = "list" | "run" | "capture" | "send" | "kill";

export interface TmuxInput {
  op: TmuxOp;
  /** Required for run/capture/send/kill. POSIX-safe shape. */
  name?: string;
  /** `run` — the shell command. */
  command?: string;
  /** `run` — optional `cd` prefix. */
  working_dir?: string;
  /** `send` — keys to inject (auto-followed by Enter). */
  keys?: string;
  /** `capture` — number of trailing lines to grab. Default 200. */
  lines?: number;
}

export interface CreateFirewallRuleInput {
  port: number;
  protocol?: "tcp" | "udp";
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
      /** Credential file resourceId the value is sourced from. */
      file_id: string;
      name?: never;
      value?: never;
    }
  | {
      /** Env-var name to create and bind on the user. */
      name: string;
      /** Secret value. Stored server-side in a generated credential file. */
      value: string;
      file_id?: never;
    };

/**
 * `POST /v1/computers/pair` request body. All fields are snake_case on the
 * wire.
 */
export interface PairComputerInput {
  /** One-time pair token minted by the user. */
  token: string;
  hostname: string;
  os: string;
  arch: string;
  cli_version: string;
  default_user: string;
  host_kind: "server" | "desktop";
  kernel_version?: string;
}

/**
 * `POST /v1/computers/pair` result (unwrapped from `{data:{…}}`).
 * `computer_id` is a **resourceId**, not a UUID.
 */
export interface PairComputerResult {
  computer_id: string;
  computer_token: string;
  domain: string;
}

// ============================================================================
//  ComputersApi
// ============================================================================

export class ComputersApi {
  constructor(private readonly ctx: HttpContext) {}

  // ---------------------------------------------------------------------------
  //  CRUD
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  //  Lifecycle
  // ---------------------------------------------------------------------------

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

  /** Wake a hibernated cloud computer. Errors with 409 from non-hibernated states. */
  async start(id: string, opts: CallOptions = {}): Promise<Computer> {
    const res = await request<SingleEnvelope<Computer>>(this.ctx, {
      method: "POST",
      path: `/api/v1/computers/${id}/start`,
      signal: opts.signal,
    });
    return res.data;
  }

  /** Stop a running cloud computer; preserves provider-local disk state. */
  async stop(id: string, opts: CallOptions = {}): Promise<Computer> {
    const res = await request<SingleEnvelope<Computer>>(this.ctx, {
      method: "POST",
      path: `/api/v1/computers/${id}/stop`,
      signal: opts.signal,
    });
    return res.data;
  }

  /** Hibernate a running cloud computer; deallocates compute, snapshots state. */
  async hibernate(id: string, opts: CallOptions = {}): Promise<Computer> {
    const res = await request<SingleEnvelope<Computer>>(this.ctx, {
      method: "POST",
      path: `/api/v1/computers/${id}/hibernate`,
      signal: opts.signal,
    });
    return res.data;
  }

  /**
   * Daemon connectivity probe; returns a success flag + duration.
   * Rate-limited per computer. `serverInfo` is a structured
   * `{version, uptime_seconds}` object (was a free-form blob).
   */
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

  // ---------------------------------------------------------------------------
  //  Exec & tmux
  // ---------------------------------------------------------------------------

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

  /**
   * tmux dispatcher. Each `op` returns a different shape — see the route
   * docs for the per-op payload. Common case: `op: "run"` starts a window,
   * `op: "capture"` reads its output.
   */
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

  /** Convenience over `tmux({ op: "list" })`. */
  async listTmuxWindows(
    id: string,
    opts: CallOptions = {},
  ): Promise<TmuxWindow[]> {
    const result = (await this.tmux(id, { op: "list" }, opts)) as {
      windows: TmuxWindow[];
    };
    return result.windows ?? [];
  }

  // ---------------------------------------------------------------------------
  //  SFTP
  // ---------------------------------------------------------------------------

  /**
   * Unified SFTP dispatcher. Returns op-shaped payload. For streaming
   * uploads/downloads use `sftpUpload` / `sftpDownload`.
   */
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

  /** Convenience: `sftp({op:"list"})` returning the entries array directly. */
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

  /**
   * Multipart upload of a file/folder member. Falls back to single-file mode
   * when `relative_path` is omitted.
   */
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

  /**
   * Stream a remote file (or a folder as `tar.gz`) as a `Blob`. The server
   * sends the real MIME type on `Content-Type`.
   */
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

  // ---------------------------------------------------------------------------
  //  Firewall (managed only)
  // ---------------------------------------------------------------------------

  async getFirewall(
    id: string,
    opts: CallOptions = {},
  ): Promise<{ rules: ComputerFirewallRule[]; [k: string]: unknown }> {
    const res = await request<
      SingleEnvelope<{ rules: ComputerFirewallRule[]; [k: string]: unknown }>
    >(this.ctx, {
      method: "GET",
      path: `/api/v1/computers/${id}/firewall`,
      signal: opts.signal,
    });
    return res.data;
  }

  async addFirewallRule(
    id: string,
    input: CreateFirewallRuleInput,
    opts: CallOptions = {},
  ): Promise<{ rules: ComputerFirewallRule[]; [k: string]: unknown }> {
    const res = await request<
      SingleEnvelope<{ rules: ComputerFirewallRule[]; [k: string]: unknown }>
    >(this.ctx, {
      method: "POST",
      path: `/api/v1/computers/${id}/firewall`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async removeFirewallRule(
    id: string,
    query: { port: number; protocol?: "tcp" | "udp" },
    opts: CallOptions = {},
  ): Promise<{ rules: ComputerFirewallRule[]; [k: string]: unknown }> {
    const res = await request<
      SingleEnvelope<{ rules: ComputerFirewallRule[]; [k: string]: unknown }>
    >(this.ctx, {
      method: "DELETE",
      path: `/api/v1/computers/${id}/firewall`,
      query: { port: query.port, protocol: query.protocol ?? "tcp" },
      signal: opts.signal,
    });
    return res.data;
  }

  // ---------------------------------------------------------------------------
  //  Ports (managed only)
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  //  Unix users
  // ---------------------------------------------------------------------------

  /**
   * List the computer's Unix users. The v1 contract returns a list envelope
   * — `data` is the user array, with `current_user`, `has_root_access` and
   * `has_sudo_access` as sibling top-level keys. This convenience method
   * returns just the array; use `listUsersWithMeta` for the access flags.
   */
  async listUsers(id: string, opts: CallOptions = {}): Promise<ComputerUser[]> {
    return (await this.listUsersWithMeta(id, opts)).data;
  }

  /**
   * Like `listUsers` but returns the full v1 list envelope, including the
   * `current_user` daemon user and the `has_root_access` / `has_sudo_access`
   * capability flags.
   */
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

  /** Fetch one Unix user by username (`GET /v1/computers/{id}/users/{username}`). */
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

  /**
   * Create a Unix user. The user fields are returned directly under `data`.
   * Responds 201 on creation, 200 when the user already existed.
   */
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

  /** Update a Unix user. The user fields are returned directly under `data`. */
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

  // ---------------------------------------------------------------------------
  //  User env vars
  // ---------------------------------------------------------------------------

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

  /**
   * Remove an env-var binding from a user. A binding is addressed by its
   * env-var `name` (the route segment is `{name}`, not a UUID).
   */
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

  /** Bootstrap `~/.idapt-env` + `.bashrc` sourcing on a user. Idempotent. */
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

  /** Rewrite the computer's `~/.idapt-env` from the DB-recorded bindings. */
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

  // ---------------------------------------------------------------------------
  //  Pair (daemon bootstrap)
  // ---------------------------------------------------------------------------

  /**
   * Redeem a one-time pair token for a long-lived computer identity. The
   * token itself is the auth — we swap the bearer for the token on this
   * call only (same pattern as `triggers.fire`).
   *
   * Used by `idapt pair` to bootstrap a daemon. The request body is
   * snake_case; the response is wrapped in the standard `{data:{…}}`
   * envelope. `computer_id` is a resourceId.
   */
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
