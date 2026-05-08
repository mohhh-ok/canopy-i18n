"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  type ComponentProps,
  type ReactNode,
  useCallback,
  useMemo,
} from "react";
import { createI18nReact } from "../react/createI18nReact.js";

export interface NextLocaleProviderProps {
  children: ReactNode;
  fallbackLocale?: string;
}

export interface LocaleLinkProps<Locale extends string>
  extends Omit<ComponentProps<typeof Link>, "href" | "locale"> {
  locale: Locale;
  href?: string;
  children?: ReactNode;
}

// /ja/foo/bar → /en/foo/bar  (1 段目セグメントを置換)
export function swapLocaleInPath(pathname: string, locale: string): string {
  const parts = pathname.split("/");
  if (parts.length >= 2) {
    parts[1] = locale;
  }
  return parts.join("/") || "/";
}

export function createI18nNext<const L extends readonly string[]>(locales: L) {
  const {
    i18n,
    useLocale,
    useBindLocale,
    LocaleProvider: BaseLocaleProvider,
  } = createI18nReact(locales);

  function NextLocaleProvider(
    { children, fallbackLocale }: NextLocaleProviderProps,
  ) {
    const params = useParams<{ locale?: string }>();
    const router = useRouter();
    const pathname = usePathname();

    const locale = (params?.locale ?? fallbackLocale ?? locales[0]) as
      L[number];

    const onLocaleChange = useCallback(
      (next: L[number]) => {
        router.push(swapLocaleInPath(pathname, next));
      },
      [pathname, router],
    );

    return (
      <BaseLocaleProvider locale={locale} onLocaleChange={onLocaleChange}>
        {children}
      </BaseLocaleProvider>
    );
  }

  function LocaleLink(
    { locale, href, children, ...rest }: LocaleLinkProps<L[number]>,
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

  return {
    locales,
    i18n,
    useLocale,
    useBindLocale,
    LocaleProvider: NextLocaleProvider,
    LocaleLink,
  };
}
