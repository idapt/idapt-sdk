

import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  DatastoreEntry,
  DeletedResponse,
  ListEnvelope,
  SingleEnvelope,
} from "../types.js";

export interface DatastoreListOptions extends CallOptions {

  prefix?: string;
  cursor?: string;
  limit?: number;
}

export interface DatastoreSetOptions extends CallOptions {

  ttlSeconds?: number;
}

const enc = encodeURIComponent;

export class DatastoreApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(
    namespace: string,
    opts: DatastoreListOptions = {},
  ): Promise<{ key: string }[]> {
    const q = new URLSearchParams();
    if (opts.prefix) q.set("prefix", opts.prefix);
    if (opts.cursor) q.set("cursor", opts.cursor);
    if (opts.limit) q.set("limit", String(opts.limit));
    const qs = q.toString() ? `?${q.toString()}` : "";
    const res = await request<ListEnvelope<{ key: string }>>(this.ctx, {
      method: "GET",
      path: `/api/v1/datastore/${enc(namespace)}${qs}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async get(
    namespace: string,
    key: string,
    opts: CallOptions = {},
  ): Promise<DatastoreEntry> {
    const res = await request<SingleEnvelope<DatastoreEntry>>(this.ctx, {
      method: "GET",
      path: `/api/v1/datastore/${enc(namespace)}/${enc(key)}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async set(
    namespace: string,
    key: string,
    value: unknown,
    opts: DatastoreSetOptions = {},
  ): Promise<DatastoreEntry> {
    const res = await request<SingleEnvelope<DatastoreEntry>>(this.ctx, {
      method: "POST",
      path: `/api/v1/datastore/${enc(namespace)}/${enc(key)}`,
      body: { value, ttl_seconds: opts.ttlSeconds },
      signal: opts.signal,
    });
    return res.data;
  }

  async delete(
    namespace: string,
    key: string,
    opts: CallOptions = {},
  ): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/datastore/${enc(namespace)}/${enc(key)}`,
      signal: opts.signal,
    });
  }

  async increment(
    namespace: string,
    key: string,
    by = 1,
    opts: CallOptions = {},
  ): Promise<{ key: string; value: number }> {
    const res = await request<SingleEnvelope<{ key: string; value: number }>>(
      this.ctx,
      {
        method: "POST",
        path: `/api/v1/datastore/${enc(namespace)}/${enc(key)}/increment`,
        body: { by },
        signal: opts.signal,
      },
    );
    return res.data;
  }

  async listNamespaces(opts: CallOptions = {}): Promise<string[]> {
    const res = await request<ListEnvelope<{ namespace: string }>>(this.ctx, {
      method: "GET",
      path: "/api/v1/datastore",
      signal: opts.signal,
    });
    return res.data.map((n) => n.namespace);
  }

  async batchGet(
    namespace: string,
    keys: string[],
    opts: CallOptions = {},
  ): Promise<DatastoreEntry[]> {
    const res = await request<SingleEnvelope<{ entries: DatastoreEntry[] }>>(
      this.ctx,
      {
        method: "POST",
        path: `/api/v1/datastore/${enc(namespace)}`,
        body: { op: "get", keys },
        signal: opts.signal,
      },
    );
    return res.data.entries ?? [];
  }

  async batchSet(
    namespace: string,
    entries: { key: string; value: unknown; ttlSeconds?: number | null }[],
    opts: CallOptions = {},
  ): Promise<number> {
    const res = await request<SingleEnvelope<{ count: number }>>(this.ctx, {
      method: "POST",
      path: `/api/v1/datastore/${enc(namespace)}`,
      body: {
        op: "set",
        entries: entries.map((e) => ({
          key: e.key,
          value: e.value,
          ttl_seconds: e.ttlSeconds,
        })),
      },
      signal: opts.signal,
    });
    return res.data.count ?? 0;
  }

  async batchDelete(
    namespace: string,
    keys: string[],
    opts: CallOptions = {},
  ): Promise<number> {
    const res = await request<SingleEnvelope<{ count: number }>>(this.ctx, {
      method: "POST",
      path: `/api/v1/datastore/${enc(namespace)}`,
      body: { op: "delete", keys },
      signal: opts.signal,
    });
    return res.data.count ?? 0;
  }
}
