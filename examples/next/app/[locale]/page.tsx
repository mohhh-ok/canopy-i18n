import Link from "next/link";
import { bindLocale } from "../i18n";
import { appI18n } from "../messages";
import { Switcher } from "./Switcher";

export default async function ServerPage({
  params,
}: {
  params: Promise<{ locale: "en" | "ja" }>;
}) {
  const { locale } = await params;
  const m = bindLocale({ appI18n }, locale);

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h2>Server Page (bindLocale)</h2>
      <h1>{m.appI18n.title()}</h1>
      <p>{m.appI18n.description()}</p>
      <p>{m.appI18n.greeting({ name: "Taro" })}</p>
      <Switcher />
      <p>
        <Link href={`/${locale}/client`}>→ Client Page</Link>
      </p>
    </main>
  );
}
