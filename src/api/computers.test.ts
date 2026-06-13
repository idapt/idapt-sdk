import { beforeEach, describe, expect, it, vi } from "vitest";
import { ComputersApi } from "./computers.js";

function mkCtx() {
  return {
    apiUrl: "https://api.example",
    key: "ap_x",
    fetch: vi.fn(),
  };
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("ComputersApi — CRUD", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: ComputersApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new ComputersApi(ctx as never);
  });

  it("list() requires workspace_id and forwards it + cursor as a query", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [{ id: "m1" }],
        pagination: { has_more: false, next_cursor: null },
      }),
    );
    const res = await api.list({
      workspace_id: "p-1",
      include_archived: true,
      cursor: "ck_computer",
    });
    expect(res).toEqual([{ id: "m1" }]);
    const [url] = ctx.fetch.mock.calls[0];
    expect(String(url)).toContain("/api/v1/computers?");
    expect(String(url)).toContain("workspace_id=p-1");
    expect(String(url)).toContain("include_archived=true");
    expect(String(url)).toContain("cursor=ck_computer");
  });

  it("create() mints a pair token (no token_id in the response)", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, {
        data: {
          token: "tok",
          expires_at: "2026-05-15T00:00:00.000Z",
          install_command: "curl ...",
        },
      }),
    );
    const result = await api.create({
      workspace_id: "p-1",
      intended_name: "box",
    });
    expect(result.token).toBe("tok");
    expect("token_id" in result).toBe(false);
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe(
      "https://api.example/api/v1/computers/pair-tokens",
    );
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toMatchObject({
      workspace_id: "p-1",
      intended_name: "box",
    });
  });

  it("get/update/delete hit the right URLs and methods", async () => {
    ctx.fetch.mockResolvedValueOnce(json(200, { data: { id: "m1" } }));
    await api.get("m1");
    expect(String(ctx.fetch.mock.calls[0][0])).toBe(
      "https://api.example/api/v1/computers/m1",
    );

    ctx.fetch.mockResolvedValueOnce(json(200, { data: { id: "m1" } }));
    await api.update("m1", { name: "renamed" });
    expect(ctx.fetch.mock.calls[1][1].method).toBe("PATCH");
    expect(JSON.parse(ctx.fetch.mock.calls[1][1].body as string)).toEqual({
      name: "renamed",
    });

    ctx.fetch.mockResolvedValueOnce(json(200, { deleted: true, id: "m1" }));
    const res = await api.delete("m1");
    expect(res).toEqual({ deleted: true, id: "m1" });
  });
});

describe("ComputersApi — lifecycle", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: ComputersApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new ComputersApi(ctx as never);
  });

  it("archive/unarchive/start/stop/hibernate are all POSTs returning the computer", async () => {
    for (const verb of [
      "archive",
      "unarchive",
      "start",
      "stop",
      "hibernate",
    ] as const) {
      ctx.fetch.mockResolvedValueOnce(
        json(200, { data: { id: "m1", state: verb } }),
      );
      const res = await api[verb]("m1");
      expect(res).toMatchObject({ id: "m1" });
    }
    const calls = ctx.fetch.mock.calls;
    expect(String(calls[0][0])).toContain("/computers/m1/archive");
    expect(String(calls[1][0])).toContain("/computers/m1/unarchive");
    expect(String(calls[2][0])).toContain("/computers/m1/start");
    expect(String(calls[3][0])).toContain("/computers/m1/stop");
    expect(String(calls[4][0])).toContain("/computers/m1/hibernate");
    expect(calls.every((c) => c[1].method === "POST")).toBe(true);
  });

  it("testConnection() unwraps the success/duration shape with structured serverInfo", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: {
          success: true,
          durationMs: 42,
          serverInfo: { version: "1.4.0", uptime_seconds: 86400 },
          error: null,
        },
      }),
    );
    const res = await api.testConnection("m1");
    expect(res.success).toBe(true);
    expect(res.durationMs).toBe(42);
    expect(res.serverInfo?.version).toBe("1.4.0");
    expect(res.serverInfo?.uptime_seconds).toBe(86400);
  });
});

describe("ComputersApi — exec / tmux", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: ComputersApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new ComputersApi(ctx as never);
  });

  it("exec() POSTs the command and returns the unwrapped result", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: {
          success: true,
          stdout: "hi",
          stderr: "",
          exitCode: 0,
          durationMs: 12,
          timedOut: false,
        },
      }),
    );
    const res = await api.exec("m1", { command: "echo hi" });
    expect(res.success).toBe(true);
    expect(res.stdout).toBe("hi");
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/computers/m1/exec");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({ command: "echo hi" });
  });

  it("listTmuxWindows() unwraps the data.windows array (no pid field)", async () => {
    // tmux windows have no `pid` — a window is not one process.
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: {
          windows: [{ name: "build", active: true }],
        },
      }),
    );
    const wins = await api.listTmuxWindows("m1");
    expect(wins).toEqual([{ name: "build", active: true }]);
    expect(JSON.parse(ctx.fetch.mock.calls[0][1].body as string)).toEqual({
      op: "list",
    });
  });
});

describe("ComputersApi — SFTP", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: ComputersApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new ComputersApi(ctx as never);
  });

  it("sftpList() returns the {path, entries} payload", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: { path: "/", entries: [{ name: "a", type: "file" }] },
      }),
    );
    const res = await api.sftpList("m1", "/");
    expect(res.entries).toHaveLength(1);
    expect(JSON.parse(ctx.fetch.mock.calls[0][1].body as string)).toEqual({
      op: "list",
      path: "/",
    });
  });

  it("sftpUpload() sends multipart with file + path", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, { data: { uploaded: true, path: "/tmp/x" } }),
    );
    await api.sftpUpload("m1", {
      file: new Blob(["hi"], { type: "text/plain" }),
      path: "/tmp/x",
      conflict_mode: "skip",
    });
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toContain("/computers/m1/sftp/upload");
    expect(init.body).toBeInstanceOf(FormData);
    const form = init.body as FormData;
    expect(form.get("path")).toBe("/tmp/x");
    expect(form.get("conflict_mode")).toBe("skip");
    // Content-Type must be left to the runtime so the multipart boundary
    // is generated correctly — the SDK doesn't override it.
    expect(init.headers["Content-Type"]).toBeUndefined();
  });

  it("sftpDownload() requests the file as a Blob with path on the querystring", async () => {
    const blob = new Blob([new Uint8Array([1, 2, 3])], {
      type: "application/octet-stream",
    });
    ctx.fetch.mockResolvedValueOnce(
      new Response(blob, {
        status: 200,
        headers: { "Content-Type": "application/octet-stream" },
      }),
    );
    const out = await api.sftpDownload("m1", "/etc/hostname");
    expect(out).toBeInstanceOf(Blob);
    const [url] = ctx.fetch.mock.calls[0];
    expect(String(url)).toContain("/computers/m1/sftp/download?path=");
    expect(String(url)).toContain(encodeURIComponent("/etc/hostname"));
  });
});

describe("ComputersApi — firewall + ports", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: ComputersApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new ComputersApi(ctx as never);
  });

  it("addFirewallRule() POSTs the body", async () => {
    ctx.fetch.mockResolvedValueOnce(json(200, { data: { rules: [] } }));
    await api.addFirewallRule("m1", { port: 22, protocol: "tcp" });
    expect(ctx.fetch.mock.calls[0][1].method).toBe("POST");
    expect(JSON.parse(ctx.fetch.mock.calls[0][1].body as string)).toEqual({
      port: 22,
      protocol: "tcp",
    });
  });

  it("removeFirewallRule() encodes port + default protocol on the querystring", async () => {
    ctx.fetch.mockResolvedValueOnce(json(200, { data: { rules: [] } }));
    await api.removeFirewallRule("m1", { port: 80 });
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(init.method).toBe("DELETE");
    expect(String(url)).toContain("port=80");
    expect(String(url)).toContain("protocol=tcp");
  });

  it("listPorts(refresh=true) forwards the flag", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: { ports: [], discoveryStatus: "ok", discoveryError: null },
      }),
    );
    await api.listPorts("m1", { refresh: true });
    expect(String(ctx.fetch.mock.calls[0][0])).toContain("refresh=true");
  });
});

describe("ComputersApi — users + env", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: ComputersApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new ComputersApi(ctx as never);
  });

  it("listUsers / createUser / deleteUser hit the right paths", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [],
        pagination: { has_more: false, next_cursor: null },
      }),
    );
    await api.listUsers("m1");
    expect(String(ctx.fetch.mock.calls[0][0])).toContain("/computers/m1/users");

    // createUser returns the user fields directly under `data` (no wrapper).
    ctx.fetch.mockResolvedValueOnce(
      json(201, { data: { username: "alice", groups: ["sudo"] } }),
    );
    const created = await api.createUser("m1", {
      username: "alice",
      groups: ["sudo"],
    });
    expect(created.username).toBe("alice");
    expect(ctx.fetch.mock.calls[1][1].method).toBe("POST");

    ctx.fetch.mockResolvedValueOnce(json(200, { deleted: true, id: "alice" }));
    await api.deleteUser("m1", "alice");
    expect(String(ctx.fetch.mock.calls[2][0])).toContain(
      "/computers/m1/users/alice",
    );
    expect(ctx.fetch.mock.calls[2][1].method).toBe("DELETE");
  });

  it("updateUser returns the user fields directly under data", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, { data: { username: "alice", groups: ["sudo", "docker"] } }),
    );
    const updated = await api.updateUser("m1", "alice", {
      groups: ["sudo", "docker"],
    });
    expect(updated.username).toBe("alice");
    expect(updated.groups).toEqual(["sudo", "docker"]);
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toContain("/computers/m1/users/alice");
    expect(init.method).toBe("PATCH");
  });

  it("createUserEnvVar() can bind an existing credential file", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, {
        data: {
          name: "OPENAI_API_KEY",
          username: "alice",
          file_id: "fil_1",
          created_at: "2026-01-01T00:00:00Z",
        },
      }),
    );
    const binding = await api.createUserEnvVar("m1", "alice", {
      file_id: "fil_1",
    });
    // A binding is keyed by its env-var `name`; the value comes from `file_id`.
    expect(binding.name).toBe("OPENAI_API_KEY");
    expect(binding.file_id).toBe("fil_1");
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toContain("/computers/m1/users/alice/env");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({
      file_id: "fil_1",
    });
  });

  it("createUserEnvVar() can create an inline credential", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, {
        data: {
          name: "DATABASE_URL",
          username: "alice",
          file_id: "fil_generated",
          created_at: "2026-01-01T00:00:00Z",
        },
      }),
    );
    const binding = await api.createUserEnvVar("m1", "alice", {
      name: "DATABASE_URL",
      value: "postgres://example",
    });
    expect(binding.name).toBe("DATABASE_URL");
    expect(JSON.parse(ctx.fetch.mock.calls[0][1].body as string)).toEqual({
      name: "DATABASE_URL",
      value: "postgres://example",
    });
  });

  it("deleteUserEnvVar() addresses the binding by env-var name", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, { deleted: true, id: "OPENAI_API_KEY" }),
    );
    await api.deleteUserEnvVar("m1", "alice", "OPENAI_API_KEY");
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toContain(
      "/computers/m1/users/alice/env/OPENAI_API_KEY",
    );
    expect(init.method).toBe("DELETE");
  });

  it("listUsers() unwraps the v1 list envelope; listUsersWithMeta() exposes access flags", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [{ username: "alice" }, { username: "root" }],
        pagination: { has_more: false, next_cursor: null },
        current_user: "alice",
        has_root_access: false,
        has_sudo_access: true,
      }),
    );
    const users = await api.listUsers("m1");
    expect(users).toEqual([{ username: "alice" }, { username: "root" }]);

    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [{ username: "alice" }],
        pagination: { has_more: false, next_cursor: null },
        current_user: "alice",
        has_root_access: false,
        has_sudo_access: true,
      }),
    );
    const meta = await api.listUsersWithMeta("m1");
    expect(meta.current_user).toBe("alice");
    expect(meta.has_sudo_access).toBe(true);
    expect(meta.has_root_access).toBe(false);
  });

  it("getUser() fetches a single Unix user by username", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, { data: { username: "alice", uid: 1001 } }),
    );
    const user = await api.getUser("m1", "alice");
    expect(user.username).toBe("alice");
    const [url] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe(
      "https://api.example/api/v1/computers/m1/users/alice",
    );
  });
});

describe("ComputersApi — pair", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: ComputersApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new ComputersApi(ctx as never);
  });

  it("pair() swaps the bearer to the one-time token, sends snake_case, unwraps data", async () => {
    // The pair route now uses the standard `{data:{…}}` envelope and a
    // snake_case request body; `computer_id` is a resourceId.
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: {
          computer_id: "mch_new",
          computer_token: "mk_x",
          domain: "us-east-1",
        },
      }),
    );
    const res = await api.pair({
      token: "pair_x",
      hostname: "box",
      os: "linux",
      arch: "amd64",
      cli_version: "1.0.0",
      default_user: "ubuntu",
      host_kind: "server",
      kernel_version: "6.1.0",
    });
    expect(res).toEqual({
      computer_id: "mch_new",
      computer_token: "mk_x",
      domain: "us-east-1",
    });
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/computers/pair");
    expect(init.headers.Authorization).toBe("Bearer pair_x");
    const body = JSON.parse(init.body as string);
    expect(body.cli_version).toBe("1.0.0");
    expect(body.default_user).toBe("ubuntu");
    expect(body.host_kind).toBe("server");
    expect(body.kernel_version).toBe("6.1.0");
  });
});
