

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

export interface ListFilesQuery {
  limit?: number;

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
