import { createI18n } from "canopy-i18n";
import { createAITranslator, memoryCache, openAIAdapter } from "canopy-i18n/unstable_ai";
import type { AIAdapter } from "canopy-i18n/unstable_ai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("Set the OPENAI_API_KEY environment variable.");
  process.exit(1);
}

// Wrap the adapter to log API calls, so cache hits are visible (no log = cached)
const openai = openAIAdapter({ model: "gpt-4o-mini", apiKey });
let apiCalls = 0;
const adapter: AIAdapter = {
  async translate(request) {
    apiCalls += 1;
    console.log(`  (API call #${apiCalls}: ${request.texts.length} text(s) -> ${request.to})`);
    return openai.translate(request);
  },
};

const translator = createAITranslator({
  adapter,
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

console.log("1st translate:");
console.log(await translator.translate(input, { to: "en" }));

console.log("2nd translate (cached — no API call below):");
console.log(await translator.translate(input, { to: "en" }));

console.log(`total API calls: ${apiCalls}`);
