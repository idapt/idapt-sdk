

import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  DeletedResponse,
  ListEnvelope,
  SingleEnvelope,
} from "../types.js";

export interface NoteBox {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  kind: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface NoteHit {
  id: string;
  title: string;
  snippet: string;
  note_box_id: string | null;
  note_box_name: string | null;
  score: number;
}

export interface NoteLinkRef {
  id: string;
  title: string;
  snippet: string;
  note_box_id: string;
}

export interface NoteLinks {
  forward: NoteLinkRef[];
  back: NoteLinkRef[];
}

export interface NoteGraph {
  nodes: { id: string; title: string; kind: string }[];
  links: { source: string; target: string }[];
}

export interface NoteBoxCreateInput {
  name: string;
  description?: string | null;
  icon?: string | null;
  workspaceId?: string;
}

export interface NoteBoxUpdateInput {
  name?: string;
  description?: string | null;
  icon?: string | null;
}

export interface NoteWriteInput {
  title: string;
  content: string;

  expectedUpdatedAt?: number;
}

export interface NotesSearchAllOptions extends CallOptions {

  boxIds?: string[];
  workspaceId?: string;
  limit?: number;
}

const enc = encodeURIComponent;

class NoteBoxesApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(workspaceId?: string, opts: CallOptions = {}): Promise<NoteBox[]> {
    const q = new URLSearchParams();
    if (workspaceId) q.set("workspace_id", workspaceId);
    const qs = q.toString() ? `?${q.toString()}` : "";
    const res = await request<ListEnvelope<NoteBox>>(this.ctx, {
      method: "GET",
      path: `/api/v1/notes/boxes${qs}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async create(
    input: NoteBoxCreateInput,
    opts: CallOptions = {},
  ): Promise<NoteBox> {
    const res = await request<SingleEnvelope<NoteBox>>(this.ctx, {
      method: "POST",
      path: "/api/v1/notes/boxes",
      body: {
        name: input.name,
        description: input.description,
        icon: input.icon,
        workspace_id: input.workspaceId,
      },
      signal: opts.signal,
    });
    return res.data;
  }

  async get(ref: string, opts: CallOptions = {}): Promise<NoteBox> {
    const res = await request<SingleEnvelope<NoteBox>>(this.ctx, {
      method: "GET",
      path: `/api/v1/notes/boxes/${enc(ref)}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async update(
    ref: string,
    patch: NoteBoxUpdateInput,
    opts: CallOptions = {},
  ): Promise<NoteBox> {
    const res = await request<SingleEnvelope<NoteBox>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/notes/boxes/${enc(ref)}`,
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
      path: `/api/v1/notes/boxes/${enc(ref)}`,
      signal: opts.signal,
    });
  }
}

class NoteItemsApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(boxRef: string, opts: CallOptions = {}): Promise<Note[]> {
    const res = await request<ListEnvelope<Note>>(this.ctx, {
      method: "GET",
      path: `/api/v1/notes/boxes/${enc(boxRef)}/notes`,
      signal: opts.signal,
    });
    return res.data;
  }

  async read(
    boxRef: string,
    title: string,
    opts: CallOptions = {},
  ): Promise<Note> {
    const q = new URLSearchParams({ title });
    const res = await request<SingleEnvelope<Note>>(this.ctx, {
      method: "GET",
      path: `/api/v1/notes/boxes/${enc(boxRef)}/note?${q.toString()}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async write(
    boxRef: string,
    input: NoteWriteInput,
    opts: CallOptions = {},
  ): Promise<Note> {
    const res = await request<SingleEnvelope<Note>>(this.ctx, {
      method: "POST",
      path: `/api/v1/notes/boxes/${enc(boxRef)}/notes`,
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
    const q = new URLSearchParams({ title });
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/notes/boxes/${enc(boxRef)}/note?${q.toString()}`,
      signal: opts.signal,
    });
  }

  async rename(
    boxRef: string,
    title: string,
    newTitle: string,
    opts: CallOptions & { retargetWikilinks?: boolean } = {},
  ): Promise<{ note: Note; retargetedCount: number }> {
    const res = await request<
      SingleEnvelope<{ note: Note; retargeted_count: number }>
    >(this.ctx, {
      method: "POST",
      path: `/api/v1/notes/boxes/${enc(boxRef)}/notes/rename`,
      body: {
        title,
        new_title: newTitle,
        retarget_wikilinks: opts.retargetWikilinks ?? false,
      },
      signal: opts.signal,
    });
    return { note: res.data.note, retargetedCount: res.data.retargeted_count };
  }
}

class NoteTagsApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(boxRef: string, opts: CallOptions = {}): Promise<NoteTagCount[]> {
    const res = await request<ListEnvelope<NoteTagCount>>(this.ctx, {
      method: "GET",
      path: `/api/v1/notes/boxes/${enc(boxRef)}/tags`,
      signal: opts.signal,
    });
    return res.data;
  }

  async rename(
    boxRef: string,
    oldTag: string,
    newTag: string,
    opts: CallOptions = {},
  ): Promise<{ renamedCount: number }> {
    const res = await request<SingleEnvelope<{ renamed_count: number }>>(
      this.ctx,
      {
        method: "POST",
        path: `/api/v1/notes/boxes/${enc(boxRef)}/tags/rename`,
        body: { old_tag: oldTag, new_tag: newTag },
        signal: opts.signal,
      },
    );
    return { renamedCount: res.data.renamed_count };
  }
}

class NoteIndexApi {
  constructor(private readonly ctx: HttpContext) {}

  async read(boxRef: string, opts: CallOptions = {}): Promise<Note> {
    const res = await request<SingleEnvelope<Note>>(this.ctx, {
      method: "GET",
      path: `/api/v1/notes/boxes/${enc(boxRef)}/index`,
      signal: opts.signal,
    });
    return res.data;
  }

  async write(
    boxRef: string,
    content: string,
    opts: CallOptions = {},
  ): Promise<Note> {
    const res = await request<SingleEnvelope<Note>>(this.ctx, {
      method: "POST",
      path: `/api/v1/notes/boxes/${enc(boxRef)}/index`,
      body: { content },
      signal: opts.signal,
    });
    return res.data;
  }
}

export interface NoteTagCount {
  tag: string;
  count: number;
}

export class NotesApi {

  readonly boxes: NoteBoxesApi;

  readonly notes: NoteItemsApi;

  readonly index: NoteIndexApi;

  readonly tags: NoteTagsApi;

  constructor(private readonly ctx: HttpContext) {
    this.boxes = new NoteBoxesApi(ctx);
    this.notes = new NoteItemsApi(ctx);
    this.index = new NoteIndexApi(ctx);
    this.tags = new NoteTagsApi(ctx);
  }

  async search(
    boxRef: string,
    q: string,
    limit?: number,
    opts: CallOptions = {},
  ): Promise<NoteHit[]> {
    const params = new URLSearchParams({ q });
    if (limit !== undefined) params.set("limit", String(limit));
    const res = await request<ListEnvelope<NoteHit>>(this.ctx, {
      method: "GET",
      path: `/api/v1/notes/boxes/${enc(boxRef)}/search?${params.toString()}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async searchAll(
    q: string,
    opts: NotesSearchAllOptions = {},
  ): Promise<NoteHit[]> {
    const params = new URLSearchParams({ q });
    if (opts.boxIds?.length) params.set("box_ids", opts.boxIds.join(","));
    if (opts.workspaceId) params.set("workspace_id", opts.workspaceId);
    if (opts.limit !== undefined) params.set("limit", String(opts.limit));
    const res = await request<ListEnvelope<NoteHit>>(this.ctx, {
      method: "GET",
      path: `/api/v1/notes/search?${params.toString()}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async graph(boxRef: string, opts: CallOptions = {}): Promise<NoteGraph> {
    const res = await request<SingleEnvelope<NoteGraph>>(this.ctx, {
      method: "GET",
      path: `/api/v1/notes/boxes/${enc(boxRef)}/graph`,
      signal: opts.signal,
    });
    return res.data;
  }

  async links(noteRef: string, opts: CallOptions = {}): Promise<NoteLinks> {
    const res = await request<SingleEnvelope<NoteLinks>>(this.ctx, {
      method: "GET",
      path: `/api/v1/notes/notes/${enc(noteRef)}/links`,
      signal: opts.signal,
    });
    return res.data;
  }
}
