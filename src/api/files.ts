

import type { HttpContext } from "../http.js";
import type {
  CallOptions,
  DeletedResponse,
  ExecutionRun,
  File,
  FileUploadResult,
  WriteOptions,
} from "../types.js";
import {
  type CreateFolderInput,
  createFolder as coreCreateFolder,
  deleteFile as coreDelete,
  getFileBlob as coreGetBlob,
  getFileText as coreGetText,
  listFiles as coreList,
  moveFile as coreMove,
  patchFile as corePatch,
  permanentDeleteFile as corePermanentDelete,
  restoreFile as coreRestore,
  runFile as coreRun,
  uploadFile as coreUpload,
  type ListFilesQuery,
  type PatchFileInput,
  type RunFileInput,
  type UploadInput,
} from "./_files-core.js";

export type {
  CreateFolderInput,
  ListFilesQuery,
  PatchFileInput,
  RunFileInput,
  UploadInput,
} from "./_files-core.js";

export class FilesApi {
  constructor(private readonly ctx: HttpContext) {}

  list(query: ListFilesQuery = {}, opts: CallOptions = {}): Promise<File[]> {
    return coreList(this.ctx, query, opts);
  }

  upload(
    input: UploadInput,
    opts: CallOptions = {},
  ): Promise<FileUploadResult> {
    return coreUpload(this.ctx, input, opts);
  }

  getText(id: string, opts: CallOptions = {}): Promise<string> {
    return coreGetText(this.ctx, id, opts);
  }

  getBlob(id: string, opts: CallOptions = {}): Promise<Blob> {
    return coreGetBlob(this.ctx, id, opts);
  }

  patch(
    id: string,
    input: PatchFileInput,
    opts: WriteOptions = {},
  ): Promise<File> {
    return corePatch(this.ctx, id, input, opts);
  }

  delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return coreDelete(this.ctx, id, opts);
  }

  restore(id: string, opts: CallOptions = {}): Promise<File> {
    return coreRestore(this.ctx, id, opts);
  }

  permanentDelete(
    id: string,
    opts: CallOptions = {},
  ): Promise<DeletedResponse> {
    return corePermanentDelete(this.ctx, id, opts);
  }

  createFolder(
    input: CreateFolderInput,
    opts: CallOptions = {},
  ): Promise<File> {
    return coreCreateFolder(this.ctx, input, opts);
  }

  move(
    id: string,
    parentId: string | null,
    opts: CallOptions = {},
  ): Promise<File> {
    return coreMove(this.ctx, id, parentId, opts);
  }

  run(
    id: string,
    input: RunFileInput = {},
    opts: CallOptions = {},
  ): Promise<ExecutionRun> {
    return coreRun(this.ctx, id, input, opts);
  }
}
