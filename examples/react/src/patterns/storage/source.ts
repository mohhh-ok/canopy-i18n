import { useSyncExternalStore } from "react";
import { type Locale, LOCALES } from "../../types";

const KEY = "canopy-i18n-example-locale";
const listeners = new Set<() => void>();

function getStoredLocale(): Locale | undefined {
  const v = localStorage.getItem(KEY);
  return v && (LOCALES as readonly string[]).includes(v)
    ? (v as Locale)
    : undefined;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function useStorageLocale(): Locale | undefined {
  return useSyncExternalStore(subscribe, getStoredLocale, () => undefined);
}

export function setStorageLocale(locale: Locale) {
  localStorage.setItem(KEY, locale);
  listeners.forEach((l) => l());
}
