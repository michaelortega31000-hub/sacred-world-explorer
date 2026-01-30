
# Plan: Hybrid Places Display System (Database + Local File)

## ✅ STATUS: IMPLEMENTED

This plan has been successfully implemented on 2026-01-30.

---

## Problem Summary

The 20 monuments added to Paraguay and South America are stored in the Lovable Cloud database, but the application doesn't display them because it only reads from the local `mockPlaces` file and ignores the `places` table entirely.

## Solution Overview

Created a **hybrid system** that merges local data (`mockPlaces`) with database data (`places` table), with:
- Database entries taking priority (newer/verified)
- Deduplication by place ID
- Filter to show only verified places (`verification_status = 'verified'`)
- Automatic image fallback with placeholder when missing

---

## Implementation Completed

### ✅ Step 1: Created `usePlaces` Hook

**New file**: `src/hooks/usePlaces.ts`

This React Query hook:
- Fetches verified places from Supabase (`places` table)
- Merges with `mockPlaces` (deduplication by ID, DB priority)
- Normalizes coordinates from `{lat, lng}` to `[lng, lat]`
- Auto-matches local images when available
- Provides helper hooks: `usePlacesByCountry`, `usePlaceById`, `useAllCountries`, `useInvalidatePlaces`

### ✅ Step 2: Updated Consumer Components

| Component | Change |
|-----------|--------|
| `src/pages/Country.tsx` | Uses `usePlacesByCountry()` and `useAllCountries()` |
| `src/pages/PlaceDetail.tsx` | Uses `usePlaceById()` |
| `src/components/Globe3D.tsx` | Fetches and merges DB places inline |
| `src/components/LocationsStatsTab.tsx` | Uses `usePlaces()` |
| `src/pages/AdminEnrichData.tsx` | Calls `invalidatePlaces()` after saving |

### ✅ Step 3: Cache Invalidation

After successful addition in `AdminEnrichData.tsx`:
```typescript
const invalidatePlaces = useInvalidatePlaces();
// ... after save success ...
invalidatePlaces();
```

---

## Files Modified

| File | Action |
|------|--------|
| `src/hooks/usePlaces.ts` | **Created** - Main merge hook |
| `src/pages/Country.tsx` | **Modified** - Uses hybrid data |
| `src/pages/PlaceDetail.tsx` | **Modified** - Uses hybrid data |
| `src/components/Globe3D.tsx` | **Modified** - Loads merged data |
| `src/components/LocationsStatsTab.tsx` | **Modified** - Uses hybrid data |
| `src/pages/AdminEnrichData.tsx` | **Modified** - Invalidates cache |

---

## Expected Result

After implementation:
- ✅ `/country/Paraguay` displays the 10 added monuments from DB
- ✅ The 3D globe shows markers for all verified places
- ✅ New admin additions appear immediately after saving
- ✅ Missing images show a placeholder
- ✅ Existing local data remains functional (fallback)
