

export interface CommandBinding {

  command: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";

  path: string;

  pathParams: readonly string[];

  argLocation: "path" | "query" | "body" | "multipart";

  responseKind: "single" | "list" | "created" | "deleted" | "binary";

  async: boolean;

  pollHint?: { intervalMs: number; maxAttempts: number };

  binaryContentTypes?: readonly string[];
}

export const COMMAND_BINDINGS: Record<string, CommandBinding> = {
  "agent archive": {
    "command": "agent archive",
    "method": "POST",
    "path": "/agents/:id/archive",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "agent copy-to-workspace": {
    "command": "agent copy-to-workspace",
    "method": "POST",
    "path": "/agents/:id/copy-to-workspace",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "agent create": {
    "command": "agent create",
    "method": "POST",
    "path": "/agents",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "agent delete": {
    "command": "agent delete",
    "method": "DELETE",
    "path": "/agents/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "agent get": {
    "command": "agent get",
    "method": "GET",
    "path": "/agents/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "agent list": {
    "command": "agent list",
    "method": "GET",
    "path": "/agents",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "agent move": {
    "command": "agent move",
    "method": "POST",
    "path": "/agents/:id/move",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "agent permanent-delete": {
    "command": "agent permanent-delete",
    "method": "DELETE",
    "path": "/agents/:id/permanent-delete",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "agent restore": {
    "command": "agent restore",
    "method": "POST",
    "path": "/agents/:id/restore",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "agent unarchive": {
    "command": "agent unarchive",
    "method": "POST",
    "path": "/agents/:id/unarchive",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "agent update": {
    "command": "agent update",
    "method": "PATCH",
    "path": "/agents/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "ai-gateway providers": {
    "command": "ai-gateway providers",
    "method": "GET",
    "path": "/ai-gateway/providers",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "ai-gateway route-preview": {
    "command": "ai-gateway route-preview",
    "method": "POST",
    "path": "/ai-gateway/routing-preview",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "ai-gateway usage": {
    "command": "ai-gateway usage",
    "method": "GET",
    "path": "/ai-gateway/usage",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "api-key create": {
    "command": "api-key create",
    "method": "POST",
    "path": "/api-keys",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "api-key delete": {
    "command": "api-key delete",
    "method": "DELETE",
    "path": "/api-keys/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "api-key list": {
    "command": "api-key list",
    "method": "GET",
    "path": "/api-keys",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "api-key rotate": {
    "command": "api-key rotate",
    "method": "POST",
    "path": "/api-keys/:id/rotate",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "api-key update": {
    "command": "api-key update",
    "method": "PATCH",
    "path": "/api-keys/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "audio models": {
    "command": "audio models",
    "method": "GET",
    "path": "/audio/models",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "audio search-models": {
    "command": "audio search-models",
    "method": "GET",
    "path": "/audio/models/search",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "audio search-voices": {
    "command": "audio search-voices",
    "method": "GET",
    "path": "/audio/voices/search",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "audio voices": {
    "command": "audio voices",
    "method": "GET",
    "path": "/audio/voices",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "automation archive": {
    "command": "automation archive",
    "method": "POST",
    "path": "/automations/:id/archive",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "automation cancel-run": {
    "command": "automation cancel-run",
    "method": "POST",
    "path": "/automations/:id/runs/:runId/cancel",
    "pathParams": [
      "id",
      "runId"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "automation cost-stats": {
    "command": "automation cost-stats",
    "method": "GET",
    "path": "/automations/:id/cost-stats",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "automation cost-stats-all": {
    "command": "automation cost-stats-all",
    "method": "GET",
    "path": "/automations/cost-stats",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "automation create": {
    "command": "automation create",
    "method": "POST",
    "path": "/automations",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "automation delete": {
    "command": "automation delete",
    "method": "DELETE",
    "path": "/automations/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "automation fire": {
    "command": "automation fire",
    "method": "POST",
    "path": "/automations/:id/fire",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "automation get": {
    "command": "automation get",
    "method": "GET",
    "path": "/automations/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "automation list": {
    "command": "automation list",
    "method": "GET",
    "path": "/automations",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "automation retry-run": {
    "command": "automation retry-run",
    "method": "POST",
    "path": "/automations/:id/runs/:runId/retry",
    "pathParams": [
      "id",
      "runId"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "automation rotate-secret": {
    "command": "automation rotate-secret",
    "method": "POST",
    "path": "/automations/:id/rotate-secret",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "automation runs": {
    "command": "automation runs",
    "method": "GET",
    "path": "/automations/:id/runs",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "automation runs-all": {
    "command": "automation runs-all",
    "method": "GET",
    "path": "/automations/runs",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "automation test-fire": {
    "command": "automation test-fire",
    "method": "POST",
    "path": "/automations/:id/test-fire",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "automation unarchive": {
    "command": "automation unarchive",
    "method": "POST",
    "path": "/automations/:id/unarchive",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "automation update": {
    "command": "automation update",
    "method": "PATCH",
    "path": "/automations/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "blobs delete": {
    "command": "blobs delete",
    "method": "DELETE",
    "path": "/blobs/:namespace/:key",
    "pathParams": [
      "namespace",
      "key"
    ],
    "argLocation": "query",
    "responseKind": "deleted",
    "async": false
  },
  "blobs get": {
    "command": "blobs get",
    "method": "GET",
    "path": "/blobs/:namespace/:key",
    "pathParams": [
      "namespace",
      "key"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "blobs head": {
    "command": "blobs head",
    "method": "GET",
    "path": "/blobs/:namespace/:key/meta",
    "pathParams": [
      "namespace",
      "key"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "blobs list": {
    "command": "blobs list",
    "method": "GET",
    "path": "/blobs/:namespace",
    "pathParams": [
      "namespace"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "blobs namespaces": {
    "command": "blobs namespaces",
    "method": "GET",
    "path": "/blobs",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "blobs put": {
    "command": "blobs put",
    "method": "POST",
    "path": "/blobs/:namespace/:key",
    "pathParams": [
      "namespace",
      "key"
    ],
    "argLocation": "multipart",
    "responseKind": "single",
    "async": false
  },
  "blobs signed-url": {
    "command": "blobs signed-url",
    "method": "POST",
    "path": "/blobs/:namespace/:key/signed-url",
    "pathParams": [
      "namespace",
      "key"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "browser-app create": {
    "command": "browser-app create",
    "method": "POST",
    "path": "/browser-apps",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "browser-app deploy": {
    "command": "browser-app deploy",
    "method": "POST",
    "path": "/browser-apps/:app/deployments",
    "pathParams": [
      "app"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "browser-app deployments": {
    "command": "browser-app deployments",
    "method": "GET",
    "path": "/browser-apps/:app/deployments",
    "pathParams": [
      "app"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "browser-app fork": {
    "command": "browser-app fork",
    "method": "POST",
    "path": "/browser-apps/:app/fork",
    "pathParams": [
      "app"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "browser-app get": {
    "command": "browser-app get",
    "method": "GET",
    "path": "/browser-apps/:app",
    "pathParams": [
      "app"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "browser-app list": {
    "command": "browser-app list",
    "method": "GET",
    "path": "/browser-apps",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "browser-app promote": {
    "command": "browser-app promote",
    "method": "POST",
    "path": "/browser-apps/:app/deployments/:id/promote",
    "pathParams": [
      "app",
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "browser-app snapshot": {
    "command": "browser-app snapshot",
    "method": "POST",
    "path": "/browser-apps/:app/snapshot",
    "pathParams": [
      "app"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "chat archive": {
    "command": "chat archive",
    "method": "POST",
    "path": "/chats/:id/archive",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "chat compact": {
    "command": "chat compact",
    "method": "POST",
    "path": "/chats/:id/compact",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "chat copy-to-agent": {
    "command": "chat copy-to-agent",
    "method": "POST",
    "path": "/chats/:id/copy-to-agent",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "chat copy-to-workspace": {
    "command": "chat copy-to-workspace",
    "method": "POST",
    "path": "/chats/:id/copy-to-workspace",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "chat cost": {
    "command": "chat cost",
    "method": "GET",
    "path": "/chats/:id/cost",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "chat create": {
    "command": "chat create",
    "method": "POST",
    "path": "/chats",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "chat delete": {
    "command": "chat delete",
    "method": "DELETE",
    "path": "/chats/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "chat end-goal": {
    "command": "chat end-goal",
    "method": "DELETE",
    "path": "/chats/:id/goal",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "chat export": {
    "command": "chat export",
    "method": "GET",
    "path": "/chats/:id/export",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "binary",
    "async": false,
    "binaryContentTypes": [
      "text/markdown",
      "text/plain",
      "application/json",
      "application/pdf"
    ]
  },
  "chat fork-to-workspace": {
    "command": "chat fork-to-workspace",
    "method": "POST",
    "path": "/chats/:id/fork-to-workspace",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "chat get": {
    "command": "chat get",
    "method": "GET",
    "path": "/chats/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "chat goal": {
    "command": "chat goal",
    "method": "GET",
    "path": "/chats/:id/goal",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "chat list": {
    "command": "chat list",
    "method": "GET",
    "path": "/chats",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "chat message-costs": {
    "command": "chat message-costs",
    "method": "GET",
    "path": "/chats/:id/message-costs",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "chat messages": {
    "command": "chat messages",
    "method": "GET",
    "path": "/chats/:id/messages",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "chat permanent-delete": {
    "command": "chat permanent-delete",
    "method": "DELETE",
    "path": "/chats/:id/permanent-delete",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "chat reprompt": {
    "command": "chat reprompt",
    "method": "POST",
    "path": "/chats/:id/messages/:message_id/reprompt",
    "pathParams": [
      "id",
      "message_id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "chat restore": {
    "command": "chat restore",
    "method": "POST",
    "path": "/chats/:id/restore",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "chat resume-goal": {
    "command": "chat resume-goal",
    "method": "POST",
    "path": "/chats/:id/goal/resume",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "chat runs": {
    "command": "chat runs",
    "method": "GET",
    "path": "/chats/:id/runs",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "chat send": {
    "command": "chat send",
    "method": "POST",
    "path": "/chats/:id/messages",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "chat set-goal": {
    "command": "chat set-goal",
    "method": "POST",
    "path": "/chats/:id/goal",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "chat stop": {
    "command": "chat stop",
    "method": "POST",
    "path": "/chats/:id/stop",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "chat stream": {
    "command": "chat stream",
    "method": "POST",
    "path": "/chats/:id/messages/stream",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "binary",
    "async": false,
    "binaryContentTypes": [
      "text/event-stream"
    ]
  },
  "chat unarchive": {
    "command": "chat unarchive",
    "method": "POST",
    "path": "/chats/:id/unarchive",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "chat update": {
    "command": "chat update",
    "method": "PATCH",
    "path": "/chats/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "ci cancel": {
    "command": "ci cancel",
    "method": "POST",
    "path": "/ci/pipelines/:id/cancel",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "ci get": {
    "command": "ci get",
    "method": "GET",
    "path": "/ci/pipelines/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "ci jobs": {
    "command": "ci jobs",
    "method": "GET",
    "path": "/ci/pipelines/:id/jobs",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "ci list": {
    "command": "ci list",
    "method": "GET",
    "path": "/ci/pipelines",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "ci run": {
    "command": "ci run",
    "method": "POST",
    "path": "/ci/pipelines",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "computer activity": {
    "command": "computer activity",
    "method": "GET",
    "path": "/computers/:id/activity",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "computer add-local-model": {
    "command": "computer add-local-model",
    "method": "POST",
    "path": "/computers/:id/local-inference/models",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "computer allow": {
    "command": "computer allow",
    "method": "POST",
    "path": "/computers/:id/exposures",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "computer create": {
    "command": "computer create",
    "method": "POST",
    "path": "/computers",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "computer create-user": {
    "command": "computer create-user",
    "method": "POST",
    "path": "/computers/:id/users",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "computer delete": {
    "command": "computer delete",
    "method": "DELETE",
    "path": "/computers/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "computer delete-user": {
    "command": "computer delete-user",
    "method": "DELETE",
    "path": "/computers/:id/users/:username",
    "pathParams": [
      "id",
      "username"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "computer download": {
    "command": "computer download",
    "method": "GET",
    "path": "/computers/:id/fs/download",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "binary",
    "async": false,
    "binaryContentTypes": [
      "application/octet-stream",
      "application/gzip"
    ]
  },
  "computer download-to-drive": {
    "command": "computer download-to-drive",
    "method": "POST",
    "path": "/computers/:id/fs/download",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer ephemeral": {
    "command": "computer ephemeral",
    "method": "POST",
    "path": "/computers/ephemeral",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "single",
    "async": true,
    "pollHint": {
      "intervalMs": 4000,
      "maxAttempts": 90
    }
  },
  "computer exec": {
    "command": "computer exec",
    "method": "POST",
    "path": "/computers/:id/exec",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer fs": {
    "command": "computer fs",
    "method": "POST",
    "path": "/computers/:id/fs",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer get": {
    "command": "computer get",
    "method": "GET",
    "path": "/computers/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "computer get-user": {
    "command": "computer get-user",
    "method": "GET",
    "path": "/computers/:id/users/:username",
    "pathParams": [
      "id",
      "username"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "computer list": {
    "command": "computer list",
    "method": "GET",
    "path": "/computers",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "computer local-inference": {
    "command": "computer local-inference",
    "method": "POST",
    "path": "/computers/:id/local-inference",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer local-inference-cancel": {
    "command": "computer local-inference-cancel",
    "method": "POST",
    "path": "/computers/:id/local-inference/operations/:operation_id/cancel",
    "pathParams": [
      "id",
      "operation_id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer local-inference-map": {
    "command": "computer local-inference-map",
    "method": "PATCH",
    "path": "/computers/:id/local-inference/models/:ollama_id/mapping",
    "pathParams": [
      "id",
      "ollama_id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer local-inference-operations": {
    "command": "computer local-inference-operations",
    "method": "GET",
    "path": "/computers/:id/local-inference/operations",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "computer local-models": {
    "command": "computer local-models",
    "method": "GET",
    "path": "/computers/:id/local-inference/models",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "computer manage": {
    "command": "computer manage",
    "method": "POST",
    "path": "/computers/:id/manage",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer pair": {
    "command": "computer pair",
    "method": "POST",
    "path": "/computers/pair",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "computer port-close": {
    "command": "computer port-close",
    "method": "DELETE",
    "path": "/computers/:id/ports",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "computer port-label": {
    "command": "computer port-label",
    "method": "PATCH",
    "path": "/computers/:id/ports",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer port-make-public": {
    "command": "computer port-make-public",
    "method": "POST",
    "path": "/computers/:id/ports/public",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer port-open": {
    "command": "computer port-open",
    "method": "POST",
    "path": "/computers/:id/ports",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer port-revoke-public": {
    "command": "computer port-revoke-public",
    "method": "DELETE",
    "path": "/computers/:id/ports/public",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "computer ports": {
    "command": "computer ports",
    "method": "GET",
    "path": "/computers/:id/ports",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "computer remove-local-model": {
    "command": "computer remove-local-model",
    "method": "DELETE",
    "path": "/computers/:id/local-inference/models/:ollama_id",
    "pathParams": [
      "id",
      "ollama_id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer revoke": {
    "command": "computer revoke",
    "method": "DELETE",
    "path": "/computers/:id/exposures/:workspace_id",
    "pathParams": [
      "id",
      "workspace_id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer rotate-credential": {
    "command": "computer rotate-credential",
    "method": "POST",
    "path": "/computers/:id/rotate-credential",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer run": {
    "command": "computer run",
    "method": "POST",
    "path": "/computers/run",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "single",
    "async": true,
    "pollHint": {
      "intervalMs": 3000,
      "maxAttempts": 120
    }
  },
  "computer start": {
    "command": "computer start",
    "method": "POST",
    "path": "/computers/:id/start",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer stop": {
    "command": "computer stop",
    "method": "POST",
    "path": "/computers/:id/stop",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer terminal": {
    "command": "computer terminal",
    "method": "POST",
    "path": "/computers/:id/terminal",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer test-connection": {
    "command": "computer test-connection",
    "method": "POST",
    "path": "/computers/:id/test-connection",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer transfer": {
    "command": "computer transfer",
    "method": "POST",
    "path": "/computers/:id/transfer",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer update": {
    "command": "computer update",
    "method": "PATCH",
    "path": "/computers/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer update-allowance": {
    "command": "computer update-allowance",
    "method": "PATCH",
    "path": "/computers/:id/exposures/:workspace_id",
    "pathParams": [
      "id",
      "workspace_id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer update-user": {
    "command": "computer update-user",
    "method": "PATCH",
    "path": "/computers/:id/users/:username",
    "pathParams": [
      "id",
      "username"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer upload": {
    "command": "computer upload",
    "method": "POST",
    "path": "/computers/:id/fs/upload",
    "pathParams": [
      "id"
    ],
    "argLocation": "multipart",
    "responseKind": "single",
    "async": false
  },
  "computer users": {
    "command": "computer users",
    "method": "GET",
    "path": "/computers/:id/users",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "container backup": {
    "command": "container backup",
    "method": "POST",
    "path": "/containers/:id/backup",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false,
    "pollHint": {
      "intervalMs": 3000,
      "maxAttempts": 200
    }
  },
  "container backups": {
    "command": "container backups",
    "method": "GET",
    "path": "/containers/:id/backups",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "container compose-get": {
    "command": "container compose-get",
    "method": "GET",
    "path": "/containers/:id/compose",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "container compose-set": {
    "command": "container compose-set",
    "method": "POST",
    "path": "/containers/:id/compose",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "container compose-up": {
    "command": "container compose-up",
    "method": "POST",
    "path": "/containers/compose-up",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "container create": {
    "command": "container create",
    "method": "POST",
    "path": "/containers",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "container delete": {
    "command": "container delete",
    "method": "DELETE",
    "path": "/containers/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "container down": {
    "command": "container down",
    "method": "POST",
    "path": "/containers/:id/down",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "container events": {
    "command": "container events",
    "method": "GET",
    "path": "/containers/:id/events",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "container exec": {
    "command": "container exec",
    "method": "POST",
    "path": "/containers/:id/exec",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "container get": {
    "command": "container get",
    "method": "GET",
    "path": "/containers/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "container list": {
    "command": "container list",
    "method": "GET",
    "path": "/containers",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "container logs": {
    "command": "container logs",
    "method": "GET",
    "path": "/containers/:id/logs",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "container migrate": {
    "command": "container migrate",
    "method": "POST",
    "path": "/containers/:id/migrate",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false,
    "pollHint": {
      "intervalMs": 3000,
      "maxAttempts": 200
    }
  },
  "container port-close": {
    "command": "container port-close",
    "method": "DELETE",
    "path": "/containers/:id/ports",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "container port-open": {
    "command": "container port-open",
    "method": "POST",
    "path": "/containers/:id/ports",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "container ports": {
    "command": "container ports",
    "method": "GET",
    "path": "/containers/:id/ports",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "container rebuild": {
    "command": "container rebuild",
    "method": "POST",
    "path": "/containers/:id/rebuild",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "container restart": {
    "command": "container restart",
    "method": "POST",
    "path": "/containers/:id/restart",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "container restore": {
    "command": "container restore",
    "method": "POST",
    "path": "/containers/:id/restore",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false,
    "pollHint": {
      "intervalMs": 3000,
      "maxAttempts": 200
    }
  },
  "container run": {
    "command": "container run",
    "method": "POST",
    "path": "/containers/run",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "container runtime": {
    "command": "container runtime",
    "method": "GET",
    "path": "/containers/runtime",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "container up": {
    "command": "container up",
    "method": "POST",
    "path": "/containers/:id/up",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "container update": {
    "command": "container update",
    "method": "PATCH",
    "path": "/containers/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "credential allow": {
    "command": "credential allow",
    "method": "POST",
    "path": "/credentials/:id/allow",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "credential connect": {
    "command": "credential connect",
    "method": "POST",
    "path": "/credentials/connect",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "credential create": {
    "command": "credential create",
    "method": "POST",
    "path": "/credentials",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "credential delete": {
    "command": "credential delete",
    "method": "DELETE",
    "path": "/credentials/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "credential get": {
    "command": "credential get",
    "method": "GET",
    "path": "/credentials/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "credential list": {
    "command": "credential list",
    "method": "GET",
    "path": "/credentials",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "credential update": {
    "command": "credential update",
    "method": "PATCH",
    "path": "/credentials/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "credential versions": {
    "command": "credential versions",
    "method": "GET",
    "path": "/credentials/:id/versions",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "credential-binding create": {
    "command": "credential-binding create",
    "method": "POST",
    "path": "/credential-bindings",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "credential-binding list": {
    "command": "credential-binding list",
    "method": "GET",
    "path": "/credential-bindings",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "custom-models create": {
    "command": "custom-models create",
    "method": "POST",
    "path": "/custom-models",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "custom-models delete": {
    "command": "custom-models delete",
    "method": "DELETE",
    "path": "/custom-models/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "custom-models get": {
    "command": "custom-models get",
    "method": "GET",
    "path": "/custom-models/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "custom-models list": {
    "command": "custom-models list",
    "method": "GET",
    "path": "/custom-models",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "custom-models update": {
    "command": "custom-models update",
    "method": "PATCH",
    "path": "/custom-models/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "datastore batch": {
    "command": "datastore batch",
    "method": "POST",
    "path": "/datastore/:namespace",
    "pathParams": [
      "namespace"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "datastore delete": {
    "command": "datastore delete",
    "method": "DELETE",
    "path": "/datastore/:namespace/:key",
    "pathParams": [
      "namespace",
      "key"
    ],
    "argLocation": "query",
    "responseKind": "deleted",
    "async": false
  },
  "datastore get": {
    "command": "datastore get",
    "method": "GET",
    "path": "/datastore/:namespace/:key",
    "pathParams": [
      "namespace",
      "key"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "datastore increment": {
    "command": "datastore increment",
    "method": "POST",
    "path": "/datastore/:namespace/:key/increment",
    "pathParams": [
      "namespace",
      "key"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "datastore list": {
    "command": "datastore list",
    "method": "GET",
    "path": "/datastore/:namespace",
    "pathParams": [
      "namespace"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "datastore namespaces": {
    "command": "datastore namespaces",
    "method": "GET",
    "path": "/datastore",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "datastore set": {
    "command": "datastore set",
    "method": "POST",
    "path": "/datastore/:namespace/:key",
    "pathParams": [
      "namespace",
      "key"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "drive content-versions": {
    "command": "drive content-versions",
    "method": "GET",
    "path": "/drive/files/:id/content-versions",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "drive create-folder": {
    "command": "drive create-folder",
    "method": "POST",
    "path": "/drive/files/folders",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "drive delete": {
    "command": "drive delete",
    "method": "DELETE",
    "path": "/drive/files/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "drive get-metadata": {
    "command": "drive get-metadata",
    "method": "GET",
    "path": "/drive/files/:id/metadata",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "drive glob": {
    "command": "drive glob",
    "method": "GET",
    "path": "/drive/glob",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "drive grep": {
    "command": "drive grep",
    "method": "GET",
    "path": "/drive/grep",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "drive list": {
    "command": "drive list",
    "method": "GET",
    "path": "/drive/files",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "drive move": {
    "command": "drive move",
    "method": "POST",
    "path": "/drive/files/:id/move",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "drive permanent-delete": {
    "command": "drive permanent-delete",
    "method": "DELETE",
    "path": "/drive/files/:id/permanent-delete",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "drive read": {
    "command": "drive read",
    "method": "GET",
    "path": "/drive/files/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "binary",
    "async": false,
    "binaryContentTypes": [
      "application/octet-stream"
    ]
  },
  "drive restore": {
    "command": "drive restore",
    "method": "POST",
    "path": "/drive/files/:id/restore",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "drive restore-version": {
    "command": "drive restore-version",
    "method": "POST",
    "path": "/drive/files/:id/content-versions/restore",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "drive signed-url": {
    "command": "drive signed-url",
    "method": "POST",
    "path": "/drive/files/:id/signed-url",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "drive update": {
    "command": "drive update",
    "method": "PATCH",
    "path": "/drive/files/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "drive upload": {
    "command": "drive upload",
    "method": "POST",
    "path": "/drive/files",
    "pathParams": [],
    "argLocation": "multipart",
    "responseKind": "created",
    "async": false
  },
  "functions create": {
    "command": "functions create",
    "method": "POST",
    "path": "/functions",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "functions delete": {
    "command": "functions delete",
    "method": "DELETE",
    "path": "/functions/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "deleted",
    "async": false
  },
  "functions deploy": {
    "command": "functions deploy",
    "method": "POST",
    "path": "/functions/:id/deploy",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "functions deployments": {
    "command": "functions deployments",
    "method": "GET",
    "path": "/functions/:id/deployments",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "functions get": {
    "command": "functions get",
    "method": "GET",
    "path": "/functions/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "functions invoke": {
    "command": "functions invoke",
    "method": "POST",
    "path": "/functions/:id/invoke",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "functions list": {
    "command": "functions list",
    "method": "GET",
    "path": "/functions",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "functions promote": {
    "command": "functions promote",
    "method": "POST",
    "path": "/functions/:id/promote",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "functions update": {
    "command": "functions update",
    "method": "PATCH",
    "path": "/functions/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "guide get": {
    "command": "guide get",
    "method": "GET",
    "path": "/guide",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "help-center list": {
    "command": "help-center list",
    "method": "GET",
    "path": "/help-center",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "help-center read": {
    "command": "help-center read",
    "method": "GET",
    "path": "/help-center/:slug",
    "pathParams": [
      "slug"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "help-center search": {
    "command": "help-center search",
    "method": "GET",
    "path": "/help-center/search",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "hook create": {
    "command": "hook create",
    "method": "POST",
    "path": "/hooks",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "hook delete": {
    "command": "hook delete",
    "method": "DELETE",
    "path": "/hooks/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "hook get": {
    "command": "hook get",
    "method": "GET",
    "path": "/hooks/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "hook history": {
    "command": "hook history",
    "method": "GET",
    "path": "/hooks/history",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "hook list": {
    "command": "hook list",
    "method": "GET",
    "path": "/hooks",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "hook override": {
    "command": "hook override",
    "method": "POST",
    "path": "/hooks/:id/override",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "hook preview": {
    "command": "hook preview",
    "method": "GET",
    "path": "/hooks/:id/preview",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "hook toggle": {
    "command": "hook toggle",
    "method": "POST",
    "path": "/hooks/:id/toggle",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "hook update": {
    "command": "hook update",
    "method": "PATCH",
    "path": "/hooks/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "http request": {
    "command": "http request",
    "method": "POST",
    "path": "/http/request",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "hub install": {
    "command": "hub install",
    "method": "POST",
    "path": "/hub/:resourceId/install",
    "pathParams": [
      "resourceId"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "hub search": {
    "command": "hub search",
    "method": "GET",
    "path": "/hub/search",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "hub submissions": {
    "command": "hub submissions",
    "method": "GET",
    "path": "/hub/submissions/mine",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "hub submit": {
    "command": "hub submit",
    "method": "POST",
    "path": "/hub/submissions",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "hub update": {
    "command": "hub update",
    "method": "POST",
    "path": "/hub/:resourceId/update",
    "pathParams": [
      "resourceId"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "hub update-check": {
    "command": "hub update-check",
    "method": "POST",
    "path": "/hub/:resourceId/update-check",
    "pathParams": [
      "resourceId"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "image models": {
    "command": "image models",
    "method": "GET",
    "path": "/images/models",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "image search": {
    "command": "image search",
    "method": "GET",
    "path": "/images/models/search",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "inference image": {
    "command": "inference image",
    "method": "POST",
    "path": "/inference/images",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "single",
    "async": false,
    "pollHint": {
      "intervalMs": 1000,
      "maxAttempts": 120
    }
  },
  "inference speech": {
    "command": "inference speech",
    "method": "POST",
    "path": "/inference/speech",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "single",
    "async": false,
    "pollHint": {
      "intervalMs": 1000,
      "maxAttempts": 120
    }
  },
  "inference speech-stream": {
    "command": "inference speech-stream",
    "method": "POST",
    "path": "/inference/speech/stream",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "binary",
    "async": false,
    "binaryContentTypes": [
      "text/event-stream"
    ]
  },
  "inference text": {
    "command": "inference text",
    "method": "POST",
    "path": "/inference/text",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "single",
    "async": false,
    "pollHint": {
      "intervalMs": 1000,
      "maxAttempts": 120
    }
  },
  "inference text-stream": {
    "command": "inference text-stream",
    "method": "POST",
    "path": "/inference/text/stream",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "binary",
    "async": false,
    "binaryContentTypes": [
      "text/event-stream"
    ]
  },
  "inference transcribe": {
    "command": "inference transcribe",
    "method": "POST",
    "path": "/inference/transcriptions",
    "pathParams": [],
    "argLocation": "multipart",
    "responseKind": "single",
    "async": false,
    "pollHint": {
      "intervalMs": 1000,
      "maxAttempts": 120
    }
  },
  "inference video": {
    "command": "inference video",
    "method": "POST",
    "path": "/inference/videos",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "single",
    "async": true,
    "pollHint": {
      "intervalMs": 5000,
      "maxAttempts": 240
    }
  },
  "mcp call": {
    "command": "mcp call",
    "method": "POST",
    "path": "/mcp/call",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "mcp info": {
    "command": "mcp info",
    "method": "POST",
    "path": "/mcp/info",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "mcp prompt": {
    "command": "mcp prompt",
    "method": "POST",
    "path": "/mcp/prompt",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "mcp prompts": {
    "command": "mcp prompts",
    "method": "POST",
    "path": "/mcp/prompts",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "mcp resource": {
    "command": "mcp resource",
    "method": "POST",
    "path": "/mcp/resource",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "mcp resources": {
    "command": "mcp resources",
    "method": "POST",
    "path": "/mcp/resources",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "mcp tools": {
    "command": "mcp tools",
    "method": "POST",
    "path": "/mcp/tools",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "list",
    "async": false
  },
  "me get": {
    "command": "me get",
    "method": "GET",
    "path": "/me",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "me limits": {
    "command": "me limits",
    "method": "GET",
    "path": "/me/limits",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "me usage": {
    "command": "me usage",
    "method": "GET",
    "path": "/me/usage",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "memory box-delete": {
    "command": "memory box-delete",
    "method": "DELETE",
    "path": "/memory/boxes/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "memory box-get": {
    "command": "memory box-get",
    "method": "GET",
    "path": "/memory/boxes/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "memory box-list": {
    "command": "memory box-list",
    "method": "GET",
    "path": "/memory/boxes",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "memory box-update": {
    "command": "memory box-update",
    "method": "PATCH",
    "path": "/memory/boxes/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "memory delete": {
    "command": "memory delete",
    "method": "DELETE",
    "path": "/memory/boxes/:id/note",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "deleted",
    "async": false
  },
  "memory index-read": {
    "command": "memory index-read",
    "method": "GET",
    "path": "/memory/boxes/:id/index",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "memory index-write": {
    "command": "memory index-write",
    "method": "POST",
    "path": "/memory/boxes/:id/index",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "memory list": {
    "command": "memory list",
    "method": "GET",
    "path": "/memory/boxes/:id/notes",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "memory read": {
    "command": "memory read",
    "method": "GET",
    "path": "/memory/boxes/:id/note",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "memory search": {
    "command": "memory search",
    "method": "GET",
    "path": "/memory/boxes/:id/search",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "memory write": {
    "command": "memory write",
    "method": "POST",
    "path": "/memory/boxes/:id/notes",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "models get": {
    "command": "models get",
    "method": "GET",
    "path": "/models/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "models list": {
    "command": "models list",
    "method": "GET",
    "path": "/models",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "models search": {
    "command": "models search",
    "method": "GET",
    "path": "/models/search",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "notes box-create": {
    "command": "notes box-create",
    "method": "POST",
    "path": "/notes/boxes",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "notes box-delete": {
    "command": "notes box-delete",
    "method": "DELETE",
    "path": "/notes/boxes/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "notes box-get": {
    "command": "notes box-get",
    "method": "GET",
    "path": "/notes/boxes/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "notes box-list": {
    "command": "notes box-list",
    "method": "GET",
    "path": "/notes/boxes",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "notes box-update": {
    "command": "notes box-update",
    "method": "PATCH",
    "path": "/notes/boxes/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "notes delete": {
    "command": "notes delete",
    "method": "DELETE",
    "path": "/notes/boxes/:id/note",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "deleted",
    "async": false
  },
  "notes folder-create": {
    "command": "notes folder-create",
    "method": "POST",
    "path": "/notes/boxes/:id/folders",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "notes folder-delete": {
    "command": "notes folder-delete",
    "method": "DELETE",
    "path": "/notes/folders/:folderId",
    "pathParams": [
      "folderId"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "notes folder-list": {
    "command": "notes folder-list",
    "method": "GET",
    "path": "/notes/boxes/:id/folders",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "notes folder-move": {
    "command": "notes folder-move",
    "method": "POST",
    "path": "/notes/folders/:folderId/move",
    "pathParams": [
      "folderId"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "notes folder-rename": {
    "command": "notes folder-rename",
    "method": "PATCH",
    "path": "/notes/folders/:folderId",
    "pathParams": [
      "folderId"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "notes graph": {
    "command": "notes graph",
    "method": "GET",
    "path": "/notes/boxes/:id/graph",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "notes import": {
    "command": "notes import",
    "method": "POST",
    "path": "/notes/boxes/:id/import",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "notes index-read": {
    "command": "notes index-read",
    "method": "GET",
    "path": "/notes/boxes/:id/index",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "notes index-write": {
    "command": "notes index-write",
    "method": "POST",
    "path": "/notes/boxes/:id/index",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "notes links": {
    "command": "notes links",
    "method": "GET",
    "path": "/notes/notes/:noteId/links",
    "pathParams": [
      "noteId"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "notes list": {
    "command": "notes list",
    "method": "GET",
    "path": "/notes/boxes/:id/notes",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "notes note-move": {
    "command": "notes note-move",
    "method": "POST",
    "path": "/notes/boxes/:id/notes/move",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "notes note-rename": {
    "command": "notes note-rename",
    "method": "POST",
    "path": "/notes/boxes/:id/notes/rename",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "notes purge": {
    "command": "notes purge",
    "method": "POST",
    "path": "/notes/trash/purge",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "notes read": {
    "command": "notes read",
    "method": "GET",
    "path": "/notes/boxes/:id/note",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "notes restore": {
    "command": "notes restore",
    "method": "POST",
    "path": "/notes/trash/restore",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "notes search": {
    "command": "notes search",
    "method": "GET",
    "path": "/notes/boxes/:id/search",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "notes search-all": {
    "command": "notes search-all",
    "method": "GET",
    "path": "/notes/search",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "notes tag-list": {
    "command": "notes tag-list",
    "method": "GET",
    "path": "/notes/boxes/:id/tags",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "notes tag-rename": {
    "command": "notes tag-rename",
    "method": "POST",
    "path": "/notes/boxes/:id/tags/rename",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "notes trash-empty": {
    "command": "notes trash-empty",
    "method": "DELETE",
    "path": "/notes/trash",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "notes trash-list": {
    "command": "notes trash-list",
    "method": "GET",
    "path": "/notes/trash",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "notes tree": {
    "command": "notes tree",
    "method": "GET",
    "path": "/notes/boxes/:id/tree",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "notes write": {
    "command": "notes write",
    "method": "POST",
    "path": "/notes/boxes/:id/notes",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "notification config": {
    "command": "notification config",
    "method": "GET",
    "path": "/notifications/config",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "notification delete": {
    "command": "notification delete",
    "method": "DELETE",
    "path": "/notifications/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "notification get": {
    "command": "notification get",
    "method": "GET",
    "path": "/notifications/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "notification list": {
    "command": "notification list",
    "method": "GET",
    "path": "/notifications",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "notification preferences": {
    "command": "notification preferences",
    "method": "GET",
    "path": "/notifications/preferences",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "notification read-all": {
    "command": "notification read-all",
    "method": "POST",
    "path": "/notifications/read-all",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "notification send": {
    "command": "notification send",
    "method": "POST",
    "path": "/notifications",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "notification update": {
    "command": "notification update",
    "method": "PATCH",
    "path": "/notifications/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "notification update-config": {
    "command": "notification update-config",
    "method": "PATCH",
    "path": "/notifications/config",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "notification update-preferences": {
    "command": "notification update-preferences",
    "method": "PATCH",
    "path": "/notifications/preferences",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "list",
    "async": false
  },
  "operation await": {
    "command": "operation await",
    "method": "GET",
    "path": "/operations/:id/await",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "operation cancel": {
    "command": "operation cancel",
    "method": "POST",
    "path": "/operations/:id/cancel",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "operation content": {
    "command": "operation content",
    "method": "GET",
    "path": "/operations/:id/content",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "binary",
    "async": false,
    "binaryContentTypes": [
      "application/octet-stream",
      "text/plain"
    ]
  },
  "operation get": {
    "command": "operation get",
    "method": "GET",
    "path": "/operations/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "operation list": {
    "command": "operation list",
    "method": "GET",
    "path": "/operations",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "provider-endpoint create": {
    "command": "provider-endpoint create",
    "method": "POST",
    "path": "/ai-gateway/provider-endpoints",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "provider-endpoint delete": {
    "command": "provider-endpoint delete",
    "method": "DELETE",
    "path": "/ai-gateway/provider-endpoints/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "provider-endpoint list": {
    "command": "provider-endpoint list",
    "method": "GET",
    "path": "/ai-gateway/provider-endpoints",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "provider-endpoint presets": {
    "command": "provider-endpoint presets",
    "method": "GET",
    "path": "/ai-gateway/provider-endpoints/presets",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "provider-endpoint test": {
    "command": "provider-endpoint test",
    "method": "POST",
    "path": "/ai-gateway/provider-endpoints/:id/test",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "provider-endpoint update": {
    "command": "provider-endpoint update",
    "method": "PATCH",
    "path": "/ai-gateway/provider-endpoints/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "realtime broadcast": {
    "command": "realtime broadcast",
    "method": "POST",
    "path": "/realtime/:channel/broadcast",
    "pathParams": [
      "channel"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "realtime presence": {
    "command": "realtime presence",
    "method": "POST",
    "path": "/realtime/:channel/presence",
    "pathParams": [
      "channel"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "realtime presence-list": {
    "command": "realtime presence-list",
    "method": "GET",
    "path": "/realtime/:channel/presence",
    "pathParams": [
      "channel"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "realtime subscribe": {
    "command": "realtime subscribe",
    "method": "GET",
    "path": "/realtime/subscribe",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "binary",
    "async": false,
    "binaryContentTypes": [
      "text/event-stream"
    ]
  },
  "repos branches": {
    "command": "repos branches",
    "method": "GET",
    "path": "/repos/:id/branches",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "repos clone-url": {
    "command": "repos clone-url",
    "method": "GET",
    "path": "/repos/:id/clone-url",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "repos commit": {
    "command": "repos commit",
    "method": "POST",
    "path": "/repos/:id/commits",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "repos commits": {
    "command": "repos commits",
    "method": "GET",
    "path": "/repos/:id/commits",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "repos create": {
    "command": "repos create",
    "method": "POST",
    "path": "/repos",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "repos delete": {
    "command": "repos delete",
    "method": "DELETE",
    "path": "/repos/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "repos get": {
    "command": "repos get",
    "method": "GET",
    "path": "/repos/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "repos list": {
    "command": "repos list",
    "method": "GET",
    "path": "/repos",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "repos read-file": {
    "command": "repos read-file",
    "method": "GET",
    "path": "/repos/:id/file",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "repos set-visibility": {
    "command": "repos set-visibility",
    "method": "PATCH",
    "path": "/repos/:id/visibility",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "search query": {
    "command": "search query",
    "method": "GET",
    "path": "/search",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "service lookup": {
    "command": "service lookup",
    "method": "GET",
    "path": "/services/:slug",
    "pathParams": [
      "slug"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "service search": {
    "command": "service search",
    "method": "GET",
    "path": "/services",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "settings get": {
    "command": "settings get",
    "method": "GET",
    "path": "/settings",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "settings update": {
    "command": "settings update",
    "method": "PATCH",
    "path": "/settings",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "share create": {
    "command": "share create",
    "method": "POST",
    "path": "/shares",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "share delete": {
    "command": "share delete",
    "method": "DELETE",
    "path": "/shares",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "share list": {
    "command": "share list",
    "method": "GET",
    "path": "/shares",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "share update": {
    "command": "share update",
    "method": "PATCH",
    "path": "/shares",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "shared-with-me list": {
    "command": "shared-with-me list",
    "method": "GET",
    "path": "/shared-with-me",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "skill apply-update": {
    "command": "skill apply-update",
    "method": "POST",
    "path": "/skills/:id/apply-update",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "skill body": {
    "command": "skill body",
    "method": "GET",
    "path": "/skills/:id/body",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "skill create": {
    "command": "skill create",
    "method": "POST",
    "path": "/skills",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "skill delete": {
    "command": "skill delete",
    "method": "DELETE",
    "path": "/skills/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "skill file-delete": {
    "command": "skill file-delete",
    "method": "DELETE",
    "path": "/skills/:id/file",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "deleted",
    "async": false
  },
  "skill file-list": {
    "command": "skill file-list",
    "method": "GET",
    "path": "/skills/:id/files",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "skill file-read": {
    "command": "skill file-read",
    "method": "GET",
    "path": "/skills/:id/file",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "skill file-write": {
    "command": "skill file-write",
    "method": "POST",
    "path": "/skills/:id/files",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "skill fork": {
    "command": "skill fork",
    "method": "POST",
    "path": "/skills/:id/fork",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "skill get": {
    "command": "skill get",
    "method": "GET",
    "path": "/skills/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "skill install": {
    "command": "skill install",
    "method": "POST",
    "path": "/skills/install",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "skill list": {
    "command": "skill list",
    "method": "GET",
    "path": "/skills",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "skill publish": {
    "command": "skill publish",
    "method": "POST",
    "path": "/skills/:id/publish",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "skill render": {
    "command": "skill render",
    "method": "POST",
    "path": "/skills/:id/render",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "skill search": {
    "command": "skill search",
    "method": "GET",
    "path": "/skills/search",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "skill update": {
    "command": "skill update",
    "method": "PATCH",
    "path": "/skills/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "skill update-check": {
    "command": "skill update-check",
    "method": "GET",
    "path": "/skills/:id/update-check",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "table create": {
    "command": "table create",
    "method": "POST",
    "path": "/tables",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "table create-record": {
    "command": "table create-record",
    "method": "POST",
    "path": "/tables/:id/records",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "table delete": {
    "command": "table delete",
    "method": "DELETE",
    "path": "/tables/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "table delete-record": {
    "command": "table delete-record",
    "method": "DELETE",
    "path": "/tables/:id/records/:recordId",
    "pathParams": [
      "id",
      "recordId"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "table export": {
    "command": "table export",
    "method": "GET",
    "path": "/tables/:id/export",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "binary",
    "async": false
  },
  "table get": {
    "command": "table get",
    "method": "GET",
    "path": "/tables/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "table get-record": {
    "command": "table get-record",
    "method": "GET",
    "path": "/tables/:id/records/:recordId",
    "pathParams": [
      "id",
      "recordId"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "table import": {
    "command": "table import",
    "method": "POST",
    "path": "/tables/:id/import",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "table list": {
    "command": "table list",
    "method": "GET",
    "path": "/tables",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "table query": {
    "command": "table query",
    "method": "POST",
    "path": "/tables/:id/query",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "list",
    "async": false
  },
  "table update": {
    "command": "table update",
    "method": "PATCH",
    "path": "/tables/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "table update-record": {
    "command": "table update-record",
    "method": "PATCH",
    "path": "/tables/:id/records/:recordId",
    "pathParams": [
      "id",
      "recordId"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "tasks ancestors": {
    "command": "tasks ancestors",
    "method": "GET",
    "path": "/tasks/tasks/:id/ancestors",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "tasks assign": {
    "command": "tasks assign",
    "method": "POST",
    "path": "/tasks/tasks/:id/assign",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "tasks comment": {
    "command": "tasks comment",
    "method": "POST",
    "path": "/tasks/tasks/:id/comments",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "tasks comment-delete": {
    "command": "tasks comment-delete",
    "method": "DELETE",
    "path": "/tasks/tasks/:id/comments/:commentId",
    "pathParams": [
      "id",
      "commentId"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "tasks comment-list": {
    "command": "tasks comment-list",
    "method": "GET",
    "path": "/tasks/tasks/:id/comments",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "tasks comment-update": {
    "command": "tasks comment-update",
    "method": "PATCH",
    "path": "/tasks/tasks/:id/comments/:commentId",
    "pathParams": [
      "id",
      "commentId"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "tasks create": {
    "command": "tasks create",
    "method": "POST",
    "path": "/tasks/lists/:id/tasks",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "tasks delete": {
    "command": "tasks delete",
    "method": "DELETE",
    "path": "/tasks/tasks/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "tasks depend": {
    "command": "tasks depend",
    "method": "POST",
    "path": "/tasks/tasks/:id/dependencies",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "tasks dependencies": {
    "command": "tasks dependencies",
    "method": "GET",
    "path": "/tasks/tasks/:id/dependencies",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "tasks duplicate": {
    "command": "tasks duplicate",
    "method": "POST",
    "path": "/tasks/tasks/:id/duplicate",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "tasks events": {
    "command": "tasks events",
    "method": "GET",
    "path": "/tasks/tasks/:id/events",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "tasks get": {
    "command": "tasks get",
    "method": "GET",
    "path": "/tasks/tasks/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "tasks import": {
    "command": "tasks import",
    "method": "POST",
    "path": "/tasks/lists/:id/import",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "tasks label-create": {
    "command": "tasks label-create",
    "method": "POST",
    "path": "/tasks/lists/:id/labels",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "tasks label-delete": {
    "command": "tasks label-delete",
    "method": "DELETE",
    "path": "/tasks/lists/:id/labels/:labelId",
    "pathParams": [
      "id",
      "labelId"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "tasks label-list": {
    "command": "tasks label-list",
    "method": "GET",
    "path": "/tasks/lists/:id/labels",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "tasks label-update": {
    "command": "tasks label-update",
    "method": "PATCH",
    "path": "/tasks/lists/:id/labels/:labelId",
    "pathParams": [
      "id",
      "labelId"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "tasks list": {
    "command": "tasks list",
    "method": "GET",
    "path": "/tasks/lists/:id/tasks",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "tasks list-create": {
    "command": "tasks list-create",
    "method": "POST",
    "path": "/tasks/lists",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "tasks list-delete": {
    "command": "tasks list-delete",
    "method": "DELETE",
    "path": "/tasks/lists/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "tasks list-get": {
    "command": "tasks list-get",
    "method": "GET",
    "path": "/tasks/lists/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "tasks list-list": {
    "command": "tasks list-list",
    "method": "GET",
    "path": "/tasks/lists",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "tasks list-update": {
    "command": "tasks list-update",
    "method": "PATCH",
    "path": "/tasks/lists/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "tasks search": {
    "command": "tasks search",
    "method": "GET",
    "path": "/tasks/tasks",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "tasks task-batch-delete": {
    "command": "tasks task-batch-delete",
    "method": "POST",
    "path": "/tasks/lists/:id/tasks/batch-delete",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "tasks task-batch-update": {
    "command": "tasks task-batch-update",
    "method": "POST",
    "path": "/tasks/lists/:id/tasks/batch",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "tasks unassign": {
    "command": "tasks unassign",
    "method": "DELETE",
    "path": "/tasks/tasks/:id/assign",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "tasks undepend": {
    "command": "tasks undepend",
    "method": "DELETE",
    "path": "/tasks/tasks/:id/dependencies",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "tasks update": {
    "command": "tasks update",
    "method": "PATCH",
    "path": "/tasks/tasks/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "team storage": {
    "command": "team storage",
    "method": "GET",
    "path": "/teams/:id/storage",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "team subscription": {
    "command": "team subscription",
    "method": "GET",
    "path": "/teams/:id/subscription",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "team usage": {
    "command": "team usage",
    "method": "GET",
    "path": "/teams/:id/usage",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "video models": {
    "command": "video models",
    "method": "GET",
    "path": "/videos/models",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "video search": {
    "command": "video search",
    "method": "GET",
    "path": "/videos/models/search",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "web fetch": {
    "command": "web fetch",
    "method": "POST",
    "path": "/web/fetch",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "web search": {
    "command": "web search",
    "method": "POST",
    "path": "/web/search",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "workspace add-member": {
    "command": "workspace add-member",
    "method": "POST",
    "path": "/workspaces/:id/members",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "workspace archive": {
    "command": "workspace archive",
    "method": "POST",
    "path": "/workspaces/:id/archive",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "workspace create": {
    "command": "workspace create",
    "method": "POST",
    "path": "/workspaces",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "workspace delete": {
    "command": "workspace delete",
    "method": "DELETE",
    "path": "/workspaces/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "workspace get": {
    "command": "workspace get",
    "method": "GET",
    "path": "/workspaces/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "workspace invitations": {
    "command": "workspace invitations",
    "method": "GET",
    "path": "/workspaces/:id/invitations",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "workspace invite": {
    "command": "workspace invite",
    "method": "POST",
    "path": "/workspaces/:id/invitations",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "workspace list": {
    "command": "workspace list",
    "method": "GET",
    "path": "/workspaces",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "workspace members": {
    "command": "workspace members",
    "method": "GET",
    "path": "/workspaces/:id/members",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "workspace remove-member": {
    "command": "workspace remove-member",
    "method": "DELETE",
    "path": "/workspaces/:id/members/:memberId",
    "pathParams": [
      "id",
      "memberId"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "workspace revoke-invitation": {
    "command": "workspace revoke-invitation",
    "method": "DELETE",
    "path": "/workspaces/:id/invitations",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "deleted",
    "async": false
  },
  "workspace unarchive": {
    "command": "workspace unarchive",
    "method": "POST",
    "path": "/workspaces/:id/unarchive",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "workspace update": {
    "command": "workspace update",
    "method": "PATCH",
    "path": "/workspaces/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "workspace update-member": {
    "command": "workspace update-member",
    "method": "PATCH",
    "path": "/workspaces/:id/members/:memberId",
    "pathParams": [
      "id",
      "memberId"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  }
};

export type V1CommandName =
  | "agent archive"
  | "agent copy-to-workspace"
  | "agent create"
  | "agent delete"
  | "agent get"
  | "agent list"
  | "agent move"
  | "agent permanent-delete"
  | "agent restore"
  | "agent unarchive"
  | "agent update"
  | "ai-gateway providers"
  | "ai-gateway route-preview"
  | "ai-gateway usage"
  | "api-key create"
  | "api-key delete"
  | "api-key list"
  | "api-key rotate"
  | "api-key update"
  | "audio models"
  | "audio search-models"
  | "audio search-voices"
  | "audio voices"
  | "automation archive"
  | "automation cancel-run"
  | "automation cost-stats"
  | "automation cost-stats-all"
  | "automation create"
  | "automation delete"
  | "automation fire"
  | "automation get"
  | "automation list"
  | "automation retry-run"
  | "automation rotate-secret"
  | "automation runs"
  | "automation runs-all"
  | "automation test-fire"
  | "automation unarchive"
  | "automation update"
  | "browser-app create"
  | "browser-app deploy"
  | "browser-app deployments"
  | "browser-app fork"
  | "browser-app get"
  | "browser-app list"
  | "browser-app promote"
  | "browser-app snapshot"
  | "chat archive"
  | "chat compact"
  | "chat copy-to-agent"
  | "chat copy-to-workspace"
  | "chat cost"
  | "chat create"
  | "chat delete"
  | "chat end-goal"
  | "chat export"
  | "chat fork-to-workspace"
  | "chat get"
  | "chat goal"
  | "chat list"
  | "chat message-costs"
  | "chat messages"
  | "chat permanent-delete"
  | "chat reprompt"
  | "chat restore"
  | "chat resume-goal"
  | "chat runs"
  | "chat send"
  | "chat set-goal"
  | "chat stop"
  | "chat stream"
  | "chat unarchive"
  | "chat update"
  | "ci cancel"
  | "ci get"
  | "ci jobs"
  | "ci list"
  | "ci run"
  | "computer activity"
  | "computer add-local-model"
  | "computer allow"
  | "computer create"
  | "computer create-user"
  | "computer delete"
  | "computer delete-user"
  | "computer download"
  | "computer download-to-drive"
  | "computer ephemeral"
  | "computer exec"
  | "computer fs"
  | "computer get"
  | "computer get-user"
  | "computer list"
  | "computer local-inference"
  | "computer local-inference-cancel"
  | "computer local-inference-map"
  | "computer local-inference-operations"
  | "computer local-models"
  | "computer manage"
  | "computer pair"
  | "computer port-close"
  | "computer port-label"
  | "computer port-make-public"
  | "computer port-open"
  | "computer port-revoke-public"
  | "computer ports"
  | "computer remove-local-model"
  | "computer revoke"
  | "computer rotate-credential"
  | "computer run"
  | "computer start"
  | "computer stop"
  | "computer terminal"
  | "computer test-connection"
  | "computer transfer"
  | "computer update"
  | "computer update-allowance"
  | "computer update-user"
  | "computer upload"
  | "computer users"
  | "container backup"
  | "container backups"
  | "container compose-get"
  | "container compose-set"
  | "container compose-up"
  | "container create"
  | "container delete"
  | "container down"
  | "container events"
  | "container exec"
  | "container get"
  | "container list"
  | "container logs"
  | "container migrate"
  | "container port-close"
  | "container port-open"
  | "container ports"
  | "container rebuild"
  | "container restart"
  | "container restore"
  | "container run"
  | "container runtime"
  | "container up"
  | "container update"
  | "credential allow"
  | "credential connect"
  | "credential create"
  | "credential delete"
  | "credential get"
  | "credential list"
  | "credential update"
  | "credential versions"
  | "credential-binding create"
  | "credential-binding list"
  | "custom-models create"
  | "custom-models delete"
  | "custom-models get"
  | "custom-models list"
  | "custom-models update"
  | "drive content-versions"
  | "drive create-folder"
  | "drive delete"
  | "drive get-metadata"
  | "drive glob"
  | "drive grep"
  | "drive list"
  | "drive move"
  | "drive permanent-delete"
  | "drive read"
  | "drive restore"
  | "drive restore-version"
  | "drive signed-url"
  | "drive update"
  | "drive upload"
  | "guide get"
  | "help-center list"
  | "help-center read"
  | "help-center search"
  | "hook create"
  | "hook delete"
  | "hook get"
  | "hook history"
  | "hook list"
  | "hook override"
  | "hook preview"
  | "hook toggle"
  | "hook update"
  | "http request"
  | "image models"
  | "image search"
  | "inference image"
  | "inference speech"
  | "inference speech-stream"
  | "inference text"
  | "inference text-stream"
  | "inference transcribe"
  | "inference video"
  | "mcp call"
  | "mcp info"
  | "mcp prompt"
  | "mcp prompts"
  | "mcp resource"
  | "mcp resources"
  | "mcp tools"
  | "me get"
  | "me limits"
  | "me usage"
  | "memory box-delete"
  | "memory box-get"
  | "memory box-list"
  | "memory box-update"
  | "memory delete"
  | "memory index-read"
  | "memory index-write"
  | "memory list"
  | "memory read"
  | "memory search"
  | "memory write"
  | "models get"
  | "models list"
  | "models search"
  | "notes box-create"
  | "notes box-delete"
  | "notes box-get"
  | "notes box-list"
  | "notes box-update"
  | "notes delete"
  | "notes folder-create"
  | "notes folder-delete"
  | "notes folder-list"
  | "notes folder-move"
  | "notes folder-rename"
  | "notes graph"
  | "notes import"
  | "notes index-read"
  | "notes index-write"
  | "notes links"
  | "notes list"
  | "notes note-move"
  | "notes note-rename"
  | "notes purge"
  | "notes read"
  | "notes restore"
  | "notes search"
  | "notes search-all"
  | "notes tag-list"
  | "notes tag-rename"
  | "notes trash-empty"
  | "notes trash-list"
  | "notes tree"
  | "notes write"
  | "notification config"
  | "notification delete"
  | "notification get"
  | "notification list"
  | "notification preferences"
  | "notification read-all"
  | "notification send"
  | "notification update"
  | "notification update-config"
  | "notification update-preferences"
  | "operation await"
  | "operation cancel"
  | "operation content"
  | "operation get"
  | "operation list"
  | "provider-endpoint create"
  | "provider-endpoint delete"
  | "provider-endpoint list"
  | "provider-endpoint presets"
  | "provider-endpoint test"
  | "provider-endpoint update"
  | "realtime broadcast"
  | "realtime presence"
  | "realtime presence-list"
  | "realtime subscribe"
  | "search query"
  | "service lookup"
  | "service search"
  | "settings get"
  | "settings update"
  | "share create"
  | "share delete"
  | "share list"
  | "share update"
  | "shared-with-me list"
  | "skill body"
  | "skill create"
  | "skill delete"
  | "skill get"
  | "skill list"
  | "skill render"
  | "skill search"
  | "skill update"
  | "tasks ancestors"
  | "tasks assign"
  | "tasks comment"
  | "tasks comment-delete"
  | "tasks comment-list"
  | "tasks comment-update"
  | "tasks create"
  | "tasks delete"
  | "tasks depend"
  | "tasks dependencies"
  | "tasks duplicate"
  | "tasks events"
  | "tasks get"
  | "tasks import"
  | "tasks label-create"
  | "tasks label-delete"
  | "tasks label-list"
  | "tasks label-update"
  | "tasks list"
  | "tasks list-create"
  | "tasks list-delete"
  | "tasks list-get"
  | "tasks list-list"
  | "tasks list-update"
  | "tasks search"
  | "tasks task-batch-delete"
  | "tasks task-batch-update"
  | "tasks unassign"
  | "tasks undepend"
  | "tasks update"
  | "team storage"
  | "team subscription"
  | "team usage"
  | "video models"
  | "video search"
  | "web fetch"
  | "web search"
  | "workspace add-member"
  | "workspace archive"
  | "workspace create"
  | "workspace delete"
  | "workspace get"
  | "workspace invitations"
  | "workspace invite"
  | "workspace list"
  | "workspace members"
  | "workspace remove-member"
  | "workspace revoke-invitation"
  | "workspace unarchive"
  | "workspace update"
  | "workspace update-member";
