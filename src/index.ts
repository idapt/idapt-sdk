

export { getFileBlob, getFileText, listFiles } from "./api/_files-core.js";

export type {
  AiGatewayProvidersOptions,
  AiGatewayRoutePreviewInput,
  AiGatewayUsageOptions,
} from "./api/ai-gateway.js";
export { AiGatewayApi } from "./api/ai-gateway.js";
export type {
  FireAutomationInput,
  FireAutomationResult,
} from "./api/automations.js";
export { AutomationsApi } from "./api/automations.js";
export type {
  CreateComputerInput,
  CreateComputerResult,
  CreateComputerUserInput,
  ExecCommandInput,
  FsInput,
  FsListResult,
  FsOp,
  FsUploadInput,
  ListComputersQuery,
  PairComputerInput,
  PairComputerResult,
  PatchPortInput,
  TerminalInput,
  TerminalOp,
  UpdateComputerInput,
  UpdateComputerUserInput,
} from "./api/computers.js";
export { ComputersApi } from "./api/computers.js";
export { DocsApi } from "./api/docs.js";
export type {
  CreateFolderInput,
  ListFilesQuery,
  PatchFileInput,
  UploadInput,
} from "./api/files.js";
export { FilesApi } from "./api/files.js";
export type {
  InferenceImageInput,
  InferenceSpeechInput,
  InferenceTextInput,
  InferenceTextMessage,
  InferenceTextResult,
  InferenceVideoInput,
} from "./api/inference.js";
export { InferenceApi } from "./api/inference.js";
export type {
  MemoryBoxesQuery,
  MemoryBoxUpdateInput,
  MemoryWriteInput,
} from "./api/memory.js";
export {
  MemoryApi,
  MemoryBoxesApi,
  MemoryIndexApi,
  MemoryNotesApi,
} from "./api/memory.js";
export type {
  NotesBoxCreateInput,
  NotesBoxesQuery,
  NotesBoxUpdateInput,
  NotesWriteInput,
} from "./api/notes.js";
export {
  NotesApi,
  NotesBoxesApi,
  NotesFoldersApi,
  NotesIndexApi,
  NotesNotesApi,
} from "./api/notes.js";
export type {
  NotificationAudience,
  SendNotificationInput,
  SendNotificationResult,
} from "./api/notifications.js";
export { NotificationsApi } from "./api/notifications.js";
export type {
  ChannelHandle,
  PresenceEntry,
  PresenceHeartbeatOptions,
  RealtimeEvent,
  SubscribeOptions,
} from "./api/realtime.js";
export { RealtimeApi } from "./api/realtime.js";
export type { UpdateShareInput } from "./api/sharing.js";
export { SharingApi } from "./api/sharing.js";
export type {
  TaskCreateInput,
  TaskLabelCreateInput,
  TaskLabelUpdateInput,
  TaskListCreateInput,
  TaskListQuery,
  TaskListsQuery,
  TaskListUpdateInput,
  TaskSearchQuery,
  TaskUpdateInput,
} from "./api/tasks.js";
export {
  TaskCommentsApi,
  TaskDependenciesApi,
  TaskItemsApi,
  TaskLabelsApi,
  TaskListsApi,
  TasksApi,
} from "./api/tasks.js";
export type { ListUsageHistoryQuery } from "./api/user.js";
export { UserApi } from "./api/user.js";
export { IDAPT_API_VERSION, IDAPT_API_VERSION_HEADER } from "./api-version.js";

export { IdaptClient, type IdaptClientOptions } from "./client.js";
export { connect, Idapt } from "./connect.js";

export type {
  DeletedResult,
  ExecuteCommandOptions,
  ListResult,
  SseEvent,
} from "./core/execute.js";
export { awaitOperation, executeCommand } from "./core/execute.js";
export * from "./errors.js";
export type {
  CommandBinding,
  V1CommandName,
} from "./generated/command-bindings.generated.js";
export { COMMAND_BINDINGS } from "./generated/command-bindings.generated.js";

export type {
  AddMemberInput,
  CopyAgentToWorkspaceInput,
  CreateAgentInput,
  CreateApiKeyInput,
  CreateChatInput,
  CreateInvitationInput,
  CreateInvitationResult,
  CreateProviderEndpointInput,
  CreateShareInput,
  CreateWorkspaceInput,
  DeleteInvitationResult,
  GuideContent,
  ListAgentsQuery,
  ListApiKeysQuery,
  ListAutomationRunsQuery,
  ListChatsQuery,
  ListMessagesQuery,
  ListNotificationsQuery,
  ListOperationsInput,
  ListRunsQuery,
  ListSharedWithMeQuery,
  ListSharesQuery,
  ListVoicesInput,
  MoveAgentInput,
  NotificationPreferenceUpdate,
  Operation,
  ProviderEndpointModelMappingInput,
  RemoveShareInput,
  RepromptMessageInput,
  RotateApiKeyInput,
  RotateApiKeyResult,
  SearchInput,
  SearchVideoModelsInput,
  SendMessageInput,
  StreamMessageInput,
  UpdateAgentInput,
  UpdateApiKeyInput,
  UpdateAutomationInput,
  UpdateChatInput,
  UpdateCredentialInput,
  UpdateMemberInput,
  UpdateNotificationInput,
  UpdateProviderEndpointInput,
  UpdateSettingsInput,
  UpdateWorkspaceInput,
  V1Args,
  V1Result,
  WebSearchInput,
  WritableMemberRole,
} from "./generated/resources.generated.js";
export {
  AgentsApi,
  ApiKeysApi,
  AudioApi,
  ChatsApi,
  CredentialsApi,
  CustomModelsApi,
  GuideApi,
  ImagesApi,
  ModelsApi,
  OperationsApi,
  ProviderEndpointsApi,
  SearchApi,
  SettingsApi,
  SubscriptionApi,
  VideosApi,
  WebSearchApi,
  WorkspacesApi,
} from "./generated/resources.generated.js";
export type { HttpContext, HttpRequest, QueryInput } from "./http.js";
export { buildUrl, request, requestRaw } from "./http.js";
export * from "./types.js";

export { VERSION } from "./version.js";
