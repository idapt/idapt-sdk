

import {
  NotesApiBase,
  NotesBoxesApi,
  NotesFoldersApi,
  NotesIndexApi,
  NotesNotesApi,
} from "../generated/resources.generated.js";
import type { HttpContext } from "../http.js";

export type {
  NotesBoxCreateInput,
  NotesBoxesQuery,
  NotesBoxUpdateInput,
  NotesWriteInput,
} from "../generated/resources.generated.js";
export { NotesBoxesApi, NotesFoldersApi, NotesIndexApi, NotesNotesApi };

export class NotesApi extends NotesApiBase {

  readonly boxes: NotesBoxesApi;

  readonly notes: NotesNotesApi;

  readonly folders: NotesFoldersApi;

  readonly index: NotesIndexApi;

  constructor(ctx: HttpContext) {
    super(ctx);
    this.boxes = new NotesBoxesApi(ctx);
    this.notes = new NotesNotesApi(ctx);
    this.folders = new NotesFoldersApi(ctx);
    this.index = new NotesIndexApi(ctx);
  }
}
