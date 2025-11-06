import { useEffect, useState } from 'react';
import { MapPin, Navigation, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface AROverlayProps {
  placeName: string;
  placeLocation: string;
  placePoints: number;
  userPosition: { latitude: number; longitude: number } | null;
  placePosition: { latitude: number; longitude: number };
  unlocked: boolean;
}

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const calculateBearing = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);

  return ((θ * 180) / Math.PI + 360) % 360;
};

export const AROverlay = ({
  placeName,
  placeLocation,
  placePoints,
  userPosition,
  placePosition,
  unlocked,
}: AROverlayProps) => {
  const [distance, setDistance] = useState<number | null>(null);
  const [bearing, setBearing] = useState<number | null>(null);
  const [direction, setDirection] = useState<string>('');

  useEffect(() => {
    if (!userPosition) return;

    const dist = calculateDistance(
      userPosition.latitude,
      userPosition.longitude,
      placePosition.latitude,
      placePosition.longitude
    );

    const bear = calculateBearing(
      userPosition.latitude,
      userPosition.longitude,
      placePosition.latitude,
      placePosition.longitude
    );

    setDistance(dist);
    setBearing(bear);

    // Convert bearing to cardinal direction
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(bear / 45) % 8;
    setDirection(directions[index]);
  }, [userPosition, placePosition]);

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top overlay - Place info */}
      <div className="absolute top-4 left-4 right-4 pointer-events-auto">
        <Card className="bg-background/80 backdrop-blur-sm border-primary/20 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-1">{placeName}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{placeLocation}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-primary font-bold">
              <Award className="w-5 h-5" />
              <span>{placePoints} pts</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom overlay - Distance and direction */}
      {userPosition && distance !== null && (
        <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
          <Card className="bg-background/80 backdrop-blur-sm border-primary/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
                  <div className="absolute inset-2 rounded-full bg-primary/40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Navigation
                      className="w-6 h-6 text-primary"
                      style={{
                        transform: bearing !== null ? `rotate(${bearing}deg)` : undefined,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {formatDistance(distance)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Direction: {direction}
                  </div>
                </div>
              </div>

              {!unlocked && distance <= 100 && (
                <div className="text-right">
                  <div className="text-sm font-medium text-green-500">
                    ✓ À portée!
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Prêt à valider
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
