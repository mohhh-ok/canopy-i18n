import Link from "next/link";
import type { LocalePageProps } from "canopy-i18n/unstable_next";
import { bindLocale, LocaleLink, LOCALES } from "../i18n";
import { appI18n } from "../messages";
import { ClientSection } from "./ClientSection";

export default async function Page({
  params,
}: LocalePageProps<typeof LOCALES>) {
  const m = await bindLocale({ appI18n }, params);

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <p>
        <Link href="/">← Examples</Link>
      </p>
      <section>
        <h2>Server Section (bindLocale)</h2>
        <h1>{m.appI18n.title()}</h1>
        <p>{m.appI18n.description()}</p>
        <p>{m.appI18n.greeting({ name: "Taro" })}</p>
        <nav>
          <ul>
            {LOCALES.map((l) => (
              <li key={l}>
                <LocaleLink locale={l}>{l}</LocaleLink>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <hr style={{ margin: "2rem 0" }} />

      <ClientSection />
    </main>
  );
}
