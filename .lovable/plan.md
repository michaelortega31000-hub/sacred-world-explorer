

## Phase 6 — Cinematic /planner page + Logo 4 + Bottom nav update

### 1. Logo 4 asset
- Save uploaded image to `src/assets/logo-v4.png`.
- Update `src/components/ui/logo.tsx`: replace `logoMain` import with `logo-v4.png` so every `<Logo variant="main" />` usage picks it up automatically.
- Verify Splash uses `variant="main"` — if not, switch it.

### 2. New standalone page `/planner` — `src/pages/Planner.tsx`
Cinematic immersive layout, mobile-first (iPhone 15/16 ~390×844, validated against 802×745 viewport):

- **Background layer**: reuse existing `ItineraryGlobe3D` (R3F night globe with golden arcs already in project) at full screen, dimmed.
- **Hero photo overlay**: semi-transparent Mont-Saint-Michel image (use existing asset from `placesData` or `getImagesByCountry('France')`), `mix-blend-overlay` + radial gradient mask so globe stays visible.
- **Header**: new Logo 4 (small, glowing) + back button. Title "Planifier un trajet" in large white font with golden gradient, subtitle "Vers un lieu sacré" with soft golden glow (`drop-shadow`).
- **4 action buttons** (glassmorphic dark cards with golden border, discreet `ChristianIcon` cross):
  1. *Définir un départ* (MapPin icon)
  2. *Ajouter une destination* (Plus icon)
  3. *Tracer le parcours* (Route icon)
  4. *Enregistrer le trajet* — bright golden glowing CTA, larger, primary action
- **Local state only** (no DB writes this phase): `departure`, `destinations[]`, `routeDrawn`. "Enregistrer" shows toast confirmation. Existing `TripPlannerTab` untouched.
- **Palette**: deep blue `#0E1B3F` → `#142B4F`, golden `#E0A84C` glows, turquoise accents kept minimal.

### 3. Routing
- `src/App.tsx`: add `<Route path="/planner" element={<Planner />} />`.

### 4. Bottom navigation update — `src/components/BottomNavigation.tsx`
Replace current 5 tabs (Accueil / Carte / Lieux / Collection / Profil) with: **Profil / Globe / Planifier / Journal / Classement**.
- Profil → `/profile` (User)
- Globe → `/explore` (Globe icon)
- **Planifier** → `/planner` (Route icon) — golden glow when active (stronger `drop-shadow` + golden text vs default turquoise)
- Journal → `/journal` (BookHeart)
- Classement → `/profile?tab=ranking` or new fallback to `/profile` (Trophy icon) — using profile ranking tab since no standalone ranking page exists.

### Files touched (~4)
**New**: `src/assets/logo-v4.png`, `src/pages/Planner.tsx`
**Edited**: `src/components/ui/logo.tsx`, `src/App.tsx`, `src/components/BottomNavigation.tsx`

### Untouched
`TripPlannerTab.tsx` · DB schema · RLS · all other pages · existing globe components.

### Risks
- **Classement route**: no dedicated page exists → routes to `/profile` (ranking tab already there). Flag to user if they want a standalone `/ranking` page later.
- **Hero image weight**: use existing French asset, no new download.
- **Globe perf on mobile**: `ItineraryGlobe3D` already used in TripPlanner, proven OK.

