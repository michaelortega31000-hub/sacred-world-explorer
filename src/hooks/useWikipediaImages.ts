// React Query wrapper around the batched Wikipedia thumbnail fetcher.
// Runs as a SECOND query (after Wikidata returns), so the place list
// renders symbol cards immediately and images stream in progressively.

import { useQuery } from '@tanstack/react-query';
import { fetchWikipediaThumbnails } from '@/lib/wikipediaImages';

const ONE_HOUR = 60 * 60 * 1000;

/**
 * Fetch Wikipedia lead-image thumbnails for a list of place names.
 * Returns a Map<name, thumbnailUrl> (empty map if disabled / no titles).
 *
 * The query key is sorted+joined so identical lists in different orders
 * hit the same cache entry.
 */
export const useWikipediaImages = (titles: string[] | undefined) => {
  const sortedKey = titles ? [...titles].sort().join('|') : '';

  return useQuery<Map<string, string>>({
    queryKey: ['wikipedia-thumbnails', sortedKey],
    queryFn: () => fetchWikipediaThumbnails(titles ?? []),
    enabled: !!titles && titles.length > 0,
    staleTime: 24 * ONE_HOUR,
    gcTime: 7 * 24 * ONE_HOUR,
    retry: 1,
  });
};
