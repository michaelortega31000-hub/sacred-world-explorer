

## Phase 2 — Navigation, Place Detail & French Christian Focus

Building on Phase 1 (Christian identity locked in). This phase reshapes navigation around the Catholic + Curious flow, redesigns Place Detail with rich spiritual/cultural tabs, and pre-filters the map for France.

### 1. New Bottom Navigation (`src/components/BottomNavigation.tsx`)

Replace current 4-tab bar with the 5-tab pilgrim flow:

| Tab | Icon | Route |
|---|---|---|
| Accueil | `Home` | `/home` (new) |
| Carte | `Map` | `/explore` |
| Lieux | `Church` | `/places` (new) |
| Ma Collection | `BookHeart` | `/journal` |
| Profil | `User` | `/profile` |

Keep compact style (per memory `bottom-navigation-compact-style`), 5 columns instead of 4.

### 2. New `src/pages/Home.tsx` (Accueil)

- Hero carousel: Notre-Dame, Lourdes, Mont-Saint-Michel, Sacré-Cœur, Vatican, Chartres.
- Tagline + subtitle visible on screen.
- Sections: "À découvrir cette semaine", "Cathédrales emblématiques", "Sur les chemins de pèlerinage", quick CTA → `/explore`, `/places`, `/journal`.
- Uses `ChristianIcon` + SacredWorld logo only.

### 3. New `src/pages/Places.tsx` (Lieux)

- List view sourced from existing `usePlaces` + `placesData` (already filtered Christian via Phase 1).
- Search bar + filters: **Région** (Île-de-France, Occitanie, Normandie, PACA, Bretagne…) and **Type** (Cathédrale · Basilique · Sanctuaire · Abbaye · Chemin de pèlerinage).
- Reuses existing `PlaceCard` (already shows "DÉBLOQUÉ" badge).
- France-first default sort.

### 4. Redesigned Place Detail (`src/pages/PlaceDetail.tsx`)

Keep hero image + existing services/POI map. Replace current tabs with two clear ones, **each pre-filled with sample content** so the experience feels complete from day one:

**Tab 1 — Dimension spirituelle**
- **Horaires des messes**: sample weekly grid (e.g. *Lun-Ven 8h & 18h30 · Sam 9h & 18h · Dim 9h, 11h, 18h*) with a small note "Horaires indicatifs – à confirmer auprès du sanctuaire".
- **Prières du jour**: rotating short prayer card (Notre Père, Je vous salue Marie, prière du soir) tied to the day.
- **Formulaire d'intention de prière**: textarea + name field + "Déposer mon intention" button (local-only for now, UI-ready for future backend wiring).
- **Audio guide prière** button reusing existing `useAudioGuide`.

**Tab 2 — Dimension culturelle**
- **Style architectural**: badge + 2-3 line description (Gothique, Roman, Baroque, Byzantin…).
- **Faits historiques**: 3-4 bullet timeline highlights (date de construction, événements marquants, classement UNESCO si applicable).
- **Anecdotes pour les curieux**: 2-3 fun-fact cards with light icons (le saviez-vous ? détails insolites, légendes locales).

Keep "DÉBLOQUÉ" badge system. Add prominent **"Ajouter à ma collection"** CTA wired to existing collection logic in `AppContext`.

### 5. Map France-First (`src/components/Globe3D.tsx` / `src/pages/Explore.tsx`)

- Initial fly-to France (lng ~2.5, lat ~46.5, zoom ~5) when no user geolocation.
- Marker filter respects forced `christianity` (Phase 1).
- Clustering already present via Mapbox.
- Hide non-Christian filter chips in Explore tab nav.

### 6. Routing (`src/App.tsx`)

- Add `/home` → `Home`, `/places` → `Places`.
- Splash CTA points to `/home` instead of `/explore`.

### 7. Style consistency

- Keep deep blue / golden / turquoise palette (no token changes).
- Single icon system: `ChristianIcon` + `Logo` only on user-facing surfaces.
- Tagline + subtitle on Splash, Home, Welcome.

### Files touched (~14)

**New (3):** `src/pages/Home.tsx`, `src/pages/Places.tsx`, `src/components/home/HeroCarousel.tsx`

**Edited (~11):** `BottomNavigation.tsx`, `App.tsx`, `Splash.tsx`, `PlaceDetail.tsx` (with the spiritual/cultural sample content), `Explore.tsx`, `Globe3D.tsx`, `Header.tsx`, `Journal.tsx` (headline → "Ma Collection"), `LocationsTab.tsx` (region/type filters), `PlaceCard.tsx` ("Ajouter à ma collection" CTA), `index.css` if needed.

### Untouched

Supabase schema · RLS · Stripe · Offline (`sw.js`, IndexedDB) · `client.ts` / `types.ts` · edge function secrets · logger.

### Risks & mitigations

- **Routing regression**: keep legacy redirects, add `/home` and `/places` on top.
- **DB content leakage**: Phase 1 forces `christianity`; helpers reuse — no migration.
- **Mobile UX (680×595)**: 5-tab bottom nav stays under 80px (icon `w-4`, label `text-[8px]`).
- **Sample spiritual content**: clearly marked "indicatif" to avoid users mistaking it for verified parish data.

