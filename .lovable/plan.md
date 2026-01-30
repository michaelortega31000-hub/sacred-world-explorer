
# Plan: Hybrid Places Display System (Database + Local File)

## Problem Summary

The 20 monuments added to Paraguay and South America are stored in the Lovable Cloud database, but the application doesn't display them because it only reads from the local `mockPlaces` file and ignores the `places` table entirely.

## Solution Overview

Create a **hybrid system** that merges local data (`mockPlaces`) with database data (`places` table), with:
- Database entries taking priority (newer/verified)
- Deduplication by place ID
- Filter to show only verified places (`verification_status = 'verified'`)
- Automatic image fallback with placeholder when missing

---

## Implementation Steps

### Step 1: Create `usePlaces` Hook

**New file**: `src/hooks/usePlaces.ts`

This React Query hook will:
- Fetch verified places from Supabase (`places` table)
- Merge with `mockPlaces` (deduplication by ID, DB priority)
- Normalize coordinates from `{lat, lng}` to `[lng, lat]`
- Auto-match local images when available

```text
┌─────────────────┐     ┌──────────────────┐
│  Supabase DB    │     │  Local File      │
│  (places table) │     │  (mockPlaces)    │
└────────┬────────┘     └────────┬─────────┘
         │                       │
         └───────────┬───────────┘
                     ▼
            ┌────────────────┐
            │   usePlaces()  │
            │   - merge      │
            │   - dedup ID   │
            │   - normalize  │
            └────────┬───────┘
                     ▼
              Unified Data
```

### Step 2: Update Image Helper

**Modify**: `src/lib/imageHelper.ts`

Add `resolveImageWithFallback()` function:
- If `image_url` exists and is valid → use it
- Otherwise, try to match a local image by normalized name
- Last resort → `/placeholder.svg`

### Step 3: Update Data Functions

**Modify**: `src/data/placesData.ts`

- Add helper functions for merging and normalizing places
- Update `getPlacesByCountry()` to accept merged data parameter
- Add `getAllCountriesFromPlaces()` to extract countries from any list

### Step 4: Update Consumer Components

| Component | Change |
|-----------|--------|
| `Globe3D.tsx` | Use `usePlaces()` instead of importing `mockPlaces` directly |
| `Country.tsx` | Call `usePlaces()` + filter by country |
| `PlaceDetail.tsx` | Use `usePlaces()` to find place by ID |
| `TripPlannerTab.tsx` | Use merged data |
| `CountriesByContinent.tsx` | Use merged data for stats |
| `LocationsStatsTab.tsx` | Use merged data |

### Step 5: Cache Invalidation

**Modify**: `src/pages/AdminEnrichData.tsx`

After successful addition, invalidate the cache:
```typescript
queryClient.invalidateQueries({ queryKey: ['places-merged'] });
```

---

## Files Summary

| File | Action |
|------|--------|
| `src/hooks/usePlaces.ts` | **Create** - Main merge hook |
| `src/lib/imageHelper.ts` | **Modify** - Add auto fallback |
| `src/data/placesData.ts` | **Modify** - Export merge helpers |
| `src/components/Globe3D.tsx` | **Modify** - Use `usePlaces()` |
| `src/pages/Country.tsx` | **Modify** - Use merged data |
| `src/pages/PlaceDetail.tsx` | **Modify** - Use merged data |
| `src/components/TripPlannerTab.tsx` | **Modify** - Use merged data |
| `src/components/CountriesByContinent.tsx` | **Modify** - Use merged data |
| `src/components/LocationsStatsTab.tsx` | **Modify** - Use merged data |
| `src/pages/AdminEnrichData.tsx` | **Modify** - Invalidate cache |

---

## Expected Result

After implementation:
- `/country/Paraguay` will display the 10 added monuments
- The 3D globe will show markers for all verified places
- New admin additions will appear immediately after saving
- Missing images will show a clean placeholder
- Existing local data remains functional (fallback)
