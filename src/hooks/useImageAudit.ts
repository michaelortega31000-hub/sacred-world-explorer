import { useState, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { mockPlaces } from '@/data/placesData';
import type { Place } from '@/contexts/AppContext';

export interface AuditedPlace extends Place {
  hasLocalImage: boolean;
  imageStatus: 'valid' | 'missing' | 'placeholder' | 'external';
  wikipediaImageUrl?: string | null;
  isLoadingWikipedia: boolean;
  lastAudited?: string;
}

export interface ImageAuditStats {
  total: number;
  withLocalImage: number;
  withExternalImage: number;
  withPlaceholder: number;
  missing: number;
}

// List of known local image files (based on src/assets/places/)
const LOCAL_IMAGE_FILES = new Set([
  'aachen-cathedral', 'abu-darwish', 'ainay-lyon', 'ajanta', 'akshardham', 'aksum',
  'al-azhar-cairo', 'al-noor', 'alexander-nevsky-tallinn', 'alhambra', 'almudena-cathedral',
  'amiens-cathedral', 'amsterdam-synagogue', 'angkor-thom', 'angkor-wat', 'annunciation-nazareth',
  'antwerp-cathedral', 'aparecida', 'assisi-basilica', 'bagan-temples', 'basilica-lujan-argentina',
  'basilica-voto-nacional', 'ben-youssef', 'berlin-cathedral', 'big-buddha-phuket', 'bled-island',
  'blue-church-bratislava', 'blue-mosque', 'bordeaux-cathedral', 'borgund-stave', 'borobudur',
  'boudhanath-stupa', 'brasilia-cathedral', 'bratislava-cathedral', 'brussels-cathedral',
  'bucharest-cathedral', 'budapest-synagogue', 'buenos-aires-cathedral', 'burgos-cathedral',
  'byodo-in-temple-hawaii', 'canterbury-cathedral', 'carmelites-toulouse', 'catedral-metropolitana-ba',
  'catedral-sal-zipaquira-colombia', 'cathedral-st-paul-mn', 'chartres-cathedral', 'chichen-itza',
  'christ-redeemer', 'christchurch-cathedral', 'cluny-abbey', 'cologne-cathedral', 'compania-jesus-cusco',
  'convento-san-francisco-lima', 'cordoba-mosque', 'crystal-cathedral', 'cusco-cathedral', 'debre-damo',
  'delphi', 'djamaa-djazair', 'dome-of-rock', 'emir-abdelkader', 'ephesus-artemis', 'escorial',
  'fatima', 'florence-duomo', 'fourviere-lyon', 'frauenkirche-dresden', 'fushimi-inari',
  'ghent-cathedral', 'golden-temple', 'grace-cathedral-sf', 'guadalupe-basilica', 'guadalupe-monastery',
  'hagia-sophia', 'hallgrimskirkja', 'hassan-ii-mosque', 'hassan-rabat', 'helsinki-cathedral',
  'holy-sepulchre', 'ibn-tulun', 'iglesia-san-francisco-quito', 'itsukushima', 'jacobins-toulouse',
  'jasna-gora', 'jeronimos', 'jokhang', 'jumeirah', 'kairouan-mosque', 'karnak-temple', 'ketchaoua',
  'king-abdullah', 'king-hussein', 'kinkakuji', 'koutoubia-mosque', 'kykkos-monastery',
  'lalibela-churches', 'las-lajas', 'leon-cathedral', 'leshan-buddha', 'ljubljana-cathedral',
  'longmen', 'lotus-temple-dc', 'lourdes', 'lujan-basilica', 'lumbini-buddha', 'luxembourg-cathedral',
  'lyon-cathedral', 'machu-picchu', 'major-marseille', 'manila-cathedral', 'mecca-kaaba', 'medina-mosque',
  'meenakshi-temple', 'melk-abbey', 'meteora-monasteries', 'mexico-city-cathedral', 'milan-cathedral',
  'mission-san-juan-capistrano', 'mohammed-ali', 'mont-saint-michel', 'mont-sainte-odile',
  'montserrat-monastery', 'mount-athos', 'mount-fuji', 'naples-cathedral', 'national-shrine-dc',
  'nativity-church', 'nidaros-cathedral', 'notre-dame-garde', 'notre-dame-montreal', 'notre-dame',
  'old-new-synagogue', 'padua-basilica', 'pantheon-paris', 'pantheon-rome', 'parthenon',
  'pashupatinath', 'pisa-complex', 'potala-palace', 'prambanan', 'pyramids-giza', 'quaraouiyine',
  'quba-mosque', 'reims-cathedral', 'remuh-synagogue', 'riga-cathedral', 'riverside-church',
  'rome-synagogue', 'roskilde-cathedral', 'rouen-cathedral', 'sacre-coeur-brussels',
  'sacre-coeur-marseille', 'sacre-coeur', 'sagrada-familia', 'sainte-chapelle', 'salamanca-cathedral',
  'salt-lake-temple', 'san-fernando-cathedral', 'san-paolo-rome', 'san-xavier-mission',
  'sanctuary-of-truth', 'santa-catalina-arequipa', 'santa-catalina', 'santa-maria-maggiore',
  'santiago-compostela', 'santo-domingo-cusco', 'santuario-las-lajas-colombia', 'savior-blood-spb',
  'seville-cathedral', 'shaolin', 'sheikh-zayed', 'shwedagon-pagoda', 'sidi-sahbi', 'siena-cathedral',
  'sofia-cathedral', 'st-anne-vilnius', 'st-basils-moscow', 'st-catherine-sinai', 'st-denis-basilica',
  'st-georges-capetown', 'st-john-valletta', 'st-joseph-oratory', 'st-louis-cathedral-nola',
  'st-marks-venice', 'st-mary-tallinn', 'st-marys-sydney', 'st-michel-bordeaux', 'st-nicholas-prague',
  'st-patricks-nyc', 'st-paul-lyon', 'st-peter-riga', 'st-seurin-bordeaux', 'st-victor-marseille',
  'st-vitus-prague', 'ste-croix-bordeaux', 'stonehenge', 'strasbourg-cathedral', 'sultan-hassan',
  'tabriz-blue-mosque', 'taj-mahal', 'temple-of-heaven', 'teotihuacan', 'tirana-cathedral',
  'todaiji', 'toledo-cathedral', 'tongeren-basilica', 'toulouse-st-etienne', 'toulouse-st-sernin',
  'touro-synagogue', 'trinity-church-boston', 'trinity-sergius', 'uluru', 'uppsala-cathedral',
  'valencia-cathedral', 'varanasi-ghats', 'vatican', 'vezelay-basilica', 'vilnius-cathedral',
  'washington-national-cathedral', 'wat-arun', 'wat-benchamabophit', 'wat-chedi-luang',
  'wat-mahathat-ayutthaya', 'wat-pho', 'wat-phra-kaew', 'wat-phra-singh', 'wat-phra-that-doi-suthep',
  'wat-ratchanatdaram', 'wat-rong-khun', 'wat-suthat', 'wawel-cathedral', 'western-wall',
  'westminster-abbey', 'york-minster', 'zipaquira-salt', 'zitouna'
]);

/**
 * Extract filename from imageUrl path
 */
const extractImageFileName = (imageUrl: string): string | null => {
  if (!imageUrl) return null;
  const match = imageUrl.match(/\/([^/]+)\.(jpg|jpeg|png|webp)$/i);
  return match ? match[1] : null;
};

/**
 * Determine image status based on imageUrl
 */
const getImageStatus = (imageUrl: string): AuditedPlace['imageStatus'] => {
  if (!imageUrl || imageUrl === '/placeholder.svg') return 'placeholder';
  if (imageUrl.includes('placeholder')) return 'placeholder';
  if (imageUrl.startsWith('http')) return 'external';
  
  const fileName = extractImageFileName(imageUrl);
  if (fileName && LOCAL_IMAGE_FILES.has(fileName)) {
    return 'valid';
  }
  return 'missing';
};

/**
 * Hook for auditing and managing place images
 */
export const useImageAudit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [auditedPlaces, setAuditedPlaces] = useState<AuditedPlace[]>([]);
  const [dbPlaces, setDbPlaces] = useState<AuditedPlace[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showOnlyProblems, setShowOnlyProblems] = useState(false);
  const [fetchingWikipediaFor, setFetchingWikipediaFor] = useState<Set<string>>(new Set());

  /**
   * Load all places (local + DB) and analyze their images
   */
  const loadAllPlaces = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Convert local mockPlaces to AuditedPlace
      const localAudited: AuditedPlace[] = mockPlaces.map(place => ({
        ...place,
        hasLocalImage: getImageStatus(place.imageUrl) === 'valid',
        imageStatus: getImageStatus(place.imageUrl),
        isLoadingWikipedia: false,
      }));

      setAuditedPlaces(localAudited);

      // Fetch DB places
      const { data: dbData, error } = await supabase
        .from('places')
        .select('*')
        .order('country');

      if (error) {
        console.error('Error fetching DB places:', error);
      } else if (dbData) {
        const dbAudited: AuditedPlace[] = dbData.map(p => {
          const imageUrl = p.image_url || '/placeholder.svg';
          return {
            id: p.id,
            name: p.name,
            country: p.country,
            city: p.city,
            type: p.type,
            description: p.description || '',
            points: p.points_value,
            coordinates: Array.isArray(p.coordinates) 
              ? p.coordinates as [number, number]
              : [(p.coordinates as any)?.lng || 0, (p.coordinates as any)?.lat || 0],
            imageUrl,
            religion: p.religion as any,
            hasLocalImage: false,
            imageStatus: getImageStatus(imageUrl),
            isLoadingWikipedia: false,
            lastAudited: p.updated_at,
          };
        });
        setDbPlaces(dbAudited);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch Wikipedia image for a specific place
   */
  const fetchWikipediaImage = useCallback(async (placeId: string, placeName: string, country: string) => {
    setFetchingWikipediaFor(prev => new Set(prev).add(placeId));
    
    try {
      // Try multiple search queries for better results
      const searchQueries = [
        `${placeName} ${country}`,
        placeName,
        `${placeName} cathedral`,
        `${placeName} temple`,
        `${placeName} mosque`,
      ];

      for (const query of searchQueries) {
        const { data, error } = await supabase.functions.invoke('fetch-wikipedia-image', {
          body: { title: query }
        });

        if (!error && data?.imageUrl) {
          // Update local state
          setAuditedPlaces(prev => prev.map(p => 
            p.id === placeId 
              ? { ...p, wikipediaImageUrl: data.imageUrl, isLoadingWikipedia: false }
              : p
          ));
          setDbPlaces(prev => prev.map(p =>
            p.id === placeId
              ? { ...p, wikipediaImageUrl: data.imageUrl, isLoadingWikipedia: false }
              : p
          ));
          return data.imageUrl;
        }
      }
      
      return null;
    } catch (err) {
      console.error('Error fetching Wikipedia image:', err);
      return null;
    } finally {
      setFetchingWikipediaFor(prev => {
        const next = new Set(prev);
        next.delete(placeId);
        return next;
      });
    }
  }, []);

  /**
   * Update a place's image in the database
   */
  const updatePlaceImage = useCallback(async (placeId: string, newImageUrl: string) => {
    const { error } = await supabase
      .from('places')
      .update({ 
        image_url: newImageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', placeId);

    if (error) {
      console.error('Error updating place image:', error);
      throw error;
    }

    // Update local state
    setDbPlaces(prev => prev.map(p =>
      p.id === placeId
        ? { ...p, imageUrl: newImageUrl, imageStatus: 'external' }
        : p
    ));

    return true;
  }, []);

  /**
   * Batch update multiple places from Wikipedia
   */
  const batchFetchWikipediaImages = useCallback(async (
    places: AuditedPlace[],
    onProgress?: (current: number, total: number, placeName: string) => void
  ) => {
    const results = { success: 0, failed: 0, skipped: 0 };
    
    for (let i = 0; i < places.length; i++) {
      const place = places[i];
      onProgress?.(i + 1, places.length, place.name);
      
      // Skip if already has a valid external image
      if (place.imageStatus === 'external' && place.imageUrl?.startsWith('http')) {
        results.skipped++;
        continue;
      }
      
      const imageUrl = await fetchWikipediaImage(place.id, place.name, place.country);
      
      if (imageUrl) {
        try {
          await updatePlaceImage(place.id, imageUrl);
          results.success++;
        } catch {
          results.failed++;
        }
      } else {
        results.failed++;
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return results;
  }, [fetchWikipediaImage, updatePlaceImage]);

  // Get all unique countries
  const countries = useMemo(() => {
    const allPlaces = [...auditedPlaces, ...dbPlaces];
    const countrySet = new Set(allPlaces.map(p => p.country));
    return Array.from(countrySet).sort();
  }, [auditedPlaces, dbPlaces]);

  // Filtered places based on current filters
  const filteredPlaces = useMemo(() => {
    let places = [...auditedPlaces, ...dbPlaces];
    
    // Remove duplicates by ID
    const uniquePlaces = new Map<string, AuditedPlace>();
    places.forEach(p => uniquePlaces.set(p.id, p));
    places = Array.from(uniquePlaces.values());
    
    if (selectedCountry) {
      places = places.filter(p => p.country === selectedCountry);
    }
    
    if (showOnlyProblems) {
      places = places.filter(p => 
        p.imageStatus === 'placeholder' || 
        p.imageStatus === 'missing'
      );
    }
    
    return places.sort((a, b) => a.country.localeCompare(b.country) || a.name.localeCompare(b.name));
  }, [auditedPlaces, dbPlaces, selectedCountry, showOnlyProblems]);

  // Stats
  const stats = useMemo<ImageAuditStats>(() => {
    const allPlaces = [...auditedPlaces, ...dbPlaces];
    const uniquePlaces = new Map<string, AuditedPlace>();
    allPlaces.forEach(p => uniquePlaces.set(p.id, p));
    const places = Array.from(uniquePlaces.values());
    
    return {
      total: places.length,
      withLocalImage: places.filter(p => p.imageStatus === 'valid').length,
      withExternalImage: places.filter(p => p.imageStatus === 'external').length,
      withPlaceholder: places.filter(p => p.imageStatus === 'placeholder').length,
      missing: places.filter(p => p.imageStatus === 'missing').length,
    };
  }, [auditedPlaces, dbPlaces]);

  return {
    isLoading,
    auditedPlaces,
    dbPlaces,
    filteredPlaces,
    countries,
    selectedCountry,
    setSelectedCountry,
    showOnlyProblems,
    setShowOnlyProblems,
    stats,
    loadAllPlaces,
    fetchWikipediaImage,
    updatePlaceImage,
    batchFetchWikipediaImages,
    fetchingWikipediaFor,
  };
};
