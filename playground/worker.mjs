const maxBodyBytes = 16 * 1024;
const encoder = new TextEncoder();
const instructions = [
  "You are Uno's text-only playground. Show what you would check before acting.",
  "Identify the requested change, what can be reused, what should be preserved, and any missing source or explicit budget.",
  "Return a concise preflight or, for Prompt only, one concise prompt. Respect the user's requested limits.",
  "Never claim you inspected, edited, or generated any asset. No files, tools, or media generation are available.",
].join(" ");

async function readPrompt(request) {
  const reader = request.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder();
  let size = 0;
  let json = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBodyBytes) {
      await reader.cancel();
      return null;
    }
    json += decoder.decode(value, { stream: true });
  }
  const data = JSON.parse(json + decoder.decode());
  return typeof data?.prompt === "string" ? data.prompt.trim() : "";
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    if (origin !== env.SITE_ORIGIN) {
      return Response.json({ error: "This origin is not allowed." }, { status: 403 });
    }

    const headers = {
      "Access-Control-Allow-Origin": origin,
      "Cache-Control": "no-store",
      "Vary": "Origin",
    };
    const reply = (status, body) => Response.json(body, { status, headers });
    if (new URL(request.url).pathname !== "/preview") {
      return reply(404, { error: "Endpoint not found." });
    }
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          ...headers,
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Authorization, Content-Type",
        },
      });
    }
    if (request.method !== "POST") return reply(405, { error: "Use POST." });
    if (!env.OPENAI_API_KEY || !env.OPENAI_MODEL || !env.BETA_ACCESS_CODE || !env.PREVIEW_LIMITER) {
      return reply(503, { error: "The beta is not configured." });
    }

    const auth = encoder.encode(request.headers.get("Authorization") ?? "");
    const expected = encoder.encode(`Bearer ${env.BETA_ACCESS_CODE}`);
    if (auth.length !== expected.length || !crypto.subtle.timingSafeEqual(auth, expected)) {
      return reply(401, { error: "Check your beta access code." });
    }

    let prompt;
    try {
      prompt = await readPrompt(request);
    } catch {
      return reply(400, { error: "Enter a valid prompt." });
    }
    if (prompt === null) return reply(413, { error: "The prompt is too long." });
    if (!prompt) return reply(400, { error: "Enter a prompt first." });

    try {
      const { success } = await env.PREVIEW_LIMITER.limit({ key: "uno-beta" });
      if (!success) return reply(429, { error: "The beta is busy. Try again in a minute." });

      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: env.OPENAI_MODEL,
          instructions,
          input: prompt,
          max_output_tokens: 400,
          store: false,
        }),
        signal: AbortSignal.timeout(20_000),
      });
      if (!response.ok) return reply(502, { error: "The AI preview is temporarily unavailable." });
      const result = await response.json();
      const text = result.output
        ?.filter(item => item.type === "message")
        .flatMap(item => item.content ?? [])
        .filter(item => item.type === "output_text")
        .map(item => item.text)
        .join("\n")
        .trim();
      if (!text) return reply(502, { error: "The AI preview returned no text." });
      return reply(200, { text });
    } catch {
      return reply(502, { error: "The AI preview is temporarily unavailable." });
    }
  },
};
