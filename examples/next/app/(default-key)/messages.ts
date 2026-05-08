import { i18n } from "./i18n";

export const appI18n = i18n({
  title: { en: "Canopy i18n × Next.js", ja: "Canopy i18n × Next.js" },
  description: {
    en: "URL-based locale routing via /[locale]/...",
    ja: "/[locale]/... による URL ベースのロケール切替",
  },
  greeting: (ctx: { name: string }) => ({
    en: `Hello, ${ctx.name}!`,
    ja: `こんにちは、${ctx.name}さん！`,
  }),
});
