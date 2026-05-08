import { createPathnameI18nReact } from "canopy-i18n/react";
import { useCurrentPath } from "../../shared/router";
import { Card } from "../../shared/Card";
import { Code } from "../../shared/Code";
import { commonMsgs } from "../../shared/messages";
import { Switcher } from "../../shared/Switcher";
import { LOCALES } from "../../types";

const { LocaleProvider, useLocale, useBindLocale } = createPathnameI18nReact(
  LOCALES,
  { basePath: "/pathname" },
);

const SAMPLE = `const { LocaleProvider, useLocale, useBindLocale } =
  createPathnameI18nReact(LOCALES, { basePath: "/pathname" });`;

const SAMPLE_PATHS = LOCALES.map((l) => `/pathname/${l}/xxx`);

function navigate(to: string, e: React.MouseEvent) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  if (window.location.pathname === to) return;
  window.history.pushState({}, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function Inner() {
  const { locale, setLocale } = useLocale();
  const m = useBindLocale(commonMsgs);
  const path = useCurrentPath();
  return (
    <Card title={m.pathname.title()} description={m.pathname.description()}>
      <Code>{SAMPLE}</Code>
      <Switcher locale={locale} setLocale={setLocale} />
      <p style={{ margin: 0 }}>{m.base.welcome()}</p>
      <p style={{ margin: 0, fontSize: "13px" }}>
        URL: <code>{path}</code>
      </p>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {SAMPLE_PATHS.map((p) => (
          <a
            key={p}
            href={p}
            onClick={(e) => navigate(p, e)}
            style={{ fontSize: "13px" }}
          >
            {p}
          </a>
        ))}
      </div>
      <small style={{ color: "#888" }}>{m.pathname.hint()}</small>
    </Card>
  );
}

export function PathnameDemo() {
  return (
    <LocaleProvider>
      <Inner />
    </LocaleProvider>
  );
}
