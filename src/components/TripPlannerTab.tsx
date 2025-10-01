import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { getAllPlaces } from '@/data/placesData';
import { MapPin, Trash2, Calendar, Navigation } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const TripPlannerTab = () => {
  const { t } = useTranslation();
  const { userProgress, removeFromTrip, clearTrip } = useApp();
  
  const allPlaces = getAllPlaces();
  const tripPlaces = allPlaces.filter(place => userProgress.tripPlaces?.includes(place.id) ?? false);
  
  // Group by country
  const placesByCountry = tripPlaces.reduce((acc, place) => {
    if (!acc[place.country]) acc[place.country] = [];
    acc[place.country].push(place);
    return acc;
  }, {} as Record<string, typeof tripPlaces>);

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
                                  src={place.imageUrl} 
                                  alt={place.name}
                                  className="w-full h-full object-cover"
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
