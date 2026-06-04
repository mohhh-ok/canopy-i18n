import { describe, expect, it } from "vitest";
import { memoryCache } from "./cache.js";
import { createAITranslator } from "./translator.js";
import type { AIAdapter, AITranslateRequest } from "./types.js";

function fakeAdapter() {
  const calls: AITranslateRequest[] = [];
  const adapter: AIAdapter = {
    async translate(request) {
      calls.push(request);
      return request.texts.map((text) => `${text}[${request.to}]`);
    },
  };
  return { adapter, calls };
}

describe("AITranslator", () => {
  it("translates a single text via the adapter", async () => {
    const { adapter, calls } = fakeAdapter();
    const translator = createAITranslator({ adapter, sourceLocale: "ja" });

    const result = await translator.translate("こんにちは", { to: "en" });

    expect(result).toBe("こんにちは[en]");
    expect(calls).toEqual([{ texts: ["こんにちは"], from: "ja", to: "en" }]);
  });

  it("passes from: undefined to the adapter when the source language is unknown", async () => {
    const { adapter, calls } = fakeAdapter();
    const translator = createAITranslator({ adapter });

    const result = await translator.translate("こんにちは", { to: "en" });

    expect(result).toBe("こんにちは[en]");
    expect(calls).toEqual([{ texts: ["こんにちは"], from: undefined, to: "en" }]);
  });

  it("calls the adapter even when to may equal the unknown source language", async () => {
    const { adapter, calls } = fakeAdapter();
    const translator = createAITranslator({ adapter });

    await translator.translate("こんにちは", { to: "ja" });

    expect(calls).toHaveLength(1);
  });

  it("rejects completeEntries without sourceLocale", async () => {
    const { adapter } = fakeAdapter();
    const translator = createAITranslator({ adapter });

    await expect(
      translator.completeEntries(["ja", "en"] as const, {
        title: { ja: "タイトル" },
      }),
    ).rejects.toThrow("requires the sourceLocale option");
  });

  it("returns texts as-is when from equals to", async () => {
    const { adapter, calls } = fakeAdapter();
    const translator = createAITranslator({ adapter, sourceLocale: "ja" });

    const result = await translator.translate("こんにちは", { to: "ja" });

    expect(result).toBe("こんにちは");
    expect(calls).toHaveLength(0);
  });

  it("batches multiple texts into one adapter call", async () => {
    const { adapter, calls } = fakeAdapter();
    const translator = createAITranslator({ adapter, sourceLocale: "ja" });

    const result = await translator.translateMany(["a", "b"], { to: "en" });

    expect(result).toEqual(["a[en]", "b[en]"]);
    expect(calls).toHaveLength(1);
  });

  it("deduplicates the same text within a batch", async () => {
    const { adapter, calls } = fakeAdapter();
    const translator = createAITranslator({ adapter, sourceLocale: "ja" });

    const result = await translator.translateMany(["a", "a", "b"], { to: "en" });

    expect(result).toEqual(["a[en]", "a[en]", "b[en]"]);
    expect(calls[0]?.texts).toEqual(["a", "b"]);
  });

  it("uses the cache to avoid repeated adapter calls", async () => {
    const { adapter, calls } = fakeAdapter();
    const translator = createAITranslator({
      adapter,
      sourceLocale: "ja",
      cache: memoryCache(),
    });

    await translator.translate("a", { to: "en" });
    const result = await translator.translate("a", { to: "en" });

    expect(result).toBe("a[en]");
    expect(calls).toHaveLength(1);
  });

  it("deduplicates concurrent requests for the same text", async () => {
    const calls: AITranslateRequest[] = [];
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const adapter: AIAdapter = {
      async translate(request) {
        calls.push(request);
        await gate;
        return request.texts.map((text) => `${text}[${request.to}]`);
      },
    };
    const translator = createAITranslator({ adapter, sourceLocale: "ja" });

    const first = translator.translate("a", { to: "en" });
    const second = translator.translate("a", { to: "en" });
    await Promise.resolve();
    release();

    expect(await first).toBe("a[en]");
    expect(await second).toBe("a[en]");
    expect(calls).toHaveLength(1);
  });

  it("falls back to the original text on adapter error by default", async () => {
    const adapter: AIAdapter = {
      async translate() {
        throw new Error("api down");
      },
    };
    const translator = createAITranslator({ adapter, sourceLocale: "ja" });

    const result = await translator.translate("こんにちは", { to: "en" });

    expect(result).toBe("こんにちは");
  });

  it("throws on adapter error when onError is 'throw'", async () => {
    const adapter: AIAdapter = {
      async translate() {
        throw new Error("api down");
      },
    };
    const translator = createAITranslator({
      adapter,
      sourceLocale: "ja",
      onError: "throw",
    });

    await expect(translator.translate("こんにちは", { to: "en" })).rejects.toThrow(
      "api down",
    );
  });

  it("throws when the adapter returns a wrong number of texts", async () => {
    const adapter: AIAdapter = {
      async translate() {
        return [];
      },
    };
    const translator = createAITranslator({
      adapter,
      sourceLocale: "ja",
      onError: "throw",
    });

    await expect(translator.translate("a", { to: "en" })).rejects.toThrow(
      "expected 1",
    );
  });

  it("completes missing locales of entries, keeping existing translations", async () => {
    const { adapter, calls } = fakeAdapter();
    const translator = createAITranslator({ adapter, sourceLocale: "ja" });

    const entries = await translator.completeEntries(["ja", "en", "fr"] as const, {
      title: { ja: "タイトル" },
      greeting: { ja: "こんにちは", en: "Hello" },
    });

    expect(entries).toEqual({
      title: { ja: "タイトル", en: "タイトル[en]", fr: "タイトル[fr]" },
      greeting: { ja: "こんにちは", en: "Hello", fr: "こんにちは[fr]" },
    });
    // en: title のみ / fr: title と greeting
    expect(calls).toHaveLength(2);
  });

  it("throws when an entry is missing the source locale", async () => {
    const { adapter } = fakeAdapter();
    const translator = createAITranslator({ adapter, sourceLocale: "ja" });

    await expect(
      translator.completeEntries(["ja", "en"] as const, {
        title: { en: "Title" } as never,
      }),
    ).rejects.toThrow('missing source locale "ja"');
  });
});
