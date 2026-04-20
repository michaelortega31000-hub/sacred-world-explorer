

## Phase 27 — Move Back button to top-left globally

### Problem
The floating AI assistant now lives at top-right on every page. The "Retour au globe" (back arrow) button currently also sits on the right side of the header — it now collides with the assistant button and creates visual clutter. It should move to the top-left, mirroring the assistant's position, on every page where it's relevant (i.e. NOT on `/explore`, where the globe IS the destination).

### Fix
Create a global `FloatingBackButton` component, mounted once in `App.tsx` next to `FloatingAssistantButton`. It renders a fixed circular button at `top-3 left-3` that navigates to `/explore`. It hides itself on routes where a back-to-globe action makes no sense, and the duplicate back arrows inside `Header.tsx` are removed.

### Implementation

**1. New file: `src/components/FloatingBackButton.tsx`**
- Fixed position `top-3 left-3 z-[60]`.
- Same circular `w-14 h-14` styling as the assistant button (golden glow, primary border) for visual symmetry — but with `ArrowLeft` icon.
- Hidden on these routes:
  - `/` (Splash)
  - `/auth`, `/welcome`, `/onboarding/denomination`
  - `/explore` (the globe itself — nothing to go back to)
- On click: `navigate('/explore')`.

**2. Edit `src/App.tsx`**
- Import and mount `<FloatingBackButton />` alongside `<FloatingAssistantButton />`.

**3. Edit `src/components/Header.tsx`**
- Remove both inline "Retour au globe" buttons (the compact-header one ~line 130 and the normal-header one ~line 175) since the floating button now handles this globally.
- Leave the rest of the header untouched (logo, badges, messages, religion icon).

### Visual
```text
┌─────────────────────────────────────────────┐
│  [← Back]              [💬 Assistant]       │  ← top-3, both w-14 h-14
│                                             │
│              Page content                    │
└─────────────────────────────────────────────┘
```
Symmetric, glowing, always available.

### Verification
- `/journal`, `/calendar`, `/profile`, `/country/*`, `/place/*`, `/planner`, `/settings`, `/badges`, `/traditions`, `/avatars`, `/reminders`, `/admin*` → back arrow visible top-left, assistant top-right.
- `/explore` → only assistant visible (no back button).
- `/`, `/auth`, `/welcome`, `/onboarding/denomination` → neither floating button visible.
- No duplicate back arrows remain inside any header.

### Risk
Minimal. Pure additive component + removal of two button blocks in `Header.tsx`. No data, routing, or state changes.

