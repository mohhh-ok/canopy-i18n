import { createHashI18nReact } from "canopy-i18n/react";
import { Card } from "../../shared/Card";
import { commonMsgs } from "../../shared/messages";
import { Switcher } from "../../shared/Switcher";
import { LOCALES } from "../../types";

const { LocaleProvider, useLocale, useBindLocale } =
  createHashI18nReact(LOCALES);

function Inner() {
  const { locale, setLocale } = useLocale();
  const m = useBindLocale(commonMsgs);
  return (
    <>
      <Switcher locale={locale} setLocale={setLocale} />
      <p style={{ margin: 0 }}>{m.base.welcome()}</p>
      <small style={{ color: "#888" }}>
        URL のハッシュを書き換えると locale が切り替わる (例: <code>#ja</code>)
      </small>
    </>
  );
}

export function HashDemo() {
  return (
    <Card
      title="1. URL hash"
      description="createHashI18nReact(LOCALES) で URL ハッシュ連動の i18n を生成。"
    >
      <LocaleProvider>
        <Inner />
      </LocaleProvider>
    </Card>
  );
}
