

## Phase 20 — Polish "Lieux Sacrés du Monde" (LocationsTab)

Single file: `src/components/LocationsTab.tsx`. No changes to Planner, Globe tab, or transport modes (the 6+1 buttons stay as-is).

### 1. Filters & Search — fully functional + always alphabetical
- Replace the static-dataset helpers with **live, locale-aware sorted lists** derived from `allPlaces` (so DB-loaded places are included):
  - `continents = [...new Set(allPlaces.map(p => getContinent(p.country)))].sort((a,b)=>a.localeCompare(b,'fr'))`
  - `countries = ...filter(continent match)...sort(localeCompare 'fr')`
  - `cities = ...filter(country match)...sort(localeCompare 'fr')`
- `filteredPlaces` final sort → `.sort((a,b)=>a.name.localeCompare(b.name,'fr'))` so the grid is always A→Z.
- Cascade reset already works; verify resetting `Pays`/`Ville` when parent changes (already in `handleContinentChange` / `handleCountryChange`).

### 2. Golden alphabetical scrollbar (A–Z) on right of place list
- New small subcomponent `<AlphaJumpRail letters={availableLetters} onJump={fn} />` rendered **inside the ScrollArea wrapper** (absolute right-1, top-0, bottom-0, w-6).
- Letters: derived from `filteredPlaces[].name[0].toUpperCase()` set, then full A–Z shown but **inactive letters dimmed** (opacity 30%, no click).
- Style: vertical stack, `text-[10px] font-semibold` golden gradient `text-[#F4C542]` with `hover:text-white hover:scale-125 transition`.
- Click handler: scrolls the closest matching card into view via `data-letter={firstLetterOfName}` attributes on each card and `scrollIntoView({behavior:'smooth', block:'start'})`.
- Add `pr-10` to the grid (instead of `pr-4`) so cards don't go under the rail.
- Applied to both tabs: "Tous les lieux" and "Mon itinéraire".

### 3. Typography & style consistency with Planner
- Page title `Lieux Sacrés du Monde`: replace flat `#34E0A1` with the **Planner gradient**:
  ```
  background: linear-gradient(135deg,#FFFFFF 0%,#F4C542 60%,#E0A84C 100%);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  filter: drop-shadow(0 2px 12px rgba(244,197,66,0.3));
  ```
  + subtitle line with `text-[#F4C542]/85` and ✦ flourish (matches Planner's "✦ Vers un lieu sacré ✦" tone).
- All section `CardTitle` (filter card, "Optimiser mon itinéraire", "Itinéraire optimisé") → keep size but switch primary color to golden `text-[#F4C542]` with subtle `drop-shadow(0 0 8px rgba(244,197,66,0.4))`.
- Tabs (`TabsTrigger`) active state → golden underline/accent (data-state=active styles using `bg-[#F4C542]/15 text-[#F4C542]`).
- Filter labels → `text-[#F4C542]/80 uppercase tracking-wider text-xs`.

### 4. "Mon itinéraire" prominence
- Wrap the **Optimiser mon itinéraire** card in:
  - Border `border-2 border-[#F4C542]/40`
  - Background `bg-gradient-to-br from-[rgba(244,197,66,0.08)] via-[rgba(20,43,79,0.6)] to-[rgba(14,27,63,0.85)]`
  - `shadow-[0_8px_40px_rgba(244,197,66,0.15)]` and `backdrop-blur-md`
  - Title icon `Route` → golden, larger (`w-6 h-6`).
- Keep existing inputs/grid/transport buttons untouched (transport buttons unchanged per request). The `selectedLabel()` caption gains `text-[#F4C542]` accent.
- "Itinéraire optimisé" card receives the same golden border + glow treatment.

### 5. Place cards — livelier & premium
- Image container: change `h-48` → `aspect-[4/3]` + `overflow-hidden rounded-t-lg`. Add `object-cover transition-transform duration-700 group-hover:scale-110`.
- Card class additions:
  - `group relative` 
  - `border` swap: default `border border-[#34E0A1]/15`; **when in trip** `border-2 border-[#F4C542]/60 shadow-[0_0_24px_rgba(244,197,66,0.25)]` (selected = golden border per request).
  - `hover:scale-[1.03] hover:shadow-[0_12px_40px_rgba(244,197,66,0.18)] transition-all duration-300` (replace existing `hover:scale-105`).
- Add subtle gradient overlay on image bottom: `absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0E1B3F]/90 to-transparent`.
- Title in `font-serif text-[#F4C542]` (matches Planner premium feel).
- "Visited" badge keeps turquoise glow (existing behaviour preserved).
- Apply identical card styling to both tabs ("Tous les lieux" and "Mon itinéraire") for consistency.
- Add `data-letter={place.name[0].toUpperCase()}` for the A–Z rail.

### Untouched
- Planner page, Globe tab, the 7 transport buttons (Avion/Train/Bus/Voiture/Métro/Vélo/Marche), routing logic (Transitous + Mapbox), totals row, PDF export, hotels/restaurants sections.

### Verification
1. `/explore` → "Lieux Sacrés du Monde" title shows white→gold gradient with glow.
2. Continent → Pays → Ville dropdowns alphabetical (test with French accents like "Égypte", "Île-de-France").
3. Place cards grid sorted A→Z with visible golden A–Z rail on right; click "L" → scrolls to first place starting with L.
4. Cards in "Mon itinéraire" show golden border + glow; hover lifts smoothly.
5. "Optimiser mon itinéraire" card has golden border, gradient bg, prominent shadow. The 7 transport buttons + caption unchanged in behavior.
6. No regression on PDF export, route calculation, or POI sections.

