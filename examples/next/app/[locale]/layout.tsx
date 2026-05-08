import type { ReactNode } from "react";
import { LocaleProvider } from "../i18n";
import { LOCALES } from "../locales";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return <LocaleProvider>{children}</LocaleProvider>;
}
