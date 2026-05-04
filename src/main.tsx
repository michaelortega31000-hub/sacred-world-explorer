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
const SW_RESET_KEY = "sw-reset-2026-05-04-b";
const SW_RELOAD_FLAG = "sw-reset-reload-done";
if (!import.meta.env.DEV && typeof window !== "undefined") {
  try {
    if (localStorage.getItem(SW_RESET_KEY) !== "1") {
      const tasks: Promise<unknown>[] = [];
      let unregisteredAny = false;
      if ("serviceWorker" in navigator) {
        tasks.push(
          navigator.serviceWorker.getRegistrations().then(async (regs) => {
            for (const r of regs) {
              const ok = await r.unregister();
              if (ok) unregisteredAny = true;
            }
          }),
        );
      }
      if ("caches" in window) {
        tasks.push(
          caches.keys().then((names) =>
            Promise.all(names.map((n) => caches.delete(n))),
          ),
        );
      }
      Promise.all(tasks).finally(() => {
        try {
          localStorage.setItem(SW_RESET_KEY, "1");
        } catch {
          /* ignore */
        }
        // Reload once if we actually killed a stale SW, so the freshly-served
        // bundle is picked up. sessionStorage guard prevents reload loops.
        if (unregisteredAny && sessionStorage.getItem(SW_RELOAD_FLAG) !== "1") {
          try { sessionStorage.setItem(SW_RELOAD_FLAG, "1"); } catch { /* ignore */ }
          location.reload();
        }
      });
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
  // Mark the root as mounted so the pre-React bootstrap shell hides.
  // Use rAF to wait until React has actually painted the first frame.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      container.setAttribute("data-app-mounted", "true");
    });
  });
}
