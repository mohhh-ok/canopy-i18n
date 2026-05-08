import { useSyncExternalStore } from "react";
import { createI18nReact, type I18nReactInstance } from "./createI18nReact.js";

const CHANGE_EVENT = "canopy-i18n-search-change";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export interface CreateSearchI18nReactOptions {
  param?: string;
}

export function createSearchI18nReact<const L extends readonly string[]>(
  locales: L,
  options: CreateSearchI18nReactOptions = {},
): I18nReactInstance<L> {
  type T = L[number];
  const param = options.param ?? "lang";

  function read(): T | undefined {
    const v = new URLSearchParams(window.location.search).get(param);
    return v && (locales as readonly string[]).includes(v)
      ? (v as T)
      : undefined;
  }

  function useSearchLocale(): T | undefined {
    return useSyncExternalStore(subscribe, read, () => undefined);
  }

  function setSearchLocale(locale: T) {
    const url = new URL(window.location.href);
    url.searchParams.set(param, locale);
    window.history.pushState({}, "", url);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  return createI18nReact(locales, {
    useLocaleSource: useSearchLocale,
    onLocaleChange: setSearchLocale,
  });
}
