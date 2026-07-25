

import type { V1Commands } from "@idapt/api-contracts/v1/contracts";
import type {
  SettingsResponse,
  SharedWithMeItemResponse,
  SubscriptionResponse,
  UsageSummaryResponse,
  UserResponse,
} from "@idapt/api-contracts/v1/contracts/account";
import type {
  AiGatewayRoutePreviewResponse,
  AiGatewayUsageRowResponse,
  ProviderCatalogEntryResponse,
} from "@idapt/api-contracts/v1/contracts/ai-gateway";
import type {
  ComputerEnvVarResponse,
  ComputerExecResult as ComputerExecResultContract,
  ComputerPortResponse,
  ComputerResponse,
  ComputerUserResponse,
  FsEntry as FsEntryContract,
  TerminalWindow as TerminalWindowContract,
  TestConnectionResult,
} from "@idapt/api-contracts/v1/contracts/computers";
import type {
  AgentResponse,
  AgentRunResponse,
  AutomationCostStatsResponse,
  AutomationResponse,
  AutomationRunResponse,
  AutomationWithSecretResponse,
  ChatCostResponse,
  ChatResponse,
  ChatStopResult as ChatStopResultContract,
  InvitationResponse,
  MessageCostsResponse,
  MessageResponse,
  NotificationConfigResponse,
  NotificationPreferenceResponse,
  NotificationResponse,
  RepromptResult as RepromptResultContract,
  SendMessageResult as SendMessageResultContract,
  ShareDeletedResponse,
  ShareResponse,
  WorkspaceMemberResponse,
  WorkspaceResponse,
} from "@idapt/api-contracts/v1/contracts/crud";
import type {
  FileResponse,
  FileUploadResponse,
} from "@idapt/api-contracts/v1/contracts/drive";
import type {
  FunctionDeploymentResponse,
  FunctionResponse,
} from "@idapt/api-contracts/v1/contracts/functions";
import type {
  StoreInstallResultResponse,
  StoreItemResponse,
} from "@idapt/api-contracts/v1/contracts/hub";
import type { ApiKeyResponse } from "@idapt/api-contracts/v1/contracts/keys";
import type {
  AudioModelResponse,
  ImageGenerationResultResponse,
  ImageModelResponse,
  SpeechResultResponse,
  TranscriptionResultResponse,
  TtsVoiceResponse,
} from "@idapt/api-contracts/v1/contracts/media";
import type {
  SecretResponse,
  SecretWithValueResponse,
} from "@idapt/api-contracts/v1/contracts/secrets";
import type {
  VideoGenerationResultResponse,
  VideoModelResponse,
} from "@idapt/api-contracts/v1/contracts/video";
import type { WebSearchResponse as WebSearchResponseContract } from "@idapt/api-contracts/v1/contracts/web";

type ResultOf<K extends keyof V1Commands> = V1Commands[K]["result"];

export interface Pagination {
  has_more: boolean;

  next_cursor: string | null;
}

export interface ListEnvelope<T> {
  data: T[];
  pagination: Pagination;
}

export interface SingleEnvelope<T> {
  data: T;
}

export interface DeletedResponse {
  deleted: true;
  id: string;
}

export type File = FileResponse;

export type FileList = ListEnvelope<File>;

export type FileUploadResult = FileUploadResponse;

export type User = UserResponse;

export type UsageSummary = UsageSummaryResponse;

export interface UsageRecord {
  call_type: string;
  model_id?: string | null;

  workspace_id?: string | null;
  input_tokens?: number | null;
  output_tokens?: number | null;

  reasoning_tokens?: number | null;

  cached_tokens?: number | null;
  cost_usd?: number | null;

  duration_seconds?: number | null;

  finish_reason?: string | null;

  cancelled?: boolean | null;
  created_at: string;
  [k: string]: unknown;
}

export type Agent = AgentResponse;

export type Chat = ChatResponse;

export type Message = MessageResponse;

export type ChatCost = ChatCostResponse;

export type ChatCostByCallType = NonNullable<ChatCost["by_call_type"]>[string];

export type MessageCosts = MessageCostsResponse;

export type MessageCostEntry = MessageCosts["by_message"][string][number];

export type RunCostMetrics = MessageCosts["by_run"][string];

export type ChatStopResult = ChatStopResultContract;

export type AgentRun = AgentRunResponse;

export type AgentRunState = AgentRun["state"];

export type SendMessageResult = SendMessageResultContract;

export type RepromptResult = RepromptResultContract;

export type FunctionResource = FunctionResponse;

export type FunctionDeployment = FunctionDeploymentResponse;

export interface FunctionInvokeResult {
  status: number;
  body: unknown;
  headers?: Record<string, string>;
}

export type Automation = AutomationResponse;

export type TriggerType = Automation["trigger_type"];

export type AutomationActionType = Automation["action_type"];

export type AutomationWithSecret = AutomationWithSecretResponse;

export type AutomationRun = AutomationRunResponse;

export type AutomationCostStats = AutomationCostStatsResponse;

export type ModelModality = "chat" | "audio" | "image" | "video";

export type LLMModel = ResultOf<"models list">["data"][number];

export type LLMModelPricing = NonNullable<LLMModel["pricing"]>;

export type LLMModelCapabilities = LLMModel["capabilities"];

export type LLMModelArchitecture = LLMModel["architecture"];

export type LLMModelArchitectureType = NonNullable<
  LLMModelArchitecture["type"]
>;

export type LLMModelLocalInference = NonNullable<LLMModel["local_inference"]>;

export type LLMModelLocalInferenceVariant =
  LLMModelLocalInference["runtimes"]["ollama"]["variants"][number];

export type ProviderEndpoint =
  ResultOf<"provider-endpoint list">["data"][number];

export type ProviderEndpointKind = ProviderEndpoint["kind"];
export type ProviderEndpointProviderKey = ProviderEndpoint["provider_key"];
export type ProviderEndpointConnectionType =
  ProviderEndpoint["connection_type"];
export type ProviderEndpointTransport = ProviderEndpoint["transport"];
export type ProviderEndpointRuntime = NonNullable<ProviderEndpoint["runtime"]>;
export type ProviderEndpointProtocol = NonNullable<
  ProviderEndpoint["protocol"]
>;
export type ProviderEndpointVisibility = ProviderEndpoint["visibility"];
export type ProviderEndpointModality =
  ProviderEndpoint["supported_modalities"][number];
export type ProviderEndpointModelMapping =
  ProviderEndpoint["model_mappings"][number];

export type ManagedProviderPreset =
  ResultOf<"provider-endpoint presets">["data"][number];

export type ProviderEndpointTestResult = ResultOf<"provider-endpoint test">;

export type AiGatewayProvider = ProviderCatalogEntryResponse;

export type AiGatewayUsageRow = AiGatewayUsageRowResponse;

export type AiGatewayRoutePreview = AiGatewayRoutePreviewResponse;

export type AiGatewayRoutePreviewOption =
  AiGatewayRoutePreview["ordered"][number];

export type AiGatewayRoutePreviewSkippedOption =
  AiGatewayRoutePreview["skipped"][number];

export type AiGatewayRoutePreviewCapabilities = NonNullable<
  NonNullable<AiGatewayRoutePreview["diagnostics"]>["required_capabilities"]
>;

export type ImageModel = ImageModelResponse;

export type ImageModelPricing = ImageModel["pricing"];

export type ImageGenerationResult = ImageGenerationResultResponse;

export type VideoModel = VideoModelResponse;

export type VideoModelPricing = VideoModel["pricing"];

export type VideoModelRate = VideoModelPricing["rates"][number];

export type VideoModelCapabilities = VideoModel["capabilities"];

export type VideoGenerationResult = VideoGenerationResultResponse;

export type VideoModelSearchResult = ResultOf<"video search">;

export type VideoModelSearchItem = VideoModelSearchResult["items"][number];

export interface OperationHandle {
  id: string;
  status: string;
  [key: string]: unknown;
}

export type AudioModel = AudioModelResponse;

export type AudioModelPricing = AudioModel["pricing"];

export type AudioModelCapabilities = AudioModel["capabilities"];

export type TtsVoice = TtsVoiceResponse;

export type TtsVoiceGender = TtsVoice["gender"];

export type SpeechResult = SpeechResultResponse;

export type TranscriptionResult = TranscriptionResultResponse;

export type SpeechStreamEvent =
  | { type: "chunk"; audio: string }
  | {
      type: "done";
      total_bytes?: number;
      duration_ms?: number;
      char_count?: number;
      cached?: boolean;
    }
  | { type: "error"; status?: number; retry_after?: number };

export type TranscriptionStreamEvent =
  | { type: "partial"; text: string }
  | { type: "final"; text: string }
  | { type: "error"; status?: number; retry_after?: number };

export type Workspace = WorkspaceResponse;

export type WorkspaceMember = WorkspaceMemberResponse;

export type WorkspaceMemberRole = WorkspaceMember["role"];

export type WorkspaceInvitation = InvitationResponse;

export type Computer = ComputerResponse;

export type ComputerType = Computer["type"];

export type ComputerLoggingLevel = NonNullable<Computer["logging_level"]>;

export type ComputerState = NonNullable<Computer["state"]>;

export type ComputerUser = ComputerUserResponse;

export type ComputerEnvVar = ComputerEnvVarResponse;

export type ComputerPort = ComputerPortResponse;

export type ComputerExecResult = ComputerExecResultContract;

export type ComputerServerInfo = NonNullable<
  TestConnectionResult["server_info"]
>;

export type TerminalWindow = TerminalWindowContract;

export type FsEntry = FsEntryContract;

export type ApiKey = ApiKeyResponse;

export type Notification = NotificationResponse;

export type NotificationSenderKind = Notification["sender_kind"];

export type NotificationConfig = NotificationConfigResponse;

export type NotificationPreference = NotificationPreferenceResponse;

export type Secret = SecretResponse;

export type SecretWithValue = SecretWithValueResponse;

export type Settings = SettingsResponse;

export type Subscription = SubscriptionResponse;

export type SubscriptionPlan = Subscription["plan"];

export type Share = ShareResponse;

export type ShareResourceType = Share["resource_type"];
export type SharePermission = Share["permission"];

export type ShareDeletedResult = ShareDeletedResponse;

export type SharedWithMeItem = SharedWithMeItemResponse;

export type StoreItem = StoreItemResponse;

export type StoreItemType = StoreItem["type"];

export type StoreInstallResult = StoreInstallResultResponse;

export type SearchResult = ResultOf<"search query">["data"][number];

export type WebSearchResponse = WebSearchResponseContract;

export type WebSearchHit = WebSearchResponse["results"][number];

export interface Permission {
  resource: string;
  scope?: string | null;
  access?: "read" | "write" | "admin";
}

export type RuntimeMode = "remote";

export interface ClientMeta {
  appId: string;
  apiUrl: string;
  appFolderId: string;
  dataFolderId: string;

  mode: RuntimeMode;
}

export type AuthMode = "bearer" | "cookie";

export interface StoredCredential {

  key: string | null;

  apiUrl: string;
  appResourceId?: string;
  appFolderId: string;
  dataFolderId: string;

  mode?: RuntimeMode;

  auth?: AuthMode;
}

export interface CallOptions {
  signal?: AbortSignal;
}

export interface WriteOptions extends CallOptions {
  expectedUpdatedAt?: string;
}

export interface ConnectOptions {
  apiUrl?: string;
  browserAppDomain?: string;

  key?: string;
  debug?: boolean;
  fetch?: typeof fetch;
  location?: Pick<
    Location,
    "hostname" | "pathname" | "origin" | "href" | "search"
  >;
}

export type EscalateRequest = Permission | Permission[];
