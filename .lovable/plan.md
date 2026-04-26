
## Phase 30 — Make Globe icon always reset to /explore map from any page

### Problem
The previous fix made the Globe bottom-nav button navigate to `/explore?tab=map`. But on any page **other than `/explore`**, clicking Globe still doesn't force the map view reliably if the user was previously on a non-map tab — and more importantly, the user wants a guarantee: **from every single page**, clicking Globe lands on the 3D map.

Today the active-state highlight in `BottomNavigation.tsx` strips the query string (`path.split('?')[0]`), so the path comparison works, but the navigation itself uses `navigate('/explore?tab=map')` which React Router treats as a no-op if the user is already on `/explore` with a different `?tab=` value in some edge cases (and doesn't re-trigger the effect cleanly).

### Fix
One surgical change in `src/components/BottomNavigation.tsx`:

- For the Globe item only, replace the generic `navigate(item.path)` call with a dedicated handler that:
  1. Always calls `navigate('/explore?tab=map', { replace: false })`.
  2. If already on `/explore`, also force the URL/state refresh by passing a timestamped key or calling `navigate` with a state object (e.g. `{ state: { resetToMap: Date.now() } }`) so the `useEffect` watching `location` in `Explore.tsx` always re-fires.

And a complementary tweak in `src/pages/Explore.tsx`:

- Change the sync `useEffect` dependency from `[location.search]` to `[location.key]` (or `[location]`) so that even an identical URL re-trigger from the Globe button forces `setActiveTab('map')`.

### Files changed
- `src/components/BottomNavigation.tsx` — dedicated onClick for the Globe item.
- `src/pages/Explore.tsx` — broaden the effect dependency so re-clicks always reset the tab.

### Verification
- From `/profile`, `/settings`, `/journal`, `/planner`, `/calendar`, `/country/*`, `/place/*`, `/badges`, `/avatars`, `/reminders`, `/admin/*`, `/u/*`, `/user/*`, `/offline` → click Globe → lands on `/explore` showing the 3D map.
- Already on `/explore` with "Lieux"/"Défis"/"Rang"/"AR"/"Proche" tab active → click Globe → instantly switches back to the map tab.
- Repeated clicks on Globe while on `/explore` → always re-asserts the map tab.
- Other bottom-nav buttons (Profil, Planifier, Journal, Réglages) unchanged.

### Risk
Minimal. Two tiny edits, no routing/state/styling logic changes elsewhere.
