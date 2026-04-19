

## Phase 18 — Per-segment transport mode selection

### Goal
Allow the user to pick a **different transport mode for each segment** of the itinerary in `LocationsTab.tsx` (e.g. Bordeaux→León by ✈️ Avion, then León→local by 🚲 Vélo, then →Delphi by ✈️ Avion, then Delphi local by 🚇 Métro).

### Current behaviour
- One global `transportMode` applied to **every** segment.
- Top grid of 7 buttons sets the mode for the whole route.

### New behaviour
- Keep the global grid as a **"set all to…"** quick-action (one click → applies to every segment).
- Add a **per-segment selector** inline with each route segment row showing a compact icon-only dropdown / button row, defaulting to the global mode but independently overridable.
- When a per-segment mode changes, only **that segment** is recalculated (Transitous or Mapbox), not the whole route.
- Totals row sums distance/duration/correspondances across mixed modes — already works since it just iterates `routeSegments`.

### Implementation (1 file: `src/components/LocationsTab.tsx`)

1. **State**
   - Add `const [segmentModes, setSegmentModes] = useState<TransportMode[]>([])`.
   - When `displayRoute` changes length, resize `segmentModes` to `displayRoute.length - 1`, defaulting new entries to the current global `transportMode`.
   - When the global `transportMode` changes via the top grid, reset all `segmentModes` to that value (the "set all" semantic).

2. **Refactor `calculateRouteSegments`**
   - Take `places` + an array `modes: TransportMode[]` (one per pair).
   - Inside the loop, use `modes[i]` instead of the single `mode` arg.
   - Transit branch (`plane|train|bus|metro`) and Mapbox branch (`driving|cycling|walking`) selected per-iteration.
   - Returns/sets `routeSegments` as today.

3. **New helper `recalcSegment(index, newMode)`**
   - Updates `segmentModes[index] = newMode`.
   - Recomputes only that single segment (not all) and patches `routeSegments[index]`.
   - Sets a per-segment loading flag `loadingSegmentIdx: number | null`.

4. **UI: per-segment selector**
   - Inside each route-segment row (the existing distance/duration/correspondances line), add a compact horizontal pill row of 7 small icon buttons (Plane/Train/Bus/Car/Metro/Bike/Footprints).
   - Active mode = `segmentModes[i]` highlighted with `variant="default"`, others `variant="outline"`, `size="icon"` (`h-7 w-7`).
   - On click → `recalcSegment(i, mode)`. While that index is loading, show `Loader2` spinner over the active button.
   - Place above the distance/duration row, with subtle label "Mode pour ce trajet".

5. **Top grid label tweak**
   - Change the top grid heading (or add a small caption) to: `"Appliquer à tous les trajets"`. Functional change: clicking still updates global mode AND resets all per-segment modes.

6. **Totals row** — no change, already aggregates `routeSegments`.

7. **PDF export** — when modes are mixed, replace the single "Mode de transport" line with a per-segment list (e.g. `Étape 1 → 2: Avion`, `Étape 2 → 3: Vélo`, …). If all equal → keep current single line.

### Untouched
- Transitous helper, Mapbox routing logic per mode, totals row, hotels/restaurants, Planner page, Globe, PlaceDetail, design tokens.

### Verification after merge
1. `/explore` → Mon itinéraire with Bordeaux → León → Delphi.
2. Top grid set to Voiture → all 2 segments show Voiture, totals computed.
3. Click Métro on segment 2 only → only segment 2 recalculates, totals update with mixed values + Métro correspondances counted.
4. Spinner shows only on the segment being recalculated, not the whole route.
5. Export PDF → lists each leg's mode.

