# Community Photo Contributions — Small & Local Sacred Places

## The vision

Today, `ContributePhotoButton` lets a user add a photo only to a place that is **already in the database** (it sits on a `PlaceSymbol` card). Your idea expands this beautifully: a villager with a 12th-century chapel that no app knows about should also be able to share it — and the whole world should be able to see it.

We will turn this into a real community feature with two complementary flows:

1. **Enrich an existing place** — what already works today, kept as is.
2. **Add a brand-new sacred place** — a user submits a photo + name + location, and once approved it joins the map and the global feed.

A new **"Communauté Sacrée"** feed will showcase every approved contribution worldwide, so users feel they are building a shared atlas together.

## What the user will see

### 1. New page: `/community/places` (accessible from the bottom nav "Journal" tab as a sub-tab, and from the Settings/Profile)

A scrollable feed showing the latest approved community photos worldwide:
- Photo, place name, country, contributor's username + avatar
- Small "religion" tag (church, mosque, temple, shrine…)
- "Voir sur la carte" button → opens the place on the globe
- Reactions (♡ / ✨ / 🙏) reusing the same pattern as `CommunityPost.tsx`

### 2. New CTA: "Ajouter un lieu sacré"

A prominent floating button (bottom-right of the new feed and of the country page) opens a dialog:

```text
┌─ Partager un lieu sacré ────────────┐
│  📷  [Add photo — camera or library] │
│                                      │
│  Nom du lieu *                       │
│  [Église Saint-Pierre de…         ]  │
│                                      │
│  Tradition *                         │
│  [Christianisme ▾]                   │
│                                      │
│  Pays / Ville *                      │
│  [France / Conques              ]    │
│                                      │
│  📍 Utiliser ma position (optionnel) │
│                                      │
│  Quelques mots (optionnel)           │
│  [Petite chapelle romane du…    ]    │
│                                      │
│            [Annuler]  [Envoyer]      │
└──────────────────────────────────────┘
```

After submission: toast "Merci ! Votre contribution attend la modération." — same respectful tone as the existing flow.

### 3. Existing button stays

`ContributePhotoButton` on `PlaceSymbol` keeps working unchanged for known places.

## Technical plan

### Database (one migration)

Extend the existing `place_photos` table — do **not** create a parallel one — by allowing rows that reference a brand-new place:

```sql
ALTER TABLE public.place_photos
  ADD COLUMN IF NOT EXISTS is_new_place    BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS country         TEXT,
  ADD COLUMN IF NOT EXISTS city            TEXT,
  ADD COLUMN IF NOT EXISTS tradition       TEXT,    -- 'christianity', 'islam', …
  ADD COLUMN IF NOT EXISTS latitude        DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude       DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS reaction_sparkle INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS reaction_heart   INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS reaction_hands   INT NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_place_photos_country  ON public.place_photos(country);
CREATE INDEX IF NOT EXISTS idx_place_photos_new      ON public.place_photos(is_new_place);
```

Existing RLS policies already cover the read-approved / write-own model — no changes needed there.

A small reactions table (one row per user × photo) prevents inflated counts:

```sql
CREATE TABLE public.place_photo_reactions (
  photo_id UUID REFERENCES public.place_photos(id) ON DELETE CASCADE,
  user_id  UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  kind     TEXT CHECK (kind IN ('sparkle','heart','hands')),
  PRIMARY KEY (photo_id, user_id, kind)
);
ALTER TABLE public.place_photo_reactions ENABLE ROW LEVEL SECURITY;
-- read all, write own (standard pattern)
```

### Frontend changes

| File | Change |
|---|---|
| `src/lib/placePhotos.ts` | Add `submitNewSacredPlace({ name, country, city, tradition, lat, lng, file, caption })` and `fetchCommunityPhotos({ limit, country? })`. Reuse the existing upload helper. |
| `src/components/community/AddSacredPlaceDialog.tsx` *(new)* | The submission dialog above. Uses `zod` validation + `secureUpload` for the photo. |
| `src/components/community/CommunityPlacesFeed.tsx` *(new)* | The global feed. Reuses card layout from `CommunityPost.tsx`. |
| `src/components/community/CommunityPhotoCard.tsx` *(new)* | One photo card with reactions wired to `place_photo_reactions`. |
| `src/pages/CommunityPlaces.tsx` *(new)* | Page wrapper, route `/community/places`. |
| `src/App.tsx` | Register the new route. |
| `src/components/SocialTab.tsx` | Add a 6th sub-tab "Lieux" (icon: `Church` from lucide) that mounts `CommunityPlacesFeed` — keeps everything inside the existing social hub instead of bloating the bottom nav. |
| `src/pages/Country.tsx` | Add the floating "Ajouter un lieu sacré" CTA so the contribution flow lives where users are exploring a country. |
| `src/hooks/useApprovedPlacePhotos.ts` | Already exists — no change. New hook `useCommunityPhotos` follows the same pattern. |

### Moderation

Reuse the existing admin flow — `place_photos` with `status='pending'` already shows up in `AdminEnrichData.tsx` / admin tools. We just need to add a small section in the admin page that lists `is_new_place=true` rows separately, since approving them creates a new pinnable place rather than enriching one.

### Safety & constraints (per project memory)

- Photos go through `secureUpload` (server-side size + MIME validation) — same path used by forum photos.
- All inputs validated with `zod` (name 3–120 chars, country required, optional caption ≤ 400 chars).
- Sanitized coordinates `[lng, lat]` only stored if both pass the existing rule (lat ∈ [-90,90], lng ∈ [-180,180]).
- No XSS surface: card rendering uses React text nodes, no `dangerouslySetInnerHTML`.
- Logger via `@/lib/logger`, never `console.*`.

## What we explicitly will NOT do (yet)

- No automatic AI moderation — manual approval first, like today.
- No edits/deletes by other users — only the contributor + admin.
- No new bottom-nav tab — we keep the 4-tab layout your memory enforces.
- Keep the AR mode, "Autres" continent, gas-station filters all disabled (per memory).

## Open question before I build

One small decision: **how should newly-approved community places appear on the globe?**
- **A.** As regular markers, identical to curated places.
- **B.** As distinct markers (e.g. softer golden glow + "Communauté" badge in the popup) so users see they were contributed by people.

I'd recommend **B** — it celebrates the contributor and sets honest expectations about data verification. I'll go with B unless you tell me otherwise after approving the plan.
