import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { LocaleProvider } from "./i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LocaleProvider defaultLocale="en">
      <App />
    </LocaleProvider>
  </StrictMode>,
);
