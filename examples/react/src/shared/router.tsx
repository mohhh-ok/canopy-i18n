import { type ReactNode, useSyncExternalStore } from "react";

const ROUTE_EVENT = "canopy-route-change";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(ROUTE_EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(ROUTE_EVENT, callback);
  };
}

export function useCurrentPath(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.pathname,
    () => "/",
  );
}

interface LinkProps {
  to: string;
  active: boolean;
  children: ReactNode;
}

export function Link({ to, active, children }: LinkProps) {
  return (
    <a
      href={to}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        if (window.location.pathname === to) return;
        window.history.pushState({}, "", to);
        window.dispatchEvent(new Event(ROUTE_EVENT));
      }}
      style={{
        padding: "10px 16px",
        fontSize: "14px",
        textDecoration: "none",
        borderBottom: active
          ? "2px solid #007bff"
          : "2px solid transparent",
        color: active ? "#007bff" : "#555",
        fontWeight: active ? 600 : 400,
        marginBottom: "-1px",
      }}
    >
      {children}
    </a>
  );
}
