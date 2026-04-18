

## Phase 4 — Denomination Choice, Strict Christian Filters & Social Segmentation

Final polish phase. Adds a denomination identity layer, locks the Map filter strictly to Christianisme, and segments Forum/Social around Catholique vs Protestant while keeping a shared public space.

### 1. Splash final fix (`src/pages/Splash.tsx`)
- Sweep any remaining English tagline → enforce: *"Découvrez, vivez et collectionnez le patrimoine sacré chrétien"* + subtitle *"Pour les chrétiens et les curieux de patrimoine"*.
- CTA "Commencer l'exploration" → routes to `/onboarding/denomination` if no denomination saved yet, else `/home`.

### 2. New denomination onboarding screen

**New page `src/pages/OnboardingDenomination.tsx`** route `/onboarding/denomination`:
- Title: *"Quel est votre profil ?"*
- 3 elegant choice cards (icon + label + exact description below — copy is final, do not paraphrase):
  - **Catholique** — *« Tradition, sacrements, pèlerinages et vie paroissiale. »*
  - **Protestant** — *« Bible, foi personnelle, temples et héritage de la Réforme. »*
  - **Curieux du patrimoine chrétien** — *« Architecture, histoire, art et beauté du patrimoine sacré. »*
- Visual: deep blue + golden accents, glowing `ChristianIcon`. Mobile-first single column.
- On select → save to `AppContext` + persist (DB + localStorage fallback).
- Optional "Plus tard" link → defaults to `curieux`.

### 3. Persistence — denomination

**Schema**: add nullable `denomination text` column on `user_progress` (allowed values enforced in app: `catholique` | `protestant` | `curieux`). No CHECK constraint per project rules — validation in the AppContext setter.

**`src/contexts/AppContext.tsx`**:
- Add `denomination: 'catholique' | 'protestant' | 'curieux' | null` to context state.
- Add `setDenomination(d)` that updates state + writes to `user_progress.denomination` with localStorage fallback.
- Load on session bootstrap.

**Routing guard (`src/App.tsx`)**:
- Add `/onboarding/denomination` → `OnboardingDenomination`.
- After Splash/auth: if `denomination === null` → redirect once to `/onboarding/denomination`.

### 4. Strict Christian Map filter

**Explore filters panel**:
- Hide all non-Christian options from the Tradition selector. Only **Christianisme** is rendered (selected and locked).
- Remove non-Christian chips/buttons from any visible filter UI on Explore.
- DB data untouched (UI-only filter, per Phase 1 rule).

### 5. Social segmentation — Forum, Messages, Amis

Existing: `ForumTab.tsx`, `MessagesTab.tsx`, `FriendsTab.tsx`, `SocialTab.tsx`. `forum_topics` already has `religion` + `visibility` columns.

**`ForumTab.tsx` sub-tab strip**:
- **Public** — always visible to everyone (Catholique, Protestant, Curieux). Shows topics with `visibility = 'global'`.
- **Forum Catholique** — *visible ONLY when `denomination === 'catholique'`*. Filters topics where `religion = 'catholique'` AND `visibility = 'public'`.
- **Forum Protestant** — *visible ONLY when `denomination === 'protestant'`*. Filters topics where `religion = 'protestant'` AND `visibility = 'public'`.
- **Curieux** see only **Public** — no denomination tabs rendered.
- New topic created from a denomination tab auto-sets `religion` + `visibility = 'public'`.

**Defense in depth (DB)** — UI hiding is not enough; enforce server-side:
- New SQL function `public.get_user_denomination(_user_id uuid)` returning the `denomination` text (SECURITY DEFINER, search_path = public).
- Additive RLS SELECT policy on `forum_topics`: allow when `religion IN ('catholique','protestant')` AND `religion = get_user_denomination(auth.uid())`. Existing policies remain untouched.
- Result: even if a Curieux user crafts a direct query, they cannot read denomination-restricted topics.

`MessagesTab.tsx` and `FriendsTab.tsx`: open across all denominations (no segmentation).

### 6. Badge & UX small fixes
- QA `getBadgeForPlace` fallback to "DÉBLOQUÉ" still works on `PlaceCard` and `BadgeUnlock`.
- Header sweep: only `ChristianIcon` + `Logo` on user-facing surfaces.
- Mobile QA at 802×745: Splash without scroll; 3 denomination cards stack with breathing room; Forum sub-tab strip ≤ 40px.

### Files touched (~9)

**New (1):** `src/pages/OnboardingDenomination.tsx`

**Edited (~7):** `Splash.tsx`, `App.tsx`, `AppContext.tsx`, `Explore.tsx` (filter lock), `ForumTab.tsx`, `Header.tsx` (icon sweep if needed).

**DB migration (1):** add `denomination` column · create `get_user_denomination()` · additive RLS policy on `forum_topics`.

### Untouched
Stripe · Offline · `client.ts` / `types.ts` · edge function secrets · Messages · Friends · existing forum policies.

### Risks & mitigations
- **Existing users without denomination** → nullable column + one-time guard redirect. No data loss.
- **Forum visibility regression** → new RLS policy is additive (`OR`), existing public/private/global behavior preserved.
- **Skip onboarding** → defaults to `curieux`, ensuring at least Public forum access.
- **Mobile 802×745** → 3 stacked cards (~120px each) + header fits without scroll.

---

## Phase 3 — Polish, Gamification & Content (DONE)

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

