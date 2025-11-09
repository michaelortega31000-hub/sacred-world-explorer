import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Camera } from 'lucide-react';
import { ReligiousSymbol3D } from '@/components/ReligiousSymbol3D';
import { useGeolocation } from '@/hooks/useGeolocation';
import { mockPlaces } from '@/data/placesData';
import CameraPermissionExplainer from '@/components/ar/CameraPermissionExplainer';
import CameraPermissionInstructions from '@/components/ar/CameraPermissionInstructions';
import ARDirectionalGuide from '@/components/ar/ARDirectionalGuide';

interface ARCameraViewProps {
  onClose: () => void;
}

type PermissionState = 'checking' | 'prompt' | 'denied' | 'granted';
type Platform = 'ios' | 'android' | 'desktop';
type Browser = 'safari' | 'chrome' | 'firefox' | 'unknown';

const getPlatform = (): Platform => {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  return 'desktop';
};

const getBrowser = (): Browser => {
  const ua = navigator.userAgent.toLowerCase();
  if (/safari/.test(ua) && !/chrome/.test(ua)) return 'safari';
  if (/chrome/.test(ua)) return 'chrome';
  if (/firefox/.test(ua)) return 'firefox';
  return 'unknown';
};

const checkPermissionState = async (): Promise<PermissionState> => {
  try {
    const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
    return result.state === 'granted' ? 'granted' : result.state === 'denied' ? 'denied' : 'prompt';
  } catch {
    return 'prompt';
  }
};

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
  const [loading, setLoading] = useState(false);
  const [showExplainer, setShowExplainer] = useState(true);
  const [permissionState, setPermissionState] = useState<PermissionState>('checking');
  const [nearbyPlace, setNearbyPlace] = useState<any>(null);
  const { position, error: geoError } = useGeolocation(true);
  
  const platform = getPlatform();
  const browser = getBrowser();

  const requestCameraAccess = async () => {
    console.log('🎥 Requesting camera access...');
    setLoading(true);
    setError(null);
    
    try {
      // ✅ Call getUserMedia IMMEDIATELY without any async checks before
      console.log('📸 Calling getUserMedia directly...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false,
      });
      
      console.log('✅ Camera access granted!', mediaStream);
      
      // Success: setup the stream
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowExplainer(false);
      setLoading(false);
      setPermissionState('granted');
      
    } catch (err: any) {
      // Failed: analyze error and check state AFTER
      console.error('❌ Camera access error:', err.name, err.message);
      setLoading(false);
      
      // NOW check permission state to display proper instructions
      const state = await checkPermissionState();
      setPermissionState(state);
      
      // Determine error type
      if (err.name === 'NotAllowedError') {
        setError('denied');
      } else if (err.name === 'NotFoundError') {
        setError('notfound');
      } else if (err.name === 'NotReadableError') {
        setError('inuse');
      } else {
        setError('unknown');
      }
    }
  };

  // Cleanup: stop camera
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

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
      {/* Explainer screen */}
      {showExplainer && (
        <>
          <CameraPermissionExplainer
            onActivate={requestCameraAccess}
            onCancel={onClose}
          />
          {/* Fallback X button on explainer */}
          {!loading && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-foreground"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </Button>
          )}
        </>
      )}

      {/* Video feed */}
      {!showExplainer && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Loading state */}
      {loading && !showExplainer && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm">
          <div className="text-center">
            <Camera className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-foreground text-lg">Activation de la caméra...</p>
          </div>
        </div>
      )}

      {/* AR Directional Guide & 3D Symbol */}
      {!loading && !error && nearbyPlace && position && (
        <>
          {/* Directional Guide Compass */}
          <ARDirectionalGuide
            targetLat={nearbyPlace.coordinates[1]}
            targetLon={nearbyPlace.coordinates[0]}
            userLat={position.latitude}
            userLon={position.longitude}
            placeName={nearbyPlace.name}
            distance={nearbyPlace.distance}
          />

          {/* 3D Symbol at center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none">
            <ReligiousSymbol3D
              religion={nearbyPlace.religion}
              unlocked={true}
              size="lg"
              intensity={0.6}
            />
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
      {error && !showExplainer && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/98 backdrop-blur-md">
          <div className="text-center p-8 max-w-lg mx-4">
            {/* Icon */}
            <div className="relative mb-6">
              <Camera className="w-20 h-20 text-primary mx-auto animate-pulse" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Accès caméra nécessaire
            </h2>

            {/* Description */}
            <p className="text-muted-foreground mb-6">
              L'AR utilise votre caméra pour superposer des symboles religieux sur votre environnement réel.
            </p>

            {/* Error-specific message */}
            {error === 'notfound' && (
              <p className="text-destructive mb-6">
                Aucune caméra détectée sur cet appareil.
              </p>
            )}
            {error === 'inuse' && (
              <p className="text-destructive mb-6">
                La caméra est déjà utilisée par une autre application.
              </p>
            )}

            {/* Instructions */}
            {error === 'denied' && (
              <CameraPermissionInstructions
                platform={platform}
                browser={browser}
                errorType={permissionState}
              />
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-3 mt-8">
              {error === 'denied' && (
                <Button onClick={requestCameraAccess} size="lg" className="w-full">
                  🔄 Réessayer
                </Button>
              )}
              <Button onClick={handleClose} variant="outline" size="lg" className="w-full">
                Retour à la carte
              </Button>
            </div>

            {/* Help link */}
            {error === 'denied' && (
              <p className="text-xs text-muted-foreground mt-6">
                Les instructions ne fonctionnent pas ? Contactez le support.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ARCameraView;
