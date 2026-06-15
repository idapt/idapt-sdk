

import { AgentsApi } from "./api/agents.js";
import { AiGatewayApi } from "./api/ai-gateway.js";
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

  apiUrl: string;

  key: string;

  fetch?: typeof fetch;
}

export class IdaptClient {

  readonly user: UserApi;

  readonly files: FilesApi;

  readonly agents: AgentsApi;

  readonly chats: ChatsApi;

  readonly workspaces: WorkspacesApi;

  readonly triggers: TriggersApi;

  readonly computers: ComputersApi;

  readonly secrets: SecretsApi;

  readonly apiKeys: ApiKeysApi;

  readonly notifications: NotificationsApi;

  readonly settings: SettingsApi;

  readonly subscription: SubscriptionApi;

  readonly sharing: SharingApi;

  readonly store: StoreApi;

  readonly models: ModelsApi;

  readonly aiGateway: AiGatewayApi;

  readonly providerEndpoints: ProviderEndpointsApi;

  readonly images: ImagesApi;

  readonly audio: AudioApi;

  readonly code: CodeRunsApi;

  readonly search: SearchApi;

  readonly web: WebSearchApi;

  readonly skill: SkillApi;

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
    this.aiGateway = new AiGatewayApi(ctx);
    this.providerEndpoints = new ProviderEndpointsApi(ctx);
    this.images = new ImagesApi(ctx);
    this.audio = new AudioApi(ctx);
    this.code = new CodeRunsApi(ctx);
    this.search = new SearchApi(ctx);
    this.web = new WebSearchApi(ctx);
    this.skill = new SkillApi(ctx);
    this.docs = new DocsApi(ctx);
  }

  getApiKey(): string {
    return this.ctx.key;
  }

  getApiUrl(): string {
    return this.ctx.apiUrl;
  }

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
