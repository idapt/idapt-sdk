

import { type HttpContext, request, requestRaw } from "../http.js";
import type {
  BlobObject,
  CallOptions,
  DeletedResponse,
  ListEnvelope,
  SingleEnvelope,
} from "../types.js";

export interface BlobsListOptions extends CallOptions {

  prefix?: string;
  cursor?: string;
  limit?: number;
}

export interface BlobMeta {
  key: string;
  content_type: string;
  size: number;
  updated_at: string;
}

const enc = encodeURIComponent;

export class BlobsApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(
    namespace: string,
    opts: BlobsListOptions = {},
  ): Promise<BlobMeta[]> {
    const q = new URLSearchParams();
    if (opts.prefix) q.set("prefix", opts.prefix);
    if (opts.cursor) q.set("cursor", opts.cursor);
    if (opts.limit) q.set("limit", String(opts.limit));
    const qs = q.toString() ? `?${q.toString()}` : "";
    const res = await request<ListEnvelope<BlobMeta>>(this.ctx, {
      method: "GET",
      path: `/api/v1/blobs/${enc(namespace)}${qs}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async put(
    namespace: string,
    key: string,
    content: Blob | ArrayBuffer | Uint8Array,
    contentType?: string,
    opts: CallOptions = {},
  ): Promise<BlobObject> {
    const ct =
      contentType ??
      (content instanceof Blob && content.type
        ? content.type
        : "application/octet-stream");

    const blob =
      content instanceof Blob
        ? content
        : new Blob([content as BlobPart], { type: ct });
    const form = new FormData();
    form.set("file", blob, key);
    form.set("content_type", ct);
    const res = await request<SingleEnvelope<BlobObject>>(this.ctx, {
      method: "POST",
      path: `/api/v1/blobs/${enc(namespace)}/${enc(key)}`,

      bodyRaw: form,
      signal: opts.signal,
    });
    return res.data;
  }

  async get(
    namespace: string,
    key: string,
    opts: CallOptions = {},
  ): Promise<{ blob: Blob; contentType: string }> {
    const res = await requestRaw(this.ctx, {
      method: "GET",
      path: `/api/v1/blobs/${enc(namespace)}/${enc(key)}`,
      signal: opts.signal,
      expectJson: false,
    });
    const blob = await res.blob();
    return {
      blob,
      contentType:
        res.headers.get("content-type") ?? "application/octet-stream",
    };
  }

  async head(
    namespace: string,
    key: string,
    opts: CallOptions = {},
  ): Promise<BlobObject> {
    const res = await request<SingleEnvelope<BlobObject>>(this.ctx, {
      method: "GET",
      path: `/api/v1/blobs/${enc(namespace)}/${enc(key)}/meta`,
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
      path: `/api/v1/blobs/${enc(namespace)}/${enc(key)}`,
      signal: opts.signal,
    });
  }

  async createSignedUrl(
    namespace: string,
    key: string,
    expiresIn?: number,
    opts: CallOptions = {},
  ): Promise<{ url: string; expires_at: string }> {
    const res = await request<
      SingleEnvelope<{ url: string; expires_at: string }>
    >(this.ctx, {
      method: "POST",
      path: `/api/v1/blobs/${enc(namespace)}/${enc(key)}/signed-url`,
      body: { expires_in: expiresIn },
      signal: opts.signal,
    });
    return res.data;
  }

  async listNamespaces(opts: CallOptions = {}): Promise<string[]> {
    const res = await request<ListEnvelope<{ namespace: string }>>(this.ctx, {
      method: "GET",
      path: "/api/v1/blobs",
      signal: opts.signal,
    });
    return res.data.map((n) => n.namespace);
  }
}
