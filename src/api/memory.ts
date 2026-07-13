

import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  DeletedResponse,
  ListEnvelope,
  SingleEnvelope,
} from "../types.js";

export interface MemoryBox {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

export interface MemoryNote {
  id: string;
  title: string;
  content: string;
  kind: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface MemoryHit {
  id: string;
  title: string;
  snippet: string;
  score: number;
}

export interface MemoryBoxUpdateInput {
  name?: string;
  description?: string | null;
  icon?: string | null;
}

export interface MemoryWriteInput {
  title: string;
  content: string;
  expectedUpdatedAt?: number;
}

const enc = encodeURIComponent;

class MemoryBoxesApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(
    workspaceId?: string,
    opts: CallOptions = {},
  ): Promise<MemoryBox[]> {
    const q = new URLSearchParams();
    if (workspaceId) q.set("workspace_id", workspaceId);
    const qs = q.toString() ? `?${q.toString()}` : "";
    const res = await request<ListEnvelope<MemoryBox>>(this.ctx, {
      method: "GET",
      path: `/api/v1/memory/boxes${qs}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async get(ref: string, opts: CallOptions = {}): Promise<MemoryBox> {
    const res = await request<SingleEnvelope<MemoryBox>>(this.ctx, {
      method: "GET",
      path: `/api/v1/memory/boxes/${enc(ref)}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async update(
    ref: string,
    patch: MemoryBoxUpdateInput,
    opts: CallOptions = {},
  ): Promise<MemoryBox> {
    const res = await request<SingleEnvelope<MemoryBox>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/memory/boxes/${enc(ref)}`,
      body: {
        name: patch.name,
        description: patch.description,
        icon: patch.icon,
      },
      signal: opts.signal,
    });
    return res.data;
  }

  async delete(ref: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/memory/boxes/${enc(ref)}`,
      signal: opts.signal,
    });
  }
}

class MemoryNotesApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(boxRef: string, opts: CallOptions = {}): Promise<MemoryNote[]> {
    const res = await request<ListEnvelope<MemoryNote>>(this.ctx, {
      method: "GET",
      path: `/api/v1/memory/boxes/${enc(boxRef)}/notes`,
      signal: opts.signal,
    });
    return res.data;
  }

  async read(
    boxRef: string,
    title: string,
    opts: CallOptions = {},
  ): Promise<MemoryNote> {
    const res = await request<SingleEnvelope<MemoryNote>>(this.ctx, {
      method: "GET",
      path: `/api/v1/memory/boxes/${enc(boxRef)}/note?title=${enc(title)}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async write(
    boxRef: string,
    input: MemoryWriteInput,
    opts: CallOptions = {},
  ): Promise<MemoryNote> {
    const res = await request<SingleEnvelope<MemoryNote>>(this.ctx, {
      method: "POST",
      path: `/api/v1/memory/boxes/${enc(boxRef)}/notes`,
      body: {
        title: input.title,
        content: input.content,
        expected_updated_at: input.expectedUpdatedAt,
      },
      signal: opts.signal,
    });
    return res.data;
  }

  async delete(
    boxRef: string,
    title: string,
    opts: CallOptions = {},
  ): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/memory/boxes/${enc(boxRef)}/note?title=${enc(title)}`,
      signal: opts.signal,
    });
  }
}

class MemoryIndexApi {
  constructor(private readonly ctx: HttpContext) {}

  async read(boxRef: string, opts: CallOptions = {}): Promise<MemoryNote> {
    const res = await request<SingleEnvelope<MemoryNote>>(this.ctx, {
      method: "GET",
      path: `/api/v1/memory/boxes/${enc(boxRef)}/index`,
      signal: opts.signal,
    });
    return res.data;
  }

  async write(
    boxRef: string,
    content: string,
    opts: CallOptions = {},
  ): Promise<MemoryNote> {
    const res = await request<SingleEnvelope<MemoryNote>>(this.ctx, {
      method: "POST",
      path: `/api/v1/memory/boxes/${enc(boxRef)}/index`,
      body: { content },
      signal: opts.signal,
    });
    return res.data;
  }
}

export class MemoryApi {
  readonly boxes: MemoryBoxesApi;
  readonly notes: MemoryNotesApi;
  readonly index: MemoryIndexApi;

  constructor(private readonly ctx: HttpContext) {
    this.boxes = new MemoryBoxesApi(ctx);
    this.notes = new MemoryNotesApi(ctx);
    this.index = new MemoryIndexApi(ctx);
  }

  async search(
    boxRef: string,
    q: string,
    limit = 20,
    opts: CallOptions = {},
  ): Promise<MemoryHit[]> {
    const res = await request<ListEnvelope<MemoryHit>>(this.ctx, {
      method: "GET",
      path: `/api/v1/memory/boxes/${enc(boxRef)}/search?q=${enc(q)}&limit=${limit}`,
      signal: opts.signal,
    });
    return res.data;
  }
}
