// Claude API helper for Supabase Edge Functions (Deno).
// Wraps Anthropic's Messages API with prompt caching enabled by default.
//
// Why caching matters for SacredWorld:
//   - System prompt defining the AI protagonist personality is reused across
//     every user turn. Without caching, you re-pay for the full prompt every call.
//   - Cache write: 1.25x base input price. Cache read: 0.1x. Break-even at ~3 hits.
//   - 5min TTL by default (refreshed on each hit). 1hr TTL available at 2x write cost.
//   - Sonnet minimum cacheable length: 1,024 tokens. Below that, caching is a no-op.
//
// Usage:
//   const claude = createClaudeClient();
//   const result = await claude.chat({
//     system: AI_PROTAGONIST_SYSTEM_PROMPT,
//     messages: [{ role: "user", content: "..." }],
//   });

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-sonnet-4-6";
const DEFAULT_MAX_TOKENS = 1024;

type Role = "user" | "assistant";

export interface ClaudeMessage {
  role: Role;
  content: string;
}

export interface ChatOptions {
  system: string;
  messages: ClaudeMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
  cacheTTL?: "5m" | "1h";
}

export interface ChatResult {
  text: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    cacheCreationTokens: number;
    cacheReadTokens: number;
  };
  raw: unknown;
}

export function createClaudeClient(apiKey?: string) {
  const key = apiKey ?? Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) throw new Error("ANTHROPIC_API_KEY missing");

  return {
    async chat(opts: ChatOptions): Promise<ChatResult> {
      const cacheControl =
        opts.cacheTTL === "1h"
          ? { type: "ephemeral", ttl: "1h" }
          : { type: "ephemeral" };

      const body = {
        model: opts.model ?? DEFAULT_MODEL,
        max_tokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
        temperature: opts.temperature ?? 1,
        // System prompt as a content block with explicit cache_control —
        // this is the single most valuable thing to cache: same prefix, every turn.
        system: [
          {
            type: "text",
            text: opts.system,
            cache_control: cacheControl,
          },
        ],
        messages: opts.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      };

      const res = await fetch(ANTHROPIC_API, {
        method: "POST",
        headers: {
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Claude API ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const text = data.content?.[0]?.text ?? "";
      const u = data.usage ?? {};

      return {
        text,
        usage: {
          inputTokens: u.input_tokens ?? 0,
          outputTokens: u.output_tokens ?? 0,
          cacheCreationTokens: u.cache_creation_input_tokens ?? 0,
          cacheReadTokens: u.cache_read_input_tokens ?? 0,
        },
        raw: data,
      };
    },
  };
}

// =========================================================================
// TODO (Yann): Define the AI protagonist system prompt below.
//
// This is the most important decision for prompt caching effectiveness AND
// for the AI-as-protagonist identity — it's what makes the AI feel like a
// consistent character across every interaction.
//
// Constraints to consider:
//   1. MIN 1,024 tokens for caching to activate (Sonnet). Aim for ~2k+ to
//      make the cache hit clearly worthwhile.
//   2. Anchor the protagonist's voice, values, and the 4 tracks (Faith,
//      Service, Knowledge, Community) so they show up consistently.
//   3. Include the rules for when the protagonist asks vs. tells, when it
//      refers to scripture, how it handles non-Christian users gracefully.
//   4. End with a clear behavioral spec for the calling context (e.g.,
//      "you are guiding the user through a quest" vs "you are evaluating
//      a sermon reflection").
//
// Trade-off: longer system prompt = more cache write cost on first call,
// but every subsequent call within 5min reads at 0.1x. For an interactive
// session with 5+ turns, longer/richer is strictly better.
// =========================================================================

export const AI_PROTAGONIST_SYSTEM_PROMPT = `
TODO: Replace this placeholder with the SacredWorld AI protagonist persona.
Aim for 2,000+ tokens to maximize cache value.

Should cover:
- Who the protagonist is (name, voice, posture toward the user)
- The 4 tracks and how the protagonist relates to each
- Tone rules (warmth without saccharine, depth without lecture)
- Scripture handling (when to cite, which translations, how to frame)
- Boundaries (no medical/legal/financial advice; redirect crises to humans)
- Output style (length, formatting, when to ask follow-ups)
`.trim();
