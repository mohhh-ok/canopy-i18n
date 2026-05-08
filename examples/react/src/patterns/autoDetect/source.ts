import { useSyncExternalStore } from "react";
import { type Locale, LOCALES } from "../../types";

const KEY = "canopy-i18n-example-auto";
const listeners = new Set<() => void>();

function detectFromNavigator(): Locale | undefined {
  const lang = navigator.language.toLowerCase();
  return LOCALES.find((loc) => lang.startsWith(loc));
}

function getStored(): Locale | undefined {
  const v = localStorage.getItem(KEY);
  return v && (LOCALES as readonly string[]).includes(v)
    ? (v as Locale)
    : undefined;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function useDetectedLocale(): Locale | undefined {
  return useSyncExternalStore(
    subscribe,
    () => getStored() ?? detectFromNavigator(),
    () => undefined,
  );
}

export function setDetectedLocale(locale: Locale) {
  localStorage.setItem(KEY, locale);
  listeners.forEach((l) => l());
}
