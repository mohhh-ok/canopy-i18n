import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { bindLocale } from "../../bindLocale.js";
import { ChainBuilder, createI18n } from "../../chainBuilder.js";
import { I18nMessage, type LocalizedMessage } from "../../message.js";

type Equal<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

// T 内のすべての ChainBuilder / I18nMessage の Locales が、Provider の Locales と
// 完全一致することを型で要求するための再帰制約
type DeepLocaleConstraint<T, Locale extends string> = T extends ChainBuilder<
  infer LL,
  any
>
  ? Equal<LL[number], Locale> extends true ? T : never
  : T extends I18nMessage<infer LL, any>
    ? Equal<LL[number], Locale> extends true ? T : never
  : T extends (...args: any[]) => any ? T
  : T extends readonly any[]
    ? { readonly [K in keyof T]: DeepLocaleConstraint<T[K], Locale> }
  : T extends object ? { [K in keyof T]: DeepLocaleConstraint<T[K], Locale> }
  : T;

// bindLocale の戻り値型をローカルに再現
type DeepUnwrap<T> = T extends I18nMessage<infer Ls, infer C>
  ? LocalizedMessage<Ls, C>
  : T extends ChainBuilder<infer Ls, infer Messages> ? {
      [K in keyof Messages]: Messages[K] extends I18nMessage<Ls, infer C>
        ? LocalizedMessage<Ls, C>
        : never;
    }
  : T extends readonly any[] ? { [K in keyof T]: DeepUnwrap<T[K]> }
  : T extends object ? { [K in keyof T]: DeepUnwrap<T[K]> }
  : T;

export interface LocaleContextValue<Locale extends string> {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export type LocaleProviderProps<Locale extends string> =
  & { children: ReactNode }
  & (
    | { defaultLocale: Locale; locale?: undefined; onLocaleChange?: undefined }
    | {
      locale: Locale;
      onLocaleChange: (locale: Locale) => void;
      defaultLocale?: undefined;
    }
  );

export function createI18nReact<const L extends readonly string[]>(
  locales: L,
) {
  const Context = createContext<LocaleContextValue<L[number]> | undefined>(
    undefined,
  );

  function LocaleProvider(props: LocaleProviderProps<L[number]>) {
    const { children } = props;
    const isControlled = props.locale !== undefined;
    const [internalLocale, setInternalLocale] = useState<L[number]>(
      (props.defaultLocale ?? props.locale)!,
    );

    const locale = isControlled ? props.locale! : internalLocale;
    const setLocale = (next: L[number]) => {
      if (isControlled) {
        props.onLocaleChange!(next);
      } else {
        setInternalLocale(next);
      }
    };

    const value = useMemo<LocaleContextValue<L[number]>>(
      () => ({ locale, setLocale }),
      // controlled では onLocaleChange の参照変化にも追従する
      [locale, isControlled, isControlled ? props.onLocaleChange : null],
    );
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useLocale(): LocaleContextValue<L[number]> {
    const ctx = useContext(Context);
    if (!ctx) {
      throw new Error("useLocale must be used within a LocaleProvider");
    }
    return ctx;
  }

  function useBindLocale<T extends object>(
    msgsDef: T & DeepLocaleConstraint<T, L[number]>,
  ): DeepUnwrap<T> {
    const { locale } = useLocale();
    return useMemo(
      () => bindLocale(msgsDef, locale) as DeepUnwrap<T>,
      [msgsDef, locale],
    );
  }

  const builder: ChainBuilder<L, {}> = createI18n(locales);
  const i18n: typeof builder.add = (entries) => builder.add(entries);

  return { locales, i18n, LocaleProvider, useLocale, useBindLocale };
}
