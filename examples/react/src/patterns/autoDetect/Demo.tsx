import { createI18nReact } from "canopy-i18n/react";
import { Card } from "../../shared/Card";
import { commonMsgs } from "../../shared/messages";
import { Switcher } from "../../shared/Switcher";
import { LOCALES } from "../../types";
import { setDetectedLocale, useDetectedLocale } from "./source";

const { LocaleProvider, useLocale, useBindLocale } = createI18nReact(LOCALES, {
  useLocaleSource: useDetectedLocale,
  onLocaleChange: setDetectedLocale,
});

function Inner() {
  const { locale, setLocale } = useLocale();
  const m = useBindLocale(commonMsgs);
  return (
    <>
      <Switcher locale={locale} setLocale={setLocale} />
      <p style={{ margin: 0 }}>{m.base.welcome()}</p>
      <small style={{ color: "#888" }}>
        navigator.language: <code>{navigator.language}</code>
      </small>
    </>
  );
}

export function AutoDetectDemo() {
  return (
    <Card
      title="4. navigator.language → localStorage"
      description="useLocaleSource を localStorage ?? navigator.language の合成にし、選択を localStorage に永続化。"
    >
      <LocaleProvider>
        <Inner />
      </LocaleProvider>
    </Card>
  );
}
