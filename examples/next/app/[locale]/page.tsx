import { bindLocale } from "../i18n";
import { appI18n } from "../messages";
import { Switcher } from "./Switcher";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: "en" | "ja" }>;
}) {
  const { locale } = await params;
  const m = bindLocale({ appI18n }, locale);

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>{m.appI18n.title()}</h1>
      <p>{m.appI18n.description()}</p>
      <p>{m.appI18n.greeting({ name: "Taro" })}</p>
      <Switcher />
    </main>
  );
}
