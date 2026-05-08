import { useSyncExternalStore } from "react";
import { createI18nReact } from "canopy-i18n/react";
import { commonMsgs } from "../i18n";
import { type Locale, LOCALES } from "../types";
import { Card } from "./Card";
import { Switcher } from "./Switcher";

const KEY = "canopy-i18n-example-auto";
const listeners = new Set<() => void>();

function detectFromNavigator(): Locale | undefined {
  const lang = navigator.language.toLowerCase();
  return LOCALES.find((loc) => lang.startsWith(loc));
}

function getStored(): Locale | undefined {
  const v = localStorage.getItem(KEY);
  return v && (LOCALES as readonly string[]).includes(v)
    ? (v as Locale)
    : undefined;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function useDetectedLocale(): Locale | undefined {
  return useSyncExternalStore(
    subscribe,
    () => getStored() ?? detectFromNavigator(),
    () => undefined,
  );
}

const { LocaleProvider, useLocale, useBindLocale } = createI18nReact(LOCALES, {
  useLocaleSource: useDetectedLocale,
  onLocaleChange: (locale) => {
    localStorage.setItem(KEY, locale);
    listeners.forEach((l) => l());
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
        navigator.language: <code>{navigator.language}</code>
      </small>
    </>
  );
}

export function AutoDetectDemo() {
  return (
    <Card
      title="4. navigator.language → localStorage"
      description="useLocaleSource を localStorage ?? navigator.language の合成にし、選択を localStorage に永続化。"
    >
      <LocaleProvider>
        <Inner />
      </LocaleProvider>
    </Card>
  );
}
