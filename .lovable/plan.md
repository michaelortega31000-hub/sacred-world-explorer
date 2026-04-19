
## Phase 23 — Remove alias duplicates and fix wrong/reused place images

### What the screenshots prove
The remaining problems are real:
- There are still duplicates on country pages, but they are not always exact string duplicates. Some are alias duplicates such as:
  - same monument with different names
  - same monument with different city spellings (`Padoue` vs `Padua`)
- Some cards still show blank placeholders because those places are coming from merged backend data, not just the local dataset.
- Some images are incorrect because the current logic reuses a generic/fuzzy match or a bad manual URL for the wrong monument.

### Root cause in code
From the current code:
- `src/hooks/usePlaces.ts` deduplicates only with a raw `name|city|country` composite key.
- That misses semantic duplicates like:
  - `Cathédrale de Chartres` vs `Cathédrale Notre-Dame de Chartres`
  - identical places with translated city names
- `tryMatchLocalImage()` can attach a “close enough” asset instead of the exact monument.
- `Country.tsx` displays merged places from `usePlacesByCountry()`, so fixing only `placesData.ts` is not enough.

### Implementation plan

**1. Strengthen deduplication in `src/hooks/usePlaces.ts`**
- Add a stricter canonical key builder that normalizes:
  - accents
  - punctuation
  - city aliases (`Padua` → `Padoue`, etc.)
  - monument prefixes/synonyms for known cathedral/basilica naming variants
- Deduplicate DB vs local using this canonical key, with local entries still taking priority.
- Also deduplicate DB entries against each other using the same canonical key.

**2. Add a small alias map for known problem monuments**
- In `usePlaces.ts`, add a targeted alias map for the monuments already visible in screenshots / likely problem set:
  - Chartres cathedral variants
  - Padua/Padoue basilica variants
  - similar known France/Italy duplicates if found in the same pattern
- Keep this explicit and small, not a risky global rewrite.

**3. Stop fuzzy image guessing for problem entries**
- Replace the current “best effort” fuzzy local-image matching with safer logic:
  - prefer exact DB URL if valid
  - else prefer explicit per-place override map
  - else exact local asset match only
  - else placeholder
- This avoids assigning the same wrong image to multiple different monuments.

**4. Add explicit image overrides for currently broken/wrong places**
- In `src/hooks/usePlaces.ts` or `src/data/placesData.ts` add a verified image override map keyed by canonical monument key.
- Priority:
  - France
  - Italy
  - Spain
- Specifically fix the screenshot cases first:
  - Chartres
  - Lisieux
  - Domrémy-la-Pucelle / Basilique du Bois-Chenu
  - Gordes / Sénanque if that is the affected card
  - Loreto
  - Padua/Padoue
- Each override should point to the correct monument image, not a reused generic one.

**5. Keep UI unchanged**
- No layout changes to `LocationsTab.tsx`, country page structure, sorting, counters, A–Z rail, Planner, Globe, or transport modes.
- Only data/merge/image resolution behavior changes.

### Files to update
- `src/hooks/usePlaces.ts` — canonical deduplication, alias handling, safer image resolution, verified image overrides
- `src/data/placesData.ts` — only if a local entry still has a wrong image or an obvious alias duplicate that should be cleaned at source

### Verification
1. `/country/France`
   - only one Chartres card
   - no blank card for Lisieux / Domrémy / Gordes problem entries
2. `/country/Italy`
   - only one Saint-Antoine de Padoue card
   - Loreto and Padua show the correct monument images
3. No obvious reused hero image across unrelated places
4. Existing sorting remains country → city → place
5. No UI regression on country page cards or modal images

### Risk control
- Use a narrow alias/override list instead of aggressive fuzzy deduplication.
- Keep local data as the source of truth when local and backend rows refer to the same monument.
