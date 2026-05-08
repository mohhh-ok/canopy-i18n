import { useState } from "react";
import { createI18nReact } from "canopy-i18n/react";
import { commonMsgs } from "../i18n";
import { type Locale, LOCALES } from "../types";
import { Card } from "./Card";
import { Switcher } from "./Switcher";

const { LocaleProvider, useLocale, useBindLocale } = createI18nReact(LOCALES);

function Inner() {
  const { locale, setLocale } = useLocale();
  const m = useBindLocale(commonMsgs);
  return (
    <>
      <Switcher locale={locale} setLocale={setLocale} />
      <p style={{ margin: 0 }}>{m.base.welcome()}</p>
      <p style={{ margin: 0, color: "#555" }}>
        {m.dynamic.greeting({ name: "花子", count: 0 })}
      </p>
    </>
  );
}

export function ControlledDemo() {
  const [locale, setLocale] = useState<Locale>("ja");
  return (
    <Card
      title="2. Controlled"
      description="親が locale state を持つ。locale + onLocaleChange を渡す。"
    >
      <LocaleProvider locale={locale} onLocaleChange={setLocale}>
        <Inner />
      </LocaleProvider>
      <small style={{ color: "#888" }}>parent state: {locale}</small>
    </Card>
  );
}
