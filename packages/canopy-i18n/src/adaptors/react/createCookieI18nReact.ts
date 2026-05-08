import { useSyncExternalStore } from "react";
import { createI18nReact, type I18nReactInstance } from "./createI18nReact.js";

const CHANGE_EVENT = "canopy-i18n-cookie-change";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export interface CreateCookieI18nReactOptions {
  key?: string;
  maxAge?: number;
  path?: string;
  sameSite?: "Strict" | "Lax" | "None";
}

function readCookie(key: string): string | undefined {
  for (const c of document.cookie.split("; ")) {
    const eq = c.indexOf("=");
    if (eq < 0) continue;
    if (c.slice(0, eq) === key) return decodeURIComponent(c.slice(eq + 1));
  }
  return undefined;
}

function writeCookie(
  key: string,
  value: string,
  options: CreateCookieI18nReactOptions,
) {
  const parts = [
    `${key}=${encodeURIComponent(value)}`,
    `path=${options.path ?? "/"}`,
    `max-age=${options.maxAge ?? ONE_YEAR_SECONDS}`,
    `SameSite=${options.sameSite ?? "Lax"}`,
  ];
  document.cookie = parts.join("; ");
}

export function createCookieI18nReact<const L extends readonly string[]>(
  locales: L,
  options: CreateCookieI18nReactOptions = {},
): I18nReactInstance<L> {
  type T = L[number];
  const key = options.key ?? "canopy-i18n-locale";

  function read(): T | undefined {
    const v = readCookie(key);
    return v && (locales as readonly string[]).includes(v)
      ? (v as T)
      : undefined;
  }

  function subscribe(callback: () => void) {
    window.addEventListener(CHANGE_EVENT, callback);
    return () => window.removeEventListener(CHANGE_EVENT, callback);
  }

  function useCookieLocale(): T | undefined {
    return useSyncExternalStore(subscribe, read, () => undefined);
  }

  function setCookieLocale(locale: T) {
    writeCookie(key, locale, options);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  return createI18nReact(locales, {
    useLocaleSource: useCookieLocale,
    onLocaleChange: setCookieLocale,
  });
}
