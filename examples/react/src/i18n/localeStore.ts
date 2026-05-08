import { useSyncExternalStore } from "react";
import { type Locale, LOCALES } from "../types";

function getSnapshot(): Locale | undefined {
  const hash = window.location.hash.slice(1);
  return (LOCALES as readonly string[]).includes(hash)
    ? (hash as Locale)
    : undefined;
}

function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

export function useLocaleSource(): Locale | undefined {
  return useSyncExternalStore(subscribe, getSnapshot, () => undefined);
}

export function setLocaleHash(locale: Locale) {
  window.location.hash = locale;
}
