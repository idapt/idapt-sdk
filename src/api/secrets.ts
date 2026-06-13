/**
 * SecretsApi — `/api/v1/workspaces/:workspace_id/secrets`.
 *
 * Workspace-scoped secrets. Stored server-side as `.credential` files inside
 * the workspace's `.secrets/` folder; the public API masks that detail and
 * presents them as first-class secret resources.
 *
 * Surfaced as a top-level module on `IdaptClient` (`client.secrets.*`) so
 * the call shape stays flat — `client.secrets.list(workspaceId)` mirrors
 * `client.triggers.create(workspaceId, ...)`. The URL stays workspace-scoped.
 *
 * The plaintext `value` is only echoed on the create response (so the
 * caller knows what was stored). Subsequent reads return only metadata +
 * a short `value_preview`. To rotate, PATCH with a new value; to read a
 * full secret value, mount it into a runtime env-var binding instead.
 *
 * Requires `change-settings` on the workspace (owners + admins). Non-members
 * see "Workspace not found" rather than "forbidden" — same posture as the
 * rest of v1.
 */

import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  DeletedResponse,
  ListEnvelope,
  Secret,
  SingleEnvelope,
} from "../types.js";

export interface CreateSecretInput {
  name: string;
  value: string;
  description?: string;
  /** Optional ISO-8601 expiry timestamp (snake_case on the wire). */
  expires_at?: string | null;
}

export interface UpdateSecretInput {
  /** Pass a new plaintext to rotate. Omit to leave unchanged. */
  value?: string;
  description?: string | null;
  /** Renames are file-level: the underlying `.credential` filename moves. */
  name?: string;
  /** Optional ISO-8601 expiry timestamp (snake_case on the wire). */
  expires_at?: string | null;
}

export class SecretsApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(workspaceId: string, opts: CallOptions = {}): Promise<Secret[]> {
    const res = await request<ListEnvelope<Secret>>(this.ctx, {
      method: "GET",
      path: `/api/v1/workspaces/${workspaceId}/secrets`,
      signal: opts.signal,
    });
    return res.data;
  }

  async create(
    workspaceId: string,
    input: CreateSecretInput,
    opts: CallOptions = {},
  ): Promise<Secret> {
    const res = await request<SingleEnvelope<Secret>>(this.ctx, {
      method: "POST",
      path: `/api/v1/workspaces/${workspaceId}/secrets`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async get(
    workspaceId: string,
    secretId: string,
    opts: CallOptions = {},
  ): Promise<Secret> {
    const res = await request<SingleEnvelope<Secret>>(this.ctx, {
      method: "GET",
      path: `/api/v1/workspaces/${workspaceId}/secrets/${secretId}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async update(
    workspaceId: string,
    secretId: string,
    input: UpdateSecretInput,
    opts: CallOptions = {},
  ): Promise<Secret> {
    const res = await request<SingleEnvelope<Secret>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/workspaces/${workspaceId}/secrets/${secretId}`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async delete(
    workspaceId: string,
    secretId: string,
    opts: CallOptions = {},
  ): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/workspaces/${workspaceId}/secrets/${secretId}`,
      signal: opts.signal,
    });
  }
}
