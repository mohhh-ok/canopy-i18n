import { useSyncExternalStore } from "react";
import { createI18nReact } from "canopy-i18n/react";
import { commonMsgs } from "../i18n";
import { type Locale, LOCALES } from "../types";
import { Card } from "./Card";
import { Switcher } from "./Switcher";

const PARAM = "lang";
const CHANGE_EVENT = "canopy-search-change";

function getSearchLocale(): Locale | undefined {
  const v = new URLSearchParams(window.location.search).get(PARAM);
  return v && (LOCALES as readonly string[]).includes(v)
    ? (v as Locale)
    : undefined;
}

function subscribeSearch(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function useSearchLocale(): Locale | undefined {
  return useSyncExternalStore(subscribeSearch, getSearchLocale, () => undefined);
}

const { LocaleProvider, useLocale, useBindLocale } = createI18nReact(LOCALES, {
  useLocaleSource: useSearchLocale,
  onLocaleChange: (locale) => {
    const url = new URL(window.location.href);
    url.searchParams.set(PARAM, locale);
    window.history.pushState({}, "", url);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  },
});

function Inner() {
  const { locale, setLocale } = useLocale();
  const m = useBindLocale(commonMsgs);
  return (
    <>
      <Switcher locale={locale} setLocale={setLocale} />
      <p style={{ margin: 0 }}>{m.base.welcome()}</p>
      <small style={{ color: "#888" }}>
        URL を <code>?lang=ja</code> のように書き換えると切り替わる
      </small>
    </>
  );
}

export function SearchParamDemo() {
  return (
    <Card
      title="2. URL search param"
      description="useLocaleSource で ?lang= を購読し、pushState で書き戻す。"
    >
      <LocaleProvider>
        <Inner />
      </LocaleProvider>
    </Card>
  );
}
