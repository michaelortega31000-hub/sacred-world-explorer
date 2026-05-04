## Goal

On the Country page (`/country/:countryName`), display religious/sacred places and museums/cultural landmarks in two distinct sections, and add a direct "Marquer ma visite" button on each card to earn points without opening the detail dialog.

This aligns with the project rule: religious sites and museums must always be clearly separated and never mixed by default.

## Current state

- `src/pages/Country.tsx` already lists places per country, grouped only by city, mixing religious sites and museums.
- Each card shows a small icon (Church / Building2) and a "Voir les détails" button. To validate a visit the user must: open the detail dialog → click "Vérifier ma visite" → choose GPS or photo.
- The check-in modal (GPS within 500m or photo) and the reward modal already exist and call `visitPlace(id, points)` from `AppContext`, which awards points and badges.
- `places` already carries `placeCategory: 'religious_site' | 'museum' | 'other'` and a `categoryCounts` memo is already computed.

## Changes

### 1. Two distinct sections on the "Lieux" tab (`src/pages/Country.tsx`)

Replace the single city-grouped list inside `TabsContent value="places"` with a category-first layout:

```text
Country header (name, counts)
├── Section "Lieux sacrés" (Church icon, amber accent)
│     └── Cities (existing city grouping) → cards (religious_site + other)
└── Section "Musées & lieux culturels" (Building2 icon, blue accent)
      └── Cities (existing city grouping) → cards (museum)
```

Implementation notes:
- Build two arrays from `places`: `religiousPlaces` (`placeCategory !== 'museum'`) and `culturalPlaces` (`placeCategory === 'museum'`).
- Reuse the existing `citiesByLetter` logic in a small helper `groupByCity(list)` so each section keeps its alphabetical city grouping and the alphabet navigator still works (computed from the union).
- Each section gets a header band (icon + title + count) and is hidden when its list is empty, with a small empty-state hint when both are empty.
- Keep visual identity: deep background, golden accents for sacred, turquoise/blue for cultural — already available in the existing badges.

### 2. Direct "Marquer ma visite" CTA on each card

In the place card footer (around lines 540–555), replace the single "Voir les détails / Visité" button with two stacked buttons:

- Primary CTA: **"Marquer ma visite"** (golden gradient already used in the modal). Disabled and replaced by "✓ Visité (+N pts)" once `visited` is true.
- Secondary: **"Voir les détails"** (current behavior — opens the dialog).

Click on the primary CTA sets `selectedPlace` and opens `setIsCheckinModalOpen(true)` directly (same flow as `handleCheckIn`). The existing GPS/photo modal handles the rest, calls `visitPlace`, then opens the reward modal — no other plumbing needed.

### 3. Small UX polish

- Show the points value (`+{place.points} pts`) as a small badge on the card so the reward is visible before clicking.
- Keep the tap-on-image / tap-on-title behavior to open the detail dialog (unchanged).
- The detail dialog's "Vérifier ma visite" button stays as a fallback inside the dialog (no removal, no regression).

## Out of scope

- No backend / DB / RLS / edge function changes. `visitPlace` and the existing GPS+photo flow already award points, badges and persist progress through `AppContext` → `user_progress`.
- No change to the assistant, quests, restaurants, or other tabs.
- Cultural-specific quests/badges (mentioned in project knowledge) are a separate, larger initiative — not included here.

## Files touched

- `src/pages/Country.tsx` — split list into two sections, add direct check-in CTA on cards, small points badge.

No new dependencies, no new files.
