---
name: canopy-i18n
description: Use this skill when writing code that uses the canopy-i18n package — a type-safe, zero-dependency i18n library with a builder pattern API. Covers createI18n, add (static and template), build, bindLocale, React integration, and common gotchas like required `as const`.
---

# canopy-i18n — AI Code Generation Reference

A type-safe i18n library using the builder pattern. This reference helps AI assistants generate accurate code for this package.

## Package Overview

- **Type-safe**: Compile-time detection of typos in locale keys via TypeScript inference
- **Builder pattern**: Define translations with method chaining
- **Zero dependencies**: Native TypeScript only
- **ESM only**: Requires `"type": "module"` in `package.json`
- **Node.js 20+**

---

## Installation

```bash
npm install canopy-i18n
```

`package.json` must include `"type": "module"`.

---

## Core API

### `createI18n(locales)`

Creates a builder. **`as const` is required** for type inference.

```ts
import { createI18n } from 'canopy-i18n';

const builder = createI18n(['en', 'ja'] as const);
```

### `.add(entries)`

Adds messages. Each entry can be a static locale record or a template function. Static and template can be mixed in a single `.add()`.

```ts
const builder = createI18n(['en', 'ja'] as const)
  .add({
    title: { en: 'Title', ja: 'タイトル' },
    greeting: (ctx: { name: string; age: number }) => ({
      en: `Hello, ${ctx.name}. You are ${ctx.age}.`,
      ja: `こんにちは、${ctx.name}さん。${ctx.age}歳です。`,
    }),
  });
```

Returns a new `ChainBuilder` (immutable).

### `.build(locale)`

Builds the final messages object. Does not mutate the builder — you can build multiple locales from one builder. All messages are called as functions.

```ts
const enMessages = builder.build('en');
console.log(enMessages.title());                          // "Title"
console.log(enMessages.greeting({ name: 'Taro', age: 25 })); // "Hello, Taro. You are 25."
```

### `bindLocale(obj, locale)`

Recursively traverses an object/array and calls `.build(locale)` on every `ChainBuilder` it finds. Used for the namespace pattern.

```ts
import { bindLocale } from 'canopy-i18n';

const data = { common: commonBuilder, user: userBuilder };
const messages = bindLocale(data, 'en');
console.log(messages.common.hello());
```

---

## Critical Gotchas

| Mistake | Fix |
|---------|-----|
| `createI18n(['en', 'ja'])` | `createI18n(['en', 'ja'] as const)` — without `as const`, locale keys become `string` and inference breaks |
| `messages.title` | `messages.title()` — all messages are functions, not strings |
| Mutating builder via `build()` | `.build()` is immutable; build multiple locales from one builder |
| CommonJS `require()` | ESM only; use `import` |

---

## Namespace Pattern (Split Files + bindLocale)

```ts
// i18n/locales.ts
export const LOCALES = ['en', 'ja'] as const;

// i18n/common.ts
import { createI18n } from 'canopy-i18n';
import { LOCALES } from './locales';

export const common = createI18n(LOCALES).add({
  hello: { en: 'Hello', ja: 'こんにちは' },
});

// i18n/user.ts
export const user = createI18n(LOCALES).add({
  welcome: (ctx: { name: string }) => ({
    en: `Welcome, ${ctx.name}`,
    ja: `ようこそ、${ctx.name}さん`,
  }),
});

// app.ts
import { bindLocale } from 'canopy-i18n';
import * as i18n from './i18n';

const messages = bindLocale(i18n, 'en');
console.log(messages.common.hello());
console.log(messages.user.welcome({ name: 'John' }));
```

---

## React Integration

`canopy-i18n/react` exposes `createI18nReact(LOCALES)`, returning a Provider, hooks, and a pre-bound `i18n` shorthand.

### Setup

```tsx
// i18n.ts
import { createI18nReact } from 'canopy-i18n/react';

export const LOCALES = ['en', 'ja'] as const;

export const { i18n, LocaleProvider, useLocale, useBindLocale } =
  createI18nReact(LOCALES);

// `i18n(...)` is `ChainBuilder.add(...)` pre-bound to LOCALES.
export const appI18n = i18n({
  title: { en: 'My App', ja: 'マイアプリ' },
  greeting: (ctx: { name: string }) => ({
    en: `Hello, ${ctx.name}!`,
    ja: `こんにちは、${ctx.name}さん！`,
  }),
});
```

### Provider — three modes

**Uncontrolled** (in-memory, no persistence):

```tsx
<LocaleProvider defaultLocale="en">
  <App />
</LocaleProvider>
```

**Controlled** (locale lives outside React):

```tsx
<LocaleProvider locale={currentLocale} onLocaleChange={setCurrentLocale}>
  <App />
</LocaleProvider>
```

**Source-driven** (factory option `useLocaleSource`). The Provider reads locale from the hook on every render; `setLocale` calls `onLocaleChange`.

```tsx
export const { LocaleProvider, useLocale } = createI18nReact(LOCALES, {
  useLocaleSource: () => useMyStore((s) => s.locale),
  onLocaleChange: (l) => useMyStore.getState().setLocale(l),
});

<LocaleProvider><App /></LocaleProvider>
```

### Built-in source wrappers

Ready-made factories for common sources. Each returns the same shape as `createI18nReact` and operates in source-driven mode (`<LocaleProvider>` with no props).

```tsx
import {
  createHashI18nReact,     // URL hash (#ja)
  createSearchI18nReact,   // URL search param (?lang=ja)
  createPathnameI18nReact, // URL pathname prefix (/ja/...)
  createStorageI18nReact,  // localStorage
  createCookieI18nReact,   // Cookie
} from 'canopy-i18n/react';

export const { LocaleProvider, useLocale, useBindLocale } =
  createHashI18nReact(LOCALES);
```

Options:
- `createSearchI18nReact(LOCALES, { param })` — defaults to `lang`
- `createPathnameI18nReact(LOCALES, { basePath })` — defaults to `""`
- `createStorageI18nReact(LOCALES, { key })` — defaults to `canopy-i18n-locale`
- `createCookieI18nReact(LOCALES, { key, maxAge, path, sameSite })` — defaults to `canopy-i18n-locale` / 1 year / `/` / `Lax`

### Components

```tsx
import { appI18n, useBindLocale, useLocale } from './i18n';

export default function App() {
  const m = useBindLocale({ appI18n });
  const { locale, setLocale } = useLocale();
  return (
    <div>
      <h1>{m.appI18n.title()}</h1>
      <p>{m.appI18n.greeting({ name: 'Taro' })}</p>
      <button onClick={() => setLocale(locale === 'en' ? 'ja' : 'en')}>{locale}</button>
    </div>
  );
}
```

`useBindLocale(msgsDef)` is memoized per `(msgsDef, locale)`. The `Locale` of every nested `ChainBuilder` must match the Provider's `LOCALES`; mismatches fail at compile time.

React is a `peerDependency` (`>=18`).

---

## AI Translation (unstable)

`canopy-i18n/unstable_ai` provides a runtime translator with a pluggable adapter (bring any AI backend). Static strings only — template functions are not translated. See README for details.

```ts
import { createAITranslator, memoryCache, openAIAdapter } from 'canopy-i18n/unstable_ai';

const translator = createAITranslator({
  // Built-in adapters: openAIAdapter / anthropicAdapter / geminiAdapter
  // (fetch-based; model & apiKey required; baseURL/instructions optional).
  // Or implement AIAdapter yourself: { async translate({ texts, from, to }) {...} }
  // (`from` is undefined when the source language is unknown — auto-detect it)
  adapter: openAIAdapter({ model: 'gpt-4o-mini', apiKey: process.env.OPENAI_API_KEY! }),
  sourceLocale: 'ja',       // default `from` (optional; required for completeEntries)
  cache: memoryCache(),     // optional; custom { get, set } for DB persistence
  // onError: 'fallback'    // default: return original text on failure ('throw' to propagate)
});

// Custom adapters can reuse the built-in prompt logic:
// buildTranslatePrompt(request, { instructions }) / parseTranslatedTexts(raw, expected)

// Dynamic texts (e.g. user input) — cached, deduplicated, batched
await translator.translate(userInput, { to: 'en' });          // from = sourceLocale
await translator.translate(userInput, { to: 'en', from: 'fr' });
// Without sourceLocale and `from`, the adapter auto-detects the source language

// Fill missing locales of entries, then pass to ChainBuilder.add()
const entries = await translator.completeEntries(['ja', 'en'] as const, {
  title: { ja: 'タイトル' },  // en is AI-translated; existing values are kept
});
const messages = createI18n(['ja', 'en'] as const).add(entries).build('en');
```

---

## Exports

```ts
// Core
export { createI18n, ChainBuilder, bindLocale } from 'canopy-i18n';
export { I18nMessage, isI18nMessage, isChainBuilder } from 'canopy-i18n';
export type { Template, LocalizedMessage } from 'canopy-i18n';

// React subpath
export {
  createI18nReact,
  createHashI18nReact,
  createSearchI18nReact,
  createPathnameI18nReact,
  createStorageI18nReact,
  createCookieI18nReact,
} from 'canopy-i18n/react';

// AI subpath (unstable)
export { createAITranslator, AITranslator, memoryCache } from 'canopy-i18n/unstable_ai';
export { openAIAdapter, anthropicAdapter, geminiAdapter } from 'canopy-i18n/unstable_ai';
export { buildTranslatePrompt, parseTranslatedTexts } from 'canopy-i18n/unstable_ai';
export type { AIAdapter, TranslationCache } from 'canopy-i18n/unstable_ai';
```
