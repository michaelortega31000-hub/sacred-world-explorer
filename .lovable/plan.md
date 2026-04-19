

## Phase 10 — Logo cleanup + Persistent trajectory

### Investigation needed
- Check current Logo: it uses `logo-v4.png` and `logo-glow.png` images. The "blue rectangle" is likely baked into the PNG itself (transparent PNG with blue bg) OR a CSS wrapper. Need to verify.
- Check Globe tab: identify which component renders the globe on the Globe tab and whether it shares trip state with Planner.

### Plan

**1. Logo 4 — remove blue background, enlarge cross**

Since the blue rectangle is baked into the source PNG (`logo-v4.png` / `logo-glow.png`), CSS can't remove it without clipping. Two options:

- **Option A (preferred)**: Apply a circular `clip-path` / `rounded-full` + `overflow-hidden` mask to the `<img>` so only the round sun orb shows. Combined with `scale-[1.45]` on an inner wrapper to enlarge the cross visually inside the visible circle.
- **Option B**: Generate a new clean SVG logo (sun orb + rays + cross, no background). More work but cleaner long-term.

Going with **Option A** for speed and zero asset regeneration. Update `src/components/ui/logo.tsx`:
- Wrap `<img>` in `rounded-full overflow-hidden` container sized to the variant.
- Apply `scale-[1.45]` to the `<img>` so the cross fills more of the visible circle (the blue corners get clipped away by the round mask).
- Soften glow: `drop-shadow-[0_0_20px_rgba(244,197,66,0.75)] drop-shadow-[0_0_40px_rgba(244,197,66,0.75)]` at opacity 0.75.
- Apply across all variants (small/medium/large) and both `main` + `icon` variants.

**2. Persistent trajectory across Planner ↔ Globe tab**

Currently `departure` + `destinations` live in `Planner.tsx` local state → lost when navigating to `/explore` (Globe tab).

Fix by persisting saved trip to `localStorage` on save, and reading it from the Globe tab's globe component:
- In `Planner.tsx` `handleSave`: write `{ departure, destinations, savedAt }` to `localStorage` under key `sacred-saved-trip`.
- On Planner mount: hydrate state from `localStorage` if present so the trajectory is still drawn after refresh/return.
- Identify the Globe tab's main 3D globe (likely `Globe3D.tsx` used in `/explore`) and add a small overlay or pass the saved trip arcs to it. If `Globe3D.tsx` is Mapbox-based (not R3F), draw arcs as Mapbox `LineLayer` from the saved coords with the same golden/orange glow styling.

### Files touched (~3)

**Edited:**
- `src/components/ui/logo.tsx` — circular mask + scale + softer glow
- `src/pages/Planner.tsx` — persist saved trip to localStorage, hydrate on mount
- `src/components/Globe3D.tsx` (or equivalent on /explore) — read saved trip from localStorage and render golden arcs

### Untouched
PlaceSelectorModal · BottomNavigation · DB · RLS · ItineraryGlobe3D internals (already handles arcs correctly on Planner screen).

### Risks
- If `logo-v4.png` has the cross off-center, the `scale-[1.45]` may shift it — will use `object-contain` + `object-center` to keep it anchored.
- Globe tab globe may be Mapbox not Three.js → arc rendering API differs. Will inspect `Globe3D.tsx` first and adapt.

