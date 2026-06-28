

import type { V1Commands } from "@idapt/api-contracts/v1/contracts";
import { AgentsApi } from "./api/agents.js";
import { AiGatewayApi } from "./api/ai-gateway.js";
import { ApiKeysApi } from "./api/api-keys.js";
import { AudioApi } from "./api/audio.js";
import { BlobsApi } from "./api/blobs.js";
import { ChatsApi } from "./api/chats.js";
import { CodeRunsApi } from "./api/code.js";
import { ComputersApi } from "./api/computers.js";
import { DatastoreApi } from "./api/datastore.js";
import { DocsApi } from "./api/docs.js";
import { FilesApi } from "./api/files.js";
import { GuideApi } from "./api/guide.js";
import { ImagesApi } from "./api/images.js";
import { ModelsApi } from "./api/models.js";
import { NotificationsApi } from "./api/notifications.js";
import { ProviderEndpointsApi } from "./api/provider-endpoints.js";
import { RealtimeApi } from "./api/realtime.js";
import { SearchApi } from "./api/search.js";
import { SecretsApi } from "./api/secrets.js";
import { SettingsApi } from "./api/settings.js";
import { SharingApi } from "./api/sharing.js";
import { StoreApi } from "./api/store.js";
import { SubscriptionApi } from "./api/subscription.js";
import { TablesApi } from "./api/tables.js";
import { TriggersApi } from "./api/triggers.js";
import { UserApi } from "./api/user.js";
import { WebSearchApi } from "./api/web.js";
import { WorkspacesApi } from "./api/workspaces.js";
import { type ExecuteCommandOptions, executeCommand } from "./core/execute.js";
import { InvalidRequestError } from "./errors.js";
import {
  COMMAND_BINDINGS,
  type V1CommandName,
} from "./generated/command-bindings.generated.js";
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

  readonly kv: DatastoreApi;

  readonly blobs: BlobsApi;

  readonly tables: TablesApi;

  readonly realtime: RealtimeApi;

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

  readonly guide: GuideApi;

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
    this.kv = new DatastoreApi(ctx);
    this.blobs = new BlobsApi(ctx);
    this.tables = new TablesApi(ctx);
    this.realtime = new RealtimeApi(ctx);
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
    this.guide = new GuideApi(ctx);
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

  async call<
    K extends V1CommandName | (string & {}),
    T = K extends keyof V1Commands ? V1Commands[K]["result"] : unknown,
  >(
    action: K,
    args: Record<string, unknown> = {},
    opts: ExecuteCommandOptions = {},
  ): Promise<T> {
    const binding = COMMAND_BINDINGS[action];
    if (!binding) {

      throw new InvalidRequestError({
        message: `unknown command: \`${action}\`. See the v1 command catalog for valid \`<resource> <verb>\` actions.`,
      });
    }
    return executeCommand<T>(binding, args, this.ctx, opts);
  }
}
