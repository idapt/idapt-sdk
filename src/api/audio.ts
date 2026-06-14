/**
 * AudioApi — `/api/v1/audio/*`.
 *
 * Two endpoints:
 *   - `POST /audio/speech`         → text-to-speech, writes a file ref.
 *                                    Responds HTTP 201 (resource created).
 *   - `POST /audio/transcriptions` → multipart upload, returns `{ text }`
 *
 * Transcription accepts any Blob/File you already have in memory (e.g.,
 * from a MediaRecorder session). Speech writes into the caller's workspace.
 */

import { type HttpContext, request, requestRaw } from "../http.js";
import type {
  CallOptions,
  SingleEnvelope,
  SpeechResult,
  SpeechStreamEvent,
  TranscriptionResult,
  TranscriptionStreamEvent,
} from "../types.js";

export interface SpeakInput {
  text: string;
  workspace_id: string;
  model?: string;
  voice?: string;
  speed?: number;
  pitch?: number;
  emotion?: string;
  output_path?: string;
}

export interface TranscribeInput {
  file: Blob | File;
  model?: string;
  language?: string;
  /** Override the filename attached to the multipart upload. */
  filename?: string;
}

export interface SpeakStreamInput {
  text: string;
  model?: string;
  voice?: string;
  speed?: number;
}

export class AudioApi {
  constructor(private readonly ctx: HttpContext) {}

  /** Text-to-speech. Responds HTTP 201 with the written file ref under `data`. */
  async speak(
    input: SpeakInput,
    opts: CallOptions = {},
  ): Promise<SpeechResult> {
    const res = await request<SingleEnvelope<SpeechResult>>(this.ctx, {
      method: "POST",
      path: "/api/v1/audio/speech",
      body: input,
      signal: opts.signal,
    });
    return res.data;
  }

  async transcribe(
    input: TranscribeInput,
    opts: CallOptions = {},
  ): Promise<TranscriptionResult> {
    const form = new FormData();
    const filename =
      input.filename ??
      (input.file instanceof File ? input.file.name : "audio");
    form.set("file", input.file, filename);
    if (input.model) form.set("model", input.model);
    if (input.language) form.set("language", input.language);

    const res = await request<SingleEnvelope<TranscriptionResult>>(this.ctx, {
      method: "POST",
      path: "/api/v1/audio/transcriptions",
      bodyRaw: form,
      signal: opts.signal,
    });
    return res.data;
  }

  async *streamSpeech(
    input: SpeakStreamInput,
    opts: CallOptions = {},
  ): AsyncIterable<SpeechStreamEvent> {
    const res = await requestRaw(this.ctx, {
      method: "POST",
      path: "/api/v1/audio/speech/stream",
      body: input,
      signal: opts.signal,
      expectJson: false,
    });
    yield* parseSpeechStream(res, opts.signal);
  }

  async *streamTranscribe(
    input: TranscribeInput,
    opts: CallOptions = {},
  ): AsyncIterable<TranscriptionStreamEvent> {
    const form = new FormData();
    const filename =
      input.filename ??
      (input.file instanceof File ? input.file.name : "audio");
    form.set("file", input.file, filename);
    if (input.model) form.set("model", input.model);
    if (input.language) form.set("language", input.language);

    const res = await requestRaw(this.ctx, {
      method: "POST",
      path: "/api/v1/audio/transcriptions/stream",
      bodyRaw: form,
      signal: opts.signal,
      expectJson: false,
    });
    yield* parseTranscriptionStream(res, opts.signal);
  }
}

interface SseFrame {
  event: string;
  data: string;
}

async function* parseSpeechStream(
  response: Response,
  signal?: AbortSignal,
): AsyncIterable<SpeechStreamEvent> {
  for await (const frame of parseSse(response, signal)) {
    const payload = safeJson(frame.data) as Record<string, unknown> | null;
    if (frame.event === "chunk") {
      const audio = payload?.audio;
      if (typeof audio === "string") yield { type: "chunk", audio };
    } else if (frame.event === "done") {
      const event: SpeechStreamEvent = { type: "done" };
      const totalBytes = numberOrUndefined(payload?.totalBytes);
      const durationMs = numberOrUndefined(payload?.durationMs);
      const charCount = numberOrUndefined(payload?.charCount);
      if (totalBytes !== undefined) event.total_bytes = totalBytes;
      if (durationMs !== undefined) event.duration_ms = durationMs;
      if (charCount !== undefined) event.char_count = charCount;
      if (typeof payload?.cached === "boolean") event.cached = payload.cached;
      yield event;
    } else if (frame.event === "error") {
      yield errorEvent(payload);
    }
  }
}

async function* parseTranscriptionStream(
  response: Response,
  signal?: AbortSignal,
): AsyncIterable<TranscriptionStreamEvent> {
  for await (const frame of parseSse(response, signal)) {
    const payload = safeJson(frame.data) as Record<string, unknown> | null;
    if (frame.event === "partial") {
      const text = payload?.text;
      if (typeof text === "string") yield { type: "partial", text };
    } else if (frame.event === "final") {
      const text = payload?.text;
      if (typeof text === "string") yield { type: "final", text };
    } else if (frame.event === "error") {
      yield errorEvent(payload);
    }
  }
}

async function* parseSse(
  response: Response,
  signal?: AbortSignal,
): AsyncIterable<SseFrame> {
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
      /* ignore */
    }
  }
}

function parseSseBlock(block: string): SseFrame | null {
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

function safeJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function numberOrUndefined(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function errorEvent(payload: Record<string, unknown> | null): {
  type: "error";
  status?: number;
  retry_after?: number;
} {
  const event: { type: "error"; status?: number; retry_after?: number } = {
    type: "error",
  };
  const status = numberOrUndefined(payload?.status);
  const retryAfter = numberOrUndefined(payload?.retryAfter);
  if (status !== undefined) event.status = status;
  if (retryAfter !== undefined) event.retry_after = retryAfter;
  return event;
}
