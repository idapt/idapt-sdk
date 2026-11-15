

import {
  SharingApiBase,
  type V1Args,
} from "../generated/resources.generated.js";
import { request } from "../http.js";
import type { CallOptions, Share, SingleEnvelope } from "../types.js";

export type UpdateShareInput = V1Args<"share create">;

export class SharingApi extends SharingApiBase {

  async update(
    input: UpdateShareInput,
    opts: CallOptions = {},
  ): Promise<Share> {
    const res = await request<SingleEnvelope<Share>>(this.ctx, {
      method: "PATCH",
      path: "/api/v1/shares",
      query: {
        resource_type: input.resource_type,
        resource_id: input.resource_id,
        grantee_actor_id: input.grantee_actor_id,
      },
      body: { permission: input.permission },
      signal: opts.signal,
    });
    return res.data;
  }
}
