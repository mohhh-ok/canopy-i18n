"use client";

import { createI18nNext } from "canopy-i18n/next";
import { LOCALES } from "./locales";

export const { i18n, LocaleProvider, LocaleLink, useLocale, useBindLocale } =
  createI18nNext(LOCALES);
