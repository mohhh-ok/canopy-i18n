import { createPathnameI18nReact } from "canopy-i18n/react";
import { Card } from "../../shared/Card";
import { Code } from "../../shared/Code";
import { commonMsgs } from "../../shared/messages";
import { Switcher } from "../../shared/Switcher";
import { LOCALES } from "../../types";

const { LocaleProvider, useLocale, useBindLocale } = createPathnameI18nReact(
  LOCALES,
  { basePath: "/pathname" },
);

const SAMPLE = `const { LocaleProvider, useLocale, useBindLocale } =
  createPathnameI18nReact(LOCALES, { basePath: "/pathname" });`;

function Inner() {
  const { locale, setLocale } = useLocale();
  const m = useBindLocale(commonMsgs);
  return (
    <Card title={m.pathname.title()} description={m.pathname.description()}>
      <Code>{SAMPLE}</Code>
      <Switcher locale={locale} setLocale={setLocale} />
      <p style={{ margin: 0 }}>{m.base.welcome()}</p>
      <small style={{ color: "#888" }}>{m.pathname.hint()}</small>
    </Card>
  );
}

export function PathnameDemo() {
  return (
    <LocaleProvider>
      <Inner />
    </LocaleProvider>
  );
}
