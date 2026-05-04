# Admin moderation: community new-place submissions

## Goal

Give admins a dedicated page to review the community contributions submitted via `AddSacredPlaceDialog` — the rows in `place_photos` where `is_new_place = true`. They can **approve**, **reject**, or **flag** each one, with the photo, metadata, and contributor visible.

## What the admin sees

New page at `/admin/community-submissions`, linked from the existing `/admin` hub (next to "Enrichir les données" and "Auditer les images") with a `ShieldCheck` icon and a small badge showing the pending count.

```text
┌─ Soumissions communautaires ────────────────────────┐
│  [Pending 12] [Flagged 2] [Approved] [Rejected]     │
│                                                      │
│  ┌──────────┐  Église Saint-Pierre de Conques       │
│  │  PHOTO   │  France · Conques · Christianisme     │
│  │          │  by @marie · il y a 2 h                │
│  └──────────┘  📍 44.6018, 2.4001                    │
│                "Petite chapelle romane du XIIᵉ…"     │
│                                                      │
│  [✓ Approuver]  [✗ Rejeter]  [⚑ Flagger]  [Voir]   │
└──────────────────────────────────────────────────────┘
```

- Tabs filter by `status` (`pending` default, then `flagged`, `approved`, `rejected`).
- Each card shows: signed photo URL, name, country/city, tradition, lat/lng, caption, contributor username, submission date.
- "Voir" opens the photo full-size in a lightbox.
- Approving a pending row also creates the matching `places` entry so it appears on the globe (with the "Communauté" badge per the existing plan). Rejecting requires a short reason. Flagging marks for second review without publishing.
- Bulk actions: select multiple cards → approve / reject in one click.

## Technical plan

### 1. Database migration (one file)

The current `place_photos.status` already accepts `pending|approved|rejected|flagged`, but there is **no UPDATE policy** so admins cannot moderate today. Add it, plus a moderation-reason column and an admin-side read policy:

```sql
ALTER TABLE public.place_photos
  ADD COLUMN IF NOT EXISTS moderation_reason TEXT;

-- Admins can read every submission (not just approved/own)
CREATE POLICY "place_photos_admin_read_all"
ON public.place_photos FOR SELECT
TO authenticated
USING (is_admin());

-- Admins can update status / moderation_reason / reviewed_*
CREATE POLICY "place_photos_admin_update"
ON public.place_photos FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE INDEX IF NOT EXISTS idx_place_photos_status_new
  ON public.place_photos(status) WHERE is_new_place = true;
```

When approving a `is_new_place=true` row, the **client** (admin only, RLS-checked) inserts the corresponding `places` row (admins already have full write on `places`). We do this in the React layer rather than a trigger to keep the place id explicit and editable in one place.

### 2. Backend helpers — extend `src/lib/placePhotos.ts`

Add three admin-only functions:
- `fetchSubmissions({ status, isNewPlace })` — paginated list with signed URLs and contributor username (joined via `public_profiles_store`).
- `moderateSubmission(photoId, action, reason?)` — sets `status`, `reviewed_by`, `reviewed_at`, optional `moderation_reason`. For `approve` on a new-place row, also inserts into `places` with `data_source='community'`, `verification_status='community_verified'`, `cross_visible=true`, mapping `tradition → religion`.
- `bulkModerate(ids[], action, reason?)` — loops through the above with a small concurrency guard.

All inputs validated with `zod` (UUID arrays, action enum, reason ≤ 300 chars). Logging via `@/lib/logger`.

### 3. New page `src/pages/AdminCommunitySubmissions.tsx`

- Guarded by `useIsAdmin()` (redirect to `/welcome`, identical to `Admin.tsx`).
- `Tabs` from shadcn, `Card`-based grid (responsive 1 col mobile / 2 cols ≥ md).
- React Query keys: `['community-submissions', status]`, refetch on action.
- Reject / flag open a small `Dialog` to capture the reason.
- Toast on success/failure; optimistic UI for snappier feel.

### 4. Wiring

- `src/App.tsx` — register the lazy route `/admin/community-submissions` behind `<Gate>`.
- `src/pages/Admin.tsx` — add a new section card "Modération communautaire" with link + pending count badge (small `useQuery` for `count`).

### 5. Out of scope (deliberately)

- No automated AI moderation — manual approval only, per existing memory.
- No edits to the AR module, bottom-nav layout, or category filters.
- No changes to the public `CommunityPlacesFeed` — it already filters by `status='approved'`, so approvals naturally surface there.

## Files touched

| File | Change |
|---|---|
| `supabase/migrations/<new>.sql` | Adds admin RLS policies, `moderation_reason`, partial index |
| `src/lib/placePhotos.ts` | `fetchSubmissions`, `moderateSubmission`, `bulkModerate` |
| `src/pages/AdminCommunitySubmissions.tsx` *(new)* | The moderation page |
| `src/App.tsx` | Lazy route registration |
| `src/pages/Admin.tsx` | Hub link + pending count badge |

## Open question

When an admin **approves** a brand-new submission, should the resulting place be:
- **A.** Immediately visible on the globe and to all users (current proposal).
- **B.** Approved-but-hidden until a second admin confirms (two-step moderation).

I'll go with **A** unless you prefer B.
