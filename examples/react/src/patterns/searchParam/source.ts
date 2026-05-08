import { useSyncExternalStore } from "react";
import { type Locale, LOCALES } from "../../types";

const PARAM = "lang";
const CHANGE_EVENT = "canopy-search-change";

function getSearchLocale(): Locale | undefined {
  const v = new URLSearchParams(window.location.search).get(PARAM);
  return v && (LOCALES as readonly string[]).includes(v)
    ? (v as Locale)
    : undefined;
}

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function useSearchLocale(): Locale | undefined {
  return useSyncExternalStore(subscribe, getSearchLocale, () => undefined);
}

export function setSearchLocale(locale: Locale) {
  const url = new URL(window.location.href);
  url.searchParams.set(PARAM, locale);
  window.history.pushState({}, "", url);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
