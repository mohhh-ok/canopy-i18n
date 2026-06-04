import { createI18n } from "canopy-i18n";
import { createAITranslator, memoryCache, openAIAdapter } from "canopy-i18n/unstable_ai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("Set the OPENAI_API_KEY environment variable.");
  process.exit(1);
}

const translator = createAITranslator({
  adapter: openAIAdapter({ model: "gpt-4o-mini", apiKey }),
  sourceLocale: "ja",
  cache: memoryCache(),
});

// 1. Write only the source locale; AI fills in the rest
const LOCALES = ["ja", "en"] as const;

const entries = await translator.completeEntries(LOCALES, {
  title: { ja: "ダッシュボード" },
  save: { ja: "保存" },
  cancel: { ja: "キャンセル", en: "Cancel" }, // existing translations are kept
});

const messages = createI18n(LOCALES).add(entries).build("en");
console.log(messages.title()); // AI-translated, e.g. "Dashboard"
console.log(messages.save());
console.log(messages.cancel()); // "Cancel" (kept)

// 2. Translate dynamic text (e.g. user input) at runtime
const input = process.argv[2] ?? "こんにちは、世界！";
console.log(await translator.translate(input, { to: "en" }));

// Cached: the same text does not call the API again
console.log(await translator.translate(input, { to: "en" }));
