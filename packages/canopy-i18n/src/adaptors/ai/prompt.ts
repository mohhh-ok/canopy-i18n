import type { AITranslateRequest } from "./types.js";

export interface TranslatePromptOptions {
  /** Extra instructions appended to the prompt (tone, glossary, terms to keep, ...) */
  instructions?: string;
}

/**
 * Build a provider-neutral translation prompt.
 * Built-in adapters use this; custom adapters can too.
 */
export function buildTranslatePrompt(
  request: AITranslateRequest,
  options: TranslatePromptOptions = {},
): string {
  const { texts, from, to } = request;
  const lines = [
    from === undefined
      ? `Detect the language of each text and translate it to "${to}".`
      : `Translate each text from "${from}" to "${to}".`,
    "Rules:",
    "- Return ONLY a JSON array of strings, in the same order and length as the input.",
    "- Do not add explanations, code fences, or any text outside the JSON array.",
    "- Keep placeholders (e.g. {name}), code, URLs, and proper nouns as they are.",
    "- Preserve the tone and formatting of each text.",
  ];
  if (options.instructions) {
    lines.push(`Additional instructions: ${options.instructions}`);
  }
  lines.push("", "Input:", JSON.stringify(texts));
  return lines.join("\n");
}

/**
 * Parse an AI response into translated texts.
 * Tolerates code fences and surrounding text, and validates the result.
 */
export function parseTranslatedTexts(raw: string, expected: number): string[] {
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  if (start === -1 || end < start) {
    throw new Error("AI response does not contain a JSON array");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw.slice(start, end + 1));
  } catch {
    throw new Error("AI response contains an invalid JSON array");
  }
  if (!Array.isArray(parsed) || !parsed.every((v) => typeof v === "string")) {
    throw new Error("AI response is not a JSON array of strings");
  }
  if (parsed.length !== expected) {
    throw new Error(`AI returned ${parsed.length} texts, expected ${expected}`);
  }
  return parsed;
}
