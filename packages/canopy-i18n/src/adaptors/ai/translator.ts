import type { AIAdapter, TranslationCache } from "./types.js";

export interface AITranslatorOptions<S extends string = string> {
  /** Translation backend. Implement AIAdapter to use any provider. */
  adapter: AIAdapter;
  /**
   * Default locale of the original texts, used when `from` is omitted.
   * When neither is given, the adapter receives `from: undefined` and
   * should detect the source language (required for completeEntries).
   */
  sourceLocale?: S;
  /** Optional cache to avoid repeated adapter calls. */
  cache?: TranslationCache;
  /**
   * What to do when the adapter fails.
   * - "fallback" (default): return the original text
   * - "throw": rethrow the error
   */
  onError?: "fallback" | "throw";
  /** Customize cache keys. Default: `${from ?? "auto"}:${to}:${text}` */
  cacheKey?: (text: string, from: string | undefined, to: string) => string;
}

export interface TranslateOptions {
  to: string;
  from?: string;
}

interface Deferred {
  promise: Promise<string>;
  resolve: (value: string) => void;
  reject: (error: unknown) => void;
}

function createDeferred(): Deferred {
  let resolve!: (value: string) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<string>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  promise.catch(() => {}); // avoid unhandled rejection
  return { promise, resolve, reject };
}

export class AITranslator<S extends string = string> {
  private readonly adapter: AIAdapter;
  private readonly sourceLocale?: S;
  private readonly cache?: TranslationCache;
  private readonly onError: "fallback" | "throw";
  private readonly makeKey: (text: string, from: string | undefined, to: string) => string;
  /** Deduplicates concurrent requests for the same text */
  private readonly inflight = new Map<string, Promise<string>>();

  constructor(options: AITranslatorOptions<S>) {
    this.adapter = options.adapter;
    this.sourceLocale = options.sourceLocale;
    this.cache = options.cache;
    this.onError = options.onError ?? "fallback";
    this.makeKey = options.cacheKey ?? ((text, from, to) => `${from ?? "auto"}:${to}:${text}`);
  }

  /**
   * Translate a single text (e.g. user input) at runtime.
   */
  async translate(text: string, options: TranslateOptions): Promise<string> {
    const results = await this.translateMany([text], options);
    return results[0] as string;
  }

  /**
   * Translate multiple texts in a single adapter call.
   * Results are cached and concurrent requests for the same text are deduplicated.
   */
  async translateMany(texts: string[], options: TranslateOptions): Promise<string[]> {
    const from = options.from ?? this.sourceLocale;
    const to = options.to;
    if (from !== undefined && from === to) return [...texts];

    const keys = texts.map((text) => this.makeKey(text, from, to));
    const textByKey = new Map<string, string>();
    // Keys this call resolves itself vs. keys another call is already resolving.
    // Claim ownership synchronously so concurrent calls dedup reliably.
    const owned = new Map<string, { text: string; deferred: Deferred }>();
    const waiting = new Map<string, Promise<string>>();

    for (const [i, key] of keys.entries()) {
      if (textByKey.has(key)) continue;
      const text = texts[i] as string;
      textByKey.set(key, text);
      const inflight = this.inflight.get(key);
      if (inflight) {
        waiting.set(key, inflight);
      } else {
        const deferred = createDeferred();
        this.inflight.set(key, deferred.promise);
        owned.set(key, { text, deferred });
      }
    }

    const resolved = new Map<string, string>();

    // Resolve owned keys from the cache; the rest need the adapter
    const misses: { key: string; text: string; deferred: Deferred }[] = [];
    await Promise.all(
      Array.from(owned, async ([key, { text, deferred }]) => {
        const cached = this.cache ? await this.cache.get(key) : undefined;
        if (cached !== undefined) {
          resolved.set(key, cached);
          deferred.resolve(cached);
          this.inflight.delete(key);
        } else {
          misses.push({ key, text, deferred });
        }
      }),
    );

    if (misses.length > 0) {
      try {
        const out = await this.adapter.translate({
          texts: misses.map((miss) => miss.text),
          from,
          to,
        });
        if (out.length !== misses.length) {
          throw new Error(`AIAdapter returned ${out.length} texts, expected ${misses.length}`);
        }
        await Promise.all(
          misses.map(async (miss, i) => {
            const translated = out[i] as string;
            resolved.set(miss.key, translated);
            miss.deferred.resolve(translated);
            await this.cache?.set(miss.key, translated);
          }),
        );
      } catch (err) {
        for (const miss of misses) miss.deferred.reject(err);
        if (this.onError === "throw") throw err;
        for (const miss of misses) resolved.set(miss.key, miss.text);
      } finally {
        for (const miss of misses) this.inflight.delete(miss.key);
      }
    }

    // Wait for keys owned by other concurrent calls
    await Promise.all(
      Array.from(waiting, async ([key, promise]) => {
        try {
          resolved.set(key, await promise);
        } catch (err) {
          if (this.onError === "throw") throw err;
          resolved.set(key, textByKey.get(key) as string);
        }
      }),
    );

    return keys.map((key) => resolved.get(key) as string);
  }

  /**
   * Fill in missing locales of static message entries.
   * Existing translations are kept; only missing ones are translated
   * from the source locale. The result can be passed to ChainBuilder.add().
   */
  async completeEntries<
    const Ls extends readonly string[],
    E extends Record<string, Partial<Record<Ls[number], string>> & Record<S, string>>,
  >(locales: Ls, entries: E): Promise<{ [K in keyof E]: Record<Ls[number], string> }> {
    const source = this.sourceLocale;
    if (source === undefined) {
      throw new Error("completeEntries requires the sourceLocale option");
    }

    const result: Record<string, Record<string, string>> = {};
    for (const [key, entry] of Object.entries(entries)) {
      if (typeof entry[source] !== "string") {
        throw new Error(`Entry "${key}" is missing source locale "${source}"`);
      }
      result[key] = { ...entry } as Record<string, string>;
    }

    await Promise.all(
      locales
        .filter((locale) => locale !== source)
        .map(async (locale) => {
          const missing = Object.values(result).filter(
            (entry) => entry[locale] === undefined,
          );
          if (missing.length === 0) return;
          const translated = await this.translateMany(
            missing.map((entry) => entry[source] as string),
            { to: locale, from: source },
          );
          for (const [i, entry] of missing.entries()) {
            entry[locale] = translated[i] as string;
          }
        }),
    );

    return result as { [K in keyof E]: Record<Ls[number], string> };
  }
}

export function createAITranslator<S extends string = string>(
  options: AITranslatorOptions<S>,
): AITranslator<S> {
  return new AITranslator(options);
}
