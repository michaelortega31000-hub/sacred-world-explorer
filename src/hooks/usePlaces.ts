import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mockPlaces } from '@/data/placesData';
import { getImageUrl } from '@/lib/imageHelper';
import { logger } from '@/lib/logger';
import type { Place, Religion, PlaceCategory } from '@/contexts/AppContext';
import type { Json } from '@/integrations/supabase/types';

// Type for DB place row (matching Supabase schema)
interface DBPlace {
  id: string;
  name: string;
  country: string;
  city: string;
  type: string;
  description: string | null;
  points_value: number;
  coordinates: Json;
  image_url: string | null;
  religion: string | null;
  verification_status: string | null;
  place_category: string | null;
  tags: string[] | null;
  traditions_related: string[] | null;
}

/**
 * Normalize DB coordinates to app format [lng, lat]
 */
const normalizeCoordinates = (coords: Json): [number, number] => {
  if (Array.isArray(coords) && coords.length >= 2) {
    return [Number(coords[0]), Number(coords[1])];
  }
  if (coords && typeof coords === 'object' && 'lat' in coords && 'lng' in coords) {
    // DB stores { lat, lng } - convert to [lng, lat] for Mapbox
    const obj = coords as { lat: number; lng: number };
    return [obj.lng, obj.lat];
  }
  // Fallback to 0,0 if invalid
  console.warn('Invalid coordinates format:', coords);
  return [0, 0];
};

/**
 * Try to match a local image asset by normalized place name
 */
const tryMatchLocalImage = (placeName: string): string => {
  // Normalize the name to match local file naming convention
  const normalized = placeName
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\b(the|el|la|le|al|de|du|des|of|cathedral|basilica|mosque|temple|church|synagogue)\b/gi, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  // Try to get image via the helper (which has fuzzy matching)
  const testPath = `/src/assets/places/${normalized}.jpg`;
  const result = getImageUrl(testPath);
  
  // If we got something other than placeholder, it worked
  if (result && !result.includes('placeholder')) {
    return result;
  }
  
  // Use a beautiful default placeholder for sacred places
  return '/images/place-placeholder.jpg';
};

/**
 * Convert a DB place to app Place format
 */
const normalizeDbPlace = (dbPlace: DBPlace): Place => {
  // Resolve image: use DB URL, try local match, or placeholder
  let imageUrl = '/placeholder.svg';
  
  if (dbPlace.image_url) {
    // If it's a full URL or valid path, use it
    imageUrl = dbPlace.image_url.startsWith('http') 
      ? dbPlace.image_url 
      : getImageUrl(dbPlace.image_url);
  } else {
    // Try to find a matching local image
    imageUrl = tryMatchLocalImage(dbPlace.name);
  }

  return {
    id: dbPlace.id,
    name: dbPlace.name,
    country: dbPlace.country,
    city: dbPlace.city,
    type: dbPlace.type,
    placeCategory: (dbPlace.place_category as PlaceCategory) || 'religious_site',
    description: dbPlace.description || '',
    points: dbPlace.points_value || 50,
    coordinates: normalizeCoordinates(dbPlace.coordinates),
    imageUrl,
    religion: (dbPlace.religion as Religion) || undefined,
    tags: dbPlace.tags || [],
    traditionsRelated: dbPlace.traditions_related || [],
  };
};

/**
 * Merge DB places with local mockPlaces
 * - DB entries take priority (dedup by ID)
 * - Only verified DB entries are included
 */
const mergePlaces = (dbPlaces: DBPlace[], localPlaces: Place[]): Place[] => {
  const dbIds = new Set(dbPlaces.map(p => p.id));
  const normalizedDb = dbPlaces.map(normalizeDbPlace);
  
  // Filter local places that don't exist in DB
  const uniqueLocal = localPlaces.filter(p => !dbIds.has(p.id));
  
  // DB places first, then unique local places
  return [...normalizedDb, ...uniqueLocal];
};

/**
 * Hook to fetch and merge places from database and local file
 */
export const usePlaces = () => {
  return useQuery({
    queryKey: ['places-merged'],
    queryFn: async () => {
      try {
        // Fetch verified places from Supabase
        const { data: dbPlaces, error } = await supabase
          .from('places')
          .select('*')
          .eq('verification_status', 'verified');

        if (error) {
          console.error('Error fetching places from DB:', error);
          // Fallback to local data only
          return mockPlaces;
        }

        // Merge with local data (cast dbPlaces to our interface)
        const merged = mergePlaces((dbPlaces || []) as unknown as DBPlace[], mockPlaces);
        
        logger.log(`📍 Places merged: ${merged.length} total (${dbPlaces?.length || 0} from DB, ${mockPlaces.length} local, ${merged.length - mockPlaces.length} new from DB)`);
        
        return merged;
      } catch (err) {
        console.error('Failed to fetch places:', err);
        // Fallback to local data
        return mockPlaces;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
  });
};

/**
 * Get places filtered by country
 */
export const usePlacesByCountry = (country: string | undefined) => {
  const { data: places, isLoading, error } = usePlaces();
  
  const filteredPlaces = places?.filter(
    p => p.country.toLowerCase() === country?.toLowerCase()
  ) || [];
  
  return { places: filteredPlaces, isLoading, error };
};

/**
 * Get a single place by ID
 */
export const usePlaceById = (placeId: string | undefined) => {
  const { data: places, isLoading, error } = usePlaces();
  
  const place = places?.find(p => p.id === placeId);
  
  return { place, isLoading, error };
};

/**
 * Get all unique countries from merged places
 */
export const useAllCountries = () => {
  const { data: places, isLoading } = usePlaces();
  
  const countries = places 
    ? Array.from(new Set(places.map(p => p.country))).sort()
    : [];
  
  return { countries, isLoading };
};

/**
 * Hook to invalidate places cache (call after adding new places)
 */
export const useInvalidatePlaces = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ['places-merged'] });
  };
};
