

## Phase 28 — Shrink floating Back/Assistant buttons + add safe top padding

### Problem
The current `w-14 h-14` floating Back button (top-3 left-3) and Assistant button (top-3 right-3) overlap page titles like "Paramètres", "Admin Dashboard", "Test de Sécurité", and similar `h1` headings that sit close to the top of the page. See screenshot: the back arrow is layered over the "P" of "Paramètres".

### Fix
Two minimal, global changes — no per-page rewrites needed:

1. **Reduce both floating buttons** from `w-14 h-14` → `w-10 h-10`, icon `w-7 h-7` → `w-5 h-5`, and soften the glow. Keep position `top-3 left-3` / `top-3 right-3`. This alone eliminates most overlap because the small button (≈40px) clears typical heading line-height.

2. **Add a small global top safe-area** so titles never sit underneath the buttons. Inject `scroll-padding-top` and a CSS variable `--floating-nav-safe` (≈56px = 40px button + 16px gap) in `src/index.css`, then apply `pt-14` (or use the variable) to the **two pages whose `h1` currently starts at the very top edge and is most at risk**:
   - `src/pages/Settings.tsx` — `<h1>Paramètres</h1>` (line 302): change wrapper `py-4 sm:py-8` to `pt-16 sm:pt-20 pb-4 sm:pb-8`.
   - `src/pages/SecurityTest.tsx` — title row at line 227: add `pt-16` to its container.
   - `src/pages/AdminDashboard.tsx` — title row at line 33: add `pt-16` to its container.
   - `src/pages/Profile.tsx`, `src/pages/Country.tsx`, `src/pages/UserProfile.tsx`, `src/pages/Badges.tsx`, `src/pages/AvatarsGallery.tsx`, `src/pages/Reminders.tsx`, `src/pages/OfflineManager.tsx`, `src/pages/AdminEnrichData.tsx`, `src/pages/AdminAuditImages.tsx`, `src/pages/Admin.tsx`, `src/pages/Traditions.tsx`, `src/pages/Calendar.tsx`, `src/pages/Journal.tsx`, `src/pages/PlaceDetail.tsx`, `src/pages/Planner.tsx`, `src/pages/PublicProfile.tsx`, `src/pages/NotFound.tsx` — verify each top container has `pt-16` (or sufficient existing top padding ≥ 56px). Add `pt-16` only where missing.

   Pages we do NOT touch (back button hidden there): `Splash`, `Auth`, `Welcome`, `OnboardingDenomination`, `Explore`, `Home`.

### Files changed
- `src/components/FloatingBackButton.tsx` — shrink button + icon, soften shadow.
- `src/components/FloatingAssistantButton.tsx` — shrink button + icon, soften shadow (kept symmetric).
- `src/pages/Settings.tsx`, `SecurityTest.tsx`, `AdminDashboard.tsx`, `Profile.tsx`, `Country.tsx`, `UserProfile.tsx`, `Badges.tsx`, `AvatarsGallery.tsx`, `Reminders.tsx`, `OfflineManager.tsx`, `AdminEnrichData.tsx`, `AdminAuditImages.tsx`, `Admin.tsx`, `Traditions.tsx`, `Calendar.tsx`, `Journal.tsx`, `PlaceDetail.tsx`, `Planner.tsx`, `PublicProfile.tsx`, `NotFound.tsx` — only adjust the OUTERMOST top-padding of the main container (e.g. `py-4` → `pt-16 pb-4`) when current top padding is < 56px. No layout, color, or content change.

### Visual
```text
Before:                          After:
┌─────────────────┐              ┌─────────────────┐
│[←]Paramètres   [💬]│         │[←]         [💬]│   ← compact 40px buttons
│  ↑ overlap      │              │ Paramètres      │   ← clear heading
└─────────────────┘              └─────────────────┘
```

### Verification
- `/settings`: "Paramètres" title fully visible, no overlap with back button.
- `/admin/dashboard`, `/security-test`, `/profile`, `/country/*`, `/badges`, `/calendar`, `/journal`, `/reminders`, `/avatars`, `/place/*`, `/planner`, `/u/*`, `/user/*`: titles visible with breathing room above.
- `/explore`: only Assistant visible (smaller now), no Back button.
- `/`, `/auth`, `/welcome`, `/onboarding/denomination`: no floating buttons, no padding change.

### Risk
Low. Pure CSS sizing + top-padding adjustments. No state, routing, or component logic changes. Padding additions are additive — content shifts down slightly, never breaks layout.

