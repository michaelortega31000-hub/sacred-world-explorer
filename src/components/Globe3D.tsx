import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Calendar, Locate } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getImageUrl } from '@/lib/imageHelper';
import { useApp } from '@/contexts/AppContext';
import { religionColors } from '@/config/religionColors';
import { inferReligionFromPlace } from '@/lib/religionHelper';
import MonumentFilter, { FilterOptions } from '@/components/MonumentFilter';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast } from 'sonner';
import { getMapboxToken } from '@/lib/mapboxHelper';
import type { Religion } from '@/contexts/AppContext';

interface Globe3DProps {
  onCountryClick?: (countryName: string) => void;
  onRecenterRef?: (fn: () => void) => void;
  onFlyToRef?: (fn: (lat: number, lng: number, zoom?: number) => void) => void;
  onPausedChange?: (paused: boolean) => void;
  tripPlaces?: string[];
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
  tripPlaces = []
}: Globe3DProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userLocationMarker = useRef<mapboxgl.Marker | null>(null);
  const currentPopup = useRef<mapboxgl.Popup | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userProgress } = useApp();
  
  const [showMonuments, setShowMonuments] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    religions: [],
    types: []
  });
  const [filteredCount, setFilteredCount] = useState<number>(0);
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);
  const { position: userPosition, error: geolocationError } = useGeolocation(geolocationEnabled);
  
  const isMapReadyRef = useRef(false);
  const allPlacesRef = useRef<any[]>([]);
  const pendingFlyTo = useRef<{ lat: number; lng: number; zoom: number } | null>(null);

  // Normalize string helper
  const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

  // Sanitize coordinates: ensure [lng, lat] format and valid ranges
  const sanitizeCoordinates = (coords: [number, number], placeId: string): [number, number] | null => {
    let [first, second] = coords;
    
    // Swap if needed (detect lat/lng order)
    if (Math.abs(first) > 90 && Math.abs(second) <= 90) {
      [first, second] = [second, first];
    }
    
    // Validate
    if (isNaN(first) || isNaN(second) || Math.abs(second) > 90 || Math.abs(first) > 180) {
      console.warn(`⚠️ Invalid coordinates for ${placeId}:`, coords);
      return null;
    }
    
    return [first, second]; // [lng, lat]
  };

  // Build FeatureCollection from places with filters
  const buildFeatureCollection = (places: any[], activeFilters: FilterOptions): PlacesCollection => {
    const features: PlaceFeature[] = [];
    
    places.forEach(place => {
      const coords = sanitizeCoordinates(place.coordinates, place.id);
      if (!coords) return;
      
      const religion = (place.religion || inferReligionFromPlace(place.type, place.name)) as string;
      const isVisited = userProgress.visitedPlaces.includes(place.id);
      
      // Apply filters
      const matchesReligion = activeFilters.religions.length === 0 || 
        activeFilters.religions.includes(religion as Religion);
      
      const normalizedType = normalize(place.type);
      const textBlob = normalize(`${place.name} ${place.description || ''} ${place.type}`);
      const matchesType = activeFilters.types.length === 0 || 
        activeFilters.types.some(t => {
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

  // Update map source with filtered data
  const updateMapData = () => {
    if (!map.current || !isMapReadyRef.current) return;
    
    if (!showMonuments) {
      // Clear data
      const source = map.current.getSource('places') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({ type: 'FeatureCollection', features: [] });
      }
      setFilteredCount(0);
      return;
    }
    
    const collection = buildFeatureCollection(allPlacesRef.current, filters);
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
      
      console.log('🗺️ Map updated:', {
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
            padding: { top: 80, bottom: 80, left: 80, right: 80 },
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
    mapboxgl.accessToken = token;

    if (!mapboxgl.supported()) {
      toast.error("WebGL n'est pas supporté par votre navigateur");
      return;
    }

    // Create map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      projection: { name: 'globe' },
      center: [15, 30],
      zoom: 1.8,
      pitch: 0,
      bearing: 0
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      'top-right'
    );

    // Disable scroll zoom for better UX
    map.current.scrollZoom.disable();

    // Wait for style to load
    map.current.on('style.load', async () => {
      if (!map.current) return;

      // Add atmosphere
      map.current.setFog({
        color: 'rgb(186, 210, 235)',
        'high-color': 'rgb(36, 92, 223)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(11, 11, 25)',
        'star-intensity': 0.6
      });

      // Load places data
      const { mockPlaces } = await import('@/data/placesData');
      allPlacesRef.current = mockPlaces;
      
      console.log('📦 Loaded places:', mockPlaces.length);
      console.log('📦 Sample places:', mockPlaces.slice(0, 5).map(p => ({
        id: p.id,
        name: p.name,
        coords: p.coordinates,
        religion: p.religion || inferReligionFromPlace(p.type, p.name)
      })));

      // Add empty GeoJSON source
      map.current.addSource('places', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      // Add circle layer with religion-based colors
      map.current.addLayer({
        id: 'places-circles',
        type: 'circle',
        source: 'places',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'points'],
            0, 4,
            50, 6,
            100, 8,
            150, 10
          ],
          'circle-color': [
            'match',
            ['get', 'religion'],
            'christianity', religionColors.christianity.marker,
            'islam', religionColors.islam.marker,
            'judaism', religionColors.judaism.marker,
            'buddhism', religionColors.buddhism.marker,
            'hinduism', religionColors.hinduism.marker,
            'astronomy', religionColors.astronomy.marker,
            'traditional', religionColors.traditional.marker,
            'atheism', religionColors.atheism.marker,
            religionColors.traditional.marker
          ],
          'circle-stroke-color': [
            'case',
            ['get', 'isVisited'],
            '#F4C542',
            '#ffffff'
          ],
          'circle-stroke-width': 2,
          'circle-opacity': 0.9,
          'circle-stroke-opacity': 1
        }
      });

      // Add hover effect
      map.current.on('mouseenter', 'places-circles', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'places-circles', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });

      // Add click handler for popups
      map.current.on('click', 'places-circles', (e) => {
        if (!e.features || e.features.length === 0) return;
        
        const feature = e.features[0];
        const props = feature.properties as PlaceFeature['properties'];
        const coords = (feature.geometry as any).coordinates as [number, number];
        
        // Close existing popup
        if (currentPopup.current) {
          currentPopup.current.remove();
        }
        
        const imageUrl = props.imageUrl ? getImageUrl(props.imageUrl) : '/placeholder.svg';
        
        const popup = new mapboxgl.Popup({
          offset: 15,
          maxWidth: '320px',
          className: 'sacred-popup'
        })
          .setLngLat(coords)
          .setHTML(`
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
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 13px; font-weight: 600; color: #F4C542;">✨ ${props.points} points</span>
                ${props.isVisited ? '<span style="font-size: 12px; color: #34E0A1;">✓ Visité</span>' : ''}
              </div>
            </div>
          `)
          .addTo(map.current!);
        
        currentPopup.current = popup;
      });

      // Listen for navigation events from popup
      window.addEventListener('navigateToPlace', ((e: CustomEvent) => {
        navigate(`/place/${e.detail}`);
      }) as EventListener);

      isMapReadyRef.current = true;
      
      // Execute pending fly-to if any
      if (pendingFlyTo.current) {
        const { lat, lng, zoom } = pendingFlyTo.current;
        handleFlyTo(lat, lng, zoom);
        pendingFlyTo.current = null;
      }
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      isMapReadyRef.current = false;
    };
  }, []);

  // Update data when filters or showMonuments change
  useEffect(() => {
    if (isMapReadyRef.current) {
      updateMapData();
    }
  }, [filters, showMonuments, userProgress.visitedPlaces]);

  // Handle geolocation
  useEffect(() => {
    if (!map.current || !geolocationEnabled) {
      if (userLocationMarker.current) {
        userLocationMarker.current.remove();
        userLocationMarker.current = null;
      }
      return;
    }

    if (userPosition) {
      const { latitude, longitude } = userPosition;
      
      if (!userLocationMarker.current) {
        const el = document.createElement('div');
        el.className = 'user-location-marker';
        el.style.cssText = `
          width: 20px;
          height: 20px;
          background: #34E0A1;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(52, 224, 161, 0.8);
        `;
        
        userLocationMarker.current = new mapboxgl.Marker({ element: el })
          .setLngLat([longitude, latitude])
          .addTo(map.current);
      } else {
        userLocationMarker.current.setLngLat([longitude, latitude]);
      }
      
      map.current.flyTo({
        center: [longitude, latitude],
        zoom: 12,
        duration: 2000
      });
      
      toast.success(t('location.enabled'));
    }

    if (geolocationError) {
      toast.error(t('location.error'));
      setGeolocationEnabled(false);
    }
  }, [userPosition, geolocationError, geolocationEnabled]);

  // FlyTo function
  const handleFlyTo = (lat: number, lng: number, zoom: number = 12) => {
    if (map.current && isMapReadyRef.current) {
      setIsPaused(true);
      map.current.flyTo({
        center: [lng, lat],
        zoom: zoom,
        pitch: 0,
        bearing: 0,
        duration: 2000,
        essential: true
      });
    } else {
      pendingFlyTo.current = { lat, lng, zoom };
    }
  };

  // Recenter function
  const handleRecenter = () => {
    setGeolocationEnabled(!geolocationEnabled);
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

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    if (newFilters.religions.length > 0 || newFilters.types.length > 0) {
      setShowMonuments(true);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Map container */}
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Geolocation button */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={geolocationEnabled ? "default" : "secondary"}
                size="icon"
                onClick={handleRecenter}
                className="rounded-full shadow-lg"
              >
                <Locate className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{geolocationEnabled ? t('location.disable') : t('location.enable')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => navigate('/calendar')}
                className="rounded-full shadow-lg"
              >
                <Calendar className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('navigation.calendar')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Monument filter */}
      <div className="absolute bottom-4 left-4 z-10">
        <MonumentFilter
          onFilterChange={handleFilterChange}
          externalFilters={filters}
          matchingCount={showMonuments ? filteredCount : undefined}
        />
      </div>
    </div>
  );
};

export default Globe3D;
