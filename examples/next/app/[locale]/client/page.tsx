"use client";

import Link from "next/link";
import { useLocale, useBindLocale } from "../../i18n";
import { appI18n } from "../../messages";
import { Switcher } from "../Switcher";

export default function ClientPage() {
  const m = useBindLocale({ appI18n });
  const { locale } = useLocale();

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h2>Client Page (useBindLocale)</h2>
      <h1>{m.appI18n.title()}</h1>
      <p>{m.appI18n.description()}</p>
      <p>{m.appI18n.greeting({ name: "Hanako" })}</p>
      <Switcher />
      <p>
        <Link href={`/${locale}`}>→ Server Page</Link>
      </p>
    </main>
  );
}
