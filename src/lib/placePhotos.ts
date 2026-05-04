// User-contributed place photos.
//
// Flow:
//   1. User clicks "Contribuer une photo" on a PlaceSymbol card
//   2. They pick a photo from camera/library
//   3. We upload it to Supabase storage at:
//        place-photos/{userId}/{placeId}-{timestamp}.jpg
//   4. Insert a row in public.place_photos with status='pending'
//   5. After approval (admin/moderation), the photo shows up app-wide
//      via getApprovedPhotoForPlace() — slotted into the photo tier
//      resolver as the highest-priority source for that place.
//
// Failure modes are silent: if Supabase isn't configured / table doesn't
// exist yet (e.g. before the migration is applied), the upload throws
// and the caller surfaces a toast. The read path returns null.

import { supabase } from '@/integrations/supabase/client';

const BUCKET = 'place-photos';

export interface PlacePhotoUpload {
  placeId: string;
  placeName: string;
  file: File;
  caption?: string;
}

export interface PlacePhotoRow {
  id: string;
  place_id: string;
  storage_path: string;
  caption: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  created_at: string;
}

/**
 * Upload a photo for a place. Caller must be authenticated.
 * Returns the storage path on success, throws on failure.
 */
export async function uploadPlacePhoto(
  upload: PlacePhotoUpload,
): Promise<{ id: string; storagePath: string }> {
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) {
    throw new Error('Vous devez être connecté pour contribuer une photo.');
  }

  // Storage key — userId folder enforces RLS and prevents collisions
  const ext = upload.file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const safePlaceId = upload.placeId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const storagePath = `${user.id}/${safePlaceId}-${Date.now()}.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, upload.file, {
      cacheControl: '3600',
      upsert: false,
      contentType: upload.file.type,
    });

  if (uploadErr) {
    throw new Error(`Upload échoué: ${uploadErr.message}`);
  }

  // Metadata row
  const { data: row, error: insertErr } = await supabase
    .from('place_photos' as never)
    .insert({
      place_id: upload.placeId,
      place_name: upload.placeName,
      user_id: user.id,
      storage_path: storagePath,
      caption: upload.caption ?? null,
    } as never)
    .select('id')
    .single();

  if (insertErr || !row) {
    // Roll back the storage upload — orphaned files waste quota.
    await supabase.storage.from(BUCKET).remove([storagePath]);
    throw new Error(`Enregistrement échoué: ${insertErr?.message ?? 'inconnu'}`);
  }

  return { id: (row as { id: string }).id, storagePath };
}

/**
 * Fetch the approved user-contributed photo URL for a place, if any.
 * Returns the most recently approved one. Falls back gracefully if the
 * table doesn't exist yet (returns null).
 */
export async function getApprovedPhotoForPlace(
  placeId: string,
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('place_photos' as never)
      .select('storage_path')
      .eq('place_id', placeId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;

    const path = (data as { storage_path: string }).storage_path;
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return pub.publicUrl ?? null;
  } catch {
    // Table missing, RLS blocked, etc. — treat as "no contribution".
    return null;
  }
}

/**
 * Bulk-fetch approved photos for many places at once. Returns a Map<placeId, url>
 * for places that have one. Used by usePlacesByCountry to enrich the merged set.
 *
 * NOTE: this is one round-trip regardless of how many places — Supabase's
 * `in()` supports up to ~1000 IDs which is plenty for our LIMIT 200 + locals.
 */
export async function fetchApprovedPhotosForPlaces(
  placeIds: string[],
): Promise<Map<string, string>> {
  if (placeIds.length === 0) return new Map();
  try {
    const { data, error } = await supabase
      .from('place_photos' as never)
      .select('place_id, storage_path, created_at')
      .in('place_id', placeIds)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error || !data) return new Map();

    // Keep the FIRST hit per placeId (which is the newest because of order DESC)
    const out = new Map<string, string>();
    for (const row of data as Array<{ place_id: string; storage_path: string }>) {
      if (out.has(row.place_id)) continue;
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(row.storage_path);
      if (pub.publicUrl) out.set(row.place_id, pub.publicUrl);
    }
    return out;
  } catch {
    return new Map();
  }
}

// ════════════════════════════════════════════════════════════════════════════
// COMMUNITY: brand-new sacred place submissions + global feed
// ════════════════════════════════════════════════════════════════════════════

export interface NewSacredPlaceSubmission {
  name: string;
  country: string;
  city?: string;
  tradition: string; // 'christianity' | 'islam' | 'hinduism' | 'buddhism' | 'judaism' | 'other'
  caption?: string;
  latitude?: number;
  longitude?: number;
  file: File;
}

/**
 * Submit a brand-new sacred place. Creates a place_photos row with
 * is_new_place=true that admins can approve later.
 */
export async function submitNewSacredPlace(
  s: NewSacredPlaceSubmission,
): Promise<{ id: string; storagePath: string }> {
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) {
    throw new Error('Vous devez être connecté pour partager un lieu.');
  }

  // synthetic id for community-submitted places (becomes the place_id once approved)
  const syntheticId = `community-${user.id.slice(0, 8)}-${Date.now()}`;
  const ext = s.file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const storagePath = `${user.id}/${syntheticId}.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, s.file, {
      cacheControl: '3600',
      upsert: false,
      contentType: s.file.type,
    });
  if (uploadErr) throw new Error(`Upload échoué: ${uploadErr.message}`);

  // Sanitize coordinates per project memory: only [lng, lat] in valid ranges
  let lat: number | null = null;
  let lng: number | null = null;
  if (
    typeof s.latitude === 'number' && typeof s.longitude === 'number' &&
    s.latitude >= -90 && s.latitude <= 90 &&
    s.longitude >= -180 && s.longitude <= 180
  ) {
    lat = s.latitude;
    lng = s.longitude;
  }

  const { data: row, error: insertErr } = await supabase
    .from('place_photos' as never)
    .insert({
      place_id: syntheticId,
      place_name: s.name.trim(),
      user_id: user.id,
      storage_path: storagePath,
      caption: s.caption?.trim() || null,
      is_new_place: true,
      country: s.country.trim(),
      city: s.city?.trim() || null,
      tradition: s.tradition,
      latitude: lat,
      longitude: lng,
    } as never)
    .select('id')
    .single();

  if (insertErr || !row) {
    await supabase.storage.from(BUCKET).remove([storagePath]);
    throw new Error(`Enregistrement échoué: ${insertErr?.message ?? 'inconnu'}`);
  }
  return { id: (row as { id: string }).id, storagePath };
}

export interface CommunityPhotoRow {
  id: string;
  place_id: string;
  place_name: string;
  user_id: string;
  storage_path: string;
  caption: string | null;
  country: string | null;
  city: string | null;
  tradition: string | null;
  latitude: number | null;
  longitude: number | null;
  is_new_place: boolean;
  created_at: string;
  reaction_sparkle: number;
  reaction_heart: number;
  reaction_hands: number;
  url: string;
  author_username: string | null;
  author_avatar_url: string | null;
}

/**
 * Fetch the global community feed of approved photos (newest first).
 * Optionally filter by country.
 */
export async function fetchCommunityPhotos(opts: {
  limit?: number;
  country?: string;
} = {}): Promise<CommunityPhotoRow[]> {
  try {
    let q = supabase
      .from('place_photos' as never)
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(opts.limit ?? 50);

    if (opts.country) q = q.eq('country', opts.country);

    const { data, error } = await q;
    if (error || !data) return [];

    const rows = data as Array<Omit<CommunityPhotoRow, 'url' | 'author_username' | 'author_avatar_url'>>;

    // Resolve photo URLs + author profiles in parallel
    const userIds = Array.from(new Set(rows.map((r) => r.user_id)));
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .in('id', userIds);

    const profileMap = new Map<string, { username: string | null; avatar_url: string | null }>();
    (profiles ?? []).forEach((p) => profileMap.set(p.id, { username: p.username, avatar_url: p.avatar_url }));

    return rows.map((r) => {
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(r.storage_path);
      const author = profileMap.get(r.user_id);
      return {
        ...r,
        url: pub.publicUrl,
        author_username: author?.username ?? null,
        author_avatar_url: author?.avatar_url ?? null,
      };
    });
  } catch {
    return [];
  }
}

export type ReactionKind = 'sparkle' | 'heart' | 'hands';

/** Toggle a reaction (sparkle/heart/hands) on a photo for the current user. */
export async function toggleReaction(photoId: string, kind: ReactionKind): Promise<'added' | 'removed'> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Vous devez être connecté pour réagir.');

  const { data: existing } = await supabase
    .from('place_photo_reactions' as never)
    .select('photo_id')
    .eq('photo_id', photoId)
    .eq('user_id', user.id)
    .eq('kind', kind)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('place_photo_reactions' as never)
      .delete()
      .eq('photo_id', photoId)
      .eq('user_id', user.id)
      .eq('kind', kind);
    if (error) throw error;
    return 'removed';
  }

  const { error } = await supabase
    .from('place_photo_reactions' as never)
    .insert({ photo_id: photoId, user_id: user.id, kind } as never);
  if (error) throw error;
  return 'added';
}

/** Fetch the set of reaction kinds the current user has applied to the given photos. */
export async function fetchUserReactions(photoIds: string[]): Promise<Map<string, Set<ReactionKind>>> {
  const out = new Map<string, Set<ReactionKind>>();
  if (photoIds.length === 0) return out;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return out;

  const { data, error } = await supabase
    .from('place_photo_reactions' as never)
    .select('photo_id, kind')
    .eq('user_id', user.id)
    .in('photo_id', photoIds);
  if (error || !data) return out;

  for (const r of data as Array<{ photo_id: string; kind: ReactionKind }>) {
    if (!out.has(r.photo_id)) out.set(r.photo_id, new Set());
    out.get(r.photo_id)!.add(r.kind);
  }
  return out;
}
