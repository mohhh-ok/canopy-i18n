import type { ComponentProps, ReactElement, ReactNode } from "react";
import type Link from "next/link";
import { bindLocale as plainBindLocale } from "../../bindLocale.js";
import { type ChainBuilder, createI18n } from "../../chainBuilder.js";
import type {
  DeepLocaleConstraint,
  DeepUnwrap,
  ResolveServerLocale,
} from "../react/createI18nReact.js";
import {
  ClientLocaleLink,
  ClientLocaleProvider,
  type SetLocaleOptions,
  swapLocaleInPath,
  useBindLocaleClient,
  useLocaleClient,
  type UseLocaleSource,
} from "./_client.js";

export type { ResolveServerLocale, SetLocaleOptions, UseLocaleSource };

export { swapLocaleInPath };

export function createParamsResolveServerLocale(
  paramKey: string,
): ResolveServerLocale {
  return async (input) => {
    if (input == null) return undefined;
    const resolved = await (input as Promise<Record<string, string>>);
    return resolved?.[paramKey];
  };
}

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
  setLocale: (locale: Locale, options?: SetLocaleOptions) => void;
  locales: readonly Locale[];
  pathPrefix: string;
}

export type LocalePageParams<
  L extends readonly string[],
  K extends string = "locale",
> = Promise<{ [P in K]: L[number] }>;

export type LocalePageProps<
  L extends readonly string[],
  K extends string = "locale",
> = {
  params: LocalePageParams<L, K>;
};

export interface CreateI18nNextOptions<K extends string = string> {
  paramKey?: K;
  pathPrefix?: string;
  resolveServerLocale?: ResolveServerLocale;
}

export interface I18nNextInstance<
  L extends readonly string[],
  K extends string = "locale",
> {
  locales: L;
  paramKey: K;
  pathPrefix: string;
  i18n: ChainBuilder<L, {}>["add"];
  bindLocale: {
    <T extends object>(
      messages: T & DeepLocaleConstraint<T, L[number]>,
      locale: L[number],
    ): DeepUnwrap<T>;
    <T extends object>(
      messages: T & DeepLocaleConstraint<T, L[number]>,
      params: LocalePageParams<L, K>,
    ): Promise<DeepUnwrap<T>>;
    <T extends object>(
      messages: T & DeepLocaleConstraint<T, L[number]>,
      input: unknown,
    ): Promise<DeepUnwrap<T>>;
  };
  generateStaticParams: () => Array<{ [P in K]: L[number] }>;
  LocaleProvider: (props: NextLocaleProviderProps<L[number]>) => ReactElement;
  LocaleLink: (props: LocaleLinkProps<L[number]>) => ReactElement;
  useLocale: () => LocaleContextValue<L[number]>;
  useBindLocale: <T extends object>(
    messages: T & DeepLocaleConstraint<T, L[number]>,
  ) => DeepUnwrap<T>;
}

export function createI18nNext<
  const L extends readonly string[],
  const K extends string = "locale",
>(
  locales: L,
  options?: CreateI18nNextOptions<K>,
): I18nNextInstance<L, K> {
  const paramKey = (options?.paramKey ?? "locale") as K;
  const pathPrefix = options?.pathPrefix ?? "/";
  const resolveServerLocale =
    options?.resolveServerLocale ?? createParamsResolveServerLocale(paramKey);

  function LocaleProvider(
    { children, fallbackLocale }: NextLocaleProviderProps<L[number]>,
  ) {
    return (
      <ClientLocaleProvider
        locales={locales}
        fallbackLocale={fallbackLocale}
        paramKey={paramKey}
        pathPrefix={pathPrefix}
      >
        {children}
      </ClientLocaleProvider>
    );
  }

  const builder: ChainBuilder<L, {}> = createI18n(locales);
  const i18n: typeof builder.add = (entries) => builder.add(entries);

  return {
    locales,
    paramKey,
    pathPrefix,
    i18n,
    bindLocale: ((messages: object, input: unknown) => {
      if (typeof input === "string") {
        return plainBindLocale(messages, input);
      }
      const resolved = resolveServerLocale(input);
      if (
        resolved &&
        typeof (resolved as { then?: unknown }).then === "function"
      ) {
        return (resolved as Promise<string | undefined>).then((locale) =>
          plainBindLocale(messages, locale as string),
        );
      }
      return plainBindLocale(messages, resolved as string);
    }) as I18nNextInstance<L, K>["bindLocale"],
    generateStaticParams: () =>
      locales.map(
        (locale) => ({ [paramKey]: locale }) as { [P in K]: L[number] },
      ),
    LocaleProvider,
    LocaleLink:
      ClientLocaleLink as unknown as I18nNextInstance<L, K>["LocaleLink"],
    useLocale:
      useLocaleClient as unknown as I18nNextInstance<L, K>["useLocale"],
    useBindLocale:
      useBindLocaleClient as unknown as I18nNextInstance<L, K>["useBindLocale"],
  };
}
