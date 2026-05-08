import type { User } from "../types";
import { i18n } from "./lib";

export const commonMsgs = {
  base: i18n({
    title: {
      en: "Canopy i18n",
      ja: "Canopy i18n",
      zh: "Canopy i18n",
    },
    welcome: {
      en: "Welcome to Canopy i18n",
      ja: "Canopy i18nへようこそ",
      zh: "欢迎使用 Canopy i18n",
    },
    description: {
      en: "A tiny, type-safe i18n helper for modern applications",
      ja: "モダンなアプリケーション向けの小さな型安全i18nヘルパー",
      zh: "适用于现代应用的轻量级类型安全 i18n 助手",
    },
    footer: {
      en: "Made with ❤️ using Canopy i18n",
      ja: "Canopy i18nで作られました ❤️",
      zh: "使用 Canopy i18n 制作 ❤️",
    },
  }),
  features: i18n({
    title: {
      en: "Features",
      ja: "特徴",
      zh: "特性",
    },
    typeSafe: {
      en: "🔒 Type-safe translations",
      ja: "🔒 型安全な翻訳",
      zh: "🔒 类型安全的翻译",
    },
    simple: {
      en: "⚡ Simple and lightweight",
      ja: "⚡ シンプルで軽量",
      zh: "⚡ 简单轻量",
    },
    chainable: {
      en: "🔗 Chainable API",
      ja: "🔗 チェーン可能なAPI",
      zh: "🔗 可链式调用的 API",
    },
  }),
  dynamic: i18n({
    greeting: (ctx: User) => ({
      en: `Hello, ${ctx.name}!`,
      ja: `こんにちは、${ctx.name}さん！`,
      zh: `你好，${ctx.name}！`,
    }),
    itemCount: (ctx: User) => ({
      en: `You have ${ctx.count} ${ctx.count === 1 ? "item" : "items"}`,
      ja: `${ctx.count}個のアイテムがあります`,
      zh: `你有 ${ctx.count} 个项目`,
    }),
  }),
};
