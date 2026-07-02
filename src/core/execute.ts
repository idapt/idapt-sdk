

import { IdaptError } from "../errors.js";
import type { CommandBinding } from "../generated/command-bindings.generated.js";
import {
  type HttpContext,
  type HttpRequest,
  request,
  requestRaw,
} from "../http.js";

export interface ExecuteCommandOptions {

  wait?: boolean;
  signal?: AbortSignal;

  pollIntervalMs?: number;

  maxPollAttempts?: number;

  sleep?: (ms: number) => Promise<void>;

  bufferBinary?: boolean;
}

const TERMINAL = new Set(["completed", "failed", "cancelled"]);

const defaultSleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

interface OperationHandle {
  id: string;
  status: string;
  result?: unknown;
  error?: unknown;
}

function isOperationHandle(data: unknown): data is OperationHandle {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as { id?: unknown }).id === "string" &&
    typeof (data as { status?: unknown }).status === "string"
  );
}

function operationErrorMessage(error: unknown): string | undefined {
  if (error && typeof error === "object" && "message" in error) {
    const m = (error as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  return undefined;
}

function bindPath(
  binding: CommandBinding,
  args: Record<string, unknown>,
): { path: string; rest: Record<string, unknown> } {
  let path = binding.path;
  const rest = { ...args };
  for (const param of binding.pathParams) {
    const value = rest[param];
    if (value === undefined || value === null || value === "") {
      throw new IdaptError({
        code: "invalid_request",
        message: `missing required path argument \`${param}\` for \`${binding.command}\``,
      });
    }
    delete rest[param];
    path = path.replace(`:${param}`, encodeURIComponent(String(value)));
  }
  return { path: `/api/v1${path}`, rest };
}

type QueryPrimitive = string | number | boolean | null | undefined;

function buildMultipart(rest: Record<string, unknown>): FormData {
  const form = new FormData();
  for (const [k, v] of Object.entries(rest)) {
    if (v === undefined || v === null) continue;

    if (v instanceof Blob) {
      const filename =
        v instanceof File ? v.name : k === "files" ? "files" : "file";
      form.set(k, v, filename);
    } else if (Array.isArray(v) && v.every((x) => x instanceof Blob)) {
      for (const part of v as Blob[]) {
        const filename = part instanceof File ? part.name : k;
        form.append(k, part, filename);
      }
    } else if (
      typeof v === "string" ||
      typeof v === "number" ||
      typeof v === "boolean"
    ) {
      form.set(k, String(v));
    } else {

      form.set(k, JSON.stringify(v));
    }
  }
  return form;
}

function buildRequest(
  binding: CommandBinding,
  path: string,
  rest: Record<string, unknown>,
  signal: AbortSignal | undefined,
): HttpRequest {
  const base: HttpRequest = { method: binding.method, path, signal };
  switch (binding.argLocation) {
    case "query":
      return { ...base, query: rest as Record<string, QueryPrimitive> };
    case "body":
      return { ...base, body: rest };
    case "multipart":
      return { ...base, bodyRaw: buildMultipart(rest) };
    default:

      return base;
  }
}

export interface SseEvent {
  event: string;
  data: string;
}

async function* parseSse(
  response: Response,
  signal?: AbortSignal,
): AsyncIterable<SseEvent> {
  if (!response.body) return;
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      if (signal?.aborted) return;
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
      while (true) {
        const boundary = buffer.indexOf("\n\n");
        if (boundary === -1) break;
        const block = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        const frame = parseSseBlock(block);
        if (frame) yield frame;
      }
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {

    }
  }
}

function parseSseBlock(block: string): SseEvent | null {
  let event = "message";
  let data = "";
  for (const line of block.split("\n")) {
    if (!line) continue;
    if (line.startsWith("event: ")) event = line.slice(7).trim();
    else if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data: ")) data += line.slice(6);
    else if (line.startsWith("data:")) data += line.slice(5);
  }
  if (!data && event === "message") return null;
  return { event, data };
}

function isSseBinding(binding: CommandBinding): boolean {
  return (
    binding.responseKind === "binary" &&
    !!binding.binaryContentTypes?.some((t) =>
      t.toLowerCase().includes("text/event-stream"),
    )
  );
}

export interface ListResult<T = unknown> {
  data: T[];
  pagination: { has_more: boolean; next_cursor: string | null };
}

export interface DeletedResult {
  deleted: boolean;
  id: string;
}

function unwrap(binding: CommandBinding, json: unknown): unknown {
  switch (binding.responseKind) {
    case "list": {
      const env = json as
        | { data?: unknown[]; pagination?: ListResult["pagination"] }
        | undefined;
      return {
        data: env?.data ?? [],
        pagination: env?.pagination ?? {
          has_more: false,
          next_cursor: null,
        },
      } satisfies ListResult;
    }
    case "deleted":
      return (json ?? { deleted: true, id: "" }) as DeletedResult;
    default: {

      const env = json as { data?: unknown } | undefined;
      return env && "data" in env ? env.data : (json ?? null);
    }
  }
}

export async function executeCommand<T = unknown>(
  binding: CommandBinding,
  args: Record<string, unknown> = {},
  ctx: HttpContext,
  opts: ExecuteCommandOptions = {},
): Promise<T> {
  const { path, rest } = bindPath(binding, args);
  const req = buildRequest(binding, path, rest, opts.signal);

  if (binding.responseKind === "binary") {
    if (isSseBinding(binding) && !opts.bufferBinary) {
      const res = await requestRaw(ctx, { ...req, expectJson: false });
      return parseSse(res, opts.signal) as unknown as T;
    }
    return (await request<Blob>(ctx, { ...req, expectBlob: true })) as T;
  }

  const json = await request<unknown>(ctx, req);
  const data = unwrap(binding, json);

  if (
    binding.async &&
    opts.wait !== false &&
    isOperationHandle(data) &&
    !TERMINAL.has(data.status)
  ) {
    return (await awaitOperation(binding, data.id, ctx, opts)) as T;
  }

  return data as T;
}

export async function awaitOperation<T = unknown>(
  binding: CommandBinding,
  operationId: string,
  ctx: HttpContext,
  opts: ExecuteCommandOptions = {},
): Promise<T> {
  const sleep = opts.sleep ?? defaultSleep;
  const interval = opts.pollIntervalMs ?? 1500;
  const maxAttempts = opts.maxPollAttempts ?? 120;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (opts.signal?.aborted) {
      throw new IdaptError({
        code: "unknown",
        message: `operation wait aborted for \`${binding.command}\``,
      });
    }
    await sleep(interval);
    const json = await request<{ data?: unknown }>(ctx, {
      method: "GET",
      path: `/api/v1/operations/${encodeURIComponent(operationId)}`,
      signal: opts.signal,
    });
    const op = json?.data;
    if (!isOperationHandle(op) || !TERMINAL.has(op.status)) continue;

    if (op.status === "completed") {
      return (op.result ?? null) as T;
    }

    const message =
      operationErrorMessage(op.error) ??
      `operation ${op.status} for \`${binding.command}\``;
    throw new IdaptError({
      code: op.status === "cancelled" ? "unknown" : "server_error",
      message,
      body: op.error,
    });
  }
  throw new IdaptError({
    code: "unknown",
    message: `operation ${operationId} did not finish after ${maxAttempts} polls (use \`wait: false\` and poll \`operation get\`)`,
  });
}
