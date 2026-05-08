import { createI18nReact } from "canopy-i18n/react";
import { LOCALES } from "../types";

// メッセージ定義に使う i18n だけを取り出す。
// LocaleProvider/useLocale/useBindLocale は各パターンが自分の factory で生成する。
const { i18n } = createI18nReact(LOCALES);

export const commonMsgs = {
  base: i18n({
    welcome: {
      en: "Welcome to Canopy i18n",
      ja: "Canopy i18n へようこそ",
      zh: "欢迎使用 Canopy i18n",
    },
  }),
};
