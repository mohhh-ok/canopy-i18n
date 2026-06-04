import { buildTranslatePrompt, parseTranslatedTexts } from "./prompt.js";
import type { TranslatePromptOptions } from "./prompt.js";
import type { AIAdapter } from "./types.js";

export interface GeminiAdapterOptions extends TranslatePromptOptions {
  /** Model name, e.g. "gemini-2.0-flash". Required: model lineups change too often to default. */
  model: string;
  /** API key. */
  apiKey: string;
  /** Defaults to "https://generativelanguage.googleapis.com/v1beta". */
  baseURL?: string;
  /** Custom fetch implementation (testing, proxies). Defaults to globalThis.fetch. */
  fetch?: typeof fetch;
}

/**
 * Built-in adapter for the Google Gemini API (generateContent).
 * Uses fetch directly — no SDK dependency.
 */
export function geminiAdapter(options: GeminiAdapterOptions): AIAdapter {
  const baseURL = (
    options.baseURL ?? "https://generativelanguage.googleapis.com/v1beta"
  ).replace(/\/+$/, "");
  const fetchFn = options.fetch ?? fetch;

  return {
    async translate(request) {
      const res = await fetchFn(`${baseURL}/models/${options.model}:generateContent`, {
        method: "POST",
        headers: {
          "x-goog-api-key": options.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildTranslatePrompt(request, options) }] }],
        }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`Gemini API error ${res.status}: ${body}`);
      }

      const json = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const text = json.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("");
      if (!text) {
        throw new Error("Gemini API returned no text content");
      }
      return parseTranslatedTexts(text, request.texts.length);
    },
  };
}
