

## Phase 3 — Polish, Gamification & Content

Building on Phases 1 & 2. Surgical fixes + a real gamification reskin. No routing or schema changes.

### 1. Splash Screen (`src/pages/Splash.tsx`)
- Tagline: *"Découvrez, vivez et collectionnez le patrimoine sacré chrétien"*
- Subtitle: *"Pour les chrétiens et les curieux de patrimoine"*
- Keep glowing logo + "Commencer l'exploration" CTA → `/home`.

### 2. Home Screen Polish (`src/components/home/HeroCarousel.tsx`, `src/pages/Home.tsx`)
- Fix typo "Saint-Saire-de-Michel" → "Mont-Saint-Michel".
- Verify 6 sites: Mont-Saint-Michel, Notre-Dame de Paris, Sanctuaire de Lourdes, Sacré-Cœur, Cathédrale de Chartres, Cité du Vatican.
- Tagline + subtitle visible above the fold.

### 3. Map France-First (`src/components/Globe3D.tsx`)
- Initial center `[2.5, 46.5]`, zoom **5.5**, only when no geolocation has triggered (respect `hasInitiallyZoomed`).

### 4. Gamification reskin — Christian badges

**New `src/data/christianBadges.ts`** — typed catalog. Each badge has:
```ts
{ id, label, description, icon, condition: (place: Place) => boolean }
```
Conditions are **strictly linked to the existing `usePlaces` hook output** (the `Place` shape from `AppContext`):
- *Pèlerin de Lourdes* — `place.id === 'lourdes'`
- *Cathédrale gothique débloquée* — `['notre-dame-paris','chartres','reims','amiens'].includes(place.id)`
- *Marcheur de Saint-Jacques* — `place.tags?.includes('compostelle') || place.id.includes('compostelle')`
- *Gardien des reliques* — `place.type === 'basilica' || place.placeCategory === 'religious_site' && place.tags?.includes('reliques')`
- *Mont sacré* — `place.id === 'mont-saint-michel'`
- *Cœur de Paris* — `place.id === 'sacre-coeur'`
- *Pèlerin du Vatican* — `place.id === 'vatican' || place.country.toLowerCase() === 'vatican'`

Plus aggregate badges (evaluated against the unlocked count, not a single place):
- *Connaisseur du patrimoine sacré* — 10+ places unlocked
- *Chemin de pèlerinage complété* — full pilgrimage route done

Helper exported:
```ts
export function getBadgeForPlace(place: Place): ChristianBadge | null
// iterates catalog, returns first match, or null
```

**Fallback rule (explicit):** if `getBadgeForPlace` returns `null`, the UI falls back to the generic `"DÉBLOQUÉ"` label — no badge data is invented. This rule is enforced in both `PlaceCard.tsx` and `BadgeUnlock.tsx`.

**`src/pages/Journal.tsx` (Ma Collection):**
- Global progress bar (`unlocked / total`).
- Share button (Web Share API → fallback `clipboard.writeText` + toast).

**`src/components/PlaceCard.tsx` / `BadgeUnlock.tsx`:**
- Lookup via `getBadgeForPlace(place)`; render themed name when found, else `"DÉBLOQUÉ"`.

### 5. Content enrichment on Place Detail (`src/components/place/PlaceDimensionsTabs.tsx`)
- **Spirituelle**: add "Audio guide prière" button calling `useAudioGuide` with the daily prayer text.
- **Culturelle**: extend architecture map (Cathédrale, Basilique, Sanctuaire, Abbaye, Église, **Chapelle**, **Monastère**) with 3-4 sentence descriptions.
- Keep "indicatif" disclaimer on mass times.

### 6. Final polish
- `ChristianIcon` + `Logo` only on user-facing surfaces.
- Sweep stale English copy.
- Mobile check at 802×745: tagline + CTA visible without scroll on Splash.

### Files touched (~8)

**New (1):** `src/data/christianBadges.ts`

**Edited (~7):** `Splash.tsx`, `HeroCarousel.tsx`, `Globe3D.tsx`, `Journal.tsx`, `PlaceCard.tsx`, `BadgeUnlock.tsx`, `PlaceDimensionsTabs.tsx`.

### Untouched
Supabase schema · RLS · Stripe · Offline · `client.ts` / `types.ts` · edge function secrets · routing.

### Risks
- **Web Share API** unavailable on desktop → clipboard fallback.
- **Badge condition mismatch** (place IDs differ from assumptions) → fallback to `"DÉBLOQUÉ"` guarantees no broken UI.
- **Audio guide** uses existing `useAudioGuide` (ElevenLabs Laura + Web Speech fallback) — no new secret.

