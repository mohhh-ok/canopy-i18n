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

### `.add(entries)`

Adds multiple messages at once. Each entry can be a static locale record or a template function.

```ts
// Static messages
const builder = createI18n(['en', 'ja'] as const)
  .add({
    title: { en: 'Title', ja: 'タイトル' },
    greeting: { en: 'Hello', ja: 'こんにちは' },
  });

// Template functions
const builder2 = createI18n(['en', 'ja'] as const)
  .add({
    greeting: (ctx: { name: string; age: number }) => ({
      en: `Hello, ${ctx.name}. You are ${ctx.age}.`,
      ja: `こんにちは、${ctx.name}さん。${ctx.age}歳です。`,
    }),
  });

// Mixing static and template messages in a single add()
const builder3 = createI18n(['en', 'ja'] as const)
  .add({
    title: { en: 'Title', ja: 'タイトル' },
    greeting: (ctx: { name: string }) => ({
      en: `Hello, ${ctx.name}`,
      ja: `こんにちは、${ctx.name}さん`,
    }),
  });
```

- **entries**: `Record<K, Record<Locale, string> | ((ctx: C) => Record<Locale, string>)>`
- **Returns**: new `ChainBuilder` (immutable)

---

### `.build(locale)`

Builds the final messages object.

```ts
const builder = createI18n(['en', 'ja'] as const)
  .add({ title: { en: 'Title', ja: 'タイトル' } });

const enMessages = builder.build('en');
const jaMessages = builder.build('ja');

// All messages are called as functions
console.log(enMessages.title()); // "Title"
console.log(jaMessages.title()); // "タイトル"
```

- **Argument `locale`**: required
- **Returns**: `{ [key]: () => R }` or `{ [key]: (ctx: C) => R }`
- **Immutable**: `.build()` does not mutate the builder — you can generate multiple locales from one builder

---

### `bindLocale(obj, locale)`

Recursively traverses an object/array and calls `.build(locale)` on all `ChainBuilder` instances found. Used for the namespace pattern (split files). Since `build()` requires a locale, `bindLocale` provides it at the point of use.

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

### 2. `.build()` is immutable

```ts
const builder = createI18n(['en', 'ja'] as const).add({ ... });

// ✅ Multiple locales from one builder
const enMessages = builder.build('en');
const jaMessages = builder.build('ja');
```

### 3. ESM only

```json
// Required in package.json
{ "type": "module" }
```

### 4. All messages must be called as functions

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
  .add({
    profile: (ctx: { name: string; age: number }) => ({
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
    count: (ctx: { count: number }) => ({
      en: `${ctx.count} items`,
      ja: `${ctx.count}個のアイテム`,
    }),
  })
  .build('en');

console.log(messages.title());             // "Items"
console.log(messages.count({ count: 5 })); // "5 items"
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
  .add({
    welcome: (ctx: { name: string }) => ({
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

`canopy-i18n/react` exposes a single factory, `createI18nReact(LOCALES)`, that returns a Provider, hooks, and a `defineMessage` already bound to your locales. There is no separate `LocaleContext` to write yourself.

### Setup

```tsx
// i18n.ts — define LOCALES once and derive the React API from it
import { createI18nReact } from 'canopy-i18n/react';

export const LOCALES = ['en', 'ja'] as const;
export type Locale = (typeof LOCALES)[number];

export const { i18n, LocaleProvider, useLocale, useBindLocale } =
  createI18nReact(LOCALES);

// `i18n(...)` is a shorthand for `ChainBuilder.add(...)` pre-bound to LOCALES.
// Each call returns a new ChainBuilder — keep chaining `.add(...)` to extend it.
export const appI18n = i18n({
  title: { en: 'My App', ja: 'マイアプリ' },
  description: { en: 'Welcome!', ja: 'ようこそ！' },
  greeting: (ctx: { name: string }) => ({
    en: `Hello, ${ctx.name}!`,
    ja: `こんにちは、${ctx.name}さん！`,
  }),
});
```

### Provider

`LocaleProvider` supports two modes:

**Uncontrolled (default).** Locale state is in-memory only — there is no built-in persistence.

```tsx
// main.tsx
import { LocaleProvider } from './i18n';

<LocaleProvider defaultLocale="en">
  <App />
</LocaleProvider>
```

**Controlled.** Pass `locale` and `onLocaleChange` to integrate with URL routing, cookies, or external state. `setLocale` returned from `useLocale()` will call `onLocaleChange` instead of mutating internal state.

```tsx
<LocaleProvider locale={currentLocale} onLocaleChange={setCurrentLocale}>
  <App />
</LocaleProvider>
```

Use uncontrolled for simple apps. Use controlled when the locale lives outside React (URL segments like `/[locale]/...`, cookies, etc.).

### Components

```tsx
// App.tsx
import { appI18n, useBindLocale } from './i18n';

export default function App() {
  const m = useBindLocale({ appI18n });
  return (
    <div>
      <h1>{m.appI18n.title()}</h1>
      <p>{m.appI18n.description()}</p>
      <p>{m.appI18n.greeting({ name: 'Taro' })}</p>
    </div>
  );
}
```

`useBindLocale` accepts any object/array containing `ChainBuilder` instances and is memoized per `(msgsDef, locale)`. The `Locale` of every nested `ChainBuilder` must match the Provider's `LOCALES`; mismatches are caught at compile time.

### Language Switcher

```tsx
// LanguageSwitcher.tsx
import { useLocale } from './i18n';
import { LOCALES } from './i18n';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  return (
    <select value={locale} onChange={(e) => setLocale(e.target.value as typeof LOCALES[number])}>
      {LOCALES.map((l) => <option key={l} value={l}>{l}</option>)}
    </select>
  );
}
```

### Component-Local i18n (Colocation)

You can also define a `ChainBuilder` next to the component that uses it. Use the same `i18n` exported from `i18n.ts` so the locales stay aligned with the Provider.

```tsx
// ProfileCard.tsx
import { i18n, useBindLocale } from './i18n';

const profileI18n = i18n({
  title: { en: 'User Profile', ja: 'ユーザープロフィール' },
  greeting: (ctx: { name: string }) => ({
    en: `Welcome, ${ctx.name}!`,
    ja: `ようこそ、${ctx.name}さん！`,
  }),
});

export function ProfileCard({ name }: { name: string }) {
  const m = useBindLocale({ profileI18n });
  return (
    <div>
      <h2>{m.profileI18n.title()}</h2>
      <p>{m.profileI18n.greeting({ name })}</p>
    </div>
  );
}
```

### Factory Return Value

```ts
const {
  locales,         // the LOCALES tuple
  i18n,            // function: i18n(entries) → ChainBuilder bound to LOCALES
  LocaleProvider,  // uncontrolled (defaultLocale) or controlled (locale + onLocaleChange)
  useLocale,       // () => { locale, setLocale }
  useBindLocale,   // memoized bindLocale, locale type-checked
} = createI18nReact(['en', 'ja'] as const);
```

Notes:
- React is a `peerDependency` (`>=18`). Non-React users do not need to install React.
- No persistence (localStorage, cookies, URL) is built in — wire it up yourself, or use the `canopy-i18n/next` subpath for URL-based routing.

---

## Next.js Integration (`canopy-i18n/next`)

Integrates with the App Router's `/[locale]/...` segment. The factory module is **server / client safe** — `app/i18n.ts` does NOT need `"use client"`. The same module can be imported from Server Components and Client Components.

```tsx
// app/i18n.ts  ← no "use client" directive
import { createI18nNext } from 'canopy-i18n/next';

export const LOCALES = ['en', 'ja'] as const;

export const {
  i18n,
  bindLocale,            // (messages, locale | params) — string is sync, Promise<{locale}> is async
  generateStaticParams,  // () => [{ locale: 'en' }, { locale: 'ja' }]
  LocaleProvider,
  LocaleLink,
  useLocale,
  useBindLocale,
} = createI18nNext(LOCALES);
```

```tsx
// app/[locale]/layout.tsx — Server Component
import { generateStaticParams, LocaleProvider } from '../i18n';

export { generateStaticParams };

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return <LocaleProvider>{children}</LocaleProvider>;
}
```

```tsx
// app/[locale]/page.tsx — Server Component (no "use client")
import type { LocalePageProps } from 'canopy-i18n/next';
import { bindLocale, LOCALES } from '../i18n';
import { appI18n } from '../messages';

export default async function Page({
  params,
}: LocalePageProps<typeof LOCALES>) {
  const m = await bindLocale({ appI18n }, params);
  return <h1>{m.appI18n.title()}</h1>;
}
```

`bindLocale` is overloaded: pass a locale string for the sync form, or pass the page's `params` Promise to get an async form that awaits and binds in one step. `LocalePageProps<typeof LOCALES>` types `{ params: Promise<{ locale }> }` from the same `LOCALES` you registered with the factory, so the locale union never has to be hand-written.

To use a different segment name (e.g. `[lang]`) or move the locale segment under a path prefix (e.g. `/custom/[lang]`), pass `paramKey` and/or `pathPrefix`:

```ts
createI18nNext(LOCALES, { paramKey: 'lang', pathPrefix: '/custom' });
// LocalePageProps<typeof LOCALES, 'lang'> → { params: Promise<{ lang }> }
// generateStaticParams() → [{ lang: 'en' }, { lang: 'ja' }]
// LocaleLink href → /custom/<locale>...
// setLocale → router.push('/custom/<next-locale>...')
```

`pathPrefix` defaults to `"/"`. Both options are independent and can be combined.

`setLocale` from `useLocale()` accepts an optional `{ mode: 'push' | 'replace' }` second argument (default `'push'`). Use `'replace'` to avoid adding a history entry on locale change:

```tsx
const { setLocale } = useLocale();
setLocale('ja', { mode: 'replace' });
```

```tsx
// Client Component
'use client';
import { LocaleLink, useBindLocale } from '../i18n';
import { appI18n } from '../messages';

export function Switcher() {
  const m = useBindLocale({ appI18n });
  return (
    <>
      <p>{m.appI18n.title()}</p>
      <LocaleLink locale="ja">日本語</LocaleLink>
      <LocaleLink locale="en">English</LocaleLink>
    </>
  );
}
```

Notes:
- `LocaleProvider` reads `params.locale` from the route, and pushes via `useRouter()` on change. Accepts a `fallbackLocale` prop for routes outside the `[locale]` segment.
- `LocaleLink` swaps the first path segment. Pass an explicit `href` to override.
- `bindLocale` / `i18n` / `generateStaticParams` are pure functions, callable from both server and client.
- `useLocale` / `useBindLocale` are React hooks — only valid inside `"use client"` components.
- `LocaleLink` and `LocaleProvider` render client components internally; calling them from a Server Component creates the standard server-wraps-client boundary.
- Internally, `canopy-i18n/next` ships two modules: `_client.tsx` (`"use client"`, hook code) and `createI18nNext.tsx` (no directive, factory + server helpers). Re-exports preserve the boundary.
- Next.js is an optional `peerDependency` (`>=14`). The subpath assumes the App Router (`next/navigation`).

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

// React subpath
export { createI18nReact } from 'canopy-i18n/react';
export type { LocaleContextValue, LocaleProviderProps } from 'canopy-i18n/react';

// Next.js subpath (App Router)
export { createI18nNext, swapLocaleInPath } from 'canopy-i18n/next';
export type {
  NextLocaleProviderProps,
  LocaleLinkProps,
  LocalePageParams,
  LocalePageProps,
} from 'canopy-i18n/next';
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
| `messages.title` | `messages.title()` (call as function) |
| CommonJS `require()` | Use ESM `import` |
| Typo in locale key | TypeScript catches it at compile time |
