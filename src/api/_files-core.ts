/**
 * Stateless low-level file operations against `/api/v1/drive/files/*`.
 *
 * Every file surface in the SDK (FilesApi, DataFolder, AppFolder) ultimately
 * hits the same v1 endpoints. Keeping the HTTP details here means:
 *
 *   - one place to fix envelope / OCC / multipart behaviour
 *   - scoped surfaces (DataFolder, AppFolder) compose instead of duplicate
 *   - new scoped methods (e.g. subfolder create under `.app-data/`) cost one
 *     delegating line instead of a re-implemented request() call
 *
 * Nothing in this module caches or holds state — callers layer that on.
 */

import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  DeletedResponse,
  ExecutionRun,
  File,
  FileList,
  FileUploadResult,
  ListEnvelope,
  SingleEnvelope,
  WriteOptions,
} from "../types.js";

/**
 * `GET /v1/files` query params. Cursor-paginated (`limit` + opaque
 * `cursor`). There is NO `workspace_id` filter — list within a workspace by
 * passing the workspace's root folder as `parent_id`.
 *
 * To page: pass no `cursor` for the first page, then echo back the
 * `pagination.next_cursor` from the previous response (use `listEnvelope`
 * if you need that token — `list` drops the envelope).
 */
export interface ListFilesQuery {
  limit?: number;
  /** Opaque pagination cursor — echo `pagination.next_cursor`. */
  cursor?: string;
  parent_id?: string;
}

export interface UploadInput {
  file: Blob | globalThis.File;
  name?: string;
  parent_id?: string;
  workspace_id?: string;
  skip_if_exists?: boolean;
}

export interface PatchFileInput {
  name?: string;
  content?: string;
  expected_updated_at?: string;
}

export interface CreateFolderInput {
  name: string;
  parent_id?: string;
  workspace_id?: string;
  icon?: string;
}

export interface RunFileInput {
  timeout_seconds?: number;
  env?: Record<string, string>;
}

// ---------------------------------------------------------------------------
//  Reads
// ---------------------------------------------------------------------------

export async function listFiles(
  ctx: HttpContext,
  query: ListFilesQuery = {},
  opts: CallOptions = {},
): Promise<File[]> {
  const res = await request<ListEnvelope<File>>(ctx, {
    method: "GET",
    path: "/api/v1/drive/files",
    query,
    signal: opts.signal,
  });
  return (res.data ?? []) as File[];
}

/** Raw list envelope (retains pagination). Prefer `listFiles` when you only need the array. */
export async function listFilesEnvelope(
  ctx: HttpContext,
  query: ListFilesQuery = {},
  opts: CallOptions = {},
): Promise<FileList> {
  return request<FileList>(ctx, {
    method: "GET",
    path: "/api/v1/drive/files",
    query,
    signal: opts.signal,
  });
}

/** GET metadata for one file id (used by name-cache revalidation). */
export async function getFile(
  ctx: HttpContext,
  id: string,
  opts: CallOptions = {},
): Promise<File> {
  const res = await request<SingleEnvelope<File>>(ctx, {
    method: "GET",
    path: `/api/v1/drive/files/${id}/metadata`,
    signal: opts.signal,
  });
  return res.data;
}

/** GET raw text body (`expectJson: false`). UTF-8 decoded by `fetch`. */
export async function getFileText(
  ctx: HttpContext,
  id: string,
  opts: CallOptions = {},
): Promise<string> {
  return request<string>(ctx, {
    method: "GET",
    path: `/api/v1/drive/files/${id}`,
    signal: opts.signal,
    expectJson: false,
  });
}

/** GET raw bytes as Blob, preserving Content-Type. */
export async function getFileBlob(
  ctx: HttpContext,
  id: string,
  opts: CallOptions = {},
): Promise<Blob> {
  return request<Blob>(ctx, {
    method: "GET",
    path: `/api/v1/drive/files/${id}`,
    signal: opts.signal,
    expectBlob: true,
  });
}

// ---------------------------------------------------------------------------
//  Writes
// ---------------------------------------------------------------------------

/**
 * Multipart upload. Returns the partial record (no timestamps).
 *
 * The multipart field names are snake_case (`file`, `name`, `parent_id`,
 * `workspace_id`, `skip_if_exists`). `parent_id` / `workspace_id` are
 * resourceIds. Unknown fields are rejected with 422; a duplicate name
 * with `skip_if_exists` returns 409.
 */
export async function uploadFile(
  ctx: HttpContext,
  input: UploadInput,
  opts: CallOptions = {},
): Promise<FileUploadResult> {
  const form = new FormData();
  const filename =
    input.name ??
    (input.file instanceof globalThis.File ? input.file.name : "upload");
  form.set("file", input.file, filename);
  if (input.name) form.set("name", input.name);
  if (input.parent_id) form.set("parent_id", input.parent_id);
  if (input.workspace_id) form.set("workspace_id", input.workspace_id);
  if (input.skip_if_exists) form.set("skip_if_exists", "true");

  const res = await request<SingleEnvelope<FileUploadResult>>(ctx, {
    method: "POST",
    path: "/api/v1/drive/files",
    bodyRaw: form,
    signal: opts.signal,
  });
  return res.data;
}

/** PATCH content and/or metadata. OCC via `opts.expectedUpdatedAt`. */
export async function patchFile(
  ctx: HttpContext,
  id: string,
  input: PatchFileInput,
  opts: WriteOptions = {},
): Promise<File> {
  const body: Record<string, unknown> = { ...input };
  if (opts.expectedUpdatedAt) body.expected_updated_at = opts.expectedUpdatedAt;
  const res = await request<SingleEnvelope<File>>(ctx, {
    method: "PATCH",
    path: `/api/v1/drive/files/${id}`,
    body,
    signal: opts.signal,
  });
  return res.data;
}

export async function deleteFile(
  ctx: HttpContext,
  id: string,
  opts: CallOptions = {},
): Promise<DeletedResponse> {
  return request<DeletedResponse>(ctx, {
    method: "DELETE",
    path: `/api/v1/drive/files/${id}`,
    signal: opts.signal,
  });
}

export async function restoreFile(
  ctx: HttpContext,
  id: string,
  opts: CallOptions = {},
): Promise<File> {
  const res = await request<SingleEnvelope<File>>(ctx, {
    method: "POST",
    path: `/api/v1/drive/files/${id}/restore`,
    signal: opts.signal,
  });
  return res.data;
}

export async function permanentDeleteFile(
  ctx: HttpContext,
  id: string,
  opts: CallOptions = {},
): Promise<DeletedResponse> {
  return request<DeletedResponse>(ctx, {
    method: "DELETE",
    path: `/api/v1/drive/files/${id}/permanent-delete`,
    signal: opts.signal,
  });
}

// ---------------------------------------------------------------------------
//  Folder / move / run
// ---------------------------------------------------------------------------

/**
 * Idempotent create-or-get a folder. Returns the folder (200 existing /
 * 201 new — consumers don't distinguish).
 */
export async function createFolder(
  ctx: HttpContext,
  input: CreateFolderInput,
  opts: CallOptions = {},
): Promise<File> {
  const res = await request<SingleEnvelope<File>>(ctx, {
    method: "POST",
    path: "/api/v1/drive/files/folders",
    body: input,
    signal: opts.signal,
  });
  return res.data;
}

export async function moveFile(
  ctx: HttpContext,
  id: string,
  parentId: string | null,
  opts: CallOptions = {},
): Promise<File> {
  const res = await request<SingleEnvelope<File>>(ctx, {
    method: "POST",
    path: `/api/v1/drive/files/${id}/move`,
    body: { parent_id: parentId },
    signal: opts.signal,
  });
  return res.data;
}

/**
 * Execute a code file. Returns the full `ExecutionRun` row (`id`, `status`,
 * `stdout`, `stderr`, `exit_code`, timestamps) — not a stripped run summary.
 */
export async function runFile(
  ctx: HttpContext,
  id: string,
  input: RunFileInput = {},
  opts: CallOptions = {},
): Promise<ExecutionRun> {
  const res = await request<SingleEnvelope<ExecutionRun>>(ctx, {
    method: "POST",
    path: `/api/v1/drive/files/${id}/run`,
    body: input,
    signal: opts.signal,
  });
  return res.data;
}
