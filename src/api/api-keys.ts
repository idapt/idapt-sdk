/**
 * ApiKeysApi — `/api/v1/api-keys`.
 *
 * Each user can mint long-lived `uk_` keys to authenticate scripts, CLIs,
 * and external integrations against the v1 API. Keys are scoped by the
 * `Permission[]` passed at creation time (omit for full-access).
 *
 * Constraints inherited from the route:
 *   - Paid tier only (free tier has `MAX_API_KEYS = 0`).
 *   - Per-tier cap on total keys + per-tier max expiration window.
 *   - Header-auth (using an API key) cannot list, create, modify, or revoke
 *     other API keys — only the first-party session-cookie path is allowed. This SDK
 *     mirrors the rule: when you talk to it with a `uk_` key, these calls
 *     will 403.
 *   - Plaintext key value is returned ONCE on `create` and never again —
 *     the server only persists the hash.
 */

import { type HttpContext, request } from "../http.js";
import type {
  ApiKey,
  CallOptions,
  DeletedResponse,
  ListEnvelope,
  Permission,
  SingleEnvelope,
} from "../types.js";

export interface ListApiKeysQuery {
  limit?: number;
  /** Opaque pagination cursor — echo `pagination.next_cursor`. */
  cursor?: string;
}

export interface CreateApiKeyInput {
  name: string;
  /**
   * Permission set. Omit / null → full access (capability of caller).
   * For "all scopes, read-only" use `[{ resource: "*", access: "read" }]`.
   */
  permissions?: Permission[] | null;
  /**
   * Seconds from now until expiration. `0` is non-expiring (Max tier only).
   * Omit to use the tier-default maximum.
   */
  expires_in?: number;
}

export interface UpdateApiKeyInput {
  permissions?: Permission[] | null;
  enabled?: boolean;
}

export interface RotateApiKeyInput {
  /** 1 hour, 24 hours, or 7 days. */
  grace_period_seconds: 3600 | 86400 | 604800;
}

export interface RotateApiKeyResult extends ApiKey {
  /** Plaintext replacement key — present only on the rotate response. */
  key: string;
  /** Preview/fingerprint of the old key being rotated out. */
  old_key_preview?: string | null;
  /** ISO timestamp when the old key stops authenticating. */
  grace_period_expires_at: string;
}

export class ApiKeysApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(
    query: ListApiKeysQuery = {},
    opts: CallOptions = {},
  ): Promise<ApiKey[]> {
    const res = await request<ListEnvelope<ApiKey>>(this.ctx, {
      method: "GET",
      path: "/api/v1/api-keys",
      query,
      signal: opts.signal,
    });
    return res.data;
  }

  /**
   * Mint a new API key. The returned object includes a one-shot `key` field
   * with the plaintext — store it immediately, there is no way to retrieve
   * it later.
   */
  async create(
    input: CreateApiKeyInput,
    opts: CallOptions = {},
  ): Promise<ApiKey> {
    const res = await request<SingleEnvelope<ApiKey>>(this.ctx, {
      method: "POST",
      path: "/api/v1/api-keys",
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async update(
    id: string,
    input: UpdateApiKeyInput,
    opts: CallOptions = {},
  ): Promise<ApiKey> {
    const res = await request<SingleEnvelope<ApiKey>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/api-keys/${id}`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  /** Revoke (delete) a key. Subsequent calls with that key 401. */
  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/api-keys/${id}`,
      signal: opts.signal,
    });
  }

  /**
   * Rotate a key and return the replacement plaintext once. API-key
   * management remains first-party session-only on the server, so calls made
   * with a raw `uk_` bearer key receive 403.
   */
  async rotate(
    id: string,
    input: RotateApiKeyInput,
    opts: CallOptions = {},
  ): Promise<RotateApiKeyResult> {
    const res = await request<SingleEnvelope<RotateApiKeyResult>>(this.ctx, {
      method: "POST",
      path: `/api/v1/api-keys/${id}/rotate`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }
}
