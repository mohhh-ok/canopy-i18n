import { bindLocale, LocaleLink, LOCALES } from "../i18n";
import { appI18n } from "../messages";
import { ClientSection } from "./ClientSection";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: "en" | "ja" }>;
}) {
  const { locale } = await params;
  const m = bindLocale({ appI18n }, locale);

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <section>
        <h2>Server Section (bindLocale)</h2>
        <h1>{m.appI18n.title()}</h1>
        <p>{m.appI18n.description()}</p>
        <p>{m.appI18n.greeting({ name: "Taro" })}</p>
        <nav style={{ display: "flex", gap: "0.5rem" }}>
          {LOCALES.map((l) => (
            <LocaleLink key={l} locale={l}>
              {l}
            </LocaleLink>
          ))}
        </nav>
      </section>

      <hr style={{ margin: "2rem 0" }} />

      <ClientSection />
    </main>
  );
}
