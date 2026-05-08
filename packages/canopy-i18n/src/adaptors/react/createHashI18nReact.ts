import { useSyncExternalStore } from "react";
import { createI18nReact, type I18nReactInstance } from "./createI18nReact.js";

function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

export function createHashI18nReact<const L extends readonly string[]>(
  locales: L,
): I18nReactInstance<L> {
  type T = L[number];

  function read(): T | undefined {
    const hash = window.location.hash.slice(1);
    return (locales as readonly string[]).includes(hash)
      ? (hash as T)
      : undefined;
  }

  function useHashLocale(): T | undefined {
    return useSyncExternalStore(subscribe, read, () => undefined);
  }

  function setHashLocale(locale: T) {
    window.location.hash = locale;
  }

  return createI18nReact(locales, {
    useLocaleSource: useHashLocale,
    onLocaleChange: setHashLocale,
  });
}
