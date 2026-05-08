import { createStorageI18nReact } from "canopy-i18n/react";
import { Card } from "../../shared/Card";
import { Code } from "../../shared/Code";
import { commonMsgs } from "../../shared/messages";
import { Switcher } from "../../shared/Switcher";
import { LOCALES } from "../../types";

const { LocaleProvider, useLocale, useBindLocale } = createStorageI18nReact(
  LOCALES,
  { key: "canopy-i18n-example-locale" },
);

const SAMPLE = `const { LocaleProvider, useLocale, useBindLocale } =
  createStorageI18nReact(LOCALES, { key: "canopy-i18n-example-locale" });`;

function Inner() {
  const { locale, setLocale } = useLocale();
  const m = useBindLocale(commonMsgs);
  return (
    <Card title={m.storage.title()} description={m.storage.description()}>
      <Code>{SAMPLE}</Code>
      <Switcher locale={locale} setLocale={setLocale} />
      <p style={{ margin: 0 }}>{m.base.welcome()}</p>
      <small style={{ color: "#888" }}>{m.storage.hint()}</small>
    </Card>
  );
}

export function StorageDemo() {
  return (
    <LocaleProvider>
      <Inner />
    </LocaleProvider>
  );
}
