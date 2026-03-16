---
name: canopy-i18n
description: Use this skill when writing code that uses the canopy-i18n package — a type-safe, zero-dependency i18n library with a builder pattern API. Covers createI18n, add, addTemplates (curried), build, bindLocale, React integration, and common gotchas like required `as const` and the two-step curried call syntax.
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
# or
pnpm add canopy-i18n
bun add canopy-i18n
```

`package.json` must include `"type": "module"`:

```json
{
  "type": "module"
}
```

---

## Core API

### `createI18n(locales)`

Creates a builder instance. **`as const` is required** for type inference.

```ts
import { createI18n } from 'canopy-i18n';

// ✅ Correct: use as const
const builder = createI18n(['en', 'ja'] as const);

// ❌ Wrong: without as const, type becomes string[] and type inference is lost
const builder = createI18n(['en', 'ja']);
```

- **Argument**: `readonly string[]` — allowed locale keys
- **Returns**: `ChainBuilder<Locales, {}>` — a chain builder instance

---

### `.add<R, K>(entries)`

Adds multiple static messages (string or custom type).

```ts
// Default (string type)
const builder = createI18n(['en', 'ja'] as const)
  .add({
    title: { en: 'Title', ja: 'タイトル' },
    greeting: { en: 'Hello', ja: 'こんにちは' },
  });

// Custom return type (object)
type MenuItem = { label: string; url: string };

const menu = createI18n(['en', 'ja'] as const)
  .add<MenuItem>({
    home: {
      en: { label: 'Home', url: '/en' },
      ja: { label: 'Home', url: '/ja' },
    },
  });
```

- **Type param `R`**: return value type (default: `string`)
- **Type param `K`**: key type for entries (usually omitted)
- **entries**: `Record<K, Record<Locale, R>>`
- **Returns**: new `ChainBuilder` (immutable)

---

### `.addTemplates<C, R, K>()(entries)`

**Curried API — two-step call required.** Adds template functions that receive a context object of type `C`.

```ts
// ⚠️ Curried: two-step call ()() is mandatory
const builder = createI18n(['en', 'ja'] as const)
  .addTemplates<{ name: string; age: number }>()({  // note: ()() two steps
    greeting: (ctx) => ({
      en: `Hello, ${ctx.name}. You are ${ctx.age}.`,
      ja: `こんにちは、${ctx.name}さん。${ctx.age}歳です。`,
    }),
  });

// Custom return type (JSX.Element)
const jsxBuilder = createI18n(['en', 'ja'] as const)
  .addTemplates<{ name: string }, JSX.Element>()({
    badge: ({ name }) => ({
      en: <strong>Welcome, {name}!</strong>,
      ja: <strong>ようこそ、{name}さん！</strong>,
    }),
  });
```

- **Type param `C`**: context object type (**required**)
- **Type param `R`**: return value type (default: `string`)
- **Type param `K`**: key type (usually omitted)
- **entries**: `Record<K, (ctx: C) => Record<Locale, R>>`
- **Returns**: new `ChainBuilder` (immutable)

---

### `.build(locale?)`

Builds the final messages object.

```ts
const builder = createI18n(['en', 'ja'] as const)
  .add({ title: { en: 'Title', ja: 'タイトル' } });

// With specific locale
const enMessages = builder.build('en');
const jaMessages = builder.build('ja');

// Without locale — defaults to first locale in array
const defaultMessages = builder.build(); // uses 'en'

// All messages are called as functions
console.log(enMessages.title()); // "Title"
console.log(jaMessages.title()); // "タイトル"
```

- **Argument `locale`**: optional; defaults to first locale in array
- **Returns**: `{ [key]: () => R }` or `{ [key]: (ctx: C) => R }`
- **Immutable**: `.build()` does not mutate the builder — you can generate multiple locales from one builder

---

### `bindLocale(obj, locale)`

Recursively traverses an object/array and calls `.build(locale)` on all `ChainBuilder` instances found. Used for the namespace pattern (split files).

```ts
import { bindLocale } from 'canopy-i18n';

const data = {
  common: commonBuilder,
  nested: {
    user: userBuilder,
  },
};

const messages = bindLocale(data, 'en');
console.log(messages.common.hello());                    // "Hello"
console.log(messages.nested.user.welcome({ name: 'John' })); // "Welcome, John"
```

- **Argument `obj`**: any object/array containing `ChainBuilder` instances
- **Argument `locale`**: locale string to apply
- **Returns**: new structure with all builders resolved

---

## Critical Gotchas

### 1. `as const` is required

```ts
// ✅ Correct
createI18n(['en', 'ja'] as const)

// ❌ Type error — locale keys become string, inference breaks
createI18n(['en', 'ja'])
```

### 2. `addTemplates` is curried — two-step call

```ts
// ✅ Correct: ()() two steps
.addTemplates<{ name: string }>()({
  key: (ctx) => ({ en: `Hello, ${ctx.name}` })
})

// ❌ Wrong: one-step call causes type error
.addTemplates<{ name: string }>({
  key: (ctx) => ({ en: `Hello, ${ctx.name}` })
})
```

### 3. `.build()` is immutable

```ts
const builder = createI18n(['en', 'ja'] as const).add({ ... });

// ✅ Multiple locales from one builder
const enMessages = builder.build('en');
const jaMessages = builder.build('ja');
```

### 4. ESM only

```json
// Required in package.json
{ "type": "module" }
```

### 5. All messages must be called as functions

```ts
const m = builder.build('en');

// ✅ Call as a function
m.title()
m.greeting({ name: 'Alice' })

// ❌ Do not access as property — it is a function object, not a string
m.title
```

---

## Common Patterns

### Basic String Messages

```ts
import { createI18n } from 'canopy-i18n';

const messages = createI18n(['en', 'ja'] as const)
  .add({
    title: { en: 'Title', ja: 'タイトル' },
    greeting: { en: 'Hello', ja: 'こんにちは' },
    farewell: { en: 'Goodbye', ja: 'さようなら' },
  })
  .build('en');

console.log(messages.title());    // "Title"
console.log(messages.greeting()); // "Hello"
```

### Template Functions (Variable Interpolation)

```ts
import { createI18n } from 'canopy-i18n';

const messages = createI18n(['en', 'ja'] as const)
  .addTemplates<{ name: string; age: number }>()({
    profile: (ctx) => ({
      en: `Name: ${ctx.name}, Age: ${ctx.age}`,
      ja: `名前: ${ctx.name}、年齢: ${ctx.age}歳`,
    }),
  })
  .build('en');

console.log(messages.profile({ name: 'Taro', age: 25 }));
// "Name: Taro, Age: 25"
```

### Mixing Static and Template Messages

```ts
import { createI18n } from 'canopy-i18n';

const messages = createI18n(['en', 'ja'] as const)
  .add({
    title: { en: 'Items', ja: 'アイテム' },
  })
  .addTemplates<{ count: number }>()({
    count: (ctx) => ({
      en: `${ctx.count} items`,
      ja: `${ctx.count}個のアイテム`,
    }),
  })
  .build('en');

console.log(messages.title());             // "Items"
console.log(messages.count({ count: 5 })); // "5 items"
```

### Custom Return Type (Object)

```ts
import { createI18n } from 'canopy-i18n';

type MenuItem = { label: string; url: string; icon: string };

const menu = createI18n(['en', 'ja'] as const)
  .add<MenuItem>({
    home: {
      en: { label: 'Home', url: '/en', icon: '🏡' },
      ja: { label: 'ホーム', url: '/ja', icon: '🏠' },
    },
    about: {
      en: { label: 'About', url: '/en/about', icon: 'ℹ️' },
      ja: { label: '概要', url: '/ja/about', icon: 'ℹ️' },
    },
  })
  .build('en');

console.log(menu.home().label); // "Home"
console.log(menu.home().url);   // "/en"
```

### Custom Return Type (JSX)

```tsx
import { createI18n } from 'canopy-i18n';
import type { JSX } from 'react';

const messages = createI18n(['en', 'ja'] as const)
  .add<JSX.Element>({
    badge: {
      en: <span style={{ background: '#4caf50', color: 'white' }}>NEW</span>,
      ja: <span style={{ background: '#ff4444', color: 'white' }}>新着</span>,
    },
  })
  .addTemplates<{ name: string }, JSX.Element>()({
    greeting: ({ name }) => ({
      en: <strong>Welcome, {name}!</strong>,
      ja: <strong>ようこそ、{name}さん！</strong>,
    }),
  })
  .build('en');

const badge = messages.badge();
const greeting = messages.greeting({ name: 'Alice' });
```

### Namespace Pattern (Split Files + bindLocale)

```ts
// i18n/locales.ts
export const LOCALES = ['en', 'ja'] as const;
export type Locale = (typeof LOCALES)[number];

// i18n/common.ts
import { createI18n } from 'canopy-i18n';
import { LOCALES } from './locales';

export const common = createI18n(LOCALES).add({
  hello: { en: 'Hello', ja: 'こんにちは' },
  goodbye: { en: 'Goodbye', ja: 'さようなら' },
});

// i18n/user.ts
import { createI18n } from 'canopy-i18n';
import { LOCALES } from './locales';

export const user = createI18n(LOCALES)
  .addTemplates<{ name: string }>()({
    welcome: (ctx) => ({
      en: `Welcome, ${ctx.name}`,
      ja: `ようこそ、${ctx.name}さん`,
    }),
  });

// i18n/index.ts
export { common } from './common';
export { user } from './user';

// app.ts
import { bindLocale } from 'canopy-i18n';
import * as i18n from './i18n';

const messages = bindLocale(i18n, 'en');
console.log(messages.common.hello());                    // "Hello"
console.log(messages.user.welcome({ name: 'John' }));   // "Welcome, John"
```

### Deep Nested Structures

```ts
import { createI18n, bindLocale } from 'canopy-i18n';

const structure = {
  header: createI18n(['en', 'ja'] as const)
    .add({ title: { en: 'Header', ja: 'ヘッダー' } }),
  content: {
    main: createI18n(['en', 'ja'] as const)
      .add({ body: { en: 'Body', ja: '本文' } }),
    sidebar: createI18n(['en', 'ja'] as const)
      .add({ widget: { en: 'Widget', ja: 'ウィジェット' } }),
  },
};

const localized = bindLocale(structure, 'en');
console.log(localized.header.title());           // "Header"
console.log(localized.content.main.body());      // "Body"
console.log(localized.content.sidebar.widget()); // "Widget"
```

---

## React Integration

### Locale Context

```tsx
// LocaleContext.tsx
import { bindLocale } from 'canopy-i18n';
import { createContext, useContext, useState } from 'react';

type Locale = 'en' | 'ja';

type ContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<ContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider');
  return ctx;
}

// Reactively applies bindLocale based on current locale
export function useBindLocale<T extends object>(msgsDef: T) {
  const { locale } = useLocale();
  return bindLocale(msgsDef, locale);
}
```

### Usage in Components

```tsx
// i18n.ts — export ChainBuilders (not yet built)
import { createI18n } from 'canopy-i18n';

const LOCALES = ['en', 'ja'] as const;
export const defineMessage = () => createI18n(LOCALES);

export const appI18n = defineMessage()
  .add({
    title: { en: 'My App', ja: 'マイアプリ' },
    description: { en: 'Welcome!', ja: 'ようこそ！' },
  })
  .addTemplates<{ name: string }>()({
    greeting: (ctx) => ({
      en: `Hello, ${ctx.name}!`,
      ja: `こんにちは、${ctx.name}さん！`,
    }),
  });

// App.tsx — apply locale with useBindLocale
import { useBindLocale } from './LocaleContext';
import { appI18n } from './i18n';

export default function App() {
  const m = useBindLocale(appI18n);

  return (
    <div>
      <h1>{m.title()}</h1>
      <p>{m.description()}</p>
      <p>{m.greeting({ name: 'Taro' })}</p>
    </div>
  );
}
```

### Component-Local i18n (Colocation)

```tsx
// ProfileCard.tsx — define and use i18n in the same file
import { createI18n } from 'canopy-i18n';
import type { JSX } from 'react';
import { useBindLocale } from './LocaleContext';

const profileI18n = createI18n(['en', 'ja'] as const)
  .add({
    title: { en: 'User Profile', ja: 'ユーザープロフィール' },
    editButton: { en: 'Edit Profile', ja: 'プロフィール編集' },
  })
  .addTemplates<{ name: string }, JSX.Element>()({
    greeting: ({ name }) => ({
      en: <strong>Welcome, {name}!</strong>,
      ja: <strong>ようこそ、{name}さん！</strong>,
    }),
  });

export function ProfileCard({ name }: { name: string }) {
  const m = useBindLocale(profileI18n);

  return (
    <div>
      <h2>{m.title()}</h2>
      <div>{m.greeting({ name })}</div>
      <button>{m.editButton()}</button>
    </div>
  );
}
```

### Language Switcher Component

```tsx
// LanguageSwitcher.tsx
import { useLocale } from './LocaleContext';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div>
      <button onClick={() => setLocale('en')} disabled={locale === 'en'}>EN</button>
      <button onClick={() => setLocale('ja')} disabled={locale === 'ja'}>JA</button>
    </div>
  );
}
```

---

## Exports Reference

```ts
// Functions & Classes
export { createI18n } from 'canopy-i18n';      // create a builder
export { ChainBuilder } from 'canopy-i18n';    // builder class
export { I18nMessage } from 'canopy-i18n';     // message class
export { isI18nMessage } from 'canopy-i18n';   // type guard
export { bindLocale } from 'canopy-i18n';      // apply locale to nested structure
export { isChainBuilder } from 'canopy-i18n';  // type guard

// Types
export type { Template } from 'canopy-i18n';         // R | ((ctx: C) => R)
export type { LocalizedMessage } from 'canopy-i18n'; // built message function type
```

### Type Details

```ts
// Template<C, R>: a static value or a function that receives context
type Template<C, R = string> = R | ((ctx: C) => R);

// LocalizedMessage<Ls, C, R>: the function type after build()
// - when C is void: () => R
// - when C is present: (ctx: C) => R
type LocalizedMessage<Ls, C, R = string> =
  C extends void
    ? (() => R) & { __brand: "I18nMessage" }
    : ((ctx: C) => R) & { __brand: "I18nTemplateMessage" };
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `createI18n(['en', 'ja'])` | `createI18n(['en', 'ja'] as const)` |
| `.addTemplates<C>({ ... })` | `.addTemplates<C>()({ ... })` (two-step curried call) |
| `messages.title` | `messages.title()` (call as function) |
| CommonJS `require()` | Use ESM `import` |
| Typo in locale key | TypeScript catches it at compile time |
