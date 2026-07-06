

import { type HttpContext, request, requestRaw } from "../http.js";
import type {
  CallOptions,
  DeletedResponse,
  ListEnvelope,
  SingleEnvelope,
  TableCollection,
  TableRecord,
} from "../types.js";

export interface TableField {
  key: string;
  name: string;
  type: string;
  options?: unknown[];
  required?: boolean;
  default?: unknown;
}
export interface CollectionSchemaInput {
  fields: TableField[];
}
export interface CreateCollectionInput {
  name: string;
  description?: string | null;
  icon?: string | null;
  schema?: CollectionSchemaInput;
  workspace_id?: string;
}
export interface UpdateCollectionInput {
  name?: string;
  description?: string | null;
  icon?: string | null;
  schema?: CollectionSchemaInput;
}
export interface TableQuery {
  where?: unknown;
  sort?: { field: string; dir?: "asc" | "desc" }[];
  limit?: number;
  cursor?: string;
}

const enc = encodeURIComponent;

export class TablesApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(
    opts: CallOptions & {
      workspaceId?: string;
      cursor?: string;
      limit?: number;
    } = {},
  ): Promise<TableCollection[]> {
    const q = new URLSearchParams();
    if (opts.workspaceId) q.set("workspace_id", opts.workspaceId);
    if (opts.cursor) q.set("cursor", opts.cursor);
    if (opts.limit) q.set("limit", String(opts.limit));
    const qs = q.toString() ? `?${q.toString()}` : "";
    const res = await request<ListEnvelope<TableCollection>>(this.ctx, {
      method: "GET",
      path: `/api/v1/tables${qs}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async get(id: string, opts: CallOptions = {}): Promise<TableCollection> {
    const res = await request<SingleEnvelope<TableCollection>>(this.ctx, {
      method: "GET",
      path: `/api/v1/tables/${enc(id)}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async create(
    input: CreateCollectionInput,
    opts: CallOptions = {},
  ): Promise<TableCollection> {
    const res = await request<SingleEnvelope<TableCollection>>(this.ctx, {
      method: "POST",
      path: "/api/v1/tables",
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async update(
    id: string,
    input: UpdateCollectionInput,
    opts: CallOptions = {},
  ): Promise<TableCollection> {
    const res = await request<SingleEnvelope<TableCollection>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/tables/${enc(id)}`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/tables/${enc(id)}`,
      signal: opts.signal,
    });
  }

  async query(
    id: string,
    query: TableQuery = {},
    opts: CallOptions = {},
  ): Promise<TableRecord[]> {
    const res = await request<ListEnvelope<TableRecord>>(this.ctx, {
      method: "POST",
      path: `/api/v1/tables/${enc(id)}/query`,
      body: query,
      signal: opts.signal,
    });
    return res.data;
  }

  async createRecord(
    id: string,
    values: Record<string, unknown>,
    opts: CallOptions = {},
  ): Promise<TableRecord> {
    const res = await request<SingleEnvelope<TableRecord>>(this.ctx, {
      method: "POST",
      path: `/api/v1/tables/${enc(id)}/records`,
      body: { values },
      signal: opts.signal,
    });
    return res.data;
  }

  async getRecord(
    id: string,
    recordId: string,
    opts: CallOptions = {},
  ): Promise<TableRecord> {
    const res = await request<SingleEnvelope<TableRecord>>(this.ctx, {
      method: "GET",
      path: `/api/v1/tables/${enc(id)}/records/${enc(recordId)}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async updateRecord(
    id: string,
    recordId: string,
    values: Record<string, unknown>,
    opts: CallOptions = {},
  ): Promise<TableRecord> {
    const res = await request<SingleEnvelope<TableRecord>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/tables/${enc(id)}/records/${enc(recordId)}`,
      body: { values },
      signal: opts.signal,
    });
    return res.data;
  }

  async deleteRecord(
    id: string,
    recordId: string,
    opts: CallOptions = {},
  ): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/tables/${enc(id)}/records/${enc(recordId)}`,
      signal: opts.signal,
    });
  }

  async exportCsv(id: string, opts: CallOptions = {}): Promise<string> {
    const res = await requestRaw(this.ctx, {
      method: "GET",
      path: `/api/v1/tables/${enc(id)}/export`,
      signal: opts.signal,
      expectJson: false,
    });
    return res.text();
  }

  async importCsv(
    id: string,
    csv: string,
    opts: CallOptions = {},
  ): Promise<{ imported: number }> {
    const res = await request<SingleEnvelope<{ imported: number }>>(this.ctx, {
      method: "POST",
      path: `/api/v1/tables/${enc(id)}/import`,
      body: { csv },
      signal: opts.signal,
    });
    return res.data;
  }
}
