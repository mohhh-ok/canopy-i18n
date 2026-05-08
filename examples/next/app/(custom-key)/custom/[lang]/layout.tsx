import type { ReactNode } from "react";
import { generateStaticParams, LocaleProvider } from "../../i18n";

export { generateStaticParams };

export default function LangLayout({ children }: { children: ReactNode }) {
  return <LocaleProvider>{children}</LocaleProvider>;
}
