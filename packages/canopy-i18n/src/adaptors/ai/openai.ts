import { buildTranslatePrompt, parseTranslatedTexts } from "./prompt.js";
import type { TranslatePromptOptions } from "./prompt.js";
import type { AIAdapter } from "./types.js";

export interface OpenAIAdapterOptions extends TranslatePromptOptions {
  /** Model name, e.g. "gpt-4o-mini". Required: model lineups change too often to default. */
  model: string;
  /** API key. */
  apiKey: string;
  /** Defaults to "https://api.openai.com/v1". Point this at any OpenAI-compatible API. */
  baseURL?: string;
  /** Custom fetch implementation (testing, proxies). Defaults to globalThis.fetch. */
  fetch?: typeof fetch;
}

/**
 * Built-in adapter for the OpenAI Chat Completions API (and compatible APIs).
 * Uses fetch directly — no SDK dependency.
 */
export function openAIAdapter(options: OpenAIAdapterOptions): AIAdapter {
  const baseURL = (options.baseURL ?? "https://api.openai.com/v1").replace(/\/+$/, "");
  const fetchFn = options.fetch ?? fetch;

  return {
    async translate(request) {
      const { apiKey } = options;

      const res = await fetchFn(`${baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: options.model,
          messages: [{ role: "user", content: buildTranslatePrompt(request, options) }],
        }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`OpenAI API error ${res.status}: ${body}`);
      }

      const json = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = json.choices?.[0]?.message?.content;
      if (typeof content !== "string") {
        throw new Error("OpenAI API returned no message content");
      }
      return parseTranslatedTexts(content, request.texts.length);
    },
  };
}
