

## Phase 19 — Global multi-select transport modes (replaces Phase 18 per-leg UI)

### Goal
Replace single-mode + per-segment selection with a single **global multi-select** of allowed transport modes. Transitous picks the best multi-modal journey per leg using any selected mode.

### Changes (1 file: `src/components/LocationsTab.tsx`)

1. **State**
   - Remove `transportMode` (single) and `segmentModes` / `loadingSegmentIdx` (per-leg, from Phase 18).
   - Add `selectedModes: TransportMode[]` (default `['driving']`). At least one mode always selected — clicking the last active toggles to default.

2. **Top grid (3×3-ish)** — each of the 7 buttons is now a toggle:
   - `variant={selectedModes.includes(mode) ? 'default' : 'outline'}`
   - Click → toggle in/out of array. Guard: prevent emptying the array.
   - Layout unchanged (Avion·Train·Bus / Voiture·Métro·Vélo / Marche).

3. **Caption under grid**
   - `Modes sélectionnés : Avion + Train + Bus` (join active labels with ` + `).

4. **Routing logic — `calculateRouteSegments`**
   - For each leg, decide branch from `selectedModes`:
     - If any of `plane|train|bus|metro` is selected → **Transitous** with combined allowed-modes string (e.g. `AIRPLANE,RAIL,BUS,SUBWAY,WALK`). Transitous returns best multi-modal itinerary.
     - Else (only `driving`/`cycling`/`walking` chosen) → **Mapbox** with the first locomotion mode in the array.
   - Recompute all legs whenever `selectedModes` changes (existing `useEffect` pattern).

5. **Remove per-segment pill row** added in Phase 18 from each leg row. Keep the distance/duration/correspondances line.

6. **Totals row** — unchanged (already aggregates across legs).

7. **PDF export** — single line: `Modes autorisés : Avion + Train + Bus`.

### Untouched
- Transitous helper signature (just receives a comma-joined modes string), Mapbox routing per locomotion mode, totals aggregation, hotels/restaurants, Planner, Globe, PlaceDetail, design tokens.

### Verification
1. `/explore` → Mon itinéraire with Bordeaux → León → Delphi.
2. Toggle Avion + Train + Métro active → caption updates, all legs recompute via Transitous, totals show distance/duration/correspondances.
3. Toggle to only Voiture → Mapbox driving for all legs.
4. Cannot deselect the last active mode.
5. Export PDF → shows `Modes autorisés : …`.

