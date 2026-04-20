
## Phase 29 — Make "Globe" bottom-nav item always return to /explore map

### Problem
The bottom navigation already has a Globe icon pointing to `/explore`, but `/explore` keeps its last active tab (AR, Proche, Lieux, Défis, Rang). If a user left Explore on the "AR" or "Lieux" tab, clicking the Globe icon from another page brings them back to that tab, not the actual 3D map.

The user wants: clicking the Globe icon — from any page, including from `/explore` itself — must always land on the **map** (Globe3D), regardless of the previously active tab.

### Fix
Two tiny, surgical changes:

1. **`src/components/BottomNavigation.tsx`** — Change the Globe item navigation so it always forces the map tab:
   - Replace `navigate('/explore')` for the Globe item with `navigate('/explore?tab=map')` (and use `replace: false` so it works even when already on `/explore`).
   - Keep all other nav items unchanged.

2. **`src/pages/Explore.tsx`** — Read the `tab` search param and sync it into `activeTab`:
   - Add a `useSearchParams` (or `useLocation`) effect: whenever the URL contains `?tab=map` (or any valid tab value), call `setActiveTab(tabFromUrl)`.
   - This ensures clicking Globe from `/explore` itself (where the route doesn't change) still resets the tab to `map`.
   - Default initial state stays `'map'`, so deep-links and fresh loads behave identically.

### Files changed
- `src/components/BottomNavigation.tsx` — 1-line change to the Globe item path.
- `src/pages/Explore.tsx` — add a `useEffect` watching `location.search` to sync `activeTab` from the `tab` query param.

### Verification
- From `/profile`, `/settings`, `/journal`, `/planner`, `/calendar`, `/country/*`, `/place/*`, `/badges`, etc. → click Globe icon → lands on `/explore` showing the 3D map (not AR/Lieux/Défis/Rang).
- Already on `/explore` with "Lieux" tab active → click Globe icon → switches back to the map tab.
- Deep link `/explore` (no query) → still defaults to map.
- Other bottom-nav buttons (Profil, Planifier, Journal, Réglages) unchanged.

### Risk
Minimal. One nav path tweak + one effect. No state, routing, styling, or component logic changes elsewhere.
