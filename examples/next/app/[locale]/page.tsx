"use client";

import { LocaleLink, useBindLocale, useLocale } from "../i18n";
import { appI18n } from "../messages";

export default function Page() {
  const m = useBindLocale({ appI18n });
  const { locale } = useLocale();

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>{m.appI18n.title()}</h1>
      <p>{m.appI18n.description()}</p>
      <p>{m.appI18n.greeting({ name: "Taro" })}</p>

      <p>Current locale: <strong>{locale}</strong></p>

      <nav style={{ display: "flex", gap: "0.5rem" }}>
        <LocaleLink locale="en">English</LocaleLink>
        <LocaleLink locale="ja">日本語</LocaleLink>
      </nav>
    </main>
  );
}
