"use client";

import { useState } from "react";
import { useBindLocale, useLocale } from "../../i18n";
import { appI18n } from "../../messages";

export function ClientSection() {
  const m = useBindLocale({ appI18n });
  const { locale, setLocale, locales } = useLocale();
  type Locale = (typeof locales)[number];

  const [name, setName] = useState("Hanako");

  return (
    <section>
      <h2>Client Section (useBindLocale)</h2>
      <p>{m.appI18n.greeting({ name })}</p>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <label>
          Name:{" "}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Locale:{" "}
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
          >
            {locales.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
