"use client";

import { LocaleLink, useBindLocale, useLocale } from "../i18n";
import { appI18n } from "../messages";

export function ClientSection() {
  const m = useBindLocale({ appI18n });
  const { locale } = useLocale();

  return (
    <section>
      <h2>Client Section (useBindLocale)</h2>
      <p>{m.appI18n.greeting({ name: "Hanako" })}</p>
      <p>
        Current locale: <strong>{locale}</strong>
      </p>
      <nav style={{ display: "flex", gap: "0.5rem" }}>
        <LocaleLink locale="en">English</LocaleLink>
        <LocaleLink locale="ja">日本語</LocaleLink>
      </nav>
    </section>
  );
}
