import { createSearchI18nReact } from "canopy-i18n/react";
import { Card } from "../../shared/Card";
import { commonMsgs } from "../../shared/messages";
import { Switcher } from "../../shared/Switcher";
import { LOCALES } from "../../types";

const { LocaleProvider, useLocale, useBindLocale } =
  createSearchI18nReact(LOCALES);

function Inner() {
  const { locale, setLocale } = useLocale();
  const m = useBindLocale(commonMsgs);
  return (
    <>
      <Switcher locale={locale} setLocale={setLocale} />
      <p style={{ margin: 0 }}>{m.base.welcome()}</p>
      <small style={{ color: "#888" }}>
        URL を <code>?lang=ja</code> のように書き換えると切り替わる
      </small>
    </>
  );
}

export function SearchParamDemo() {
  return (
    <Card
      title="2. URL search param"
      description="createSearchI18nReact(LOCALES) で ?lang= 連動の i18n を生成。"
    >
      <LocaleProvider>
        <Inner />
      </LocaleProvider>
    </Card>
  );
}
