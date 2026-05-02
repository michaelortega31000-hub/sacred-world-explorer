import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mockPlaces } from '@/data/placesData';
import { getImageUrl } from '@/lib/imageHelper';
import { logger } from '@/lib/logger';
import { useWikidataPlaces } from '@/hooks/useWikidataPlaces';
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
  // France — all 20 missing-image entries from the DB, verified via Wikimedia Commons
  'notre dame amiens|amiens': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Fa%C3%A7ade_Ouest_Cath%C3%A9drale_Notre_Dame_-_Amiens_%28FR80%29_-_2021-05-30_-_14.jpg/1280px-Fa%C3%A7ade_Ouest_Cath%C3%A9drale_Notre_Dame_-_Amiens_%28FR80%29_-_2021-05-30_-_14.jpg',
  'notre dame chartres|chartres': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Cath%C3%A9drale_Notre_Dame_-_Chartres_%28FR28%29_-_2021-03-14_-_4.jpg/1280px-Cath%C3%A9drale_Notre_Dame_-_Chartres_%28FR28%29_-_2021-03-14_-_4.jpg',
  'chartres|chartres': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Cath%C3%A9drale_Notre_Dame_-_Chartres_%28FR28%29_-_2021-03-14_-_4.jpg/1280px-Cath%C3%A9drale_Notre_Dame_-_Chartres_%28FR28%29_-_2021-03-14_-_4.jpg',
  'cluny|cluny': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Cluny_-_B%C3%A2timents_abbatiaux_-_08.jpg/1280px-Cluny_-_B%C3%A2timents_abbatiaux_-_08.jpg',
  'bois chenu|domremy-la-pucelle': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Basilique_du_Bois_Ch%C3%AAnu.JPG/1280px-Basilique_du_Bois_Ch%C3%AAnu.JPG',
  'bois chenu|domremy la pucelle': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Basilique_du_Bois_Ch%C3%AAnu.JPG/1280px-Basilique_du_Bois_Ch%C3%AAnu.JPG',
  'notre dame senanque|gordes': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Abbaye-senanque-gordes-iso.jpg/1280px-Abbaye-senanque-gordes-iso.jpg',
  'senanque|gordes': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Abbaye-senanque-gordes-iso.jpg/1280px-Abbaye-senanque-gordes-iso.jpg',
  'mont michel|le mont-saint-michel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Mont-Saint-Michel_vu_du_ciel.jpg/1280px-Mont-Saint-Michel_vu_du_ciel.jpg',
  'lisieux|lisieux': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Basilique_Sainte-Th%C3%A9r%C3%A8se_de_Lisieux-2876.jpg/1280px-Basilique_Sainte-Th%C3%A9r%C3%A8se_de_Lisieux-2876.jpg',
  'notre dame lourdes|lourdes': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Basilica_of_the_Immaculate_Conception_and_surroundings_of_the_grotto.jpg/1280px-Basilica_of_the_Immaculate_Conception_and_surroundings_of_the_grotto.jpg',
  'martin ainay|lyon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Basilique.Saint.Martin.d.Ainay.JPG/1280px-Basilique.Saint.Martin.d.Ainay.JPG',
  'fontenay|marmagne': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Abbaye_de_Fontenay_panorama.jpg/1280px-Abbaye_de_Fontenay_panorama.jpg',
  'nicolas nice|nice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Cath%C3%A9drale_orthodoxe_russe_Saint-Nicolas_de_Nice.jpg/1280px-Cath%C3%A9drale_orthodoxe_russe_Saint-Nicolas_de_Nice.jpg',
  'mont odile|ottrott': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Ottrott_Mont_Sainte-Odile.JPG/1280px-Ottrott_Mont_Sainte-Odile.JPG',
  'sacre montmartre|paris': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Sacr%C3%A9_Coeur_Fa%C3%A7ade_1.jpg/1280px-Sacr%C3%A9_Coeur_Fa%C3%A7ade_1.jpg',
  'notre dame paris|paris': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Notre-Dame_de_Paris_2013-07-24.jpg/1280px-Notre-Dame_de_Paris_2013-07-24.jpg',
  'notre dame reims|reims': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Exterior_view_of_the_west_facade_of_Notre-Dame_Cathedral_in_Reims.jpg/1280px-Exterior_view_of_the_west_facade_of_Notre-Dame_Cathedral_in_Reims.jpg',
  'notre dame rouen|rouen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Rouen_Cathedral_as_seen_from_Gros_Horloge_140215_4.jpg/1280px-Rouen_Cathedral_as_seen_from_Gros_Horloge_140215_4.jpg',
  'notre dame strasbourg|strasbourg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Strasbourg_Cathedral_Exterior_-_Diliff.jpg/1280px-Strasbourg_Cathedral_Exterior_-_Diliff.jpg',
  'etienne toulouse|toulouse': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Fa%C3%A7ade_de_la_cath%C3%A9drale_Saint-%C3%89tienne_de_Toulouse.jpg/1280px-Fa%C3%A7ade_de_la_cath%C3%A9drale_Saint-%C3%89tienne_de_Toulouse.jpg',
  'sernin toulouse|toulouse': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Basilique_Saint-Sernin_de_Toulouse_-_exposition_ouest-1-.jpg/1280px-Basilique_Saint-Sernin_de_Toulouse_-_exposition_ouest-1-.jpg',
  'marie madeleine vezelay|vezelay': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/V%C3%A9zelay_-_Basilique_Sainte-Marie-Madeleine_-_Ext%C3%A9rieur_-_10.jpg/1280px-V%C3%A9zelay_-_Basilique_Sainte-Marie-Madeleine_-_Ext%C3%A9rieur_-_10.jpg',
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
const resolveDbImage = (dbPlace: DBPlace, key: string): string | undefined => {
  if (dbPlace.image_url) {
    return dbPlace.image_url.startsWith('http')
      ? dbPlace.image_url
      : getImageUrl(dbPlace.image_url);
  }
  const override = IMAGE_OVERRIDES[key];
  if (override) {
    return override.startsWith('http') ? override : getImageUrl(override);
  }
  // Return undefined (not a placeholder image) — the UI uses <PlaceSymbol>
  // for entries without verified photography. No misleading visuals.
  return undefined;
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

  // Apply IMAGE_OVERRIDES to ANY entry (local or DB) whose imageUrl is missing
  // or points to the placeholder. This catches both gaps in the local dataset
  // and DB rows where image_url is NULL.
  const isPlaceholder = (url: string | undefined): boolean =>
    !url || url === '/placeholder.svg' || url === '/images/place-placeholder.jpg';

  const merged = [...localPlaces, ...uniqueDb].map(p => {
    if (!isPlaceholder(p.imageUrl)) return p;
    const key = canonicalKey(p.name, p.city, p.country);
    const override = IMAGE_OVERRIDES[key];
    return override ? { ...p, imageUrl: override } : p;
  });

  return merged;
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
 * Get places filtered by country, enriched with Wikidata heritage sites.
 *
 * Local + DB places are authoritative — they have curated descriptions,
 * verified images, and reward values. Wikidata fills the long tail:
 * any country in the supported QID map gets ~50–200 extra sites pulled
 * from Wikidata, deduplicated against local entries by canonical key.
 *
 * The Wikidata fetch fails gracefully — if the endpoint is down or the
 * country isn't in the QID map, the user just sees the local + DB set.
 */
export const usePlacesByCountry = (country: string | undefined) => {
  const { data: places, isLoading: localLoading, error } = usePlaces();
  const { data: wikidataPlaces, isLoading: wdLoading } = useWikidataPlaces(country);

  const localFiltered = places?.filter(
    p => p.country.toLowerCase() === country?.toLowerCase(),
  ) || [];

  // Dedupe Wikidata against the local+DB set using the same canonical key
  // logic that mergePlaces uses for DB→local dedupe.
  const seenKeys = new Set(
    localFiltered.map(p => canonicalKey(p.name, p.city || '', p.country)),
  );

  const uniqueWikidata = (wikidataPlaces ?? []).filter(p => {
    const key = canonicalKey(p.name, p.city || '', p.country);
    if (seenKeys.has(key)) return false;
    seenKeys.add(key);
    return true;
  });

  const merged = [...localFiltered, ...uniqueWikidata];

  return {
    places: merged,
    isLoading: localLoading || wdLoading,
    error,
    wikidataCount: uniqueWikidata.length,
  };
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
