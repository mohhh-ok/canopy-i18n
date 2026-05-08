import { createI18nReact } from "canopy-i18n/react";
import { Card } from "../../shared/Card";
import { commonMsgs } from "../../shared/messages";
import { Switcher } from "../../shared/Switcher";
import { LOCALES } from "../../types";
import { setStorageLocale, useStorageLocale } from "./source";

const { LocaleProvider, useLocale, useBindLocale } = createI18nReact(LOCALES, {
  useLocaleSource: useStorageLocale,
  onLocaleChange: setStorageLocale,
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
      title="3. localStorage"
      description="useLocaleSource で localStorage を購読し、onLocaleChange で書き戻す。"
    >
      <LocaleProvider>
        <Inner />
      </LocaleProvider>
    </Card>
  );
}
