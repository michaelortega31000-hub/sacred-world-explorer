

## Phase 13 — Final micro-fixes: Compact header + transport grid

### 1. Globe tab header — compact layout
`src/components/Header.tsx`:
- Reduce header padding: `py-2 px-4` → `py-1 px-3` (cuts ~30% height)
- Shrink left circular icon container: `w-20 h-20` → `w-14 h-14` while keeping `scale-[2.85]` on the cross inside
- Standardize right-side bubble sizes: Mail button `p-1.5`, Assistant `w-12 h-12`, VoiceCommand (check its internal sizing) — align all to ~44-48px visual footprint

### 2. Transport modes verification
`src/components/TripPlannerTab.tsx`:
- Already implements 6 modes (Plane, TrainFront, Bus, Car, Bike, Footprints) in 3x2 grid
- Already auto-recalculates Distance + Duration on mode change via `useMemo`
- No changes needed — functionality is present

### Files touched (1)
- `src/components/Header.tsx` — padding, container sizing, right-side icon uniformity

### Untouched
TripPlannerTab (already complete) · Planner logo (user said don't change) · Globe3D · BottomNavigation.

