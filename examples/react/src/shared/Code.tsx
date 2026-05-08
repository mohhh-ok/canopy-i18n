interface Props {
  children: string;
}

export function Code({ children }: Props) {
  return (
    <pre
      style={{
        margin: 0,
        padding: "10px 12px",
        background: "#f6f8fa",
        border: "1px solid #eee",
        borderRadius: "6px",
        fontSize: "12px",
        lineHeight: 1.5,
        overflow: "auto",
      }}
    >
      <code>{children}</code>
    </pre>
  );
}
