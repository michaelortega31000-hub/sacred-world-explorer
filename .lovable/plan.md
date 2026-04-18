

User wants to add a country-of-origin selection step (alongside the denomination choice) so the country rankings tab can correctly attribute users to their home country.

Let me check the current onboarding + ranking flow.
<lov-tool-use id="toolu_vrtx_017RRsfor1bm6h8NX4YkE7JH" name="code--view" integration-id="code" data="{\"file_path\": \"src/pages/OnboardingDenomination.tsx\", \"lines\": \"1-50\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01HKpJHDoxKvEM2XEcNe6rpM" name="code--view" integration-id="code" data="{\"file_path\": \"src/components/CountryRankingTab.tsx\", \"lines\": \"1-80\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01LpGjwFb3W9XV6MfutrzY4b" name="code--search_files" integration-id="code" data="{\"query\": \"country_of_origin|home_country|user_country\", \"include_patterns\": \"*.ts,*.tsx,*.sql\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01T9JMu75N9fTD1E8caCLPj4" name="code--view" integration-id="code" data="{\"file_path\": \"src/pages/OnboardingDenomination.tsx\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01Ssb1nzRAPPES3JgynfLDq5" name="code--search_files" integration-id="code" data="{\"query\": \"CountryRankingTab|country_of_origin|home_country|userCountry\", \"include_patterns\": \"*.ts,*.tsx,*.sql\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_014mNtWwBA8Lqcaa1RVSD4aK" name="code--view" integration-id="code" data="{\"file_path\": \"src/components/CountryRankingTab.tsx\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01NSDoq5Rqd55L61XVhrQm6t" name="code--view" integration-id="code" data="{\"file_path\": \"src/contexts/AppContext.tsx\", \"lines\": \"1-80\"}">
</lov-tool-use>
I have enough context. The country ranking is currently hardcoded mock data — but adding a `country_of_origin` field is still a clean, useful step that lays the foundation. Let me also check the Settings page for adding the option there.

<lov-plan>

## Phase 7 — Country of origin (for country leaderboard)

Add a "country of origin" selection to the user profile, so the country ranking can eventually be calculated from real users. Simple, additive, follows the same pattern as denomination.

### 1. DB migration
- Add nullable column `country_of_origin text` on `user_progress` (ISO-2 code, e.g. `FR`, `IT`, `ES`).
- No CHECK constraint (per project rules — app-side validation only).
- No new RLS needed; existing `user_progress` policies already cover it.

### 2. AppContext
`src/contexts/AppContext.tsx`:
- Add `countryOfOrigin: string | null` to `UserProgress`.
- Add `setCountryOfOrigin(code: string)` writing to Supabase + localStorage fallback (same pattern as `setDenomination`).

### 3. Onboarding — extend `OnboardingDenomination.tsx`
Convert into a 2-step flow (mobile-first, no extra route):
- **Step 1**: existing denomination choice (unchanged copy).
- **Step 2 (new)**: "D'où venez-vous ?" — searchable country dropdown (`Command` component, ~30 entries focused on EU + main pilgrimage countries, France pre-selected as Phase 1 pilot).
  - "Plus tard" → defaults to `FR` (Phase 1 France pilot).
  - Save `countryOfOrigin` then `navigate('/home')`.
- Skip in step 1 → still goes to step 2 (so we always capture country).
- Routing guard in `App.tsx` already redirects when `denomination === null`; no changes needed there since both fields are set in the same flow.

### 4. Settings — `src/pages/Settings.tsx`
Add a small "Pays d'origine" card under the existing "Mon profil chrétien" card, with the same searchable country selector. Toast confirmation on change.

### 5. Country leaderboard — `src/components/CountryRankingTab.tsx`
Currently 100% mock data. Minimal real-data wiring:
- Aggregate `total_points` from `public_user_stats` grouped by `country_of_origin` (countries with at least 1 user).
- Highlight the current user's country with a ring + "Votre pays" badge.
- If <2 countries have users yet (Phase 1 pilot reality), show the real list at the top + a small note *"Classement en construction — invitez vos amis !"* and keep the existing mock data below labeled *"Aperçu"*.

### Files touched (~5)

**Edited:**
- `src/contexts/AppContext.tsx` (add field + setter)
- `src/pages/OnboardingDenomination.tsx` (add step 2)
- `src/pages/Settings.tsx` (add country card)
- `src/components/CountryRankingTab.tsx` (real aggregation + highlight)

**DB migration (1):** add `country_of_origin` column to `user_progress`.

### Untouched
RLS · existing denomination flow · Forum segmentation · Stripe · Logo · `/planner` · all other pages.

### Risks
- **`public_user_stats` view may not expose `country_of_origin`** → if the view is restrictive, add a small SQL function `get_country_leaderboard()` SECURITY DEFINER returning aggregated rows only (no PII). Will check at implementation.
- **Onboarding length** → 2 quick steps, single column, fits 802×745 viewport.
- **Existing users without country** → nullable column + Settings entry; no forced migration. Country tab gracefully ignores them.

