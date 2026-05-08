# canopy-i18n

A tiny, type-safe i18n library for building localized messages with builder pattern and applying locales across nested data structures.

## Features
- **AI-friendly**: Full type safety and single-file colocation give AI assistants complete context for accurate code generation.
- **Type-safe**: Compile-time safety for locale keys with full TypeScript IntelliSense support.
- **Flexible templating**: Plain functions support any JavaScript logic, template literals, or formatting library.
- **Zero dependencies**: Lightweight with native TypeScript syntax, no custom {{placeholder}} format.
## Why Canopy i18n?

Traditional i18n libraries require separate JSON files and string-based key lookups:

**Traditional approach:**
```ts
// locales/en.json
{ "greeting": "Hello", "farewell": "Goodbye" }

// locales/ja.json
{ "greeting": "こんにちは", "farewell": "さようなら" }

// app.ts
import i18next from 'i18next';

await i18next.init({ /* config... */ });
console.log(i18next.t('greeting'));  // No type safety, typos cause silent failures
```

**Canopy i18n:**
```ts
import { createI18n } from 'canopy-i18n';

const messages = createI18n(['en', 'ja'] as const).add({
  greeting: { en: 'Hello', ja: 'こんにちは' },
  farewell: { en: 'Goodbye', ja: 'さようなら' }
}).build('en');

console.log(messages.greeting());  // Fully type-safe, autocomplete works
```

**With template functions:**
```ts
const messages = createI18n(['en', 'ja'] as const)
  .add({
    welcome: (ctx: { name: string }) => ({
      en: `Welcome, ${ctx.name}!`,
      ja: `ようこそ、${ctx.name}さん！`
    })
  }).build('en');

console.log(messages.welcome({ name: 'Alice' }));  // "Welcome, Alice!"
```

**Benefits:**
- 🔒 **Type safety**: Typos caught at compile time, full autocomplete support
- 📁 **Colocation**: All translations in one place, no file jumping
- ⚡ **Zero config**: No loaders, plugins, or initialization required
- 🚀 **Framework agnostic**: Works anywhere JavaScript runs

## Installation

```bash
npm install canopy-i18n
# or
pnpm add canopy-i18n
# or
yarn add canopy-i18n
# or
bun add canopy-i18n
```

## Quick Start

```ts
import { createI18n, bindLocale } from 'canopy-i18n';

// 1) Create a builder with allowed locales
const baseBuilder = createI18n(['ja', 'en'] as const);

// 2) Define messages using method chaining
// Note: Each method returns a new immutable builder instance
const builder = baseBuilder
  .add({
    title: {
      ja: 'タイトルテスト',
      en: 'Title Test',
    },
    greeting: {
      ja: 'こんにちは',
      en: 'Hello',
    },
    welcome: (ctx: { name: string; age: number }) => ({
      ja: `こんにちは、${ctx.name}さん。あなたは${ctx.age}歳です。`,
      en: `Hello, ${ctx.name}. You are ${ctx.age} years old.`,
    }),
  });

// 3) Reuse the builder to create messages for different locales
const enMessages = builder.build('en');
const jaMessages = builder.build('ja');

// 4) Use messages (English)
console.log(enMessages.title());                        // "Title Test"
console.log(enMessages.greeting());                     // "Hello"
console.log(enMessages.welcome({ name: 'Tanaka', age: 20 })); // "Hello, Tanaka. You are 20 years old."

// 5) Use messages (Japanese)
console.log(jaMessages.title());                        // "タイトルテスト"
console.log(jaMessages.greeting());                     // "こんにちは"
console.log(jaMessages.welcome({ name: 'Tanaka', age: 20 })); // "こんにちは、Tanakaさん。あなたは20歳です。"
```

## API

### `createI18n(locales)`
Creates a `ChainBuilder` instance to build localized messages.

- **locales**: `readonly string[]` — Allowed locale keys (e.g. `['ja', 'en'] as const`).
- Returns: `ChainBuilder<Locales, {}>` — A builder instance to chain message definitions.

```ts
const builder = createI18n(['ja', 'en', 'fr'] as const);
```

### `ChainBuilder`
A builder class for creating multiple localized messages with method chaining.

#### `.add(entries)`
Adds multiple messages at once. Each entry can be a static locale record or a template function.

- **entries**: `Record<K, Record<Locale, string> | ((ctx: C) => Record<Locale, string>)>`
- Returns: `ChainBuilder` with added messages

```ts
// Static messages
const builder = createI18n(['ja', 'en'] as const)
  .add({
    title: { ja: 'タイトル', en: 'Title' },
    greeting: { ja: 'こんにちは', en: 'Hello' },
  });

// Template functions
const builder2 = createI18n(['ja', 'en'] as const)
  .add({
    greet: (ctx: { name: string; age: number }) => ({
      ja: `こんにちは、${ctx.name}さん。${ctx.age}歳ですね。`,
      en: `Hello, ${ctx.name}. You are ${ctx.age}.`,
    }),
    farewell: (ctx: { name: string }) => ({
      ja: `さようなら、${ctx.name}さん。`,
      en: `Goodbye, ${ctx.name}.`,
    }),
  });

// Mixing static and template messages
const builder3 = createI18n(['ja', 'en'] as const)
  .add({
    title: { ja: 'タイトル', en: 'Title' },
    greet: (ctx: { name: string }) => ({
      ja: `こんにちは、${ctx.name}さん`,
      en: `Hello, ${ctx.name}`,
    }),
  });
```



#### `.build(locale)`
Builds the final messages object.

- **locale**: `Locale` — Sets this locale on all messages before returning.
- Returns: `Messages` — An object containing all defined messages

```ts
const englishMessages = builder.build('en');
const japaneseMessages = builder.build('ja');
```

**Note**: `build(locale)` creates a deep clone and does not mutate the builder instance, allowing you to build multiple locale versions from the same builder.

### `bindLocale(obj, locale)`
Recursively traverses objects/arrays and sets the given locale on all `I18nMessage` instances and builds all `ChainBuilder` instances encountered.

- **obj**: Any object/array structure containing messages or builders
- **locale**: The locale to apply
- Returns: A new structure with locale applied (containers are cloned, message instances are updated in place)

```ts
const data = {
  common: builder1,
  nested: {
    special: builder2,
  },
};

const localized = bindLocale(data, 'en');
console.log(localized.common.title());      // English version
console.log(localized.nested.special.msg()); // English version
```

**Note**: `bindLocale` works with both `ChainBuilder` instances (automatically building them with the specified locale) and already-built message objects (updating their locale).

## Types

```ts
export type Template<C, R = string> = R | ((ctx: C) => R);
export type LocalizedMessage<Locales, Context> = I18nMessage<Locales, Context>;
```

## Exports

```ts
export { createI18n, ChainBuilder } from 'canopy-i18n';
export { I18nMessage, isI18nMessage } from 'canopy-i18n';
export { bindLocale, isChainBuilder } from 'canopy-i18n';
export type { Template, LocalizedMessage } from 'canopy-i18n';
```

## Usage Patterns


### Basic String Messages

```ts
const messages = createI18n(['ja', 'en'] as const)
  .add({
    title: { ja: 'タイトル', en: 'Title' },
    greeting: { ja: 'こんにちは', en: 'Hello' },
    farewell: { ja: 'さようなら', en: 'Goodbye' },
  })
  .build('en');

console.log(messages.title());    // "Title"
console.log(messages.greeting()); // "Hello"
```

### Template Functions with Context

```ts
const messages = createI18n(['ja', 'en'] as const)
  .add({
    profile: (ctx: { name: string; age: number }) => ({
      ja: `名前: ${ctx.name}、年齢: ${ctx.age}歳`,
      en: `Name: ${ctx.name}, Age: ${ctx.age}`,
    }),
  })
  .build('en');

console.log(messages.profile({ name: 'Taro', age: 25 }));
// "Name: Taro, Age: 25"
```

### Mixing Static and Template Messages

```ts
const messages = createI18n(['ja', 'en'] as const)
  .add({
    title: { ja: 'タイトル', en: 'Title' },
    items: (ctx: { count: number }) => ({
      ja: `${ctx.count}個のアイテム`,
      en: `${ctx.count} items`,
    }),
  })
  .build('ja');

console.log(messages.title());           // "タイトル"
console.log(messages.items({ count: 5 })); // "5個のアイテム"
```



### Namespace Pattern (Split Files)

```ts
// i18n/locales.ts
export const LOCALES = ['ja', 'en'] as const;

// i18n/common.ts
import { createI18n } from 'canopy-i18n';
import { LOCALES } from './locales';

export const common = createI18n(LOCALES).add({
  hello: { ja: 'こんにちは', en: 'Hello' },
  goodbye: { ja: 'さようなら', en: 'Goodbye' },
});

// i18n/user.ts
import { createI18n } from 'canopy-i18n';
import { LOCALES } from './locales';

export const user = createI18n(LOCALES).add({
  welcome: (ctx: { name: string }) => ({
    ja: `ようこそ、${ctx.name}さん`,
    en: `Welcome, ${ctx.name}`,
  }),
});

// i18n/index.ts
export { common } from './common';
export { user } from './user';

// app.ts
import { bindLocale } from 'canopy-i18n';
import * as i18n from './i18n';

const messages = bindLocale(i18n, 'en');
console.log(messages.common.hello());              // "Hello"
console.log(messages.user.welcome({ name: 'John' })); // "Welcome, John"
```

### Dynamic Locale Switching

```ts
const builder = createI18n(['ja', 'en'] as const)
  .add({
    title: { ja: 'タイトル', en: 'Title' },
  });

// Build different locale versions from the same builder
const jaMessages = builder.build('ja');
const enMessages = builder.build('en');

console.log(jaMessages.title()); // "タイトル"
console.log(enMessages.title()); // "Title"
```

### Deep Nested Structures

```ts
const structure = {
  header: createI18n(['ja', 'en'] as const)
    .add({ title: { ja: 'ヘッダー', en: 'Header' } }),
  content: {
    main: createI18n(['ja', 'en'] as const)
      .add({ body: { ja: '本文', en: 'Body' } }),
    sidebar: createI18n(['ja', 'en'] as const)
      .add({ widget: { ja: 'ウィジェット', en: 'Widget' } }),
  },
};

const localized = bindLocale(structure, 'en');
console.log(localized.header.title());           // "Header"
console.log(localized.content.main.body());      // "Body"
console.log(localized.content.sidebar.widget()); // "Widget"
```


## React Integration

`canopy-i18n/react` provides a tiny factory that returns a Provider, hooks, and a pre-bound `defineMessage` — all sharing the same `Locale` type.

```tsx
// i18n.ts
import { createI18nReact } from 'canopy-i18n/react';

export const LOCALES = ['en', 'ja'] as const;

export const { i18n, LocaleProvider, useLocale, useBindLocale } =
  createI18nReact(LOCALES);

export const appI18n = i18n({
  title: { en: 'My App', ja: 'マイアプリ' },
  greeting: (ctx: { name: string }) => ({
    en: `Hello, ${ctx.name}!`,
    ja: `こんにちは、${ctx.name}さん！`,
  }),
});
```

```tsx
// main.tsx
import { LocaleProvider } from './i18n';

<LocaleProvider defaultLocale="en">
  <App />
</LocaleProvider>
```

`LocaleProvider` also supports a controlled mode for integrating with URL routing, cookies, or external state:

```tsx
// Controlled mode: locale is owned by the parent
<LocaleProvider locale={currentLocale} onLocaleChange={setCurrentLocale}>
  <App />
</LocaleProvider>
```

In controlled mode, `setLocale` from `useLocale()` calls your `onLocaleChange` handler instead of mutating internal state.

`createI18nReact` also accepts a factory-level `useLocaleSource` for source-driven locale (e.g. external store, URL hook, cookie). When set, the Provider reads the locale from this hook and `setLocale` calls `onLocaleChange` instead of mutating internal state:

```tsx
export const { LocaleProvider, useLocale } = createI18nReact(LOCALES, {
  useLocaleSource: () => useMyStore((s) => s.locale),
  onLocaleChange: (l) => useMyStore.getState().setLocale(l),
});

<LocaleProvider>
  <App />
</LocaleProvider>
```

For common sources, `canopy-i18n/react` ships ready-made factories. Each returns the same shape as `createI18nReact` and operates in source-driven mode:

```tsx
import {
  createHashI18nReact,     // URL hash (#ja)
  createSearchI18nReact,   // URL search param (?lang=ja, configurable via { param })
  createPathnameI18nReact, // URL pathname prefix (/ja/..., configurable via { basePath })
  createStorageI18nReact,  // localStorage (configurable via { key })
  createCookieI18nReact,   // Cookie (configurable via { key, maxAge, path, sameSite })
} from 'canopy-i18n/react';

export const { LocaleProvider, useLocale, useBindLocale } =
  createHashI18nReact(LOCALES);

// Render <LocaleProvider> with no props.
```

```tsx
// App.tsx
import { appI18n, useBindLocale, useLocale } from './i18n';

function App() {
  const m = useBindLocale({ appI18n });
  const { locale, setLocale } = useLocale();

  return (
    <div>
      <h1>{m.appI18n.title()}</h1>
      <p>{m.appI18n.greeting({ name: 'Taro' })}</p>
      <button onClick={() => setLocale(locale === 'en' ? 'ja' : 'en')}>
        {locale}
      </button>
    </div>
  );
}
```

### Factory return value

```ts
const {
  locales,         // the LOCALES tuple you passed in
  i18n,            // function: i18n(entries) → ChainBuilder bound to LOCALES
  LocaleProvider,  // uncontrolled or controlled (see above)
  useLocale,       // () => { locale, setLocale }
  useBindLocale,   // memoized bindLocale, locale type-checked
} = createI18nReact(['en', 'ja'] as const);
```

`i18n` is a shorthand for `ChainBuilder.add` bound to a base builder. Each `i18n({...})` call returns an independent `ChainBuilder`, so you can keep chaining `.add({...}).add({...})` for additional entries.

- `useBindLocale(msgsDef)` is memoized per `(msgsDef, locale)` pair.
- The `Locale` type is derived from the `LOCALES` tuple. Passing a `ChainBuilder` whose locales differ from the Provider's locales is rejected at compile time.
- No built-in persistence. Use uncontrolled mode for in-memory state, or controlled mode to wire `localStorage` / URL / cookies / a router.
- React is a `peerDependency` (`>=18`). Non-React users can ignore the `/react` subpath entirely.

## Repository

https://github.com/MOhhh-ok/canopy-i18n
