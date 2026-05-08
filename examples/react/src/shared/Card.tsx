import type { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

export function Card({ title, description, children }: Props) {
  return (
    <section
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        background: "white",
      }}
    >
      <h2 style={{ margin: "0 0 6px 0", fontSize: "1.2em" }}>{title}</h2>
      <p style={{ margin: "0 0 16px 0", color: "#666", fontSize: "0.9em" }}>
        {description}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {children}
      </div>
    </section>
  );
}
