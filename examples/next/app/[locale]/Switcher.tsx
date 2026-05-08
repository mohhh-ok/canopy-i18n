"use client";

import { LocaleLink, useLocale } from "../i18n";

export function Switcher() {
  const { locale } = useLocale();

  return (
    <>
      <p>
        Current locale: <strong>{locale}</strong>
      </p>
      <nav style={{ display: "flex", gap: "0.5rem" }}>
        <LocaleLink locale="en">English</LocaleLink>
        <LocaleLink locale="ja">日本語</LocaleLink>
      </nav>
    </>
  );
}
