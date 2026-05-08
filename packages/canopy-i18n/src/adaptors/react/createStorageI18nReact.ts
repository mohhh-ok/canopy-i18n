import { useSyncExternalStore } from "react";
import { createI18nReact, type I18nReactInstance } from "./createI18nReact.js";

export interface CreateStorageI18nReactOptions {
  key?: string;
}

export function createStorageI18nReact<const L extends readonly string[]>(
  locales: L,
  options: CreateStorageI18nReactOptions = {},
): I18nReactInstance<L> {
  type T = L[number];
  const key = options.key ?? "canopy-i18n-locale";
  const listeners = new Set<() => void>();

  function read(): T | undefined {
    const v = localStorage.getItem(key);
    return v && (locales as readonly string[]).includes(v)
      ? (v as T)
      : undefined;
  }

  function subscribe(callback: () => void) {
    listeners.add(callback);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) callback();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(callback);
      window.removeEventListener("storage", onStorage);
    };
  }

  function useStorageLocale(): T | undefined {
    return useSyncExternalStore(subscribe, read, () => undefined);
  }

  function setStorageLocale(locale: T) {
    localStorage.setItem(key, locale);
    listeners.forEach((l) => l());
  }

  return createI18nReact(locales, {
    useLocaleSource: useStorageLocale,
    onLocaleChange: setStorageLocale,
  });
}
