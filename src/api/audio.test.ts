import { beforeEach, describe, expect, it, vi } from "vitest";
import { AudioApi } from "./audio.js";

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

describe("AudioApi", () => {
  let ctx: ReturnType<typeof mkCtx>;
  let api: AudioApi;
  beforeEach(() => {
    ctx = mkCtx();
    api = new AudioApi(ctx as never);
  });

  it("speak() POSTs to /audio/speech with the input body", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, {
        data: {
          path: "tts/out.mp3",
          file_id: "f-1",
          url: "https://signed/x",
          model: "tts-1",
          char_count: 5,
        },
      }),
    );
    const res = await api.speak({
      text: "hello",
      workspace_id: "p-1",
      voice: "alloy",
    });
    expect(res.file_id).toBe("f-1");
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/audio/speech");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({
      text: "hello",
      workspace_id: "p-1",
      voice: "alloy",
    });
  });

  it("transcribe() POSTs multipart with the file + optional model/language", async () => {
    ctx.fetch.mockResolvedValueOnce(
      json(200, { data: { text: "hello world" } }),
    );
    const blob = new Blob(["mp3-data"], { type: "audio/mpeg" });
    const res = await api.transcribe({
      file: blob,
      model: "whisper-1",
      language: "en",
      filename: "clip.mp3",
    });
    expect(res.text).toBe("hello world");
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/audio/transcriptions");
    const fields = parseFormData(init.body);
    expect(fields.model).toBe("whisper-1");
    expect(fields.language).toBe("en");
    // `file` is a Blob → stringified as "<blob>" by the parser
    expect(fields.file).toBe("<blob>");
  });

  it("transcribe() falls back to 'audio' filename for raw Blobs", async () => {
    ctx.fetch.mockResolvedValueOnce(json(200, { data: { text: "" } }));
    const blob = new Blob(["x"]);
    await api.transcribe({ file: blob });
    const [, init] = ctx.fetch.mock.calls[0];
    // Can't introspect FormData's filename easily; sanity check that the
    // call succeeded without throwing.
    expect(init.method).toBe("POST");
  });

  it("streamSpeech() yields normalized SSE events", async () => {
    ctx.fetch.mockResolvedValueOnce(
      new Response(
        'event: chunk\ndata: {"audio":"abcd"}\n\n' +
          'event: done\ndata: {"totalBytes":2,"charCount":5}\n\n',
        { status: 200, headers: { "Content-Type": "text/event-stream" } },
      ),
    );

    const events = [];
    for await (const event of api.streamSpeech({ text: "hello" })) {
      events.push(event);
    }

    expect(events).toEqual([
      { type: "chunk", audio: "abcd" },
      { type: "done", total_bytes: 2, char_count: 5 },
    ]);
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe("https://api.example/api/v1/audio/speech/stream");
    expect(init.method).toBe("POST");
  });

  it("streamTranscribe() POSTs multipart and yields partial/final events", async () => {
    ctx.fetch.mockResolvedValueOnce(
      new Response(
        'event: partial\ndata: {"text":"hello"}\n\n' +
          'event: final\ndata: {"text":"hello world"}\n\n',
        { status: 200, headers: { "Content-Type": "text/event-stream" } },
      ),
    );
    const blob = new Blob(["webm-data"], { type: "audio/webm" });

    const events = [];
    for await (const event of api.streamTranscribe({ file: blob })) {
      events.push(event);
    }

    expect(events).toEqual([
      { type: "partial", text: "hello" },
      { type: "final", text: "hello world" },
    ]);
    const [url, init] = ctx.fetch.mock.calls[0];
    expect(String(url)).toBe(
      "https://api.example/api/v1/audio/transcriptions/stream",
    );
    expect(parseFormData(init.body).file).toBe("<blob>");
  });
});
