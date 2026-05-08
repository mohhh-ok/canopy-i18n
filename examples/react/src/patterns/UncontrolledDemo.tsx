import { createI18nReact } from "canopy-i18n/react";
import { commonMsgs } from "../i18n";
import { LOCALES } from "../types";
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
        {m.dynamic.greeting({ name: "太郎", count: 0 })}
      </p>
    </>
  );
}

export function UncontrolledDemo() {
  return (
    <Card
      title="1. Uncontrolled"
      description="LocaleProvider が内部で state を持つ。defaultLocale だけ渡す。"
    >
      <LocaleProvider defaultLocale="en">
        <Inner />
      </LocaleProvider>
    </Card>
  );
}
