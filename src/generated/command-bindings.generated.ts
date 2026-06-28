

export interface CommandBinding {

  command: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";

  path: string;

  pathParams: readonly string[];

  argLocation: "path" | "query" | "body" | "multipart";

  responseKind: "single" | "list" | "created" | "deleted" | "binary";

  async: boolean;

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
  "audio speak": {
    "command": "audio speak",
    "method": "POST",
    "path": "/audio/speech",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": true
  },
  "audio speak-stream": {
    "command": "audio speak-stream",
    "method": "POST",
    "path": "/audio/speech/stream",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "binary",
    "async": false,
    "binaryContentTypes": [
      "text/event-stream"
    ]
  },
  "audio transcribe": {
    "command": "audio transcribe",
    "method": "POST",
    "path": "/audio/transcriptions",
    "pathParams": [],
    "argLocation": "multipart",
    "responseKind": "single",
    "async": true
  },
  "audio transcribe-stream": {
    "command": "audio transcribe-stream",
    "method": "POST",
    "path": "/audio/transcriptions/stream",
    "pathParams": [],
    "argLocation": "multipart",
    "responseKind": "binary",
    "async": false,
    "binaryContentTypes": [
      "text/event-stream"
    ]
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
  "blobs delete": {
    "command": "blobs delete",
    "method": "DELETE",
    "path": "/blobs/:namespace/:key",
    "pathParams": [
      "namespace",
      "key"
    ],
    "argLocation": "body",
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
    "responseKind": "binary",
    "async": false,
    "binaryContentTypes": [
      "application/octet-stream",
      "*/*"
    ]
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
    "async": true
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
    "async": true
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
  "code execute": {
    "command": "code execute",
    "method": "POST",
    "path": "/code-runs",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": true
  },
  "code get": {
    "command": "code get",
    "method": "GET",
    "path": "/code-runs/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "code interrupt": {
    "command": "code interrupt",
    "method": "POST",
    "path": "/code-runs/:id/interrupt",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "code list": {
    "command": "code list",
    "method": "GET",
    "path": "/code-runs",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
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
  "computer app-create": {
    "command": "computer app-create",
    "method": "POST",
    "path": "/computers/:id/apps",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "computer app-delete": {
    "command": "computer app-delete",
    "method": "DELETE",
    "path": "/computers/:id/apps/:app_id",
    "pathParams": [
      "id",
      "app_id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "computer app-exec": {
    "command": "computer app-exec",
    "method": "POST",
    "path": "/computers/:id/apps/:app_id/exec",
    "pathParams": [
      "id",
      "app_id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": true
  },
  "computer app-expose": {
    "command": "computer app-expose",
    "method": "POST",
    "path": "/computers/:id/apps/:app_id/expose",
    "pathParams": [
      "id",
      "app_id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer app-external": {
    "command": "computer app-external",
    "method": "POST",
    "path": "/computers/:id/apps/external",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer app-get": {
    "command": "computer app-get",
    "method": "GET",
    "path": "/computers/:id/apps/:app_id",
    "pathParams": [
      "id",
      "app_id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "computer app-logs": {
    "command": "computer app-logs",
    "method": "GET",
    "path": "/computers/:id/apps/:app_id/logs",
    "pathParams": [
      "id",
      "app_id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "computer app-ports": {
    "command": "computer app-ports",
    "method": "GET",
    "path": "/computers/:id/apps/:app_id/ports",
    "pathParams": [
      "id",
      "app_id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "computer app-reset": {
    "command": "computer app-reset",
    "method": "POST",
    "path": "/computers/:id/apps/:app_id/reset",
    "pathParams": [
      "id",
      "app_id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer app-restart": {
    "command": "computer app-restart",
    "method": "POST",
    "path": "/computers/:id/apps/:app_id/restart",
    "pathParams": [
      "id",
      "app_id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer app-run": {
    "command": "computer app-run",
    "method": "POST",
    "path": "/computers/:id/apps/run",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": true
  },
  "computer app-runtime": {
    "command": "computer app-runtime",
    "method": "GET",
    "path": "/computers/:id/apps/runtime",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "computer app-setup-runtime": {
    "command": "computer app-setup-runtime",
    "method": "POST",
    "path": "/computers/:id/apps/runtime",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer app-start": {
    "command": "computer app-start",
    "method": "POST",
    "path": "/computers/:id/apps/:app_id/start",
    "pathParams": [
      "id",
      "app_id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer app-stop": {
    "command": "computer app-stop",
    "method": "POST",
    "path": "/computers/:id/apps/:app_id/stop",
    "pathParams": [
      "id",
      "app_id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer app-unexpose": {
    "command": "computer app-unexpose",
    "method": "POST",
    "path": "/computers/:id/apps/:app_id/unexpose",
    "pathParams": [
      "id",
      "app_id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer apps": {
    "command": "computer apps",
    "method": "GET",
    "path": "/computers/:id/apps",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "computer archive": {
    "command": "computer archive",
    "method": "POST",
    "path": "/computers/:id/archive",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer compose-up": {
    "command": "computer compose-up",
    "method": "POST",
    "path": "/computers/:id/apps/compose-up",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": true
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
  "computer delete-user-env": {
    "command": "computer delete-user-env",
    "method": "DELETE",
    "path": "/computers/:id/users/:username/env/:name",
    "pathParams": [
      "id",
      "username",
      "name"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "computer download": {
    "command": "computer download",
    "method": "GET",
    "path": "/computers/:id/sftp/download",
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
  "computer exec": {
    "command": "computer exec",
    "method": "POST",
    "path": "/computers/:id/exec",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": true
  },
  "computer expose": {
    "command": "computer expose",
    "method": "POST",
    "path": "/computers/:id/tunnels",
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
  "computer hibernate": {
    "command": "computer hibernate",
    "method": "POST",
    "path": "/computers/:id/hibernate",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer link": {
    "command": "computer link",
    "method": "POST",
    "path": "/computers/:id/workspace-links",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "computer links": {
    "command": "computer links",
    "method": "GET",
    "path": "/computers/:id/workspace-links",
    "pathParams": [
      "id"
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
  "computer set-ports": {
    "command": "computer set-ports",
    "method": "PATCH",
    "path": "/computers/:id/ports",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer set-user-env": {
    "command": "computer set-user-env",
    "method": "POST",
    "path": "/computers/:id/users/:username/env",
    "pathParams": [
      "id",
      "username"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "computer sftp": {
    "command": "computer sftp",
    "method": "POST",
    "path": "/computers/:id/sftp",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
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
  "computer tmux": {
    "command": "computer tmux",
    "method": "POST",
    "path": "/computers/:id/tmux",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer tunnels": {
    "command": "computer tunnels",
    "method": "GET",
    "path": "/computers/:id/tunnels",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "computer unarchive": {
    "command": "computer unarchive",
    "method": "POST",
    "path": "/computers/:id/unarchive",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer unexpose": {
    "command": "computer unexpose",
    "method": "DELETE",
    "path": "/computers/:id/tunnels",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "computer unlink": {
    "command": "computer unlink",
    "method": "DELETE",
    "path": "/computers/:id/workspace-links/:workspace_id",
    "pathParams": [
      "id",
      "workspace_id"
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
    "path": "/computers/:id/sftp/upload",
    "pathParams": [
      "id"
    ],
    "argLocation": "multipart",
    "responseKind": "single",
    "async": false
  },
  "computer user-env": {
    "command": "computer user-env",
    "method": "GET",
    "path": "/computers/:id/users/:username/env",
    "pathParams": [
      "id",
      "username"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "computer user-env-setup": {
    "command": "computer user-env-setup",
    "method": "GET",
    "path": "/computers/:id/users/:username/env/setup",
    "pathParams": [
      "id",
      "username"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "computer user-env-setup-apply": {
    "command": "computer user-env-setup-apply",
    "method": "POST",
    "path": "/computers/:id/users/:username/env/setup",
    "pathParams": [
      "id",
      "username"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "computer user-env-sync": {
    "command": "computer user-env-sync",
    "method": "GET",
    "path": "/computers/:id/users/:username/env/sync",
    "pathParams": [
      "id",
      "username"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "computer user-env-sync-repair": {
    "command": "computer user-env-sync-repair",
    "method": "POST",
    "path": "/computers/:id/users/:username/env/sync",
    "pathParams": [
      "id",
      "username"
    ],
    "argLocation": "body",
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
    "argLocation": "body",
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
  "drive run": {
    "command": "drive run",
    "method": "POST",
    "path": "/drive/files/:id/run",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": true
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
  "guide get": {
    "command": "guide get",
    "method": "GET",
    "path": "/guide",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "single",
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
  "image generate": {
    "command": "image generate",
    "method": "POST",
    "path": "/images/generations",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": true
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
  "me get": {
    "command": "me get",
    "method": "GET",
    "path": "/me",
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
  "memory create": {
    "command": "memory create",
    "method": "POST",
    "path": "/memory",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "memory delete": {
    "command": "memory delete",
    "method": "DELETE",
    "path": "/memory/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "memory get": {
    "command": "memory get",
    "method": "GET",
    "path": "/memory/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "memory index": {
    "command": "memory index",
    "method": "GET",
    "path": "/memory/:id/index",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "memory list": {
    "command": "memory list",
    "method": "GET",
    "path": "/memory",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "memory note-delete": {
    "command": "memory note-delete",
    "method": "DELETE",
    "path": "/memory/:id/note",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "deleted",
    "async": false
  },
  "memory note-list": {
    "command": "memory note-list",
    "method": "GET",
    "path": "/memory/:id/notes",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "memory note-read": {
    "command": "memory note-read",
    "method": "GET",
    "path": "/memory/:id/note",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "memory note-write": {
    "command": "memory note-write",
    "method": "POST",
    "path": "/memory/:id/notes",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "memory search": {
    "command": "memory search",
    "method": "GET",
    "path": "/memory/:id/search",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
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
  "secret create": {
    "command": "secret create",
    "method": "POST",
    "path": "/secrets",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "secret delete": {
    "command": "secret delete",
    "method": "DELETE",
    "path": "/secrets/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "secret get": {
    "command": "secret get",
    "method": "GET",
    "path": "/secrets/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "secret list": {
    "command": "secret list",
    "method": "GET",
    "path": "/secrets",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "secret reveal": {
    "command": "secret reveal",
    "method": "POST",
    "path": "/secrets/:id/reveal",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "secret update": {
    "command": "secret update",
    "method": "PATCH",
    "path": "/secrets/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
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
  "skill attach": {
    "command": "skill attach",
    "method": "POST",
    "path": "/skills/:id/attach",
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
  "skill detach": {
    "command": "skill detach",
    "method": "DELETE",
    "path": "/skills/:id/attach",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
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
  "subscription get": {
    "command": "subscription get",
    "method": "GET",
    "path": "/subscription",
    "pathParams": [],
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
  "trigger archive": {
    "command": "trigger archive",
    "method": "POST",
    "path": "/triggers/:id/archive",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "trigger cost-stats": {
    "command": "trigger cost-stats",
    "method": "GET",
    "path": "/triggers/:id/cost-stats",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "trigger cost-stats-all": {
    "command": "trigger cost-stats-all",
    "method": "GET",
    "path": "/triggers/cost-stats",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "trigger create": {
    "command": "trigger create",
    "method": "POST",
    "path": "/triggers",
    "pathParams": [],
    "argLocation": "body",
    "responseKind": "created",
    "async": false
  },
  "trigger delete": {
    "command": "trigger delete",
    "method": "DELETE",
    "path": "/triggers/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "deleted",
    "async": false
  },
  "trigger fire": {
    "command": "trigger fire",
    "method": "POST",
    "path": "/triggers/:id/fire",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "created",
    "async": true
  },
  "trigger get": {
    "command": "trigger get",
    "method": "GET",
    "path": "/triggers/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "single",
    "async": false
  },
  "trigger list": {
    "command": "trigger list",
    "method": "GET",
    "path": "/triggers",
    "pathParams": [],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "trigger rotate-secret": {
    "command": "trigger rotate-secret",
    "method": "POST",
    "path": "/triggers/:id/rotate-secret",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "trigger runs": {
    "command": "trigger runs",
    "method": "GET",
    "path": "/triggers/:id/runs",
    "pathParams": [
      "id"
    ],
    "argLocation": "query",
    "responseKind": "list",
    "async": false
  },
  "trigger test-fire": {
    "command": "trigger test-fire",
    "method": "POST",
    "path": "/triggers/:id/test-fire",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": true
  },
  "trigger unarchive": {
    "command": "trigger unarchive",
    "method": "POST",
    "path": "/triggers/:id/unarchive",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
    "responseKind": "single",
    "async": false
  },
  "trigger update": {
    "command": "trigger update",
    "method": "PATCH",
    "path": "/triggers/:id",
    "pathParams": [
      "id"
    ],
    "argLocation": "body",
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
  | "ai-gateway usage"
  | "api-key create"
  | "api-key delete"
  | "api-key list"
  | "api-key rotate"
  | "api-key update"
  | "audio models"
  | "audio search-models"
  | "audio search-voices"
  | "audio speak"
  | "audio speak-stream"
  | "audio transcribe"
  | "audio transcribe-stream"
  | "audio voices"
  | "blobs delete"
  | "blobs get"
  | "blobs head"
  | "blobs list"
  | "blobs namespaces"
  | "blobs put"
  | "blobs signed-url"
  | "browser-app create"
  | "browser-app deploy"
  | "browser-app deployments"
  | "browser-app fork"
  | "browser-app get"
  | "browser-app list"
  | "browser-app promote"
  | "browser-app snapshot"
  | "chat archive"
  | "chat copy-to-agent"
  | "chat copy-to-workspace"
  | "chat cost"
  | "chat create"
  | "chat delete"
  | "chat export"
  | "chat fork-to-workspace"
  | "chat get"
  | "chat list"
  | "chat message-costs"
  | "chat messages"
  | "chat permanent-delete"
  | "chat reprompt"
  | "chat restore"
  | "chat runs"
  | "chat send"
  | "chat stop"
  | "chat stream"
  | "chat unarchive"
  | "chat update"
  | "ci cancel"
  | "ci get"
  | "ci jobs"
  | "ci list"
  | "ci run"
  | "code execute"
  | "code get"
  | "code interrupt"
  | "code list"
  | "computer activity"
  | "computer add-local-model"
  | "computer app-create"
  | "computer app-delete"
  | "computer app-exec"
  | "computer app-expose"
  | "computer app-external"
  | "computer app-get"
  | "computer app-logs"
  | "computer app-ports"
  | "computer app-reset"
  | "computer app-restart"
  | "computer app-run"
  | "computer app-runtime"
  | "computer app-setup-runtime"
  | "computer app-start"
  | "computer app-stop"
  | "computer app-unexpose"
  | "computer apps"
  | "computer archive"
  | "computer compose-up"
  | "computer create"
  | "computer create-user"
  | "computer delete"
  | "computer delete-user"
  | "computer delete-user-env"
  | "computer download"
  | "computer exec"
  | "computer expose"
  | "computer get"
  | "computer get-user"
  | "computer hibernate"
  | "computer link"
  | "computer links"
  | "computer list"
  | "computer local-inference"
  | "computer local-models"
  | "computer manage"
  | "computer pair"
  | "computer ports"
  | "computer remove-local-model"
  | "computer set-ports"
  | "computer set-user-env"
  | "computer sftp"
  | "computer start"
  | "computer stop"
  | "computer test-connection"
  | "computer tmux"
  | "computer tunnels"
  | "computer unarchive"
  | "computer unexpose"
  | "computer unlink"
  | "computer update"
  | "computer update-user"
  | "computer upload"
  | "computer user-env"
  | "computer user-env-setup"
  | "computer user-env-setup-apply"
  | "computer user-env-sync"
  | "computer user-env-sync-repair"
  | "computer users"
  | "datastore batch"
  | "datastore delete"
  | "datastore get"
  | "datastore increment"
  | "datastore list"
  | "datastore namespaces"
  | "datastore set"
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
  | "drive run"
  | "drive update"
  | "drive upload"
  | "guide get"
  | "hook create"
  | "hook delete"
  | "hook get"
  | "hook history"
  | "hook list"
  | "hook override"
  | "hook preview"
  | "hook toggle"
  | "hook update"
  | "hub install"
  | "hub search"
  | "hub submissions"
  | "hub submit"
  | "hub update"
  | "hub update-check"
  | "image generate"
  | "image models"
  | "image search"
  | "me get"
  | "me usage"
  | "memory create"
  | "memory delete"
  | "memory get"
  | "memory index"
  | "memory list"
  | "memory note-delete"
  | "memory note-list"
  | "memory note-read"
  | "memory note-write"
  | "memory search"
  | "models list"
  | "models search"
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
  | "operation cancel"
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
  | "repos branches"
  | "repos clone-url"
  | "repos commit"
  | "repos commits"
  | "repos create"
  | "repos delete"
  | "repos get"
  | "repos list"
  | "repos read-file"
  | "repos set-visibility"
  | "search query"
  | "secret create"
  | "secret delete"
  | "secret get"
  | "secret list"
  | "secret reveal"
  | "secret update"
  | "settings get"
  | "settings update"
  | "share create"
  | "share delete"
  | "share list"
  | "share update"
  | "shared-with-me list"
  | "skill apply-update"
  | "skill attach"
  | "skill body"
  | "skill create"
  | "skill delete"
  | "skill detach"
  | "skill file-delete"
  | "skill file-list"
  | "skill file-read"
  | "skill file-write"
  | "skill fork"
  | "skill get"
  | "skill install"
  | "skill list"
  | "skill publish"
  | "skill render"
  | "skill search"
  | "skill update"
  | "skill update-check"
  | "subscription get"
  | "table create"
  | "table create-record"
  | "table delete"
  | "table delete-record"
  | "table export"
  | "table get"
  | "table get-record"
  | "table import"
  | "table list"
  | "table query"
  | "table update"
  | "table update-record"
  | "trigger archive"
  | "trigger cost-stats"
  | "trigger cost-stats-all"
  | "trigger create"
  | "trigger delete"
  | "trigger fire"
  | "trigger get"
  | "trigger list"
  | "trigger rotate-secret"
  | "trigger runs"
  | "trigger test-fire"
  | "trigger unarchive"
  | "trigger update"
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
