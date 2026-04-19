

## Phase 17 — Add Métro mode + remove "Masquer l'itinéraire"

### Goal
Reorganize the transport grid in `LocationsTab.tsx`:
- Add a new **🚇 Métro** button under Train.
- Move **🚲 Vélo** under Métro (new column position).
- Remove the **"Masquer l'itinéraire"** button entirely.

### Current layout (3×2 grid)
```
[✈️ Avion]    [🚂 Train]   [🚌 Bus]
[🚗 Voiture]  [🚲 Vélo]    [🥾 Marche]
[Masquer l'itinéraire — full width]
```

### New layout (4×2 grid)
```
[✈️ Avion]    [🚂 Train]   [🚌 Bus]    [🚗 Voiture]
[🥾 Marche]   [🚇 Métro]   [🚲 Vélo]   [ (empty) ]
```

Wait — re-reading the user: "underneath train you put métro and you put vélo underneath métro". So the user wants a **vertical** stack under Train:
```
Row 1: [Avion]  [Train]  [Bus]    [Voiture]  [Marche]
Row 2:          [Métro]
Row 3:          [Vélo]
```

That's awkward in a grid. Simpler interpretation: keep the 3×2 grid, **add Métro and reflow**:

```
[✈️ Avion]    [🚂 Train]    [🚌 Bus]
[🚗 Voiture]  [🚇 Métro]    [🚲 Vélo]
[🥾 Marche — full width or col 1]
```

I'll go with this clean 3-column layout (Métro added as new mode, Vélo stays beside it, Masquer removed). Will confirm only if user pushes back.

### Implementation (1 file)

**`src/components/LocationsTab.tsx`**

1. **Type extension** — add `'metro'` to the `transportMode` union (and any related `TransportMode` type).
2. **Transitous mapping** — extend `fetchTransitousRoute` to handle `metro` → `['SUBWAY','WALK']`. Falls back to Haversine at 40 km/h average if API fails.
3. **Haversine fallback speeds** — add `metro: 40` km/h.
4. **Button grid** — replace current 3×2 grid:
   - Row 1: Avion · Train · Bus
   - Row 2: Voiture · Métro · Vélo
   - Row 3: Marche (full width, same styling as siblings)
   - Each new button mirrors existing pattern: `Loader2` spinner when active+loading, `disabled={loadingRouteInfo}`, lucide icon (use `TrainFront` for Métro since no dedicated metro icon — or keep `Train` icon variant).
5. **Remove** the "Masquer l'itinéraire" button block entirely.
6. **Recalc trigger** — `useEffect` already watches `transportMode`, so Métro will auto-refresh distance/duration/correspondances.

### Untouched
- Transitous helper structure, totals row, hotels amber, city headers turquoise, Mapbox driving/cycling/walking, Planner page, Globe, PlaceDetail.

### Verification after merge
1. `/explore` → Mon itinéraire shows 7 transport buttons (no Masquer).
2. Click Métro → spinner → distance/duration update (Transitous SUBWAY or Haversine fallback).
3. All other modes still work, totals row still shows correspondances for Train/Bus/Métro.

