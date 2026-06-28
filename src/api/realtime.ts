

import { type HttpContext, request, requestRaw } from "../http.js";
import type { CallOptions, ListEnvelope, SingleEnvelope } from "../types.js";

export interface PresenceEntry {
  principal_id: string;
  meta: Record<string, unknown>;
  last_seen: number;
}

export interface PresenceHeartbeatOptions extends CallOptions {

  meta?: Record<string, unknown>;

  ttlSeconds?: number;
}

export interface RealtimeEvent {

  channel: string;

  type: string;

  data: unknown;

  id?: string;
}

export interface SubscribeOptions {

  onError?: (err: Error) => void;

  lastEventId?: string;

  signal?: AbortSignal;
}

export interface ChannelHandle {

  readonly key: string;

  subscribe(
    onEvent: (event: RealtimeEvent) => void,
    opts?: SubscribeOptions,
  ): () => void;

  broadcast(message: unknown, opts?: CallOptions): Promise<{ ok: boolean }>;

  presence(opts?: CallOptions): Promise<PresenceEntry[]>;

  heartbeat(opts?: PresenceHeartbeatOptions): Promise<{ ok: boolean }>;
}

const enc = encodeURIComponent;

const RECONNECT_MIN_MS = 1_000;
const RECONNECT_MAX_MS = 30_000;

export class RealtimeApi {
  constructor(private readonly ctx: HttpContext) {}

  async broadcast(
    channel: string,
    message: unknown,
    opts: CallOptions = {},
  ): Promise<{ ok: boolean }> {
    const res = await request<SingleEnvelope<{ ok: boolean }>>(this.ctx, {
      method: "POST",
      path: `/api/v1/realtime/${enc(channel)}/broadcast`,
      body: { message },
      signal: opts.signal,
    });
    return res.data;
  }

  async heartbeat(
    channel: string,
    opts: PresenceHeartbeatOptions = {},
  ): Promise<{ ok: boolean }> {
    const res = await request<SingleEnvelope<{ ok: boolean }>>(this.ctx, {
      method: "POST",
      path: `/api/v1/realtime/${enc(channel)}/presence`,
      body: { meta: opts.meta, ttl_seconds: opts.ttlSeconds },
      signal: opts.signal,
    });
    return res.data;
  }

  async presence(
    channel: string,
    opts: CallOptions = {},
  ): Promise<PresenceEntry[]> {
    const res = await request<ListEnvelope<PresenceEntry>>(this.ctx, {
      method: "GET",
      path: `/api/v1/realtime/${enc(channel)}/presence`,
      signal: opts.signal,
    });
    return res.data;
  }

  subscribe(
    channels: string[],
    onEvent: (event: RealtimeEvent) => void,
    opts: SubscribeOptions = {},
  ): () => void {
    if (channels.length === 0) {
      throw new Error("realtime.subscribe requires at least one channel");
    }

    const controller = new AbortController();

    if (opts.signal) {
      if (opts.signal.aborted) controller.abort();
      else opts.signal.addEventListener("abort", () => controller.abort());
    }

    let lastEventId = opts.lastEventId;
    let backoff = RECONNECT_MIN_MS;
    let closed = false;

    const run = async () => {
      while (!closed && !controller.signal.aborted) {
        try {
          const headers: Record<string, string> = {};
          if (lastEventId) headers["Last-Event-ID"] = lastEventId;
          const res = await requestRaw(this.ctx, {
            method: "GET",
            path: "/api/v1/realtime/subscribe",
            query: { channels: channels.join(",") },
            headers,
            signal: controller.signal,
            expectJson: false,
          });
          backoff = RECONNECT_MIN_MS;
          for await (const frame of parseSseStream(res, controller.signal)) {
            if (frame.id) lastEventId = frame.id;
            const event = toRealtimeEvent(frame);
            if (event) onEvent(event);
          }
        } catch (err) {
          if (controller.signal.aborted || closed) return;
          opts.onError?.(err instanceof Error ? err : new Error(String(err)));
        }
        if (closed || controller.signal.aborted) return;
        await delay(backoff, controller.signal);
        backoff = Math.min(backoff * 2, RECONNECT_MAX_MS);
      }
    };

    void run();

    return () => {
      closed = true;
      controller.abort();
    };
  }

  channel(key: string): ChannelHandle {
    return {
      key,
      subscribe: (onEvent, o) => this.subscribe([key], onEvent, o),
      broadcast: (message, o) => this.broadcast(key, message, o),
      presence: (o) => this.presence(key, o),
      heartbeat: (o) => this.heartbeat(key, o),
    };
  }
}

interface RawSseFrame {
  id?: string;
  data: string;
}

async function* parseSseStream(
  response: Response,
  signal?: AbortSignal,
): AsyncIterable<RawSseFrame> {
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
        const parsed = parseSseBlock(block);
        if (parsed) yield parsed;
      }
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {

    }
  }
}

function parseSseBlock(block: string): RawSseFrame | null {
  let id: string | undefined;
  let data = "";
  let isHeartbeat = false;
  for (const line of block.split("\n")) {
    if (!line || line.startsWith(":")) continue;
    if (line.startsWith("id:")) id = line.slice(3).trim();
    else if (line.startsWith("event:")) {
      if (line.slice(6).trim() === "heartbeat") isHeartbeat = true;
    } else if (line.startsWith("data:")) data += line.slice(5).trimStart();
  }

  if (isHeartbeat) return null;
  if (!data) return null;
  return id ? { id, data } : { data };
}

function toRealtimeEvent(frame: RawSseFrame): RealtimeEvent | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(frame.data);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const env = parsed as { channel?: unknown; message?: unknown };
  if (typeof env.channel !== "string") return null;
  const channel = env.channel;

  if (channel === "rt:bcast") {
    const inner = env.message as { channel?: unknown; message?: unknown };
    if (
      inner &&
      typeof inner === "object" &&
      typeof inner.channel === "string"
    ) {
      return { channel: inner.channel, type: "broadcast", data: inner.message };
    }
    return null;
  }

  if (channel === "events") {
    const inner = env.message as {
      channel?: unknown;
      message?: { type?: unknown };
    };
    const sigChannel =
      inner && typeof inner.channel === "string" ? inner.channel : channel;
    const type =
      inner?.message && typeof inner.message.type === "string"
        ? inner.message.type
        : "signal";
    return { channel: sigChannel, type, data: null };
  }

  const msg = env.message as { type?: unknown; data?: unknown };
  if (msg && typeof msg === "object") {
    return {
      channel,
      type: typeof msg.type === "string" ? msg.type : "change",
      data: msg.data ?? null,
      ...(frame.id ? { id: frame.id } : {}),
    };
  }
  return null;
}

function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const t = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(t);
        resolve();
      },
      { once: true },
    );
  });
}
