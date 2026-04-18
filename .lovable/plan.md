

## Plan: Pivot SacredWorld to "Catholic + Curious" identity

This is a major pivot. I'll reshape the app's identity, content focus and visuals around Christian (mainly Catholic) heritage while preserving all working infrastructure (gamification, offline mode, Stripe, auth, DB).

The app has 200+ files and a live backend, so I'll work in **safe incremental phases** — not a full rewrite — to avoid breaking what already works.

### Phase 1 — Identity & branding

**Onboarding & Welcome (`src/pages/Welcome.tsx`, `src/pages/Splash.tsx`)**
- Replace the 4-religion carousel with a 3-screen Christian onboarding:
  - S1: *Bienvenue sur SacredWorld – Votre compagnon du patrimoine chrétien*
  - S2: *Pour les chrétiens et les curieux de patrimoine sacré*
  - S3: *Collectionnez les lieux sacrés comme un véritable pèlerin*
- Tagline: *"Découvrez, vivez et collectionnez le patrimoine sacré chrétien"*
- Hero carousel: Notre-Dame, Lourdes, Mont-Saint-Michel, Sacré-Cœur, Vatican, Chartres.

**Single Christian icon system**
- New `src/components/ChristianIcon.tsx` (elegant golden cross, no kitsch).
- Replace `ReligionIcon` usages in header, filters, badges with the cross / SacredWorld logo.

**Force Christianity app-wide**
- Default `selectedReligion = 'christianity'` in `AppContext`, hide religion selector.
- Filter places, calendar, quiz, saints to Christian-only via existing helpers.
- Hide multi-faith UI (continent legends, religion picker, non-Christian filters in CalendarLegend / ChallengesTab).

### Phase 2 — Navigation & content

**Bottom nav (`src/components/BottomNavigation.tsx`)**
- New: **Accueil · Carte · Lieux · Ma Collection · Profil**
- Carte = existing `/explore` (Mapbox), pre-filtered to French Catholic sites with clusters.
- Lieux = list view. Ma Collection = `/journal` reskinned around "DÉBLOQUÉ" pilgrim badges.

**Place detail (`src/pages/PlaceDetail.tsx`)** — two new tabs:
- *Dimension spirituelle*: messes, prières, intentions, pèlerinages.
- *Dimension culturelle*: histoire, architecture, anecdotes.
- Keep existing services (resto/hôtels/transports) and POI map.

### Phase 3 — Gamification reskin

- Rename badges: *Pèlerin de Lourdes*, *Amateur de cathédrales gothiques*, *Marcheur de Saint-Jacques*, *Gardien des reliques*…
- Keep "DÉBLOQUÉ" mechanic, points and sharing intact.

### Phase 4 — Cleanup (later)

- Remove unused multi-faith assets (crescent, star-david, lotus, om, spirit) once nothing references them.
- Archive `ReligionAnimation`, multi-faith parts of `CountriesByContinent`.

### What I will NOT touch

- Supabase schema, auth, RLS, Stripe, offline mode, logger, edge function secrets.
- `src/integrations/supabase/client.ts` and `types.ts`.

### Two questions before I start

1. **How aggressive this first round?**
   - **A.** Phase 1 only (safest, ~6 files: identity + onboarding + force Christian filter — instant new identity, zero risk on routing)
   - **B.** Phase 1 + 2 (~15 files: adds new bottom nav + place detail tabs)
   - **C.** Phase 1 + 2 + 3 (~25 files: full pivot in one shot, highest impact, more risk)

2. **What about non-Christian data already in the DB?**
   - **A.** Hide from UI, keep in DB (recommended, reversible, no migration)
   - **B.** Hide + mark as archived in DB (cleaner, requires migration)
   - **C.** Delete entirely (destructive, I'd advise against)

Tell me your picks (e.g. "1A, 2A") and I'll execute.

