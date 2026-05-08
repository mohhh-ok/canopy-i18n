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

export interface LocaleContextValue {
  locale: string;
  setLocale: (locale: string) => void;
  locales: readonly string[];
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function swapLocaleInPath(pathname: string, locale: string): string {
  const parts = pathname.split("/");
  if (parts.length >= 2) {
    parts[1] = locale;
  }
  return parts.join("/") || "/";
}

export interface ClientLocaleProviderProps {
  children: ReactNode;
  locales: readonly string[];
  fallbackLocale?: string;
}

export function ClientLocaleProvider(
  { children, locales, fallbackLocale }: ClientLocaleProviderProps,
) {
  const params = useParams<{ locale?: string }>();
  const router = useRouter();
  const pathname = usePathname();

  const locale = params?.locale ?? fallbackLocale ?? locales[0]!;

  const setLocale = useCallback(
    (next: string) => {
      router.push(swapLocaleInPath(pathname, next));
    },
    [pathname, router],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, locales }),
    [locale, setLocale, locales],
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
  const target = useMemo(
    () => href ?? swapLocaleInPath(pathname, locale),
    [href, pathname, locale],
  );
  return (
    <Link href={target} {...rest}>
      {children}
    </Link>
  );
}
