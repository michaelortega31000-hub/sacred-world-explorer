import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Locate, Search, X, Loader2, AlertCircle } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
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
  const {
    t
  } = useTranslation();
  const {
    userProgress
  } = useApp();
  const [showMonuments, setShowMonuments] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    religions: [],
    types: []
  });
  const [filteredCount, setFilteredCount] = useState<number>(0);
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);
  const {
    position: userPosition,
    error: geolocationError
  } = useGeolocation(geolocationEnabled);
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

  // Update map source with filtered data
  const updateMapData = () => {
    if (!map.current || !isMapReadyRef.current) return;

    // Only show monuments when filters are active
    const hasActiveFilters = filters.religions.length > 0 || filters.types.length > 0;
    if (!showMonuments || !hasActiveFilters) {
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
    console.log('🗺️ Initializing Mapbox with token:', token.substring(0, 20) + '...');
    mapboxgl.accessToken = token;
    if (!mapboxgl.supported()) {
      const error = "WebGL n'est pas supporté par votre navigateur";
      setMapError(error);
      setIsMapLoading(false);
      toast.error(error);
      return;
    }
    try {
      // Create map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        projection: {
          name: 'globe'
        },
        center: [15, 30],
        zoom: 1.8,
        pitch: 0,
        bearing: 0
      });
    } catch (error) {
      console.error('❌ Map initialization error:', error);
      setMapError('Échec de l\'initialisation de la carte: ' + (error as Error).message);
      setIsMapLoading(false);
      return;
    }

    // Enable zoom controls for desktop and mobile
    map.current.scrollZoom.enable(); // Mouse wheel zoom for desktop
    map.current.touchZoomRotate.enable(); // Touch gestures for mobile/tablet
    map.current.doubleClickZoom.enable(); // Double-click zoom
    map.current.boxZoom.enable(); // Shift + drag to zoom

    // Map error handler
    map.current.on('error', e => {
      console.error('❌ Map error:', e);
      setMapError('Échec du chargement de la carte. Vérifiez votre connexion.');
      setIsMapLoading(false);
    });

    // Wait for style to load
    map.current.on('style.load', async () => {
      if (!map.current) return;
      console.log('✅ Map style loaded successfully');
      setIsMapLoading(false);

      // Add React control for MonumentFilter with responsive positioning
      try {
        const isMobile = window.innerWidth < 640;
        const position = isMobile ? 'top-left' : 'bottom-left';
        class ReactControl {
          _container!: HTMLDivElement;
          onAdd() {
            this._container = document.createElement('div');
            this._container.className = 'mapboxgl-ctrl monument-filter-control pointer-events-auto relative';
            this._container.style.marginLeft = '8px';

            // Responsive spacing
            if (position === 'bottom-left') {
              this._container.style.marginBottom = 'calc(env(safe-area-inset-bottom, 0px) + 76px)';
            } else {
              this._container.style.marginTop = '8px';
            }
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
        console.warn('Failed to add filter control', e);
      }

      // Add atmosphere
      map.current.setFog({
        color: 'rgb(186, 210, 235)',
        'high-color': 'rgb(36, 92, 223)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(11, 11, 25)',
        'star-intensity': 0.6
      });

      // Load places data
      const {
        mockPlaces
      } = await import('@/data/placesData');
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
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

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

      // Add hover effect
      map.current.on('mouseenter', 'places-circles', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'places-circles', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
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
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 13px; font-weight: 600; color: #F4C542;">✨ ${props.points} points</span>
                ${props.isVisited ? '<span style="font-size: 12px; color: #34E0A1;">✓ Visité</span>' : ''}
              </div>
            </div>
          `).addTo(map.current!);
        currentPopup.current = popup;
      });

      // Listen for navigation events from popup
      window.addEventListener('navigateToPlace', ((e: CustomEvent) => {
        navigate(`/place/${e.detail}`);
      }) as EventListener);
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
      const {
        latitude,
        longitude
      } = userPosition;
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
        userLocationMarker.current = new mapboxgl.Marker({
          element: el
        }).setLngLat([longitude, latitude]).addTo(map.current);
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
      pendingFlyTo.current = {
        lat,
        lng,
        zoom
      };
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
            <Button onClick={() => window.location.reload()}>Recharger</Button>
          </div>
        </div>}
      
      {/* Map container */}
      <div ref={mapContainer} className="absolute inset-0" style={{
      width: '100%',
      height: '100%'
    }} />
      
      {/* Search bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-4">
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            
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
      
      {/* Geolocation button */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={geolocationEnabled ? "default" : "secondary"} size="icon" onClick={handleRecenter} className="rounded-full shadow-lg">
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
              
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('navigation.calendar')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Monument filter */}
      {filterControlContainer ? createPortal(<MonumentFilter onFilterChange={handleFilterChange} externalFilters={filters} />, filterControlContainer) :
    // Fallback overlay if control not yet mounted
    <div className="absolute inset-0 pointer-events-none flex items-start sm:items-end justify-start p-3 sm:p-4 z-[200]">
          <div className="pointer-events-auto">
            <MonumentFilter onFilterChange={handleFilterChange} externalFilters={filters} />
          </div>
        </div>}
    </div>;
};
export default Globe3D;