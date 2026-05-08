import { createSearchI18nReact } from "canopy-i18n/react";
import { Card } from "../../shared/Card";
import { Code } from "../../shared/Code";
import { commonMsgs } from "../../shared/messages";
import { Switcher } from "../../shared/Switcher";
import { LOCALES } from "../../types";

const { LocaleProvider, useLocale, useBindLocale } =
  createSearchI18nReact(LOCALES);

const SAMPLE = `const { LocaleProvider, useLocale, useBindLocale } =
  createSearchI18nReact(LOCALES);`;

function Inner() {
  const { locale, setLocale } = useLocale();
  const m = useBindLocale(commonMsgs);
  return (
    <Card title={m.search.title()} description={m.search.description()}>
      <Code>{SAMPLE}</Code>
      <Switcher locale={locale} setLocale={setLocale} />
      <p style={{ margin: 0 }}>{m.base.welcome()}</p>
      <small style={{ color: "#888" }}>{m.search.hint()}</small>
    </Card>
  );
}

export function SearchParamDemo() {
  return (
    <LocaleProvider>
      <Inner />
    </LocaleProvider>
  );
}
