

## Phase 25 — Add delete button to itinerary cards

### Problem
On `/explore` → "Mon itinéraire" tab, the planned place cards (Cathédrale Sainte-Marie, Uluru, etc.) have no way to be removed. `renderPlaceCard` in `LocationsTab.tsx` is shared with "Tous les lieux" and never renders a remove control. Currently users must open each place's detail page to remove it.

### Fix
Add a small floating X (remove) button on the top-left of each card image. It calls `removeFromTrip(place.id)` and is only shown when the card is rendered inside the "Mon itinéraire" tab (`activeTab === 'planned'`) AND the place is in the trip. Also add a confirmation toast.

### Implementation
**File:** `src/components/LocationsTab.tsx`

1. In `renderPlaceCard` (line ~954), add a floating remove button absolutely positioned at `top-2 left-2` of the image container, visible only when `activeTab === 'planned' && inTrip`.
2. Button styling: small circular destructive variant with the existing `X` icon (already imported), `e.stopPropagation()` on click to prevent navigating into the place detail.
3. On click: call `removeFromTrip(place.id)` (already destructured at line 149) and show a toast: "Lieu retiré de votre itinéraire".
4. Add a "Vider l'itinéraire" (Clear all) button at the top of the planned tab list (next to the "X lieu(x) dans votre itinéraire" counter at line 1174) that calls `clearTrip()` with a confirm dialog.

### Visual
- Remove button: 28×28 px circular, semi-transparent destructive red bg with white X, clear hover state.
- Position: top-left of the card image (the "Visité" badge is on top-right, no conflict).
- Only appears in "Mon itinéraire" tab — keeps "Tous les lieux" UI unchanged.

### Verification
- Open `/explore` → "Mon itinéraire", confirm an X button appears on each card.
- Click X: card disappears, toast confirms removal, place removed from `tripPlaces`.
- Click "Vider l'itinéraire": after confirm, all planned places removed.
- Confirm "Tous les lieux" tab cards are unchanged (no X button).

### Risk
- Minimal: only adds conditional UI inside an existing render function. No data model change, no other screens affected.

