

import type { V1Commands } from "@idapt/api-contracts/v1/contracts";
import {
  type ExecuteCommandOptions,
  executeCommand,
  type SseEvent,
} from "../core/execute.js";
import type { HttpContext } from "../http.js";
import type { CallOptions, DeletedResponse } from "../types.js";
import { COMMAND_BINDINGS } from "./command-bindings.generated.js";

export type V1Args<K extends keyof V1Commands> = V1Commands[K]["args"];

export type V1Result<K extends keyof V1Commands> = V1Commands[K]["result"];

export class AgentsApi {
  constructor(protected readonly ctx: HttpContext) {}

  async list(query: ListAgentsQuery = {}, opts: CallOptions = {}): Promise<V1Result<"agent list">["data"]> {
    const res = await executeCommand<V1Result<"agent list">>(COMMAND_BINDINGS["agent list"], { ...query }, this.ctx, opts);
    return res.data;
  }

  async create(input: CreateAgentInput, opts: CallOptions = {}): Promise<V1Result<"agent create">> {
    return executeCommand<V1Result<"agent create">>(COMMAND_BINDINGS["agent create"], { ...input }, this.ctx, opts);
  }

  async get(id: string, opts: CallOptions = {}): Promise<V1Result<"agent get">> {
    return executeCommand<V1Result<"agent get">>(COMMAND_BINDINGS["agent get"], { id }, this.ctx, opts);
  }

  async update(id: string, input: UpdateAgentInput = {}, opts: CallOptions = {}): Promise<V1Result<"agent update">> {
    return executeCommand<V1Result<"agent update">>(COMMAND_BINDINGS["agent update"], { id, ...input }, this.ctx, opts);
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["agent delete"], { id }, this.ctx, opts);
  }

  async archive(id: string, opts: CallOptions = {}): Promise<V1Result<"agent archive">> {
    return executeCommand<V1Result<"agent archive">>(COMMAND_BINDINGS["agent archive"], { id }, this.ctx, opts);
  }

  async unarchive(id: string, opts: CallOptions = {}): Promise<V1Result<"agent unarchive">> {
    return executeCommand<V1Result<"agent unarchive">>(COMMAND_BINDINGS["agent unarchive"], { id }, this.ctx, opts);
  }

  async restore(id: string, opts: CallOptions = {}): Promise<V1Result<"agent restore">> {
    return executeCommand<V1Result<"agent restore">>(COMMAND_BINDINGS["agent restore"], { id }, this.ctx, opts);
  }

  async permanentDelete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["agent permanent-delete"], { id }, this.ctx, opts);
  }

  async move(id: string, input: MoveAgentInput, opts: CallOptions = {}): Promise<V1Result<"agent move">> {
    return executeCommand<V1Result<"agent move">>(COMMAND_BINDINGS["agent move"], { id, ...input }, this.ctx, opts);
  }

  async copyToWorkspace(id: string, input: CopyAgentToWorkspaceInput, opts: CallOptions = {}): Promise<V1Result<"agent copy-to-workspace">> {
    return executeCommand<V1Result<"agent copy-to-workspace">>(COMMAND_BINDINGS["agent copy-to-workspace"], { id, ...input }, this.ctx, opts);
  }
}

export type ListAgentsQuery = V1Args<"agent list">;
export type CreateAgentInput = V1Args<"agent create">;
export type UpdateAgentInput = V1Args<"agent update">;
export type MoveAgentInput = V1Args<"agent move">;
export type CopyAgentToWorkspaceInput = V1Args<"agent copy-to-workspace">;

export class ApiKeysApi {
  constructor(protected readonly ctx: HttpContext) {}

  async list(query: ListApiKeysQuery = {}, opts: CallOptions = {}): Promise<V1Result<"api-key list">["data"]> {
    const res = await executeCommand<V1Result<"api-key list">>(COMMAND_BINDINGS["api-key list"], { ...query }, this.ctx, opts);
    return res.data;
  }

  async create(input: CreateApiKeyInput, opts: CallOptions = {}): Promise<V1Result<"api-key create">> {
    return executeCommand<V1Result<"api-key create">>(COMMAND_BINDINGS["api-key create"], { ...input }, this.ctx, opts);
  }

  async update(id: string, input: UpdateApiKeyInput = {}, opts: CallOptions = {}): Promise<V1Result<"api-key update">> {
    return executeCommand<V1Result<"api-key update">>(COMMAND_BINDINGS["api-key update"], { id, ...input }, this.ctx, opts);
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["api-key delete"], { id }, this.ctx, opts);
  }

  async rotate(id: string, input: RotateApiKeyInput, opts: CallOptions = {}): Promise<V1Result<"api-key rotate">> {
    return executeCommand<V1Result<"api-key rotate">>(COMMAND_BINDINGS["api-key rotate"], { id, ...input }, this.ctx, opts);
  }
}

export type ListApiKeysQuery = V1Args<"api-key list">;
export type CreateApiKeyInput = V1Args<"api-key create">;
export type UpdateApiKeyInput = V1Args<"api-key update">;
export type RotateApiKeyInput = V1Args<"api-key rotate">;
export type RotateApiKeyResult = V1Result<"api-key rotate">;

export class ChatsApi {
  constructor(protected readonly ctx: HttpContext) {}

  async list(query: ListChatsQuery = {}, opts: CallOptions = {}): Promise<V1Result<"chat list">["data"]> {
    const res = await executeCommand<V1Result<"chat list">>(COMMAND_BINDINGS["chat list"], { ...query }, this.ctx, opts);
    return res.data;
  }

  async create(input: CreateChatInput = {}, opts: CallOptions = {}): Promise<V1Result<"chat create">> {
    return executeCommand<V1Result<"chat create">>(COMMAND_BINDINGS["chat create"], { ...input }, this.ctx, opts);
  }

  async get(id: string, opts: CallOptions = {}): Promise<V1Result<"chat get">> {
    return executeCommand<V1Result<"chat get">>(COMMAND_BINDINGS["chat get"], { id }, this.ctx, opts);
  }

  async update(id: string, input: UpdateChatInput = {}, opts: CallOptions = {}): Promise<V1Result<"chat update">> {
    return executeCommand<V1Result<"chat update">>(COMMAND_BINDINGS["chat update"], { id, ...input }, this.ctx, opts);
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["chat delete"], { id }, this.ctx, opts);
  }

  async archive(id: string, opts: CallOptions = {}): Promise<V1Result<"chat archive">> {
    return executeCommand<V1Result<"chat archive">>(COMMAND_BINDINGS["chat archive"], { id }, this.ctx, opts);
  }

  async unarchive(id: string, opts: CallOptions = {}): Promise<V1Result<"chat unarchive">> {
    return executeCommand<V1Result<"chat unarchive">>(COMMAND_BINDINGS["chat unarchive"], { id }, this.ctx, opts);
  }

  async restore(id: string, opts: CallOptions = {}): Promise<V1Result<"chat restore">> {
    return executeCommand<V1Result<"chat restore">>(COMMAND_BINDINGS["chat restore"], { id }, this.ctx, opts);
  }

  async permanentDelete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["chat permanent-delete"], { id }, this.ctx, opts);
  }

  async cost(id: string, opts: CallOptions = {}): Promise<V1Result<"chat cost">> {
    return executeCommand<V1Result<"chat cost">>(COMMAND_BINDINGS["chat cost"], { id }, this.ctx, opts);
  }

  async messageCosts(id: string, opts: CallOptions = {}): Promise<V1Result<"chat message-costs">> {
    return executeCommand<V1Result<"chat message-costs">>(COMMAND_BINDINGS["chat message-costs"], { id }, this.ctx, opts);
  }

  async stop(id: string, input: V1Args<"chat stop"> = {}, opts: CallOptions = {}): Promise<V1Result<"chat stop">> {
    return executeCommand<V1Result<"chat stop">>(COMMAND_BINDINGS["chat stop"], { id, ...input }, this.ctx, opts);
  }

  async export(id: string, query: V1Args<"chat export"> = {}, opts: ExecuteCommandOptions = {}): Promise<Blob> {
    return executeCommand<Blob>(COMMAND_BINDINGS["chat export"], { id, ...query }, this.ctx, opts);
  }

  async copyToAgent(id: string, input: V1Args<"chat copy-to-agent">, opts: CallOptions = {}): Promise<V1Result<"chat copy-to-agent">> {
    return executeCommand<V1Result<"chat copy-to-agent">>(COMMAND_BINDINGS["chat copy-to-agent"], { id, ...input }, this.ctx, opts);
  }

  async copyToWorkspace(id: string, input: V1Args<"chat copy-to-workspace">, opts: CallOptions = {}): Promise<V1Result<"chat copy-to-workspace">> {
    return executeCommand<V1Result<"chat copy-to-workspace">>(COMMAND_BINDINGS["chat copy-to-workspace"], { id, ...input }, this.ctx, opts);
  }

  async forkToWorkspace(id: string, opts: CallOptions = {}): Promise<V1Result<"chat fork-to-workspace">> {
    return executeCommand<V1Result<"chat fork-to-workspace">>(COMMAND_BINDINGS["chat fork-to-workspace"], { id }, this.ctx, opts);
  }

  async listMessages(id: string, query: ListMessagesQuery = {}, opts: CallOptions = {}): Promise<V1Result<"chat messages">["data"]> {
    const res = await executeCommand<V1Result<"chat messages">>(COMMAND_BINDINGS["chat messages"], { id, ...query }, this.ctx, opts);
    return res.data;
  }

  async sendMessage(id: string, input: SendMessageInput, opts: ExecuteCommandOptions = {}): Promise<V1Result<"chat send">> {
    return executeCommand<V1Result<"chat send">>(COMMAND_BINDINGS["chat send"], { id, ...input }, this.ctx, opts);
  }

  async stream(id: string, input: StreamMessageInput, opts: ExecuteCommandOptions = {}): Promise<AsyncIterable<SseEvent>> {
    return executeCommand<AsyncIterable<SseEvent>>(COMMAND_BINDINGS["chat stream"], { id, ...input }, this.ctx, opts);
  }

  async listRuns(id: string, query: ListRunsQuery = {}, opts: CallOptions = {}): Promise<V1Result<"chat runs">["data"]> {
    const res = await executeCommand<V1Result<"chat runs">>(COMMAND_BINDINGS["chat runs"], { id, ...query }, this.ctx, opts);
    return res.data;
  }

  async repromptMessage(id: string, messageId: string, input: RepromptMessageInput = {}, opts: ExecuteCommandOptions = {}): Promise<V1Result<"chat reprompt">> {
    return executeCommand<V1Result<"chat reprompt">>(COMMAND_BINDINGS["chat reprompt"], { id, message_id: messageId, ...input }, this.ctx, opts);
  }
}

export type ListChatsQuery = V1Args<"chat list">;
export type CreateChatInput = V1Args<"chat create">;
export type UpdateChatInput = V1Args<"chat update">;
export type ListMessagesQuery = V1Args<"chat messages">;
export type SendMessageInput = V1Args<"chat send">;
export type StreamMessageInput = V1Args<"chat stream">;
export type ListRunsQuery = V1Args<"chat runs">;
export type RepromptMessageInput = V1Args<"chat reprompt">;

export class CustomModelsApi {
  constructor(protected readonly ctx: HttpContext) {}

  async list(query: V1Args<"custom-models list"> = {}, opts: CallOptions = {}): Promise<V1Result<"custom-models list">["data"]> {
    const res = await executeCommand<V1Result<"custom-models list">>(COMMAND_BINDINGS["custom-models list"], { ...query }, this.ctx, opts);
    return res.data;
  }

  async create(input: V1Args<"custom-models create">, opts: CallOptions = {}): Promise<V1Result<"custom-models create">> {
    return executeCommand<V1Result<"custom-models create">>(COMMAND_BINDINGS["custom-models create"], { ...input }, this.ctx, opts);
  }

  async get(id: string, opts: CallOptions = {}): Promise<V1Result<"custom-models get">> {
    return executeCommand<V1Result<"custom-models get">>(COMMAND_BINDINGS["custom-models get"], { id }, this.ctx, opts);
  }

  async update(id: string, input: V1Args<"custom-models update"> = {}, opts: CallOptions = {}): Promise<V1Result<"custom-models update">> {
    return executeCommand<V1Result<"custom-models update">>(COMMAND_BINDINGS["custom-models update"], { id, ...input }, this.ctx, opts);
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["custom-models delete"], { id }, this.ctx, opts);
  }
}

export class GuideApi {
  constructor(protected readonly ctx: HttpContext) {}

  async get(opts: CallOptions = {}): Promise<V1Result<"guide get">> {
    return executeCommand<V1Result<"guide get">>(COMMAND_BINDINGS["guide get"], {}, this.ctx, opts);
  }
}

export type GuideContent = V1Result<"guide get">;

export class ImagesApi {
  constructor(protected readonly ctx: HttpContext) {}

  async listModels(opts: CallOptions = {}): Promise<V1Result<"image models">["data"]> {
    const res = await executeCommand<V1Result<"image models">>(COMMAND_BINDINGS["image models"], {}, this.ctx, opts);
    return res.data;
  }

  async searchModels(query: V1Args<"image search"> = {}, opts: CallOptions = {}): Promise<V1Result<"image search">> {
    return executeCommand<V1Result<"image search">>(COMMAND_BINDINGS["image search"], { ...query }, this.ctx, opts);
  }
}

export class ModelsApi {
  constructor(protected readonly ctx: HttpContext) {}

  async list(opts: CallOptions = {}): Promise<V1Result<"models list">["data"]> {
    const res = await executeCommand<V1Result<"models list">>(COMMAND_BINDINGS["models list"], {}, this.ctx, opts);
    return res.data;
  }

  async search(query: V1Args<"models search"> = {}, opts: CallOptions = {}): Promise<V1Result<"models search">> {
    return executeCommand<V1Result<"models search">>(COMMAND_BINDINGS["models search"], { ...query }, this.ctx, opts);
  }
}

export class OperationsApi {
  constructor(protected readonly ctx: HttpContext) {}

  async get(id: string, opts: CallOptions = {}): Promise<V1Result<"operation get">> {
    return executeCommand<V1Result<"operation get">>(COMMAND_BINDINGS["operation get"], { id }, this.ctx, opts);
  }

  async list(query: ListOperationsInput = {}, opts: CallOptions = {}): Promise<V1Result<"operation list">["data"]> {
    const res = await executeCommand<V1Result<"operation list">>(COMMAND_BINDINGS["operation list"], { ...query }, this.ctx, opts);
    return res.data;
  }

  async cancel(id: string, opts: CallOptions = {}): Promise<V1Result<"operation cancel">> {
    return executeCommand<V1Result<"operation cancel">>(COMMAND_BINDINGS["operation cancel"], { id }, this.ctx, opts);
  }
}

export type Operation = V1Result<"operation get">;
export type ListOperationsInput = V1Args<"operation list">;

export class ProviderEndpointsApi {
  constructor(protected readonly ctx: HttpContext) {}

  async list(query: V1Args<"provider-endpoint list"> = {}, opts: CallOptions = {}): Promise<V1Result<"provider-endpoint list">["data"]> {
    const res = await executeCommand<V1Result<"provider-endpoint list">>(COMMAND_BINDINGS["provider-endpoint list"], { ...query }, this.ctx, opts);
    return res.data;
  }

  async presets(opts: CallOptions = {}): Promise<V1Result<"provider-endpoint presets">["data"]> {
    const res = await executeCommand<V1Result<"provider-endpoint presets">>(COMMAND_BINDINGS["provider-endpoint presets"], {}, this.ctx, opts);
    return res.data;
  }

  async create(input: CreateProviderEndpointInput, opts: CallOptions = {}): Promise<V1Result<"provider-endpoint create">> {
    return executeCommand<V1Result<"provider-endpoint create">>(COMMAND_BINDINGS["provider-endpoint create"], { ...input }, this.ctx, opts);
  }

  async update(id: string, input: UpdateProviderEndpointInput = {}, opts: CallOptions = {}): Promise<V1Result<"provider-endpoint update">> {
    return executeCommand<V1Result<"provider-endpoint update">>(COMMAND_BINDINGS["provider-endpoint update"], { id, ...input }, this.ctx, opts);
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["provider-endpoint delete"], { id }, this.ctx, opts);
  }

  async test(id: string, opts: CallOptions = {}): Promise<V1Result<"provider-endpoint test">> {
    return executeCommand<V1Result<"provider-endpoint test">>(COMMAND_BINDINGS["provider-endpoint test"], { id }, this.ctx, opts);
  }
}

export type CreateProviderEndpointInput = V1Args<"provider-endpoint create">;
export type UpdateProviderEndpointInput = V1Args<"provider-endpoint update">;
export type ProviderEndpointModelMappingInput = NonNullable<
  CreateProviderEndpointInput["model_mappings"]
>[number];

export class SearchApi {
  constructor(protected readonly ctx: HttpContext) {}

  async search(query: SearchInput, opts: CallOptions = {}): Promise<V1Result<"search query">["data"]> {
    const res = await executeCommand<V1Result<"search query">>(COMMAND_BINDINGS["search query"], { ...query }, this.ctx, opts);
    return res.data;
  }
}

export type SearchInput = V1Args<"search query">;

export class SettingsApi {
  constructor(protected readonly ctx: HttpContext) {}

  async get(opts: CallOptions = {}): Promise<V1Result<"settings get">> {
    return executeCommand<V1Result<"settings get">>(COMMAND_BINDINGS["settings get"], {}, this.ctx, opts);
  }

  async update(input: UpdateSettingsInput = {}, opts: CallOptions = {}): Promise<V1Result<"settings update">> {
    return executeCommand<V1Result<"settings update">>(COMMAND_BINDINGS["settings update"], { ...input }, this.ctx, opts);
  }
}

export type UpdateSettingsInput = V1Args<"settings update">;

export class SubscriptionApi {
  constructor(protected readonly ctx: HttpContext) {}

  async get(opts: CallOptions = {}): Promise<V1Result<"subscription get">> {
    return executeCommand<V1Result<"subscription get">>(COMMAND_BINDINGS["subscription get"], {}, this.ctx, opts);
  }
}

export class VideosApi {
  constructor(protected readonly ctx: HttpContext) {}

  async listModels(opts: CallOptions = {}): Promise<V1Result<"video models">["data"]> {
    const res = await executeCommand<V1Result<"video models">>(COMMAND_BINDINGS["video models"], {}, this.ctx, opts);
    return res.data;
  }

  async searchModels(query: SearchVideoModelsInput = {}, opts: CallOptions = {}): Promise<V1Result<"video search">> {
    return executeCommand<V1Result<"video search">>(COMMAND_BINDINGS["video search"], { ...query }, this.ctx, opts);
  }
}

export type SearchVideoModelsInput = V1Args<"video search">;

export class AudioApi {
  constructor(protected readonly ctx: HttpContext) {}

  async listModels(opts: CallOptions = {}): Promise<V1Result<"audio models">["data"]> {
    const res = await executeCommand<V1Result<"audio models">>(COMMAND_BINDINGS["audio models"], {}, this.ctx, opts);
    return res.data;
  }

  async searchModels(query: V1Args<"audio search-models"> = {}, opts: CallOptions = {}): Promise<V1Result<"audio search-models">> {
    return executeCommand<V1Result<"audio search-models">>(COMMAND_BINDINGS["audio search-models"], { ...query }, this.ctx, opts);
  }

  async listVoices(query: ListVoicesInput = {}, opts: CallOptions = {}): Promise<V1Result<"audio voices">["data"]> {
    const res = await executeCommand<V1Result<"audio voices">>(COMMAND_BINDINGS["audio voices"], { ...query }, this.ctx, opts);
    return res.data;
  }

  async searchVoices(query: V1Args<"audio search-voices"> = {}, opts: CallOptions = {}): Promise<V1Result<"audio search-voices">> {
    return executeCommand<V1Result<"audio search-voices">>(COMMAND_BINDINGS["audio search-voices"], { ...query }, this.ctx, opts);
  }
}

export type ListVoicesInput = V1Args<"audio voices">;

export class WebSearchApi {
  constructor(protected readonly ctx: HttpContext) {}

  async search(input: WebSearchInput, opts: CallOptions = {}): Promise<V1Result<"web search">> {
    return executeCommand<V1Result<"web search">>(COMMAND_BINDINGS["web search"], { ...input }, this.ctx, opts);
  }

  async fetch(input: V1Args<"web fetch">, opts: CallOptions = {}): Promise<V1Result<"web fetch">> {
    return executeCommand<V1Result<"web fetch">>(COMMAND_BINDINGS["web fetch"], { ...input }, this.ctx, opts);
  }
}

export type WebSearchInput = V1Args<"web search">;

export class WorkspacesApi {
  constructor(protected readonly ctx: HttpContext) {}

  async list(query: V1Args<"workspace list"> = {}, opts: CallOptions = {}): Promise<V1Result<"workspace list">["data"]> {
    const res = await executeCommand<V1Result<"workspace list">>(COMMAND_BINDINGS["workspace list"], { ...query }, this.ctx, opts);
    return res.data;
  }

  async create(input: CreateWorkspaceInput, opts: CallOptions = {}): Promise<V1Result<"workspace create">> {
    return executeCommand<V1Result<"workspace create">>(COMMAND_BINDINGS["workspace create"], { ...input }, this.ctx, opts);
  }

  async get(id: string, opts: CallOptions = {}): Promise<V1Result<"workspace get">> {
    return executeCommand<V1Result<"workspace get">>(COMMAND_BINDINGS["workspace get"], { id }, this.ctx, opts);
  }

  async update(id: string, input: UpdateWorkspaceInput = {}, opts: CallOptions = {}): Promise<V1Result<"workspace update">> {
    return executeCommand<V1Result<"workspace update">>(COMMAND_BINDINGS["workspace update"], { id, ...input }, this.ctx, opts);
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["workspace delete"], { id }, this.ctx, opts);
  }

  async archive(id: string, opts: CallOptions = {}): Promise<V1Result<"workspace archive">> {
    return executeCommand<V1Result<"workspace archive">>(COMMAND_BINDINGS["workspace archive"], { id }, this.ctx, opts);
  }

  async unarchive(id: string, opts: CallOptions = {}): Promise<V1Result<"workspace unarchive">> {
    return executeCommand<V1Result<"workspace unarchive">>(COMMAND_BINDINGS["workspace unarchive"], { id }, this.ctx, opts);
  }

  async listMembers(id: string, opts: CallOptions = {}): Promise<V1Result<"workspace members">["data"]> {
    const res = await executeCommand<V1Result<"workspace members">>(COMMAND_BINDINGS["workspace members"], { id }, this.ctx, opts);
    return res.data;
  }

  async addMember(id: string, input: AddMemberInput, opts: CallOptions = {}): Promise<V1Result<"workspace add-member">> {
    return executeCommand<V1Result<"workspace add-member">>(COMMAND_BINDINGS["workspace add-member"], { id, ...input }, this.ctx, opts);
  }

  async updateMember(id: string, memberId: string, input: UpdateMemberInput, opts: CallOptions = {}): Promise<V1Result<"workspace update-member">> {
    return executeCommand<V1Result<"workspace update-member">>(COMMAND_BINDINGS["workspace update-member"], { id, memberId, ...input }, this.ctx, opts);
  }

  async removeMember(id: string, memberId: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["workspace remove-member"], { id, memberId }, this.ctx, opts);
  }

  async listInvitations(id: string, opts: CallOptions = {}): Promise<V1Result<"workspace invitations">["data"]> {
    const res = await executeCommand<V1Result<"workspace invitations">>(COMMAND_BINDINGS["workspace invitations"], { id }, this.ctx, opts);
    return res.data;
  }

  async createInvitation(id: string, input: CreateInvitationInput, opts: CallOptions = {}): Promise<V1Result<"workspace invite">> {
    return executeCommand<V1Result<"workspace invite">>(COMMAND_BINDINGS["workspace invite"], { id, ...input }, this.ctx, opts);
  }

  async deleteInvitation(id: string, inviteeSlug: V1Args<"workspace revoke-invitation">["invitee_slug"], opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["workspace revoke-invitation"], { id, invitee_slug: inviteeSlug }, this.ctx, opts);
  }
}

export type CreateWorkspaceInput = V1Args<"workspace create">;
export type UpdateWorkspaceInput = V1Args<"workspace update">;
export type AddMemberInput = V1Args<"workspace add-member">;
export type UpdateMemberInput = V1Args<"workspace update-member">;
export type CreateInvitationInput = V1Args<"workspace invite">;
export type CreateInvitationResult = V1Result<"workspace invite">;
export type DeleteInvitationResult = DeletedResponse;
export type WritableMemberRole = AddMemberInput["role"];

export class AutomationsApiBase {
  constructor(protected readonly ctx: HttpContext) {}

  async list(query: V1Args<"automation list"> = {}, opts: CallOptions = {}): Promise<V1Result<"automation list">["data"]> {
    const res = await executeCommand<V1Result<"automation list">>(COMMAND_BINDINGS["automation list"], { ...query }, this.ctx, opts);
    return res.data;
  }

  async create(workspaceId: V1Args<"automation create">["workspace_id"], input: CreateAutomationInput, opts: CallOptions = {}): Promise<V1Result<"automation create">> {
    return executeCommand<V1Result<"automation create">>(COMMAND_BINDINGS["automation create"], { workspace_id: workspaceId, ...input }, this.ctx, opts);
  }

  async get(id: string, opts: CallOptions = {}): Promise<V1Result<"automation get">> {
    return executeCommand<V1Result<"automation get">>(COMMAND_BINDINGS["automation get"], { id }, this.ctx, opts);
  }

  async update(id: string, input: UpdateAutomationInput = {}, opts: CallOptions = {}): Promise<V1Result<"automation update">> {
    return executeCommand<V1Result<"automation update">>(COMMAND_BINDINGS["automation update"], { id, ...input }, this.ctx, opts);
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["automation delete"], { id }, this.ctx, opts);
  }

  async archive(id: string, opts: CallOptions = {}): Promise<V1Result<"automation archive">> {
    return executeCommand<V1Result<"automation archive">>(COMMAND_BINDINGS["automation archive"], { id }, this.ctx, opts);
  }

  async unarchive(id: string, opts: CallOptions = {}): Promise<V1Result<"automation unarchive">> {
    return executeCommand<V1Result<"automation unarchive">>(COMMAND_BINDINGS["automation unarchive"], { id }, this.ctx, opts);
  }

  async rotateSecret(id: string, opts: CallOptions = {}): Promise<V1Result<"automation rotate-secret">> {
    return executeCommand<V1Result<"automation rotate-secret">>(COMMAND_BINDINGS["automation rotate-secret"], { id }, this.ctx, opts);
  }

  async listRuns(id: string, query: ListAutomationRunsQuery = {}, opts: CallOptions = {}): Promise<V1Result<"automation runs">["data"]> {
    const res = await executeCommand<V1Result<"automation runs">>(COMMAND_BINDINGS["automation runs"], { id, ...query }, this.ctx, opts);
    return res.data;
  }

  async getCostStats(id: string, opts: CallOptions = {}): Promise<V1Result<"automation cost-stats">> {
    return executeCommand<V1Result<"automation cost-stats">>(COMMAND_BINDINGS["automation cost-stats"], { id }, this.ctx, opts);
  }

  async getCostStatsMap(query: V1Args<"automation cost-stats-all"> = {}, opts: CallOptions = {}): Promise<V1Result<"automation cost-stats-all">["by_id"]> {
    const res = await executeCommand<V1Result<"automation cost-stats-all">>(COMMAND_BINDINGS["automation cost-stats-all"], { ...query }, this.ctx, opts);
    return res["by_id"];
  }
}

export type CreateAutomationInput = Omit<V1Args<"automation create">, "workspace_id">;
export type UpdateAutomationInput = V1Args<"automation update">;
export type ListAutomationRunsQuery = V1Args<"automation runs">;

export class ComputersApiBase {
  constructor(protected readonly ctx: HttpContext) {}

  async list(query: ListComputersQuery = {}, opts: CallOptions = {}): Promise<V1Result<"computer list">["data"]> {
    const res = await executeCommand<V1Result<"computer list">>(COMMAND_BINDINGS["computer list"], { ...query }, this.ctx, opts);
    return res.data;
  }

  async get(id: string, opts: CallOptions = {}): Promise<V1Result<"computer get">> {
    return executeCommand<V1Result<"computer get">>(COMMAND_BINDINGS["computer get"], { id }, this.ctx, opts);
  }

  async update(id: string, input: UpdateComputerInput = {}, opts: CallOptions = {}): Promise<V1Result<"computer update">> {
    return executeCommand<V1Result<"computer update">>(COMMAND_BINDINGS["computer update"], { id, ...input }, this.ctx, opts);
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["computer delete"], { id }, this.ctx, opts);
  }

  async archive(id: string, opts: CallOptions = {}): Promise<V1Result<"computer archive">> {
    return executeCommand<V1Result<"computer archive">>(COMMAND_BINDINGS["computer archive"], { id }, this.ctx, opts);
  }

  async unarchive(id: string, opts: CallOptions = {}): Promise<V1Result<"computer unarchive">> {
    return executeCommand<V1Result<"computer unarchive">>(COMMAND_BINDINGS["computer unarchive"], { id }, this.ctx, opts);
  }

  async start(id: string, opts: CallOptions = {}): Promise<V1Result<"computer start">> {
    return executeCommand<V1Result<"computer start">>(COMMAND_BINDINGS["computer start"], { id }, this.ctx, opts);
  }

  async stop(id: string, opts: CallOptions = {}): Promise<V1Result<"computer stop">> {
    return executeCommand<V1Result<"computer stop">>(COMMAND_BINDINGS["computer stop"], { id }, this.ctx, opts);
  }

  async hibernate(id: string, opts: CallOptions = {}): Promise<V1Result<"computer hibernate">> {
    return executeCommand<V1Result<"computer hibernate">>(COMMAND_BINDINGS["computer hibernate"], { id }, this.ctx, opts);
  }

  async testConnection(id: string, opts: CallOptions = {}): Promise<V1Result<"computer test-connection">> {
    return executeCommand<V1Result<"computer test-connection">>(COMMAND_BINDINGS["computer test-connection"], { id }, this.ctx, opts);
  }

  async exec(id: string, input: ExecCommandInput, opts: ExecuteCommandOptions = {}): Promise<V1Result<"computer exec">> {
    return executeCommand<V1Result<"computer exec">>(COMMAND_BINDINGS["computer exec"], { id, ...input }, this.ctx, opts);
  }

  async terminal(id: string, input: TerminalInput, opts: CallOptions = {}): Promise<V1Result<"computer terminal">> {
    return executeCommand<V1Result<"computer terminal">>(COMMAND_BINDINGS["computer terminal"], { id, ...input }, this.ctx, opts);
  }

  async fs(id: string, input: FsInput, opts: CallOptions = {}): Promise<V1Result<"computer fs">> {
    return executeCommand<V1Result<"computer fs">>(COMMAND_BINDINGS["computer fs"], { id, ...input }, this.ctx, opts);
  }

  async fsDownload(id: string, path: V1Args<"computer download">["path"], query: Omit<V1Args<"computer download">, "path"> = {}, opts: ExecuteCommandOptions = {}): Promise<Blob> {
    return executeCommand<Blob>(COMMAND_BINDINGS["computer download"], { id, path, ...query }, this.ctx, opts);
  }

  async listPorts(id: string, query: V1Args<"computer ports"> = {}, opts: CallOptions = {}): Promise<V1Result<"computer ports">> {
    return executeCommand<V1Result<"computer ports">>(COMMAND_BINDINGS["computer ports"], { id, ...query }, this.ctx, opts);
  }

  async portLabel(id: string, input: PatchPortInput, opts: CallOptions = {}): Promise<V1Result<"computer port-label">> {
    return executeCommand<V1Result<"computer port-label">>(COMMAND_BINDINGS["computer port-label"], { id, ...input }, this.ctx, opts);
  }

  async portOpen(id: string, input: V1Args<"computer port-open">, opts: CallOptions = {}): Promise<V1Result<"computer port-open">> {
    return executeCommand<V1Result<"computer port-open">>(COMMAND_BINDINGS["computer port-open"], { id, ...input }, this.ctx, opts);
  }

  async portClose(id: string, input: V1Args<"computer port-close">, opts: CallOptions = {}): Promise<V1Result<"computer port-close">> {
    return executeCommand<V1Result<"computer port-close">>(COMMAND_BINDINGS["computer port-close"], { id, ...input }, this.ctx, opts);
  }

  async portMakePublic(id: string, input: V1Args<"computer port-make-public">, opts: CallOptions = {}): Promise<V1Result<"computer port-make-public">> {
    return executeCommand<V1Result<"computer port-make-public">>(COMMAND_BINDINGS["computer port-make-public"], { id, ...input }, this.ctx, opts);
  }

  async portRevokePublic(id: string, input: V1Args<"computer port-revoke-public">, opts: CallOptions = {}): Promise<V1Result<"computer port-revoke-public">> {
    return executeCommand<V1Result<"computer port-revoke-public">>(COMMAND_BINDINGS["computer port-revoke-public"], { id, ...input }, this.ctx, opts);
  }

  async getUser(id: string, username: string, opts: CallOptions = {}): Promise<V1Result<"computer get-user">> {
    return executeCommand<V1Result<"computer get-user">>(COMMAND_BINDINGS["computer get-user"], { id, username }, this.ctx, opts);
  }

  async createUser(id: string, input: CreateComputerUserInput, opts: CallOptions = {}): Promise<V1Result<"computer create-user">> {
    return executeCommand<V1Result<"computer create-user">>(COMMAND_BINDINGS["computer create-user"], { id, ...input }, this.ctx, opts);
  }

  async updateUser(id: string, username: string, input: UpdateComputerUserInput = {}, opts: CallOptions = {}): Promise<V1Result<"computer update-user">> {
    return executeCommand<V1Result<"computer update-user">>(COMMAND_BINDINGS["computer update-user"], { id, username, ...input }, this.ctx, opts);
  }

  async deleteUser(id: string, username: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["computer delete-user"], { id, username }, this.ctx, opts);
  }

  async expose(id: string, input: V1Args<"computer add-exposure">, opts: CallOptions = {}): Promise<V1Result<"computer add-exposure">["exposure"]> {
    const res = await executeCommand<V1Result<"computer add-exposure">>(COMMAND_BINDINGS["computer add-exposure"], { id, ...input }, this.ctx, opts);
    return res["exposure"];
  }

  async updateExposure(id: string, workspaceId: string, capabilities: V1Args<"computer update-exposure">["capabilities"], opts: CallOptions = {}): Promise<V1Result<"computer update-exposure">["exposure"]> {
    const res = await executeCommand<V1Result<"computer update-exposure">>(COMMAND_BINDINGS["computer update-exposure"], { id, workspace_id: workspaceId, capabilities }, this.ctx, opts);
    return res["exposure"];
  }

  async unexpose(id: string, workspaceId: string, opts: CallOptions = {}): Promise<V1Result<"computer remove-exposure">> {
    return executeCommand<V1Result<"computer remove-exposure">>(COMMAND_BINDINGS["computer remove-exposure"], { id, workspace_id: workspaceId }, this.ctx, opts);
  }

  async transfer(id: string, owner: V1Args<"computer transfer">["owner"], opts: CallOptions = {}): Promise<V1Result<"computer transfer">["computer"]> {
    const res = await executeCommand<V1Result<"computer transfer">>(COMMAND_BINDINGS["computer transfer"], { id, owner }, this.ctx, opts);
    return res["computer"];
  }
}

export type ListComputersQuery = V1Args<"computer list">;
export type UpdateComputerInput = V1Args<"computer update">;
export type ExecCommandInput = V1Args<"computer exec">;
export type TerminalInput = V1Args<"computer terminal">;
export type FsInput = V1Args<"computer fs">;
export type PatchPortInput = V1Args<"computer port-label">;
export type CreateComputerUserInput = V1Args<"computer create-user">;
export type UpdateComputerUserInput = V1Args<"computer update-user">;
export type FsOp = FsInput["op"];
export type TerminalOp = TerminalInput["op"];

export class NotificationsApiBase {
  constructor(protected readonly ctx: HttpContext) {}

  async get(id: string, opts: CallOptions = {}): Promise<V1Result<"notification get">> {
    return executeCommand<V1Result<"notification get">>(COMMAND_BINDINGS["notification get"], { id }, this.ctx, opts);
  }

  async update(id: string, input: UpdateNotificationInput = {}, opts: CallOptions = {}): Promise<V1Result<"notification update">> {
    return executeCommand<V1Result<"notification update">>(COMMAND_BINDINGS["notification update"], { id, ...input }, this.ctx, opts);
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["notification delete"], { id }, this.ctx, opts);
  }

  async getConfig(opts: CallOptions = {}): Promise<V1Result<"notification config">> {
    return executeCommand<V1Result<"notification config">>(COMMAND_BINDINGS["notification config"], {}, this.ctx, opts);
  }

  async updateConfig(input: V1Args<"notification update-config"> = {}, opts: CallOptions = {}): Promise<V1Result<"notification update-config">> {
    return executeCommand<V1Result<"notification update-config">>(COMMAND_BINDINGS["notification update-config"], { ...input }, this.ctx, opts);
  }

  async getPreferences(opts: CallOptions = {}): Promise<V1Result<"notification preferences">["data"]> {
    const res = await executeCommand<V1Result<"notification preferences">>(COMMAND_BINDINGS["notification preferences"], {}, this.ctx, opts);
    return res.data;
  }

  async updatePreferences(updates: V1Args<"notification update-preferences">["updates"], opts: CallOptions = {}): Promise<V1Result<"notification update-preferences">["data"]> {
    const res = await executeCommand<V1Result<"notification update-preferences">>(COMMAND_BINDINGS["notification update-preferences"], { updates }, this.ctx, opts);
    return res.data;
  }
}

export type UpdateNotificationInput = V1Args<"notification update">;
export type ListNotificationsQuery = V1Args<"notification list">;
export type NotificationPreferenceUpdate = V1Args<"notification update-preferences">["updates"][number];

export class ContainersApi {
  constructor(protected readonly ctx: HttpContext) {}

  async list(query: V1Args<"container list"> = {}, opts: CallOptions = {}): Promise<V1Result<"container list">["data"]> {
    const res = await executeCommand<V1Result<"container list">>(COMMAND_BINDINGS["container list"], { ...query }, this.ctx, opts);
    return res.data;
  }

  async get(id: string, opts: CallOptions = {}): Promise<V1Result<"container get">> {
    return executeCommand<V1Result<"container get">>(COMMAND_BINDINGS["container get"], { id }, this.ctx, opts);
  }

  async create(input: V1Args<"container create">, opts: ExecuteCommandOptions = {}): Promise<V1Result<"container create">> {
    return executeCommand<V1Result<"container create">>(COMMAND_BINDINGS["container create"], { ...input }, this.ctx, opts);
  }

  async update(id: string, input: V1Args<"container update"> = {}, opts: CallOptions = {}): Promise<V1Result<"container update">> {
    return executeCommand<V1Result<"container update">>(COMMAND_BINDINGS["container update"], { id, ...input }, this.ctx, opts);
  }

  async composeUp(input: V1Args<"container compose-up">, opts: ExecuteCommandOptions = {}): Promise<V1Result<"container compose-up">> {
    return executeCommand<V1Result<"container compose-up">>(COMMAND_BINDINGS["container compose-up"], { ...input }, this.ctx, opts);
  }

  async run(input: V1Args<"container run">, opts: ExecuteCommandOptions = {}): Promise<V1Result<"container run">> {
    return executeCommand<V1Result<"container run">>(COMMAND_BINDINGS["container run"], { ...input }, this.ctx, opts);
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["container delete"], { id }, this.ctx, opts);
  }

  async up(id: string, opts: ExecuteCommandOptions = {}): Promise<V1Result<"container up">> {
    return executeCommand<V1Result<"container up">>(COMMAND_BINDINGS["container up"], { id }, this.ctx, opts);
  }

  async down(id: string, opts: CallOptions = {}): Promise<V1Result<"container down">> {
    return executeCommand<V1Result<"container down">>(COMMAND_BINDINGS["container down"], { id }, this.ctx, opts);
  }

  async restart(id: string, opts: CallOptions = {}): Promise<V1Result<"container restart">> {
    return executeCommand<V1Result<"container restart">>(COMMAND_BINDINGS["container restart"], { id }, this.ctx, opts);
  }

  async rebuild(id: string, input: V1Args<"container rebuild"> = {}, opts: ExecuteCommandOptions = {}): Promise<V1Result<"container rebuild">> {
    return executeCommand<V1Result<"container rebuild">>(COMMAND_BINDINGS["container rebuild"], { id, ...input }, this.ctx, opts);
  }

  async composeGet(id: string, opts: CallOptions = {}): Promise<V1Result<"container compose-get">> {
    return executeCommand<V1Result<"container compose-get">>(COMMAND_BINDINGS["container compose-get"], { id }, this.ctx, opts);
  }

  async composeSet(id: string, input: V1Args<"container compose-set">, opts: CallOptions = {}): Promise<V1Result<"container compose-set">> {
    return executeCommand<V1Result<"container compose-set">>(COMMAND_BINDINGS["container compose-set"], { id, ...input }, this.ctx, opts);
  }

  async logs(id: string, query: V1Args<"container logs"> = {}, opts: CallOptions = {}): Promise<V1Result<"container logs">> {
    return executeCommand<V1Result<"container logs">>(COMMAND_BINDINGS["container logs"], { id, ...query }, this.ctx, opts);
  }

  async exec(id: string, input: V1Args<"container exec">, opts: ExecuteCommandOptions = {}): Promise<V1Result<"container exec">> {
    return executeCommand<V1Result<"container exec">>(COMMAND_BINDINGS["container exec"], { id, ...input }, this.ctx, opts);
  }

  async ports(id: string, opts: CallOptions = {}): Promise<V1Result<"container ports">["data"]> {
    const res = await executeCommand<V1Result<"container ports">>(COMMAND_BINDINGS["container ports"], { id }, this.ctx, opts);
    return res.data;
  }

  async expose(id: string, input: V1Args<"container expose">, opts: CallOptions = {}): Promise<V1Result<"container expose">> {
    return executeCommand<V1Result<"container expose">>(COMMAND_BINDINGS["container expose"], { id, ...input }, this.ctx, opts);
  }

  async unexpose(id: string, input: V1Args<"container unexpose">, opts: CallOptions = {}): Promise<V1Result<"container unexpose">> {
    return executeCommand<V1Result<"container unexpose">>(COMMAND_BINDINGS["container unexpose"], { id, ...input }, this.ctx, opts);
  }

  async backup(id: string, input: V1Args<"container backup"> = {}, opts: ExecuteCommandOptions = {}): Promise<V1Result<"container backup">> {
    return executeCommand<V1Result<"container backup">>(COMMAND_BINDINGS["container backup"], { id, ...input }, this.ctx, opts);
  }

  async restore(id: string, input: V1Args<"container restore"> = {}, opts: ExecuteCommandOptions = {}): Promise<V1Result<"container restore">> {
    return executeCommand<V1Result<"container restore">>(COMMAND_BINDINGS["container restore"], { id, ...input }, this.ctx, opts);
  }

  async backups(id: string, opts: CallOptions = {}): Promise<V1Result<"container backups">["data"]> {
    const res = await executeCommand<V1Result<"container backups">>(COMMAND_BINDINGS["container backups"], { id }, this.ctx, opts);
    return res.data;
  }

  async migrate(id: string, input: V1Args<"container migrate">, opts: ExecuteCommandOptions = {}): Promise<V1Result<"container migrate">> {
    return executeCommand<V1Result<"container migrate">>(COMMAND_BINDINGS["container migrate"], { id, ...input }, this.ctx, opts);
  }

  async events(id: string, opts: CallOptions = {}): Promise<V1Result<"container events">["data"]> {
    const res = await executeCommand<V1Result<"container events">>(COMMAND_BINDINGS["container events"], { id }, this.ctx, opts);
    return res.data;
  }

  async runtime(query: V1Args<"container runtime">, opts: CallOptions = {}): Promise<V1Result<"container runtime">> {
    return executeCommand<V1Result<"container runtime">>(COMMAND_BINDINGS["container runtime"], { ...query }, this.ctx, opts);
  }
}

export class CredentialsApi {
  constructor(protected readonly ctx: HttpContext) {}

  async list(query: V1Args<"credential list"> = {}, opts: CallOptions = {}): Promise<V1Result<"credential list">["data"]> {
    const res = await executeCommand<V1Result<"credential list">>(COMMAND_BINDINGS["credential list"], { ...query }, this.ctx, opts);
    return res.data;
  }

  async get(id: string, opts: CallOptions = {}): Promise<V1Result<"credential get">> {
    return executeCommand<V1Result<"credential get">>(COMMAND_BINDINGS["credential get"], { id }, this.ctx, opts);
  }

  async create(input: CreateCredentialInput, opts: CallOptions = {}): Promise<V1Result<"credential create">> {
    return executeCommand<V1Result<"credential create">>(COMMAND_BINDINGS["credential create"], { ...input }, this.ctx, opts);
  }

  async update(id: string, input: UpdateCredentialInput = {}, opts: CallOptions = {}): Promise<V1Result<"credential update">> {
    return executeCommand<V1Result<"credential update">>(COMMAND_BINDINGS["credential update"], { id, ...input }, this.ctx, opts);
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["credential delete"], { id }, this.ctx, opts);
  }

  async versions(id: string, opts: CallOptions = {}): Promise<V1Result<"credential versions">["data"]> {
    const res = await executeCommand<V1Result<"credential versions">>(COMMAND_BINDINGS["credential versions"], { id }, this.ctx, opts);
    return res.data;
  }
}

export type CreateCredentialInput = V1Args<"credential create">;
export type UpdateCredentialInput = V1Args<"credential update">;

export class SharingApiBase {
  constructor(protected readonly ctx: HttpContext) {}

  async list(query: ListSharesQuery, opts: CallOptions = {}): Promise<V1Result<"share list">["data"]> {
    const res = await executeCommand<V1Result<"share list">>(COMMAND_BINDINGS["share list"], { ...query }, this.ctx, opts);
    return res.data;
  }

  async add(input: CreateShareInput, opts: CallOptions = {}): Promise<V1Result<"share create">> {
    return executeCommand<V1Result<"share create">>(COMMAND_BINDINGS["share create"], { ...input }, this.ctx, opts);
  }

  async remove(input: RemoveShareInput, opts: CallOptions = {}): Promise<V1Result<"share delete">> {
    return executeCommand<V1Result<"share delete">>(COMMAND_BINDINGS["share delete"], { ...input }, this.ctx, opts);
  }

  async listSharedWithMe(query: ListSharedWithMeQuery = {}, opts: CallOptions = {}): Promise<V1Result<"shared-with-me list">["data"]> {
    const res = await executeCommand<V1Result<"shared-with-me list">>(COMMAND_BINDINGS["shared-with-me list"], { ...query }, this.ctx, opts);
    return res.data;
  }
}

export type ListSharesQuery = V1Args<"share list">;
export type CreateShareInput = V1Args<"share create">;
export type RemoveShareInput = V1Args<"share delete">;
export type ListSharedWithMeQuery = V1Args<"shared-with-me list">;

export class TaskListsApi {
  constructor(protected readonly ctx: HttpContext) {}

  async list(query: TaskListsQuery = {}, opts: CallOptions = {}): Promise<V1Result<"tasks list-list">["data"]> {
    const res = await executeCommand<V1Result<"tasks list-list">>(COMMAND_BINDINGS["tasks list-list"], { ...query }, this.ctx, opts);
    return res.data;
  }

  async create(input: TaskListCreateInput, opts: CallOptions = {}): Promise<V1Result<"tasks list-create">> {
    return executeCommand<V1Result<"tasks list-create">>(COMMAND_BINDINGS["tasks list-create"], { ...input }, this.ctx, opts);
  }

  async get(id: string, opts: CallOptions = {}): Promise<V1Result<"tasks list-get">> {
    return executeCommand<V1Result<"tasks list-get">>(COMMAND_BINDINGS["tasks list-get"], { id }, this.ctx, opts);
  }

  async update(id: string, input: TaskListUpdateInput = {}, opts: CallOptions = {}): Promise<V1Result<"tasks list-update">> {
    return executeCommand<V1Result<"tasks list-update">>(COMMAND_BINDINGS["tasks list-update"], { id, ...input }, this.ctx, opts);
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["tasks list-delete"], { id }, this.ctx, opts);
  }
}

export type TaskListsQuery = V1Args<"tasks list-list">;
export type TaskListCreateInput = V1Args<"tasks list-create">;
export type TaskListUpdateInput = V1Args<"tasks list-update">;

export class TaskLabelsApi {
  constructor(protected readonly ctx: HttpContext) {}

  async list(id: string, opts: CallOptions = {}): Promise<V1Result<"tasks label-list">["data"]> {
    const res = await executeCommand<V1Result<"tasks label-list">>(COMMAND_BINDINGS["tasks label-list"], { id }, this.ctx, opts);
    return res.data;
  }

  async create(id: string, input: TaskLabelCreateInput, opts: CallOptions = {}): Promise<V1Result<"tasks label-create">> {
    return executeCommand<V1Result<"tasks label-create">>(COMMAND_BINDINGS["tasks label-create"], { id, ...input }, this.ctx, opts);
  }

  async update(id: string, labelId: string, input: TaskLabelUpdateInput = {}, opts: CallOptions = {}): Promise<V1Result<"tasks label-update">> {
    return executeCommand<V1Result<"tasks label-update">>(COMMAND_BINDINGS["tasks label-update"], { id, labelId, ...input }, this.ctx, opts);
  }

  async delete(id: string, labelId: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["tasks label-delete"], { id, labelId }, this.ctx, opts);
  }
}

export type TaskLabelCreateInput = V1Args<"tasks label-create">;
export type TaskLabelUpdateInput = V1Args<"tasks label-update">;

export class TaskItemsApi {
  constructor(protected readonly ctx: HttpContext) {}

  async list(id: string, query: TaskListQuery = {}, opts: CallOptions = {}): Promise<V1Result<"tasks list">["data"]> {
    const res = await executeCommand<V1Result<"tasks list">>(COMMAND_BINDINGS["tasks list"], { id, ...query }, this.ctx, opts);
    return res.data;
  }

  async search(query: TaskSearchQuery = {}, opts: CallOptions = {}): Promise<V1Result<"tasks search">["data"]> {
    const res = await executeCommand<V1Result<"tasks search">>(COMMAND_BINDINGS["tasks search"], { ...query }, this.ctx, opts);
    return res.data;
  }

  async create(id: string, input: TaskCreateInput, opts: CallOptions = {}): Promise<V1Result<"tasks create">> {
    return executeCommand<V1Result<"tasks create">>(COMMAND_BINDINGS["tasks create"], { id, ...input }, this.ctx, opts);
  }

  async get(id: string, opts: CallOptions = {}): Promise<V1Result<"tasks get">> {
    return executeCommand<V1Result<"tasks get">>(COMMAND_BINDINGS["tasks get"], { id }, this.ctx, opts);
  }

  async update(id: string, input: TaskUpdateInput = {}, opts: CallOptions = {}): Promise<V1Result<"tasks update">> {
    return executeCommand<V1Result<"tasks update">>(COMMAND_BINDINGS["tasks update"], { id, ...input }, this.ctx, opts);
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["tasks delete"], { id }, this.ctx, opts);
  }

  async assign(id: string, input: V1Args<"tasks assign"> = {}, opts: CallOptions = {}): Promise<V1Result<"tasks assign">> {
    return executeCommand<V1Result<"tasks assign">>(COMMAND_BINDINGS["tasks assign"], { id, ...input }, this.ctx, opts);
  }

  async unassign(id: string, input: V1Args<"tasks unassign">, opts: CallOptions = {}): Promise<V1Result<"tasks unassign">> {
    return executeCommand<V1Result<"tasks unassign">>(COMMAND_BINDINGS["tasks unassign"], { id, ...input }, this.ctx, opts);
  }

  async duplicate(id: string, input: V1Args<"tasks duplicate">, opts: CallOptions = {}): Promise<V1Result<"tasks duplicate">> {
    return executeCommand<V1Result<"tasks duplicate">>(COMMAND_BINDINGS["tasks duplicate"], { id, ...input }, this.ctx, opts);
  }

  async ancestors(id: string, opts: CallOptions = {}): Promise<V1Result<"tasks ancestors">["data"]> {
    const res = await executeCommand<V1Result<"tasks ancestors">>(COMMAND_BINDINGS["tasks ancestors"], { id }, this.ctx, opts);
    return res.data;
  }

  async batchUpdate(id: string, input: V1Args<"tasks task-batch-update">, opts: CallOptions = {}): Promise<V1Result<"tasks task-batch-update">> {
    return executeCommand<V1Result<"tasks task-batch-update">>(COMMAND_BINDINGS["tasks task-batch-update"], { id, ...input }, this.ctx, opts);
  }

  async batchDelete(id: string, input: V1Args<"tasks task-batch-delete">, opts: CallOptions = {}): Promise<V1Result<"tasks task-batch-delete">> {
    return executeCommand<V1Result<"tasks task-batch-delete">>(COMMAND_BINDINGS["tasks task-batch-delete"], { id, ...input }, this.ctx, opts);
  }

  async import(id: string, input: V1Args<"tasks import">, opts: CallOptions = {}): Promise<V1Result<"tasks import">> {
    return executeCommand<V1Result<"tasks import">>(COMMAND_BINDINGS["tasks import"], { id, ...input }, this.ctx, opts);
  }
}

export type TaskListQuery = V1Args<"tasks list">;
export type TaskSearchQuery = V1Args<"tasks search">;
export type TaskCreateInput = V1Args<"tasks create">;
export type TaskUpdateInput = V1Args<"tasks update">;

export class TaskCommentsApi {
  constructor(protected readonly ctx: HttpContext) {}

  async list(id: string, opts: CallOptions = {}): Promise<V1Result<"tasks comment-list">["data"]> {
    const res = await executeCommand<V1Result<"tasks comment-list">>(COMMAND_BINDINGS["tasks comment-list"], { id }, this.ctx, opts);
    return res.data;
  }

  async create(id: string, content: V1Args<"tasks comment">["content"], opts: CallOptions = {}): Promise<V1Result<"tasks comment">> {
    return executeCommand<V1Result<"tasks comment">>(COMMAND_BINDINGS["tasks comment"], { id, content }, this.ctx, opts);
  }

  async update(id: string, commentId: string, content: V1Args<"tasks comment-update">["content"], opts: CallOptions = {}): Promise<V1Result<"tasks comment-update">> {
    return executeCommand<V1Result<"tasks comment-update">>(COMMAND_BINDINGS["tasks comment-update"], { id, commentId, content }, this.ctx, opts);
  }

  async delete(id: string, commentId: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["tasks comment-delete"], { id, commentId }, this.ctx, opts);
  }
}

export class TaskDependenciesApi {
  constructor(protected readonly ctx: HttpContext) {}

  async get(id: string, opts: CallOptions = {}): Promise<V1Result<"tasks dependencies">> {
    return executeCommand<V1Result<"tasks dependencies">>(COMMAND_BINDINGS["tasks dependencies"], { id }, this.ctx, opts);
  }

  async add(id: string, dependsOn: V1Args<"tasks depend">["depends_on"], opts: CallOptions = {}): Promise<V1Result<"tasks depend">> {
    return executeCommand<V1Result<"tasks depend">>(COMMAND_BINDINGS["tasks depend"], { id, depends_on: dependsOn }, this.ctx, opts);
  }

  async remove(id: string, dependsOn: V1Args<"tasks undepend">["depends_on"], opts: CallOptions = {}): Promise<V1Result<"tasks undepend">> {
    return executeCommand<V1Result<"tasks undepend">>(COMMAND_BINDINGS["tasks undepend"], { id, depends_on: dependsOn }, this.ctx, opts);
  }
}

export class TasksApiBase {
  constructor(protected readonly ctx: HttpContext) {}

  async events(id: string, opts: CallOptions = {}): Promise<V1Result<"tasks events">["data"]> {
    const res = await executeCommand<V1Result<"tasks events">>(COMMAND_BINDINGS["tasks events"], { id }, this.ctx, opts);
    return res.data;
  }
}

export class NotesBoxesApi {
  constructor(protected readonly ctx: HttpContext) {}

  async list(query: NotesBoxesQuery = {}, opts: CallOptions = {}): Promise<V1Result<"notes box-list">["data"]> {
    const res = await executeCommand<V1Result<"notes box-list">>(COMMAND_BINDINGS["notes box-list"], { ...query }, this.ctx, opts);
    return res.data;
  }

  async create(input: NotesBoxCreateInput, opts: CallOptions = {}): Promise<V1Result<"notes box-create">> {
    return executeCommand<V1Result<"notes box-create">>(COMMAND_BINDINGS["notes box-create"], { ...input }, this.ctx, opts);
  }

  async get(id: string, opts: CallOptions = {}): Promise<V1Result<"notes box-get">> {
    return executeCommand<V1Result<"notes box-get">>(COMMAND_BINDINGS["notes box-get"], { id }, this.ctx, opts);
  }

  async update(id: string, input: NotesBoxUpdateInput = {}, opts: CallOptions = {}): Promise<V1Result<"notes box-update">> {
    return executeCommand<V1Result<"notes box-update">>(COMMAND_BINDINGS["notes box-update"], { id, ...input }, this.ctx, opts);
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["notes box-delete"], { id }, this.ctx, opts);
  }
}

export type NotesBoxesQuery = V1Args<"notes box-list">;
export type NotesBoxCreateInput = V1Args<"notes box-create">;
export type NotesBoxUpdateInput = V1Args<"notes box-update">;

export class NotesNotesApi {
  constructor(protected readonly ctx: HttpContext) {}

  async list(id: string, opts: CallOptions = {}): Promise<V1Result<"notes list">["data"]> {
    const res = await executeCommand<V1Result<"notes list">>(COMMAND_BINDINGS["notes list"], { id }, this.ctx, opts);
    return res.data;
  }

  async read(id: string, title: V1Args<"notes read">["title"], opts: CallOptions = {}): Promise<V1Result<"notes read">> {
    return executeCommand<V1Result<"notes read">>(COMMAND_BINDINGS["notes read"], { id, title }, this.ctx, opts);
  }

  async write(id: string, input: NotesWriteInput, opts: CallOptions = {}): Promise<V1Result<"notes write">> {
    return executeCommand<V1Result<"notes write">>(COMMAND_BINDINGS["notes write"], { id, ...input }, this.ctx, opts);
  }

  async delete(id: string, title: V1Args<"notes delete">["title"], opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["notes delete"], { id, title }, this.ctx, opts);
  }

  async rename(id: string, title: V1Args<"notes note-rename">["title"], newTitle: V1Args<"notes note-rename">["new_title"], input: Omit<V1Args<"notes note-rename">, "title" | "new_title"> = {}, opts: CallOptions = {}): Promise<V1Result<"notes note-rename">> {
    return executeCommand<V1Result<"notes note-rename">>(COMMAND_BINDINGS["notes note-rename"], { id, title, new_title: newTitle, ...input }, this.ctx, opts);
  }

  async move(id: string, title: V1Args<"notes note-move">["title"], input: Omit<V1Args<"notes note-move">, "title"> = {}, opts: CallOptions = {}): Promise<V1Result<"notes note-move">> {
    return executeCommand<V1Result<"notes note-move">>(COMMAND_BINDINGS["notes note-move"], { id, title, ...input }, this.ctx, opts);
  }
}

export type NotesWriteInput = V1Args<"notes write">;

export class NotesFoldersApi {
  constructor(protected readonly ctx: HttpContext) {}

  async list(id: string, opts: CallOptions = {}): Promise<V1Result<"notes folder-list">["data"]> {
    const res = await executeCommand<V1Result<"notes folder-list">>(COMMAND_BINDINGS["notes folder-list"], { id }, this.ctx, opts);
    return res.data;
  }

  async create(id: string, input: V1Args<"notes folder-create">, opts: CallOptions = {}): Promise<V1Result<"notes folder-create">> {
    return executeCommand<V1Result<"notes folder-create">>(COMMAND_BINDINGS["notes folder-create"], { id, ...input }, this.ctx, opts);
  }

  async rename(folderId: string, input: V1Args<"notes folder-rename">, opts: CallOptions = {}): Promise<V1Result<"notes folder-rename">> {
    return executeCommand<V1Result<"notes folder-rename">>(COMMAND_BINDINGS["notes folder-rename"], { folderId, ...input }, this.ctx, opts);
  }

  async move(folderId: string, input: V1Args<"notes folder-move"> = {}, opts: CallOptions = {}): Promise<V1Result<"notes folder-move">> {
    return executeCommand<V1Result<"notes folder-move">>(COMMAND_BINDINGS["notes folder-move"], { folderId, ...input }, this.ctx, opts);
  }

  async delete(folderId: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["notes folder-delete"], { folderId }, this.ctx, opts);
  }
}

export class NotesIndexApi {
  constructor(protected readonly ctx: HttpContext) {}

  async read(id: string, opts: CallOptions = {}): Promise<V1Result<"notes index-read">> {
    return executeCommand<V1Result<"notes index-read">>(COMMAND_BINDINGS["notes index-read"], { id }, this.ctx, opts);
  }

  async write(id: string, content: V1Args<"notes index-write">["content"], opts: CallOptions = {}): Promise<V1Result<"notes index-write">> {
    return executeCommand<V1Result<"notes index-write">>(COMMAND_BINDINGS["notes index-write"], { id, content }, this.ctx, opts);
  }
}

export class NotesApiBase {
  constructor(protected readonly ctx: HttpContext) {}

  async search(id: string, q: V1Args<"notes search">["q"], query: Omit<V1Args<"notes search">, "q"> = {}, opts: CallOptions = {}): Promise<V1Result<"notes search">["data"]> {
    const res = await executeCommand<V1Result<"notes search">>(COMMAND_BINDINGS["notes search"], { id, q, ...query }, this.ctx, opts);
    return res.data;
  }

  async searchAll(q: V1Args<"notes search-all">["q"], query: Omit<V1Args<"notes search-all">, "q"> = {}, opts: CallOptions = {}): Promise<V1Result<"notes search-all">["data"]> {
    const res = await executeCommand<V1Result<"notes search-all">>(COMMAND_BINDINGS["notes search-all"], { q, ...query }, this.ctx, opts);
    return res.data;
  }

  async graph(id: string, opts: CallOptions = {}): Promise<V1Result<"notes graph">> {
    return executeCommand<V1Result<"notes graph">>(COMMAND_BINDINGS["notes graph"], { id }, this.ctx, opts);
  }

  async links(noteId: string, opts: CallOptions = {}): Promise<V1Result<"notes links">> {
    return executeCommand<V1Result<"notes links">>(COMMAND_BINDINGS["notes links"], { noteId }, this.ctx, opts);
  }

  async tree(id: string, opts: CallOptions = {}): Promise<V1Result<"notes tree">> {
    return executeCommand<V1Result<"notes tree">>(COMMAND_BINDINGS["notes tree"], { id }, this.ctx, opts);
  }

  async tagList(id: string, opts: CallOptions = {}): Promise<V1Result<"notes tag-list">["data"]> {
    const res = await executeCommand<V1Result<"notes tag-list">>(COMMAND_BINDINGS["notes tag-list"], { id }, this.ctx, opts);
    return res.data;
  }

  async tagRename(id: string, input: V1Args<"notes tag-rename">, opts: CallOptions = {}): Promise<V1Result<"notes tag-rename">> {
    return executeCommand<V1Result<"notes tag-rename">>(COMMAND_BINDINGS["notes tag-rename"], { id, ...input }, this.ctx, opts);
  }

  async import(id: string, input: V1Args<"notes import">, opts: CallOptions = {}): Promise<V1Result<"notes import">> {
    return executeCommand<V1Result<"notes import">>(COMMAND_BINDINGS["notes import"], { id, ...input }, this.ctx, opts);
  }

  async trashList(query: V1Args<"notes trash-list"> = {}, opts: CallOptions = {}): Promise<V1Result<"notes trash-list">["data"]> {
    const res = await executeCommand<V1Result<"notes trash-list">>(COMMAND_BINDINGS["notes trash-list"], { ...query }, this.ctx, opts);
    return res.data;
  }

  async restore(input: V1Args<"notes restore">, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["notes restore"], { ...input }, this.ctx, opts);
  }

  async purge(input: V1Args<"notes purge">, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["notes purge"], { ...input }, this.ctx, opts);
  }

  async trashEmpty(input: V1Args<"notes trash-empty"> = {}, opts: CallOptions = {}): Promise<V1Result<"notes trash-empty">> {
    return executeCommand<V1Result<"notes trash-empty">>(COMMAND_BINDINGS["notes trash-empty"], { ...input }, this.ctx, opts);
  }
}

export class MemoryBoxesApi {
  constructor(protected readonly ctx: HttpContext) {}

  async list(query: MemoryBoxesQuery = {}, opts: CallOptions = {}): Promise<V1Result<"memory box-list">["data"]> {
    const res = await executeCommand<V1Result<"memory box-list">>(COMMAND_BINDINGS["memory box-list"], { ...query }, this.ctx, opts);
    return res.data;
  }

  async get(id: string, opts: CallOptions = {}): Promise<V1Result<"memory box-get">> {
    return executeCommand<V1Result<"memory box-get">>(COMMAND_BINDINGS["memory box-get"], { id }, this.ctx, opts);
  }

  async update(id: string, input: MemoryBoxUpdateInput = {}, opts: CallOptions = {}): Promise<V1Result<"memory box-update">> {
    return executeCommand<V1Result<"memory box-update">>(COMMAND_BINDINGS["memory box-update"], { id, ...input }, this.ctx, opts);
  }

  async delete(id: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["memory box-delete"], { id }, this.ctx, opts);
  }
}

export type MemoryBoxesQuery = V1Args<"memory box-list">;
export type MemoryBoxUpdateInput = V1Args<"memory box-update">;

export class MemoryNotesApi {
  constructor(protected readonly ctx: HttpContext) {}

  async list(id: string, opts: CallOptions = {}): Promise<V1Result<"memory list">["data"]> {
    const res = await executeCommand<V1Result<"memory list">>(COMMAND_BINDINGS["memory list"], { id }, this.ctx, opts);
    return res.data;
  }

  async read(id: string, title: V1Args<"memory read">["title"], opts: CallOptions = {}): Promise<V1Result<"memory read">> {
    return executeCommand<V1Result<"memory read">>(COMMAND_BINDINGS["memory read"], { id, title }, this.ctx, opts);
  }

  async write(id: string, input: MemoryWriteInput, opts: CallOptions = {}): Promise<V1Result<"memory write">> {
    return executeCommand<V1Result<"memory write">>(COMMAND_BINDINGS["memory write"], { id, ...input }, this.ctx, opts);
  }

  async delete(id: string, title: V1Args<"memory delete">["title"], opts: CallOptions = {}): Promise<DeletedResponse> {
    return executeCommand<DeletedResponse>(COMMAND_BINDINGS["memory delete"], { id, title }, this.ctx, opts);
  }
}

export type MemoryWriteInput = V1Args<"memory write">;

export class MemoryIndexApi {
  constructor(protected readonly ctx: HttpContext) {}

  async read(id: string, opts: CallOptions = {}): Promise<V1Result<"memory index-read">> {
    return executeCommand<V1Result<"memory index-read">>(COMMAND_BINDINGS["memory index-read"], { id }, this.ctx, opts);
  }

  async write(id: string, content: V1Args<"memory index-write">["content"], opts: CallOptions = {}): Promise<V1Result<"memory index-write">> {
    return executeCommand<V1Result<"memory index-write">>(COMMAND_BINDINGS["memory index-write"], { id, content }, this.ctx, opts);
  }
}

export class MemoryApiBase {
  constructor(protected readonly ctx: HttpContext) {}

  async search(id: string, q: V1Args<"memory search">["q"], query: Omit<V1Args<"memory search">, "q"> = {}, opts: CallOptions = {}): Promise<V1Result<"memory search">["data"]> {
    const res = await executeCommand<V1Result<"memory search">>(COMMAND_BINDINGS["memory search"], { id, q, ...query }, this.ctx, opts);
    return res.data;
  }
}
