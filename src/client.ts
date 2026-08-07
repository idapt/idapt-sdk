

import type { V1Commands } from "@idapt/api-contracts/v1/contracts";
import { AiGatewayApi } from "./api/ai-gateway.js";
import { AutomationsApi } from "./api/automations.js";
import { ComputersApi } from "./api/computers.js";
import { DocsApi } from "./api/docs.js";
import { FilesApi } from "./api/files.js";
import { InferenceApi } from "./api/inference.js";
import { MemoryApi } from "./api/memory.js";
import { NotesApi } from "./api/notes.js";
import { NotificationsApi } from "./api/notifications.js";
import { RealtimeApi } from "./api/realtime.js";
import { SharingApi } from "./api/sharing.js";
import { TasksApi } from "./api/tasks.js";
import { UserApi } from "./api/user.js";
import { IDAPT_API_VERSION, IDAPT_API_VERSION_HEADER } from "./api-version.js";
import { type ExecuteCommandOptions, executeCommand } from "./core/execute.js";
import { InvalidRequestError } from "./errors.js";
import {
  COMMAND_BINDINGS,
  type V1CommandName,
} from "./generated/command-bindings.generated.js";

import {
  AgentsApi,
  ApiKeysApi,
  AudioApi,
  ChatsApi,
  CredentialsApi,
  CustomModelsApi,
  GuideApi,
  HttpApi,
  ImagesApi,
  McpApi,
  MeApi,
  ModelsApi,
  OperationsApi,
  ProviderEndpointsApi,
  SearchApi,
  ServicesApi,
  SettingsApi,
  SubscriptionApi,
  VideosApi,
  WebSearchApi,
  WorkspacesApi,
} from "./generated/resources.generated.js";
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

  readonly automations: AutomationsApi;

  readonly computers: ComputersApi;

  readonly notes: NotesApi;
  readonly memory: MemoryApi;

  readonly tasks: TasksApi;

  readonly credentials: CredentialsApi;

  readonly http: HttpApi;

  readonly mcp: McpApi;

  readonly services: ServicesApi;

  readonly customModels: CustomModelsApi;

  readonly realtime: RealtimeApi;

  readonly apiKeys: ApiKeysApi;

  readonly notifications: NotificationsApi;

  readonly me: MeApi;

  readonly settings: SettingsApi;

  readonly subscription: SubscriptionApi;

  readonly sharing: SharingApi;

  readonly models: ModelsApi;

  readonly aiGateway: AiGatewayApi;

  readonly providerEndpoints: ProviderEndpointsApi;

  readonly images: ImagesApi;

  readonly videos: VideosApi;

  readonly audio: AudioApi;

  readonly inference: InferenceApi;

  readonly operations: OperationsApi;

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
      headers: {
        [IDAPT_API_VERSION_HEADER]: IDAPT_API_VERSION,
      },
      fetch: opts.fetch,
    };
    this.ctx = ctx;
    this.user = new UserApi(ctx);
    this.files = new FilesApi(ctx);
    this.agents = new AgentsApi(ctx);
    this.chats = new ChatsApi(ctx);
    this.workspaces = new WorkspacesApi(ctx);
    this.automations = new AutomationsApi(ctx);
    this.computers = new ComputersApi(ctx);
    this.notes = new NotesApi(ctx);
    this.memory = new MemoryApi(ctx);
    this.tasks = new TasksApi(ctx);
    this.credentials = new CredentialsApi(ctx);
    this.http = new HttpApi(ctx);
    this.mcp = new McpApi(ctx);
    this.services = new ServicesApi(ctx);
    this.customModels = new CustomModelsApi(ctx);
    this.realtime = new RealtimeApi(ctx);
    this.apiKeys = new ApiKeysApi(ctx);
    this.notifications = new NotificationsApi(ctx);
    this.me = new MeApi(ctx);
    this.settings = new SettingsApi(ctx);
    this.subscription = new SubscriptionApi(ctx);
    this.sharing = new SharingApi(ctx);
    this.models = new ModelsApi(ctx);
    this.aiGateway = new AiGatewayApi(ctx);
    this.providerEndpoints = new ProviderEndpointsApi(ctx);
    this.images = new ImagesApi(ctx);
    this.videos = new VideosApi(ctx);
    this.audio = new AudioApi(ctx);
    this.inference = new InferenceApi(ctx);
    this.operations = new OperationsApi(ctx);
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
        [IDAPT_API_VERSION_HEADER]: IDAPT_API_VERSION,
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
