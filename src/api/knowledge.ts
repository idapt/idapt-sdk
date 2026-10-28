

import {
  KnowledgeApiBase,
  KnowledgeFoldersApi,
  KnowledgeNotesApi,
} from "../generated/resources.generated.js";
import type { HttpContext } from "../http.js";

export type { NotesWriteInput } from "../generated/resources.generated.js";
export { KnowledgeFoldersApi, KnowledgeNotesApi };

export class KnowledgeApi extends KnowledgeApiBase {

  readonly notes: KnowledgeNotesApi;

  readonly folders: KnowledgeFoldersApi;

  constructor(ctx: HttpContext) {
    super(ctx);
    this.notes = new KnowledgeNotesApi(ctx);
    this.folders = new KnowledgeFoldersApi(ctx);
  }
}
