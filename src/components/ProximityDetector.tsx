import { useEffect, useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { mockPlaces } from '@/data/placesData';
import PlaceCard from './PlaceCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Loader2, Settings } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const ProximityDetector = () => {
  const [permissionRequested, setPermissionRequested] = useState(false);
  const { position, error, loading, permissionState } = useGeolocation(permissionRequested);
  const { userProgress } = useApp();
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Calculate proximity intensity (0-100) based on distance
  const calculateIntensity = (distance: number) => {
    const maxDistance = 5000; // 5km
    const minDistance = 50; // 50m for max intensity
    
    if (distance <= minDistance) return 100;
    if (distance >= maxDistance) return 0;
    
    // Logarithmic scale for more dramatic effect when close
    const normalized = (maxDistance - distance) / (maxDistance - minDistance);
    return Math.round(Math.pow(normalized, 0.5) * 100);
  };

  useEffect(() => {
    if (!position) return;

    const placesWithDistance = mockPlaces.map(place => {
      const coords = Array.isArray(place.coordinates) 
        ? { lng: place.coordinates[0], lat: place.coordinates[1] }
        : place.coordinates as { lat: number; lng: number };
      const distance = calculateDistance(
        position.latitude,
        position.longitude,
        coords.lat,
        coords.lng
      );

      return {
        ...place,
        distance,
        proximityIntensity: calculateIntensity(distance),
        unlocked: userProgress.visitedPlaces.includes(place.id)
      };
    });

    // Sort by distance and take only places within 10km
    const nearby = placesWithDistance
      .filter(p => p.distance <= 10000)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 20);

    setNearbyPlaces(nearby);
  }, [position, userProgress.visitedPlaces]);

  // Show activation screen if permission not yet requested
  if (!permissionRequested) {
    return (
      <Card className="p-6 text-center border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Découvrez les lieux sacrés autour de vous</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Activez la géolocalisation pour voir les monuments religieux à proximité de votre position actuelle.
        </p>
        <Button onClick={() => setPermissionRequested(true)} size="lg">
          <Navigation className="w-4 h-4 mr-2" />
          Activer la localisation
        </Button>
      </Card>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <Card className="p-6 text-center border-primary/20">
        <Loader2 className="w-8 h-8 mx-auto mb-4 text-primary animate-spin" />
        <p className="text-muted-foreground">Recherche de votre position...</p>
      </Card>
    );
  }

  // Show error state with instructions
  if (error) {
    const isDenied = error.code === 1;
    return (
      <Alert variant={isDenied ? "destructive" : "default"} className="border-2">
        <MapPin className="h-4 w-4" />
        <AlertDescription className="space-y-3">
          <p className="font-medium">{error.message}</p>
          {isDenied && (
            <div className="text-xs space-y-2 mt-2 p-3 bg-muted/50 rounded-md">
              <p className="font-medium flex items-center gap-2">
                <Settings className="w-3 h-3" />
                Pour activer la géolocalisation :
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Cliquez sur l'icône 🔒 dans la barre d'adresse</li>
                <li>Recherchez "Localisation" ou "Position"</li>
                <li>Sélectionnez "Autoriser"</li>
                <li>Actualisez la page</li>
              </ul>
            </div>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setPermissionRequested(false);
              setTimeout(() => setPermissionRequested(true), 100);
            }}
            className="mt-2"
          >
            <Navigation className="w-3 h-3 mr-2" />
            Réessayer
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!position) {
    return (
      <Alert>
        <Navigation className="h-4 w-4 animate-pulse" />
        <AlertDescription>
          Recherche de votre position...
        </AlertDescription>
      </Alert>
    );
  }

  if (nearbyPlaces.length === 0) {
    return (
      <Card className="p-6 text-center border-primary/20">
        <MapPin className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Aucun lieu sacré à proximité</h3>
        <p className="text-muted-foreground">
          Aucun monument trouvé dans un rayon de 10km autour de votre position.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
        <MapPin className="w-4 h-4 text-primary" />
        <span><strong>{nearbyPlaces.length}</strong> lieux trouvés près de vous</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nearbyPlaces.map(place => (
          <PlaceCard
            key={place.id}
            id={place.id}
            name={place.name}
            city={place.city}
            country={place.country}
            religion={place.religion}
            imageUrl={place.imageUrl}
            unlocked={place.unlocked}
            distance={place.distance}
            proximityIntensity={place.proximityIntensity}
          />
        ))}
      </div>
    </div>
  );
};

export default ProximityDetector;
