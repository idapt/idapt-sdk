import { beforeEach, describe, expect, it, vi } from "vitest";
import { FilesApi } from "./files.js";

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

function text(status: number, body: string): Response {
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/plain" },
  });
}

function parseFormData(body: unknown): Record<string, string> {
  if (!(body instanceof FormData)) {
    throw new Error("Expected FormData");
  }
  const out: Record<string, string> = {};
  for (const [k, v] of body.entries()) {
    out[k] = typeof v === "string" ? v : "<blob>";
  }
  return out;
}

describe("FilesApi — CRUD", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: FilesApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new FilesApi(ctx as never);
  });

  it("list() forwards query params (parent_id + cursor; no workspace_id filter)", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: [],
        pagination: { has_more: false, next_cursor: null },
      }),
    );
    await api.list({ parent_id: "pp", limit: 25, cursor: "ck_file" });
    const [url] = ctx.fetch.mock.calls[0];
    const qs = String(url).split("?")[1];
    expect(qs).toContain("parent_id=pp");
    expect(qs).toContain("limit=25");
    expect(qs).toContain("cursor=ck_file");
  });

  it("upload() builds a multipart form with snake_case fields", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, { data: { id: "f-new", name: "x.txt" } }),
    );
    const blob = new Blob(["hello"], { type: "text/plain" });
    await api.upload({
      file: blob,
      name: "x.txt",
      parent_id: "pp",
      workspace_id: "prj",
      skip_if_exists: true,
    });
    const [, init] = ctx.fetch.mock.calls[0];
    expect(init.method).toBe("POST");
    // Multipart field names are snake_case on the v1 wire.
    const fields = parseFormData(init.body);
    expect(fields.name).toBe("x.txt");
    expect(fields.parent_id).toBe("pp");
    expect(fields.workspace_id).toBe("prj");
    expect(fields.skip_if_exists).toBe("true");
    expect(fields.file).toBe("<blob>");
  });

  it("getText() returns raw text", async () => {
    ctx.fetch.mockResolvedValueOnce(text(200, "file body"));
    const res = await api.getText("f1");
    expect(res).toBe("file body");
  });

  it("getBlob() returns a Blob preserving bytes + type", async () => {
    const bytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]); // jpeg SOI
    ctx.fetch.mockResolvedValueOnce(
      new Response(bytes, {
        status: 200,
        headers: { "Content-Type": "image/jpeg" },
      }),
    );
    const blob = await api.getBlob("f1");
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("image/jpeg");
    const arr = new Uint8Array(await blob.arrayBuffer());
    expect(Array.from(arr)).toEqual([0xff, 0xd8, 0xff, 0xe0]);
    const [url] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/drive/files/f1");
  });

  it("patch() PATCHes metadata + content + OCC", async () => {
    ctx.fetch.mockResolvedValueOnce(json(200, { data: { id: "f1" } }));
    await api.patch(
      "f1",
      { name: "new-name.txt", content: "abc" },
      { expectedUpdatedAt: "2026-01-01T00:00:00Z" },
    );
    const [, init] = ctx.fetch.mock.calls[0];
    expect(init.method).toBe("PATCH");
    expect(JSON.parse(init.body as string)).toEqual({
      name: "new-name.txt",
      content: "abc",
      expected_updated_at: "2026-01-01T00:00:00Z",
    });
  });

  it("delete() returns deleted response", async () => {
    ctx.fetch.mockResolvedValueOnce(json(200, { deleted: true, id: "f1" }));
    const res = await api.delete("f1");
    expect(res).toEqual({ deleted: true, id: "f1" });
  });

  it("restore() and permanentDelete() use stable lifecycle routes", async () => {
    ctx.fetch
      .mockResolvedValueOnce(
        json(200, { data: { id: "f1", name: "restored" } }),
      )
      .mockResolvedValueOnce(json(200, { deleted: true, id: "f1" }));

    await expect(api.restore("f1")).resolves.toMatchObject({
      id: "f1",
      name: "restored",
    });
    await expect(api.permanentDelete("f1")).resolves.toEqual({
      deleted: true,
      id: "f1",
    });
    expect(ctx.fetch.mock.calls.map(([url]) => String(url))).toEqual([
      "https://api.example/api/v1/drive/files/f1/restore",
      "https://api.example/api/v1/drive/files/f1/permanent-delete",
    ]);
    expect(ctx.fetch.mock.calls[1][1].method).toBe("DELETE");
  });
});

describe("FilesApi — folders / move / run", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: FilesApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new FilesApi(ctx as never);
  });

  it("createFolder() unwraps the v1 data envelope", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, { data: { id: "fold-1", name: "Docs" } }),
    );
    const res = await api.createFolder({ name: "Docs", workspace_id: "p1" });
    expect(res).toEqual({ id: "fold-1", name: "Docs" });
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/drive/files/folders");
    expect(init.method).toBe("POST");
  });

  it("move() POSTs parent_id (including null to move to root)", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, { data: { id: "f1", parent_id: null } }),
    );
    await api.move("f1", null);
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/drive/files/f1/move");
    expect(JSON.parse(init.body as string)).toEqual({ parent_id: null });
  });

  it("run() POSTs with timeout + env and returns the full ExecutionRun", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(201, {
        data: {
          id: "run-1",
          backend: "lambda",
          status: "completed",
          exit_code: 0,
          stdout: "ok",
          stderr: "",
          runtime: "node",
          created_at: "2026-01-01T00:00:00Z",
          completed_at: "2026-01-01T00:00:01Z",
        },
      }),
    );
    const res = await api.run("f1", {
      timeout_seconds: 20,
      env: { FOO: "bar" },
    });
    expect(res.id).toBe("run-1");
    expect(res.status).toBe("completed");
    expect(res.exit_code).toBe(0);
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/drive/files/f1/run");
    expect(JSON.parse(init.body as string)).toEqual({
      timeout_seconds: 20,
      env: { FOO: "bar" },
    });
  });
});
