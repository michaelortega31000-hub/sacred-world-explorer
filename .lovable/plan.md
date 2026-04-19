

## Phase 12 — Micro-fixes: Globe header cross, Planner logo, Transport modes

### 1. Globe tab header — enlarge cross only
`src/components/Header.tsx`: the round container is `w-20 h-20` (keep as-is). Currently `<ChristianIcon size="lg" className="scale-[1.9]" />` — bump scale to `scale-[2.85]` (+50%). Container size, header padding, and globe area untouched.

### 2. Planner central logo — +15-20%
`src/pages/Planner.tsx` uses `<Logo size="large" effect="glow" />`. Two safe options:
- Bump `large` variant in `src/components/ui/logo.tsx` from `w-96 h-96` → `w-[28rem] h-[28rem]` (+~17%), OR
- Add a wrapper `scale-[1.18]` only in Planner.

Going with the **wrapper scale** approach to avoid affecting other consumers of `size="large"`. Wrap the Planner `<Logo>` in a `<div className="scale-[1.18]">`.

### 3. Optimiser mon itinéraire — full transport modes + realistic ETA
`src/components/TripPlannerTab.tsx` already has a 2x2 transport grid (per memory `itinerary-controls-layout`). Expand to 6 modes in a 3x2 grid:

| Mode | Icon | Avg speed (km/h) |
|---|---|---|
| Avion | Plane | 750 |
| Train | TrainFront | 200 |
| Bus | Bus | 70 |
| Voiture | Car | 90 |
| Vélo | Bike | 18 |
| Marche | Footprints | 5 |

- Track selected mode in local state (default: Voiture).
- Total distance = sum of Haversine between consecutive stops (already computed).
- ETA = `distanceKm / speed` → format `Xh YYmin` (or `YYmin` if <1h, or `Xj YYh` if >24h for walking).
- Display under the transport grid: **Distance: X km · Durée: Y**.
- Recalculate on every mode change or stop reorder via `useMemo`.

### Files touched (3)
- `src/components/Header.tsx` — bump `ChristianIcon` scale to `2.85`
- `src/pages/Planner.tsx` — wrap central `<Logo>` with `scale-[1.18]`
- `src/components/TripPlannerTab.tsx` — 6 transport modes, selected state, distance + ETA recompute

### Untouched
Logo component sizes · Globe3D · Planner save logic · localStorage trip key · BottomNavigation · DB.

### Risks
- `Footprints` icon exists in lucide-react (confirmed). If `TrainFront` unavailable, fall back to `Train`.
- Wrapper scale on Logo can bleed beyond parent — use `inline-block` wrapper so it doesn't disrupt flex layout.

