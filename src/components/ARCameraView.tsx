import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Camera, AlertTriangle } from 'lucide-react';
import { ReligiousSymbol3D } from '@/components/ReligiousSymbol3D';
import { useGeolocation } from '@/hooks/useGeolocation';
import { mockPlaces } from '@/data/placesData';

interface ARCameraViewProps {
  onClose: () => void;
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth radius in meters
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

const ARCameraView = ({ onClose }: ARCameraViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [nearbyPlace, setNearbyPlace] = useState<any>(null);
  const { position, error: geoError } = useGeolocation(true);

  // Start camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        if (err.name === 'NotAllowedError') {
          setError('Accès à la caméra refusé. Autorisez l\'accès dans les paramètres.');
        } else if (err.name === 'NotFoundError') {
          setError('Aucune caméra détectée sur cet appareil.');
        } else if (err.name === 'NotReadableError') {
          setError('La caméra est déjà utilisée par une autre application.');
        } else {
          setError('Erreur lors de l\'accès à la caméra.');
        }
      }
    };

    startCamera();

    // Cleanup: stop camera
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Find nearby place
  useEffect(() => {
    if (position) {
      const placesWithDistance = mockPlaces
        .map(place => ({
          ...place,
          distance: calculateDistance(
            position.latitude,
            position.longitude,
            place.coordinates[0],
            place.coordinates[1]
          )
        }))
        .filter(place => place.distance < 5000) // Within 5km
        .sort((a, b) => a.distance - b.distance);

      if (placesWithDistance.length > 0) {
        setNearbyPlace(placesWithDistance[0]);
      }
    }
  }, [position]);

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  return (
    <div className="relative w-full h-full bg-background overflow-hidden">
      {/* Video feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm">
          <div className="text-center">
            <Camera className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-foreground text-lg">Activation de la caméra...</p>
          </div>
        </div>
      )}

      {/* 3D Symbol overlay */}
      {!loading && !error && nearbyPlace && (
        <>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 sm:w-96 sm:h-96">
              <ReligiousSymbol3D
                religion={nearbyPlace.religion}
                unlocked={true}
                size="lg"
                intensity={0.8}
              />
            </div>
          </div>

          {/* Place info at bottom */}
          <div className="absolute bottom-20 left-4 right-4 bg-background/80 backdrop-blur-md rounded-xl p-4 border border-border/50 shadow-xl">
            <h3 className="text-foreground font-bold text-lg mb-1">{nearbyPlace.name}</h3>
            <p className="text-muted-foreground text-sm mb-2">{nearbyPlace.type}</p>
            <p className="text-muted-foreground text-xs">
              Distance: {(nearbyPlace.distance / 1000).toFixed(2)} km
            </p>
          </div>
        </>
      )}

      {/* No nearby places */}
      {!loading && !error && !nearbyPlace && position && (
        <div className="absolute bottom-20 left-4 right-4 bg-background/80 backdrop-blur-md rounded-xl p-4 border border-border/50 shadow-xl">
          <p className="text-muted-foreground text-center">
            Aucun lieu sacré dans un rayon de 5 km
          </p>
        </div>
      )}

      {/* Geolocation error */}
      {!loading && !error && geoError && (
        <div className="absolute bottom-20 left-4 right-4 bg-destructive/80 backdrop-blur-md rounded-xl p-4 border border-destructive shadow-xl">
          <p className="text-destructive-foreground text-center text-sm">
            {geoError.message}
          </p>
        </div>
      )}

      {/* Instructions */}
      {!loading && !error && !nearbyPlace && !geoError && (
        <div className="absolute top-20 left-4 right-4 bg-background/80 backdrop-blur-md rounded-xl p-4 border border-border/50 shadow-xl">
          <p className="text-foreground text-center text-sm">
            📍 Recherche de lieux sacrés à proximité...
          </p>
        </div>
      )}

      {/* Close button */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 z-50 bg-background/70 backdrop-blur-sm border-border hover:bg-background/90 w-12 h-12"
        onClick={handleClose}
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm">
          <div className="text-center p-6 max-w-md">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <p className="text-foreground mb-6 text-lg">{error}</p>
            <Button onClick={handleClose} size="lg">
              Retour à la carte
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARCameraView;
