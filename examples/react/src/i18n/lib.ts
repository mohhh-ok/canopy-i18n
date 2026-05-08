import { createI18nReact } from "canopy-i18n/react";
import { LOCALES } from "../types";

// メッセージ定義に使う i18n だけを取り出す。
// LocaleProvider/useLocale/useBindLocale は各パターンが自分の factory で生成する。
export const { i18n } = createI18nReact(LOCALES);
