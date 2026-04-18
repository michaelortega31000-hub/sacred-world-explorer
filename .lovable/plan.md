

## Phase 4 — Denomination Choice, Strict Christian Filters & Social Segmentation

Final polish phase. Adds a denomination identity layer, locks the Map filter strictly to Christianisme, and segments Forum around Catholique vs Protestant while keeping a shared public space.

### 1. Splash final fix (`src/pages/Splash.tsx`)
- Sweep any remaining English copy → enforce: *"Découvrez, vivez et collectionnez le patrimoine sacré chrétien"* + subtitle *"Pour les chrétiens et les curieux de patrimoine"*.
- CTA "Commencer l'exploration" → `/onboarding/denomination` if no denomination saved, else `/home`.

### 2. New onboarding screen — `src/pages/OnboardingDenomination.tsx` (route `/onboarding/denomination`)
- Title: *"Quel est votre profil ?"*
- 3 elegant choice cards (icon + label + exact description, copy is final, do not paraphrase):
  - **Catholique** — *« Tradition, sacrements, pèlerinages et vie paroissiale. »*
  - **Protestant** — *« Bible, foi personnelle, temples et héritage de la Réforme. »*
  - **Curieux du patrimoine chrétien** — *« Architecture, histoire, art et beauté du patrimoine sacré. »*
- Visual: deep blue + golden accents, glowing `ChristianIcon`. Mobile-first single column, fits 754×596.
- Optional "Plus tard" link → defaults to `curieux`.
- On select → `setDenomination(d)` (writes to AppContext + DB + localStorage fallback) → navigate `/home`.

### 3. Persistence — denomination

**DB migration**
- Add nullable column `denomination text` on `user_progress`. App-side validation only (`catholique` | `protestant` | `curieux`), no CHECK constraint per project rules.
- New SQL function `public.get_user_denomination(_user_id uuid)` SECURITY DEFINER, search_path = public — mirrors `get_user_religion`.
- Additive RLS SELECT policy on `forum_topics`: allow rows where `religion IN ('catholique','protestant')` AND `religion = get_user_denomination(auth.uid())`. Existing policies untouched (defense in depth — UI hiding alone is not enough).

**`src/contexts/AppContext.tsx`**
- Add `denomination: 'catholique' | 'protestant' | 'curieux' | null` + `setDenomination(d)`.
- Load on session bootstrap; localStorage fallback (per memory `app-state-persistence-logic`).

**Routing guard (`src/App.tsx`)**
- Add `/onboarding/denomination` → `OnboardingDenomination`.
- After auth: if `denomination === null` → redirect once to `/onboarding/denomination`.

### 4. Strict Christian Map filter
- In `Explore.tsx` and any visible Tradition selector, render only **Christianisme** (selected, locked). Hide Islam / Judaïsme / Bouddhisme / Hindouisme / etc. chips.
- DB data untouched (UI-only filter, per Phase 1 rule).

### 5. Social segmentation — Forum

`ForumTab.tsx` sub-tab strip:
- **Public** — always visible. Topics with `visibility = 'global'`.
- **Forum Catholique** — visible **only when** `denomination === 'catholique'`. Filters `religion = 'catholique'` AND `visibility = 'public'`.
- **Forum Protestant** — visible **only when** `denomination === 'protestant'`. Filters `religion = 'protestant'` AND `visibility = 'public'`.
- **Curieux** see only **Public** — no denomination tabs rendered.
- New topic from a denomination tab auto-sets `religion` + `visibility = 'public'`.

`MessagesTab.tsx` and `FriendsTab.tsx`: untouched, open to all.

### 6. Small UX & badge fixes
- `HeroCarousel.tsx`: fix any title/subtitle overlap (add gradient overlay + `line-clamp` if needed) at 754×596.
- QA: `getBadgeForPlace` Christian-themed names render on `PlaceCard` / `BadgeUnlock`, fallback to `"DÉBLOQUÉ"` when no match.
- Header sweep: only `ChristianIcon` + `Logo` on user-facing surfaces.

### Files touched (~9)

**New (1):** `src/pages/OnboardingDenomination.tsx`

**Edited (~7):** `Splash.tsx`, `App.tsx`, `AppContext.tsx`, `Explore.tsx` (filter lock), `ForumTab.tsx`, `HeroCarousel.tsx` (overlap fix), `Header.tsx` (icon sweep if needed).

**DB migration (1):** add `denomination` column · create `get_user_denomination()` · additive RLS SELECT policy on `forum_topics`.

### Untouched
Stripe · Offline · `client.ts` / `types.ts` · edge function secrets · Messages · Friends · existing forum policies.

### Risks & mitigations
- **Existing users without denomination** → nullable column + one-time guard redirect. No data loss.
- **Forum visibility regression** → new RLS policy is additive, existing `public/private/global` behavior preserved.
- **Skip onboarding** → defaults to `curieux`, ensures Public forum access.
- **Mobile 754×596** → 3 stacked cards (~120px each) + header fits without scroll.

