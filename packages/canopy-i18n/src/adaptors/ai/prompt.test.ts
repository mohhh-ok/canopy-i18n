import { describe, expect, it } from "vitest";
import { buildTranslatePrompt, parseTranslatedTexts } from "./prompt.js";

describe("buildTranslatePrompt", () => {
  it("includes from, to and the texts as JSON", () => {
    const prompt = buildTranslatePrompt({ texts: ["こんにちは"], from: "ja", to: "en" });

    expect(prompt).toContain('from "ja" to "en"');
    expect(prompt).toContain('["こんにちは"]');
  });

  it("asks for language detection when from is omitted", () => {
    const prompt = buildTranslatePrompt({ texts: ["hola"], to: "ja" });

    expect(prompt).toContain("Detect the language");
    expect(prompt).toContain('to "ja"');
  });

  it("appends custom instructions", () => {
    const prompt = buildTranslatePrompt(
      { texts: ["a"], from: "ja", to: "en" },
      { instructions: 'Do not translate "Canopy".' },
    );

    expect(prompt).toContain('Additional instructions: Do not translate "Canopy".');
  });
});

describe("parseTranslatedTexts", () => {
  it("parses a plain JSON array", () => {
    expect(parseTranslatedTexts('["Hello", "Goodbye"]', 2)).toEqual(["Hello", "Goodbye"]);
  });

  it("tolerates code fences and surrounding text", () => {
    const raw = 'Here is the translation:\n```json\n["Hello"]\n```\n';

    expect(parseTranslatedTexts(raw, 1)).toEqual(["Hello"]);
  });

  it("throws when no JSON array is found", () => {
    expect(() => parseTranslatedTexts("sorry, I cannot do that", 1)).toThrow(
      "does not contain a JSON array",
    );
  });

  it("throws on a length mismatch", () => {
    expect(() => parseTranslatedTexts('["a"]', 2)).toThrow("expected 2");
  });

  it("throws when items are not strings", () => {
    expect(() => parseTranslatedTexts("[1, 2]", 2)).toThrow("not a JSON array of strings");
  });
});
