/**
 * Minimal interface for an AI translation backend.
 * Implement this to plug in any provider (OpenAI, local model, etc.).
 */
export interface AIAdapter {
  /**
   * Translate texts from one locale to another.
   * Must return translations in the same order and length as `texts`.
   */
  translate(request: AITranslateRequest): Promise<string[]>;
}

export interface AITranslateRequest {
  texts: string[];
  /** Omitted when the source language is unknown — detect it from the texts. */
  from?: string;
  to: string;
}

/**
 * Cache for translated texts.
 * Implement this to persist translations anywhere (memory, DB, file, etc.).
 */
export interface TranslationCache {
  get(key: string): Promise<string | undefined> | string | undefined;
  set(key: string, value: string): Promise<void> | void;
}
