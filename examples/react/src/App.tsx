import { msgsDef } from "./i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useBindLocale } from "./LocaleContext";
import { ProfileCard } from "./ProfileCard";
import type { User } from "./types";

export default function App() {
  const m = useBindLocale(msgsDef);

  // 動的メッセージのサンプルデータ
  const user: User = {
    name: "太郎",
    count: 5,
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "30px",
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.6",
      }}
    >
      <header style={{ marginBottom: "30px", textAlign: "center" }}>
        <h1 style={{ margin: "0 0 20px 0", fontSize: "2em" }}>
          {m.baseI18n.title()}
        </h1>
        <LanguageSwitcher />
      </header>

      <main
        style={{
          background: "#f5f5f5",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <p style={{ margin: "0 0 15px 0", fontSize: "1.1em" }}>
          {m.baseI18n.welcome()}
        </p>
        <p style={{ margin: "0", color: "#666" }}>
          {m.baseI18n.description()}
        </p>
      </main>

      <section style={{ marginTop: "30px" }}>
        <h2 style={{ fontSize: "1.5em", marginBottom: "15px" }}>
          {m.features.title()}
        </h2>
        <ul style={{ paddingLeft: "20px" }}>
          <li style={{ marginBottom: "8px" }}>{m.features.typeSafe()}</li>
          <li style={{ marginBottom: "8px" }}>{m.features.simple()}</li>
          <li style={{ marginBottom: "8px" }}>{m.features.chainable()}</li>
        </ul>
      </section>

      <section
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#e3f2fd",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ fontSize: "1.5em", marginBottom: "15px" }}>
          Dynamic Messages (addTemplate)
        </h2>
        <p style={{ marginBottom: "10px", fontSize: "1.1em" }}>
          {m.dynamicMessages.greeting(user)}
        </p>
        <p style={{ margin: "0", color: "#555" }}>
          {m.dynamicMessages.itemCount(user)}
        </p>
      </section>

      <section
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#e8f5e9",
          borderRadius: "8px",
        }}
      >
        <h2>Standalone Component Example</h2>
        <ProfileCard />
      </section>

      <footer
        style={{
          marginTop: "40px",
          paddingTop: "20px",
          borderTop: "1px solid #ddd",
          textAlign: "center",
          color: "#888",
          fontSize: "0.9em",
        }}
      >
        {m.baseI18n.footer()}
      </footer>
    </div>
  );
}
