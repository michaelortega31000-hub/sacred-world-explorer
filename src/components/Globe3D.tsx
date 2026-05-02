import { useEffect, useRef, useState } from 'react';
import { logger } from '@/lib/logger';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Locate, X, Loader2, AlertCircle, Route, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getImageUrl } from '@/lib/imageHelper';
import { useApp } from '@/contexts/AppContext';
import { religionColors } from '@/config/religionColors';
import { inferReligionFromPlace } from '@/lib/religionHelper';
import MonumentFilter, { FilterOptions } from '@/components/MonumentFilter';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useLocationHistory } from '@/hooks/useLocationHistory';
import { useCountrySparkle } from '@/hooks/useCountrySparkle';
import { toast } from 'sonner';
import { getMapboxToken } from '@/lib/mapboxHelper';
import type { Religion, PlaceCategory } from '@/contexts/AppContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { PlaceCategoryFilterValue } from '@/components/PlaceCategoryFilter';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { mapStyleUrls, atmospherePresets } from '@/types/globeSettings';
import { attachSpiritualOverlay, type SpiritualOverlayHandle } from '@/components/quest/spiritualOverlay';
import {
  attachUnescoOverlay,
  type UnescoOverlayHandle,
  UNESCO_DOT_LAYER,
} from '@/components/quest/unescoOverlay';
import { fetchWikipediaThumbnails } from '@/lib/wikipediaImages';

interface Globe3DProps {
  onCountryClick?: (countryName: string) => void;
  onRecenterRef?: (fn: () => void) => void;
  onFlyToRef?: (fn: (lat: number, lng: number, zoom?: number) => void) => void;
  onPausedChange?: (paused: boolean) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  tripPlaces?: string[];
  categoryFilter?: PlaceCategoryFilterValue;
}
interface PlaceFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    id: string;
    name: string;
    type: string;
    country: string;
    points: number;
    religion: string;
    description?: string;
    imageUrl?: string;
    isVisited: boolean;
    order?: number;
    isStart?: boolean;
    isEnd?: boolean;
  };
}
interface PlacesCollection {
  type: 'FeatureCollection';
  features: PlaceFeature[];
}
const Globe3D = ({
  onCountryClick,
  onRecenterRef,
  onFlyToRef,
  onPausedChange,
  onFullscreenChange,
  tripPlaces = [],
  categoryFilter = 'all'
}: Globe3DProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userLocationMarker = useRef<mapboxgl.Marker | null>(null);
  const currentPopup = useRef<mapboxgl.Popup | null>(null);
  const tripStartMarker = useRef<mapboxgl.Marker | null>(null);
  const tripEndMarker = useRef<mapboxgl.Marker | null>(null);
  const tripMarkers = useRef<mapboxgl.Marker[]>([]);
  const endMarkerTimeout = useRef<NodeJS.Timeout | null>(null);
  const spiritualOverlayRef = useRef<SpiritualOverlayHandle | null>(null);
  const unescoOverlayRef = useRef<UnescoOverlayHandle | null>(null);
  const hasInitiallyZoomed = useRef(false);
  const pendingRecenter = useRef(false);
  
  // Event handler refs for cleanup
  const handleNavigateToPlaceRef = useRef<EventListener | null>(null);
  const handleAddToTripRef = useRef<EventListener | null>(null);
  const handleRemoveFromTripRef = useRef<EventListener | null>(null);
  const handleOpenServicesRef = useRef<EventListener | null>(null);
  const navigate = useNavigate();
  const {
    t
  } = useTranslation();
  const {
    userProgress,
    toggleGeolocation,
    addToTrip,
    removeFromTrip
  } = useApp();
  const [showMonuments, setShowMonuments] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    religions: [],
    types: [],
  });
  const [filteredCount, setFilteredCount] = useState<number>(0);
  const [showClearDialog, setShowClearDialog] = useState(false);
  
  // Use global geolocation state from AppContext
  const geolocationEnabled = userProgress.geolocationEnabled;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const {
    position: userPosition,
    error: geolocationError
  } = useGeolocation(geolocationEnabled);

  // Sparkle effect on country click
  const {
    triggerSparkle
  } = useCountrySparkle();

  // Location history tracking
  const {
    history: locationHistory,
    isRecording,
    loading: historyLoading,
    startRecording,
    stopRecording,
    clearHistory
  } = useLocationHistory({
    enabled: geolocationEnabled,
    userPosition
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const isMapReadyRef = useRef(false);
  const allPlacesRef = useRef<any[]>([]);
  const [filterControlContainer, setFilterControlContainer] = useState<HTMLDivElement | null>(null);
  const pendingFlyTo = useRef<{
    lat: number;
    lng: number;
    zoom: number;
  } | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Normalize string helper
  const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

  // Sanitize coordinates: ensure [lng, lat] format and valid ranges
  const sanitizeCoordinates = (coords: [number, number], placeId: string): [number, number] | null => {
    let [first, second] = coords;

    // Check if coordinates need swapping
    // Mapbox expects [longitude, latitude] where:
    // - longitude: -180 to 180
    // - latitude: -90 to 90
    // If first value looks like latitude (|first| <= 90) and second looks like longitude (|second| > 90),
    // then swap them
    if (Math.abs(first) <= 90 && Math.abs(second) > 90) {
      logger.log(`🔄 Swapping coords for ${placeId}: [${first}, ${second}] -> [${second}, ${first}]`);
      [first, second] = [second, first];
    }

    // Validate final coordinates
    if (isNaN(first) || isNaN(second) || Math.abs(second) > 90 || Math.abs(first) > 180) {
      logger.error(`❌ Invalid coordinates for ${placeId}:`, coords, '-> After processing:', [first, second]);
      return null;
    }
    logger.log(`✅ Valid coords for ${placeId}: [lng=${first}, lat=${second}]`);
    return [first, second]; // [lng, lat]
  };

  // Build FeatureCollection from places with filters
  const buildFeatureCollection = (places: any[], activeFilters: FilterOptions, activeCategoryFilter: PlaceCategoryFilterValue = 'all'): PlacesCollection => {
    const features: PlaceFeature[] = [];
    places.forEach(place => {
      const coords = sanitizeCoordinates(place.coordinates, place.id);
      if (!coords) return;
      const religion = (place.religion || inferReligionFromPlace(place.type, place.name)) as string;
      const isVisited = userProgress.visitedPlaces.includes(place.id);

      // Apply category filter first
      const placeCategory = place.placeCategory || 'religious_site';
      if (activeCategoryFilter !== 'all' && placeCategory !== activeCategoryFilter) return;

      // Apply filters
      const matchesReligion = activeFilters.religions.length === 0 || activeFilters.religions.includes(religion as Religion);
      const normalizedType = normalize(place.type);
      const textBlob = normalize(`${place.name} ${place.description || ''} ${place.type}`);
      const matchesType = activeFilters.types.length === 0 || activeFilters.types.some(t => {
        const tLower = normalize(t);
        if (tLower.includes('pyram')) return textBlob.includes('pyram');
        return normalizedType.includes(tLower) || tLower.includes(normalizedType);
      });
      if (!matchesReligion || !matchesType) return;
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: coords
        },
        properties: {
          id: place.id,
          name: place.name,
          type: place.type,
          country: place.country,
          points: place.points,
          religion,
          description: place.description,
          imageUrl: place.imageUrl,
          isVisited
        }
      });
    });
    return {
      type: 'FeatureCollection',
      features
    };
  };

  // Function to update trip places on map
  const updateTripPlaces = () => {
    if (!map.current || !isMapReadyRef.current) {
      logger.log('⚠️ Trip places update skipped - map not ready');
      return;
    }
    logger.log('🗺️ === TRIP PLACES UPDATE START ===');
    logger.log('📍 Trip places IDs received:', tripPlaces);
    logger.log('📦 Total places in allPlacesRef:', allPlacesRef.current.length);
    logger.log('📦 Sample place IDs:', allPlacesRef.current.slice(0, 10).map(p => p.id));
    if (!tripPlaces || tripPlaces.length === 0) {
      logger.log('⚠️ No trip places - clearing sources');
      // Clear trip data when empty
      const source = map.current.getSource('trip-places') as mapboxgl.GeoJSONSource;
      const routeSource = map.current.getSource('trip-route') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: 'FeatureCollection',
          features: []
        });
      }
      if (routeSource) {
        routeSource.setData({
          type: 'FeatureCollection',
          features: []
        });
      }

      // Clear timeout
      if (endMarkerTimeout.current) {
        clearTimeout(endMarkerTimeout.current);
        endMarkerTimeout.current = null;
      }

      // Remove all trip markers
      tripMarkers.current.forEach(marker => marker.remove());
      tripMarkers.current = [];
      if (tripStartMarker.current) {
        tripStartMarker.current.remove();
        tripStartMarker.current = null;
      }
      if (tripEndMarker.current) {
        tripEndMarker.current.remove();
        tripEndMarker.current = null;
      }
      return;
    }

    // Build features for trip places
    let tripFeatures: PlaceFeature[] = [];
    let routeCoordinates: [number, number][] = [];
    const notFound: string[] = [];
    const foundPlaces: {
      place: any;
      coords: [number, number];
    }[] = [];
    tripPlaces.forEach(tripPlaceId => {
      logger.log(`🔍 Looking for trip place: ${tripPlaceId}`);
      const place = allPlacesRef.current.find(p => p.id === tripPlaceId);
      if (!place) {
        logger.warn(`❌ Trip place NOT FOUND in allPlaces: ${tripPlaceId}`);
        notFound.push(tripPlaceId);
        return;
      }
      const coords = sanitizeCoordinates(place.coordinates, place.id);
      if (!coords) return;
      foundPlaces.push({
        place,
        coords
      });
    });

    // Use tripPlaces order directly - it's already optimized by LocationsTab
    // No reordering needed here, the order comes from userProgress.tripPlaces

    // Build features with order/isStart/isEnd properties
    tripFeatures = foundPlaces.map((fp, idx) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: fp.coords
      },
      properties: {
        id: fp.place.id,
        name: fp.place.name,
        type: fp.place.type,
        country: fp.place.country,
        points: fp.place.points,
        religion: (fp.place.religion || inferReligionFromPlace(fp.place.type, fp.place.name)) as string,
        description: fp.place.description,
        imageUrl: fp.place.imageUrl,
        isVisited: userProgress.visitedPlaces.includes(fp.place.id),
        order: idx + 1,
        isStart: idx === 0,
        isEnd: idx === foundPlaces.length - 1
      }
    }));
    routeCoordinates = tripFeatures.map(f => f.geometry.coordinates as [number, number]);
    logger.log('📊 Trip places processing summary:');
    logger.log(`  - Requested: ${tripPlaces.length}`);
    logger.log(`  - Found: ${tripFeatures.length}`);
    logger.log(`  - Not found: ${notFound.length}`, notFound);
    logger.log(`  - Places:`, tripFeatures.map(f => ({
      name: f.properties.name,
      coords: f.geometry.coordinates
    })));

    // Update trip places source
    const source = map.current.getSource('trip-places') as mapboxgl.GeoJSONSource;
    if (source) {
      logger.log('✅ Updating trip-places source with', tripFeatures.length, 'features');
      source.setData({
        type: 'FeatureCollection',
        features: tripFeatures
      });
    } else {
      logger.error('❌ trip-places source not found!');
    }

    // Update route line
    const routeSource = map.current.getSource('trip-route') as mapboxgl.GeoJSONSource;
    if (routeSource && routeCoordinates.length > 1) {
      logger.log('✅ Updating trip-route with', routeCoordinates.length, 'points');
      routeSource.setData({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: routeCoordinates
        },
        properties: {}
      } as any);

      // Animate the line drawing
      animateRouteLine();

      // Clear any pending timeout and remove any legacy HTML markers (we use map layer labels now)
      if (endMarkerTimeout.current) {
        clearTimeout(endMarkerTimeout.current);
        endMarkerTimeout.current = null;
      }
      tripMarkers.current.forEach(m => m.remove());
      tripMarkers.current = [];
      if (tripStartMarker.current) {
        tripStartMarker.current.remove();
        tripStartMarker.current = null;
      }
      if (tripEndMarker.current) {
        tripEndMarker.current.remove();
        tripEndMarker.current = null;
      }
      logger.log(`✅ Trip source updated with ${routeCoordinates.length} points (labels rendered via symbol layer)`);
    } else if (!routeSource) {
      logger.error('❌ trip-route source not found!');
    } else {
      logger.log('⚠️ Not enough coordinates for route line:', routeCoordinates.length);
      // Clear all markers if no route
      tripMarkers.current.forEach(marker => marker.remove());
      tripMarkers.current = [];
      if (tripStartMarker.current) {
        tripStartMarker.current.remove();
        tripStartMarker.current = null;
      }
      if (tripEndMarker.current) {
        tripEndMarker.current.remove();
        tripEndMarker.current = null;
      }
    }
    logger.log('🗺️ === TRIP PLACES UPDATE COMPLETE ===\n');
  };

  // Function to animate route line drawing
  const animateRouteLine = () => {
    if (!map.current) return;
    const duration = 2000; // 2 seconds animation
    const startTime = Date.now();
    const animate = () => {
      if (!map.current) return;
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Update line-gradient for all route layers
      const layerIds = ['trip-route-glow-outer', 'trip-route-glow-inner', 'trip-route-main', 'trip-route-highlight'];
      layerIds.forEach(layerId => {
        if (map.current!.getLayer(layerId)) {
          map.current!.setPaintProperty(layerId, 'line-gradient', ['interpolate', ['linear'], ['line-progress'], 0, 'transparent', progress, layerId.includes('highlight') ? 'hsl(48, 95%, 85%)' : 'hsl(43, 76%, 70%)', 1, 'transparent']);
        }
      });
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation complete - set final gradient to full visibility
        layerIds.forEach(layerId => {
          if (map.current!.getLayer(layerId)) {
            map.current!.setPaintProperty(layerId, 'line-gradient', ['interpolate', ['linear'], ['line-progress'], 0, layerId.includes('highlight') ? 'hsl(48, 95%, 85%)' : 'hsl(43, 76%, 70%)', 1, layerId.includes('highlight') ? 'hsl(48, 95%, 85%)' : 'hsl(43, 76%, 70%)']);
          }
        });
      }
    };
    animate();
  };

  // Update map source with filtered data
  const updateMapData = () => {
    if (!map.current || !isMapReadyRef.current) return;

    // Only show monuments when filters are active OR a category filter is set
    const hasActiveFilters = filters.religions.length > 0 || filters.types.length > 0;
    const hasCategoryFilter = categoryFilter !== 'all';
    if (!showMonuments || !hasActiveFilters && !hasCategoryFilter) {
      // Clear data when no filters active
      const source = map.current.getSource('places') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: 'FeatureCollection',
          features: []
        });
      }
      setFilteredCount(0);
      return;
    }
    const collection = buildFeatureCollection(allPlacesRef.current, filters, categoryFilter);
    const source = map.current.getSource('places') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(collection);
      setFilteredCount(collection.features.length);

      // Debug logs
      const byReligion = collection.features.reduce((acc, f) => {
        const r = f.properties.religion;
        acc[r] = (acc[r] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      logger.log('🗺️ Map updated:', {
        total: collection.features.length,
        filters: filters,
        byReligion,
        sample: collection.features.slice(0, 10).map(f => ({
          name: f.properties.name,
          religion: f.properties.religion,
          coords: f.geometry.coordinates
        }))
      });

      // Fit bounds to visible features
      if (collection.features.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        collection.features.forEach(f => {
          bounds.extend(f.geometry.coordinates as [number, number]);
        });
        if (!bounds.isEmpty()) {
          map.current.fitBounds(bounds, {
            padding: {
              top: 80,
              bottom: 80,
              left: 80,
              right: 80
            },
            duration: 1000,
            maxZoom: 5
          });
        }
      }
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    const token = getMapboxToken();
    logger.log('🗺️ Initializing Mapbox with token:', token.substring(0, 20) + '...');
    mapboxgl.accessToken = token;
    if (!mapboxgl.supported()) {
      const error = "WebGL n'est pas supporté par votre navigateur";
      setMapError(error);
      setIsMapLoading(false);
      toast.error(error);
      return;
    }
    try {
      // Get user's preferred map style
      const preferredStyle = mapStyleUrls[userProgress.globeSettings?.mapStyle || 'satellite'];
      
      // Create map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: preferredStyle,
        projection: {
          name: 'globe'
        },
        center: [2.5, 46.5], // France-first pilot (Phase 2/3)
        zoom: 5.5,
        pitch: 0,
        bearing: 0,
        attributionControl: false
      });
    } catch (error) {
      logger.error('❌ Map initialization error:', error);
      setMapError('Échec de l\'initialisation de la carte: ' + (error as Error).message);
      setIsMapLoading(false);
      return;
    }

    // Enable zoom controls for desktop and mobile
    map.current.scrollZoom.enable(); // Mouse wheel zoom for desktop
    map.current.touchZoomRotate.enable(); // Touch gestures for mobile/tablet
    map.current.doubleClickZoom.enable(); // Double-click zoom
    map.current.boxZoom.enable(); // Shift + drag to zoom

    // Map error handler with filtering for non-critical errors
    map.current.on('error', e => {
      if (!map.current) return;
      const rawMsg = e?.error?.message ?? e?.error ?? e?.message ?? '';
      const errorMsg = (typeof rawMsg === 'string' ? rawMsg : '').toLowerCase();

      // List of non-critical errors to ignore
      const nonFatalPatterns = ['events.mapbox.com',
      // Tracking blocked by ad blockers
      'glyph',
      // Font loading issues
      'sprite',
      // Icon sprite loading
      'tile',
      // Tile loading (often temporary)
      'not found',
      // 404 errors
      'forbidden',
      // 403 errors
      'rate limit',
      // Rate limiting (handled differently)
      'networkerror' // Temporary network issues
      ];
      const isNonFatal = nonFatalPatterns.some(pattern => errorMsg.includes(pattern))
        || errorMsg.length < 10
        || typeof rawMsg !== 'string'; // ignore opaque non-string Mapbox errors

      // Only show error overlay if map hasn't loaded AND error is critical
      if (isNonFatal || map.current.isStyleLoaded() || isMapReadyRef.current) {
        logger.warn('⚠️ Non-critical map error (ignored):', errorMsg);
        return;
      }
      logger.error('❌ Critical map error:', e);
      setMapError('Échec du chargement de la carte. Vérifiez votre connexion.');
      setIsMapLoading(false);
    });

    // Watchdog: if style doesn't load within 5 seconds, try fallback
    const styleLoadTimeout = setTimeout(() => {
      if (!map.current || isMapReadyRef.current || map.current.isStyleLoaded()) return;
      logger.warn('⏱️ Style load timeout - attempting fallback to streets style');
      try {
        map.current.setStyle('mapbox://styles/mapbox/streets-v12');
      } catch (err) {
        logger.error('❌ Fallback style failed:', err);
        setMapError('Impossible de charger la carte. Vérifiez votre connexion.');
        setIsMapLoading(false);
      }
    }, 5000);

    // Wait for style to load
    map.current.on('style.load', async () => {
      clearTimeout(styleLoadTimeout);
      if (!map.current) return;
      logger.log('✅ Map style loaded successfully');
      setIsMapLoading(false);

      // Add React control for MonumentFilter — always top-left
      try {
        const position = 'top-left' as const;
        class ReactControl {
          _container!: HTMLDivElement;
          onAdd() {
            this._container = document.createElement('div');
            this._container.className = 'mapboxgl-ctrl monument-filter-control pointer-events-auto relative';
            this._container.style.marginLeft = '8px';
            this._container.style.marginTop = '8px';
            this._container.style.zIndex = '200';
            return this._container;
          }
          onRemove() {
            this._container?.remove();
          }
        }
        const reactControl = new (ReactControl as any)();
        map.current?.addControl(reactControl as any, position);
        setFilterControlContainer((reactControl as any)._container);
      } catch (e) {
        logger.warn('Failed to add filter control', e);
      }

      // Apply atmosphere based on user preferences
      const atmosphereConfig = atmospherePresets[userProgress.globeSettings?.atmosphere || 'classic'];
      const starIntensity = (userProgress.globeSettings?.starIntensity ?? 0.6) * atmosphereConfig.starIntensityMultiplier;
      
      map.current.setFog({
        color: atmosphereConfig.fogColor,
        'high-color': atmosphereConfig.highColor,
        'horizon-blend': 0.02,
        'space-color': atmosphereConfig.spaceColor,
        'star-intensity': Math.min(starIntensity, 1)
      });

      // Load places data from merged hook
      const {
        usePlaces
      } = await import('@/hooks/usePlaces');
      // We can't use hooks directly here, so we'll import the mock and fetch from DB
      const {
        mockPlaces
      } = await import('@/data/placesData');
      const {
        supabase
      } = await import('@/integrations/supabase/client');

      // Fetch verified places from DB
      let mergedPlaces = [...mockPlaces];
      try {
        const {
          data: dbPlaces
        } = await supabase.from('places').select('*').eq('verification_status', 'verified');
        if (dbPlaces && dbPlaces.length > 0) {
          // Normalize DB places and merge
          const dbIds = new Set(dbPlaces.map(p => p.id));
          const uniqueLocal = mockPlaces.filter(p => !dbIds.has(p.id));
          const normalizedDb = dbPlaces.map(p => {
            const coords = p.coordinates as any;
            let normalizedCoords: [number, number];
            if (Array.isArray(coords)) {
              normalizedCoords = [Number(coords[0]), Number(coords[1])];
            } else if (coords && typeof coords === 'object' && 'lat' in coords) {
              normalizedCoords = [coords.lng, coords.lat];
            } else {
              normalizedCoords = [0, 0];
            }
            return {
              id: p.id,
              name: p.name,
              country: p.country,
              city: p.city,
              type: p.type,
              description: p.description || '',
              points: p.points_value || 50,
              coordinates: normalizedCoords,
              imageUrl: p.image_url || '/placeholder.svg',
              religion: p.religion || undefined
            } as any; // Cast to Place type
          });
          mergedPlaces = [...normalizedDb, ...uniqueLocal];
          logger.log(`📍 Globe: Merged ${mergedPlaces.length} places (${normalizedDb.length} from DB)`);
        }
      } catch (err) {
        logger.warn('Failed to fetch DB places for globe:', err);
      }
      allPlacesRef.current = mergedPlaces;
      logger.log('📦 Loaded places:', mergedPlaces.length);
      logger.log('📦 Sample places:', mergedPlaces.slice(0, 5).map(p => ({
        id: p.id,
        name: p.name,
        coords: p.coordinates,
        religion: p.religion || inferReligionFromPlace(p.type, p.name)
      })));

      // Search for trip place IDs specifically
      if (tripPlaces && tripPlaces.length > 0) {
        logger.log('🔍 Searching for trip places in loaded data:');
        tripPlaces.forEach(id => {
          const found = mergedPlaces.find(p => p.id === id);
          logger.log(`  ${id}:`, found ? `✅ ${found.name}` : '❌ NOT FOUND');
        });
      }

      // Add empty GeoJSON source
      map.current.addSource('places', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      // Add trip places source (separate layer for better visibility)
      map.current.addSource('trip-places', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      // Add trip route source with lineMetrics for gradient effects
      map.current.addSource('trip-route', {
        type: 'geojson',
        lineMetrics: true,
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      // Add country boundaries source for click detection
      map.current.addSource('country-boundaries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1'
      });

      // Add location trail source
      map.current.addSource('location-trail', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      // Add location trail layer with activity-based colors (below places layer)
      map.current.addLayer({
        id: 'location-trail',
        type: 'line',
        source: 'location-trail',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': ['match', ['get', 'activityType'], 'walking', 'hsl(142, 76%, 36%)',
          // Green for walking
          'cycling', 'hsl(217, 91%, 60%)',
          // Blue for cycling
          'transport', 'hsl(0, 84%, 60%)',
          // Red for transport
          'hsl(210, 40%, 60%)' // Gray for unknown
          ],
          'line-width': 4,
          'line-opacity': 0.8
        }
      });

      // Add trip route layers with golden glow effect (4 layers for cinematic effect)
      // Layer 1: Outer glow (widest, most transparent)
      map.current.addLayer({
        id: 'trip-route-glow-outer',
        type: 'line',
        source: 'trip-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-gradient': ['interpolate', ['linear'], ['line-progress'], 0, 'transparent', 1, 'transparent'],
          'line-width': 12,
          'line-blur': 8,
          'line-opacity': 0.3
        }
      });

      // Layer 2: Inner glow
      map.current.addLayer({
        id: 'trip-route-glow-inner',
        type: 'line',
        source: 'trip-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-gradient': ['interpolate', ['linear'], ['line-progress'], 0, 'transparent', 1, 'transparent'],
          'line-width': 8,
          'line-blur': 4,
          'line-opacity': 0.5
        }
      });

      // Layer 3: Main line
      map.current.addLayer({
        id: 'trip-route-main',
        type: 'line',
        source: 'trip-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-gradient': ['interpolate', ['linear'], ['line-progress'], 0, 'transparent', 1, 'transparent'],
          'line-width': 5,
          'line-opacity': 0.95
        }
      });

      // Layer 4: Highlight line (center, brightest)
      map.current.addLayer({
        id: 'trip-route-highlight',
        type: 'line',
        source: 'trip-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-gradient': ['interpolate', ['linear'], ['line-progress'], 0, 'transparent', 1, 'transparent'],
          'line-width': 2,
          'line-opacity': 1
        }
      });

      // === Saved Planner trip (independent layer driven by localStorage) ===
      map.current.addSource('saved-trip-route', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
      map.current.addSource('saved-trip-points', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
      // Outer glow
      map.current.addLayer({
        id: 'saved-trip-glow-outer',
        type: 'line',
        source: 'saved-trip-route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': 'hsl(38, 92%, 60%)',
          'line-width': 14,
          'line-blur': 10,
          'line-opacity': 0.35
        }
      });
      // Inner glow
      map.current.addLayer({
        id: 'saved-trip-glow-inner',
        type: 'line',
        source: 'saved-trip-route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': 'hsl(43, 96%, 65%)',
          'line-width': 7,
          'line-blur': 4,
          'line-opacity': 0.6
        }
      });
      // Main bright line
      map.current.addLayer({
        id: 'saved-trip-main',
        type: 'line',
        source: 'saved-trip-route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': 'hsl(48, 100%, 75%)',
          'line-width': 2.5,
          'line-opacity': 1
        }
      });
      // Saved trip waypoint dots
      map.current.addLayer({
        id: 'saved-trip-points-glow',
        type: 'circle',
        source: 'saved-trip-points',
        paint: {
          'circle-radius': 10,
          'circle-color': 'hsl(43, 96%, 65%)',
          'circle-opacity': 0.35,
          'circle-blur': 0.8
        }
      });
      map.current.addLayer({
        id: 'saved-trip-points-core',
        type: 'circle',
        source: 'saved-trip-points',
        paint: {
          'circle-radius': 5,
          'circle-color': [
            'case',
            ['to-boolean', ['get', 'isStart']], 'hsl(142, 76%, 50%)',
            'hsl(48, 100%, 70%)'
          ],
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 1.5,
          'circle-opacity': 1
        }
      });


      map.current.addLayer({
        id: 'country-fills',
        type: 'fill',
        source: 'country-boundaries',
        'source-layer': 'country_boundaries',
        paint: {
          'fill-color': 'transparent',
          'fill-opacity': 0
        }
      }, 'location-trail'); // Insert below the location trail

      // Add country hover highlight layer
      map.current.addLayer({
        id: 'country-fills-hover',
        type: 'fill',
        source: 'country-boundaries',
        'source-layer': 'country_boundaries',
        paint: {
          'fill-color': '#34E0A1',
          'fill-opacity': 0.15
        },
        filter: ['==', 'iso_3166_1', ''] // Empty filter = nothing shown by default
      }, 'location-trail');

      // Add circle layer with religion-based colors
      map.current.addLayer({
        id: 'places-circles',
        type: 'circle',
        source: 'places',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['get', 'points'], 0, 4, 50, 6, 100, 8, 150, 10],
          'circle-color': ['match', ['get', 'religion'], 'christianity', religionColors.christianity.marker, 'islam', religionColors.islam.marker, 'judaism', religionColors.judaism.marker, 'buddhism', religionColors.buddhism.marker, 'hinduism', religionColors.hinduism.marker, 'astronomy', religionColors.astronomy.marker, 'traditional', religionColors.traditional.marker, 'atheism', religionColors.atheism.marker, religionColors.traditional.marker],
          'circle-stroke-color': ['case', ['get', 'isVisited'], '#F4C542', '#ffffff'],
          'circle-stroke-width': 2,
          'circle-opacity': 0.9,
          'circle-stroke-opacity': 1
        }
      });

      // Add trip places layers (rendered ABOVE normal places)
      // 1. Pulsing circle layer for trip places
      map.current.addLayer({
        id: 'trip-places-pulse',
        type: 'circle',
        source: 'trip-places',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['get', 'points'], 0, 6, 50, 8, 100, 10, 150, 12],
          'circle-color': '#F4C542',
          'circle-opacity': 0.3,
          'circle-blur': 0.8
        }
      });

      // 2. Main circle for trip places
      map.current.addLayer({
        id: 'trip-places-circles',
        type: 'circle',
        source: 'trip-places',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['get', 'points'], 0, 4, 50, 5, 100, 6, 150, 7],
          'circle-color': ['case', ['to-boolean', ['get', 'isStart']], 'hsl(142, 76%, 45%)', ['to-boolean', ['get', 'isEnd']], 'hsl(0, 84%, 60%)', '#F4C542'],
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 1.5,
          'circle-opacity': 1,
          'circle-stroke-opacity': 1
        }
      });

      // Spiritual overlay — gold badge / cyan token / purple skill auras on the real globe
      try {
        spiritualOverlayRef.current?.destroy();
        spiritualOverlayRef.current = attachSpiritualOverlay(map.current);
      } catch (err) {
        logger.error('spiritual overlay failed', err);
      }

      // UNESCO World Heritage layer — ~1,200 sites globally, fades in at zoom >= 2.5
      // Pulled from Wikidata (CC0); cached for the lifetime of the page.
      try {
        unescoOverlayRef.current?.destroy();
        attachUnescoOverlay(map.current).then((handle) => {
          unescoOverlayRef.current = handle;
        }).catch((err) => logger.error('UNESCO overlay failed', err));
      } catch (err) {
        logger.error('UNESCO overlay attachment failed', err);
      }

      // Add hover effect
      map.current.on('mouseenter', 'places-circles', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'places-circles', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });

      // UNESCO marker hover + click popup
      map.current.on('mouseenter', UNESCO_DOT_LAYER, () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', UNESCO_DOT_LAYER, () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });
      map.current.on('click', UNESCO_DOT_LAYER, (e) => {
        if (!e.features?.length || !map.current) return;
        const f = e.features[0];
        const coords = (f.geometry as { coordinates: [number, number] }).coordinates;
        const props = f.properties as { name: string; country: string; category: string; inDanger: boolean };
        if (currentPopup.current) currentPopup.current.remove();
        const danger = props.inDanger
          ? '<div style="color:#fca5a5;font-size:10px;margin-top:4px;">⚠ En péril</div>'
          : '';
        // Escape HTML to avoid breaking out of the popup template if a name
        // contains quotes/brackets.
        const esc = (s: string) =>
          s.replace(/[&<>"']/g, (c) =>
            ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!),
          );
        const renderPopup = (photoUrl?: string) => `
          <div style="background:rgba(7,7,15,0.96);border:1px solid rgba(244,197,66,0.30);border-radius:10px;overflow:hidden;color:#fff;font-family:system-ui;width:240px;">
            ${
              photoUrl
                ? `<div style="width:100%;height:130px;background:#0a0a14 url('${esc(photoUrl)}') center/cover no-repeat;"></div>`
                : ''
            }
            <div style="padding:10px 12px;">
              <div style="font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(244,197,66,0.85);margin-bottom:4px;">UNESCO · ${esc(props.category)}</div>
              <div style="font-size:13px;font-weight:600;color:#fff;line-height:1.3;">${esc(props.name)}</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.6);margin-top:2px;">${esc(props.country)}</div>
              ${danger}
            </div>
          </div>
        `;
        currentPopup.current = new mapboxgl.Popup({
          closeButton: true,
          maxWidth: '260px',
          className: 'unesco-popup',
        })
          .setLngLat(coords)
          .setHTML(renderPopup())
          .addTo(map.current);

        // Async-fetch the Wikipedia article lead image and slot it in.
        // Best-effort: if Wikipedia has no matching article the popup just
        // stays text-only — never falls back to a wrong stock photo.
        const popupAtClick = currentPopup.current;
        fetchWikipediaThumbnails([props.name])
          .then((thumbs) => {
            const url = thumbs.get(props.name);
            // Only update if this popup is still the active one.
            if (url && popupAtClick === currentPopup.current) {
              popupAtClick.setHTML(renderPopup(url));
            }
          })
          .catch(() => { /* silent — text-only popup is fine */ });
      });

      // Hover and click handlers for trip places
      map.current.on('mouseenter', 'trip-places-circles', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'trip-places-circles', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });
      map.current.on('click', 'trip-places-circles', e => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const props = feature.properties as PlaceFeature['properties'];
        const coords = (feature.geometry as any).coordinates as [number, number];
        if (currentPopup.current) {
          currentPopup.current.remove();
        }
        const imageUrl = props.imageUrl ? getImageUrl(props.imageUrl) : '/placeholder.svg';
        const escapedCountry = encodeURIComponent(props.country);
        const popup = new mapboxgl.Popup({
          offset: 15,
          maxWidth: '320px',
          className: 'sacred-popup'
        }).setLngLat(coords).setHTML(`
          <div style="padding: 16px; background: rgba(244, 197, 66, 0.95); backdrop-filter: blur(10px); border-radius: 12px; border: 2px solid #F4C542;">
            <div style="background: #F4C542; color: #142B4F; padding: 4px 12px; border-radius: 6px; margin-bottom: 12px; text-align: center; font-weight: 600; font-size: 12px;">
              ✈️ DANS VOTRE ITINÉRAIRE
            </div>
            <img 
              src="${imageUrl}" 
              alt="${props.name}" 
              style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; cursor: pointer;" 
              onerror="this.src='/placeholder.svg';"
              onclick="window.dispatchEvent(new CustomEvent('navigateToPlace', { detail: '${props.id}' }))"
            />
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #142B4F;">${props.name}</h3>
            <p style="margin: 0 0 12px 0; font-size: 13px; color: #142B4F;">${props.type} • ${props.country}</p>
            ${props.description ? `<p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.6; color: #142B4F;">${props.description.substring(0, 150)}...</p>` : ''}
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="font-size: 13px; font-weight: 600; color: #142B4F;">✨ ${props.points} points</span>
              ${props.isVisited ? '<span style="font-size: 12px; color: #065f46;">✓ Visité</span>' : ''}
            </div>
            <div style="display: flex; gap: 8px; padding-top: 12px; border-top: 1px solid rgba(20, 43, 79, 0.2);">
              <button 
                onclick="window.dispatchEvent(new CustomEvent('removeFromTripFromGlobe', { detail: '${props.id}' }))"
                style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px; padding: 8px; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500;"
                title="Retirer de l'itinéraire"
              >
                ✕ Retirer
              </button>
              <button 
                onclick="window.dispatchEvent(new CustomEvent('openServicesFromGlobe', { detail: { placeId: '${props.id}', country: '${escapedCountry}', type: 'restaurant' } }))"
                style="padding: 8px 12px; background: #142B4F; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;"
                title="Restaurants"
              >
                🍽️
              </button>
              <button 
                onclick="window.dispatchEvent(new CustomEvent('openServicesFromGlobe', { detail: { placeId: '${props.id}', country: '${escapedCountry}', type: 'hotel' } }))"
                style="padding: 8px 12px; background: #142B4F; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;"
                title="Hôtels"
              >
                🏨
              </button>
              <button 
                onclick="window.dispatchEvent(new CustomEvent('openServicesFromGlobe', { detail: { placeId: '${props.id}', country: '${escapedCountry}', type: 'transport' } }))"
                style="padding: 8px 12px; background: #142B4F; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;"
                title="Transports"
              >
                🚌
              </button>
            </div>
          </div>
        `).addTo(map.current!);
        currentPopup.current = popup;
      });

      // Add click handler for popups
      map.current.on('click', 'places-circles', e => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const props = feature.properties as PlaceFeature['properties'];
        const coords = (feature.geometry as any).coordinates as [number, number];

        // Close existing popup
        if (currentPopup.current) {
          currentPopup.current.remove();
        }
        const imageUrl = props.imageUrl ? getImageUrl(props.imageUrl) : '/placeholder.svg';
        const escapedCountry = encodeURIComponent(props.country);
        const popup = new mapboxgl.Popup({
          offset: 15,
          maxWidth: '320px',
          className: 'sacred-popup'
        }).setLngLat(coords).setHTML(`
            <div style="padding: 16px; background: rgba(20, 43, 79, 0.95); backdrop-filter: blur(10px); border-radius: 12px; border: 1px solid rgba(52, 224, 161, 0.3);">
              <img 
                src="${imageUrl}" 
                alt="${props.name}" 
                style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; cursor: pointer; transition: transform 0.2s ease;" 
                onerror="this.src='/placeholder.svg';"
                onclick="window.dispatchEvent(new CustomEvent('navigateToPlace', { detail: '${props.id}' }))"
              />
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #F5F5F5; font-family: 'Playfair Display', serif;">${props.name}</h3>
              <p style="margin: 0 0 12px 0; font-size: 13px; color: #34E0A1;">${props.type} • ${props.country}</p>
              ${props.description ? `<p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.6; color: #EAD7B5; max-height: 100px; overflow-y: auto;">${props.description.substring(0, 150)}...</p>` : ''}
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 13px; font-weight: 600; color: #F4C542;">✨ ${props.points} points</span>
                ${props.isVisited ? '<span style="font-size: 12px; color: #34E0A1;">✓ Visité</span>' : ''}
              </div>
              <div style="display: flex; gap: 8px; padding-top: 12px; border-top: 1px solid rgba(52, 224, 161, 0.2);">
                <button 
                  onclick="window.dispatchEvent(new CustomEvent('addToTripFromGlobe', { detail: '${props.id}' }))"
                  style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px; padding: 8px; background: #34E0A1; color: #142B4F; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;"
                  title="Ajouter à l'itinéraire"
                >
                  + Itinéraire
                </button>
                <button 
                  onclick="window.dispatchEvent(new CustomEvent('openServicesFromGlobe', { detail: { placeId: '${props.id}', country: '${escapedCountry}', type: 'restaurant' } }))"
                  style="padding: 8px 12px; background: rgba(244, 197, 66, 0.2); color: #F4C542; border: 1px solid rgba(244, 197, 66, 0.4); border-radius: 6px; cursor: pointer; font-size: 14px;"
                  title="Restaurants"
                >
                  🍽️
                </button>
                <button 
                  onclick="window.dispatchEvent(new CustomEvent('openServicesFromGlobe', { detail: { placeId: '${props.id}', country: '${escapedCountry}', type: 'hotel' } }))"
                  style="padding: 8px 12px; background: rgba(244, 197, 66, 0.2); color: #F4C542; border: 1px solid rgba(244, 197, 66, 0.4); border-radius: 6px; cursor: pointer; font-size: 14px;"
                  title="Hôtels"
                >
                  🏨
                </button>
                <button 
                  onclick="window.dispatchEvent(new CustomEvent('openServicesFromGlobe', { detail: { placeId: '${props.id}', country: '${escapedCountry}', type: 'transport' } }))"
                  style="padding: 8px 12px; background: rgba(244, 197, 66, 0.2); color: #F4C542; border: 1px solid rgba(244, 197, 66, 0.4); border-radius: 6px; cursor: pointer; font-size: 14px;"
                  title="Transports"
                >
                  🚌
                </button>
              </div>
            </div>
          `).addTo(map.current!);
        currentPopup.current = popup;
      });

      // Listen for navigation events from popup
      handleNavigateToPlaceRef.current = ((e: CustomEvent) => {
        navigate(`/place/${e.detail}`);
      }) as EventListener;
      
      handleAddToTripRef.current = ((e: CustomEvent) => {
        const placeId = e.detail;
        addToTrip(placeId);
        toast.success('Lieu ajouté à votre itinéraire', {
          description: 'Retrouvez-le dans l\'onglet "Mon itinéraire"',
          duration: 3000
        });
        // Close popup after action
        if (currentPopup.current) {
          currentPopup.current.remove();
          currentPopup.current = null;
        }
      }) as EventListener;
      
      handleRemoveFromTripRef.current = ((e: CustomEvent) => {
        const placeId = e.detail;
        removeFromTrip(placeId);
        toast.success('Lieu retiré de votre itinéraire', { duration: 3000 });
        // Close popup after action
        if (currentPopup.current) {
          currentPopup.current.remove();
          currentPopup.current = null;
        }
      }) as EventListener;
      
      handleOpenServicesRef.current = ((e: CustomEvent) => {
        const { placeId, country, type } = e.detail;
        const decodedCountry = decodeURIComponent(country);
        if (type === 'restaurant') {
          // Navigate to country page with restaurants tab
          navigate(`/country/${decodedCountry}?tab=restaurants`);
        } else {
          // Navigate to place detail and scroll to services section
          navigate(`/place/${placeId}?scrollTo=services`);
        }
      }) as EventListener;
      
      window.addEventListener('navigateToPlace', handleNavigateToPlaceRef.current);
      window.addEventListener('addToTripFromGlobe', handleAddToTripRef.current);
      window.addEventListener('removeFromTripFromGlobe', handleRemoveFromTripRef.current);
      window.addEventListener('openServicesFromGlobe', handleOpenServicesRef.current);

      // Country hover effect using fill layer - covers entire country surface
      map.current.on('mousemove', 'country-fills', e => {
        if (!map.current) return;

        // Check if hovering over place markers (higher priority)
        const placeFeatures = map.current.queryRenderedFeatures(e.point, {
          layers: ['places-circles', 'trip-places-circles']
        });
        if (placeFeatures.length > 0) {
          // Reset hover highlight when over markers
          map.current.setFilter('country-fills-hover', ['==', 'iso_3166_1', '']);
          return;
        }
        map.current.getCanvas().style.cursor = 'pointer';

        // Highlight the hovered country
        if (e.features && e.features[0]) {
          const iso = e.features[0].properties?.iso_3166_1;
          if (iso) {
            map.current.setFilter('country-fills-hover', ['==', 'iso_3166_1', iso]);
          }
        }
      });
      map.current.on('mouseleave', 'country-fills', () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = '';
        map.current.setFilter('country-fills-hover', ['==', 'iso_3166_1', '']);
      });

      // Country click handler using fill layer - entire country surface is clickable
      map.current.on('click', 'country-fills', e => {
        if (!map.current || !onCountryClick) return;

        // Check if clicking on a place marker (higher priority)
        const placeFeatures = map.current.queryRenderedFeatures(e.point, {
          layers: ['places-circles', 'trip-places-circles']
        });
        if (placeFeatures.length > 0) {
          return; // Let place handler manage the click
        }
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];

        // Extract country name from properties
        const countryName = feature.properties?.name_en || feature.properties?.name || feature.properties?.name_fr || feature.properties?.iso_3166_1;
        if (countryName) {
          // Trigger sparkle effect at click position
          triggerSparkle(e.point.x, e.point.y);
          logger.log('🌍 Country clicked (fill layer):', {
            name: feature.properties?.name,
            name_en: feature.properties?.name_en,
            iso_3166_1: feature.properties?.iso_3166_1,
            selected: countryName
          });
          onCountryClick(countryName);
        } else {
          logger.warn('⚠️ Country feature found but no name property:', feature.properties);
        }
      });
      isMapReadyRef.current = true;

      // Execute pending fly-to if any
      if (pendingFlyTo.current) {
        const {
          lat,
          lng,
          zoom
        } = pendingFlyTo.current;
        handleFlyTo(lat, lng, zoom);
        pendingFlyTo.current = null;
      }
    });

    // Cleanup
    return () => {
      // Remove event listeners
      if (handleNavigateToPlaceRef.current) {
        window.removeEventListener('navigateToPlace', handleNavigateToPlaceRef.current);
      }
      if (handleAddToTripRef.current) {
        window.removeEventListener('addToTripFromGlobe', handleAddToTripRef.current);
      }
      if (handleRemoveFromTripRef.current) {
        window.removeEventListener('removeFromTripFromGlobe', handleRemoveFromTripRef.current);
      }
      if (handleOpenServicesRef.current) {
        window.removeEventListener('openServicesFromGlobe', handleOpenServicesRef.current);
      }
      
      // Clear timeout for end marker
      if (endMarkerTimeout.current) {
        clearTimeout(endMarkerTimeout.current);
        endMarkerTimeout.current = null;
      }

      // Remove all trip markers
      tripMarkers.current.forEach(marker => marker.remove());
      tripMarkers.current = [];

      // Remove trip markers
      if (tripStartMarker.current) {
        tripStartMarker.current.remove();
        tripStartMarker.current = null;
      }
      if (tripEndMarker.current) {
        tripEndMarker.current.remove();
        tripEndMarker.current = null;
      }

      // Remove user location marker
      if (userLocationMarker.current) {
        userLocationMarker.current.remove();
        userLocationMarker.current = null;
      }

      // Tear down spiritual overlay before the map itself
      if (spiritualOverlayRef.current) {
        try { spiritualOverlayRef.current.destroy(); } catch { /* map already gone */ }
        spiritualOverlayRef.current = null;
      }
      if (unescoOverlayRef.current) {
        try { unescoOverlayRef.current.destroy(); } catch { /* map already gone */ }
        unescoOverlayRef.current = null;
      }

      // Remove map
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      isMapReadyRef.current = false;
    };
  }, []);

  // Update data when filters, categoryFilter, or showMonuments change
  useEffect(() => {
    logger.log('🔄 Effect triggered - isMapReady:', isMapReadyRef.current, 'tripPlaces:', tripPlaces, 'categoryFilter:', categoryFilter);
    if (isMapReadyRef.current) {
      updateMapData();
      updateTripPlaces();
    }
  }, [filters, showMonuments, userProgress.visitedPlaces, tripPlaces, categoryFilter]);

  // === Saved Planner trip: hydrate from localStorage and listen for updates ===
  useEffect(() => {
    const renderSavedTrip = () => {
      if (!map.current || !isMapReadyRef.current) return;
      const routeSource = map.current.getSource('saved-trip-route') as mapboxgl.GeoJSONSource | undefined;
      const pointsSource = map.current.getSource('saved-trip-points') as mapboxgl.GeoJSONSource | undefined;
      if (!routeSource || !pointsSource) return;

      let coords: [number, number][] = [];
      let points: Array<{ lng: number; lat: number; name: string; isStart: boolean }> = [];
      try {
        const raw = localStorage.getItem('sacred-saved-trip');
        if (raw) {
          const parsed = JSON.parse(raw);
          const all = [parsed?.departure, ...(parsed?.destinations || [])].filter(Boolean);
          all.forEach((p: any, idx: number) => {
            if (typeof p?.lng === 'number' && typeof p?.lat === 'number') {
              coords.push([p.lng, p.lat]);
              points.push({ lng: p.lng, lat: p.lat, name: p.name || '', isStart: idx === 0 });
            }
          });
        }
      } catch {
        // ignore
      }

      routeSource.setData(
        coords.length > 1
          ? {
              type: 'Feature',
              geometry: { type: 'LineString', coordinates: coords },
              properties: {}
            } as any
          : { type: 'FeatureCollection', features: [] }
      );
      pointsSource.setData({
        type: 'FeatureCollection',
        features: points.map((p) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
          properties: { name: p.name, isStart: p.isStart }
        }))
      } as any);
    };

    // Initial render (poll briefly for map readiness)
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (isMapReadyRef.current) {
        renderSavedTrip();
        clearInterval(interval);
      } else if (attempts > 40) {
        clearInterval(interval);
      }
    }, 150);

    const onUpdate = () => renderSavedTrip();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'sacred-saved-trip') renderSavedTrip();
    };
    window.addEventListener('sacred-saved-trip-updated', onUpdate);
    window.addEventListener('storage', onStorage);
    return () => {
      clearInterval(interval);
      window.removeEventListener('sacred-saved-trip-updated', onUpdate);
      window.removeEventListener('storage', onStorage);
    };
  }, []);


  // Update location trail with activity-based colors
  useEffect(() => {
    if (!map.current || !map.current.getSource('location-trail')) return;

    // Group consecutive points by activity type
    const segments: Array<{
      coordinates: [number, number][];
      activityType: string;
    }> = [];
    let currentSegment: {
      coordinates: [number, number][];
      activityType: string;
    } | null = null;
    locationHistory.forEach(point => {
      const coord: [number, number] = [point.longitude, point.latitude];
      if (!currentSegment || currentSegment.activityType !== point.activity_type) {
        // Start new segment
        if (currentSegment && currentSegment.coordinates.length > 0) {
          // Add the first point of new segment to current segment for continuity
          currentSegment.coordinates.push(coord);
          segments.push(currentSegment);
        }
        currentSegment = {
          coordinates: [coord],
          activityType: point.activity_type
        };
      } else {
        // Continue current segment
        currentSegment.coordinates.push(coord);
      }
    });

    // Add the last segment
    if (currentSegment && currentSegment.coordinates.length > 0) {
      segments.push(currentSegment);
    }

    // Create a FeatureCollection with multiple LineStrings
    const features = segments.map(segment => ({
      type: 'Feature' as const,
      properties: {
        activityType: segment.activityType
      },
      geometry: {
        type: 'LineString' as const,
        coordinates: segment.coordinates
      }
    }));
    const source = map.current.getSource('location-trail') as mapboxgl.GeoJSONSource;
    source.setData({
      type: 'FeatureCollection',
      features
    });
  }, [locationHistory]);

  // Handle geolocation
  useEffect(() => {
    if (!map.current || !geolocationEnabled) {
      if (userLocationMarker.current) {
        userLocationMarker.current.remove();
        userLocationMarker.current = null;
      }
      try { spiritualOverlayRef.current?.setSelectionBeam(null); } catch { /* */ }
      hasInitiallyZoomed.current = false;
      pendingRecenter.current = false;
      return;
    }
    if (userPosition) {
      const {
        latitude,
        longitude
      } = userPosition;

      // User-location renders as a bright crystalline selection beam in the spiritual overlay
      try { spiritualOverlayRef.current?.setSelectionBeam([longitude, latitude]); } catch { /* */ }

      // IMPORTANT UX: Header toggle only enables location tracking.
      // Do NOT auto-zoom on first fix; zoom is reserved for the “Recentrer” button.
      if (!hasInitiallyZoomed.current) {
        hasInitiallyZoomed.current = true;
      }

      // If user explicitly requested recenter while we had no position yet, do it now
      if (pendingRecenter.current) {
        pendingRecenter.current = false;
        map.current.flyTo({
          center: [longitude, latitude],
          zoom: 12,
          duration: 2000
        });
      }
    }
    // Show geolocation error IMMEDIATELY when geolocation is enabled
    if (geolocationError && geolocationEnabled) {
      const errorMessage = geolocationError.code === 1 
        ? 'Permission de géolocalisation refusée' 
        : 'Erreur de localisation';
      toast.error(errorMessage, { duration: 5000 });
      pendingRecenter.current = false;
    }
  }, [userPosition, geolocationError, geolocationEnabled, t]);

  // FlyTo function
  const handleFlyTo = (lat: number, lng: number, zoom: number = 12, preserveView: boolean = false) => {
    if (map.current && isMapReadyRef.current) {
      setIsPaused(true);
      const flyToOptions: any = {
        center: [lng, lat],
        zoom: zoom,
        duration: 1000,
        // Réduit de 2000ms à 1000ms
        essential: true
      };

      // Ne réinitialiser pitch/bearing QUE si preserveView est false
      if (!preserveView) {
        flyToOptions.pitch = 0;
        flyToOptions.bearing = 0;
      }
      map.current.flyTo(flyToOptions);
    } else {
      pendingFlyTo.current = {
        lat,
        lng,
        zoom
      };
    }
  };

  // Recenter function - only zooms to position, button is disabled if geolocation is OFF
  const handleRecenter = () => {
    if (!geolocationEnabled) return; // Button is disabled, do nothing

    if (userPosition) {
      map.current?.flyTo({
        center: [userPosition.longitude, userPosition.latitude],
        zoom: 12,
        duration: 2000
      });
    } else {
      // Position not yet available, zoom when we get it
      pendingRecenter.current = true;
    }
  };

  // Expose functions via refs
  useEffect(() => {
    if (onFlyToRef) {
      onFlyToRef(handleFlyTo);
    }
  }, [onFlyToRef]);
  useEffect(() => {
    if (onRecenterRef) {
      onRecenterRef(handleRecenter);
    }
  }, [onRecenterRef]);
  useEffect(() => {
    if (onPausedChange) {
      onPausedChange(isPaused);
    }
  }, [isPaused, onPausedChange]);

  // Update globe settings dynamically when user changes preferences
  useEffect(() => {
    if (!map.current || !isMapReadyRef.current) return;
    
    const globeSettings = userProgress.globeSettings;
    if (!globeSettings) return;

    // Update map style if changed
    const newStyle = mapStyleUrls[globeSettings.mapStyle];
    const currentStyle = map.current.getStyle()?.sprite;
    
    // Only change style if it's actually different (check by mapStyle key, not full URL)
    // We save the current style key in a data attribute to track
    const currentStyleKey = (map.current as any)._currentStyleKey;
    if (currentStyleKey !== globeSettings.mapStyle) {
      logger.log('🎨 Changing map style to:', globeSettings.mapStyle);
      (map.current as any)._currentStyleKey = globeSettings.mapStyle;
      
      // We need to preserve layers/sources, so we listen for style.load
      const onStyleLoad = () => {
        if (!map.current) return;
        
        // Reapply atmosphere
        const atmosphereConfig = atmospherePresets[globeSettings.atmosphere];
        const starIntensity = globeSettings.starIntensity * atmosphereConfig.starIntensityMultiplier;
        
        map.current.setFog({
          color: atmosphereConfig.fogColor,
          'high-color': atmosphereConfig.highColor,
          'horizon-blend': 0.02,
          'space-color': atmosphereConfig.spaceColor,
          'star-intensity': Math.min(starIntensity, 1)
        });
        
        map.current.off('style.load', onStyleLoad);
      };
      
      map.current.on('style.load', onStyleLoad);
      map.current.setStyle(newStyle);
    } else {
      // Just update atmosphere without changing style
      const atmosphereConfig = atmospherePresets[globeSettings.atmosphere];
      const starIntensity = globeSettings.starIntensity * atmosphereConfig.starIntensityMultiplier;
      
      map.current.setFog({
        color: atmosphereConfig.fogColor,
        'high-color': atmosphereConfig.highColor,
        'horizon-blend': 0.02,
        'space-color': atmosphereConfig.spaceColor,
        'star-intensity': Math.min(starIntensity, 1)
      });
    }
  }, [userProgress.globeSettings?.mapStyle, userProgress.globeSettings?.atmosphere, userProgress.globeSettings?.starIntensity]);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      setSelectedIndex(-1);
      return;
    }
    const term = normalize(searchTerm);
    const results = allPlacesRef.current.filter(place => {
      const placeName = normalize(place.name);
      const placeCountry = normalize(place.country);
      const placeType = normalize(place.type);
      return placeName.includes(term) || placeCountry.includes(term) || placeType.includes(term);
    }).slice(0, 8); // Limit to 8 results

    setSearchResults(results);
    setShowSearchResults(results.length > 0);
    setSelectedIndex(-1); // Reset selection when results change
    searchResultRefs.current = []; // Reset refs array
  }, [searchTerm]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && searchResultRefs.current[selectedIndex]) {
      searchResultRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [selectedIndex]);
  const handleSearchSelect = (place: any) => {
    const coords = sanitizeCoordinates(place.coordinates, place.id);
    if (coords) {
      handleFlyTo(coords[1], coords[0], 12);
      setSearchTerm('');
      setShowSearchResults(false);
      setSelectedIndex(-1);
      setShowMonuments(true);

      // Highlight the selected place by temporarily filtering to show only it
      setTimeout(() => {
        if (map.current && isMapReadyRef.current) {
          const source = map.current.getSource('places') as mapboxgl.GeoJSONSource;
          if (source) {
            const feature: PlaceFeature = {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: coords
              },
              properties: {
                id: place.id,
                name: place.name,
                type: place.type,
                country: place.country,
                points: place.points,
                religion: place.religion || inferReligionFromPlace(place.type, place.name),
                description: place.description,
                imageUrl: place.imageUrl,
                isVisited: userProgress.visitedPlaces.includes(place.id)
              }
            };

            // Show only this place temporarily
            source.setData({
              type: 'FeatureCollection',
              features: [feature]
            });

            // Click on it to show popup
            setTimeout(() => {
              const features = map.current?.queryRenderedFeatures(undefined, {
                layers: ['places-circles']
              });
              if (features && features.length > 0) {
                const clickEvent = {
                  features: [features[0]],
                  preventDefault: () => {}
                };
                map.current?.fire('click', clickEvent as any);
              }
            }, 500);
          }
        }
      }, 2000);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSearchResults || searchResults.length === 0) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => prev < searchResults.length - 1 ? prev + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : searchResults.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleSearchSelect(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSearchResults(false);
        setSelectedIndex(-1);
        searchInputRef.current?.blur();
        break;
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    if (newFilters.religions.length > 0 || newFilters.types.length > 0) {
      setShowMonuments(true);
    }
  };
  const handleToggleTracking = () => {
    if (isRecording) {
      stopRecording();
    } else {
      if (!geolocationEnabled) {
        toggleGeolocation();
      }
      startRecording();
    }
  };
  const handleClearHistory = () => {
    clearHistory();
    setShowClearDialog(false);
  };
  return <div className="relative w-full overflow-hidden" style={{
    height: '70vh',
    minHeight: '500px'
  }}>
      {/* Loading overlay */}
      {isMapLoading && !mapError && <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Chargement du globe...</p>
          </div>
        </div>}
      
      {/* Error state */}
      {mapError && <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-20">
          <div className="text-center p-6">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Impossible de charger la carte</h3>
            <p className="text-sm text-muted-foreground mb-4">{mapError}</p>
            <Button onClick={() => {
          if (!map.current) {
            window.location.reload();
            return;
          }

          // Reset error state and try reloading the style
          setMapError(null);
          setIsMapLoading(true);
          logger.log('🔄 Attempting to reload map style...');
          try {
            // First try satellite-streets again
            map.current.setStyle('mapbox://styles/mapbox/satellite-streets-v12');

            // If satellite fails, the error handler will catch it
            // and we can fallback to streets
            const fallbackTimeout = setTimeout(() => {
              if (map.current && !map.current.isStyleLoaded()) {
                logger.log('🔄 Satellite style failed, trying streets fallback...');
                map.current.setStyle('mapbox://styles/mapbox/streets-v12');
              }
            }, 3000);

            // Clear timeout once style loads
            const cleanup = () => {
              clearTimeout(fallbackTimeout);
              map.current?.off('style.load', cleanup);
            };
            map.current.once('style.load', cleanup);
          } catch (err) {
            logger.error('❌ Style reload failed:', err);
            setMapError('Échec du rechargement. Veuillez réessayer.');
            setIsMapLoading(false);
          }
        }}>Recharger</Button>
          </div>
        </div>}
      
      {/* Map container */}
      <div ref={mapContainer} className="absolute inset-0" style={{
      width: '100%',
      height: '100%',
      // Mute the saturated satellite greens; gives a more painterly Earth tone.
      filter: 'saturate(0.78) contrast(1.05) brightness(0.96) hue-rotate(-4deg)',
    }} />
      
      {/* Search bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-4">
        <div className="relative">
          <div className="relative">
            
            
            {searchTerm && <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => {
            setSearchTerm('');
            setShowSearchResults(false);
            setSelectedIndex(-1);
          }}>
                <X className="h-4 w-4" />
              </Button>}
          </div>
          
          {/* Search results dropdown */}
          {showSearchResults && searchResults.length > 0 && <div className="absolute top-full mt-2 w-full bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-xl overflow-hidden">
              <ScrollArea className="max-h-[400px]">
                <div className="p-2">
                  {searchResults.map((place, index) => {
                const religion = (place.religion || inferReligionFromPlace(place.type, place.name)) as keyof typeof religionColors;
                const isVisited = userProgress.visitedPlaces.includes(place.id);
                const isSelected = index === selectedIndex;
                return <button key={place.id} ref={el => searchResultRefs.current[index] = el} onClick={() => handleSearchSelect(place)} onMouseEnter={() => setSelectedIndex(index)} className={cn("w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left", isSelected ? "bg-accent" : "hover:bg-accent/50")}>
                        <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-cover bg-center" style={{
                    backgroundImage: place.imageUrl ? `url(${getImageUrl(place.imageUrl)})` : 'url(/placeholder.svg)'
                  }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm text-foreground truncate">
                              {place.name}
                            </h4>
                            {isVisited && <span className="text-xs text-green-500 flex-shrink-0">✓</span>}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {place.type} • {place.country}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{
                        backgroundColor: religionColors[religion]?.marker || religionColors.traditional.marker
                      }} />
                            <span className="text-xs text-muted-foreground">
                              {place.points} points
                            </span>
                          </div>
                        </div>
                      </button>;
              })}
                </div>
              </ScrollArea>
            </div>}
        </div>
      </div>
      
      {/* Control buttons - top right */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {/* Fullscreen toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary" size="icon" onClick={() => {
              const newState = !isFullscreen;
              setIsFullscreen(newState);
              onFullscreenChange?.(newState);
            }} className="rounded-full shadow-lg h-9 w-9">
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFullscreen ? 'Quitter plein écran' : 'Plein écran'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Geolocation recenter button - disabled if geolocation is OFF */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="secondary" 
                size="icon" 
                onClick={handleRecenter} 
                disabled={!geolocationEnabled}
                className={cn(
                  "rounded-full shadow-lg h-9 w-9",
                  !geolocationEnabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <Locate className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{geolocationEnabled ? 'Recentrer sur ma position' : 'Activez la géolocalisation d\'abord'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Clear history button */}
        {locationHistory.length > 0 && <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" size="icon" onClick={() => setShowClearDialog(true)} className="rounded-full shadow-lg h-9 w-9">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Effacer l'historique</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>}

        {/* Activity legend */}
        {locationHistory.length > 0 && isRecording && <div className="bg-background/80 backdrop-blur-sm border border-border rounded-lg shadow-lg p-2 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-foreground text-[10px]">Marche</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-foreground text-[10px]">Vélo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-foreground text-[10px]">Transport</span>
              </div>
            </div>
          </div>}
      </div>

      {/* Monument filter */}
      {filterControlContainer ? createPortal(<MonumentFilter onFilterChange={handleFilterChange} externalFilters={filters} />, filterControlContainer) :
    // Fallback overlay if control not yet mounted
    <div className="absolute top-4 left-4 z-[200]">
            <MonumentFilter onFilterChange={handleFilterChange} externalFilters={filters} />
        </div>}

      {/* Clear history confirmation dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Effacer l'historique ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement tous les {locationHistory.length} points
              enregistrés de votre parcours. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearHistory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};
export default Globe3D;