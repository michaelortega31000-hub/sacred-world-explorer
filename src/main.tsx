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
const SW_RESET_KEY = "sw-reset-2026-05-04-c";
if (typeof window !== "undefined") {
  const host = window.location.hostname;
  const isPreviewSandbox =
    host.endsWith(".lovableproject.com") ||
    host.endsWith(".lovable.app") ||
    host === "localhost" ||
    host === "127.0.0.1";

  // In preview/sandbox: always unregister any SW so a stale one cannot
  // trap the iframe on the loading shell. Do NOT reload — that causes loops.
  if (isPreviewSandbox && "serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then((regs) => regs.forEach((r) => r.unregister()))
      .catch(() => { /* ignore */ });
  }

  // Production: one-time cache + SW cleanup, no automatic reload.
  if (!import.meta.env.DEV && !isPreviewSandbox) {
    try {
      if (localStorage.getItem(SW_RESET_KEY) !== "1") {
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.getRegistrations()
            .then((regs) => regs.forEach((r) => r.unregister()))
            .catch(() => { /* ignore */ });
        }
        if ("caches" in window) {
          caches.keys()
            .then((names) => Promise.all(names.map((n) => caches.delete(n))))
            .catch(() => { /* ignore */ });
        }
        try { localStorage.setItem(SW_RESET_KEY, "1"); } catch { /* ignore */ }
      }
    } catch {
      /* localStorage may be unavailable in some preview iframes */
    }
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
  // Mark the root as mounted so the pre-React bootstrap shell hides.
  // Use rAF to wait until React has actually painted the first frame.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      container.setAttribute("data-app-mounted", "true");
    });
  });
}
