import type { TranslationCache } from "./types.js";

/**
 * Built-in in-memory cache. For persistence, implement TranslationCache yourself.
 */
export function memoryCache(): TranslationCache {
  const store = new Map<string, string>();
  return {
    get: (key) => store.get(key),
    set: (key, value) => {
      store.set(key, value);
    },
  };
}
