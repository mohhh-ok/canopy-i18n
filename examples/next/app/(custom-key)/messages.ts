import { i18n } from "./i18n";

export const appI18n = i18n({
  title: { en: "Custom paramKey", ja: "カスタム paramKey" },
  description: {
    en: "URL routing via /custom/[lang]/...",
    ja: "/custom/[lang]/... による URL ルーティング",
  },
  greeting: (ctx: { name: string }) => ({
    en: `Hello, ${ctx.name}!`,
    ja: `こんにちは、${ctx.name}さん！`,
  }),
});
