/**
 * FilesApi — the full `/api/v1/drive/files` surface for app code that operates
 * on arbitrary file ids (not just the sandboxed folders exposed via
 * `client.app` / `client.data`).
 *
 * Use when:
 *   - The app has elevated `files:*` permission and wants to touch files
 *     outside its `.app-data` scope.
 *   - You need create-folder / move / run endpoints with a workspace_id /
 *     parent_id you choose yourself.
 *
 * For "save preferences in my data folder", prefer `client.data.set(name)`
 * — it handles name→id resolution and OCC for you.
 *
 * All HTTP details live in `_files-core.ts` so DataFolder / AppFolder share
 * exactly the same wire behaviour.
 */

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

  // ---------------------------------------------------------------------------
  //  CRUD
  // ---------------------------------------------------------------------------

  list(query: ListFilesQuery = {}, opts: CallOptions = {}): Promise<File[]> {
    return coreList(this.ctx, query, opts);
  }

  /** Multipart upload a Blob/File. Returns the partial file record. */
  upload(
    input: UploadInput,
    opts: CallOptions = {},
  ): Promise<FileUploadResult> {
    return coreUpload(this.ctx, input, opts);
  }

  /**
   * Fetch a file's raw text content. Use for text-like files (source code,
   * Markdown, JSON strings). For binary content (images, PDFs, zips) use
   * `getBlob()` instead — `getText()` will UTF-8 decode and corrupt bytes.
   */
  getText(id: string, opts: CallOptions = {}): Promise<string> {
    return coreGetText(this.ctx, id, opts);
  }

  /**
   * Fetch a file's raw bytes as a Blob. The server sends the real MIME
   * type on `Content-Type`; the returned Blob's `.type` reflects it.
   */
  getBlob(id: string, opts: CallOptions = {}): Promise<Blob> {
    return coreGetBlob(this.ctx, id, opts);
  }

  /**
   * Patch file metadata or content. Supports `expectedUpdatedAt` for
   * optimistic concurrency — pass it when you know the version you read.
   */
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

  // ---------------------------------------------------------------------------
  //  Folder / move / run
  // ---------------------------------------------------------------------------

  /**
   * Idempotent create-or-get a folder. Returns the existing folder (with
   * `200`) or the new one (`201`) — consumers don't need to distinguish.
   */
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

  /**
   * Execute a code file (js/ts/py/sh) in a sandboxed Lambda. Returns the
   * full `ExecutionRun` record (status, stdout/stderr, exit code, timestamps).
   */
  run(
    id: string,
    input: RunFileInput = {},
    opts: CallOptions = {},
  ): Promise<ExecutionRun> {
    return coreRun(this.ctx, id, input, opts);
  }
}
