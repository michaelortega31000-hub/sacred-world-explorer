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
    const obj = coords as { lat: number; lng: number };
    return [obj.lng, obj.lat];
  }
  console.warn('Invalid coordinates format:', coords);
  return [0, 0];
};

/**
 * City aliases — different names for the same city.
 * All values are normalized (lowercase, no diacritics).
 */
const CITY_ALIASES: Record<string, string> = {
  'padua': 'padoue',
  'padova': 'padoue',
  'firenze': 'florence',
  'roma': 'rome',
  'venezia': 'venise',
  'milano': 'milan',
  'napoli': 'naples',
  'torino': 'turin',
  'sevilla': 'seville',
};

/**
 * Verified image overrides keyed by canonical monument key.
 * Used when a DB entry has no image_url so we never fall back to fuzzy guessing.
 */
const IMAGE_OVERRIDES: Record<string, string> = {
  // France
  'chartres|chartres': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Chartres_-_Cathedrale.jpg/1024px-Chartres_-_Cathedrale.jpg',
  'bois chenu|domremy la pucelle': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Domremy_basilique.JPG/1024px-Domremy_basilique.JPG',
  'lisieux|lisieux': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Basilique_Sainte-Th%C3%A9r%C3%A8se_de_Lisieux_-_2.jpg/1024px-Basilique_Sainte-Th%C3%A9r%C3%A8se_de_Lisieux_-_2.jpg',
  'senanque|gordes': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Abbaye_de_S%C3%A9nanque_-_panoramio.jpg/1024px-Abbaye_de_S%C3%A9nanque_-_panoramio.jpg',
  // Italy
  'antoine padoue|padoue': '/src/assets/places/padua-basilica.jpg',
  'santa casa|loreto': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Loreto_Basilica_della_Santa_Casa.jpg/1024px-Loreto_Basilica_della_Santa_Casa.jpg',
};

/**
 * Build a canonical key for monument deduplication.
 * Strips diacritics, common type prefixes, articles, and applies city aliases.
 * Two entries that refer to the same monument should produce the same key,
 * even if they use different naming conventions.
 */
const canonicalKey = (name: string, city: string, _country: string): string => {
  const stripDiacritics = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

  const normalizedName = stripDiacritics(name)
    .replace(/\b(cathedrale|basilique|eglise|abbaye|sanctuaire|monastere|temple|mosquee|synagogue|chapelle|ensemble)\b/g, '')
    .replace(/\b(notre dame|saint|sainte|st|ste|du|de la|de|des|d'|l'|le|la|les|et)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(w => w.length > 2)
    .slice(0, 3) // first 3 meaningful words form the identity
    .join(' ');

  const normalizedCity = stripDiacritics(city).trim();
  const finalCity = CITY_ALIASES[normalizedCity] || normalizedCity;

  return `${normalizedName}|${finalCity}`;
};

/**
 * Resolve image for a DB place: DB url > canonical override > placeholder.
 * No fuzzy local matching — that caused unrelated monuments to share an image.
 */
const resolveDbImage = (dbPlace: DBPlace, key: string): string => {
  if (dbPlace.image_url) {
    return dbPlace.image_url.startsWith('http')
      ? dbPlace.image_url
      : getImageUrl(dbPlace.image_url);
  }
  const override = IMAGE_OVERRIDES[key];
  if (override) {
    return override.startsWith('http') ? override : getImageUrl(override);
  }
  return '/images/place-placeholder.jpg';
};

const normalizeDbPlace = (dbPlace: DBPlace, key: string): Place => ({
  id: dbPlace.id,
  name: dbPlace.name,
  country: dbPlace.country,
  city: dbPlace.city,
  type: dbPlace.type,
  placeCategory: (dbPlace.place_category as PlaceCategory) || 'religious_site',
  description: dbPlace.description || '',
  points: dbPlace.points_value || 50,
  coordinates: normalizeCoordinates(dbPlace.coordinates),
  imageUrl: resolveDbImage(dbPlace, key),
  religion: (dbPlace.religion as Religion) || undefined,
  tags: dbPlace.tags || [],
  traditionsRelated: dbPlace.traditions_related || [],
});

/**
 * Merge DB places with local mockPlaces.
 * Local entries are curated (proper descriptions + images) → take priority.
 * DB entries are dropped if they duplicate a local entry (by ID or canonical key)
 * or another DB entry already kept.
 */
const mergePlaces = (dbPlaces: DBPlace[], localPlaces: Place[]): Place[] => {
  const localIds = new Set(localPlaces.map(p => p.id));
  const seenKeys = new Set<string>(
    localPlaces.map(p => canonicalKey(p.name, p.city, p.country))
  );

  const uniqueDb: Place[] = [];
  for (const dbPlace of dbPlaces) {
    if (localIds.has(dbPlace.id)) continue;
    const key = canonicalKey(dbPlace.name, dbPlace.city, dbPlace.country);
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);
    uniqueDb.push(normalizeDbPlace(dbPlace, key));
  }

  return [...localPlaces, ...uniqueDb];
};

/**
 * Hook to fetch and merge places from database and local file
 */
export const usePlaces = () => {
  return useQuery({
    queryKey: ['places-merged'],
    queryFn: async () => {
      try {
        const { data: dbPlaces, error } = await supabase
          .from('places')
          .select('*')
          .eq('verification_status', 'verified');

        if (error) {
          console.error('Error fetching places from DB:', error);
          return mockPlaces;
        }

        const merged = mergePlaces((dbPlaces || []) as unknown as DBPlace[], mockPlaces);

        logger.log(`📍 Places merged: ${merged.length} total (${dbPlaces?.length || 0} from DB, ${mockPlaces.length} local, ${merged.length - mockPlaces.length} new from DB)`);

        return merged;
      } catch (err) {
        console.error('Failed to fetch places:', err);
        return mockPlaces;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
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
