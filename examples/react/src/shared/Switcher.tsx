import { type Locale, LOCALES } from "../types";

interface Props {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export function Switcher({ locale, setLocale }: Props) {
  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      style={{
        padding: "6px 12px",
        fontSize: "14px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        background: "white",
      }}
    >
      {LOCALES.map((loc) => (
        <option key={loc} value={loc}>
          {loc === "en" ? "🇺🇸 English" : loc === "ja" ? "🇯🇵 日本語" : "🇨🇳 中文"}
        </option>
      ))}
    </select>
  );
}
