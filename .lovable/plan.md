## What I verified

I loaded your app inside the same headless browser the IDE uses:

- `/explore` → fully renders the globe, header, bottom nav. No JS error.
- `/u/:username` → renders correctly and shows "Profil introuvable" (because `:username` is the literal route placeholder, not a real username).
- `document.body.innerText` confirms the React tree is mounted with full content on both routes.

So the app itself **is not blank**. What is blank is only the small embedded preview pane inside the Lovable IDE (the area to the right of the chat).

## Root cause of the blank IDE pane

This is a Lovable platform iframe issue, not an app bug:

- The IDE preview iframe runs `https://cdn.gpteng.co/lovable.js`, which posts a `RESET_BLANK_CHECK` message to detect blank iframes.
- The console shows: `Unknown message type: RESET_BLANK_CHECK` — the message is being received but the iframe wrapper version doesn't recognize it. The handshake fails, so the IDE keeps showing the cached blank frame even though the app rendered.
- Opening the preview in a new tab or fullscreen bypasses that handshake — which is exactly what you observe.

There is **no code change in our project that will fix this** beyond what we already did (one-time SW/cache reset). The fix lives in Lovable's iframe wrapper. The reliable workaround stays: open the preview in a new tab or fullscreen.

## Real bug found while investigating

The network log shows every `user_progress` upsert returning **HTTP 400**:

```
{"code":"23502","message":"null value in column \"last_quest_date\" of relation \"user_progress\" violates not-null constraint"}
```

Cause: the new `guard_user_progress_insert` trigger force-sets `last_quest_date := NULL`, but the column is declared `NOT NULL`. Every save silently fails (only saved by chance because old rows already exist).

## Plan

### 1. Fix the `user_progress` 400 errors (migration)

Make `last_quest_date` nullable so the security trigger can legitimately blank it on insert:

```sql
ALTER TABLE public.user_progress
  ALTER COLUMN last_quest_date DROP NOT NULL;
```

(The trigger already sets server-controlled defaults; nothing else needs to change.)

### 2. Tell you clearly about the IDE preview

I'll add a short note in chat after applying the fix:

- The blank inner preview is a Lovable IDE iframe handshake bug, not your code.
- Use "Open in new tab" / fullscreen until Lovable updates `lovable.js`.
- Everything else in the app (auth, globe, profiles, saving progress) will work correctly once the migration above ships.

### 3. No other code edits

I will not touch `main.tsx`, `AppContext`, route guards, or `PublicProfile` — they all behave correctly in the headless test. Adding more "blank screen workarounds" risks regressions without fixing the actual platform issue.

## Out of scope

- I will not implement a custom `RESET_BLANK_CHECK` listener — that's Lovable platform code, not app code.
- I will not change route guards or the loader again — they render correctly.
