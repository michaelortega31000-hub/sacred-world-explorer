
# Plan: Hybrid Places Display System (Database + Local File)

## ✅ IMPLEMENTED

The hybrid system is now active. Components fetch from the database AND local mockPlaces.

### What was done:
1. **Created `src/hooks/usePlaces.ts`** - React Query hook that merges DB + local data
2. **Updated `src/lib/imageHelper.ts`** - Added `resolveImageWithFallback()` for auto image matching
3. **Updated `src/data/placesData.ts`** - Functions now accept optional places array
4. **Updated consumer components:**
   - `Country.tsx` ✅
   - `PlaceDetail.tsx` ✅
   - `TripPlannerTab.tsx` ✅
   - `CountriesByContinent.tsx` ✅
   - `LocationsStatsTab.tsx` ✅
   - `AdminEnrichData.tsx` ✅ (cache invalidation)

### How it works:
- `usePlaces()` fetches verified places from database
- Merges with local `mockPlaces` (DB entries take priority by ID)
- Converts coordinates from `{lat, lng}` to `[lng, lat]`
- Auto-matches local images by name when DB image is missing
- Falls back to placeholder when no image found
- 5-minute cache with React Query

### To add new monuments:
1. Use `/admin/enrich-data` interface
2. Fill in details and set `verification_status = 'verified'`
3. Data appears immediately after save (cache invalidated)

