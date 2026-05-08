import { i18n, useBindLocale } from "./i18n";

const msgs = i18n({
    title: {
      en: "Welcome to Canopy",
      ja: "ようこそCanopyへ",
      zh: "欢迎使用 Canopy",
    },
    description: {
      en: "A tiny, type-safe i18n helper",
      ja: "軽量で型安全なi18nヘルパー",
      zh: "轻量级类型安全的 i18n 助手",
    },
    greeting: (ctx: { name: string }) => ({
      en: `Hello, ${ctx.name}!`,
      ja: `${ctx.name}さん、こんにちは！`,
      zh: `${ctx.name}，你好！`,
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
