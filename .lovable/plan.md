

## Phase 16 — Transitous API integration for plane/train/bus routing

### Goal
Replace the Haversine fallback for `plane` / `train` / `bus` modes in `LocationsTab.tsx` with **real multi-modal routing from Transitous MOTIS 2 API**. Keep the existing Mapbox Directions for `driving`/`cycling`/`walking`. UI is unchanged.

### Investigation summary
- `LocationsTab.tsx` already has `calculateRouteSegments()` triggered by `transportMode` change (verified Phase 14).
- For straight-line modes today, it uses `calculateDistanceInKm` × hard-coded speed (plane 800 km/h, train 200 km/h, bus 70 km/h).
- Loading spinner + per-mode UI already wired (Phase 14).

### Transitous MOTIS 2 endpoint
Public, no API key required:
```
GET https://api.transitous.org/api/v1/plan
  ?fromPlace={lat},{lon}
  &toPlace={lat},{lon}
  &time={ISO}
  &arriveBy=false
  &mode=TRANSIT,WALK            // train+bus
  &mode=AIRPLANE,WALK           // plane (Transitous includes flights when available)
```
Response contains `itineraries[].duration` (sec), `legs[]` (each with `mode`, `distance`, `from/to`), and `transfers` count.

### Implementation plan (1 file)

**`src/components/LocationsTab.tsx`**

1. **New helper** (top of file, near other utils):
   ```ts
   async function fetchTransitousRoute(
     from: [number, number],     // [lng, lat]
     to:   [number, number],
     mode: 'plane' | 'train' | 'bus'
   ): Promise<{ distanceKm: number; durationMin: number; transfers: number } | null>
   ```
   - Maps mode → Transitous mode list:
     - `plane` → `['AIRPLANE','WALK']`
     - `train` → `['RAIL','WALK']` (TRAM/SUBWAY excluded)
     - `bus`   → `['BUS','WALK']`
   - Builds URL with `URLSearchParams`, `fetch` with 8 s `AbortController` timeout.
   - Picks first itinerary, sums leg `distance` (m → km), reads `duration` (s → min), and `legs.filter(l => l.mode !== 'WALK').length - 1` for transfers (clamped ≥ 0).
   - Returns `null` on any error → caller falls back to Haversine.

2. **Patch `calculateRouteSegments()`**:
   - Inside the segment loop, when `transportMode` is `plane`/`train`/`bus`:
     ```ts
     const transitous = await fetchTransitousRoute(
       [from.coordinates[0], from.coordinates[1]],
       [to.coordinates[0],   to.coordinates[1]],
       transportMode
     );
     if (transitous) {
       segment.distance   = transitous.distanceKm;
       segment.duration   = transitous.durationMin;
       segment.transfers  = transitous.transfers;
     } else {
       // existing Haversine fallback (unchanged)
     }
     ```
   - For `driving`/`cycling`/`walking` → unchanged Mapbox path.

3. **Extend `RouteSegment` type** with optional `transfers?: number`.

4. **UI tweak (minimal, same grid)**: when `segment.transfers && segment.transfers > 0`, append a small badge next to the per-segment Durée:
   ```
   Durée: 4h 12min · 2 correspondances
   ```
   Same line, same color, no layout change. Totals row also shows the sum of transfers when > 0 for `train`/`bus` (skipped for `plane`).

5. **Logging**: route any errors through `@/lib/logger` (per Core memory).

### What stays untouched
- TripPlannerTab, Planner page, Globe header/logo, PlaceDetail, sample POI fallbacks, DB, RestaurantsTab.
- Mapbox routing for car/bike/walk.
- Button grid layout, spinner behavior, colors (city headers turquoise, hotels amber).

### Risk & fallback
- Transitous is a community service → 8 s timeout + automatic Haversine fallback ensures the screen never breaks.
- No API key, no secrets to add.
- One file changed, additive only — no breaking edits.

### Verification after merge
1. `/explore` → Mon itinéraire with ≥2 cities (e.g. Bordeaux → León).
2. Click Train → spinner → Distance/Durée update with realistic rail values + "X correspondances" if any.
3. Click Bus → similar real values.
4. Click Avion → flight duration if route covered, else Haversine fallback.
5. Click Voiture/Vélo/Marche → unchanged Mapbox behavior.
6. Disconnect network → all transit modes gracefully fall back to Haversine.

