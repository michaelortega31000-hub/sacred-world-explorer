

## Phase 22 — Fix real duplicates + missing images (DB merge issue)

### Root cause
Screenshots show duplicates (Notre-Dame d'Amiens ×2) and grey placeholders (Toulouse cathédrale, basilique). After investigation:

- `mockPlaces` (260 entries) is clean — **0 duplicates** when keyed by `name|city|country`.
- The duplicates come from **Supabase DB places** merged in `usePlaces.ts`. `mergePlaces()` only deduplicates by **ID**, so a DB entry named "Cathédrale Notre-Dame d'Amiens" coexists with local `fra-11` of the same name.
- The grey-square cards are **DB entries with `image_url = null`** that are not finding a local match (`tryMatchLocalImage` returns the placeholder).
- Additionally, **26 local entries** in `placesData.ts` point to `/src/assets/places/*.jpg` files that don't exist (e.g. `dubrovnik-cathedral.jpg`, `st-paul-london.jpg`). None affect France but they do affect other countries.

### Plan (2 files, no DB migration needed)

**1. `src/hooks/usePlaces.ts` — composite-key deduplication**
- In `mergePlaces`, build a Set keyed by `${name}|${city}|${country}` (lowercased, accent-stripped, trimmed) instead of (or in addition to) IDs.
- **Local takes priority** over DB when names collide — local entries are curated with proper descriptions/images, DB entries are often raw imports without images.
- Reverse current order: filter DB places to drop those whose composite key matches a local entry, then `[...uniqueDb, ...localPlaces]`.
- Improve `tryMatchLocalImage`: also try variants (with/without "cathedrale-", "basilique-", city suffix) so DB names map to existing assets when possible.

**2. `src/data/placesData.ts` — fix the 26 broken image paths**
- Replace `/src/assets/places/<missing>.jpg` with `/images/place-placeholder.jpg` for entries where the asset file doesn't exist.
- Affected entries (verified by filesystem check): hrv-1/2/3, dnk-2/3, deu-4/5/6, irl-1/2/3/4, ita-15/16/17, srb-1/2, esp-12, che-1/2/3/4, uk-5/6/7/8.
- This way the resilient `<img onError>` fallback (per `image-resilience-logic` memory) renders the elegant placeholder instead of a broken image — and we can later replace with real Wikimedia URLs.

### Out of scope
- DB-side cleanup of duplicate place rows (would require a migration to delete by name match — flag as a follow-up if user wants the DB clean too).
- Authoring real images for the 26 missing local assets (large task; placeholder is acceptable per existing image-resilience pattern).
- UI/filter/transport changes.

### Verification
1. `/country/France` → Amiens shows **only one** "Cathédrale Notre-Dame d'Amiens" card.
2. Toulouse cards (Cathédrale Saint-Étienne, Basilique Saint-Sernin) show their local images, not grey squares.
3. Console no longer spams "Image not found" for the 26 fixed entries.
4. Total count remains 260 (or slightly higher if DB has unique entries not in local).
5. Other countries: no regression on cards that already had working images.

### Risk
- If a DB entry is genuinely a different place but happens to share name+city+country with a local one (unlikely for sacred monuments), it gets dropped. Acceptable trade-off — sacred sites with identical names in the same city are real-world impossible.

