import { type ReactElement, useState } from "react";
import { AutoDetectDemo } from "./patterns/autoDetect/Demo";
import { HashDemo } from "./patterns/hash/Demo";
import { SearchParamDemo } from "./patterns/searchParam/Demo";
import { StorageDemo } from "./patterns/storage/Demo";

const TABS: ReadonlyArray<{ key: string; label: string; demo: ReactElement }> =
  [
    { key: "hash", label: "URL hash", demo: <HashDemo /> },
    { key: "search", label: "URL search", demo: <SearchParamDemo /> },
    { key: "storage", label: "localStorage", demo: <StorageDemo /> },
    { key: "auto", label: "Auto detect", demo: <AutoDetectDemo /> },
  ];

export default function App() {
  const [active, setActive] = useState(TABS[0]!.key);
  const current = TABS.find((t) => t.key === active) ?? TABS[0]!;

  return (
    <div
      style={{
        maxWidth: "640px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.6",
      }}
    >
      <header style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: "0 0 6px 0" }}>
          Canopy i18n — <code>useLocaleSource</code> Patterns
        </h1>
        <p style={{ margin: 0, color: "#666" }}>
          createI18nReact の factory option <code>useLocaleSource</code>{" "}
          をどんなソースに繋ぐかのパターン集
        </p>
      </header>

      <nav
        style={{
          display: "flex",
          gap: "4px",
          borderBottom: "1px solid #ddd",
          marginBottom: "20px",
        }}
      >
        {TABS.map((t) => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(t.key)}
              style={{
                padding: "10px 16px",
                fontSize: "14px",
                background: "transparent",
                border: "none",
                borderBottom: isActive
                  ? "2px solid #007bff"
                  : "2px solid transparent",
                color: isActive ? "#007bff" : "#555",
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                marginBottom: "-1px",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </nav>

      {current.demo}
    </div>
  );
}
