

import { executeCommand } from "../core/execute.js";
import { COMMAND_BINDINGS } from "../generated/command-bindings.generated.js";
import type { V1Args, V1Result } from "../generated/resources.generated.js";
import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  DeletedResponse,
  File,
  FileList,
  FileUploadResult,
  WriteOptions,
} from "../types.js";

export type ListFilesQuery = V1Args<"drive list">;

export type UploadInput = V1Args<"drive upload"> & {
  file: Blob | globalThis.File;
};

export type PatchFileInput = V1Args<"drive update">;

export type CreateFolderInput = V1Args<"drive create-folder">;

export async function listFiles(
  ctx: HttpContext,
  query: ListFilesQuery = {},
  opts: CallOptions = {},
): Promise<File[]> {
  const res = await executeCommand<V1Result<"drive list">>(
    COMMAND_BINDINGS["drive list"],
    { ...query },
    ctx,
    opts,
  );
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

export function getFile(
  ctx: HttpContext,
  id: string,
  opts: CallOptions = {},
): Promise<File> {
  return executeCommand<File>(
    COMMAND_BINDINGS["drive get-metadata"],
    { id },
    ctx,
    opts,
  );
}

export async function getFileText(
  ctx: HttpContext,
  id: string,
  opts: CallOptions = {},
): Promise<string> {
  const blob = await executeCommand<Blob>(
    COMMAND_BINDINGS["drive read"],
    { id },
    ctx,
    opts,
  );
  return blob.text();
}

export function getFileBlob(
  ctx: HttpContext,
  id: string,
  opts: CallOptions = {},
): Promise<Blob> {
  return executeCommand<Blob>(
    COMMAND_BINDINGS["drive read"],
    { id },
    ctx,
    opts,
  );
}

export function uploadFile(
  ctx: HttpContext,
  input: UploadInput,
  opts: CallOptions = {},
): Promise<FileUploadResult> {

  const filename =
    input.name ??
    (input.file instanceof globalThis.File ? input.file.name : "upload");
  const file =
    input.file instanceof globalThis.File && input.file.name === filename
      ? input.file
      : new globalThis.File([input.file], filename, { type: input.file.type });
  return executeCommand<FileUploadResult>(
    COMMAND_BINDINGS["drive upload"],
    { ...input, file },
    ctx,
    opts,
  );
}

export function patchFile(
  ctx: HttpContext,
  id: string,
  input: PatchFileInput,
  opts: WriteOptions = {},
): Promise<File> {
  return executeCommand<File>(
    COMMAND_BINDINGS["drive update"],
    {
      id,
      ...input,
      ...(opts.expectedUpdatedAt
        ? { expected_updated_at: opts.expectedUpdatedAt }
        : {}),
    },
    ctx,
    opts,
  );
}

export function deleteFile(
  ctx: HttpContext,
  id: string,
  opts: CallOptions = {},
): Promise<DeletedResponse> {
  return executeCommand<DeletedResponse>(
    COMMAND_BINDINGS["drive delete"],
    { id },
    ctx,
    opts,
  );
}

export function restoreFile(
  ctx: HttpContext,
  id: string,
  opts: CallOptions = {},
): Promise<File> {
  return executeCommand<File>(
    COMMAND_BINDINGS["drive restore"],
    { id },
    ctx,
    opts,
  );
}

export function permanentDeleteFile(
  ctx: HttpContext,
  id: string,
  opts: CallOptions = {},
): Promise<DeletedResponse> {
  return executeCommand<DeletedResponse>(
    COMMAND_BINDINGS["drive permanent-delete"],
    { id },
    ctx,
    opts,
  );
}

export function createFolder(
  ctx: HttpContext,
  input: CreateFolderInput,
  opts: CallOptions = {},
): Promise<File> {
  return executeCommand<File>(
    COMMAND_BINDINGS["drive create-folder"],
    { ...input },
    ctx,
    opts,
  );
}

export function moveFile(
  ctx: HttpContext,
  id: string,
  parentId: string | null,
  opts: CallOptions = {},
): Promise<File> {
  return executeCommand<File>(
    COMMAND_BINDINGS["drive move"],
    { id, parent_id: parentId },
    ctx,
    opts,
  );
}

export type SignedUrl = {
  url: string;
  expires_at: string;
  expires_in_seconds: number;
};

export function createSignedUrl(
  ctx: HttpContext,
  id: string,
  expiresInSeconds?: number,
  opts: CallOptions = {},
): Promise<SignedUrl> {
  return executeCommand<SignedUrl>(
    COMMAND_BINDINGS["drive signed-url"],
    { id, expires_in_seconds: expiresInSeconds },
    ctx,
    opts,
  );
}
