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
