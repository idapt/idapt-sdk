

import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  DeletedResponse,
  ListEnvelope,
  SingleEnvelope,
  Workspace,
  WorkspaceInvitation,
  WorkspaceMember,
  WorkspaceMemberRole,
} from "../types.js";

export interface CreateWorkspaceInput {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface UpdateWorkspaceInput {
  name?: string;
  description?: string | null;
  icon?: string | null;

  slug?: string;
}

export interface ListWorkspacesQuery {
  include_archived?: boolean;
  archived_only?: boolean;
}

export type WritableMemberRole = Extract<
  WorkspaceMemberRole,
  "admin" | "editor" | "viewer"
>;

export interface AddMemberInput {
  actor_id: string;
  role: WritableMemberRole;
}

export interface UpdateMemberInput {
  role: WritableMemberRole;
}

export interface CreateInvitationInput {

  slug: string;
  role?: WritableMemberRole;
}

export interface CreateInvitationResult {
  invitee_slug: string;
  role: WritableMemberRole;
  status: string;
}

export interface DeleteInvitationResult {
  deleted: true;

  id: string;
}

export class WorkspacesApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(
    query: ListWorkspacesQuery = {},
    opts: CallOptions = {},
  ): Promise<Workspace[]> {
    const res = await request<ListEnvelope<Workspace>>(this.ctx, {
      method: "GET",
      path: "/api/v1/workspaces",
      query,
      signal: opts.signal,
    });
    return res.data;
  }

  async create(
    input: CreateWorkspaceInput,
    opts: CallOptions = {},
  ): Promise<Workspace> {
    const res = await request<SingleEnvelope<Workspace>>(this.ctx, {
      method: "POST",
      path: "/api/v1/workspaces",
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async get(id: string, opts: CallOptions = {}): Promise<Workspace> {
    const res = await request<SingleEnvelope<Workspace>>(this.ctx, {
      method: "GET",
      path: `/api/v1/workspaces/${id}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async update(
    id: string,
    input: UpdateWorkspaceInput,
    opts: CallOptions = {},
  ): Promise<Workspace> {
    const res = await request<SingleEnvelope<Workspace>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/workspaces/${id}`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/workspaces/${id}`,
      signal: opts.signal,
    });
  }

  async archive(id: string, opts: CallOptions = {}): Promise<Workspace> {
    const res = await request<SingleEnvelope<Workspace>>(this.ctx, {
      method: "POST",
      path: `/api/v1/workspaces/${id}/archive`,
      signal: opts.signal,
    });
    return res.data;
  }

  async unarchive(id: string, opts: CallOptions = {}): Promise<Workspace> {
    const res = await request<SingleEnvelope<Workspace>>(this.ctx, {
      method: "POST",
      path: `/api/v1/workspaces/${id}/unarchive`,
      signal: opts.signal,
    });
    return res.data;
  }

  async listMembers(
    id: string,
    opts: CallOptions = {},
  ): Promise<WorkspaceMember[]> {
    const res = await request<ListEnvelope<WorkspaceMember>>(this.ctx, {
      method: "GET",
      path: `/api/v1/workspaces/${id}/members`,
      signal: opts.signal,
    });
    return res.data;
  }

  async addMember(
    id: string,
    input: AddMemberInput,
    opts: CallOptions = {},
  ): Promise<WorkspaceMember> {
    const res = await request<SingleEnvelope<WorkspaceMember>>(this.ctx, {
      method: "POST",
      path: `/api/v1/workspaces/${id}/members`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async updateMember(
    id: string,
    memberId: string,
    input: UpdateMemberInput,
    opts: CallOptions = {},
  ): Promise<WorkspaceMember> {
    const res = await request<SingleEnvelope<WorkspaceMember>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/workspaces/${id}/members/${memberId}`,
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async removeMember(
    id: string,
    memberId: string,
    opts: CallOptions = {},
  ): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/workspaces/${id}/members/${memberId}`,
      signal: opts.signal,
    });
  }

  async listInvitations(
    id: string,
    opts: CallOptions = {},
  ): Promise<WorkspaceInvitation[]> {
    const res = await request<ListEnvelope<WorkspaceInvitation>>(this.ctx, {
      method: "GET",
      path: `/api/v1/workspaces/${id}/invitations`,
      signal: opts.signal,
    });
    return res.data;
  }

  async createInvitation(
    id: string,
    input: CreateInvitationInput,
    opts: CallOptions = {},
  ): Promise<CreateInvitationResult> {
    const res = await request<SingleEnvelope<CreateInvitationResult>>(
      this.ctx,
      {
        method: "POST",
        path: `/api/v1/workspaces/${id}/invitations`,
        body: { slug: input.slug, role: input.role ?? "viewer" },
        signal: opts.signal,
      },
    );
    return res.data;
  }

  async deleteInvitation(
    id: string,
    inviteeSlug: string,
    opts: CallOptions = {},
  ): Promise<DeleteInvitationResult> {
    return request<DeleteInvitationResult>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/workspaces/${id}/invitations`,
      query: { invitee_slug: inviteeSlug },
      signal: opts.signal,
    });
  }
}
