# React Example - Canopy i18n

A simple React application demonstrating how to use `canopy-i18n` for type-safe internationalization.

## Features Demonstrated

- ✅ Type-safe locale switching with React Context
- ✅ Static string messages
- ✅ Dynamic template messages with context
- ✅ JSX.Element messages for React components
- ✅ Custom hook for binding locales
- ✅ Multiple namespaces (baseI18n, features, dynamicMessages, jsxMessages)
- ✅ **Single-file colocation** (unique to canopy-i18n!)

## Why Canopy i18n?

Unlike traditional i18n libraries (i18next, react-intl, next-intl), canopy-i18n allows you to **colocate i18n definitions with components** in the same file:

**Traditional i18n libraries:**
```tsx
// Separate file: locales/en.json
{ "profile.title": "User Profile" }

// Component file
const title = t('profile.title'); // String keys, no type safety
```

**Canopy i18n:**
```tsx
// Same file - component + i18n together!
const msgs = createI18n(LOCALES).add({
  title: { en: 'User Profile', ja: 'ユーザープロフィール' }
});

export function Component() {
  const m = useBindLocale(msgs);
  return <div>{m.title()}</div>; // Fully type-safe
}
```

**Benefits:**
- 🎯 **Better colocation**: Component-specific messages live with the component
- 🔒 **Complete type safety**: No string keys, compile-time checks
- ⚡ **Zero setup**: No separate config files or loaders needed
- 🧹 **Dead code elimination**: Unused messages are easy to find and remove
- 📦 **Flexible organization**: Choose centralized or distributed patterns per use case

## Getting Started

### Installation

```bash
bun install
```

### Development

```bash
bun dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
bun run build
```

## Project Structure

```
src/
├── App.tsx              # Main application component
├── i18n.tsx             # Message definitions
├── types.ts             # Shared types (locales, User)
├── LocaleContext.ts     # Context for locale state management
├── LocaleProvider.tsx   # Context provider component
├── LanguageSwitcher.tsx # Language selector UI
├── ProfileCard.tsx      # Example component using i18n
└── main.tsx             # Application entry point
```

## Key Concepts

### 1. Define Locales

```tsx
// types.ts
export const LOCALES = ['en', 'ja', 'zh'] as const;
export type Locale = typeof LOCALES[number];
```

### 2. Create Message Definitions

```tsx
// i18n.tsx
import { createI18n } from 'canopy-i18n';

// Static messages
const baseI18n = createI18n(LOCALES).add({
  title: {
    en: 'Welcome',
    ja: 'ようこそ',
    zh: '欢迎'
  }
});

// Dynamic messages with context
const dynamicMessages = createI18n(LOCALES)
  .add({
    greeting: (ctx: { name: string }) => ({
      en: `Hello, ${ctx.name}!`,
      ja: `こんにちは、${ctx.name}さん！`,
      zh: `你好，${ctx.name}！`
    })
  });
```

### 3. Locale Context & Provider

```tsx
// LocaleProvider.tsx
import { LocaleContext } from './LocaleContext';

export function LocaleProvider({ children }) {
  const states = useContextStates();
  return (
    <LocaleContext.Provider value={states}>
      {children}
    </LocaleContext.Provider>
  );
}
```

### 4. Use in Components

```tsx
import { useBindLocale } from './LocaleContext';
import { msgsDef } from './i18n';

function MyComponent() {
  const m = useBindLocale(msgsDef);
  
  return (
    <div>
      <h1>{m.baseI18n.title()}</h1>
      <p>{m.dynamicMessages.greeting({ name: 'Taro' })}</p>
    </div>
  );
}
```

## Example Features

### Language Switcher

Click the language buttons in the header to switch between English, Japanese, and Chinese.

### Static Messages

Simple string messages defined with `.add()`:

```tsx
const messages = createI18n(LOCALES).add({
  welcome: {
    en: 'Welcome',
    ja: 'ようこそ',
    zh: '欢迎'
  }
});
```

### Dynamic Template Messages

Messages that accept context parameters using `.add()`:

```tsx
const messages = createI18n(LOCALES)
  .add({
    items: (ctx: { count: number }) => ({
      en: `You have ${ctx.count} items`,
      ja: `${ctx.count}個のアイテムがあります`,
      zh: `你有 ${ctx.count} 个项目`
    })
  });
```

### Single-File Pattern

You can define i18n messages and components in the same file for better colocation:

```tsx
// ProfileCard.tsx
import { createI18n } from 'canopy-i18n';
import { useBindLocale } from './LocaleContext';

// Define messages in the same file
const profileI18n = createI18n(LOCALES).add({
  title: {
    en: 'User Profile',
    ja: 'ユーザープロフィール',
    zh: '用户资料'
  },
  edit: {
    en: 'Edit Profile',
    ja: 'プロフィール編集',
    zh: '编辑资料'
  }
});

// Use in the component
export function ProfileCard() {
  const m = useBindLocale(profileI18n);
  
  return (
    <div>
      <h2>{m.title()}</h2>
      <button>{m.edit()}</button>
    </div>
  );
}
```

This pattern is useful for component-specific messages that aren't shared across the application. See `ProfileCard.tsx` for a complete example.

## Learn More

- [Canopy i18n Documentation](../../README.md)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)

## License

This example is part of the canopy-i18n project.
