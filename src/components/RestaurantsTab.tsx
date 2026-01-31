import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Globe, Star, Utensils, Bookmark, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { AddRestaurantDialog } from './AddRestaurantDialog';
import { logger } from '@/lib/logger';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { calculateDistanceInKm } from '@/lib/geoUtils';

type RestaurantType = 'all' | 'halal' | 'kosher' | 'vegetarian' | 'vegan' | 'neutral';

interface RestaurantCoordinates {
  lat: number;
  lng: number;
}

interface Restaurant {
  id: string;
  name: string;
  type: RestaurantType[];
  cuisine: string;
  address: string;
  city: string;
  country: string;
  continent: string | null;
  phone?: string;
  rating: number;
  website?: string;
  description: string;
  coordinates?: RestaurantCoordinates;
  distance?: number; // Distance in km from the place
}

interface RestaurantsTabProps {
  country?: string;
  city?: string;
  placeCoordinates?: [number, number]; // [longitude, latitude]
  maxDistanceKm?: number;
}

const DEFAULT_MAX_DISTANCE_KM = 50;

const RestaurantsTab = ({ 
  country, 
  city, 
  placeCoordinates, 
  maxDistanceKm = DEFAULT_MAX_DISTANCE_KM 
}: RestaurantsTabProps) => {
  const { t } = useTranslation();
  const { userProgress, saveRestaurant, unsaveRestaurant } = useApp();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<RestaurantType>('all');
  const [selectedContinent, setSelectedContinent] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>(country || 'all');
  const [selectedCity, setSelectedCity] = useState<string>(city || 'all');
  const [isProximityMode, setIsProximityMode] = useState(!!placeCoordinates);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [continents, setContinents] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [cityRestaurantCounts, setCityRestaurantCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Filter restaurants by proximity when coordinates are provided
  const filterByProximity = (
    allRestaurants: Restaurant[],
    centerCoords: [number, number],
    maxKm: number
  ): Restaurant[] => {
    const [centerLng, centerLat] = centerCoords;
    
    return allRestaurants
      .filter(r => {
        if (!r.coordinates) return false;
        const distance = calculateDistanceInKm(
          centerLat,
          centerLng,
          r.coordinates.lat,
          r.coordinates.lng
        );
        return distance <= maxKm;
      })
      .map(r => ({
        ...r,
        distance: r.coordinates 
          ? calculateDistanceInKm(centerLat, centerLng, r.coordinates.lat, r.coordinates.lng)
          : undefined
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  };

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      // If in proximity mode, fetch all restaurants with coordinates
      if (isProximityMode && placeCoordinates) {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('verified', true)
          .not('coordinates', 'is', null);

        if (error) throw error;

        const allRestaurants = (data || []).map(r => {
          const coords = r.coordinates as { lat?: number; lng?: number } | null;
          return {
            ...r,
            coordinates: coords && typeof coords.lat === 'number' && typeof coords.lng === 'number'
              ? { lat: coords.lat, lng: coords.lng }
              : undefined
          };
        }) as Restaurant[];

        const nearbyRestaurants = filterByProximity(allRestaurants, placeCoordinates, maxDistanceKm);
        setRestaurants(nearbyRestaurants);
      } else {
        // Standard filtering by location
        let query = supabase
          .from('restaurants')
          .select('*')
          .eq('verified', true);

        if (selectedContinent !== 'all') {
          query = query.eq('continent', selectedContinent);
        }

        if (selectedCountry !== 'all') {
          query = query.eq('country', selectedCountry);
        }

        if (selectedCity !== 'all') {
          query = query.eq('city', selectedCity);
        }

        const { data, error } = await query;

        if (error) throw error;

        const mappedRestaurants = (data || []).map(r => {
          const coords = r.coordinates as { lat?: number; lng?: number } | null;
          return {
            ...r,
            coordinates: coords && typeof coords.lat === 'number' && typeof coords.lng === 'number'
              ? { lat: coords.lat, lng: coords.lng }
              : undefined
          };
        }) as Restaurant[];

        setRestaurants(mappedRestaurants);
      }
    } catch (error) {
      logger.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContinents = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('continent')
        .eq('verified', true);

      if (error) throw error;

      const uniqueContinents = [...new Set(data?.map(r => r.continent).filter(Boolean) || [])];
      setContinents(uniqueContinents as string[]);
    } catch (error) {
      logger.error('Error fetching continents:', error);
    }
  };

  const fetchCountries = async () => {
    try {
      let query = supabase
        .from('restaurants')
        .select('country')
        .eq('verified', true);

      if (selectedContinent !== 'all') {
        query = query.eq('continent', selectedContinent);
      }

      const { data, error } = await query;

      if (error) throw error;

      const uniqueCountries = [...new Set(data?.map(r => r.country) || [])];
      setCountries(uniqueCountries);
    } catch (error) {
      logger.error('Error fetching countries:', error);
    }
  };

  const fetchCities = async () => {
    try {
      let query = supabase
        .from('restaurants')
        .select('city')
        .eq('verified', true);

      if (selectedContinent !== 'all') {
        query = query.eq('continent', selectedContinent);
      }

      if (selectedCountry !== 'all') {
        query = query.eq('country', selectedCountry);
      }

      const { data, error } = await query;

      if (error) throw error;

      const uniqueCities = [...new Set(data?.map(r => r.city) || [])];
      setCities(uniqueCities);

      // Compter les restaurants par ville
      const counts: Record<string, number> = {};
      for (const cityName of uniqueCities) {
        let countQuery = supabase
          .from('restaurants')
          .select('id', { count: 'exact', head: true })
          .eq('verified', true)
          .eq('city', cityName);

        if (selectedContinent !== 'all') {
          countQuery = countQuery.eq('continent', selectedContinent);
        }

        if (selectedCountry !== 'all') {
          countQuery = countQuery.eq('country', selectedCountry);
        }

        const { count } = await countQuery;
        counts[cityName] = count || 0;
      }
      setCityRestaurantCounts(counts);
    } catch (error) {
      logger.error('Error fetching cities:', error);
    }
  };

  // Initialize mode based on coordinates
  useEffect(() => {
    setIsProximityMode(!!placeCoordinates);
  }, [placeCoordinates]);

  useEffect(() => {
    if (!isProximityMode) {
      fetchContinents();
    }
  }, [isProximityMode]);

  useEffect(() => {
    if (!isProximityMode && selectedContinent === 'all') {
      setSelectedCountry('all');
      setSelectedCity('all');
    }
    if (!isProximityMode) {
      fetchCountries();
    }
  }, [selectedContinent, isProximityMode]);

  useEffect(() => {
    if (!isProximityMode && selectedCountry === 'all') {
      setSelectedCity('all');
    }
    if (!isProximityMode) {
      fetchCities();
    }
  }, [selectedCountry, selectedContinent, isProximityMode]);

  useEffect(() => {
    fetchRestaurants();
  }, [selectedContinent, selectedCountry, selectedCity, isProximityMode, placeCoordinates]);

  const filteredRestaurants = selectedType === 'all' 
    ? restaurants 
    : restaurants.filter(r => r.type.includes(selectedType));

  const filterButtons: { type: RestaurantType; label: string; emoji: string }[] = [
    { type: 'all', label: 'Tous', emoji: '🍽️' },
    { type: 'halal', label: 'Halal', emoji: '☪️' },
    { type: 'kosher', label: 'Cachère', emoji: '✡️' },
    { type: 'vegetarian', label: 'Végétarien', emoji: '🥗' },
    { type: 'vegan', label: 'Vegan', emoji: '🌱' },
    { type: 'neutral', label: 'Neutre', emoji: '🍴' },
  ];

  const getTypeColor = (type: RestaurantType) => {
    const colors = {
      halal: 'bg-green-500/20 text-green-700 border-green-500/30',
      kosher: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
      vegetarian: 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30',
      vegan: 'bg-lime-500/20 text-lime-700 border-lime-500/30',
      neutral: 'bg-slate-500/20 text-slate-700 border-slate-500/30',
      all: 'bg-primary/20 text-primary border-primary/30',
    };
    return colors[type];
  };

  const handleSaveRestaurant = (restaurantId: string, restaurantName: string) => {
    const isSaved = userProgress.savedRestaurants.includes(restaurantId);
    
    if (isSaved) {
      unsaveRestaurant(restaurantId);
      toast({
        title: 'Restaurant retiré',
        description: `${restaurantName} a été retiré de vos favoris`,
      });
    } else {
      saveRestaurant(restaurantId);
      toast({
        title: 'Restaurant sauvegardé',
        description: `${restaurantName} a été ajouté à vos favoris`,
      });
    }
  };

  const handleExitProximityMode = () => {
    setIsProximityMode(false);
    setSelectedContinent('all');
    setSelectedCountry(country || 'all');
    setSelectedCity('all');
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Utensils className="w-8 h-8 text-primary" />
            Restaurants
          </h2>
          <p className="text-muted-foreground">
            {isProximityMode 
              ? `Restaurants dans un rayon de ${maxDistanceKm}km` 
              : 'Découvrez les restaurants disponibles dans le monde'
            }
          </p>
        </div>
        <AddRestaurantDialog onSuccess={fetchRestaurants} />
      </div>

      {/* Proximity Mode Banner */}
      {isProximityMode && (
        <div className="mb-6 p-4 bg-primary/10 border-2 border-primary/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Navigation className="w-5 h-5 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Mode proximité activé</p>
              <p className="text-sm text-muted-foreground">
                Affichage des restaurants dans un rayon de {maxDistanceKm}km du lieu sélectionné
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleExitProximityMode}>
            Voir tous les restaurants
          </Button>
        </div>
      )}

      {/* Location Filters - Hidden in proximity mode */}
      {!isProximityMode && (
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Select value={selectedContinent} onValueChange={setSelectedContinent}>
              <SelectTrigger className="bg-card border-border">
                <SelectValue placeholder="Sélectionner un continent" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                <SelectItem value="all">Tous les continents</SelectItem>
                {continents.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="bg-card border-border">
                <SelectValue placeholder="Sélectionner un pays" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                <SelectItem value="all">Tous les pays</SelectItem>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="bg-card border-border">
                <SelectValue placeholder="Sélectionner une ville" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                <SelectItem value="all">Toutes les villes</SelectItem>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c} {cityRestaurantCounts[c] && (
                      <span className="text-muted-foreground ml-2">
                        ({cityRestaurantCounts[c]})
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Type Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {filterButtons.map((filter) => (
          <Button
            key={filter.type}
            onClick={() => setSelectedType(filter.type)}
            variant={selectedType === filter.type ? 'default' : 'outline'}
            className={cn(
              'gap-2 transition-all',
              selectedType === filter.type && 'shadow-lg scale-105'
            )}
          >
            <span>{filter.emoji}</span>
            {filter.label}
            {filter.type !== 'all' && (
              <Badge variant="secondary" className="ml-1">
                {restaurants.filter(r => r.type.includes(filter.type)).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-muted-foreground">
        {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'restaurant trouvé' : 'restaurants trouvés'}
        {isProximityMode && ` dans un rayon de ${maxDistanceKm}km`}
      </div>

      {/* Restaurants list */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chargement des restaurants...</p>
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <Card className="p-8 text-center">
          <Utensils className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {isProximityMode 
              ? `Aucun restaurant dans un rayon de ${maxDistanceKm}km`
              : 'Aucun restaurant trouvé'
            }
          </h3>
          <p className="text-muted-foreground mb-6">
            {isProximityMode 
              ? 'Soyez le premier à ajouter un restaurant près de ce lieu !'
              : 'Aucun restaurant ne correspond à vos critères de recherche.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <AddRestaurantDialog onSuccess={fetchRestaurants} />
            {isProximityMode && (
              <Button variant="outline" onClick={handleExitProximityMode}>
                Voir tous les restaurants
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <CardTitle className="flex-1 text-lg">{restaurant.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {restaurant.distance !== undefined && (
                      <Badge variant="outline" className="text-xs">
                        {restaurant.distance < 1 
                          ? `${Math.round(restaurant.distance * 1000)}m`
                          : `${restaurant.distance.toFixed(1)}km`
                        }
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold">{restaurant.rating}</span>
                    </div>
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
                      {filterButtons.find(f => f.type === type)?.emoji} {filterButtons.find(f => f.type === type)?.label}
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
                    <div className="text-muted-foreground">{restaurant.city}</div>
                  </div>
                </div>
                {restaurant.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {restaurant.phone}
                  </div>
                )}
              </CardContent>
              <CardFooter className="gap-2 flex-wrap">
                <Button
                  variant={userProgress.savedRestaurants.includes(restaurant.id) ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                  onClick={() => handleSaveRestaurant(restaurant.id, restaurant.name)}
                >
                  <Bookmark className={cn("w-4 h-4", userProgress.savedRestaurants.includes(restaurant.id) && "fill-current")} />
                  {userProgress.savedRestaurants.includes(restaurant.id) ? 'Sauvegardé' : 'Sauvegarder'}
                </Button>
                {restaurant.website && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => window.open(restaurant.website, '_blank')}
                  >
                    <Globe className="w-4 h-4" />
                    Site web
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
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Info note */}
      <div className="mt-8 p-6 bg-primary/5 border-2 border-primary/20 rounded-xl">
        <div className="flex gap-3">
          <Utensils className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Base de données collaborative
            </h4>
            <p className="text-sm text-muted-foreground">
              Cette liste est maintenue par notre communauté. N'hésitez pas à nous suggérer de nouveaux restaurants ou à signaler des informations incorrectes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantsTab;
