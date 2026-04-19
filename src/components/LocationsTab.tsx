import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Search, Calendar, Globe2, Route, Navigation, ArrowRight, Utensils, Star, Phone, ExternalLink, Hotel, Filter, Plus, X, Info, Car, Bike, PersonStanding, Download, RotateCcw, Building2, Church, Train, Plane, TrainFront, Bus, Footprints, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllContinents, getCountriesByContinent, getCitiesByCountry, getContinent } from '@/data/placesData';
import { usePlaces } from '@/hooks/usePlaces';
import { useApp } from '@/contexts/AppContext';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getImageUrl } from '@/lib/imageHelper';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import PlaceCategoryFilter, { type PlaceCategoryFilterValue } from '@/components/PlaceCategoryFilter';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import type { SavedPOI, PlaceCategory } from '@/contexts/AppContext';
import jsPDF from 'jspdf';
import { getCitySearchTerms, citiesMatch } from '@/lib/cityNormalization';
import { calculateDistanceInKm } from '@/lib/geoUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { logger } from '@/lib/logger';

// ---- Transitous MOTIS 2 routing (free, no key) ----
async function fetchTransitousRoute(
  from: [number, number], // [lng, lat]
  to: [number, number],
  transitModes: Array<'plane' | 'train' | 'bus' | 'metro'>
): Promise<{ distanceKm: number; durationMin: number; transfers: number } | null> {
  try {
    const tokenMap: Record<'plane' | 'train' | 'bus' | 'metro', string> = {
      plane: 'AIRPLANE',
      train: 'RAIL',
      bus: 'BUS',
      metro: 'SUBWAY',
    };
    const tokens = Array.from(new Set(transitModes.map((m) => tokenMap[m])));
    if (tokens.length === 0) return null;
    const modeStr = [...tokens, 'WALK'].join(',');
    const params = new URLSearchParams({
      fromPlace: `${from[1]},${from[0]}`,
      toPlace: `${to[1]},${to[0]}`,
      time: new Date().toISOString(),
      arriveBy: 'false',
      mode: modeStr,
    });
    const url = `https://api.transitous.org/api/v1/plan?${params.toString()}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    const itin = data?.itineraries?.[0] ?? data?.plan?.itineraries?.[0];
    if (!itin) return null;
    const legs: any[] = itin.legs || [];
    const distanceM = legs.reduce((sum, l) => sum + (Number(l.distance) || 0), 0);
    const durationSec = Number(itin.duration) || legs.reduce((s, l) => s + (Number(l.duration) || 0), 0);
    if (!distanceM || !durationSec) return null;
    const transitLegs = legs.filter((l) => (l.mode || '').toUpperCase() !== 'WALK');
    const transfers = Math.max(0, transitLegs.length - 1);
    return { distanceKm: distanceM / 1000, durationMin: durationSec / 60, transfers };
  } catch (err) {
    logger.warn('Transitous route fetch failed', err);
    return null;
  }
}
interface SavedRestaurant {
  id: string;
  name: string;
  type: string[];
  cuisine: string;
  address: string;
  city: string;
  country: string;
  phone?: string;
  rating: number;
  website?: string;
  description: string;
}
interface RouteSegment {
  distance: number; // in kilometers
  duration: number; // in minutes
  transfers?: number; // number of transit transfers (train/bus)
}
interface POI {
  id: string;
  name: string;
  type: 'restaurant' | 'lodging' | 'transport';
  address: string;
  coordinates: [number, number];
  segmentIndex: number; // index of the place this POI is near
  placeId: string; // ID of the associated place
  distanceFromPlace?: number; // distance in km from the sacred place
}
const LocationsTab = () => {
  const navigate = useNavigate();
  const {
    userProgress,
    updatePlannedRoute,
    savePOI,
    removePOI,
    getPOIsForPlace,
    addToTrip,
    removeFromTrip,
    reorderTrip
  } = useApp();
  const {
    data: allPlaces = [],
    isLoading: isLoadingPlaces
  } = usePlaces();
  const {
    t
  } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [placeCategory, setPlaceCategory] = useState<PlaceCategoryFilterValue>('all');
  const [savedRestaurants, setSavedRestaurants] = useState<SavedRestaurant[]>([]);
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);
  const [loadingRouteInfo, setLoadingRouteInfo] = useState(false);
  const [pois, setPois] = useState<POI[]>([]);
  const [loadingPOIs, setLoadingPOIs] = useState(false);
  const [selectedPOITypes, setSelectedPOITypes] = useState<Set<'restaurant' | 'lodging' | 'transport'>>(new Set(['restaurant', 'lodging', 'transport']));
  const [expandedPlaceId, setExpandedPlaceId] = useState<string | null>(null);
  type TransportMode = 'plane' | 'train' | 'bus' | 'metro' | 'driving' | 'cycling' | 'walking';
  const [selectedModes, setSelectedModes] = useState<TransportMode[]>(['driving']);
  const transportLabel = (m: TransportMode) =>
    m === 'plane' ? 'Avion' : m === 'train' ? 'Train' : m === 'bus' ? 'Bus' : m === 'metro' ? 'Métro' :
    m === 'driving' ? 'Voiture' : m === 'cycling' ? 'Vélo' : 'Marche';
  const transportIcon = (m: TransportMode) => {
    switch (m) {
      case 'plane': return Plane;
      case 'train': return TrainFront;
      case 'bus': return Bus;
      case 'metro': return Train;
      case 'driving': return Car;
      case 'cycling': return Bike;
      case 'walking': return Footprints;
    }
  };
  const ALL_MODES: TransportMode[] = ['plane', 'train', 'bus', 'driving', 'metro', 'cycling', 'walking'];
  const TRANSIT_MODES: TransportMode[] = ['plane', 'train', 'bus', 'metro'];

  // Toggle a mode in/out of selection. Guard: never empty.
  const toggleMode = (mode: TransportMode) => {
    setSelectedModes((prev) => {
      if (prev.includes(mode)) {
        if (prev.length === 1) return prev; // keep at least one
        return prev.filter((m) => m !== mode);
      }
      return [...prev, mode];
    });
  };
  const selectedLabel = () => selectedModes.map(transportLabel).join(' + ');
  const [captureMapFn, setCaptureMapFn] = useState<(() => string | null) | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [optimizedRouteState, setOptimizedRouteState] = useState<typeof plannedPlaces>([]);
  const startingCity = userProgress.plannedRouteStartCity;
  const showOptimizedRoute = userProgress.showPlannedRoute;
  const setStartingCity = (city: string) => {
    updatePlannedRoute(city, userProgress.showPlannedRoute);
  };
  const setShowOptimizedRoute = (show: boolean) => {
    updatePlannedRoute(userProgress.plannedRouteStartCity, show);
  };
  const togglePOIType = (type: 'restaurant' | 'lodging' | 'transport') => {
    setSelectedPOITypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };
  const handleSavePOI = (poi: POI, placeId: string) => {
    const savedPOI: SavedPOI = {
      ...poi,
      placeId
    };
    savePOI(savedPOI);
  };
  const isPOISaved = (poiId: string): boolean => {
    return userProgress.savedPOIs.some(p => p.id === poiId);
  };
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }
    const newRoute = [...optimizedRouteState];
    const [draggedItem] = newRoute.splice(draggedIndex, 1);
    newRoute.splice(dropIndex, 0, draggedItem);
    setOptimizedRouteState(newRoute);
    setDraggedIndex(null);

    // Sync reordered route to context so Globe3D updates
    reorderTrip(newRoute.map(p => p.id));

    // Recalculate segments with new order
    calculateRouteSegments(newRoute);
  };
  const handleDragEnd = () => {
    setDraggedIndex(null);
  };
  const resetToOptimizedOrder = () => {
    setOptimizedRouteState([]);
  };
  const applyThemedRoute = (placeIds: string[]) => {
    // Clear current trip
    userProgress.tripPlaces?.forEach(placeId => {
      removeFromTrip(placeId);
    });

    // Add all places from themed route
    placeIds.forEach(placeId => {
      addToTrip(placeId);
    });

    // Set starting city if places available
    const firstPlace = allPlaces.find(p => p.id === placeIds[0]);
    if (firstPlace) {
      setStartingCity(`${firstPlace.city}, ${firstPlace.country}`);
      setShowOptimizedRoute(true);
    }
  };

  // Export route to PDF
  const exportToPDF = async () => {
    if (optimizedRoute.length === 0) return;
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Title
    pdf.setFontSize(20);
    pdf.setTextColor(52, 224, 161);
    pdf.text('Mon Itinéraire Sacré', pageWidth / 2, yPosition, {
      align: 'center'
    });
    yPosition += 15;

    // General info
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Ville de départ: ${startingCity}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Modes autorisés: ${selectedLabel()}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Nombre d'étapes: ${optimizedRoute.length}`, 20, yPosition);
    yPosition += 10;

    // Totals
    if (routeSegments.length > 0) {
      const totalDistance = routeSegments.reduce((sum, seg) => sum + seg.distance, 0);
      const totalMinutes = routeSegments.reduce((sum, seg) => sum + seg.duration, 0);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = Math.round(totalMinutes % 60);
      pdf.setTextColor(52, 224, 161);
      pdf.text(`Distance totale: ${totalDistance.toFixed(1)} km`, 20, yPosition);
      yPosition += 7;
      pdf.text(`Durée totale: ${hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`}`, 20, yPosition);
      yPosition += 12;
    }

    // Try to capture map
    if (captureMapFn) {
      try {
        const mapImageData = captureMapFn();
        if (mapImageData) {
          const mapWidth = pageWidth - 40;
          const mapHeight = 100;
          pdf.addImage(mapImageData, 'PNG', 20, yPosition, mapWidth, mapHeight);
          yPosition += mapHeight + 10;
        }
      } catch (error) {
        console.error('Error capturing map:', error);
      }
    }

    // Add new page for places list
    pdf.addPage();
    yPosition = 20;

    // Places list
    pdf.setFontSize(16);
    pdf.setTextColor(52, 224, 161);
    pdf.text('Détails de l\'itinéraire', 20, yPosition);
    yPosition += 12;
    optimizedRoute.forEach((place, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont(undefined, 'bold');
      pdf.text(`${index + 1}. ${place.name}`, 20, yPosition);
      yPosition += 6;
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(80, 80, 80);
      pdf.text(`${place.city}, ${place.country}`, 25, yPosition);
      yPosition += 5;

      // Description (truncated)
      const description = place.description.length > 100 ? place.description.substring(0, 100) + '...' : place.description;
      const descLines = pdf.splitTextToSize(description, pageWidth - 50);
      pdf.text(descLines, 25, yPosition);
      yPosition += descLines.length * 5;

      // Saved POIs for this place
      const placePOIs = getPOIsForPlace(place.id);
      if (placePOIs.length > 0) {
        yPosition += 3;
        pdf.setFontSize(9);
        pdf.setTextColor(52, 224, 161);
        pdf.text('Points d\'arrêt sauvegardés:', 25, yPosition);
        yPosition += 4;
        placePOIs.forEach(poi => {
          if (yPosition > pageHeight - 30) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.setTextColor(0, 0, 0);
          const poiTypeIcon = poi.type === 'restaurant' ? '🍴' : poi.type === 'lodging' ? '🏨' : '⛽';
          pdf.text(`  ${poiTypeIcon} ${poi.name}`, 30, yPosition);
          yPosition += 4;
        });
        yPosition += 2;
      }

      // Segment info (distance and duration to next place)
      const segment = routeSegments[index];
      if (index < optimizedRoute.length - 1 && segment) {
        yPosition += 2;
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        const duration = segment.duration < 60 ? `${Math.round(segment.duration)} min` : `${Math.floor(segment.duration / 60)}h ${Math.round(segment.duration % 60)}min`;
        pdf.text(`➜ ${segment.distance.toFixed(1)} km - ${duration}`, 25, yPosition);
        yPosition += 8;
      } else {
        yPosition += 6;
      }
    });

    // Save the PDF
    pdf.save(`itineraire-sacre-${startingCity?.split(',')[0] || 'voyage'}.pdf`);
  };

  // Compute a single segment between two places using the active selectedModes set.
  // - If any transit mode is selected, use Transitous with the union of allowed transit modes.
  // - Otherwise, use Mapbox with the first locomotion mode.
  const computeSingleSegment = async (
    start: typeof plannedPlaces[number],
    end: typeof plannedPlaces[number],
    modes: TransportMode[]
  ): Promise<RouteSegment> => {
    const transitSelected = modes.filter((m) => TRANSIT_MODES.includes(m)) as Array<'plane' | 'train' | 'bus' | 'metro'>;
    if (transitSelected.length > 0) {
      const transitous = await fetchTransitousRoute(
        [start.coordinates[0], start.coordinates[1]],
        [end.coordinates[0], end.coordinates[1]],
        transitSelected
      );
      if (transitous) {
        return { distance: transitous.distanceKm, duration: transitous.durationMin, transfers: transitous.transfers };
      }
      const fastest = transitSelected.includes('plane') ? 'plane' : transitSelected.includes('train') ? 'train' : transitSelected.includes('bus') ? 'bus' : 'metro';
      const speedKmh = fastest === 'plane' ? 750 : fastest === 'train' ? 200 : fastest === 'metro' ? 40 : 70;
      const distance = calculateDistanceInKm(start.coordinates[1], start.coordinates[0], end.coordinates[1], end.coordinates[0]);
      return { distance, duration: (distance / speedKmh) * 60 };
    }

    const locomotion = (modes.find((m) => m === 'driving' || m === 'cycling' || m === 'walking') || 'driving') as 'driving' | 'cycling' | 'walking';
    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN || localStorage.getItem('mapbox_token') || 'pk.eyJ1Ijoic2FjcmVkd29sZCIsImEiOiJjbWc3eXQ1YWIwMWxlMmtzaHppZWxkMzhnIn0.Rdmr8Vf5k04a-Z-8M0Uvaw';
    try {
      const coordinates = `${start.coordinates[0]},${start.coordinates[1]};${end.coordinates[0]},${end.coordinates[1]}`;
      const url = `https://api.mapbox.com/directions/v5/mapbox/${locomotion}/${coordinates}?access_token=${mapboxToken}&geometries=geojson`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes[0]) {
        return { distance: data.routes[0].distance / 1000, duration: data.routes[0].duration / 60 };
      }
    } catch (err) {
      logger.warn('Mapbox segment fetch failed', err);
    }
    const distance = calculateDistanceInKm(start.coordinates[1], start.coordinates[0], end.coordinates[1], end.coordinates[0]);
    const fallbackSpeed = locomotion === 'walking' ? 5 : locomotion === 'cycling' ? 18 : 80;
    return { distance, duration: (distance / fallbackSpeed) * 60 };
  };

  // Calculate route segments using the global selectedModes set (same modes for every leg).
  const calculateRouteSegments = async (places: typeof plannedPlaces) => {
    if (places.length < 2) {
      setRouteSegments([]);
      return;
    }
    setLoadingRouteInfo(true);
    try {
      const segments: RouteSegment[] = [];
      for (let i = 0; i < places.length - 1; i++) {
        const seg = await computeSingleSegment(places[i], places[i + 1], selectedModes);
        segments.push(seg);
      }
      setRouteSegments(segments);
    } catch (error) {
      console.error('Error calculating route segments:', error);
      setRouteSegments([]);
    } finally {
      setLoadingRouteInfo(false);
    }
  };

  const continents = useMemo(() => getAllContinents(), []);
  const countries = useMemo(() => {
    if (selectedContinent === 'all') return [];
    return getCountriesByContinent(selectedContinent);
  }, [selectedContinent]);
  const cities = useMemo(() => {
    if (selectedCountry === 'all') return [];
    return getCitiesByCountry(selectedCountry);
  }, [selectedCountry]);

  // Reset dependent filters when parent filter changes
  const handleContinentChange = (continent: string) => {
    setSelectedContinent(continent);
    setSelectedCountry('all');
    setSelectedCity('all');
  };
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedCity('all');
  };

  // Get planned places
  const plannedPlaces = useMemo(() => {
    return allPlaces.filter(place => userProgress.tripPlaces?.includes(place.id) ?? false);
  }, [userProgress.tripPlaces, allPlaces]);

  // Get all unique cities from planned places
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    plannedPlaces.forEach(place => {
      if (place.city) cities.add(`${place.city}, ${place.country}`);
    });
    return Array.from(cities).sort();
  }, [plannedPlaces]);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
    const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Optimize route using Nearest Neighbor algorithm with real coordinates
  const optimizedRoute = useMemo(() => {
    if (!startingCity || plannedPlaces.length === 0) return [];
    const route: typeof plannedPlaces = [];
    const remaining = [...plannedPlaces];

    // Find the first place in the starting city
    const startIndex = remaining.findIndex(p => `${p.city}, ${p.country}` === startingCity);
    if (startIndex !== -1) {
      route.push(remaining[startIndex]);
      remaining.splice(startIndex, 1);
    } else if (remaining.length > 0) {
      // If starting city not found, start with the first place
      route.push(remaining[0]);
      remaining.splice(0, 1);
    }

    // Add remaining places by geographic proximity (Nearest Neighbor)
    while (remaining.length > 0) {
      const lastPlace = route[route.length - 1];
      let nearestIndex = 0;
      let nearestDistance = Infinity;
      remaining.forEach((place, index) => {
        const distance = calculateDistance(lastPlace.coordinates as [number, number], place.coordinates as [number, number]);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });
      route.push(remaining[nearestIndex]);
      remaining.splice(nearestIndex, 1);
    }
    return route;
  }, [startingCity, plannedPlaces]);

  // Use optimizedRouteState if user has reordered, otherwise use calculated optimizedRoute
  const displayRoute = optimizedRouteState.length > 0 ? optimizedRouteState : optimizedRoute;

  // Check if route has been manually reordered
  const isRouteModified = useMemo(() => {
    if (optimizedRouteState.length === 0 || optimizedRoute.length === 0) return false;
    if (optimizedRouteState.length !== optimizedRoute.length) return true;
    return optimizedRouteState.some((place, index) => place.id !== optimizedRoute[index]?.id);
  }, [optimizedRouteState, optimizedRoute]);

  // Track if we've already synced this route to prevent loops
  const lastSyncedRouteRef = useRef<string>('');
  const poiSearchAbortRef = useRef<AbortController | null>(null);
  const poiSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update state and sync to context when optimizedRoute changes
  useEffect(() => {
    if (optimizedRoute.length > 0) {
      const routeKey = optimizedRoute.map(p => p.id).join(',');
      // Only update if the route has actually changed
      if (lastSyncedRouteRef.current !== routeKey) {
        lastSyncedRouteRef.current = routeKey;
        setOptimizedRouteState(optimizedRoute);
        // Sync the optimized order to the global context so Globe3D uses the correct order
        reorderTrip(optimizedRoute.map(p => p.id));
      }
    }
  }, [optimizedRoute, reorderTrip]);

  // Search for POIs near each place in the itinerary - using city normalization and distance filtering
  const searchPOIsAlongRoute = useCallback(async (places: typeof plannedPlaces, abortSignal?: AbortSignal) => {
    if (places.length === 0) {
      setPois([]);
      return;
    }
    setLoadingPOIs(true);
    const foundPOIs: POI[] = [];
    const MAX_DISTANCE_KM = 30; // Maximum distance from sacred place to POI
    
    try {
      // LIMIT: Only search POIs for the first 5 places to avoid too many API calls
      const maxPlacesToSearch = Math.min(places.length, 5);
      
      for (let i = 0; i < maxPlacesToSearch; i++) {
        if (abortSignal?.aborted) {
          console.log('POI search aborted');
          return;
        }
        
        const place = places[i];
        const placeCity = place.city || '';
        const placeCoords = place.coordinates as [number, number];
        const placeLat = placeCoords[1];
        const placeLng = placeCoords[0];
        
        // Get all possible search terms for this city
        const searchTerms = getCitySearchTerms(placeCity);
        
        // Helper function to filter POIs by city match and distance
        const filterAndAddPOIs = (
          items: any[],
          type: 'restaurant' | 'lodging' | 'transport',
          getId: (item: any) => string,
          getName: (item: any) => string,
          getAddress: (item: any) => string,
          getCity: (item: any) => string,
          getCoords: (item: any) => { lat: number; lng: number } | null
        ) => {
          items.forEach((item: any) => {
            const itemCity = getCity(item);
            const coords = getCoords(item);
            
            // First check: city name must match (using normalized comparison)
            if (!citiesMatch(placeCity, itemCity)) {
              return; // Skip this POI - city doesn't match
            }
            
            // Calculate distance if coordinates are available
            let distanceFromPlace: number | undefined;
            let poiCoords: [number, number] = placeCoords; // default to place coords
            
            if (coords && coords.lat !== 0 && coords.lng !== 0) {
              poiCoords = [coords.lng, coords.lat];
              distanceFromPlace = calculateDistanceInKm(placeLat, placeLng, coords.lat, coords.lng);
              
              // Second check: must be within MAX_DISTANCE_KM
              if (distanceFromPlace > MAX_DISTANCE_KM) {
                return; // Skip this POI - too far away
              }
            }
            
            foundPOIs.push({
              id: getId(item),
              name: getName(item),
              type,
              address: getAddress(item),
              coordinates: poiCoords,
              segmentIndex: i,
              placeId: place.id,
              distanceFromPlace
            });
          });
        };
        
        // 1. Search in internal database - restaurants
        try {
          // Build OR query for all search terms
          let query = supabase
            .from('restaurants')
            .select('id, name, address, city, coordinates, type')
            .eq('verified', true)
            .not('type', 'cs', '{halal}')
            .not('type', 'cs', '{kosher}');
          
          // Use primary city term for search (Supabase doesn't support OR easily in ilike)
          if (searchTerms.length > 0) {
            query = query.or(searchTerms.slice(0, 3).map(term => `city.ilike.%${term}%`).join(','));
          }
          
          const { data: dbRestaurants } = await query.limit(10);
          
          if (dbRestaurants && dbRestaurants.length > 0) {
            filterAndAddPOIs(
              dbRestaurants,
              'restaurant',
              (r) => `db-rest-${r.id}`,
              (r) => r.name,
              (r) => `${r.address}, ${r.city}`,
              (r) => r.city,
              (r) => r.coordinates as { lat: number; lng: number } | null
            );
          }
        } catch (error) {
          console.error('Error fetching DB restaurants:', error);
        }
        
        // 2. Search in internal database - hotels
        try {
          let query = supabase
            .from('hotels')
            .select('id, name, address, city, coordinates')
            .eq('verified', true);
          
          if (searchTerms.length > 0) {
            query = query.or(searchTerms.slice(0, 3).map(term => `city.ilike.%${term}%`).join(','));
          }
          
          const { data: dbHotels } = await query.limit(10);
          
          if (dbHotels && dbHotels.length > 0) {
            filterAndAddPOIs(
              dbHotels,
              'lodging',
              (h) => `db-hotel-${h.id}`,
              (h) => h.name,
              (h) => `${h.address}, ${h.city}`,
              (h) => h.city,
              (h) => h.coordinates as { lat: number; lng: number } | null
            );
          }
        } catch (error) {
          console.error('Error fetching DB hotels:', error);
        }
        
        // 3. Search in internal database - transport stops
        try {
          let query = supabase
            .from('transport_stops')
            .select('id, name, city, transport_type, coordinates')
            .eq('verified', true);
          
          if (searchTerms.length > 0) {
            query = query.or(searchTerms.slice(0, 3).map(term => `city.ilike.%${term}%`).join(','));
          }
          
          const { data: dbTransports } = await query.limit(10);
          
          if (dbTransports && dbTransports.length > 0) {
            filterAndAddPOIs(
              dbTransports,
              'transport',
              (t) => `db-transport-${t.id}`,
              (t) => `${t.name} (${t.transport_type})`,
              (t) => t.city,
              (t) => t.city,
              (t) => t.coordinates as { lat: number; lng: number } | null
            );
          }
        } catch (error) {
          console.error('Error fetching DB transports:', error);
        }
      }
      
      // Sort POIs by distance (closest first) and limit to 3 per type per place
      const sortedPOIs = foundPOIs.sort((a, b) => {
        // First sort by segment index
        if (a.segmentIndex !== b.segmentIndex) return a.segmentIndex - b.segmentIndex;
        // Then by distance
        const distA = a.distanceFromPlace ?? Infinity;
        const distB = b.distanceFromPlace ?? Infinity;
        return distA - distB;
      });
      
      // Limit to 3 POIs per type per segment
      const limitedPOIs: POI[] = [];
      const countByTypeAndSegment = new Map<string, number>();
      
      for (const poi of sortedPOIs) {
        const key = `${poi.segmentIndex}-${poi.type}`;
        const count = countByTypeAndSegment.get(key) || 0;
        if (count < 3) {
          limitedPOIs.push(poi);
          countByTypeAndSegment.set(key, count + 1);
        }
      }
      
      // Only set POIs if not aborted
      if (!abortSignal?.aborted) {
        setPois(limitedPOIs);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('POI search aborted');
        return;
      }
      console.error('Error searching POIs:', error);
      setPois([]);
    } finally {
      if (!abortSignal?.aborted) {
        setLoadingPOIs(false);
      }
    }
  }, []);

  // Calculate route segments when optimized route changes - with debounce
  useEffect(() => {
    // Clear any pending timeout
    if (poiSearchTimeoutRef.current) {
      clearTimeout(poiSearchTimeoutRef.current);
    }
    
    // Abort any ongoing POI search
    if (poiSearchAbortRef.current) {
      poiSearchAbortRef.current.abort();
    }
    
    if (showOptimizedRoute && displayRoute.length >= 2) {
      calculateRouteSegments(displayRoute);
      
      // Debounce POI search to avoid excessive calls
      poiSearchTimeoutRef.current = setTimeout(() => {
        const abortController = new AbortController();
        poiSearchAbortRef.current = abortController;
        searchPOIsAlongRoute(displayRoute, abortController.signal);
      }, 500); // Wait 500ms before starting POI search
    } else {
      setRouteSegments([]);
      setPois([]);
      setLoadingPOIs(false);
    }
    
    // Cleanup on unmount or when dependencies change
    return () => {
      if (poiSearchTimeoutRef.current) {
        clearTimeout(poiSearchTimeoutRef.current);
      }
      if (poiSearchAbortRef.current) {
        poiSearchAbortRef.current.abort();
      }
    };
  }, [displayRoute, showOptimizedRoute, transportMode, searchPOIsAlongRoute]);

  // Get unique cities from planned places
  const tripCities = useMemo(() => {
    return new Set(plannedPlaces.map(place => place.city));
  }, [plannedPlaces]);

  // Fetch saved restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      if (userProgress.savedRestaurants.length === 0) {
        setSavedRestaurants([]);
        return;
      }
      const {
        data,
        error
      } = await supabase.from('restaurants').select('*').in('id', userProgress.savedRestaurants);
      if (!error && data) {
        // Defensive: hide halal/kosher even if previously saved
        const filtered = (data as SavedRestaurant[]).filter(
          (r: any) => !r.type?.includes('halal') && !r.type?.includes('kosher')
        );
        setSavedRestaurants(filtered);
      }
    };
    fetchRestaurants();
  }, [userProgress.savedRestaurants]);

  // Filter restaurants by trip cities
  const filteredRestaurants = useMemo(() => {
    if (plannedPlaces.length === 0) return [];
    return savedRestaurants.filter(restaurant => tripCities.has(restaurant.city));
  }, [savedRestaurants, tripCities, plannedPlaces]);

  // Group restaurants by city
  const restaurantsByCity = useMemo(() => {
    return filteredRestaurants.reduce((acc, restaurant) => {
      if (!acc[restaurant.city]) acc[restaurant.city] = [];
      acc[restaurant.city].push(restaurant);
      return acc;
    }, {} as Record<string, SavedRestaurant[]>);
  }, [filteredRestaurants]);
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      vegetarian: 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30',
      vegan: 'bg-lime-500/20 text-lime-700 border-lime-500/30',
      neutral: 'bg-slate-500/20 text-slate-700 border-slate-500/30'
    };
    return colors[type] || 'bg-slate-500/20 text-slate-700 border-slate-500/30';
  };

  // Check if filters are applied
  const hasFilters = useMemo(() => {
    return selectedContinent !== 'all' || selectedCountry !== 'all' || selectedCity !== 'all';
  }, [selectedContinent, selectedCountry, selectedCity]);

  // Filter places based on selections and search
  const filteredPlaces = useMemo(() => {
    let filtered = activeTab === 'planned' ? plannedPlaces : allPlaces;

    // Filter by place category
    if (placeCategory !== 'all') {
      filtered = filtered.filter(p => (p.placeCategory || 'religious_site') === placeCategory);
    }
    if (selectedContinent !== 'all') {
      filtered = filtered.filter(p => getContinent(p.country) === selectedContinent);
    }
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(p => p.country === selectedCountry);
    }
    if (selectedCity !== 'all') {
      filtered = filtered.filter(p => p.city === selectedCity);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || p.city?.toLowerCase().includes(query) || p.country.toLowerCase().includes(query));
    }
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedContinent, selectedCountry, selectedCity, searchQuery, activeTab, plannedPlaces, allPlaces, placeCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const religious = allPlaces.filter(p => (p.placeCategory || 'religious_site') === 'religious_site').length;
    const museums = allPlaces.filter(p => p.placeCategory === 'museum').length;
    return {
      religious,
      museums,
      total: allPlaces.length
    };
  }, [allPlaces]);
  const isPlaceVisited = (placeId: string) => {
    return userProgress.visitedPlaces.includes(placeId);
  };
  return <div className="container mx-auto p-6 space-y-6 pb-24">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2" style={{
        color: '#34E0A1'
      }}>
          Lieux Sacrés du Monde
        </h1>
        <p className="text-muted-foreground text-lg">
          Découvrez {isLoadingPlaces ? '...' : categoryCounts.total} lieux à travers le monde
          <span className="text-sm ml-2">
            ({categoryCounts.religious} lieux sacrés · {categoryCounts.museums} musées)
          </span>
        </p>
      </div>

      {/* Place Category Filter */}
      

      {/* Tabs for All vs Planned */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all" className="gap-2">
            <MapPin className="w-4 h-4" />
            Tous les lieux
          </TabsTrigger>
          <TabsTrigger value="planned" className="gap-2">
            <Calendar className="w-4 h-4" />
            Mon itinéraire ({plannedPlaces.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6 mt-6">
          {/* Search and filters for all places */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="Rechercher par nom, ville ou pays..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
          </div>

          {/* Cascade Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Globe2 className="w-4 h-4" />
                Continent
              </label>
              <Select value={selectedContinent} onValueChange={handleContinentChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un continent" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto z-50 bg-background">
                  <SelectItem value="all">Tous les continents</SelectItem>
                  {continents.map(continent => <SelectItem key={continent} value={continent}>
                      {t(`continents.${continent}`, {
                    defaultValue: continent
                  })}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Pays
              </label>
              <Select value={selectedCountry} onValueChange={handleCountryChange} disabled={selectedContinent === 'all'}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un pays" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto z-50 bg-background">
                  <SelectItem value="all">Tous les pays</SelectItem>
                  {countries.map(country => <SelectItem key={country} value={country}>
                      {t(`countries.${country}`, {
                    defaultValue: country
                  })}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Ville
              </label>
              <Select value={selectedCity} onValueChange={setSelectedCity} disabled={selectedCountry === 'all'}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une ville" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto z-50 bg-background">
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {cities.map(city => <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!hasFilters ? <Card className="border-2" style={{
          borderColor: '#34E0A1'
        }}>
              <CardContent className="py-12 text-center">
                <Globe2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-muted-foreground mb-2">
                  Sélectionnez un continent pour commencer
                </p>
                <p className="text-muted-foreground">
                  Utilisez les filtres ci-dessus pour afficher les lieux sacrés
                </p>
              </CardContent>
            </Card> : <>
              <div className="text-sm text-muted-foreground">
                {filteredPlaces.length} lieu{filteredPlaces.length > 1 ? 'x' : ''} trouvé{filteredPlaces.length > 1 ? 's' : ''}
              </div>

              {filteredPlaces.length === 0 ? <Card className="border-2" style={{
            borderColor: '#34E0A1'
          }}>
              <CardContent className="py-12 text-center">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-muted-foreground mb-2">
                  Aucun lieu trouvé
                </p>
                <p className="text-muted-foreground">
                  Essayez de modifier vos critères de recherche
                </p>
              </CardContent>
            </Card> : <ScrollArea className="h-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
                {filteredPlaces.map(place => <Card key={place.id} className="overflow-hidden cursor-pointer transition-all hover:scale-105" style={{
                background: 'linear-gradient(135deg, rgba(20, 43, 79, 0.95) 0%, rgba(14, 27, 63, 0.98) 100%)',
                border: '1px solid rgba(52, 224, 161, 0.2)'
              }} onClick={() => navigate(`/place/${place.id}`)}>
                    <div className="relative h-48 overflow-hidden">
                      <img src={getImageUrl(place.imageUrl)} alt={place.name} className="w-full h-full object-cover" loading="lazy" />
                      {isPlaceVisited(place.id) && <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground" style={{
                    boxShadow: '0 0 15px rgba(52, 224, 161, 0.5)'
                  }}>
                          Visité
                        </Badge>}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-foreground line-clamp-1">
                        {place.name}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {place.city}, {t(`countries.${place.country}`, {
                        defaultValue: place.country
                      })}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {place.description}
                      </p>
                    </CardContent>
                  </Card>)}
              </div>
            </ScrollArea>}
            </>}
        </TabsContent>

        <TabsContent value="planned" className="space-y-6 mt-6">
          {plannedPlaces.length === 0 ? <Card className="border-2" style={{
          borderColor: '#34E0A1'
        }}>
              <CardContent className="py-12 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-muted-foreground mb-2">
                  Aucun lieu planifié
                </p>
                <p className="text-muted-foreground">
                  Ajoutez des lieux à votre itinéraire depuis l'onglet "Tous les lieux"
                </p>
              </CardContent>
            </Card> : <div className="space-y-6">
              {/* Places List */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="Rechercher dans votre itinéraire..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
              </div>

              <div className="text-sm text-muted-foreground">
                {filteredPlaces.length} lieu{filteredPlaces.length > 1 ? 'x' : ''} dans votre itinéraire
              </div>

              {filteredPlaces.length === 0 ? <Card className="border-2" style={{
            borderColor: '#34E0A1'
          }}>
                  <CardContent className="py-12 text-center">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-xl text-muted-foreground mb-2">
                      Aucun lieu trouvé
                    </p>
                    <p className="text-muted-foreground">
                      Essayez de modifier votre recherche
                    </p>
                  </CardContent>
                </Card> : <ScrollArea className="h-[400px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
                    {filteredPlaces.map(place => <Card key={place.id} className="overflow-hidden cursor-pointer transition-all hover:scale-105" style={{
                background: 'linear-gradient(135deg, rgba(20, 43, 79, 0.95) 0%, rgba(14, 27, 63, 0.98) 100%)',
                border: '1px solid rgba(52, 224, 161, 0.2)'
              }} onClick={() => navigate(`/place/${place.id}`)}>
                        <div className="relative h-48 overflow-hidden">
                          <img src={getImageUrl(place.imageUrl)} alt={place.name} className="w-full h-full object-cover" loading="lazy" />
                          {isPlaceVisited(place.id) && <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground" style={{
                    boxShadow: '0 0 15px rgba(52, 224, 161, 0.5)'
                  }}>
                              Visité
                            </Badge>}
                        </div>
                        <CardHeader>
                          <CardTitle className="text-foreground line-clamp-1">
                            {place.name}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {place.city}, {t(`countries.${place.country}`, {
                        defaultValue: place.country
                      })}
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {place.description}
                          </p>
                        </CardContent>
                      </Card>)}
                  </div>
                </ScrollArea>}


              {/* Route Optimizer Section */}
              {plannedPlaces.length >= 2 && <>
                  <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Route className="w-5 h-5 text-primary" />
                        Optimiser mon itinéraire
                      </CardTitle>
                      <CardDescription>
                        Calculez le parcours optimal entre vos lieux sélectionnés
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <label className="text-sm font-medium mb-2 block">Ville de départ</label>
                          <Select value={startingCity} onValueChange={setStartingCity}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choisir une ville..." />
                            </SelectTrigger>
                            <SelectContent className="z-50 bg-background">
                              {availableCities.map(city => <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1">
                          <label className="text-sm font-medium mb-1 block">Modes de transport</label>
                          <p className="text-xs text-muted-foreground mb-2">Sélectionnez un ou plusieurs modes — appliqués à tous les trajets</p>
                          <div className="flex flex-col gap-2">
                            <div className="grid grid-cols-3 gap-2">
                              {ALL_MODES.map((m, i) => {
                                const Icon = transportIcon(m);
                                const active = selectedModes.includes(m);
                                const isLast = i === ALL_MODES.length - 1; // walking → full row
                                return (
                                  <Button
                                    key={m}
                                    type="button"
                                    variant={active ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => toggleMode(m)}
                                    disabled={loadingRouteInfo}
                                    className={isLast ? 'col-span-3' : undefined}
                                  >
                                    {loadingRouteInfo && active ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Icon className="w-4 h-4 mr-1" />} {transportLabel(m)}
                                  </Button>
                                );
                              })}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Modes sélectionnés : <span className="font-medium text-foreground">{selectedLabel()}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Optimized Route Display */}
                  {showOptimizedRoute && startingCity && displayRoute.length > 0 && <>
                       <Card className="border-primary/30">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="flex items-center gap-2 text-primary">
                                <Route className="w-5 h-5" />
                                Itinéraire optimisé ({displayRoute.length} étapes)
                              </CardTitle>
                              <CardDescription>
                                Parcours recommandé depuis {startingCity} - Glissez pour réorganiser
                              </CardDescription>
                            </div>
                            <div className="flex gap-2">
                              {isRouteModified && <Button onClick={resetToOptimizedOrder} variant="outline" className="gap-2" title="Réinitialiser à l'ordre optimisé">
                                  <RotateCcw className="w-4 h-4" />
                                  Réinitialiser
                                </Button>}
                              <Button onClick={exportToPDF} variant="outline" className="gap-2">
                                <Download className="w-4 h-4" />
                                Exporter PDF
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {displayRoute.map((place, index) => {
                      const isNewCity = index === 0 || `${place.city}, ${place.country}` !== `${displayRoute[index - 1]?.city}, ${displayRoute[index - 1]?.country}`;
                      const segment = routeSegments[index];
                      const isDragging = draggedIndex === index;
                      return <div key={place.id} draggable onDragStart={() => handleDragStart(index)} onDragOver={handleDragOver} onDrop={() => handleDrop(index)} onDragEnd={handleDragEnd} className={cn("transition-all duration-200", isDragging && "opacity-50 scale-95")}>
                                  {isNewCity && <div className="flex items-center gap-2 mb-3 mt-2">
                                      <Navigation className="w-4 h-4 text-primary" />
                                      <span className="font-bold text-primary">
                                        {place.city}, {place.country}
                                      </span>
                                    </div>}
                                   <div className="space-y-2">
                                     <div className="flex items-start gap-4 ml-6 relative">
                                       <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm cursor-grab active:cursor-grabbing">
                                         {index + 1}
                                       </div>
                                       <div className="flex-1 space-y-2">
                                         <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors" onClick={() => navigate(`/place/${place.id}`)}>
                                           {place.imageUrl && <div className="relative">
                                               <img src={getImageUrl(place.imageUrl)} alt={place.name} className="w-16 h-16 object-cover rounded" onError={e => {
                                    e.currentTarget.src = '/placeholder.svg';
                                  }} />
                                               {getPOIsForPlace(place.id).length > 0 && <Button size="sm" variant="secondary" className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full p-0 shadow-lg" onClick={e => {
                                    e.stopPropagation();
                                    setExpandedPlaceId(expandedPlaceId === place.id ? null : place.id);
                                  }}>
                                                   <Info className="w-3 h-3" />
                                                 </Button>}
                                             </div>}
                                           <div className="flex-1">
                                             <h4 className="font-semibold">{place.name}</h4>
                                             <p className="text-sm text-muted-foreground line-clamp-1">
                                               {place.description}
                                             </p>
                                             <Badge variant="outline" className="mt-1">{place.points} pts</Badge>
                                           </div>
                                         </div>
                                         
                                         {/* Display saved POIs for this place */}
                                         {expandedPlaceId === place.id && getPOIsForPlace(place.id).length > 0 && <div className="ml-20 p-3 bg-primary/5 rounded-lg border border-primary/20 space-y-2">
                                             <div className="flex items-center justify-between">
                                               <h5 className="text-sm font-semibold text-primary">Points d'arrêt sauvegardés</h5>
                                               <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setExpandedPlaceId(null)}>
                                                 <X className="w-4 h-4" />
                                               </Button>
                                             </div>
                                             {getPOIsForPlace(place.id).map(poi => <div key={poi.id} className="flex items-start justify-between gap-2 p-2 bg-background rounded text-sm">
                                                 <div className="flex items-start gap-2 flex-1">
                                                    {poi.type === 'restaurant' && <Utensils className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />}
                                                    {poi.type === 'lodging' && <Hotel className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />}
                                                    {poi.type === 'transport' && <Train className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />}
                                                   <div className="flex-1">
                                                     <div className="font-medium">{poi.name}</div>
                                                     <div className="text-xs text-muted-foreground line-clamp-1">{poi.address}</div>
                                                   </div>
                                                 </div>
                                                 <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive hover:text-destructive" onClick={() => removePOI(poi.id)}>
                                                   <X className="w-3 h-3" />
                                                 </Button>
                                               </div>)}
                                           </div>}
                                       </div>
                                     </div>
                                      {index < displayRoute.length - 1 && segment && (
                                        <div className="ml-14 space-y-2">
                                          <div className="flex items-center gap-2 flex-wrap bg-muted/40 rounded-lg p-2">
                                            <span className="text-xs text-muted-foreground mr-1">Mode :</span>
                                            {ALL_MODES.map((m) => {
                                              const Icon = transportIcon(m);
                                              const active = (segmentModes[index] ?? transportMode) === m;
                                              const isLoading = loadingSegmentIdx === index && active;
                                              return (
                                                <Button
                                                  key={m}
                                                  type="button"
                                                  variant={active ? 'default' : 'outline'}
                                                  size="icon"
                                                  className="h-7 w-7"
                                                  title={transportLabel(m)}
                                                  aria-label={transportLabel(m)}
                                                  disabled={loadingSegmentIdx !== null}
                                                  onClick={() => recalcSegment(index, m)}
                                                >
                                                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
                                                </Button>
                                              );
                                            })}
                                          </div>
                                          <div className="flex items-center gap-4 text-sm text-muted-foreground bg-secondary/10 rounded-lg p-3 border-l-2 border-secondary">
                                            <div className="flex items-center gap-2">
                                              <ArrowRight className="w-4 h-4 text-secondary" />
                                              <span className="font-medium">
                                                {segment.distance.toFixed(1)} km
                                              </span>
                                            </div>
                                            <div className="w-px h-4 bg-border" />
                                            <div className="flex items-center gap-2">
                                              <Calendar className="w-4 h-4 text-secondary" />
                                              <span className="font-medium">
                                                {segment.duration < 60 ? `${Math.round(segment.duration)} min` : `${Math.floor(segment.duration / 60)}h ${Math.round(segment.duration % 60)}min`}
                                              </span>
                                            </div>
                                            {segment.transfers !== undefined && segment.transfers > 0 && (
                                              <>
                                                <div className="w-px h-4 bg-border" />
                                                <span className="font-medium text-secondary">
                                                  {segment.transfers} correspondance{segment.transfers > 1 ? 's' : ''}
                                                </span>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    {index < optimizedRoute.length - 1 && loadingRouteInfo && !segment && <div className="ml-14 text-sm text-muted-foreground animate-pulse">
                                        Calcul en cours...
                                      </div>}
                                  </div>
                                </div>;
                    })}
                            {routeSegments.length > 0 && <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-semibold">Totaux :</span>
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                      <MapPin className="w-4 h-4 text-primary" />
                                      <span className="font-bold text-primary">
                                        {routeSegments.reduce((sum, seg) => sum + seg.distance, 0).toFixed(1)} km
                                      </span>
                                    </div>
                                    <div className="w-px h-4 bg-border" />
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-4 h-4 text-primary" />
                                      <span className="font-bold text-primary">
                                        {(() => {
                                const totalMinutes = routeSegments.reduce((sum, seg) => sum + seg.duration, 0);
                                const hours = Math.floor(totalMinutes / 60);
                                const minutes = Math.round(totalMinutes % 60);
                                return hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`;
                              })()}
                                      </span>
                                    </div>
                                    {(() => {
                                      const totalTransfers = routeSegments.reduce((sum, seg) => sum + (seg.transfers ?? 0), 0);
                                      if (totalTransfers <= 0) return null;
                                      return (
                                        <>
                                          <div className="w-px h-4 bg-border" />
                                          <div className="flex items-center gap-2">
                                            <ArrowRight className="w-4 h-4 text-primary" />
                                            <span className="font-bold text-primary">
                                              {totalTransfers} {totalTransfers > 1 ? 'correspondances' : 'correspondance'}
                                            </span>
                                          </div>
                                        </>
                                      );
                                    })()}
                                  </div>
                                </div>
                              </div>}
                          </div>
                        </CardContent>
                      </Card>



                      {/* Points d'arrêt suggérés */}
                      {pois.length > 0 && <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-primary" />
                              Points d'arrêt suggérés
                            </CardTitle>
                            <CardDescription>
                              Restaurants, hébergements et transports vérifiés près de vos destinations
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {loadingPOIs ? <div className="text-center py-4 text-muted-foreground animate-pulse">
                                Recherche des points d'arrêt...
                              </div> : <div className="space-y-6">
                                {/* Filtre des types de POI */}
                                <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-lg border border-muted">
                                  <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium">Afficher :</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Checkbox id="filter-restaurant" checked={selectedPOITypes.has('restaurant')} onCheckedChange={() => togglePOIType('restaurant')} />
                                    <Label htmlFor="filter-restaurant" className="text-sm font-normal cursor-pointer flex items-center gap-1">
                                      <Utensils className="w-4 h-4 text-primary" />
                                      Restaurants
                                    </Label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Checkbox id="filter-lodging" checked={selectedPOITypes.has('lodging')} onCheckedChange={() => togglePOIType('lodging')} />
                                    <Label htmlFor="filter-lodging" className="text-sm font-normal cursor-pointer flex items-center gap-1">
                                      <Hotel className="w-4 h-4 text-amber-500" />
                                      Hébergements
                                    </Label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Checkbox id="filter-transport" checked={selectedPOITypes.has('transport')} onCheckedChange={() => togglePOIType('transport')} />
                                    <Label htmlFor="filter-transport" className="text-sm font-normal cursor-pointer flex items-center gap-1">
                                      <Train className="w-4 h-4 text-blue-500" />
                                      Transports
                                    </Label>
                                  </div>
                                </div>
                                {/* Group POIs by place */}
                                {displayRoute.map((place, index) => {
                      const placePOIs = pois.filter(p => p.segmentIndex === index && selectedPOITypes.has(p.type));

                      // Skip place if no POIs match the filter
                      if (placePOIs.length === 0) return null;
                      return <div key={index} className="border-l-2 border-primary/20 pl-4">
                                      <h4 className="font-medium mb-3 text-sm flex items-center gap-2">
                                        <Navigation className="w-4 h-4 text-primary" />
                                        Près de {place.name} ({place.city})
                                      </h4>
                                      <div className="space-y-4">
                                        {/* Restaurants */}
                                        {placePOIs.filter(p => p.type === 'restaurant').length > 0 && <div>
                                            <div className="flex items-center gap-2 text-sm font-medium mb-2 text-primary">
                                              <Utensils className="w-4 h-4" />
                                              Restaurants
                                            </div>
                                            <div className="space-y-2 ml-6">
                                              {placePOIs.filter(p => p.type === 'restaurant').map(poi => {
                                const saved = isPOISaved(poi.id);
                                return <div key={poi.id} className="flex items-start justify-between gap-2 text-sm bg-muted/30 p-2 rounded">
                                                    <div className="flex-1">
                                                      <div className="font-medium">{poi.name}</div>
                                                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                        <span>{poi.address}</span>
                                                        {poi.distanceFromPlace !== undefined && (
                                                          <Badge variant="outline" className="text-xs px-1 py-0">
                                                            {poi.distanceFromPlace < 1 
                                                              ? `${Math.round(poi.distanceFromPlace * 1000)}m` 
                                                              : `${poi.distanceFromPlace.toFixed(1)}km`}
                                                          </Badge>
                                                        )}
                                                      </div>
                                                    </div>
                                                    <Button size="sm" variant={saved ? "secondary" : "ghost"} className="h-6 w-6 p-0 flex-shrink-0" onClick={() => saved ? removePOI(poi.id) : handleSavePOI(poi, place.id)}>
                                                      {saved ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                                    </Button>
                                                  </div>;
                              })}
                                            </div>
                                          </div>}
                                        
                                        {/* Hébergements */}
                                        {placePOIs.filter(p => p.type === 'lodging').length > 0 && <div>
                                            <div className="flex items-center gap-2 text-sm font-medium mb-2 text-amber-500">
                                              <Hotel className="w-4 h-4" />
                                              Hébergements
                                            </div>
                                            <div className="space-y-2 ml-6">
                                              {placePOIs.filter(p => p.type === 'lodging').map(poi => {
                                const saved = isPOISaved(poi.id);
                                return <div key={poi.id} className="flex items-start justify-between gap-2 text-sm bg-muted/30 p-2 rounded">
                                                    <div className="flex-1">
                                                      <div className="font-medium">{poi.name}</div>
                                                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                        <span>{poi.address}</span>
                                                        {poi.distanceFromPlace !== undefined && (
                                                          <Badge variant="outline" className="text-xs px-1 py-0">
                                                            {poi.distanceFromPlace < 1 
                                                              ? `${Math.round(poi.distanceFromPlace * 1000)}m` 
                                                              : `${poi.distanceFromPlace.toFixed(1)}km`}
                                                          </Badge>
                                                        )}
                                                      </div>
                                                    </div>
                                                    <Button size="sm" variant={saved ? "secondary" : "ghost"} className="h-6 w-6 p-0 flex-shrink-0" onClick={() => saved ? removePOI(poi.id) : handleSavePOI(poi, place.id)}>
                                                      {saved ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                                    </Button>
                                                  </div>;
                              })}
                                            </div>
                                          </div>}
                                        
                                        {/* Transports */}
                                        {placePOIs.filter(p => p.type === 'transport').length > 0 && <div>
                                            <div className="flex items-center gap-2 text-sm font-medium mb-2 text-blue-500">
                                              <Train className="w-4 h-4" />
                                              Transports
                                            </div>
                                            <div className="space-y-2 ml-6">
                                              {placePOIs.filter(p => p.type === 'transport').map(poi => {
                                const saved = isPOISaved(poi.id);
                                return <div key={poi.id} className="flex items-start justify-between gap-2 text-sm bg-muted/30 p-2 rounded">
                                                    <div>
                                                      <div className="font-medium">{poi.name}</div>
                                                      <div className="text-xs text-muted-foreground">{poi.address}</div>
                                                    </div>
                                                    <Button size="sm" variant={saved ? "secondary" : "ghost"} className="h-6 w-6 p-0 flex-shrink-0" onClick={() => saved ? removePOI(poi.id) : handleSavePOI(poi, place.id)}>
                                                      {saved ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                                    </Button>
                                                  </div>;
                              })}
                                            </div>
                                          </div>}
                                      </div>
                                    </div>;
                    })}
                              </div>}
                          </CardContent>
                        </Card>}

                      {/* Restaurants Section */}
                      {filteredRestaurants.length > 0 && <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Utensils className="w-5 h-5 text-primary" />
                              Restaurants recommandés
                            </CardTitle>
                            <CardDescription>
                              Découvrez des restaurants dans les villes de votre itinéraire
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-6">
                              {Object.entries(restaurantsByCity).sort(([a], [b]) => a.localeCompare(b)).map(([city, restaurants]) => <div key={city}>
                                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                      <MapPin className="w-4 h-4" />
                                      {city}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {restaurants.map(restaurant => <Card key={restaurant.id} className="hover:shadow-md transition-shadow">
                                          <CardHeader>
                                            <div className="flex items-start justify-between">
                                              <div className="flex-1">
                                                <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                                                <CardDescription className="mt-1">
                                                  {restaurant.cuisine}
                                                </CardDescription>
                                              </div>
                                              <div className="flex items-center gap-1 text-yellow-500">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span className="font-semibold">{restaurant.rating}</span>
                                              </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                              {restaurant.type.map(type => <Badge key={type} variant="outline" className={cn("text-xs", getTypeColor(type))}>
                                                  {type}
                                                </Badge>)}
                                            </div>
                                          </CardHeader>
                                          <CardContent className="space-y-2">
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                              {restaurant.description}
                                            </p>
                                            <div className="text-sm">
                                              <div className="flex items-start gap-2">
                                                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                                <span className="text-muted-foreground">{restaurant.address}</span>
                                              </div>
                                              {restaurant.phone && <div className="flex items-center gap-2 mt-1">
                                                  <Phone className="w-4 h-4 text-muted-foreground" />
                                                  <span className="text-muted-foreground">{restaurant.phone}</span>
                                                </div>}
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                              <Button size="sm" variant="outline" className="flex-1" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`, '_blank')}>
                                                <MapPin className="w-3 h-3 mr-1" />
                                                Voir sur la carte
                                              </Button>
                                              {restaurant.website && <Button size="sm" variant="outline" onClick={() => window.open(restaurant.website, '_blank')}>
                                                  <ExternalLink className="w-3 h-3" />
                                                </Button>}
                                            </div>
                                          </CardContent>
                                        </Card>)}
                                    </div>
                                  </div>)}
                            </div>
                          </CardContent>
                        </Card>}
                    </>}
                </>}
            </div>}
        </TabsContent>
      </Tabs>
    </div>;
};
export default LocationsTab;