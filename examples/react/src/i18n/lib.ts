import { createI18nReact } from "canopy-i18n/react";
import { LOCALES } from "../types";
import { setLocaleHash, useLocaleSource } from "./localeStore";

export const { i18n, LocaleProvider, useLocale, useBindLocale } =
  createI18nReact(LOCALES, {
    useLocaleSource,
    onLocaleChange: setLocaleHash,
  });
