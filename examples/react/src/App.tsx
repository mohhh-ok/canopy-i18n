import type { ReactElement } from "react";
import { HashDemo } from "./patterns/hash/Demo";
import { SearchParamDemo } from "./patterns/searchParam/Demo";
import { StorageDemo } from "./patterns/storage/Demo";
import { Link, useCurrentPath } from "./shared/router";

const ROUTES: ReadonlyArray<{
  path: string;
  label: string;
  demo: ReactElement;
}> = [
  { path: "/hash", label: "URL hash", demo: <HashDemo /> },
  { path: "/search", label: "URL search", demo: <SearchParamDemo /> },
  { path: "/storage", label: "localStorage", demo: <StorageDemo /> },
];

export default function App() {
  const path = useCurrentPath();
  const current = ROUTES.find((r) => r.path === path) ?? ROUTES[0]!;

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
        {ROUTES.map((r) => (
          <Link key={r.path} to={r.path} active={r.path === current.path}>
            {r.label}
          </Link>
        ))}
      </nav>

      {current.demo}
    </div>
  );
}
