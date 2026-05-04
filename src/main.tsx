import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// Dev-only: unregister stale service workers and wipe caches that may serve
// old React bundles ("Invalid hook call"). In production we keep the SW so
// offline mode (public/sw.js) keeps working.
if (import.meta.env.DEV) {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  }

  if ("caches" in window) {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
  }
}

// One-time production cleanup: previous builds aggressively cached the app
// shell, which can keep the embedded preview iframe blank after updates.
// Bump SW_RESET_KEY to force another single cleanup in the future.
const SW_RESET_KEY = "sw-reset-2026-05-04";
if (!import.meta.env.DEV && typeof window !== "undefined") {
  try {
    if (localStorage.getItem(SW_RESET_KEY) !== "1") {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((regs) => {
          regs.forEach((r) => r.unregister());
        });
      }
      if ("caches" in window) {
        caches.keys().then((names) => names.forEach((n) => caches.delete(n)));
      }
      localStorage.setItem(SW_RESET_KEY, "1");
    }
  } catch {
    /* localStorage may be unavailable in some preview iframes */
  }
}


const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}
