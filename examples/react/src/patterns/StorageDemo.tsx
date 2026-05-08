import { useSyncExternalStore } from "react";
import { createI18nReact } from "canopy-i18n/react";
import { commonMsgs } from "../i18n";
import { type Locale, LOCALES } from "../types";
import { Card } from "./Card";
import { Switcher } from "./Switcher";

const KEY = "canopy-i18n-example-locale";
const listeners = new Set<() => void>();

function getStoredLocale(): Locale | undefined {
  const v = localStorage.getItem(KEY);
  return v && (LOCALES as readonly string[]).includes(v)
    ? (v as Locale)
    : undefined;
}

function subscribeStore(callback: () => void) {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function useStorageLocale(): Locale | undefined {
  return useSyncExternalStore(subscribeStore, getStoredLocale, () => undefined);
}

const { LocaleProvider, useLocale, useBindLocale } = createI18nReact(LOCALES, {
  useLocaleSource: useStorageLocale,
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
        localStorage に保存されるのでリロード後も保持される
      </small>
    </>
  );
}

export function StorageDemo() {
  return (
    <Card
      title="4. Source-driven (localStorage)"
      description="useLocaleSource で localStorage を購読し、onLocaleChange で書き戻す。"
    >
      <LocaleProvider>
        <Inner />
      </LocaleProvider>
    </Card>
  );
}
