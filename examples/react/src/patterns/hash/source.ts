import { useSyncExternalStore } from "react";
import { type Locale, LOCALES } from "../../types";

function getHashLocale(): Locale | undefined {
  const hash = window.location.hash.slice(1);
  return (LOCALES as readonly string[]).includes(hash)
    ? (hash as Locale)
    : undefined;
}

function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

export function useHashLocale(): Locale | undefined {
  return useSyncExternalStore(subscribe, getHashLocale, () => undefined);
}

export function setHashLocale(locale: Locale) {
  window.location.hash = locale;
}
