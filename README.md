# canopy-i18n

A tiny, type-safe i18n library for building localized messages with builder pattern and applying locales across nested data structures.

![スクリーンショット](https://raw.githubusercontent.com/mohhh-ok/canopy-i18n/main/docs/images/hero.gif)


## Features
- **AI-friendly**: Full type safety and single-file colocation give AI assistants complete context for accurate code generation.
- **Type-safe**: Compile-time safety for locale keys with full TypeScript IntelliSense support.
- **Flexible templating**: Plain functions support any JavaScript logic, template literals, or formatting library.
- **Generic return types**: Return strings, React components, objects, or any custom type.
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
  .addTemplates<{ name: string }>()({
    welcome: ({ name }) => ({
      en: `Welcome, ${name}!`,
      ja: `ようこそ、${name}さん！`
    })
  }).build('en');

console.log(messages.welcome({ name: 'Alice' }));  // "Welcome, Alice!"
```

**With custom return types:**
```ts
type MenuItem = { label: string; url: string };

const menu = createI18n(['en', 'ja'] as const)
  .add<MenuItem>({
    home: {
      en: { label: 'Home', url: '/en' },
      ja: { label: 'ホーム', url: '/ja' }
    }
  }).build('ja');

console.log(menu.home().label);  // "ホーム"
console.log(menu.home().url);    // "/ja"
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
  })
  .addTemplates<{ name: string; age: number }>()({
    welcome: (ctx) => ({
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

#### `.add<ReturnType = string, K extends string = string>(entries)`
Adds multiple messages at once. By default, returns `string`, but you can specify a custom return type.

- **ReturnType**: (optional) Type parameter for the return value (defaults to `string`)
- **K**: (optional) Type parameter for the keys of the entries record (defaults to `string`)
- **entries**: `Record<K, Record<Locale, ReturnType>>`
- Returns: `ChainBuilder` with added messages

```ts
// String messages (default)
const builder = createI18n(['ja', 'en'] as const)
  .add({
    title: { ja: 'タイトル', en: 'Title' },
    greeting: { ja: 'こんにちは', en: 'Hello' },
  });

// Custom return type (e.g., React components)
const messages = createI18n(['ja', 'en'] as const)
  .add<JSX.Element>({
    badge: {
      ja: <span style={{ background: '#ff4444', color: 'white', padding: '2px 6px', borderRadius: '2px' }}>🔴 新着</span>,
      en: <span style={{ background: '#4caf50', color: 'white', padding: '4px 12px', borderRadius: '16px' }}>✨ NEW</span>,
    },
  });

// Custom return type (objects)
type MenuItem = {
  label: string;
  url: string;
  icon: string;
};

const menu = createI18n(['ja', 'en'] as const)
  .add<MenuItem>({
    home: {
      ja: { label: 'ホーム', url: '/ja', icon: '🏠' },
      en: { label: 'Home', url: '/en', icon: '🏡' },
    },
  });
```

#### `.addTemplates<Context, ReturnType = string, K extends string = string>()(entries)`
Adds multiple template function messages at once with a unified context type and custom return type.

Note: This uses a curried API for better type inference. Call `addTemplates<Context, ReturnType, K>()` first, then call the returned function with entries.

- **Context**: Type parameter for the template function context
- **ReturnType**: (optional) Type parameter for the return value (defaults to `string`)
- **K**: (optional) Type parameter for the keys of the entries record (defaults to `string`)
- **entries**: `Record<K, (ctx: Context) => Record<Locale, ReturnType>>`
- Returns: `ChainBuilder` with added template messages

```ts
const builder = createI18n(['ja', 'en'] as const)
  .addTemplates<{ name: string; age: number }>()({
    greet: (ctx) => ({
      ja: `こんにちは、${ctx.name}さん。${ctx.age}歳ですね。`,
      en: `Hello, ${ctx.name}. You are ${ctx.age}.`,
    }),
    farewell: (ctx) => ({
      ja: `さようなら、${ctx.name}さん。`,
      en: `Goodbye, ${ctx.name}.`,
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
export type LocalizedMessage<Locales, Context, ReturnType = string> = I18nMessage<Locales, Context, ReturnType>;
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
  .addTemplates<{ name: string; age: number }>()({
    profile: (ctx) => ({
      ja: `名前: ${ctx.name}、年齢: ${ctx.age}歳`,
      en: `Name: ${ctx.name}, Age: ${ctx.age}`,
    }),
  })
  .build('en');

console.log(messages.profile({ name: 'Taro', age: 25 }));
// "Name: Taro, Age: 25"
```

### Mixing String and Template Messages

```ts
const messages = createI18n(['ja', 'en'] as const)
  .add({
    title: { ja: 'タイトル', en: 'Title' },
  })
  .addTemplates<{ count: number }>()({
    items: (ctx) => ({
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

export const user = createI18n(LOCALES).addTemplates<{ name: string }>()({
  welcome: (ctx) => ({
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


## Repository

https://github.com/MOhhh-ok/canopy-i18n
