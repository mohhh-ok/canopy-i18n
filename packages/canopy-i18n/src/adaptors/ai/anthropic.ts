import { buildTranslatePrompt, parseTranslatedTexts } from "./prompt.js";
import type { TranslatePromptOptions } from "./prompt.js";
import type { AIAdapter } from "./types.js";

export interface AnthropicAdapterOptions extends TranslatePromptOptions {
  /** Model name, e.g. "claude-haiku-4-5". Required: model lineups change too often to default. */
  model: string;
  /** API key. */
  apiKey: string;
  /** Max output tokens (the Anthropic API requires this). Defaults to 8192. */
  maxTokens?: number;
  /** Defaults to "https://api.anthropic.com/v1". */
  baseURL?: string;
  /** Custom fetch implementation (testing, proxies). Defaults to globalThis.fetch. */
  fetch?: typeof fetch;
}

/**
 * Built-in adapter for the Anthropic (Claude) Messages API.
 * Uses fetch directly — no SDK dependency.
 */
export function anthropicAdapter(options: AnthropicAdapterOptions): AIAdapter {
  const baseURL = (options.baseURL ?? "https://api.anthropic.com/v1").replace(/\/+$/, "");
  const fetchFn = options.fetch ?? fetch;

  return {
    async translate(request) {
      const res = await fetchFn(`${baseURL}/messages`, {
        method: "POST",
        headers: {
          "x-api-key": options.apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: options.model,
          max_tokens: options.maxTokens ?? 8192,
          messages: [{ role: "user", content: buildTranslatePrompt(request, options) }],
        }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`Anthropic API error ${res.status}: ${body}`);
      }

      const json = (await res.json()) as {
        content?: { type?: string; text?: string }[];
      };
      const text = json.content?.find((block) => block.type === "text")?.text;
      if (typeof text !== "string") {
        throw new Error("Anthropic API returned no text content");
      }
      return parseTranslatedTexts(text, request.texts.length);
    },
  };
}
