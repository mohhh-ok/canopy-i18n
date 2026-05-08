import { ControlledDemo } from "./patterns/ControlledDemo";
import { HashDemo } from "./patterns/HashDemo";
import { StorageDemo } from "./patterns/StorageDemo";
import { UncontrolledDemo } from "./patterns/UncontrolledDemo";

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
        <h1 style={{ margin: "0 0 6px 0" }}>Canopy i18n — Locale Patterns</h1>
        <p style={{ margin: 0, color: "#666" }}>
          createI18nReact で作れる locale state の管理パターン集
        </p>
      </header>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
        <UncontrolledDemo />
        <ControlledDemo />
        <HashDemo />
        <StorageDemo />
      </div>
    </div>
  );
}
