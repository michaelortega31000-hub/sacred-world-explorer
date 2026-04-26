## Phase 31 — Seamless Globe view: remove the visual cut between map and tabs

### Problem
On `/explore` (map tab), there is a visible horizontal band between the 3D globe and the bottom navigation. It comes from two stacked bars:

1. The secondary `TabsList` (AR / Proche / Lieux / Défis / Rang) in `src/pages/Explore.tsx` — uses `bg-background/95 backdrop-blur-md shadow-2xl border-t-2 border-primary/40`, which renders as a hard opaque strip with a top border + shadow.
2. The primary `BottomNavigation` in `src/components/BottomNavigation.tsx` — uses `border-t border-primary/20` and `boxShadow: '0 -4px 20px rgba(52, 224, 161, 0.1)'`, plus a near-opaque dark gradient.

Together they create the "purple/gray band" the user wants gone.

### Fix (scoped to bottom bars — keeps icons clearly visible)

**1. `src/pages/Explore.tsx` — secondary TabsList (sub-tabs above bottom nav)**
- Remove `border-t-2 border-primary/40` and `shadow-2xl`.
- Replace `bg-background/95 backdrop-blur-md` with a transparent → dark gradient that blends into the map: `bg-gradient-to-b from-transparent via-background/40 to-background/80 backdrop-blur-sm`.
- Keep `fixed bottom-[36px]` positioning, grid, and triggers untouched (so AR/Proche/Lieux/Défis/Rang still work).
- Result: tabs float over the globe with a soft fade — no hard line.

**2. `src/components/BottomNavigation.tsx` — primary bottom nav**
- Remove `border-t border-primary/20`.
- Remove the green top glow `boxShadow: '0 -4px 20px rgba(52, 224, 161, 0.1)'`.
- Soften the gradient start so it fades from semi-transparent into the existing deep-blue: change `linear-gradient(180deg, rgba(20, 43, 79, 0.95) 0%, rgba(14, 27, 63, 0.98) 100%)` to `linear-gradient(180deg, rgba(20, 43, 79, 0.55) 0%, rgba(14, 27, 63, 0.92) 100%)`.
- Keep `backdrop-blur-md` so icons stay legible.
- Icons, labels, golden highlight, active states — all unchanged.

### What stays the same
- All five sub-tabs and their icons/labels.
- Bottom-nav items (Profil, Globe, Planifier, Journal, Réglages), navigation behavior, golden Planifier highlight.
- Fullscreen mode (already hides both bars — unaffected).

### Files changed
- `src/pages/Explore.tsx` — className change on the secondary `TabsList`.
- `src/components/BottomNavigation.tsx` — className + inline style changes on the `<nav>`.

### Verification
- `/explore` map tab: globe extends seamlessly into the bottom area; tab icons float over the map with a soft dark fade — no visible line, border, or shadow band.
- Sub-tabs and bottom-nav buttons remain tappable and visually clear.
- Switching to AR / Proche / Lieux / Défis / Rang and back to map still works.
- Fullscreen toggle still hides both bars.

### Risk
Very low. Pure styling change on two components, no logic, no routing, no state.