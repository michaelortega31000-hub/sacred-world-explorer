

## Phase 24 — Bulk image audit + apply overrides everywhere

### Reality check
Screenshots only showed France/Italy, but the user confirms many more places (all countries) still render the placeholder. Phase 23 only fixed ~6 monuments via `IMAGE_OVERRIDES`, and that map is only consulted for DB entries, not local ones. Local mockPlaces entries with broken/missing imageUrl never benefit.

### Plan

**1. Audit step (script-driven, in default mode)**
- Scan `src/data/placesData.ts` for every entry whose `imageUrl` is:
  - missing
  - `/images/place-placeholder.jpg`
  - a `/src/assets/places/*.jpg` path that doesn't exist on disk
- Also scan the live merged set: query Supabase `places` table for rows with `image_url IS NULL`.
- Produce a single consolidated list of (id, name, city, country) needing an image.

**2. Source verified Wikimedia URLs**
- For each entry in the audit list, fetch a verified Wikimedia Commons thumbnail URL.
- Use the existing `fetch-wikipedia-image` edge function pattern, OR direct Wikimedia API calls in a Node script, queried by `"<name> <city>"`.
- Reject results that don't look like the right monument (basic sanity: title contains city or monument keyword).

**3. Write fixes in two places**
- **`src/data/placesData.ts`**: inline-update every local entry's `imageUrl` to the verified URL. This is the source of truth.
- **`src/hooks/usePlaces.ts`** `IMAGE_OVERRIDES` map: extend with canonical keys for every DB-only entry that came back with a valid Wikimedia URL, so DB rows without `image_url` also resolve correctly.

**4. Apply overrides to local entries too (Phase 23 gap)**
- In `usePlaces.ts`, after building the merged list, walk it once: any entry whose `imageUrl` is missing/placeholder gets the `IMAGE_OVERRIDES` lookup applied. This guarantees future local entries with broken paths still get the override.

**5. Local-vs-local dedup (Phase 23 gap)**
- `mergePlaces` currently never dedupes local-vs-local. Add a first pass that dedupes `localPlaces` by canonical key, keeping the entry with a valid `imageUrl` when keys collide.

### Files to update
- `src/data/placesData.ts` — bulk imageUrl fixes
- `src/hooks/usePlaces.ts` — extend overrides, apply to local, dedupe local-vs-local

### Verification
- Open France, Italy, Spain, plus 3 random other countries; confirm zero placeholders.
- Confirm no duplicate cards on country pages.
- Confirm no reused image across unrelated monuments (visual spot-check).

### Risk
- Wikimedia lookup may fail or return wrong image for very obscure entries — those keep the placeholder (no regression vs current state) and get logged for manual review.
- Bulk edit to placesData.ts is large but mechanical (only `imageUrl` field changes).

