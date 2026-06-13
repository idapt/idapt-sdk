/**
 * IdaptClient — the generic, isomorphic Idapt v1 API client.
 *
 * Holds one typed surface per v1 resource, all wired against a single bearer
 * {@link HttpContext}. This is the polyglot-generatable core of the SDK: it has
 * NO browser-app runtime (cookie bootstrap, overlay, app-data KV, React hooks,
 * local/off-Idapt mode) — that lives in `@idapt/browser-app-sdk`, which composes
 * this client.
 *
 * Construct it via {@link connect} (`connect({ apiUrl, key })`) rather than
 * directly.
 */

import { AgentsApi } from "./api/agents.js";
import { ApiKeysApi } from "./api/api-keys.js";
import { AudioApi } from "./api/audio.js";
import { ChatsApi } from "./api/chats.js";
import { CodeRunsApi } from "./api/code.js";
import { ComputersApi } from "./api/computers.js";
import { DocsApi } from "./api/docs.js";
import { FilesApi } from "./api/files.js";
import { ImagesApi } from "./api/images.js";
import { ModelsApi } from "./api/models.js";
import { NotificationsApi } from "./api/notifications.js";
import { ProviderEndpointsApi } from "./api/provider-endpoints.js";
import { SearchApi } from "./api/search.js";
import { SecretsApi } from "./api/secrets.js";
import { SettingsApi } from "./api/settings.js";
import { SharingApi } from "./api/sharing.js";
import { SkillApi } from "./api/skill.js";
import { StoreApi } from "./api/store.js";
import { SubscriptionApi } from "./api/subscription.js";
import { TriggersApi } from "./api/triggers.js";
import { UserApi } from "./api/user.js";
import { WebSearchApi } from "./api/web.js";
import { WorkspacesApi } from "./api/workspaces.js";
import type { HttpContext } from "./http.js";

export interface IdaptClientOptions {
  /** API origin, e.g. `https://idapt.ai`. */
  apiUrl: string;
  /** Bearer credential (`uk_` / `pk_` / `ap_`). */
  key: string;
  /** Custom fetch (tests / polyfills). Defaults to `globalThis.fetch`. */
  fetch?: typeof fetch;
}

export class IdaptClient {
  /** Identity + usage. */
  readonly user: UserApi;
  /** Raw file ops by id (upload, move, run, folders). */
  readonly files: FilesApi;
  /** Agents CRUD. */
  readonly agents: AgentsApi;
  /** Chats CRUD + messages / runs / cost. */
  readonly chats: ChatsApi;
  /** Workspaces CRUD + members + invitations + fork. */
  readonly workspaces: WorkspacesApi;
  /** Triggers CRUD + fire, rotate-secret, runs. */
  readonly triggers: TriggersApi;
  /** Computers CRUD + lifecycle + exec/tmux/sftp + firewall/ports + users + env + pair. */
  readonly computers: ComputersApi;
  /** Workspace secrets CRUD. */
  readonly secrets: SecretsApi;
  /** User-API-key CRUD (`uk_` keys). */
  readonly apiKeys: ApiKeysApi;
  /** Notifications: per-row verbs, bulk readAll, send, config + preferences. */
  readonly notifications: NotificationsApi;
  /** Account preferences (display name, slug, public visibility, consents). */
  readonly settings: SettingsApi;
  /** Current account / credit view. */
  readonly subscription: SubscriptionApi;
  /** Resource shares + the inverse `/shared-with-me` list. */
  readonly sharing: SharingApi;
  /** Hub / store: search community items + install into a workspace. */
  readonly store: StoreApi;
  /** LLM model catalogue. */
  readonly models: ModelsApi;
  /** User-owned BYOK and daemon-local model provider endpoints. */
  readonly providerEndpoints: ProviderEndpointsApi;
  /** Image models + generation. */
  readonly images: ImagesApi;
  /** Text-to-speech + transcription. */
  readonly audio: AudioApi;
  /** Execute code files in sandboxed Lambda. */
  readonly code: CodeRunsApi;
  /** Full-text search across user content. */
  readonly search: SearchApi;
  /** External web search. */
  readonly web: WebSearchApi;
  /** Fetch the SKILL.md instruction text. */
  readonly skill: SkillApi;
  /** OpenAPI 3.1 spec retrieval. */
  readonly docs: DocsApi;

  private readonly ctx: HttpContext;

  constructor(opts: IdaptClientOptions) {
    const ctx: HttpContext = {
      apiUrl: opts.apiUrl,
      key: opts.key,
      auth: "bearer",
      fetch: opts.fetch,
    };
    this.ctx = ctx;
    this.user = new UserApi(ctx);
    this.files = new FilesApi(ctx);
    this.agents = new AgentsApi(ctx);
    this.chats = new ChatsApi(ctx);
    this.workspaces = new WorkspacesApi(ctx);
    this.triggers = new TriggersApi(ctx);
    this.computers = new ComputersApi(ctx);
    this.secrets = new SecretsApi(ctx);
    this.apiKeys = new ApiKeysApi(ctx);
    this.notifications = new NotificationsApi(ctx);
    this.settings = new SettingsApi(ctx);
    this.subscription = new SubscriptionApi(ctx);
    this.sharing = new SharingApi(ctx);
    this.store = new StoreApi(ctx);
    this.models = new ModelsApi(ctx);
    this.providerEndpoints = new ProviderEndpointsApi(ctx);
    this.images = new ImagesApi(ctx);
    this.audio = new AudioApi(ctx);
    this.code = new CodeRunsApi(ctx);
    this.search = new SearchApi(ctx);
    this.web = new WebSearchApi(ctx);
    this.skill = new SkillApi(ctx);
    this.docs = new DocsApi(ctx);
  }

  /** The bearer key the client authenticates with. */
  getApiKey(): string {
    return this.ctx.key;
  }

  /** API origin the client targets. */
  getApiUrl(): string {
    return this.ctx.apiUrl;
  }

  /**
   * Mint a short-lived (~15 min) `idapt-api` JWT for ad-hoc Bearer use (custom
   * fetch calls, third-party libraries, WebSocket protocols). Cache it in
   * memory; never persist it.
   */
  async getAuthToken(): Promise<string> {
    const doFetch = this.ctx.fetch ?? globalThis.fetch;
    if (!doFetch) throw new Error("No fetch implementation available");
    const res = await doFetch(`${this.ctx.apiUrl}/api/auth/token`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.ctx.key}`,
        "Sec-Fetch-Site": "same-origin",
      },
    });
    if (!res.ok) throw new Error(`getAuthToken failed: ${res.status}`);
    const body = (await res.json()) as { token?: string };
    if (!body.token) throw new Error("getAuthToken: missing token in response");
    return body.token;
  }
}
