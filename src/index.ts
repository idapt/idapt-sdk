/**
 * @idapt/sdk — the generic, isomorphic Idapt v1 API client.
 *
 * Typed client for the public v1 API (`/api/v1/*`), authenticated with a bearer
 * key. This is the polyglot-generatable core; the browser-app runtime (cookie
 * bootstrap, `window.Idapt`, overlay, React hooks, per-app data KV, local mode)
 * lives in `@idapt/browser-app-sdk`, which composes this client.
 *
 * Usage (library):
 *
 *   import { connect } from "@idapt/sdk";
 *   const client = await connect({ apiUrl: "https://idapt.ai", key: process.env.IDAPT_API_KEY! });
 *   const me = await client.user.me();
 *   const files = await client.files.list();
 *
 * Wire types are single-sourced from `@idapt/api-contracts` (type-only — no
 * runtime zod ships).
 */

// ---- Low-level HTTP + file-core primitives --------------------------------
// Exported so `@idapt/browser-app-sdk` (and other low-level consumers) can
// build their own surfaces over the same transport. `AuthMode` is re-exported
// via `./types.js` below, so it is intentionally omitted here.
export { getFileBlob, getFileText, listFiles } from "./api/_files-core.js";
// ---- API modules + their input types --------------------------------------
export type {
  CreateAgentInput,
  ListAgentsQuery,
  UpdateAgentInput,
} from "./api/agents.js";
export { AgentsApi } from "./api/agents.js";
export type {
  CreateApiKeyInput,
  ListApiKeysQuery,
  RotateApiKeyInput,
  RotateApiKeyResult,
  UpdateApiKeyInput,
} from "./api/api-keys.js";
export { ApiKeysApi } from "./api/api-keys.js";
export type { SpeakInput, TranscribeInput } from "./api/audio.js";
export { AudioApi } from "./api/audio.js";
export type {
  CreateChatInput,
  ListChatsQuery,
  ListMessagesQuery,
  ListRunsQuery,
  RepromptMessageInput,
  SendMessageInput,
  UpdateChatInput,
} from "./api/chats.js";
export { ChatsApi } from "./api/chats.js";
export type { ListExecutionsQuery, RunCodeInput } from "./api/code.js";
export { CodeRunsApi } from "./api/code.js";
export type {
  CreateComputerInput,
  CreateComputerUserInput,
  CreateFirewallRuleInput,
  CreateUserEnvVarInput,
  ExecCommandInput,
  ListComputersQuery,
  PairComputerInput,
  PairComputerResult,
  PatchPortInput,
  SftpInput,
  SftpListResult,
  SftpOp,
  SftpUploadInput,
  TmuxInput,
  TmuxOp,
  UpdateComputerInput,
  UpdateComputerUserInput,
} from "./api/computers.js";
export { ComputersApi } from "./api/computers.js";
export { DocsApi } from "./api/docs.js";
export type {
  CreateFolderInput,
  ListFilesQuery,
  PatchFileInput,
  RunFileInput,
  UploadInput,
} from "./api/files.js";
export { FilesApi } from "./api/files.js";
export type { GenerateImageInput } from "./api/images.js";
export { ImagesApi } from "./api/images.js";
export { ModelsApi } from "./api/models.js";
export type {
  ListNotificationsQuery,
  NotificationAudience,
  NotificationPreferenceUpdate,
  SendNotificationInput,
  SendNotificationResult,
  UpdateNotificationInput,
} from "./api/notifications.js";
export { NotificationsApi } from "./api/notifications.js";
export type {
  CreateProviderEndpointInput,
  ProviderEndpointModelMappingInput,
  UpdateProviderEndpointInput,
} from "./api/provider-endpoints.js";
export { ProviderEndpointsApi } from "./api/provider-endpoints.js";
export type { SearchInput } from "./api/search.js";
export { SearchApi } from "./api/search.js";
export type { CreateSecretInput, UpdateSecretInput } from "./api/secrets.js";
export { SecretsApi } from "./api/secrets.js";
export type { UpdateSettingsInput } from "./api/settings.js";
export { SettingsApi } from "./api/settings.js";
export type {
  CreateShareInput,
  ListSharedWithMeQuery,
  ListSharesQuery,
  RemoveShareInput,
  UpdateShareInput,
} from "./api/sharing.js";
export { SharingApi } from "./api/sharing.js";
export type { SkillContent } from "./api/skill.js";
export { SkillApi } from "./api/skill.js";
export type { InstallStoreItemInput, SearchStoreQuery } from "./api/store.js";
export { StoreApi } from "./api/store.js";
export { SubscriptionApi } from "./api/subscription.js";
export type { FireTriggerInput, ListTriggerRunsQuery } from "./api/triggers.js";
export { TriggersApi } from "./api/triggers.js";
export type { ListUsageHistoryQuery } from "./api/user.js";
export { UserApi } from "./api/user.js";
export type { WebSearchInput } from "./api/web.js";
export { WebSearchApi } from "./api/web.js";
export type {
  AddMemberInput,
  CreateInvitationInput,
  CreateInvitationResult,
  CreateWorkspaceInput,
  DeleteInvitationResult,
  UpdateMemberInput,
  UpdateWorkspaceInput,
  WritableMemberRole,
} from "./api/workspaces.js";
export { WorkspacesApi } from "./api/workspaces.js";
// ---- Core -----------------------------------------------------------------
export { IdaptClient, type IdaptClientOptions } from "./client.js";
export { connect, Idapt } from "./connect.js";
export * from "./errors.js";
export type { HttpContext, HttpRequest, QueryInput } from "./http.js";
export { buildUrl, request, requestRaw } from "./http.js";
export * from "./types.js";
// ---- Package version ------------------------------------------------------
// Baked in at build time from package.json#version via `tsup` `define`. See
// `src/version.ts` and the per-tag rewrite in `.gitlab/ci/sdk.yml`.
export { VERSION } from "./version.js";
