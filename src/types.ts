

import type {
  SettingsResponse,
  SharedWithMeItemResponse,
  SubscriptionResponse,
  UserResponse,
} from "@idapt/api-contracts/v1/contracts/account";
import type { BlobObjectResponse } from "@idapt/api-contracts/v1/contracts/blobs";
import type { ExecutionRunResponse } from "@idapt/api-contracts/v1/contracts/code";
import type {
  ComputerEnvVarResponse,
  ComputerPortResponse,
  ComputerResponse,
  ComputerUserResponse,
} from "@idapt/api-contracts/v1/contracts/computers";
import type {
  AgentResponse,
  ChatResponse,
  MessageResponse,
  NotificationConfigResponse,
  NotificationPreferenceResponse,
  NotificationResponse,
  ShareResponse,
  TriggerCostStatsResponse,
  TriggerResponse,
  TriggerRunResponse,
  TriggerWithSecretResponse,
  WorkspaceMemberResponse,
  WorkspaceResponse,
} from "@idapt/api-contracts/v1/contracts/crud";
import type { DatastoreEntryResponse } from "@idapt/api-contracts/v1/contracts/datastore";
import type {
  FileResponse,
  FileUploadResponse,
} from "@idapt/api-contracts/v1/contracts/drive";
import type { StoreItemResponse } from "@idapt/api-contracts/v1/contracts/hub";
import type { ApiKeyResponse } from "@idapt/api-contracts/v1/contracts/keys";
import type {
  SecretResponse,
  SecretWithValueResponse,
} from "@idapt/api-contracts/v1/contracts/secrets";
import type {
  TableCollectionResponse,
  TableRecordResponse,
} from "@idapt/api-contracts/v1/contracts/tables";

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

export interface UsageSummary {
  storage: {
    used_bytes: number;
    capacity_bytes: number;
    snapshot_bytes: number;
  };
}

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

export interface ChatCostByCallType {
  cost_usd: number;
  count: number;
  input_tokens: number;
  output_tokens: number;
  cached_tokens: number;
  input_cost_usd: number;
  output_cost_usd: number;
  cached_cost_usd: number;
}

export interface ChatCost {
  total_cost_usd: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_cached_tokens: number;
  by_call_type?: Record<string, ChatCostByCallType> | null;
  cost_budget_limit_usd?: number | null;
  cost_budget_mode?: string | null;
  cost_budget_spent_usd?: number | null;
}

export interface MessageCostEntry {
  cost_usd: number;
  input_tokens: number;
  output_tokens: number;
  cached_tokens: number;
  call_type: string;
  is_estimated: boolean;
  duration_seconds: number;
}

export interface RunCostMetrics {
  total_cost_usd: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_cached_tokens: number;
  duration_seconds: number;
  state: string;
}

export interface MessageCosts {
  by_message: Record<string, MessageCostEntry[]>;
  by_run: Record<string, RunCostMetrics>;
}

export interface ChatStopResult extends Chat {
  run_active: boolean;
}

export type AgentRunState =
  | "generating"
  | "streaming"
  | "completed"
  | "failed"
  | "stopped"
  | "paused";

export interface AgentRun {
  id: string;
  state: AgentRunState;
  model_id?: string | null;
  total_input_tokens?: number | null;
  total_output_tokens?: number | null;
  total_cost_usd?: number | null;
  duration_seconds?: number | null;
  error?: string | null;
  created_at: string;
  completed_at?: string | null;
}

export type SendMessageResult =
  | {
      status: "completed";
      chat_id: string;
      model_id: string | null;
      user_message_id: string;
      message: Message;
    }
  | { status: "pending"; pending_token: string; chat_id: string };

export type ExecutionRunStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "timed_out"
  | "interrupted";

export type ExecutionBackend = "computer" | "lambda";

export type ExecutionRun = ExecutionRunResponse;

export type TriggerType = "webhook" | "schedule" | "manual" | string;

export type TriggerActionType = "run_code" | "run_chat" | string;

export type Trigger = TriggerResponse;

export type TriggerWithSecret = TriggerWithSecretResponse;

export type TriggerRun = TriggerRunResponse;

export type TriggerCostStats = TriggerCostStatsResponse;

export interface CreateTriggerInput {
  name: string;
  description?: string;
  enabled?: boolean;
  trigger_type: TriggerType;
  action_type: TriggerActionType;

  cron_expression?: string;
  cron_timezone?: string;

  agent_id?: string;
  prompt_template?: string;
  initial_context?: string;
  model?: string;
  reasoning_level?: number;
  auto_cost_level?: number;
  cost_budget_limit_usd?: number;
  web_search_enabled?: boolean;
  memory_enabled?: boolean;
  subagent_enabled?: boolean;
  delegate_mode?: boolean;
  auto_compact_enabled?: boolean;
  compaction_preset?: string;
  pasted_texts?: unknown[];
  active_skills?: string[];

  file_id?: string;
  runtime?: string;
  timeout_seconds?: number;
  env?: Record<string, string>;
  working_dir_folder_id?: string;
}

export type UpdateTriggerInput = Partial<CreateTriggerInput>;

export type ModelModality = "chat" | "audio" | "image";

export interface ModelBase {
  id: string;

  display_name: string;
  provider: string;
  modality: ModelModality;
}

export interface LLMModelPricing {
  input_per_million: number;
  output_per_million: number;
}

export interface LLMModelCapabilities {
  context_length: number;
  max_output_tokens: number;
  image_input: boolean;
}

export interface LLMModel extends ModelBase {
  modality: "chat";
  pricing: LLMModelPricing | null;
  capabilities: LLMModelCapabilities;
}

export type ProviderEndpointKind = "openai" | "anthropic" | "openai_compatible";

export type ProviderEndpointProviderKey =
  | "openai"
  | "anthropic"
  | "openrouter"
  | "gemini"
  | "xai"
  | "deepseek"
  | "replicate"
  | "minimax"
  | "custom_openai_compatible"
  | "ollama";

export type ProviderEndpointConnectionType = "managed" | "custom" | "local";

export type ProviderEndpointModality =
  | "text-completion"
  | "image-generation"
  | "speech-synthesis"
  | "speech-recognition"
  | "embedding";

export type ProviderEndpointTransport = "public_https" | "daemon";
export type ProviderEndpointRuntime = "ollama";
export type ProviderEndpointProtocol = "openai_compatible";
export type ProviderEndpointVisibility = "private" | "marketplace";

export interface ProviderEndpointModelMapping {

  model_id: string;

  api_model_id: string;
}

export interface ProviderEndpoint {
  id: string;
  kind: ProviderEndpointKind;
  provider_key: ProviderEndpointProviderKey;
  connection_type: ProviderEndpointConnectionType;
  display_name: string;
  transport: ProviderEndpointTransport;
  runtime: ProviderEndpointRuntime | null;
  protocol: ProviderEndpointProtocol | null;
  computer_id: string | null;
  local_base_url: string | null;
  visibility: ProviderEndpointVisibility;
  base_url: string | null;
  api_key_preview: string;
  enabled: boolean;
  default_for_kind: boolean;
  default_modalities: ProviderEndpointModality[];
  supported_modalities: ProviderEndpointModality[];
  model_mappings: ProviderEndpointModelMapping[];
  last_verified_at: string | null;
  last_used_at: string | null;
  last_error_at: string | null;
  last_error_code: string | null;
  last_error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface ManagedProviderPreset {
  provider_key: ProviderEndpointProviderKey;
  connection_type: ProviderEndpointConnectionType;
  label: string;
  description: string;
  supported_modalities: ProviderEndpointModality[];
  requires_api_key: boolean;
}

export interface ProviderEndpointTestResult {
  ok: boolean;
  message: string;
  status?: number;
}

export interface AiGatewayProvider {
  slug: string;
  name: string;
  has_direct_connector: boolean;
}

export interface AiGatewayUsageRow {
  model_id?: string | null;
  provider_slug?: string | null;
  provider_name?: string | null;
  cost_usd: number;
  input_tokens: number;
  output_tokens: number;
  calls: number;
}

export interface ImageModelPricing {
  per_image: number;
}

export interface ImageModel extends ModelBase {
  modality: "image";
  provider_display_name?: string | null;
  provider_slug?: string | null;

  pricing: ImageModelPricing;

  capabilities: Record<string, unknown>;
  paid: boolean;

  required_tier?: string | null;

  locked?: boolean;
  speed?: string | null;
  is_new?: boolean;
}

export interface ImageGenerationResult {
  path: string;
  file_id: string;
  url: string;
  raw_url?: string | null;
  model: string;
  cost_usd?: number | null;
}

export interface AudioModelPricing {
  per_thousand_chars: number;
}

export interface AudioModelCapabilities {
  max_chars: number;
}

export interface AudioModel extends ModelBase {
  modality: "audio";
  provider_display_name?: string | null;
  provider_slug?: string | null;
  pricing: AudioModelPricing;
  capabilities: AudioModelCapabilities;
  speed?: string | null;
  paid: boolean;
  is_new?: boolean;
}

export type TtsVoiceGender = "male" | "female" | "neutral";

export interface TtsVoice {
  id: string;
  display_name: string;
  gender: TtsVoiceGender;
  language?: string | null;
  provider?: string | null;
  preview_url?: string | null;
}

export interface SpeechResult {
  path: string;
  file_id: string;
  url: string;
  raw_url?: string | null;
  model: string;
  voice_id?: string | null;
  cost_usd?: number | null;
  char_count: number;
}

export interface TranscriptionResult {
  text: string;
}

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

export type WorkspaceMemberRole =
  | "owner"
  | "admin"
  | "editor"
  | "viewer"
  | "custom";

export type WorkspaceMember = WorkspaceMemberResponse;

export type ComputerType = "remote" | "managed";

export type ComputerLoggingLevel = "minimal" | "standard" | "full";

export type ComputerState =
  | "unprovisioned"
  | "provisioning"
  | "running"
  | "hibernating"
  | "hibernated"
  | "waking"
  | "stopping"
  | "stopped"
  | "terminating"
  | "terminated";

export type Computer = ComputerResponse;

export type ComputerUser = ComputerUserResponse;

export type ComputerEnvVar = ComputerEnvVarResponse;

export type ComputerPort = ComputerPortResponse;

export interface ComputerExecResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  durationMs: number;
  timedOut: boolean;
}

export interface ComputerServerInfo {
  version: string;
  uptime_seconds: number;
}

export interface TmuxWindow {
  name: string;
  active: boolean;
}

export interface SftpEntry {
  name: string;
  type: "file" | "dir" | "symlink" | string;
  size?: number | null;
  mode?: string | null;
  mtime?: string | null;
}

export type ApiKey = ApiKeyResponse;

export type NotificationSenderKind = "user" | "agent" | "system" | string;

export type Notification = NotificationResponse;

export type NotificationConfig = NotificationConfigResponse;

export type NotificationPreference = NotificationPreferenceResponse;

export type Secret = SecretResponse;

export type SecretWithValue = SecretWithValueResponse;

export type DatastoreEntry = DatastoreEntryResponse;

export type BlobObject = BlobObjectResponse;

export type TableCollection = TableCollectionResponse;

export type TableRecord = TableRecordResponse;

export interface WorkspaceInvitation {
  status: "pending" | "accepted" | "declined" | "expired" | string;
  invitee_slug?: string | null;
  invitee_display_name?: string | null;
  inviter_slug?: string | null;
  inviter_display_name?: string | null;
  role?: string | null;
  expires_at?: string | null;
  created_at: string;
  responded_at?: string | null;
}

export type Settings = SettingsResponse;

export type SubscriptionPlan = "free" | "paid" | string;

export type Subscription = SubscriptionResponse;

export type ShareResourceType = "chat" | "agent" | "file" | "workspace";
export type SharePermission = "read" | "write" | "admin";

export type Share = ShareResponse;

export interface ShareDeletedResult {
  deleted: true;
  resource_type: ShareResourceType;
  resource_id: string;
  grantee_actor_id: string;
}

export type SharedWithMeItem = SharedWithMeItemResponse;

export type StoreItemType =
  | "skill"
  | "agent"
  | "computer"
  | "computer-template"
  | "workspace"
  | string;

export type StoreItem = StoreItemResponse;

export interface StoreInstallResult {

  id: string;
  installed: boolean;

  folder_id?: string | null;

  agent_id?: string | null;

  resource_type?: StoreItemType;
  resource_id?: string;
  [k: string]: unknown;
}

export type RepromptResult =
  | {
      status: "completed";
      chat_id: string;
      reprompted_message_id: string;
      model_id: string | null;

      message: Message | null;
    }
  | {
      status: "pending";
      chat_id: string;
      reprompted_message_id: string;
    };

export interface SearchResult {
  id: string;
  source?: string | null;
  source_id?: string | null;
  resource_id?: string | null;
  title?: string | null;
  content?: string | null;
  score?: number | null;
  is_folder?: boolean;
  mime_type?: string | null;
  extension?: string | null;
  parent_name?: string | null;
  icon?: string | null;
  chat_title?: string | null;
  message_type?: "user" | "assistant" | null;
  agent_name?: string | null;
  workspace_resource_id?: string | null;
  workspace_name?: string | null;
  profile_slug?: string | null;
  display_image?: string | null;
  updated_at?: string | null;
  computer_name?: string | null;
  computer_hostname?: string | null;
  [k: string]: unknown;
}

export interface WebSearchHit {
  title: string;
  url: string;
  text?: string;
  published_date?: string | null;
  author?: string | null;
}

export interface WebSearchResponse {
  query: string;
  results: WebSearchHit[];
}

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
