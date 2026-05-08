import type { ComponentProps, ReactElement, ReactNode } from "react";
import type Link from "next/link";
import { bindLocale as plainBindLocale } from "../../bindLocale.js";
import { type ChainBuilder, createI18n } from "../../chainBuilder.js";
import type {
  DeepLocaleConstraint,
  DeepUnwrap,
} from "../react/createI18nReact.js";
import {
  ClientLocaleLink,
  ClientLocaleProvider,
  swapLocaleInPath,
  useBindLocaleClient,
  useLocaleClient,
} from "./_client.js";

export { swapLocaleInPath };

export interface NextLocaleProviderProps<Locale extends string> {
  children: ReactNode;
  fallbackLocale?: Locale;
}

export interface LocaleLinkProps<Locale extends string>
  extends Omit<ComponentProps<typeof Link>, "href" | "locale"> {
  locale: Locale;
  href?: string;
  children?: ReactNode;
}

export interface LocaleContextValue<Locale extends string> {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  locales: readonly Locale[];
}

export interface I18nNextInstance<L extends readonly string[]> {
  locales: L;
  i18n: ChainBuilder<L, {}>["add"];
  bindLocale: <T extends object>(
    messages: T & DeepLocaleConstraint<T, L[number]>,
    locale: L[number],
  ) => DeepUnwrap<T>;
  generateStaticParams: () => Array<{ locale: L[number] }>;
  LocaleProvider: (props: NextLocaleProviderProps<L[number]>) => ReactElement;
  LocaleLink: (props: LocaleLinkProps<L[number]>) => ReactElement;
  useLocale: () => LocaleContextValue<L[number]>;
  useBindLocale: <T extends object>(
    messages: T & DeepLocaleConstraint<T, L[number]>,
  ) => DeepUnwrap<T>;
}

export function createI18nNext<const L extends readonly string[]>(
  locales: L,
): I18nNextInstance<L> {
  function LocaleProvider(
    { children, fallbackLocale }: NextLocaleProviderProps<L[number]>,
  ) {
    return (
      <ClientLocaleProvider locales={locales} fallbackLocale={fallbackLocale}>
        {children}
      </ClientLocaleProvider>
    );
  }

  const builder: ChainBuilder<L, {}> = createI18n(locales);
  const i18n: typeof builder.add = (entries) => builder.add(entries);

  return {
    locales,
    i18n,
    bindLocale: ((messages, locale) =>
      plainBindLocale(messages, locale)) as I18nNextInstance<L>["bindLocale"],
    generateStaticParams: () =>
      locales.map((locale) => ({ locale: locale as L[number] })),
    LocaleProvider,
    LocaleLink: ClientLocaleLink as unknown as I18nNextInstance<L>["LocaleLink"],
    useLocale: useLocaleClient as unknown as I18nNextInstance<L>["useLocale"],
    useBindLocale:
      useBindLocaleClient as unknown as I18nNextInstance<L>["useBindLocale"],
  };
}
