

## Phase 9 — Interactive Planner: Progressive selection + Globe tap (revised)

Same scope as before, with added guidance text and badges in the modal.

### 1. Logo 4 — bigger, brighter cross
`src/components/ui/logo.tsx`:
- Stronger golden glow on the cross (drop-shadow 0 0 24px + 0 0 48px), opacity 0.7/0.5, slightly larger halo.
- Applied globally → Splash + Planner header.

### 2. New `PlaceSelectorModal` (3 steps)
`src/components/planner/PlaceSelectorModal.tsx` — Dialog with breadcrumb `Continent › Pays › Lieu sacré`.

Each step starts with a small guiding subtitle (centered, golden/85, text-sm):
- **Step 1 — Continent**: subtitle *"Choisissez un continent"*. 6 glassmorphic tiles (Europe, Amérique, Asie, Afrique, Océanie, Moyen-Orient).
- **Step 2 — Pays**: subtitle *"Choisissez un pays"*. Filtered country list (flag + name) from `src/data/countries.ts` + search input.
- **Step 3 — Lieu sacré**: subtitle *"Choisissez un lieu sacré"*. Cards from `placesData.ts` filtered by country (image, name, city, short description). **Each card shows a small golden "Lieu sacré" badge** (top-left, glassmorphic, Cross icon + label). "Choisir" CTA per card.

"Retour" at each step. Modal returns `{ placeId, name, city, country, lat, lng }`.

Two entry points share the modal: `Définir un départ` and `Ajouter une destination`.

### 3. Globe quick-path
Extend `ItineraryGlobe3D` with optional `onCountryClick` + `selectionMode` props (additive, no break to TripPlanner).
- Tap a country in selection mode → opens modal pre-jumped to Step 3 for that country.
- Floating chip top-center: *"Touchez un pays pour ajouter une destination"* with ✕.

### 4. Smart "Enregistrer" button
- Disabled (no glow) until `departure && destinations.length >= 1`.
- Active → full golden CTA. Toast: *"Trajet enregistré ✨ — {departure.city} → {N} étape(s)"*.

### 5. Polish
- Selected places shown as golden chips above buttons (✕ to remove).
- Globe arcs recompute live from `departure + destinations` (no more `SAMPLE_PLACES`).
- Empty state: France highlighted softly.

### Files touched (~4)

**New:** `src/components/planner/PlaceSelectorModal.tsx`

**Edited:**
- `src/components/ui/logo.tsx` (cross glow)
- `src/pages/Planner.tsx` (state, modal wiring, chips, conditional CTA, globe selection mode)
- `src/components/ItineraryGlobe3D.tsx` (optional `onCountryClick` + `selectionMode`)

### Untouched
DB · RLS · `TripPlannerTab` · BottomNavigation · Settings · onboarding.

### Risks
- Shared globe component: new props optional → existing consumers unaffected.
- Country place coverage: empty state card *"Aucun lieu disponible pour ce pays"* if none.
- Mobile modal: `max-h-[85vh]` + internal scroll on Step 3.

