import { AutoDetectDemo } from "./patterns/AutoDetectDemo";
import { HashDemo } from "./patterns/HashDemo";
import { SearchParamDemo } from "./patterns/SearchParamDemo";
import { StorageDemo } from "./patterns/StorageDemo";

export default function App() {
  return (
    <div
      style={{
        maxWidth: "720px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.6",
      }}
    >
      <header style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: "0 0 6px 0" }}>
          Canopy i18n — Factory <code>useLocaleSource</code> Patterns
        </h1>
        <p style={{ margin: 0, color: "#666" }}>
          createI18nReact の factory option <code>useLocaleSource</code>{" "}
          をどんなソースに繋ぐかのパターン集
        </p>
      </header>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
        <HashDemo />
        <SearchParamDemo />
        <StorageDemo />
        <AutoDetectDemo />
      </div>
    </div>
  );
}
