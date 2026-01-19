import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Search, Calendar, Globe2, Route, Navigation, ArrowRight, Utensils, Star, Phone, ExternalLink, Hotel, Fuel, Filter, Plus, X, Info, Car, Bike, PersonStanding, Download, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockPlaces, getAllContinents, getCountriesByContinent, getCitiesByCountry, getContinent } from '@/data/placesData';
import { useApp } from '@/contexts/AppContext';
import NearMeFeature from './NearMeFeature';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getImageUrl } from '@/lib/imageHelper';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import TripRouteMap from './TripRouteMap';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import type { SavedPOI } from '@/contexts/AppContext';
import jsPDF from 'jspdf';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
}

interface POI {
  id: string;
  name: string;
  type: 'restaurant' | 'lodging' | 'fuel';
  address: string;
  coordinates: [number, number];
  segmentIndex: number; // index of the place this POI is near
  placeId: string; // ID of the associated place
}

const LocationsTab = () => {
  const navigate = useNavigate();
  const { userProgress, updatePlannedRoute, savePOI, removePOI, getPOIsForPlace, addToTrip, removeFromTrip } = useApp();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [savedRestaurants, setSavedRestaurants] = useState<SavedRestaurant[]>([]);
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);
  const [loadingRouteInfo, setLoadingRouteInfo] = useState(false);
  const [pois, setPois] = useState<POI[]>([]);
  const [loadingPOIs, setLoadingPOIs] = useState(false);
  const [selectedPOITypes, setSelectedPOITypes] = useState<Set<'restaurant' | 'lodging' | 'fuel'>>(
    new Set(['restaurant', 'lodging', 'fuel'])
  );
  const [expandedPlaceId, setExpandedPlaceId] = useState<string | null>(null);
  const [transportMode, setTransportMode] = useState<'driving' | 'cycling' | 'walking'>('driving');
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

  const togglePOIType = (type: 'restaurant' | 'lodging' | 'fuel') => {
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
    
    // Recalculate segments with new order
    calculateRouteSegments(newRoute, transportMode);
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
    const firstPlace = mockPlaces.find(p => p.id === placeIds[0]);
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
    pdf.text('Mon Itinéraire Sacré', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // General info
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Ville de départ: ${startingCity}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Mode de transport: ${transportMode === 'driving' ? 'Voiture' : transportMode === 'cycling' ? 'Vélo' : 'Marche'}`, 20, yPosition);
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
      const description = place.description.length > 100 
        ? place.description.substring(0, 100) + '...' 
        : place.description;
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
        const duration = segment.duration < 60 
          ? `${Math.round(segment.duration)} min`
          : `${Math.floor(segment.duration / 60)}h ${Math.round(segment.duration % 60)}min`;
        pdf.text(`➜ ${segment.distance.toFixed(1)} km - ${duration}`, 25, yPosition);
        yPosition += 8;
      } else {
        yPosition += 6;
      }
    });

    // Save the PDF
    pdf.save(`itineraire-sacre-${startingCity?.split(',')[0] || 'voyage'}.pdf`);
  };

  // Calculate route segments with distance and duration
  const calculateRouteSegments = async (places: typeof plannedPlaces, mode: 'driving' | 'cycling' | 'walking') => {
    if (places.length < 2) {
      setRouteSegments([]);
      return;
    }

    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || 
                          import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN ||
                          localStorage.getItem('mapbox_token') ||
                          'pk.eyJ1Ijoic2FjcmVkd29sZCIsImEiOiJjbWc3eXQ1YWIwMWxlMmtzaHppZWxkMzhnIn0.Rdmr8Vf5k04a-Z-8M0Uvaw';
    if (!mapboxToken) {
      console.warn('Mapbox token not configured');
      return;
    }

    setLoadingRouteInfo(true);
    const segments: RouteSegment[] = [];

    try {
      for (let i = 0; i < places.length - 1; i++) {
        const start = places[i];
        const end = places[i + 1];

        const coordinates = `${start.coordinates[0]},${start.coordinates[1]};${end.coordinates[0]},${end.coordinates[1]}`;
        const url = `https://api.mapbox.com/directions/v5/mapbox/${mode}/${coordinates}?access_token=${mapboxToken}&geometries=geojson`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes[0]) {
          const route = data.routes[0];
          segments.push({
            distance: route.distance / 1000, // Convert meters to kilometers
            duration: route.duration / 60, // Convert seconds to minutes
          });
        } else {
          // Fallback: calculate straight-line distance
          const R = 6371; // Earth's radius in km
          const dLat = (end.coordinates[1] - start.coordinates[1]) * Math.PI / 180;
          const dLon = (end.coordinates[0] - start.coordinates[0]) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(start.coordinates[1] * Math.PI / 180) * Math.cos(end.coordinates[1] * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const distance = R * c;
          segments.push({
            distance,
            duration: distance / 80 * 60, // Rough estimate: 80 km/h average
          });
        }
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
    return mockPlaces.filter(place => userProgress.tripPlaces?.includes(place.id) ?? false);
  }, [userProgress.tripPlaces]);

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
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Optimize route using Nearest Neighbor algorithm with real coordinates
  const optimizedRoute = useMemo(() => {
    if (!startingCity || plannedPlaces.length === 0) return [];
    
    const route: typeof plannedPlaces = [];
    const remaining = [...plannedPlaces];
    
    // Find the first place in the starting city
    const startIndex = remaining.findIndex(p => 
      `${p.city}, ${p.country}` === startingCity
    );
    
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
        const distance = calculateDistance(
          lastPlace.coordinates as [number, number],
          place.coordinates as [number, number]
        );
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

  // Update state when optimizedRoute changes
  useEffect(() => {
    if (optimizedRoute.length > 0) {
      setOptimizedRouteState(optimizedRoute);
    }
  }, [optimizedRoute]);

  // Search for POIs near each place in the itinerary
  const searchPOIsAlongRoute = async (places: typeof plannedPlaces) => {
    if (places.length === 0) {
      setPois([]);
      return;
    }
    
    setLoadingPOIs(true);
    const foundPOIs: POI[] = [];
    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || 
                        import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN ||
                        localStorage.getItem('mapbox_token') ||
                        'pk.eyJ1Ijoic2FjcmVkd29sZCIsImEiOiJjbWc3eXQ1YWIwMWxlMmtzaHppZWxkMzhnIn0.Rdmr8Vf5k04a-Z-8M0Uvaw';

    if (!mapboxToken) {
      console.warn('Mapbox token not configured');
      setLoadingPOIs(false);
      return;
    }

    try {
      // Search for POIs near EACH place in the itinerary
      for (let i = 0; i < places.length; i++) {
        const place = places[i];
        const coords = place.coordinates as [number, number];

        // Search for different types of POIs near this place
        const poiTypes = [
          { query: 'restaurant', type: 'restaurant' as const },
          { query: 'hotel', type: 'lodging' as const },
          { query: 'gas station', type: 'fuel' as const }
        ];

        for (const { query, type } of poiTypes) {
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
              `proximity=${coords[0]},${coords[1]}&limit=2&access_token=${mapboxToken}`
            );

            if (response.ok) {
              const data = await response.json();
              data.features?.forEach((feature: any) => {
                foundPOIs.push({
                  id: feature.id,
                  name: feature.text,
                  type,
                  address: feature.place_name,
                  coordinates: feature.center,
                  segmentIndex: i,
                  placeId: place.id
                });
              });
            }
          } catch (error) {
            console.error(`Error fetching ${type} POIs:`, error);
          }
        }
      }

      setPois(foundPOIs);
    } catch (error) {
      console.error('Error searching POIs:', error);
      setPois([]);
    } finally {
      setLoadingPOIs(false);
    }
  };

  // Calculate route segments when optimized route changes
  useEffect(() => {
    if (showOptimizedRoute && displayRoute.length >= 2) {
      calculateRouteSegments(displayRoute, transportMode);
      searchPOIsAlongRoute(displayRoute);
    } else {
      setRouteSegments([]);
      setPois([]);
    }
  }, [displayRoute, showOptimizedRoute, transportMode]);

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

      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .in('id', userProgress.savedRestaurants);

      if (!error && data) {
        setSavedRestaurants(data as SavedRestaurant[]);
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
      halal: 'bg-green-500/20 text-green-700 border-green-500/30',
      kosher: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
      vegetarian: 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30',
      vegan: 'bg-lime-500/20 text-lime-700 border-lime-500/30',
      neutral: 'bg-slate-500/20 text-slate-700 border-slate-500/30',
    };
    return colors[type] || 'bg-slate-500/20 text-slate-700 border-slate-500/30';
  };

  // Check if filters are applied
  const hasFilters = useMemo(() => {
    return selectedContinent !== 'all' || selectedCountry !== 'all' || selectedCity !== 'all';
  }, [selectedContinent, selectedCountry, selectedCity]);

  // Filter places based on selections and search
  const filteredPlaces = useMemo(() => {
    let filtered = activeTab === 'planned' ? plannedPlaces : mockPlaces;

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
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.city?.toLowerCase().includes(query) ||
        p.country.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedContinent, selectedCountry, selectedCity, searchQuery, activeTab, plannedPlaces]);

  const isPlaceVisited = (placeId: string) => {
    return userProgress.visitedPlaces.includes(placeId);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 pb-24">
      <div className="text-center mb-8">
        <h1 
          className="text-4xl font-serif font-bold mb-2"
          style={{ color: '#34E0A1' }}
        >
          Lieux Sacrés du Monde
        </h1>
        <p className="text-muted-foreground text-lg">
          Découvrez {mockPlaces.length} lieux sacrés à travers le monde
        </p>
      </div>

      {/* Near Me Feature */}
      <NearMeFeature />

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
            <Input
              placeholder="Rechercher par nom, ville ou pays..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
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
                  {continents.map(continent => (
                    <SelectItem key={continent} value={continent}>
                      {t(`continents.${continent}`, { defaultValue: continent })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Pays
              </label>
              <Select 
                value={selectedCountry} 
                onValueChange={handleCountryChange}
                disabled={selectedContinent === 'all'}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un pays" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto z-50 bg-background">
                  <SelectItem value="all">Tous les pays</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>
                      {t(`countries.${country}`, { defaultValue: country })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Ville
              </label>
              <Select 
                value={selectedCity} 
                onValueChange={setSelectedCity}
                disabled={selectedCountry === 'all'}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une ville" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto z-50 bg-background">
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!hasFilters ? (
            <Card className="border-2" style={{ borderColor: '#34E0A1' }}>
              <CardContent className="py-12 text-center">
                <Globe2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-muted-foreground mb-2">
                  Sélectionnez un continent pour commencer
                </p>
                <p className="text-muted-foreground">
                  Utilisez les filtres ci-dessus pour afficher les lieux sacrés
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="text-sm text-muted-foreground">
                {filteredPlaces.length} lieu{filteredPlaces.length > 1 ? 'x' : ''} trouvé{filteredPlaces.length > 1 ? 's' : ''}
              </div>

              {filteredPlaces.length === 0 ? (
            <Card className="border-2" style={{ borderColor: '#34E0A1' }}>
              <CardContent className="py-12 text-center">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-muted-foreground mb-2">
                  Aucun lieu trouvé
                </p>
                <p className="text-muted-foreground">
                  Essayez de modifier vos critères de recherche
                </p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
                {filteredPlaces.map((place) => (
                  <Card 
                    key={place.id}
                    className="overflow-hidden cursor-pointer transition-all hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, rgba(20, 43, 79, 0.95) 0%, rgba(14, 27, 63, 0.98) 100%)',
                      border: '1px solid rgba(52, 224, 161, 0.2)'
                    }}
                    onClick={() => navigate(`/place/${place.id}`)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getImageUrl(place.imageUrl)}
                        alt={place.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {isPlaceVisited(place.id) && (
                        <Badge 
                          className="absolute top-2 right-2 bg-primary text-primary-foreground"
                          style={{
                            boxShadow: '0 0 15px rgba(52, 224, 161, 0.5)'
                          }}
                        >
                          Visité
                        </Badge>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-foreground line-clamp-1">
                        {place.name}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {place.city}, {t(`countries.${place.country}`, { defaultValue: place.country })}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {place.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
            </>
          )}
        </TabsContent>

        <TabsContent value="planned" className="space-y-6 mt-6">
          {plannedPlaces.length === 0 ? (
            <Card className="border-2" style={{ borderColor: '#34E0A1' }}>
              <CardContent className="py-12 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-muted-foreground mb-2">
                  Aucun lieu planifié
                </p>
                <p className="text-muted-foreground">
                  Ajoutez des lieux à votre itinéraire depuis l'onglet "Tous les lieux"
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Places List */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans votre itinéraire..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="text-sm text-muted-foreground">
                {filteredPlaces.length} lieu{filteredPlaces.length > 1 ? 'x' : ''} dans votre itinéraire
              </div>

              {filteredPlaces.length === 0 ? (
                <Card className="border-2" style={{ borderColor: '#34E0A1' }}>
                  <CardContent className="py-12 text-center">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-xl text-muted-foreground mb-2">
                      Aucun lieu trouvé
                    </p>
                    <p className="text-muted-foreground">
                      Essayez de modifier votre recherche
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
                    {filteredPlaces.map((place) => (
                      <Card 
                        key={place.id}
                        className="overflow-hidden cursor-pointer transition-all hover:scale-105"
                        style={{
                          background: 'linear-gradient(135deg, rgba(20, 43, 79, 0.95) 0%, rgba(14, 27, 63, 0.98) 100%)',
                          border: '1px solid rgba(52, 224, 161, 0.2)'
                        }}
                        onClick={() => navigate(`/place/${place.id}`)}
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={getImageUrl(place.imageUrl)}
                            alt={place.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {isPlaceVisited(place.id) && (
                            <Badge 
                              className="absolute top-2 right-2 bg-primary text-primary-foreground"
                              style={{
                                boxShadow: '0 0 15px rgba(52, 224, 161, 0.5)'
                              }}
                            >
                              Visité
                            </Badge>
                          )}
                        </div>
                        <CardHeader>
                          <CardTitle className="text-foreground line-clamp-1">
                            {place.name}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {place.city}, {t(`countries.${place.country}`, { defaultValue: place.country })}
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {place.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}


              {/* Route Optimizer Section */}
              {plannedPlaces.length >= 2 && (
                <>
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
                              {availableCities.map(city => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1">
                          <label className="text-sm font-medium mb-2 block">Mode de transport</label>
                          <div className="flex gap-2">
                            <Button
                              variant={transportMode === 'driving' ? 'default' : 'outline'}
                              size="sm"
                              className="flex-1"
                              onClick={() => setTransportMode('driving')}
                            >
                              <Car className="w-4 h-4 mr-2" />
                              Voiture
                            </Button>
                            <Button
                              variant={transportMode === 'cycling' ? 'default' : 'outline'}
                              size="sm"
                              className="flex-1"
                              onClick={() => setTransportMode('cycling')}
                            >
                              <Bike className="w-4 h-4 mr-2" />
                              Vélo
                            </Button>
                            <Button
                              variant={transportMode === 'walking' ? 'default' : 'outline'}
                              size="sm"
                              className="flex-1"
                              onClick={() => setTransportMode('walking')}
                            >
                              <PersonStanding className="w-4 h-4 mr-2" />
                              Marche
                            </Button>
                          </div>
                        </div>
                        {startingCity && (
                          <div className="flex items-end">
                            <Button 
                              onClick={() => setShowOptimizedRoute(!showOptimizedRoute)}
                              className="gap-2"
                            >
                              <Navigation className="w-4 h-4" />
                              {showOptimizedRoute ? 'Masquer' : 'Afficher'} l'itinéraire
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Optimized Route Display */}
                  {showOptimizedRoute && startingCity && displayRoute.length > 0 && (
                    <>
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
                              {isRouteModified && (
                                <Button
                                  onClick={resetToOptimizedOrder}
                                  variant="outline"
                                  className="gap-2"
                                  title="Réinitialiser à l'ordre optimisé"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                  Réinitialiser
                                </Button>
                              )}
                              <Button
                                onClick={exportToPDF}
                                variant="outline"
                                className="gap-2"
                              >
                                <Download className="w-4 h-4" />
                                Exporter PDF
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {displayRoute.map((place, index) => {
                              const isNewCity = index === 0 || 
                                `${place.city}, ${place.country}` !== `${displayRoute[index-1]?.city}, ${displayRoute[index-1]?.country}`;
                              const segment = routeSegments[index];
                              const isDragging = draggedIndex === index;
                              
                              return (
                                <div 
                                  key={place.id}
                                  draggable
                                  onDragStart={() => handleDragStart(index)}
                                  onDragOver={handleDragOver}
                                  onDrop={() => handleDrop(index)}
                                  onDragEnd={handleDragEnd}
                                  className={cn(
                                    "transition-all duration-200",
                                    isDragging && "opacity-50 scale-95"
                                  )}
                                >
                                  {isNewCity && (
                                    <div className="flex items-center gap-2 mb-3 mt-2">
                                      <Navigation className="w-4 h-4 text-secondary" />
                                      <span className="font-bold text-secondary">
                                        {place.city}, {place.country}
                                      </span>
                                    </div>
                                  )}
                                   <div className="space-y-2">
                                     <div className="flex items-start gap-4 ml-6 relative">
                                       <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm cursor-grab active:cursor-grabbing">
                                         {index + 1}
                                       </div>
                                       <div className="flex-1 space-y-2">
                                         <div 
                                           className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                                           onClick={() => navigate(`/place/${place.id}`)}
                                         >
                                           {place.imageUrl && (
                                             <div className="relative">
                                               <img 
                                                 src={getImageUrl(place.imageUrl)} 
                                                 alt={place.name}
                                                 className="w-16 h-16 object-cover rounded"
                                                 onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                                               />
                                               {getPOIsForPlace(place.id).length > 0 && (
                                                 <Button
                                                   size="sm"
                                                   variant="secondary"
                                                   className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full p-0 shadow-lg"
                                                   onClick={(e) => {
                                                     e.stopPropagation();
                                                     setExpandedPlaceId(expandedPlaceId === place.id ? null : place.id);
                                                   }}
                                                 >
                                                   <Info className="w-3 h-3" />
                                                 </Button>
                                               )}
                                             </div>
                                           )}
                                           <div className="flex-1">
                                             <h4 className="font-semibold">{place.name}</h4>
                                             <p className="text-sm text-muted-foreground line-clamp-1">
                                               {place.description}
                                             </p>
                                             <Badge variant="outline" className="mt-1">{place.points} pts</Badge>
                                           </div>
                                         </div>
                                         
                                         {/* Display saved POIs for this place */}
                                         {expandedPlaceId === place.id && getPOIsForPlace(place.id).length > 0 && (
                                           <div className="ml-20 p-3 bg-primary/5 rounded-lg border border-primary/20 space-y-2">
                                             <div className="flex items-center justify-between">
                                               <h5 className="text-sm font-semibold text-primary">Points d'arrêt sauvegardés</h5>
                                               <Button
                                                 size="sm"
                                                 variant="ghost"
                                                 className="h-6 w-6 p-0"
                                                 onClick={() => setExpandedPlaceId(null)}
                                               >
                                                 <X className="w-4 h-4" />
                                               </Button>
                                             </div>
                                             {getPOIsForPlace(place.id).map(poi => (
                                               <div key={poi.id} className="flex items-start justify-between gap-2 p-2 bg-background rounded text-sm">
                                                 <div className="flex items-start gap-2 flex-1">
                                                   {poi.type === 'restaurant' && <Utensils className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />}
                                                   {poi.type === 'lodging' && <Hotel className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />}
                                                   {poi.type === 'fuel' && <Fuel className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />}
                                                   <div className="flex-1">
                                                     <div className="font-medium">{poi.name}</div>
                                                     <div className="text-xs text-muted-foreground line-clamp-1">{poi.address}</div>
                                                   </div>
                                                 </div>
                                                 <Button
                                                   size="sm"
                                                   variant="ghost"
                                                   className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                                   onClick={() => removePOI(poi.id)}
                                                 >
                                                   <X className="w-3 h-3" />
                                                 </Button>
                                               </div>
                                             ))}
                                           </div>
                                         )}
                                       </div>
                                     </div>
                                     {index < displayRoute.length - 1 && segment && (
                                       <div className="ml-14 flex items-center gap-4 text-sm text-muted-foreground bg-secondary/10 rounded-lg p-3 border-l-2 border-secondary">
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
                                            {segment.duration < 60 
                                              ? `${Math.round(segment.duration)} min`
                                              : `${Math.floor(segment.duration / 60)}h ${Math.round(segment.duration % 60)}min`
                                            }
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                    {index < optimizedRoute.length - 1 && loadingRouteInfo && !segment && (
                                      <div className="ml-14 text-sm text-muted-foreground animate-pulse">
                                        Calcul en cours...
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                            {routeSegments.length > 0 && (
                              <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
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
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                       {/* Interactive Route Map */}
                      <TripRouteMap 
                        places={displayRoute} 
                        savedPOIs={userProgress.savedPOIs}
                        onMapReady={(captureFn) => setCaptureMapFn(() => captureFn)}
                      />


                      {/* Points d'arrêt suggérés */}
                      {pois.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-primary" />
                              Points d'arrêt suggérés
                            </CardTitle>
                            <CardDescription>
                              Restaurants, hébergements et stations-service le long du parcours
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {loadingPOIs ? (
                              <div className="text-center py-4 text-muted-foreground animate-pulse">
                                Recherche des points d'arrêt...
                              </div>
                            ) : (
                              <div className="space-y-6">
                                {/* Filtre des types de POI */}
                                <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-lg border border-muted">
                                  <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium">Afficher :</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Checkbox 
                                      id="filter-restaurant" 
                                      checked={selectedPOITypes.has('restaurant')}
                                      onCheckedChange={() => togglePOIType('restaurant')}
                                    />
                                    <Label 
                                      htmlFor="filter-restaurant" 
                                      className="text-sm font-normal cursor-pointer flex items-center gap-1"
                                    >
                                      <Utensils className="w-4 h-4 text-primary" />
                                      Restaurants
                                    </Label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Checkbox 
                                      id="filter-lodging" 
                                      checked={selectedPOITypes.has('lodging')}
                                      onCheckedChange={() => togglePOIType('lodging')}
                                    />
                                    <Label 
                                      htmlFor="filter-lodging" 
                                      className="text-sm font-normal cursor-pointer flex items-center gap-1"
                                    >
                                      <Hotel className="w-4 h-4 text-secondary" />
                                      Hébergements
                                    </Label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Checkbox 
                                      id="filter-fuel" 
                                      checked={selectedPOITypes.has('fuel')}
                                      onCheckedChange={() => togglePOIType('fuel')}
                                    />
                                    <Label 
                                      htmlFor="filter-fuel" 
                                      className="text-sm font-normal cursor-pointer flex items-center gap-1"
                                    >
                                      <Fuel className="w-4 h-4 text-accent" />
                                      Stations-service
                                    </Label>
                                  </div>
                                </div>
                                {/* Group POIs by place */}
                                {displayRoute.map((place, index) => {
                                  const placePOIs = pois.filter(p => p.segmentIndex === index && selectedPOITypes.has(p.type));
                                  
                                  // Skip place if no POIs match the filter
                                  if (placePOIs.length === 0) return null;
                                  
                                  return (
                                    <div key={index} className="border-l-2 border-primary/20 pl-4">
                                      <h4 className="font-medium mb-3 text-sm flex items-center gap-2">
                                        <Navigation className="w-4 h-4 text-primary" />
                                        Près de {place.name} ({place.city})
                                      </h4>
                                      <div className="space-y-4">
                                        {/* Restaurants */}
                                        {placePOIs.filter(p => p.type === 'restaurant').length > 0 && (
                                          <div>
                                            <div className="flex items-center gap-2 text-sm font-medium mb-2 text-primary">
                                              <Utensils className="w-4 h-4" />
                                              Restaurants
                                            </div>
                                            <div className="space-y-2 ml-6">
                                              {placePOIs.filter(p => p.type === 'restaurant').map(poi => {
                                                const saved = isPOISaved(poi.id);
                                                return (
                                                  <div key={poi.id} className="flex items-start justify-between gap-2 text-sm bg-muted/30 p-2 rounded">
                                                    <div>
                                                      <div className="font-medium">{poi.name}</div>
                                                      <div className="text-xs text-muted-foreground">{poi.address}</div>
                                                    </div>
                                                    <Button
                                                      size="sm"
                                                      variant={saved ? "secondary" : "ghost"}
                                                      className="h-6 w-6 p-0 flex-shrink-0"
                                                      onClick={() => saved ? removePOI(poi.id) : handleSavePOI(poi, place.id)}
                                                    >
                                                      {saved ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                                    </Button>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        )}
                                        
                                        {/* Hébergements */}
                                        {placePOIs.filter(p => p.type === 'lodging').length > 0 && (
                                          <div>
                                            <div className="flex items-center gap-2 text-sm font-medium mb-2 text-secondary">
                                              <Hotel className="w-4 h-4" />
                                              Hébergements
                                            </div>
                                            <div className="space-y-2 ml-6">
                                              {placePOIs.filter(p => p.type === 'lodging').map(poi => {
                                                const saved = isPOISaved(poi.id);
                                                return (
                                                  <div key={poi.id} className="flex items-start justify-between gap-2 text-sm bg-muted/30 p-2 rounded">
                                                    <div>
                                                      <div className="font-medium">{poi.name}</div>
                                                      <div className="text-xs text-muted-foreground">{poi.address}</div>
                                                    </div>
                                                    <Button
                                                      size="sm"
                                                      variant={saved ? "secondary" : "ghost"}
                                                      className="h-6 w-6 p-0 flex-shrink-0"
                                                      onClick={() => saved ? removePOI(poi.id) : handleSavePOI(poi, place.id)}
                                                    >
                                                      {saved ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                                    </Button>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        )}
                                        
                                        {/* Stations-service */}
                                        {placePOIs.filter(p => p.type === 'fuel').length > 0 && (
                                          <div>
                                            <div className="flex items-center gap-2 text-sm font-medium mb-2 text-accent">
                                              <Fuel className="w-4 h-4" />
                                              Stations-service
                                            </div>
                                            <div className="space-y-2 ml-6">
                                              {placePOIs.filter(p => p.type === 'fuel').map(poi => {
                                                const saved = isPOISaved(poi.id);
                                                return (
                                                  <div key={poi.id} className="flex items-start justify-between gap-2 text-sm bg-muted/30 p-2 rounded">
                                                    <div>
                                                      <div className="font-medium">{poi.name}</div>
                                                      <div className="text-xs text-muted-foreground">{poi.address}</div>
                                                    </div>
                                                    <Button
                                                      size="sm"
                                                      variant={saved ? "secondary" : "ghost"}
                                                      className="h-6 w-6 p-0 flex-shrink-0"
                                                      onClick={() => saved ? removePOI(poi.id) : handleSavePOI(poi, place.id)}
                                                    >
                                                      {saved ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                                    </Button>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}

                      {/* Restaurants Section */}
                      {filteredRestaurants.length > 0 && (
                        <Card>
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
                              {Object.entries(restaurantsByCity)
                                .sort(([a], [b]) => a.localeCompare(b))
                                .map(([city, restaurants]) => (
                                  <div key={city}>
                                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                      <MapPin className="w-4 h-4" />
                                      {city}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {restaurants.map(restaurant => (
                                        <Card key={restaurant.id} className="hover:shadow-md transition-shadow">
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
                                              {restaurant.type.map(type => (
                                                <Badge 
                                                  key={type}
                                                  variant="outline"
                                                  className={cn("text-xs", getTypeColor(type))}
                                                >
                                                  {type}
                                                </Badge>
                                              ))}
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
                                              {restaurant.phone && (
                                                <div className="flex items-center gap-2 mt-1">
                                                  <Phone className="w-4 h-4 text-muted-foreground" />
                                                  <span className="text-muted-foreground">{restaurant.phone}</span>
                                                </div>
                                              )}
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`, '_blank')}
                                              >
                                                <MapPin className="w-3 h-3 mr-1" />
                                                Voir sur la carte
                                              </Button>
                                              {restaurant.website && (
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  onClick={() => window.open(restaurant.website, '_blank')}
                                                >
                                                  <ExternalLink className="w-3 h-3" />
                                                </Button>
                                              )}
                                            </div>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LocationsTab;
