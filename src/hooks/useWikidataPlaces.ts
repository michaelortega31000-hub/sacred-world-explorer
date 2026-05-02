// React Query wrapper around the Wikidata SPARQL fetcher.
// Cached for 24h — heritage data doesn't change often and the query is heavy
// (free service, but we should be polite).

import { useQuery } from '@tanstack/react-query';
import { fetchWikidataPlaces } from '@/lib/wikidataPlaces';
import type { Place } from '@/contexts/AppContext';

const ONE_HOUR = 60 * 60 * 1000;

export const useWikidataPlaces = (country: string | undefined) => {
  return useQuery<Place[]>({
    queryKey: ['wikidata-places', country?.toLowerCase()],
    queryFn: () => fetchWikidataPlaces(country!),
    enabled: !!country,
    staleTime: 24 * ONE_HOUR,   // refresh once per day at most
    gcTime: 7 * 24 * ONE_HOUR,  // keep in cache for a week
    retry: 1,                   // SPARQL endpoint can flake under load
  });
};
