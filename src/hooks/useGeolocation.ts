import { useState, useEffect } from 'react';

export interface UserGeolocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}

export const useGeolocation = (enabled: boolean = false) => {
  const [position, setPosition] = useState<UserGeolocation | null>(null);
  const [error, setError] = useState<GeolocationError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!enabled) {
      setPosition(null);
      setError(null);
      setLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      setError({
        code: 0,
        message: 'La géolocalisation n\'est pas supportée par votre navigateur'
      });
      return;
    }

    setLoading(true);

    const handleSuccess = (pos: GeolocationPosition) => {
      setPosition({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp
      });
      setError(null);
      setLoading(false);
    };

    const handleError = (err: GeolocationPositionError) => {
      let message = 'Erreur de géolocalisation';
      
      switch(err.code) {
        case err.PERMISSION_DENIED:
          message = 'Permission de géolocalisation refusée';
          break;
        case err.POSITION_UNAVAILABLE:
          message = 'Position non disponible';
          break;
        case err.TIMEOUT:
          message = 'Délai de géolocalisation dépassé';
          break;
      }

      setError({
        code: err.code,
        message
      });
      setLoading(false);
    };

    // Obtenir la position initiale
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });

    // Suivre la position en continu
    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [enabled]);

  return { position, error, loading };
};
