

## Phase 21 — Data cleanup of sacred places

### Scope
Single data source: `src/data/placesData.ts` (mockPlaces) + the hardcoded counter label in `LocationsTab.tsx`. No UI/filter/transport changes.

### Investigation needed before plan execution
I need to read the current state of `placesData.ts` to know exact volume, religion distribution, and which entries lack `description` / `imageUrl`. Same for any DB-side seeded places (`usePlaces` merges DB + local).

### Plan

**1. Deduplicate**
- Build a Set keyed by `${name}|${city}|${country}` (lowercased, accent-stripped, trimmed).
- Keep first occurrence; drop subsequent exact duplicates.
- Log removed count in a comment header.

**2. Curate scope (keep balanced heritage)**
- Keep **all** Christian entries (cathedral, basilica, sanctuary, abbey, monastery, church, chapel, pilgrimage path) — detected via `type` + name keywords.
- Keep a **curated whitelist** of iconic non-Christian world-heritage sites (UNESCO-grade): Machu Picchu, Chichén Itzá, Teotihuacán, Borobudur, Angkor Wat, Shwedagon, Potala, Jokhang, Kiyomizu-dera, Fushimi Inari, Todai-ji, Meenakshi, Akshardham, Varanasi ghats, Pashupatinath, Kaaba/Masjid al-Haram, Prophet's Mosque, Dome of the Rock, Hagia Sophia, Blue Mosque, Sheikh Zayed, Western Wall, Karnak, Pyramids of Giza, Stonehenge, Delphi, Parthenon, Pantheon, Mount Fuji, Uluru, etc. (~40-60 curated).
- Drop generic/low-tier non-Christian entries that don't meet the iconic bar.

**3. Fill missing data**
- Pass over kept entries: any with empty/short `description` (<100 chars) → write a 2–3 sentence French description (historical + spiritual + cultural angle).
- Any with missing/placeholder `imageUrl` → assign a Wikimedia Commons URL (referrer-safe, already supported via `image-resilience-logic` memory). Fallback to `/images/place-placeholder.jpg` if no source.

**4. Sort**
- Final array sorted: `country` → `city` → `name` (French locale, base sensitivity). Matches Phase 20 runtime sort so source order is consistent.

**5. Update counter**
- In `LocationsTab.tsx` find the `336 lieux` literal (or whichever fixed number is displayed) and replace with the live `allPlaces.length` (already a hook value). If a hardcoded label exists, swap to dynamic interpolation: `{allPlaces.length} lieux`.

### Files
- `src/data/placesData.ts` — rewrite the `mockPlaces` array (deduped, curated, enriched, sorted).
- `src/components/LocationsTab.tsx` — counter only (one literal swap).

### Out of scope
- UI layout, filters, A–Z rail, transport modes, Planner, Globe, PlaceDetail.
- DB-side seed cleanup (would need a migration; flag for a follow-up phase if needed).

### Verification
1. Open `/explore` → "Lieux Sacrés du Monde" → counter reflects new total (not 336).
2. Scroll list: no two cards with identical name+city+country.
3. Sample 10 random cards → each has French description + valid image (no broken placeholder).
4. Filter by Christianity → all Christian sites still present.
5. Filter by non-Christian traditions → only curated iconic sites appear.
6. Sort order: countries A→Z, cities A→Z within country, names A→Z within city.

### Risks / notes
- Volume change: count will drop noticeably (likely 200–260 from 336). Confirm this is acceptable — the "curieux" audience keeps iconic non-Christian heritage, but generic entries are removed.
- French descriptions for ~50–100 entries authored inline; tone neutral & educational per project knowledge.
- Image URLs sourced from Wikimedia Commons (stable, referrer-safe).

