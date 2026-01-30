import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mockPlaces } from '@/data/placesData';
import { resolveImageWithFallback } from '@/lib/imageHelper';
import type { Place, Religion } from '@/contexts/AppContext';

interface DbPlace {
  id: string;
  name: string;
  country: string;
  city: string;
  type: string;
  description: string | null;
  image_url: string | null;
  coordinates: { lat: number; lng: number };
  points_value: number;
  religion: string | null;
  verification_status: string | null;
}

// Map database religion strings to Religion type
const mapReligion = (dbReligion: string | null): Religion | undefined => {
  if (!dbReligion) return undefined;
  
  const mapping: Record<string, Religion> = {
    'Christianisme': 'christianity',
    'Islam': 'islam',
    'Judaïsme': 'judaism',
    'Bouddhisme': 'buddhism',
    'Hindouisme': 'hinduism',
    'Shinto': 'traditional',
    'Taoïsme': 'traditional',
    'Spiritualité autochtone': 'traditional',
    'Antique': 'traditional',
    'Confucianisme': 'traditional',
    'Bahaïsme': 'traditional',
    'Zoroastrisme': 'traditional',
    'Sikhisme': 'traditional',
    'Jaïnisme': 'traditional',
    'Multi-confessionnel': 'traditional',
  };
  
  return mapping[dbReligion] || 'traditional';
};

/**
 * Normalize database place to app Place format
 * - Converts coordinates from {lat, lng} to [lng, lat]
 * - Resolves image with fallback to local assets or placeholder
 */
const normalizeDbPlace = (dbPlace: DbPlace): Place => {
  // Handle coordinates - DB stores {lat, lng}, app expects [lng, lat]
  let coords: [number, number] = [0, 0];
  
  if (dbPlace.coordinates) {
    const { lat, lng } = dbPlace.coordinates;
    coords = [lng, lat]; // Mapbox format: [longitude, latitude]
  }

  return {
    id: dbPlace.id,
    name: dbPlace.name,
    country: dbPlace.country,
    city: dbPlace.city,
    type: dbPlace.type,
    description: dbPlace.description || '',
    points: dbPlace.points_value || 50,
    coordinates: coords,
    imageUrl: resolveImageWithFallback(dbPlace.image_url, dbPlace.name),
    religion: mapReligion(dbPlace.religion),
  };
};

/**
 * Merge database places with local mockPlaces
 * - Database entries take priority (by ID)
 * - Deduplicates by place ID
 */
const mergePlaces = (dbPlaces: DbPlace[], localPlaces: Place[]): Place[] => {
  const dbIds = new Set(dbPlaces.map(p => p.id));
  const normalizedDb = dbPlaces.map(normalizeDbPlace);
  const uniqueLocal = localPlaces.filter(p => !dbIds.has(p.id));
  
  return [...normalizedDb, ...uniqueLocal];
};

/**
 * Hook to fetch and merge places from database + local file
 * Returns unified list of verified places
 */
export const usePlaces = () => {
  return useQuery({
    queryKey: ['places-merged'],
    queryFn: async () => {
      // Fetch verified places from Supabase
      const { data: dbPlaces, error } = await supabase
        .from('places')
        .select('id, name, country, city, type, description, image_url, coordinates, points_value, religion, verification_status')
        .eq('verification_status', 'verified');

      if (error) {
        console.error('Error fetching places from database:', error);
        // Fallback to local data only
        return mockPlaces;
      }

      // Merge with local places (DB takes priority)
      const merged = mergePlaces((dbPlaces || []) as DbPlace[], mockPlaces);
      
      console.log(`📍 Places loaded: ${merged.length} total (${dbPlaces?.length || 0} from DB, ${mockPlaces.length} local)`);
      
      return merged;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
  });
};

/**
 * Get places filtered by country from the merged data
 */
export const getPlacesByCountryFromData = (places: Place[], country: string): Place[] => {
  return places.filter(place => place.country === country);
};

/**
 * Get a specific place by ID from the merged data
 */
export const getPlaceByIdFromData = (places: Place[], id: string): Place | undefined => {
  return places.find(place => place.id === id);
};

/**
 * Get all unique countries from the merged data
 */
export const getAllCountriesFromData = (places: Place[]): string[] => {
  return Array.from(new Set(places.map(place => place.country))).sort();
};

/**
 * Get all places (for components that need the full list synchronously)
 */
export const getAllPlacesFromData = (places: Place[]): Place[] => {
  return places;
};
