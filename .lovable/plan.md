
## Diagnosis

The app itself is **not broken**. I navigated directly to `/explore?tab=map` in a clean browser and the globe, header, and bottom nav rendered correctly. The white area you see is the **embedded preview iframe** in the Lovable editor.

### Why the embedded preview is white

- The embed URL `id-preview--<id>.lovable.app/...` returns **302 → `lovable.dev/auth-bridge?...`**.
- That bridge needs Lovable's session cookie to be readable inside the iframe.
- If the browser blocks third-party cookies (Safari ITP, Brave, Firefox strict, uBlock/Privacy Badger), or your Lovable login expired, the bridge can't complete inside the frame and the pane stays blank.
- Opening in a new tab works because the page is now first-party, so the cookie is sent normally.
- The console message `Unknown message type: RESET_BLANK_CHECK` is Lovable's blank-detector pinging the iframe — confirming the iframe is loaded but its body never paints.

This is an editor/browser-level issue, not an app bug. Things you can try right now (no code change needed):
1. In the editor, click the small refresh icon in the preview toolbar.
2. Open `https://lovable.dev` in a tab and make sure you're logged in, then come back.
3. In your browser site settings for `lovable.dev` and `lovable.app`, allow third-party cookies.
4. Disable any ad-blocker / privacy extension for `lovable.app`.
5. Try a different browser (Chrome usually "just works").

### One small code fix worth making

`src/main.tsx` currently unregisters every service worker and deletes every cache on **every page load, in production too**. This was added to fix a stale-bundle problem during development, but in production it:
- defeats the offline mode you intentionally built (`public/sw.js`),
- forces the browser to refetch everything on every visit,
- can make the embedded preview look "stuck on white" longer because nothing is ever cached.

Proposed change in `src/main.tsx`:
- Run the SW unregister + cache wipe **only in dev** (`import.meta.env.DEV`), or behind a one-time `localStorage` flag so it runs once per user and not on every load in production.
- Leave the production service worker alone so offline mode keeps working.

That's the only code edit. It won't fix the iframe-cookie issue (nothing in your code can — that's the platform/browser), but it stops your prod app from constantly clearing its own cache.

## Steps

1. Edit `src/main.tsx`: gate the `serviceWorker.unregister()` + `caches.delete()` block behind `import.meta.env.DEV` (or a one-shot `localStorage` flag).
2. No other files change.

## What this will and will not fix

- Will: stop nuking caches/SW in prod, restoring offline mode and reducing reload churn in the embedded preview.
- Will not: force the embedded iframe to render if your browser is blocking the auth-bridge cookie. For that, the fix is on the browser/Lovable-login side (refresh, re-login, allow third-party cookies, or use the new-tab preview button — which is what the platform recommends when this happens).
