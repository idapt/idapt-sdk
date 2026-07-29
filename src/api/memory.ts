

import {
  MemoryApiBase,
  MemoryBoxesApi,
  MemoryIndexApi,
  MemoryNotesApi,
} from "../generated/resources.generated.js";
import type { HttpContext } from "../http.js";

export type {
  MemoryBoxesQuery,
  MemoryBoxUpdateInput,
  MemoryWriteInput,
} from "../generated/resources.generated.js";
export { MemoryBoxesApi, MemoryIndexApi, MemoryNotesApi };

export class MemoryApi extends MemoryApiBase {

  readonly boxes: MemoryBoxesApi;

  readonly notes: MemoryNotesApi;

  readonly index: MemoryIndexApi;

  constructor(ctx: HttpContext) {
    super(ctx);
    this.boxes = new MemoryBoxesApi(ctx);
    this.notes = new MemoryNotesApi(ctx);
    this.index = new MemoryIndexApi(ctx);
  }
}
