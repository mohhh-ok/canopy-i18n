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
  hash: i18n({
    title: {
      en: "1. URL hash",
      ja: "1. URL ハッシュ",
      zh: "1. URL 哈希",
    },
    description: {
      en: "Create URL-hash-driven i18n with createHashI18nReact(LOCALES).",
      ja: "createHashI18nReact(LOCALES) で URL ハッシュ連動の i18n を生成。",
      zh: "使用 createHashI18nReact(LOCALES) 创建与 URL 哈希联动的 i18n。",
    },
    hint: {
      en: "Rewrite the URL hash to switch locale (e.g. #ja)",
      ja: "URL のハッシュを書き換えると locale が切り替わる (例: #ja)",
      zh: "修改 URL 哈希即可切换语言 (例如: #ja)",
    },
  }),
  search: i18n({
    title: {
      en: "2. URL search param",
      ja: "2. URL search param",
      zh: "2. URL 查询参数",
    },
    description: {
      en: "Create ?lang=-driven i18n with createSearchI18nReact(LOCALES).",
      ja: "createSearchI18nReact(LOCALES) で ?lang= 連動の i18n を生成。",
      zh: "使用 createSearchI18nReact(LOCALES) 创建与 ?lang= 联动的 i18n。",
    },
    hint: {
      en: "Rewrite the URL like ?lang=ja to switch",
      ja: "URL を ?lang=ja のように書き換えると切り替わる",
      zh: "将 URL 改为 ?lang=ja 即可切换",
    },
  }),
  pathname: i18n({
    title: {
      en: "4. URL pathname",
      ja: "4. URL パス",
      zh: "4. URL 路径",
    },
    description: {
      en: "Create pathname-prefix-driven i18n with createPathnameI18nReact(LOCALES, { basePath }).",
      ja: "createPathnameI18nReact(LOCALES, { basePath }) でパス先頭セグメント連動の i18n を生成。",
      zh: "使用 createPathnameI18nReact(LOCALES, { basePath }) 创建与路径首段联动的 i18n。",
    },
    hint: {
      en: "Locale lives in the URL like /pathname/ja",
      ja: "URL に /pathname/ja のように locale セグメントが入る",
      zh: "locale 出现在 URL 中，例如 /pathname/ja",
    },
  }),
  storage: i18n({
    title: {
      en: "3. localStorage",
      ja: "3. localStorage",
      zh: "3. localStorage",
    },
    description: {
      en: "Create localStorage-driven i18n with createStorageI18nReact(LOCALES).",
      ja: "createStorageI18nReact(LOCALES) で localStorage 連動の i18n を生成。",
      zh: "使用 createStorageI18nReact(LOCALES) 创建与 localStorage 联动的 i18n。",
    },
    hint: {
      en: "Persisted in localStorage, kept after reload",
      ja: "localStorage に保存されるのでリロード後も保持される",
      zh: "保存在 localStorage 中，刷新后仍会保留",
    },
  }),
};
