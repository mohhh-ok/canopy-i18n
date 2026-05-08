import { useSyncExternalStore } from "react";
import { createI18nReact } from "canopy-i18n/react";
import { commonMsgs } from "../i18n";
import { type Locale, LOCALES } from "../types";
import { Card } from "./Card";
import { Switcher } from "./Switcher";

function getHashLocale(): Locale | undefined {
  const hash = window.location.hash.slice(1);
  return (LOCALES as readonly string[]).includes(hash)
    ? (hash as Locale)
    : undefined;
}

function subscribeHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

function useHashLocale(): Locale | undefined {
  return useSyncExternalStore(subscribeHash, getHashLocale, () => undefined);
}

const { LocaleProvider, useLocale, useBindLocale } = createI18nReact(LOCALES, {
  useLocaleSource: useHashLocale,
  onLocaleChange: (locale) => {
    window.location.hash = locale;
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
        URL のハッシュを書き換えると locale が切り替わる (例: <code>#ja</code>)
      </small>
    </>
  );
}

export function HashDemo() {
  return (
    <Card
      title="3. Source-driven (URL hash)"
      description="useLocaleSource で URL ハッシュを購読し、setLocale でハッシュを書き換える。"
    >
      <LocaleProvider>
        <Inner />
      </LocaleProvider>
    </Card>
  );
}
