import { createI18n } from "canopy-i18n";
import { useBindLocale } from "./LocaleContext";

const LOCALES = ["en", "ja"] as const;
const msgs = createI18n(LOCALES)
  .add({
    title: {
      en: "Welcome to Canopy",
      ja: "ようこそCanopyへ",
    },
    description: {
      en: "A tiny, type-safe i18n helper",
      ja: "軽量で型安全なi18nヘルパー",
    },
    greeting: (ctx: { name: string }) => ({
      en: `Hello, ${ctx.name}!`,
      ja: `${ctx.name}さん、こんにちは！`,
    }),
  });

export default function Page({ name }: { name: string }) {
  const m = useBindLocale(msgs);
  return (
    <main>
      <h1>{m.title()}</h1>
      <p>{m.description()}</p>
      <p>{m.greeting({ name })}</p>
    </main>
  );
}
