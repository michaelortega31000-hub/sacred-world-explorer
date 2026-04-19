

## Phase 15 — Hide kosher/halal everywhere + city-unique fallbacks

### Issue 1: Kosher restaurant still visible (e.g. "Kasher Gourmet" Bordeaux)

Current state: `RestaurantsTab.tsx` filters them, but **3 other places do not**:

1. **`PlaceDetail.tsx` `searchNearbyPOIs`** (line 518) — queries `restaurants` table without excluding halal/kosher. The Bordeaux screenshot ("Kasher Gourmet" + tag "kosher") comes from here.
2. **`LocationsTab.tsx` POI search** (line 545) — queries restaurants for itinerary suggestions without filtering.
3. **`LocationsTab.tsx` saved restaurants** (line 724) — fetches user's saved list as-is (older saves may include halal/kosher).

**Fix:** in all 3 queries, append a Postgres array exclusion filter:
```ts
.not('type', 'cs', '{halal}')   // type does NOT contain 'halal'
.not('type', 'cs', '{kosher}')  // type does NOT contain 'kosher'
```
And for the `savedRestaurants` array in `LocationsTab`, post-filter the result to drop any with `type` containing halal/kosher (defensive, in case the user already saved one earlier).

### Issue 2: Same restaurants/hotels appear in every city (Switzerland test)

Current state: `samplePoiData.ts` returns the same 3 generic French names ("Le Réfectoire", "Café du Cloître", "Table d'Hôte {city}") for every place. This fallback fires when the DB has 0 matches for that city (e.g. Genève has 1 row → DB hits, but the user is browsing Swiss locations where DB is sparse).

**Fix:** make samples genuinely city-unique by:

1. **Country-aware naming** — pick name patterns based on `place.country`:
   - 🇫🇷 France → "Le Cloître Saint-{X}", "Auberge {city}", "Bistrot du Parvis"
   - 🇨🇭 Switzerland → "Auberge des Alpes {city}", "Café Helvétia {city}", "Le Tilleul {city}"
   - 🇪🇸 Spain → "Mesón {city}", "Posada del Camino", "Taberna del Peregrino"
   - 🇮🇹 Italy → "Trattoria {city}", "Osteria del Pellegrino", "Locanda {city}"
   - 🇩🇪 Germany → "Gasthaus {city}", "Pilger Stube", "Klosterhof"
   - 🇵🇹 Portugal → "Tasca {city}", "Adega do Romeiro"
   - 🇬🇷 Greece → "Taverna {city}", "Estiatorio Agios"
   - Default → keep current French names but always inject `{city}` and `{place.name}` so every output is visibly different.

2. **Same logic for hotels & transports** — Hôtel templates per country (Hôtel/Hostal/Albergo/Pension/Pousada), train/airport names use `place.city` (e.g. "Gare de Genève" / "Bahnhof Bern" / "Estación de León").

3. **Deterministic seed from `place.id`** — pick template variants using a hash of the place id so each place gets a stable but different combination (no two adjacent places share the exact same 3 names).

### Files touched (3)

- `src/lib/samplePoiData.ts` — country-aware templates + place-id seeded variant picker (full rewrite of the 3 builders).
- `src/pages/PlaceDetail.tsx` — add `.not('type','cs','{halal}')` & `.not('type','cs','{kosher}')` to the restaurants query (line 518–522).
- `src/components/LocationsTab.tsx` — same exclusion on the itinerary restaurant search (line 545–548), and post-filter `savedRestaurants` to drop halal/kosher (line 725–727).

### Untouched

DB rows (non-destructive — kept for other apps/future) · Globe header · Planner page · Transport grid · `RestaurantsTab.tsx` (already filtered).

### Verification after merge

- Bordeaux place detail → "Kasher Gourmet" disappears, only "Green Soul" remains for restaurants.
- Genève / Berne / any Swiss place → fallback names use Swiss patterns ("Auberge des Alpes Genève") not generic French.
- `/explore` → Mon itinéraire → Restaurants recommandés never shows halal/kosher tags.

