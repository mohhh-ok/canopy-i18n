"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { bindLocale } from "../../bindLocale.js";
import type { UseLocaleSource } from "../react/createI18nReact.js";

export type { UseLocaleSource };

export interface SetLocaleOptions {
  mode?: "push" | "replace";
}

export interface LocaleContextValue {
  locale: string;
  setLocale: (locale: string, options?: SetLocaleOptions) => void;
  locales: readonly string[];
  pathPrefix: string;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function swapLocaleInPath(
  pathname: string,
  locale: string,
  pathPrefix = "/",
): string {
  const prefixSegments = pathPrefix.split("/").filter(Boolean);
  const localeIndex = prefixSegments.length + 1;
  const parts = pathname.split("/");
  while (parts.length <= localeIndex) {
    parts.push("");
  }
  parts[localeIndex] = locale;
  return parts.join("/") || "/";
}

export function createParamsLocaleSource(paramKey: string): UseLocaleSource {
  return () => {
    const params = useParams<Record<string, string | undefined>>();
    return params?.[paramKey];
  };
}

export interface ClientLocaleProviderProps {
  children: ReactNode;
  locales: readonly string[];
  fallbackLocale?: string;
  paramKey?: string;
  useLocaleSource?: UseLocaleSource;
  pathPrefix?: string;
}

export function ClientLocaleProvider(
  {
    children,
    locales,
    fallbackLocale,
    paramKey = "locale",
    useLocaleSource,
    pathPrefix = "/",
  }: ClientLocaleProviderProps,
) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<Record<string, string | undefined>>();

  const sourceLocale = useLocaleSource
    ? useLocaleSource()
    : params?.[paramKey];
  const locale = sourceLocale ?? fallbackLocale ?? locales[0]!;

  const setLocale = useCallback(
    (next: string, options?: SetLocaleOptions) => {
      const target = swapLocaleInPath(pathname, next, pathPrefix);
      if (options?.mode === "replace") {
        router.replace(target);
      } else {
        router.push(target);
      }
    },
    [pathname, router, pathPrefix],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, locales, pathPrefix }),
    [locale, setLocale, locales, pathPrefix],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocaleClient(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx;
}

export function useBindLocaleClient<T extends object>(messages: T): unknown {
  const { locale } = useLocaleClient();
  return useMemo(() => bindLocale(messages, locale), [messages, locale]);
}

export interface ClientLocaleLinkProps
  extends Omit<ComponentProps<typeof Link>, "href" | "locale"> {
  locale: string;
  href?: string;
  children?: ReactNode;
}

export function ClientLocaleLink(
  { locale, href, children, ...rest }: ClientLocaleLinkProps,
) {
  const pathname = usePathname();
  const ctx = useContext(LocaleContext);
  const pathPrefix = ctx?.pathPrefix ?? "/";
  const target = useMemo(
    () => href ?? swapLocaleInPath(pathname, locale, pathPrefix),
    [href, pathname, locale, pathPrefix],
  );
  return (
    <Link href={target} {...rest}>
      {children}
    </Link>
  );
}
