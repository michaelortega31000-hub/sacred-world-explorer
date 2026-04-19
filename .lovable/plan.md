

## Phase 14 — Add Avion / Train / Bus to LocationsTab transport grid

### Root cause
The screenshot shows the **`LocationsTab.tsx`** "Optimiser mon itinéraire" card (visible at `/explore` → "Mon itinéraire" tab). Only 3 modes are wired (`driving`/`cycling`/`walking`) — Avion, Train, Bus were never added here. We previously added them to `TripPlannerTab.tsx` (the `/planner` page), which is a different component. The "Masquer" green button you saw is actually the **Itinéraire/Masquer toggle**, not a transport mode.

### Fix — single file: `src/components/LocationsTab.tsx`

**1. Extend transport state type (line 84)**
```ts
const [transportMode, setTransportMode] = useState<
  'plane' | 'train' | 'bus' | 'driving' | 'cycling' | 'walking'
>('driving');
```

**2. Update `calculateRouteSegments` (lines 290–339)**
- Mapbox Directions API only supports `driving` / `cycling` / `walking`.
- For `plane` / `train` / `bus`, skip the API call and use Haversine straight-line distance with realistic average speeds:
  - Avion → 750 km/h
  - Train → 200 km/h
  - Bus → 70 km/h
- Keep current Mapbox call for `driving` / `cycling` / `walking` (real road routing preserved).

**3. Replace the 2-row button block (lines 1048–1069) with a clean 3×2 grid + separate "Itinéraire/Masquer" button below**
```tsx
<div className="flex flex-col gap-2">
  <div className="grid grid-cols-3 gap-2">
    <Button variant={transportMode === 'plane' ? 'default' : 'outline'} size="sm" onClick={() => setTransportMode('plane')}>
      <Plane className="w-4 h-4 mr-1" /> Avion
    </Button>
    <Button variant={transportMode === 'train' ? 'default' : 'outline'} size="sm" onClick={() => setTransportMode('train')}>
      <TrainFront className="w-4 h-4 mr-1" /> Train
    </Button>
    <Button variant={transportMode === 'bus' ? 'default' : 'outline'} size="sm" onClick={() => setTransportMode('bus')}>
      <Bus className="w-4 h-4 mr-1" /> Bus
    </Button>
    <Button variant={transportMode === 'driving' ? 'default' : 'outline'} size="sm" onClick={() => setTransportMode('driving')}>
      <Car className="w-4 h-4 mr-1" /> Voiture
    </Button>
    <Button variant={transportMode === 'cycling' ? 'default' : 'outline'} size="sm" onClick={() => setTransportMode('cycling')}>
      <Bike className="w-4 h-4 mr-1" /> Vélo
    </Button>
    <Button variant={transportMode === 'walking' ? 'default' : 'outline'} size="sm" onClick={() => setTransportMode('walking')}>
      <Footprints className="w-4 h-4 mr-1" /> Marche
    </Button>
  </div>
  {startingCity && (
    <Button onClick={() => setShowOptimizedRoute(!showOptimizedRoute)} size="sm" className="w-full gap-2">
      <Navigation className="w-4 h-4" />
      {showOptimizedRoute ? 'Masquer l\'itinéraire' : 'Afficher l\'itinéraire'}
    </Button>
  )}
</div>
```

**4. Update PDF label (line 186)** to handle all 6 modes.

**5. Add icon imports** — add `Plane, TrainFront, Bus, Footprints` to the existing `lucide-react` import (and remove `PersonStanding` if unused after Marche → Footprints swap, otherwise keep).

### Auto-recalculation
Already wired via the existing `useEffect` at line 688 (deps include `transportMode`) — switching to Avion/Train/Bus will automatically rerun `calculateRouteSegments`, update `routeSegments`, and refresh the displayed Distance + Durée per segment and totals.

### Files touched (1)
- `src/components/LocationsTab.tsx` — state type, calc function, button grid, PDF label, icon imports.

### Untouched
TripPlannerTab · Globe header · Planner logo · PlaceDetail · sample POI fallbacks · DB.

### Risk
`PersonStanding` was used for Marche; switching to `Footprints` (consistent with TripPlannerTab) is cosmetic and safe — both icons exist in lucide-react.

