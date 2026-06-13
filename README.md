# @idapt/sdk

Typed JavaScript / TypeScript client for the [idapt](https://idapt.ai) v1
public API. Same surface as the [`idapt` CLI](https://idapt.ai/cli) —
workspaces, agents, chats, files, computers, triggers, code runs, sharing,
hub, plus account / billing / notifications — wrapped behind one
`IdaptClient` object.

```bash
npm install @idapt/sdk
```

## Quick start

```ts
import { connect } from "@idapt/sdk";

const client = await connect({ apiUrl: "https://idapt.ai" });

const me = await client.user.me();
const workspaces = await client.workspaces.list();
const chat = await client.chats.create({
  title: "Hello from the SDK",
  workspace_id: workspaces[0]!.id,
});

await client.chats.sendMessage(chat.id, {
  content: "What's the weather in Paris?",
});
```

> The SDK works in both **browser** and **Node / serverless** runtimes.
> Pass `fetch` explicitly when running somewhere `globalThis.fetch`
> isn't available.

## Auth

Two auth modes are supported, picked automatically by `connect`:

1. **Browser-apps** — your code runs on a `*.a.idapt.app` subdomain. The
   SDK reads a server-planted `__Secure-idapt_app_key` cookie and you
   never see the key directly. Permission escalation is via
   `client.escalate(...)`.
2. **Server / scripts** — pass an explicit API key. Mint one in the
   idapt UI (Settings → API keys) or with the CLI
   (`idapt api-key create`).

```ts
const client = new IdaptClient({
  credential: { key: "uk_...", apiUrl: "https://idapt.ai", appFolderId: "", dataFolderId: "" },
  browserAppDomain: "",
});
```

## Capabilities

Every `/api/v1/*` user-facing route has a typed method on
`IdaptClient`. Highlights:

| Surface | Examples |
|---|---|
| **Workspaces** | `workspaces.create / list / archive / unarchive / addMember / listInvitations / createInvitation` |
| **Agents** | `agents.create / list / get / update / delete / archive / restore / move / copyToWorkspace` |
| **Chats** | `chats.create / sendMessage / repromptMessage / listMessages / cost / archive / export` |
| **Files** | `files.upload / patch / move / run / getText / getBlob` + sandboxed `client.app` / `client.data` |
| **Computers** | `computers.exec / tmux / sftp{,Upload,Download} / lifecycle / firewall / ports / users / env / pair` |
| **Triggers** | `triggers.create / fire (webhook-secret) / rotateSecret / listRuns` |
| **Code runs** | `code.run / get / list / interrupt` |
| **Notifications** | `notifications.list / send / readAll / getConfig / updatePreferences` |
| **Secrets** | `secrets.list(workspaceId) / create / update / delete` |
| **Sharing** | `sharing.add / list / remove` + `listSharedWithMe` |
| **API keys** | `apiKeys.create / list / update / delete` (UI / JWT only — keys can't mint sibling keys) |
| **Settings** | `settings.get / update` |
| **Subscription** | `subscription.get` |
| **Store / Hub** | `store.search / install` |
| **Provider endpoints** | `providerEndpoints.list / presets / create / update / test / delete` |
| **Audio / Images / Models / Search / Web** | `audio.speak / transcribe`, `images.generate`, `models.list`, `search.search`, `web.search` |

Run `idapt help` for the same set on the CLI side.

## Response shape

Lists return arrays directly, single resources return the value
directly. The v1 envelope (`{ data: ... }`) is unwrapped at the SDK
boundary:

```ts
const chats = await client.chats.list();      // Chat[]
const chat  = await client.chats.get("…");    // Chat
await client.chats.delete("…");               // { deleted: true, id }
```

Errors throw a typed `IdaptError` subclass (`UnauthorizedError`,
`NotFoundError`, `RateLimitError`, …) so you can catch the kinds you
care about:

```ts
import { NotFoundError } from "@idapt/sdk";

try {
  await client.chats.get("missing");
} catch (err) {
  if (err instanceof NotFoundError) console.log("gone");
  else throw err;
}
```

## Cancellation

Every method accepts a final `{ signal }` option that's plumbed through
to `fetch`:

```ts
const ac = new AbortController();
setTimeout(() => ac.abort(), 5_000);
const msgs = await client.chats.listMessages("c1", {}, { signal: ac.signal });
```

## React helper

A tiny React wrapper is published alongside as
`@idapt/sdk/react` — see the [main docs](https://idapt.ai/developers).

## Versioning

The SDK targets v1 of the idapt public API. v1 is a stable contract —
breaking changes ship at `/api/v2/` and as a new major of this package.

Releases follow [SemVer](https://semver.org/):

- **major** — incompatible breaking change to the SDK surface or the
  underlying v1 API.
- **minor** — backwards-compatible new feature (new method, new
  argument, new exported type).
- **patch** — bug fix, dependency bump, doc-only change.

The exact version a build was published from is also baked into the
runtime:

```ts
import { VERSION } from "@idapt/sdk";
console.log(VERSION); // "1.4.2"
```

## License

UNLICENSED — see the source repo at
<https://gitlab.com/DrachirMaximus/idapt>.
