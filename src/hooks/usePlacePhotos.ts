// React Query wrapper for user-contributed approved photos.
// Bulk-fetches one entry per place_id in a single round-trip.

import { useQuery } from '@tanstack/react-query';
import { fetchApprovedPhotosForPlaces } from '@/lib/placePhotos';

const ONE_HOUR = 60 * 60 * 1000;

export const useApprovedPlacePhotos = (placeIds: string[] | undefined) => {
  const sortedKey = placeIds ? [...placeIds].sort().join(',') : '';

  return useQuery<Map<string, string>>({
    queryKey: ['place-photos', sortedKey],
    queryFn: () => fetchApprovedPhotosForPlaces(placeIds ?? []),
    enabled: !!placeIds && placeIds.length > 0,
    // Approvals can flip frequently; keep this fairly fresh.
    staleTime: 5 * 60 * 1000,
    gcTime: ONE_HOUR,
    retry: 0, // Silent fail — table may not exist yet
  });
};
