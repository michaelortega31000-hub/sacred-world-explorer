import { useTranslation } from 'react-i18next';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { usePlaces } from '@/hooks/usePlaces';
import { MapPin, Trash2, Calendar, Navigation, Route, ArrowRight, Utensils, Star, Globe, Phone, Sparkles, ArrowUp, ArrowDown, Check, X, Plane, TrainFront, Bus, Car, Bike, Footprints } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getImageUrl } from '@/lib/imageHelper';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { calculateDistanceInKm } from '@/lib/geoUtils';
import { toast } from 'sonner';

import ItineraryGlobe from './ItineraryGlobe';

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

const TripPlannerTab = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userProgress, removeFromTrip, clearTrip, unsaveRestaurant, updatePlannedRoute, reorderTrip } = useApp();
  const [savedRestaurants, setSavedRestaurants] = useState<SavedRestaurant[]>([]);
  const [proposedOrder, setProposedOrder] = useState<string[] | null>(null);
  const [transportMode, setTransportMode] = useState<'plane' | 'train' | 'bus' | 'car' | 'bike' | 'walk'>('car');
  
  const startingCity = userProgress.plannedRouteStartCity;
  const showOptimizedRoute = userProgress.showPlannedRoute;
  
  const setStartingCity = (city: string) => {
    updatePlannedRoute(city, userProgress.showPlannedRoute);
  };
  
  const setShowOptimizedRoute = (show: boolean) => {
    updatePlannedRoute(userProgress.plannedRouteStartCity, show);
  };
  
  // Resolve via shared helper (fuzzy filename support)
  const resolveImageUrl = (url?: string) => (url ? getImageUrl(url) : undefined);
  
  const { data: allPlaces = [] } = usePlaces();
  const tripPlaces = (userProgress.tripPlaces || [])
    .map(id => allPlaces.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  
  // Mapping des données pour ItineraryGlobe (coordonnées: [lng, lat])
  const itineraryGlobePlaces = useMemo(() => {
    return tripPlaces.map(place => ({
      id: place.id,
      name: place.name,
      lat: place.coordinates[1],
      lng: place.coordinates[0],
    }));
  }, [tripPlaces]);
  
  // Group by country
  const placesByCountry = tripPlaces.reduce((acc, place) => {
    if (!acc[place.country]) acc[place.country] = [];
    acc[place.country].push(place);
    return acc;
  }, {} as Record<string, typeof tripPlaces>);

  // Get all unique cities from selected places
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    tripPlaces.forEach(place => {
      if (place.city) cities.add(`${place.city}, ${place.country}`);
    });
    return Array.from(cities).sort();
  }, [tripPlaces]);

  // Optimize route based on starting city with geographic proximity
  const optimizedRoute = useMemo(() => {
    if (!startingCity || tripPlaces.length === 0) return [];
    
    const [city, country] = startingCity.split(', ');
    
    // Group all places by city
    const placesByCity = tripPlaces.reduce((acc, place) => {
      const key = `${place.city}, ${place.country}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(place);
      return acc;
    }, {} as Record<string, typeof tripPlaces>);
    
    // Simple geographic proximity map (European cities)
    const cityProximity: Record<string, string[]> = {
      'Barcelona, Spain': ['Madrid, Spain', 'Montserrat, Spain', 'Valencia, Spain', 'Marseille, France', 'Lyon, France'],
      'Madrid, Spain': ['Barcelona, Spain', 'Toledo, Spain', 'Lisbon, Portugal', 'Seville, Spain'],
      'Paris, France': ['Reims, France', 'Chartres, France', 'Strasbourg, France', 'Lyon, France', 'Brussels, Belgium'],
      'Rome, Italy': ['Naples, Italy', 'Florence, Italy', 'Siena, Italy', 'Pisa, Italy', 'Vatican City, Vatican'],
      'London, United Kingdom': ['Canterbury, United Kingdom', 'York, United Kingdom', 'Westminster, United Kingdom', 'Paris, France'],
      'Berlin, Germany': ['Dresden, Germany', 'Cologne, Germany', 'Munich, Germany', 'Prague, Czech Republic'],
      'Istanbul, Turkey': ['Ankara, Turkey', 'Athens, Greece', 'Sofia, Bulgaria'],
      'Athens, Greece': ['Delphi, Greece', 'Thessaloniki, Greece', 'Istanbul, Turkey'],
      'Moscow, Russia': ['St. Petersburg, Russia', 'Sergiyev Posad, Russia', 'Kiev, Ukraine'],
      'Cairo, Egypt': ['Alexandria, Egypt', 'Giza, Egypt', 'Luxor, Egypt'],
      'Bangkok, Thailand': ['Ayutthaya, Thailand', 'Chiang Mai, Thailand', 'Phuket, Thailand'],
      'Tokyo, Japan': ['Kyoto, Japan', 'Osaka, Japan', 'Nara, Japan', 'Nikko, Japan'],
      'Beijing, China': ['Xi\'an, China', 'Shanghai, China', 'Luoyang, China'],
      'Delhi, India': ['Agra, India', 'Jaipur, India', 'Varanasi, India'],
      'Mexico City, Mexico': ['Teotihuacan, Mexico', 'Puebla, Mexico', 'Guadalajara, Mexico'],
      'Lima, Peru': ['Cusco, Peru', 'Arequipa, Peru', 'Machu Picchu, Peru'],
      'Rio de Janeiro, Brazil': ['São Paulo, Brazil', 'Brasília, Brazil', 'Salvador, Brazil'],
      'Buenos Aires, Argentina': ['Córdoba, Argentina', 'Mendoza, Argentina', 'Luján, Argentina'],
    };
    
    const route: typeof tripPlaces = [];
    const visitedCities = new Set<string>();
    let currentCity = startingCity;
    
    // Start with places in the starting city
    if (placesByCity[currentCity]) {
      route.push(...placesByCity[currentCity]);
      visitedCities.add(currentCity);
    }
    
    // Visit nearest cities
    while (visitedCities.size < Object.keys(placesByCity).length) {
      let nearestCity: string | null = null;
      let foundInProximity = false;
      
      // First, try to find a nearby city from proximity map
      if (cityProximity[currentCity]) {
        for (const nearCity of cityProximity[currentCity]) {
          if (placesByCity[nearCity] && !visitedCities.has(nearCity)) {
            nearestCity = nearCity;
            foundInProximity = true;
            break;
          }
        }
      }
      
      // If no nearby city found in proximity map, pick next unvisited city
      if (!foundInProximity) {
        for (const city of Object.keys(placesByCity)) {
          if (!visitedCities.has(city)) {
            nearestCity = city;
            break;
          }
        }
      }
      
      if (nearestCity) {
        route.push(...placesByCity[nearestCity]);
        visitedCities.add(nearestCity);
        currentCity = nearestCity;
      } else {
        break;
      }
    }
    
    return route;
  }, [startingCity, tripPlaces]);

  const totalPoints = tripPlaces.reduce((sum, place) => sum + place.points, 0);

  // Get unique cities from trip places
  const tripCities = useMemo(() => {
    return new Set(tripPlaces.map(place => place.city));
  }, [tripPlaces]);

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
    if (tripPlaces.length === 0) return [];
    return savedRestaurants.filter(restaurant => tripCities.has(restaurant.city));
  }, [savedRestaurants, tripCities, tripPlaces]);

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

  // === Geographic Nearest-Neighbor optimization (Haversine, real geography) ===
  // Example: Bordeaux → Barcelona → Athens (≈ 1900 km) instead of
  //          Bordeaux → Athens → Barcelona (≈ 4500 km).
  const geoOptimizedIds = useMemo<string[]>(() => {
    if (tripPlaces.length < 3) return tripPlaces.map(p => p.id);
    const remaining = [...tripPlaces];
    const ordered: typeof tripPlaces = [];
    // Anchor: keep the first place (the user's chosen departure / current first stop)
    let current = remaining.shift()!;
    ordered.push(current);
    while (remaining.length > 0) {
      let bestIdx = 0;
      let bestDist = Infinity;
      for (let i = 0; i < remaining.length; i++) {
        const cand = remaining[i];
        const d = calculateDistanceInKm(
          current.coordinates[1], current.coordinates[0],
          cand.coordinates[1], cand.coordinates[0],
        );
        if (d < bestDist) { bestDist = d; bestIdx = i; }
      }
      current = remaining.splice(bestIdx, 1)[0];
      ordered.push(current);
    }
    return ordered.map(p => p.id);
  }, [tripPlaces]);

  const isAlreadyOptimal = useMemo(() => {
    const current = tripPlaces.map(p => p.id).join('|');
    return current === geoOptimizedIds.join('|');
  }, [tripPlaces, geoOptimizedIds]);

  const handleProposeOptimization = () => {
    if (tripPlaces.length < 3) {
      toast.info('Ajoutez au moins 3 étapes pour optimiser');
      return;
    }
    if (isAlreadyOptimal) {
      toast.success('Votre itinéraire est déjà optimal ✨');
      return;
    }
    setProposedOrder(geoOptimizedIds);
  };

  const acceptProposedOrder = () => {
    if (!proposedOrder) return;
    reorderTrip(proposedOrder);
    // Also update the persisted saved trip so the globe arcs follow the new order
    try {
      const raw = localStorage.getItem('sacred-saved-trip');
      if (raw) {
        const parsed = JSON.parse(raw);
        const all = [parsed?.departure, ...(parsed?.destinations || [])].filter(Boolean);
        const byId = new Map(all.map((p: any) => [p.placeId, p]));
        const reordered = proposedOrder.map(id => byId.get(id)).filter(Boolean);
        if (reordered.length >= 2) {
          localStorage.setItem('sacred-saved-trip', JSON.stringify({
            departure: reordered[0],
            destinations: reordered.slice(1),
            savedAt: new Date().toISOString(),
          }));
          window.dispatchEvent(new CustomEvent('sacred-saved-trip-updated'));
        }
      }
    } catch { /* ignore */ }
    setProposedOrder(null);
    toast.success('Itinéraire optimisé appliqué');
  };

  const cancelProposedOrder = () => setProposedOrder(null);

  const moveStop = (idx: number, dir: -1 | 1) => {
    const ids = tripPlaces.map(p => p.id);
    const target = idx + dir;
    if (target < 0 || target >= ids.length) return;
    [ids[idx], ids[target]] = [ids[target], ids[idx]];
    reorderTrip(ids);
  };

  // Resolve proposed order to full place objects for preview
  const proposedPlaces = useMemo(() => {
    if (!proposedOrder) return [];
    return proposedOrder
      .map(id => tripPlaces.find(p => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
  }, [proposedOrder, tripPlaces]);

  // === Transport modes + ETA ===
  const TRANSPORT_MODES = [
    { id: 'plane' as const, label: 'Avion', Icon: Plane, speed: 750 },
    { id: 'train' as const, label: 'Train', Icon: TrainFront, speed: 200 },
    { id: 'bus' as const, label: 'Bus', Icon: Bus, speed: 70 },
    { id: 'car' as const, label: 'Voiture', Icon: Car, speed: 90 },
    { id: 'bike' as const, label: 'Vélo', Icon: Bike, speed: 18 },
    { id: 'walk' as const, label: 'Marche', Icon: Footprints, speed: 5 },
  ];

  const totalDistanceKm = useMemo(() => {
    if (tripPlaces.length < 2) return 0;
    let sum = 0;
    for (let i = 0; i < tripPlaces.length - 1; i++) {
      const a = tripPlaces[i];
      const b = tripPlaces[i + 1];
      sum += calculateDistanceInKm(a.coordinates[1], a.coordinates[0], b.coordinates[1], b.coordinates[0]);
    }
    return sum;
  }, [tripPlaces]);

  const formatDuration = (hours: number) => {
    if (!isFinite(hours) || hours <= 0) return '—';
    if (hours < 1) return `${Math.round(hours * 60)} min`;
    if (hours >= 24) {
      const d = Math.floor(hours / 24);
      const h = Math.round(hours - d * 24);
      return `${d}j ${h}h`;
    }
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${String(m).padStart(2, '0')}min` : `${h}h`;
  };

  const selectedMode = TRANSPORT_MODES.find(m => m.id === transportMode)!;
  const estimatedHours = totalDistanceKm / selectedMode.speed;

  return (
    <div className="relative h-full overflow-y-auto">
      {/* Globe 3D en arrière-plan - fixed position */}
      {tripPlaces.length > 0 && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <ItineraryGlobe places={itineraryGlobePlaces} autoRotateSpeed={0.18} />
          <div className="absolute inset-0 bg-background/70" />
        </div>
      )}
      
      {/* Contenu au premier plan - scrollable */}
      <div className="relative z-10 p-4 md:p-6 max-w-6xl mx-auto pb-24">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Calendar className="w-6 h-6 text-primary" />
                {t('tabs.tripPlanner')}
              </CardTitle>
              <CardDescription>
                {tripPlaces.length} {tripPlaces.length === 1 ? 'lieu sélectionné' : 'lieux sélectionnés'}
              </CardDescription>
            </div>
            {tripPlaces.length > 0 && (
              <Button variant="destructive" onClick={clearTrip} size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Tout effacer
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {tripPlaces.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun lieu sélectionné</h3>
              <p className="text-muted-foreground">
                Ajoutez des lieux à votre voyage pour commencer à planifier votre itinéraire
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Route Planner Section */}
              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="w-5 h-5 text-primary" />
                    Planifier le parcours optimisé
                  </CardTitle>
                  <CardDescription>
                    Sélectionnez votre ville de départ pour générer un itinéraire optimisé
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
                        <SelectContent>
                          {availableCities.map(city => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
              {showOptimizedRoute && startingCity && optimizedRoute.length > 0 && (
                <Card className="border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Route className="w-5 h-5" />
                      Itinéraire optimisé ({optimizedRoute.length} étapes)
                    </CardTitle>
                    <CardDescription>
                      Parcours recommandé depuis {startingCity}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {optimizedRoute.map((place, index) => {
                        const isNewCity = index === 0 || 
                          `${place.city}, ${place.country}` !== `${optimizedRoute[index-1]?.city}, ${optimizedRoute[index-1]?.country}`;
                        
                        return (
                          <div key={place.id}>
                            {isNewCity && (
                              <div className="flex items-center gap-2 mb-3 mt-2">
                                <Navigation className="w-4 h-4 text-secondary" />
                                <span className="font-bold text-secondary">
                                  {place.city}, {place.country}
                                </span>
                              </div>
                            )}
                            <div className="flex items-start gap-4 ml-6">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                {index + 1}
                              </div>
                              <div 
                                className="flex-1 flex items-center gap-4 p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                                onClick={() => navigate(`/place/${place.id}`)}
                              >
                                {place.imageUrl && (
                                  <img 
                                    src={resolveImageUrl(place.imageUrl) || place.imageUrl} 
                                    alt={place.name}
                                    className="w-16 h-16 object-cover rounded"
                                    onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                                  />
                                )}
                                <div className="flex-1">
                                  <h4 className="font-semibold">{place.name}</h4>
                                  <p className="text-sm text-muted-foreground line-clamp-1">
                                    {place.description}
                                  </p>
                                  <Badge variant="outline" className="mt-1">{place.points} pts</Badge>
                                </div>
                                {index < optimizedRoute.length - 1 && (
                                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}


              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{tripPlaces.length}</div>
                      <div className="text-sm text-muted-foreground">Lieux</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Navigation className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{Object.keys(placesByCountry).length}</div>
                      <div className="text-sm text-muted-foreground">Pays</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{totalPoints}</div>
                      <div className="text-sm text-muted-foreground">Points potentiels</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* === Optimiser mon itinéraire (real geography) === */}
              {tripPlaces.length >= 2 && (
                <Card className="border-primary/40 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-primary" />
                          Optimiser mon itinéraire
                        </CardTitle>
                        <CardDescription>
                          Réorganise vos étapes selon la géographie réelle pour minimiser les distances.
                        </CardDescription>
                      </div>
                      {!proposedOrder && (
                        <Button
                          onClick={handleProposeOptimization}
                          className="gap-2"
                          disabled={tripPlaces.length < 3}
                        >
                          <Sparkles className="w-4 h-4" />
                          Optimiser mon itinéraire
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  {proposedOrder && proposedPlaces.length > 0 && (
                    <CardContent className="space-y-4">
                      <div className="rounded-lg border border-primary/30 bg-background/60 p-3">
                        <div className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                          <Route className="w-4 h-4" /> Ordre proposé
                        </div>
                        <ol className="space-y-1.5">
                          {proposedPlaces.map((p, i) => (
                            <li key={p.id} className="flex items-center gap-2 text-sm">
                              <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                                {i + 1}
                              </span>
                              <span className="font-medium">{p.name}</span>
                              <span className="text-muted-foreground text-xs">
                                — {p.city}, {p.country}
                              </span>
                              {i < proposedPlaces.length - 1 && (
                                <ArrowRight className="w-3 h-3 text-muted-foreground ml-auto" />
                              )}
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className="flex gap-2 justify-end flex-wrap">
                        <Button variant="outline" onClick={cancelProposedOrder} className="gap-2">
                          <X className="w-4 h-4" /> Annuler
                        </Button>
                        <Button onClick={acceptProposedOrder} className="gap-2">
                          <Check className="w-4 h-4" /> Accepter
                        </Button>
                      </div>
                    </CardContent>
                  )}

                  {/* Manual reorder list — always available, even after accepting */}
                  {!proposedOrder && tripPlaces.length >= 2 && (
                    <CardContent>
                      <div className="text-xs text-muted-foreground mb-2">
                        Ordre actuel — utilisez les flèches pour réorganiser manuellement :
                      </div>
                      <ol className="space-y-1.5">
                        {tripPlaces.map((p, i) => (
                          <li
                            key={p.id}
                            className="flex items-center gap-2 text-sm rounded-md bg-muted/40 px-2 py-1.5"
                          >
                            <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">
                              {i + 1}
                            </span>
                            <span className="font-medium truncate">{p.name}</span>
                            <span className="text-muted-foreground text-xs truncate hidden sm:inline">
                              — {p.city}
                            </span>
                            <div className="ml-auto flex items-center gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={() => moveStop(i, -1)}
                                disabled={i === 0}
                                aria-label="Monter"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={() => moveStop(i, 1)}
                                disabled={i === tripPlaces.length - 1}
                                aria-label="Descendre"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  )}
                </Card>
              )}

              {/* Places by country */}
              <div className="space-y-6">
                {Object.entries(placesByCountry)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([country, places]) => (
                    <div key={country}>
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-xl font-bold">{country}</h3>
                        <Badge variant="secondary">{places.length}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {places.map(place => (
                          <Card 
                            key={place.id} 
                            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => navigate(`/place/${place.id}`)}
                          >
                            {place.imageUrl && (
                              <div className="h-32 overflow-hidden">
                                <img 
                                  src={resolveImageUrl(place.imageUrl) || place.imageUrl} 
                                  alt={place.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                                />
                              </div>
                            )}
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                  <h4 className="font-semibold line-clamp-1">{place.name}</h4>
                                  <p className="text-sm text-muted-foreground">{place.city || place.country}</p>
                                </div>
                                <Badge variant="outline">{place.points} pts</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                {place.description}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFromTrip(place.id);
                                }}
                                className="w-full"
                              >
                                <Trash2 className="w-3 h-3 mr-2" />
                                Retirer
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Saved Restaurants Section - Grouped by City */}
              {filteredRestaurants.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold">Restaurants sauvegardés dans votre itinéraire</h3>
                    <Badge variant="secondary">{filteredRestaurants.length}</Badge>
                  </div>
                  
                  {Object.entries(restaurantsByCity).map(([city, restaurants]) => (
                    <div key={city} className="space-y-3">
                      <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        {city}
                        <Badge variant="outline">{restaurants.length}</Badge>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {restaurants.map((restaurant) => (
                          <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-all">
                            <CardHeader>
                              <div className="flex items-start justify-between gap-2 mb-3">
                                <CardTitle className="flex-1 text-lg">{restaurant.name}</CardTitle>
                                <div className="flex items-center gap-1 text-yellow-500">
                                  <Star className="w-4 h-4 fill-current" />
                                  <span className="text-sm font-semibold">{restaurant.rating}</span>
                                </div>
                              </div>
                              <CardDescription className="flex items-center gap-1">
                                <Utensils className="w-3 h-3" />
                                {restaurant.cuisine}
                              </CardDescription>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {restaurant.type.map((type) => (
                                  <Badge 
                                    key={type} 
                                    variant="outline" 
                                    className={cn('text-xs', getTypeColor(type))}
                                  >
                                    {type}
                                  </Badge>
                                ))}
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {restaurant.description}
                              </p>
                              <div className="flex items-start gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="font-medium">{restaurant.address}</div>
                                  <div className="text-muted-foreground">{restaurant.city}, {restaurant.country}</div>
                                </div>
                              </div>
                              {restaurant.phone && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Phone className="w-4 h-4" />
                                  {restaurant.phone}
                                </div>
                              )}
                              <div className="flex gap-2 pt-2">
                                {restaurant.website && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 gap-2"
                                    onClick={() => window.open(restaurant.website, '_blank')}
                                  >
                                    <Globe className="w-4 h-4" />
                                    Site
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 gap-2"
                                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address + ', ' + restaurant.city)}`, '_blank')}
                                >
                                  <MapPin className="w-4 h-4" />
                                  Itinéraire
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => unsaveRestaurant(restaurant.id)}
                                className="w-full"
                              >
                                <Trash2 className="w-3 h-3 mr-2" />
                                Retirer
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tips */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">💡 Conseils pour votre voyage</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Organisez vos visites par pays pour optimiser vos déplacements</li>
                    <li>• Vérifiez les horaires d'ouverture avant de partir</li>
                    <li>• N'oubliez pas de faire des check-ins pour gagner des points !</li>
                    {savedRestaurants.length > 0 && <li>• Découvrez les restaurants sauvegardés dans vos destinations !</li>}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
      {/* Extra padding to ensure last content is visible above navigation */}
      <div className="h-16" />
    </div>
  );
};

export default TripPlannerTab;
