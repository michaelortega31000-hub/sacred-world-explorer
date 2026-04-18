

User shared a comprehensive User Stories v1 document for Phase 1 Pilot France. This is reference/strategy documentation, not a direct implementation request. They've already approved Phases 1-4 which cover most of these epics:

- ✅ Epic 1 (Onboarding) — done in Phase 4
- ✅ Epic 2 (Discovery) — done in Phase 1+2 (Christianity-only filter, spiritual/cultural tabs)
- ✅ Epic 3 (Gamification) — done in Phase 3 (christianBadges.ts + Journal share)
- ⚠️ Epic 4 (Enriched content) — partially done; needs Protestant variant + denomination-aware tabs
- ✅ Epic 5 (Forum segmentation) — done in Phase 4
- ✅ Epic 6 (Map France-first + offline) — done in Phase 3

Two real gaps vs the document:
1. **Profile change in Settings** (Epic 1, story 3) — not yet built
2. **Denomination-aware Place Detail content** (Epic 4) — currently single Catholic-leaning content; Protestant users should see Bible/Reformation framing, Curious see history-first
3. **Seed the 20 pilot places** with associated badges + spiritual/cultural sample content

Best approach: present this as a Phase 5 plan addressing the 3 real gaps. Keep it tight.

## Phase 5 — Close the Phase 1 Pilot France gaps

Building on Phases 1-4. Three surgical additions to fully match the User Stories v1 spec.

### 1. Change denomination from Settings (Epic 1.3)
- `src/pages/Settings.tsx`: add a "Mon profil chrétien" card with the 3 choices (Catholique / Protestant / Curieux), pre-selected to current value, calling `setDenomination()` from `AppContext`. Toast confirmation, no page reload.

### 2. Denomination-aware Place Detail (Epic 4)
`src/components/place/PlaceDimensionsTabs.tsx`:
- Read `denomination` from `useApp()`.
- **Catholique** (current default) — keep mass times, daily prayer, intention form, audio guide.
- **Protestant** — replace mass times with "Cultes & temples", swap daily prayer for a daily Bible verse (small `protestantVerses` array), keep intention form (label "Sujet de prière"), keep audio guide.
- **Curieux** — collapse the Spirituelle tab into a short "Lieu de recueillement" block (no mass times / no intention form), and make the **Culturelle** tab the default active tab.
- Cultural tab: unchanged for all profiles (history wins for Curious by default-tab switch).

### 3. Seed the 20 pilot France places + badges (content)
- **`src/data/christianBadges.ts`**: extend the catalog with the badges from the document mapped to place IDs:
  - `mont-saint-michel` → *Pèlerin du Mont*
  - `notre-dame-paris`, `chartres`, `reims`, `amiens`, `strasbourg`, `rouen`, `toulouse-saint-etienne` → *Cathédrale gothique débloquée*
  - `lourdes` → *Pèlerin de Lourdes*
  - `sacre-coeur` → *Gardien du Sacré-Cœur*
  - `mont-sainte-odile` → *Gardien des reliques d'Alsace*
  - `saint-martin-ainay`, `fontenay`, `senanque`, `cluny` → *Abbaye / Monastère cistercien*
  - `saint-sernin`, `vezelay` → *Pèlerin de Saint-Jacques*
  - `lisieux` → *Petite Thérèse*
  - `bois-chenu` → *Jeanne d'Arc*
  - `nice-saint-nicolas` → *Saint Nicolas*
  - Fallback to "DÉBLOQUÉ" stays in place for any unmapped place.
- **DB seed (insert tool)**: upsert the 20 places into `public.places` with `religion='christianity'`, `place_category='religious_site'`, `country='France'`, proper `type`, `coordinates`, and a short `description`. Verified by admin (`verification_status='verified'`).
- No spiritual/cultural per-place text stored in DB — `PlaceDimensionsTabs` already generates appropriate content from `placeType` + `denomination`. Keeps DB lean.

### Files touched (~3) + 1 data seed

**Edited:**
- `src/pages/Settings.tsx` (denomination switcher card)
- `src/components/place/PlaceDimensionsTabs.tsx` (denomination-aware rendering)
- `src/data/christianBadges.ts` (extend catalog with 20 pilot mappings)

**Data seed (insert tool):** 20 rows into `public.places`.

### Untouched
Schema · RLS · Stripe · Offline · edge functions · existing onboarding flow · Forum segmentation.

### Risks
- **Place ID collisions**: use `ON CONFLICT (id) DO UPDATE` on the seed to be idempotent.
- **Protestant content authenticity**: Bible verses kept short and from public-domain Louis Segond translation; clearly marked "indicatif".
- **Curious default-tab switch**: only flips initial tab; user can still open Spirituelle.

