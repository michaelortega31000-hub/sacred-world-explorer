import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { getAllPlaces } from '@/data/placesData';
import { MapPin, Trash2, Calendar, Navigation, Route, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getImageUrl } from '@/lib/imageHelper';

const TripPlannerTab = () => {
  const { t } = useTranslation();
  const { userProgress, removeFromTrip, clearTrip } = useApp();
  const [startingCity, setStartingCity] = useState<string>('');
  const [showOptimizedRoute, setShowOptimizedRoute] = useState(false);
  
  // Resolve via shared helper (fuzzy filename support)
  const resolveImageUrl = (url?: string) => (url ? getImageUrl(url) : undefined);
  
  const allPlaces = getAllPlaces();
  const tripPlaces = allPlaces.filter(place => userProgress.tripPlaces?.includes(place.id) ?? false);
  
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

  return (
    <div className="p-6 max-w-6xl mx-auto">
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
                              <div className="flex-1 flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
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
                          <Card key={place.id} className="overflow-hidden">
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
                                onClick={() => removeFromTrip(place.id)}
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

              {/* Tips */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">💡 Conseils pour votre voyage</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Organisez vos visites par pays pour optimiser vos déplacements</li>
                    <li>• Vérifiez les horaires d'ouverture avant de partir</li>
                    <li>• N'oubliez pas de faire des check-ins pour gagner des points !</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TripPlannerTab;
