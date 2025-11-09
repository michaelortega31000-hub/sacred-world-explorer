import { useEffect, useState } from 'react';
import { Navigation, MapPin } from 'lucide-react';
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation';

interface ARDirectionalGuideProps {
  targetLat: number;
  targetLon: number;
  userLat: number;
  userLon: number;
  placeName: string;
  distance: number;
}

const ARDirectionalGuide = ({
  targetLat,
  targetLon,
  userLat,
  userLon,
  placeName,
  distance,
}: ARDirectionalGuideProps) => {
  const { alpha, beta, gamma } = useDeviceOrientation();
  const [bearing, setBearing] = useState<number>(0);
  const [arrowRotation, setArrowRotation] = useState<number>(0);

  // Calculate bearing (azimuth) from user to target
  useEffect(() => {
    const calculateBearing = () => {
      const lat1 = (userLat * Math.PI) / 180;
      const lat2 = (targetLat * Math.PI) / 180;
      const lon1 = (userLon * Math.PI) / 180;
      const lon2 = (targetLon * Math.PI) / 180;

      const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
      const x =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
      
      let brng = Math.atan2(y, x);
      brng = (brng * 180) / Math.PI;
      brng = (brng + 360) % 360; // Normalize to 0-360

      setBearing(brng);
    };

    calculateBearing();
  }, [userLat, userLon, targetLat, targetLon]);

  // Calculate arrow rotation based on device orientation and bearing
  useEffect(() => {
    if (alpha !== null) {
      // alpha is compass heading (0-360)
      // Calculate rotation: bearing - device heading
      let rotation = bearing - alpha;
      
      // Normalize to -180 to 180
      if (rotation > 180) rotation -= 360;
      if (rotation < -180) rotation += 360;
      
      setArrowRotation(rotation);
    }
  }, [alpha, bearing]);

  const formatDistance = (dist: number) => {
    if (dist < 1000) {
      return `${Math.round(dist)}m`;
    }
    return `${(dist / 1000).toFixed(1)}km`;
  };

  return (
    <div className="fixed top-1/4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
      {/* Main compass container */}
      <div className="relative w-48 h-48">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/30 backdrop-blur-sm bg-background/10" />
        
        {/* Inner ring */}
        <div className="absolute inset-4 rounded-full border-2 border-primary/20" />
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
        
        {/* Directional arrow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(-50%, -50%) rotate(${arrowRotation}deg)`,
          }}
        >
          <Navigation
            className="w-20 h-20 text-primary drop-shadow-lg"
            fill="currentColor"
            strokeWidth={1.5}
          />
        </div>

        {/* Cardinal directions */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-foreground/80">
          N
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold text-foreground/80">
          S
        </div>
        <div className="absolute top-1/2 -left-8 -translate-y-1/2 text-xs font-bold text-foreground/80">
          W
        </div>
        <div className="absolute top-1/2 -right-8 -translate-y-1/2 text-xs font-bold text-foreground/80">
          E
        </div>
      </div>

      {/* Info panel below compass */}
      <div className="mt-4 text-center backdrop-blur-md bg-background/80 rounded-2xl p-4 border border-border/50 shadow-xl">
        <div className="flex items-center justify-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground text-sm">
            {placeName}
          </span>
        </div>
        <div className="text-2xl font-bold text-primary">
          {formatDistance(distance)}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Bearing: {Math.round(bearing)}°
        </div>
      </div>
    </div>
  );
};

export default ARDirectionalGuide;
