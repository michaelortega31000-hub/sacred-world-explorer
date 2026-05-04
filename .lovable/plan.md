## Problem

The user is stuck on the pre-React bootstrap shell ("SACREDWORLD / CHARGEMENT…") inside the embedded preview iframe. Verification shows the app actually mounts correctly when loaded directly in a browser (Splash renders with the "Continuer" CTA), so this is **not** a runtime error in `Country.tsx` or `Splash.tsx`.

The bootstrap shell lives inside `#root` in `index.html`. React's `createRoot(container).render(...)` normally replaces those children on mount — so the shell only persists if **`main.tsx` never executes `render()`** in that iframe. Most likely causes for the embedded preview specifically:

1. A stale **service worker** from a previous build is still controlling the iframe and serving an outdated `index.html` / module bundle that fails silently.
2. The one-shot SW cleanup in `main.tsx` (keyed by `localStorage["sw-reset-2026-05-04"]`) already ran once for this origin in a prior session, so it does nothing now even though the SW is still serving stale assets.
3. The bootstrap shell has no self-timeout — if React fails to mount for any reason, the user is trapped forever with no fallback.

## Fix

Three small, defensive changes — no feature work, no risk to existing flows.

### 1. `index.html` — make the bootstrap shell self-dismissing

- Add a `<script>` at the end of `<body>` that, after **6 seconds**, if `#root` does not yet have `data-app-mounted="true"`:
  - Replaces the shell with a minimal recovery UI: "Le chargement prend plus de temps que prévu" + a **"Recharger l'application"** button that calls `location.reload()` and a **"Vider le cache et recharger"** button that unregisters service workers, clears `caches`, clears `localStorage["sw-reset-*"]` keys, then reloads.
- This guarantees the user can never be permanently trapped on the loading shell, regardless of cause.

### 2. `main.tsx` — bump the cache-reset key and harden cleanup

- Change `SW_RESET_KEY` from `"sw-reset-2026-05-04"` to `"sw-reset-2026-05-04-b"` so the one-shot cleanup runs again for every existing user (this clears whatever stale SW/cache is currently trapping the preview).
- After `caches.delete(...)` and `registration.unregister(...)` complete, if any SW was actually unregistered, call `location.reload()` once (guarded by a sessionStorage flag to avoid loops) so the freshly-served assets are picked up.

### 3. `index.html` — move the bootstrap shell out of `#root`

- Currently the shell is a child of `#root`, which is fine in theory (React clears it on mount) but means a half-failed mount can leave the page blank with no indicator.
- Move `#sw-bootstrap` to be a **sibling** of `#root` (direct child of `<body>`), positioned `fixed inset-0 z-[-1]`. The CSS rule already hides it via `#root[data-app-mounted="true"] ~ #sw-bootstrap { display: none; }` (updated selector). This way the shell acts as a true background — it doesn't depend on React replacing children, and the recovery script in step 1 can manipulate it independently.

## Files touched

- `index.html` — restructure shell, add recovery `<script>`, update CSS selector.
- `src/main.tsx` — bump `SW_RESET_KEY`, add one-shot reload after cache cleanup.

## Verification

After implementation:
1. Hard-refresh the preview — shell appears, then disappears within ~1s as React mounts (Splash visible).
2. Simulate a stuck mount (temporarily throw in `main.tsx`) — after 6s the recovery UI appears with working "Recharger" / "Vider le cache" buttons.
3. Confirm `Country.tsx` (the recent refactor) still renders correctly with both "Lieux sacrés" and "Musées & lieux culturels" sections.
