import { describe, expect, it } from "vitest";
import { bindLocale } from "./bindLocale.js";
import { createI18n } from "./chainBuilder.js";

const LOCALES = ["ja", "en"] as const;

describe("ChainBuilder", () => {
  it("builds multiple messages with method chaining", () => {
    const messages = createI18n(LOCALES)
      .add({
        title: {
          ja: "タイトルテスト",
          en: "Title Test",
        },
        "greeting.hello": {
          ja: "こんにちは",
          en: "Hello",
        },
        "greeting.bye": {
          ja: "さようなら",
          en: "Goodbye",
        },
      })
      .build("ja");

    expect(messages.title()).toBe("タイトルテスト");
    expect(messages["greeting.hello"]()).toBe("こんにちは");
    expect(messages["greeting.bye"]()).toBe("さようなら");
  });

  it("supports template functions with type inference", () => {
    const messages = createI18n(LOCALES)
      .add({
        welcome: {
          ja: "ようこそ",
          en: "Welcome",
        },
      })
      .addTemplates<{ name: string; age: number }>()({
        greet: ({ name, age }) => ({
          ja: `こんにちは、${name}さん。${age}歳ですね。`,
          en: `Hello, ${name}. You are ${age}.`,
        }),
      })
      .build("ja");

    expect(messages.welcome()).toBe("ようこそ");
    expect(messages.greet({ name: "太郎", age: 25 })).toBe("こんにちは、太郎さん。25歳ですね。");
  });

  it("supports adding multiple template messages at once with unified type", () => {
    const messages = createI18n(LOCALES)
      .addTemplates<{ name: string }>()({
        greet: (ctx) => ({
          ja: `こんにちは、${ctx.name}さん`,
          en: `Hello, ${ctx.name}`,
        }),
        farewell: (ctx) => ({
          ja: `さようなら、${ctx.name}さん`,
          en: `Goodbye, ${ctx.name}`,
        }),
      })
      .build("ja");

    expect(messages.greet({ name: "太郎" })).toBe("こんにちは、太郎さん");
    expect(messages.farewell({ name: "花子" })).toBe("さようなら、花子さん");
  });

  it("works with applyLocale function", () => {
    const builder = createI18n(LOCALES)
      .add({
        title: { ja: "タイトル", en: "Title" },
      })
      .addTemplates<{ name: string }>()({
        msg: (c) => ({
          ja: `こんにちは、${c.name}さん`,
          en: `Hello, ${c.name}`,
        }),
      });

    const localized = bindLocale(builder, "en");
    expect(localized.title()).toBe("Title");
    expect(localized.msg({ name: "John" })).toBe("Hello, John");
  });

  it("build() with locale parameter applies locale before building", () => {
    const messages = createI18n(LOCALES)
      .add({
        title: { ja: "タイトル", en: "Title" },
        greeting: { ja: "こんにちは", en: "Hello" },
      })
      .addTemplates<{ name: string }>()({
        welcome: (ctx) => ({
          ja: `ようこそ、${ctx.name}さん`,
          en: `Welcome, ${ctx.name}`,
        }),
      })
      .build("en");

    expect(messages.title()).toBe("Title");
    expect(messages.greeting()).toBe("Hello");
    expect(messages.welcome({ name: "John" })).toBe("Welcome, John");
  });

  it("build() without locale parameter uses default locale (first locale in array)", () => {
    const messages = createI18n(LOCALES)
      .add({
        title: { ja: "タイトル", en: "Title" },
      })
      .build();

    expect(messages.title()).toBe("タイトル");
  });

  it("build(locale) does not mutate the builder instance", () => {
    const builder = createI18n(LOCALES)
      .add({
        title: { ja: "タイトル", en: "Title" },
      });

    const englishMessages = builder.build("en");
    const japaneseMessages = builder.build("ja");

    expect(englishMessages.title()).toBe("Title");
    expect(japaneseMessages.title()).toBe("タイトル");
  });

  it("applyLocale works with ChainBuilder instances", () => {
    const builders = {
      builder1: createI18n(LOCALES).add({ title: { ja: "タイトル", en: "Title" } }),
      builder2: createI18n(LOCALES).add({ greeting: { ja: "こんにちは", en: "Hello" } }),
    };
    const buildersApplied = bindLocale(builders, "ja");
    expect(buildersApplied.builder1.title()).toBe("タイトル");
    expect(buildersApplied.builder2.greeting()).toBe("こんにちは");
  });

  it("applyLocale works deeply with nested ChainBuilder instances", () => {
    const builders = {
      builder1: {
        builder1child: createI18n(LOCALES).add({ title: { ja: "タイトル", en: "Title" } }),
      },
      builder2: createI18n(LOCALES).add({ greeting: { ja: "こんにちは", en: "Hello" } }),
    };
    const buildersApplied = bindLocale(builders, "ja");
    expect(buildersApplied.builder1.builder1child.title()).toBe("タイトル");
    expect(buildersApplied.builder2.greeting()).toBe("こんにちは");
  });

  it("applyLocale works with very deep nested structures", () => {
    const builders = {
      level1: {
        level2: {
          level3: createI18n(LOCALES).add({ deep: { ja: "深い", en: "Deep" } }),
        },
        builder: createI18n(LOCALES).add({ msg: { ja: "メッセージ", en: "Message" } }),
      },
    };
    const buildersApplied = bindLocale(builders, "en");
    expect(buildersApplied.level1.level2.level3.deep()).toBe("Deep");
    expect(buildersApplied.level1.builder.msg()).toBe("Message");
  });

  it("add() supports custom return types", () => {
    type MenuItem = {
      label: string;
      url: string;
    };

    const messages = createI18n(LOCALES)
      .add({
        home: {
          ja: { label: "ホーム", url: "/" },
          en: { label: "Home", url: "/" },
        },
        settings: {
          ja: { label: "設定", url: "/settings" },
          en: { label: "Settings", url: "/settings" },
        },
      })
      .build("en");

    const home = messages.home();
    expect(home.label).toBe("Home");
    expect(home.url).toBe("/");

    const settings = messages.settings();
    expect(settings.label).toBe("Settings");
    expect(settings.url).toBe("/settings");
  });

  it("addTemplates() supports custom return types", () => {
    type ButtonData = {
      text: string;
      color: string;
    };

    type ButtonContext = {
      label: string;
    };

    const messages = createI18n(LOCALES)
      .addTemplates<ButtonContext>()({
        button: (ctx) => ({
          ja: { text: ctx.label, color: "青" },
          en: { text: ctx.label, color: "blue" },
        }),
      })
      .build("en");

    const button = messages.button({ label: "Submit" });
    expect(button.text).toBe("Submit");
    expect(button.color).toBe("blue");
  });

  it("supports mixing string messages and custom return types", () => {
    type Badge = {
      text: string;
      level: "info" | "warning" | "error";
    };

    const messages = createI18n(LOCALES)
      .add({
        title: { ja: "タイトル", en: "Title" },
      })
      .add({
        badge: {
          ja: { text: "新着", level: "info" },
          en: { text: "NEW", level: "info" },
        },
      })
      .build("en");

    expect(messages.title()).toBe("Title");

    const badge = messages.badge();
    expect(badge.text).toBe("NEW");
    expect(badge.level).toBe("info");
  });
});
