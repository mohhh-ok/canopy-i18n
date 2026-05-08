import { createStorageI18nReact } from "canopy-i18n/react";
import { Card } from "../../shared/Card";
import { commonMsgs } from "../../shared/messages";
import { Switcher } from "../../shared/Switcher";
import { LOCALES } from "../../types";

const { LocaleProvider, useLocale, useBindLocale } = createStorageI18nReact(
  LOCALES,
  { key: "canopy-i18n-example-locale" },
);

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
      description="createStorageI18nReact(LOCALES) で localStorage 連動の i18n を生成。"
    >
      <LocaleProvider>
        <Inner />
      </LocaleProvider>
    </Card>
  );
}
