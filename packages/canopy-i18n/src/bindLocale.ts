import { ChainBuilder } from "./chainBuilder.js";
import { I18nMessage, isI18nMessage, type LocalizedMessage } from "./message.js";

export function isChainBuilder(x: unknown): x is ChainBuilder<any, any> {
  return x instanceof ChainBuilder;
}

// 深くネストされた構造を再帰的に変換する型
// I18nMessageをLocalizedMessage関数に変換し、ChainBuilderをbuild結果に変換
type DeepUnwrapChainBuilders<T> = T extends I18nMessage<infer Ls, infer C> ? LocalizedMessage<Ls, C>
  : T extends ChainBuilder<infer Ls, infer Messages>
    ? {
      [K in keyof Messages]: Messages[K] extends I18nMessage<Ls, infer C> ? LocalizedMessage<Ls, C> : never;
    }
  : T extends readonly any[] ? { [K in keyof T]: DeepUnwrapChainBuilders<T[K]> }
  : T extends object ? { [K in keyof T]: DeepUnwrapChainBuilders<T[K]> }
  : T;

export function bindLocale<T extends object>(
  obj: T,
  locale: string,
): DeepUnwrapChainBuilders<T> {
  function visit(v: any): any {
    if (isChainBuilder(v)) {
      return v.build(locale as any);
    }
    if (isI18nMessage(v)) {
      const cloned = Object.create(Object.getPrototypeOf(v));
      Object.assign(cloned, v);
      cloned.setLocale(locale as any);
      return cloned.toFunction();
    }
    if (Array.isArray(v)) {
      return (v as any[]).map(visit);
    }
    if (v && typeof v === "object") {
      const out: Record<string, any> = {};
      for (const k of Object.keys(v)) {
        out[k] = visit((v as any)[k]);
      }
      return out;
    }
    return v;
  }
  return visit(obj) as DeepUnwrapChainBuilders<T>;
}
