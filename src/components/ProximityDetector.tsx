import { useEffect, useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { mockPlaces } from '@/data/placesData';
import PlaceCard from './PlaceCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Navigation } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const ProximityDetector = () => {
  const { position, error } = useGeolocation(true);
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

  if (error) {
    return (
      <Alert variant="destructive">
        <MapPin className="h-4 w-4" />
        <AlertDescription>
          {error.message}. Activez la géolocalisation pour voir les lieux proches.
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
      <Alert>
        <MapPin className="h-4 w-4" />
        <AlertDescription>
          Aucun lieu sacré à proximité (dans un rayon de 10km).
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="w-4 h-4" />
        <span>{nearbyPlaces.length} lieux trouvés près de vous</span>
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
