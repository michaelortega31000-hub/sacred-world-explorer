import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, CheckCircle2, Lock } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getPlaceById, mockPlaces } from '@/data/placesData';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
}

const NearMeFeature = () => {
  const { userProgress } = useApp();
  const { toast } = useToast();
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [checking, setChecking] = useState(false);

  const requestLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      const msg = userProgress.language === 'fr' 
        ? 'La géolocalisation n\'est pas supportée par votre navigateur'
        : 'Geolocation is not supported by your browser';
      setError(msg);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setLoading(false);
        findNearbyPlaces(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        const msg = userProgress.language === 'fr'
          ? 'Autorisez la localisation pour débloquer les lieux autour de vous.'
          : 'Allow location to discover sacred places near you.';
        setError(msg);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const findNearbyPlaces = (lat: number, lon: number) => {
    const nearby = mockPlaces
      .map((place) => {
        // coordinates are [longitude, latitude]
        const distance = calculateDistance(lat, lon, place.coordinates[1], place.coordinates[0]);
        return { ...place, distance };
      })
      .filter((place) => place.distance <= 5000) // Within 5km
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);

    setNearbyPlaces(nearby);
  };

  const handleCheckIn = async (placeId: string, distance: number) => {
    if (!position) return;

    setChecking(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Not authenticated');

      const place = getPlaceById(placeId);
      if (!place) throw new Error('Place not found');

      // Use secure verify-visit edge function instead of direct insert
      const { data, error } = await supabase.functions.invoke('verify-visit', {
        body: {
          placeId,
          placeCoordinates: place.coordinates,
          placePoints: 50,
          userLat: position.latitude,
          userLon: position.longitude,
        },
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: userProgress.language === 'fr' ? 'Visite vérifiée !' : 'Visit verified!',
          description: userProgress.language === 'fr' 
            ? `+${data.pointsAwarded} points gagnés` 
            : `+${data.pointsAwarded} points earned`,
        });
      } else {
        throw new Error(data?.error || 'Verification failed');
      }
    } catch (error: any) {
      // Queue for offline sync if no network
      if (!navigator.onLine) {
        toast({
          title: userProgress.language === 'fr' ? 'Hors ligne' : 'Offline',
          description: userProgress.language === 'fr'
            ? 'La visite sera synchronisée quand vous serez en ligne'
            : 'Visit will be synced when you\'re online',
        });
      } else {
        const message = error?.message || 'Unable to verify visit';
        toast({
          title: userProgress.language === 'fr' ? 'Erreur' : 'Error',
          description: userProgress.language === 'fr'
            ? message.includes('distance') ? 'Vous êtes trop loin du lieu' : 'Impossible de vérifier la visite'
            : message,
          variant: 'destructive',
        });
      }
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {userProgress.language === 'fr' ? 'Autour de moi' : 'Near Me'}
          </CardTitle>
          <CardDescription>
            {userProgress.language === 'fr'
              ? 'Découvrez les lieux sacrés à proximité'
              : 'Discover sacred places nearby'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!position && !error && (
            <Button onClick={requestLocation} disabled={loading} className="w-full gap-2">
              <MapPin className="w-4 h-4" />
              {loading
                ? (userProgress.language === 'fr' ? 'Localisation...' : 'Locating...')
                : (userProgress.language === 'fr' ? 'Activer la localisation' : 'Enable Location')}
            </Button>
          )}

          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={requestLocation}
                className="mt-2"
              >
                {userProgress.language === 'fr' ? 'Réessayer' : 'Try Again'}
              </Button>
            </div>
          )}

          {position && nearbyPlaces.length > 0 && (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {nearbyPlaces.map((place) => {
                  const canCheckIn = place.distance <= 500;
                  return (
                    <Card key={place.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">{place.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {place.city}, {place.country}
                          </p>
                          <Badge variant={canCheckIn ? 'default' : 'secondary'}>
                            {Math.round(place.distance)}m
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleCheckIn(place.id, place.distance)}
                          disabled={!canCheckIn || checking}
                          className="gap-2"
                        >
                          {canCheckIn ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              {userProgress.language === 'fr' ? 'Vérifier' : 'Check-in'}
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3" />
                              {userProgress.language === 'fr' ? 'Trop loin' : 'Too far'}
                            </>
                          )}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          )}

          {position && nearbyPlaces.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              {userProgress.language === 'fr'
                ? 'Aucun lieu sacré à proximité'
                : 'No sacred places nearby'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NearMeFeature;
