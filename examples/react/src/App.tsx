import type { ReactElement } from "react";
import { CookieDemo } from "./patterns/cookie/Demo";
import { HashDemo } from "./patterns/hash/Demo";
import { PathnameDemo } from "./patterns/pathname/Demo";
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
  { path: "/pathname", label: "URL pathname", demo: <PathnameDemo /> },
  { path: "/storage", label: "localStorage", demo: <StorageDemo /> },
  { path: "/cookie", label: "Cookie", demo: <CookieDemo /> },
];

export default function App() {
  const path = useCurrentPath();
  const current =
    ROUTES.find((r) => path === r.path || path.startsWith(`${r.path}/`)) ??
    ROUTES[0]!;

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
        <h1 style={{ margin: "0 0 6px 0" }}>Canopy i18n — Source Wrappers</h1>
        <p style={{ margin: 0, color: "#666" }}>
          Built-in <code>create*I18nReact</code> wrappers that bundle a locale
          source (URL hash / search param / pathname / localStorage / cookie)
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
