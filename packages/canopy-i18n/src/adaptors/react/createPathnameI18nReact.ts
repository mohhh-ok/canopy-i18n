import { useSyncExternalStore } from "react";
import { createI18nReact, type I18nReactInstance } from "./createI18nReact.js";

const CHANGE_EVENT = "canopy-i18n-pathname-change";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export interface CreatePathnameI18nReactOptions {
  basePath?: string;
}

export function createPathnameI18nReact<const L extends readonly string[]>(
  locales: L,
  options: CreatePathnameI18nReactOptions = {},
): I18nReactInstance<L> {
  type T = L[number];
  const basePath = (options.basePath ?? "").replace(/\/$/, "");

  function getSegments(): string[] {
    const path = window.location.pathname;
    const matchesBase =
      !basePath || path === basePath || path.startsWith(`${basePath}/`);
    const stripped = matchesBase ? path.slice(basePath.length) : path;
    return stripped.split("/").filter(Boolean);
  }

  function read(): T | undefined {
    const seg = getSegments()[0];
    return seg && (locales as readonly string[]).includes(seg)
      ? (seg as T)
      : undefined;
  }

  function usePathnameLocale(): T | undefined {
    return useSyncExternalStore(subscribe, read, () => undefined);
  }

  function setPathnameLocale(locale: T) {
    const segments = getSegments();
    const head = segments[0];
    const replaced =
      head && (locales as readonly string[]).includes(head)
        ? [locale, ...segments.slice(1)]
        : [locale, ...segments];
    const newPath = `${basePath}/${replaced.join("/")}`;
    const url = new URL(window.location.href);
    url.pathname = newPath;
    window.history.pushState({}, "", url);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  return createI18nReact(locales, {
    useLocaleSource: usePathnameLocale,
    onLocaleChange: setPathnameLocale,
  });
}
