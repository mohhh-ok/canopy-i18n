import { createI18nNext } from "canopy-i18n/unstable_next";

export const LOCALES = ["en", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

export const {
  i18n,
  bindLocale,
  generateStaticParams,
  LocaleProvider,
  LocaleLink,
  useLocale,
  useBindLocale,
} = createI18nNext(LOCALES, { paramKey: "lang", pathPrefix: "/custom" });
