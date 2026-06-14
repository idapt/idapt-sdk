/**
 * Public type surface for @idapt/sdk.
 *
 * Types are hand-written against the **actual** v1 response shapes. When the
 * v1 API changes, update this file and the unit tests — the tests exercise
 * every wire format through mocked fetch responses.
 *
 * ## Envelope conventions (verified against lib/api/v1/response.ts)
 *
 *   Single:   { data: T }
 *   List:     { data: T[], pagination: { has_more, next_cursor } }
 *   Deleted:  { deleted: true, id }
 *   Error:    { error: { type, message, code? } }
 *
 * Pagination lives in a nested object so the envelope can grow without a
 * breaking change — do NOT flatten `has_more` up. Paging is cursor-based
 * (`limit` capped at 100, opaque `cursor` token) — there is no offset and
 * no total count (Stripe/OpenAI-style).
 *
 * The error envelope splits the old flat `code` into `type` (the coarse
 * category clients branch on) + an optional finer `code` sub-code — see
 * `errors.ts` for the typed hierarchy that wraps it.
 */

// Wire types single-sourced from the v1 contracts. `import type` only — the
// schemas (and zod) are erased at build, so the SDK ships no runtime zod.
import type {
  SettingsResponse,
  SharedWithMeItemResponse,
  SubscriptionResponse,
  UserResponse,
} from "@idapt/api-contracts/v1/contracts/account";
import type { ExecutionRunResponse } from "@idapt/api-contracts/v1/contracts/code";
import type {
  ComputerEnvVarResponse,
  ComputerFirewallRuleResponse,
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
  SecretResponse,
  ShareResponse,
  TriggerCostStatsResponse,
  TriggerResponse,
  TriggerRunResponse,
  TriggerWithSecretResponse,
  WorkspaceMemberResponse,
  WorkspaceResponse,
} from "@idapt/api-contracts/v1/contracts/crud";
import type {
  FileResponse,
  FileUploadResponse,
} from "@idapt/api-contracts/v1/contracts/drive";
import type { StoreItemResponse } from "@idapt/api-contracts/v1/contracts/hub";
import type { ApiKeyResponse } from "@idapt/api-contracts/v1/contracts/keys";

/* -------------------------------------------------------------------------- */
/*  Shared envelopes                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Pagination metadata on every list envelope. Cursor-based: callers page
 * with `limit` (max 100) + an opaque `cursor`. `has_more` flags whether
 * another page exists; `next_cursor` is the token to pass as the next
 * request's `?cursor=` (it is `null` when `has_more` is false).
 *
 * The cursor is OPAQUE — echo `next_cursor` back as `cursor`, never parse
 * it. Bounded lists (static catalogs, workspace members, …) still carry a
 * `pagination` block, but their `next_cursor` is always `null`. There is
 * no total count (Stripe/OpenAI-style).
 */
export interface Pagination {
  has_more: boolean;
  /** Opaque token for the next page, or `null` when `has_more` is false. */
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

/* -------------------------------------------------------------------------- */
/*  Files                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * A file resource as returned by the v1 API (`GET /files/:id`, lists).
 *
 * Field names follow the API's snake_case convention. Many columns are
 * nullable on the server — tolerate that in consumer code. `id` is the
 * file's resourceId — there is no separate `resource_id` field.
 */
export type File = FileResponse;

export type FileList = ListEnvelope<File>;

/**
 * Stripped-down file record returned by `POST /files` (multipart upload).
 * No timestamps. `id` is the file's resourceId.
 */
export type FileUploadResult = FileUploadResponse;

/* -------------------------------------------------------------------------- */
/*  Identity + usage                                                          */
/* -------------------------------------------------------------------------- */

/** Current-user payload from `GET /me`. */
/** Current-user payload from `GET /me`. Sourced from the account v1 contract. */
export type User = UserResponse;

/** `GET /me/usage?view=summary`. */
export interface UsageSummary {
  storage: {
    used_bytes: number;
    capacity_bytes: number;
    snapshot_bytes: number;
  };
}

/**
 * `GET /me/usage?view=history` entry — one metered LLM / image / audio
 * call. There is no `id` on the wire: usage rows are an append-only log,
 * keyed by `(actor, created_at)`, not addressable resources.
 */
export interface UsageRecord {
  call_type: string;
  model_id?: string | null;
  /** Workspace the call was billed against. Null for non-workspace calls. */
  workspace_id?: string | null;
  input_tokens?: number | null;
  output_tokens?: number | null;
  /** Reasoning/thinking tokens, when the model reports them separately. */
  reasoning_tokens?: number | null;
  /** Prompt tokens served from the provider's cache. */
  cached_tokens?: number | null;
  cost_usd?: number | null;
  /** Wall-clock duration of the call. */
  duration_seconds?: number | null;
  /** Provider finish reason (`stop`, `length`, `tool_calls`, …). */
  finish_reason?: string | null;
  /** True when the call was cancelled before completion. */
  cancelled?: boolean | null;
  created_at: string;
  [k: string]: unknown;
}

/* -------------------------------------------------------------------------- */
/*  Agents                                                                    */
/* -------------------------------------------------------------------------- */

/** Agent resource. Sourced from the crud v1 contract. */
export type Agent = AgentResponse;

/* -------------------------------------------------------------------------- */
/*  Chats                                                                     */
/* -------------------------------------------------------------------------- */

/** Chat resource. Sourced from the crud v1 contract. */
export type Chat = ChatResponse;

/** Chat message. Sourced from the crud v1 contract. */
export type Message = MessageResponse;

/**
 * Per-call-type cost + token breakdown inside `ChatCost.by_call_type`.
 * Each key (`chat`, `image`, `web_search`, …) maps to one of these.
 */
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

/** Lifecycle state of an agent run row (`GET /chats/:id/runs`). */
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

/**
 * Response shape of `POST /chats/:id/messages` (201, a `oneOf`).
 *  - completed: `{ status, chat_id, model_id, user_message_id, message }`
 *  - pending:   `{ status, pending_token, chat_id }`
 *
 * `pending_token` is an opaque workflow handle (NOT a resourceId).
 */
export type SendMessageResult =
  | {
      status: "completed";
      chat_id: string;
      model_id: string | null;
      user_message_id: string;
      message: Message;
    }
  | { status: "pending"; pending_token: string; chat_id: string };

/* -------------------------------------------------------------------------- */
/*  Code execution                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Lifecycle status of an execution run. `interrupted` lands when a run is
 * cancelled via `POST /code-runs/:id/interrupt`.
 */
export type ExecutionRunStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "timed_out"
  | "interrupted";

/** Where an execution run executes — sandboxed Lambda or a paired computer. */
export type ExecutionBackend = "computer" | "lambda";

/**
 * An execution-run row. Returned by `POST /code-runs`, `POST /files/:id/run`,
 * `GET /code-runs` and `GET /code-runs/:id` — code execution always yields
 * this single shape (there is no separate stripped run-summary type).
 */
// Sourced from the code-runs v1 contract. `ExecutionBackend` /
// `ExecutionRunStatus` remain exported for query inputs; this widens the
// run's own backend/status to `string` (the contract boundary).
export type ExecutionRun = ExecutionRunResponse;

/* -------------------------------------------------------------------------- */
/*  Triggers                                                                  */
/* -------------------------------------------------------------------------- */

export type TriggerType = "webhook" | "schedule" | "manual" | string;

export type TriggerActionType = "run_code" | "run_chat" | string;

/**
 * A trigger resource. This is a flat object — every scheduling field
 * and every action field lives directly on the row, with no nested
 * `trigger_config` / `action_config` objects.
 *
 * `agent_id`, `file_id` and `working_dir_folder_id` are resourceIds.
 */
/** A trigger resource (flat). Sourced from the crud v1 contract. */
export type Trigger = TriggerResponse;

/**
 * A trigger plus its one-time webhook `secret`. Returned by
 * `POST /v1/triggers` (webhook creation) and `POST /v1/triggers/:id/rotate-secret`.
 * The plaintext `secret` is only ever echoed on these two responses.
 */
/** Trigger + one-time webhook secret. Sourced from the crud v1 contract. */
export type TriggerWithSecret = TriggerWithSecretResponse;

/** A trigger run record. Sourced from the crud v1 contract. */
export type TriggerRun = TriggerRunResponse;

/** Trigger cost aggregates. Sourced from the crud v1 contract. */
export type TriggerCostStats = TriggerCostStatsResponse;

/**
 * Create-trigger request body — flat, mirrors the `Trigger` shape. The
 * required fields depend on `trigger_type` / `action_type` (a schedule
 * trigger needs `cron_expression`; a `run_code` action needs `file_id`;
 * a `run_chat` action needs `prompt_template` or `agent_id`). The server
 * validates the combination.
 */
export interface CreateTriggerInput {
  name: string;
  description?: string;
  enabled?: boolean;
  trigger_type: TriggerType;
  action_type: TriggerActionType;
  // scheduling
  cron_expression?: string;
  cron_timezone?: string;
  // run_chat action fields
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
  // run_code action fields
  file_id?: string;
  runtime?: string;
  timeout_seconds?: number;
  env?: Record<string, string>;
  working_dir_folder_id?: string;
}

/** Update-trigger request body — every create field plus `agent_id` is patchable. */
export type UpdateTriggerInput = Partial<CreateTriggerInput>;

/* -------------------------------------------------------------------------- */
/*  Models                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Modality bucket a model belongs to. Every model row across `/v1/models`,
 * `/v1/audio/models` and `/v1/images/models` carries this discriminant.
 */
export type ModelModality = "chat" | "audio" | "image";

/**
 * Fields shared by every model row regardless of modality. Modality-specific
 * shapes (`LLMModel`, `AudioModel`, `ImageModel`) extend this.
 *
 * Every model row carries `pricing` and `capabilities` as nested
 * objects. `pricing` is always the user-facing (post-markup) price.
 */
export interface ModelBase {
  id: string;
  /** Human-readable label. */
  display_name: string;
  provider: string;
  modality: ModelModality;
}

/** Chat-model pricing block — null when the model is free / unpriced. */
export interface LLMModelPricing {
  input_per_million: number;
  output_per_million: number;
}

/** Chat-model capability block (always an object, never an array). */
export interface LLMModelCapabilities {
  context_length: number;
  max_output_tokens: number;
  image_input: boolean;
}

/** A chat/LLM model from `GET /v1/models` (`modality: "chat"`). */
export interface LLMModel extends ModelBase {
  modality: "chat";
  pricing: LLMModelPricing | null;
  capabilities: LLMModelCapabilities;
}

/* -------------------------------------------------------------------------- */
/*  Provider endpoints                                                        */
/* -------------------------------------------------------------------------- */

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
  /** Idapt/OpenRouter-style model id, for example `openai/gpt-5.4`. */
  model_id: string;
  /** Upstream API model id sent to the provider. */
  api_model_id: string;
}

/**
 * A saved BYOK or daemon-local provider endpoint. Provider secrets are
 * write-only: reads expose only `api_key_preview`.
 */
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

/* -------------------------------------------------------------------------- */
/*  Images                                                                    */
/* -------------------------------------------------------------------------- */

/** Image-model pricing block — flat per-image price (post-markup). */
export interface ImageModelPricing {
  per_image: number;
}

/** An image model from `GET /v1/images/models` (`modality: "image"`). */
export interface ImageModel extends ModelBase {
  modality: "image";
  provider_display_name?: string | null;
  provider_slug?: string | null;
  /** Post-markup pricing. */
  pricing: ImageModelPricing;
  /** Capability block — always an object. */
  capabilities: Record<string, unknown>;
  paid: boolean;
  /** Minimum tier required to use a paid model. */
  required_tier?: string | null;
  /** True when the caller's tier is below `required_tier`. */
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

/* -------------------------------------------------------------------------- */
/*  Audio                                                                     */
/* -------------------------------------------------------------------------- */

/** Audio (TTS) model pricing block — price per 1,000 characters (post-markup). */
export interface AudioModelPricing {
  per_thousand_chars: number;
}

/** Audio (TTS) model capability block (always an object). */
export interface AudioModelCapabilities {
  max_chars: number;
}

/**
 * A text-to-speech model from `GET /v1/audio/models` (`modality: "audio"`).
 * Pricing and capabilities are nested objects.
 */
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

/** Perceived gender of a TTS voice. */
export type TtsVoiceGender = "male" | "female" | "neutral";

/**
 * A selectable TTS voice from `GET /v1/audio/voices`. The wire field is
 * `display_name` (was `name`); `gender` is a non-null enum.
 */
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

/* -------------------------------------------------------------------------- */
/*  Workspaces                                                                  */
/* -------------------------------------------------------------------------- */

/** Workspace resource. Sourced from the crud v1 contract. */
export type Workspace = WorkspaceResponse;

export type WorkspaceMemberRole =
  | "owner"
  | "admin"
  | "editor"
  | "viewer"
  | "custom";

/** A workspace member. Sourced from the crud v1 contract. */
export type WorkspaceMember = WorkspaceMemberResponse;

/* -------------------------------------------------------------------------- */
/*  Computers                                                                  */
/* -------------------------------------------------------------------------- */

/** Whether a computer is a self-managed remote box or an idapt-provisioned VM. */
export type ComputerType = "remote" | "managed";

/** Per-computer daemon logging verbosity. */
export type ComputerLoggingLevel = "minimal" | "standard" | "full";

/**
 * Managed-computer lifecycle state. `state` is `null` for `remote` computers
 * (their reachability is not modelled as a lifecycle).
 */
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

/**
 * Computer record. Self-managed (`type: "remote"`) computers are paired
 * through the local daemon; idapt-provisioned (`type: "managed"`) computers
 * expose the full lifecycle `state`.
 */
/** Computer record. Sourced from the computers v1 contract. */
export type Computer = ComputerResponse;

/** One Unix user on a computer, returned by `listUsers`. */
/** One Unix user on a computer. Sourced from the computers v1 contract. */
export type ComputerUser = ComputerUserResponse;

/**
 * Env-var binding row — one credential file mounted as `${name}=$(<...)`
 * on a user. A binding is addressed by its env-var `name`; there is no
 * standalone UUID `id`. The bound credential is referenced by `file_id`.
 */
/** Env-var binding row. Sourced from the computers v1 contract. */
export type ComputerEnvVar = ComputerEnvVarResponse;

/** Firewall rule (iptables) on a cloud computer. */
/** Firewall rule. Sourced from the computers v1 contract. */
export type ComputerFirewallRule = ComputerFirewallRuleResponse;

/** Auto-discovered listening port on a cloud computer. */
/** Auto-discovered listening port. Sourced from the computers v1 contract. */
export type ComputerPort = ComputerPortResponse;

/**
 * `exec` result — single-shot daemon command output. `success` reflects
 * whether the command exited 0 within its timeout.
 */
export interface ComputerExecResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  durationMs: number;
  timedOut: boolean;
}

/**
 * Daemon server info returned inside `test-connection` — a structured
 * object.
 */
export interface ComputerServerInfo {
  version: string;
  uptime_seconds: number;
}

/**
 * One re-attachable tmux window on the `idapt` session. A tmux window
 * has no `pid` — it is not a single process.
 */
export interface TmuxWindow {
  name: string;
  active: boolean;
}

/** SFTP listing entry as returned by `op: "list"`. */
export interface SftpEntry {
  name: string;
  type: "file" | "dir" | "symlink" | string;
  size?: number | null;
  mode?: string | null;
  mtime?: string | null;
}

/* -------------------------------------------------------------------------- */
/*  API keys                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * A credential row exposed via `/api/v1/api-keys`. The plaintext `key` is
 * only present on the create response — there is no way to retrieve it
 * after that (the server only stores the hash).
 */
/** An API key credential row. Sourced from the keys v1 contract. */
export type ApiKey = ApiKeyResponse;

/* -------------------------------------------------------------------------- */
/*  Notifications                                                             */
/* -------------------------------------------------------------------------- */

export type NotificationSenderKind = "user" | "agent" | "system" | string;

/** A notification row. Sourced from the crud v1 contract. */
export type Notification = NotificationResponse;

/** Per-user toast/sound/quiet-hours/digest config. Sourced from the crud v1 contract. */
export type NotificationConfig = NotificationConfigResponse;

/** One (type, subtype?, channel) preference row. Sourced from the crud v1 contract. */
export type NotificationPreference = NotificationPreferenceResponse;

/* -------------------------------------------------------------------------- */
/*  Workspace secrets                                                           */
/* -------------------------------------------------------------------------- */

/**
 * A workspace secret. Stored server-side as a `.credential` file in the
 * workspace's `.secrets/` folder; the public API masks that detail. The
 * plaintext `value` is only echoed on the create response (so the caller
 * can audit what was stored), never on subsequent reads.
 */
/** A workspace secret. Sourced from the crud v1 contract. */
export type Secret = SecretResponse;

/* -------------------------------------------------------------------------- */
/*  Workspace invitations                                                       */
/* -------------------------------------------------------------------------- */

/**
 * A workspace invitation. The v1 contract keys invitations by `invitee_slug`
 * — there is no standalone `id` field on the wire. `DELETE` takes the slug
 * as a query param.
 */
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

/* -------------------------------------------------------------------------- */
/*  Settings                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Account-level preferences exposed on the v1 surface — the exact set
 * returned by `GET /v1/settings` and `PATCH /v1/settings`.
 *
 * `transformSettings` on the server picks ONLY these v1-stable fields and
 * deep-snake-cases them. UI-only state (sidebar collapsed groups, modal
 * counters, theme) is deliberately omitted from the public contract.
 */
/** Account preferences from `GET/PATCH /settings`. Sourced from the v1 contract. */
export type Settings = SettingsResponse;

/* -------------------------------------------------------------------------- */
/*  Account / credits (the "subscription" endpoint)                           */
/* -------------------------------------------------------------------------- */

/**
 * Account tier. Idapt is pay-as-you-go — there are no subscription plans /
 * tiers. `"paid"` means the caller has funded real credits (a persistent
 * credit balance); everyone else is `"free"`.
 */
export type SubscriptionPlan = "free" | "paid" | string;

/**
 * Current account/credit view from `GET /subscription`. Sourced from the v1
 * contract. Carries the account tier (`plan` / `is_paid`), the credit `balance`
 * (USD), and the auto top-up settings. There are no subscription periods,
 * trial / cancel timestamps, or scheduled-downgrade fields — those concepts no
 * longer exist. Anonymous / unauthenticated callers get the `free` view.
 *
 * Stripe correlation ids are excluded at the route boundary — never visible.
 */
export type Subscription = SubscriptionResponse;

/* -------------------------------------------------------------------------- */
/*  Sharing                                                                   */
/* -------------------------------------------------------------------------- */

export type ShareResourceType = "chat" | "agent" | "file" | "workspace";
export type SharePermission = "read" | "write" | "admin";

/**
 * A share row. The v1 contract identifies a share by its
 * `(resource_type, resource_id, grantee_actor_id)` triple — there is no
 * standalone `id` field on the wire.
 *
 * The provenance fields are `shared_at` / `shared_by_actor_id`.
 */
/** A share grant. Sourced from the crud v1 contract. */
export type Share = ShareResponse;

/**
 * Payload of `DELETE /v1/shares` — the unshare echoes back the triple it
 * removed (no envelope `id`).
 */
export interface ShareDeletedResult {
  deleted: true;
  resource_type: ShareResourceType;
  resource_id: string;
  grantee_actor_id: string;
}

/** One row in `GET /v1/shared-with-me`. The id IS the shared resource's id. */
/** One `GET /v1/shared-with-me` row. Sourced from the account v1 contract. */
export type SharedWithMeItem = SharedWithMeItemResponse;

/* -------------------------------------------------------------------------- */
/*  Store / Hub                                                               */
/* -------------------------------------------------------------------------- */

export type StoreItemType =
  | "skill"
  | "agent"
  | "computer"
  | "computer-template"
  | "workspace"
  | string;

/**
 * A single hub/store item. The catalog has heterogeneous payloads per
 * type (skills carry `version`/`license`, agents carry icons/prompts,
 * computer templates carry sizing) so we type the common fields and
 * leave the rest open.
 */
/** A hub/store item. Sourced from the hub v1 contract. */
export type StoreItem = StoreItemResponse;

/**
 * Returned by `POST /v1/store/:id/install`. Open shape per template type.
 * `id` is always present (the installed resource's resourceId).
 */
export interface StoreInstallResult {
  /** The installed resource's resourceId — always present. */
  id: string;
  installed: boolean;
  /** When the install lands as files in a workspace, the parent folder id. */
  folder_id?: string | null;
  /** When the install creates an agent, the new agent id. */
  agent_id?: string | null;
  /** Echoed back so callers can chain on the installed surface. */
  resource_type?: StoreItemType;
  resource_id?: string;
  [k: string]: unknown;
}

/* -------------------------------------------------------------------------- */
/*  Reprompt                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Response shape of `POST /chats/:id/messages/:message_id/reprompt`.
 *  - `wait=true` (default): returns `{ status: "completed", ..., message? }`
 *  - `wait=false` or timeout: returns `{ status: "pending", ... }`
 *
 * The async status is `"pending"`. `reprompted_message_id` echoes the
 * user message the reprompt targets.
 */
export type RepromptResult =
  | {
      status: "completed";
      chat_id: string;
      reprompted_message_id: string;
      model_id: string | null;
      /** The new assistant sibling. Null when we couldn't locate it post-run. */
      message: Message | null;
    }
  | {
      status: "pending";
      chat_id: string;
      reprompted_message_id: string;
    };

/* -------------------------------------------------------------------------- */
/*  Search                                                                    */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*  Browser-app specific types                                                   */
/* -------------------------------------------------------------------------- */

/** Permission descriptor — server-side `Permission` mirror. */
export interface Permission {
  resource: string;
  scope?: string | null;
  access?: "read" | "write" | "admin";
}

/**
 * Which backing the client is wired against:
 *
 *   - `"remote"` — talks to the Idapt backend. Either cookie/bootstrap mode
 *     (hosted on an app subdomain) or library mode with an explicit `key`.
 *   - `"local"` — no credential. Runs **off Idapt** (standalone / static host /
 *     `file://`). `app.*` reads bundle assets over relative `fetch`; `data.*`
 *     persists to IndexedDB (or an in-memory fallback). Server-only surfaces
 *     throw `OffIdaptError`.
 */
export type RuntimeMode = "remote" | "local";

export interface ClientMeta {
  appId: string;
  /** API origin, or `null` in local (off-Idapt) mode. */
  apiUrl: string | null;
  appFolderId: string;
  dataFolderId: string;
  /** Which backing the client is wired against. */
  mode: RuntimeMode;
}

/**
 * How the client authenticates each request:
 *
 *   - `"bearer"` — send the raw `key` as `Authorization: Bearer`. Library mode
 *     (explicit key) and any credential carrying a raw key.
 *   - `"cookie"` — the httpOnly `__Secure-idapt_app_key` cookie carries auth;
 *     there is no raw `key`. Hosted cookie-bootstrap flow. Requests go out
 *     with `credentials: "include"` and no bearer header.
 */
export type AuthMode = "bearer" | "cookie";

/**
 * The credential the client was constructed from.
 *
 * Three shapes:
 *   - **library bearer** — `{ key, apiUrl, mode: "remote", auth: "bearer" }`.
 *   - **cookie bootstrap** — `{ key: null, apiUrl, mode: "remote",
 *     auth: "cookie", appResourceId }`. The DB-first hosted flow: the raw
 *     `ap_` key lives only in the httpOnly cookie, so `key` is `null` and auth
 *     rides the cookie. `appResourceId` scopes the data KV (`RemoteDataStore`).
 *   - **local** — `{ key: null, apiUrl: null, mode: "local" }`. Off Idapt;
 *     `app.*` reads the bundle over relative fetch and `data.*` persists to
 *     IndexedDB, so the folder ids fall back to the app id.
 *
 * `appFolderId` / `dataFolderId` are legacy Drive-folder ids — kept for the
 * `ClientMeta` surface and local-mode keying. DB-first cookie boots no longer
 * carry them (there is no Drive folder); they default to `""`.
 */
export interface StoredCredential {
  /** The `ap_` / `uk_` bearer, or `null` in cookie / local mode. */
  key: string | null;
  /** API origin, or `null` in local mode. */
  apiUrl: string | null;
  appResourceId?: string;
  appFolderId: string;
  dataFolderId: string;
  /** Defaults to `"remote"` when a `key` + `apiUrl` are present. */
  mode?: RuntimeMode;
  /**
   * Auth transport for a `"remote"` credential. Defaults to `"bearer"`. Set to
   * `"cookie"` for the hosted bootstrap flow (no raw key — the httpOnly cookie
   * carries auth). Ignored in `"local"` mode.
   */
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
  /**
   * Explicit bearer (`uk_` / `pk_` / `ap_`) for **library mode**. When set,
   * the SDK skips the cookie bootstrap and connects directly to `apiUrl` with
   * this key as the Bearer token. Requires `apiUrl`.
   */
  key?: string;
  /**
   * Force **local (off-Idapt) mode** even if a bootstrap cookie could be
   * obtained. Useful for testing the standalone degradation path. When the
   * SDK can find no credential (no cookie, no `key`), it falls into local mode
   * automatically — this flag just short-circuits the bootstrap attempt.
   */
  local?: boolean;
  debug?: boolean;
  fetch?: typeof fetch;
  /**
   * Inject an IndexedDB factory for local-mode `data.*`. Defaults to
   * `globalThis.indexedDB`. When neither is available (some `file://`
   * contexts), the local data store falls back to an in-memory map.
   */
  indexedDB?: IDBFactory;
  location?: Pick<
    Location,
    "hostname" | "pathname" | "origin" | "href" | "search"
  >;
}

export type EscalateRequest = Permission | Permission[];
