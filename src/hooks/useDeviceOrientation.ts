import { useEffect, useState } from 'react';

interface DeviceOrientationData {
  alpha: number | null; // 0-360° (compass direction)
  beta: number | null;  // -180 to 180° (front-back tilt)
  gamma: number | null; // -90 to 90° (left-right tilt)
  isAvailable: boolean;
  hasPermission: boolean;
}

export const useDeviceOrientation = (enabled: boolean = false) => {
  const [orientation, setOrientation] = useState<DeviceOrientationData>({
    alpha: null,
    beta: null,
    gamma: null,
    isAvailable: false,
    hasPermission: false,
  });

  useEffect(() => {
    if (!enabled) return;

    // Check if DeviceOrientationEvent is supported
    if (typeof DeviceOrientationEvent === 'undefined') {
      console.warn('DeviceOrientationEvent is not supported');
      return;
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
        isAvailable: true,
        hasPermission: true,
      });
    };

    // Check if permission is required (iOS 13+)
    if (
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      // iOS 13+ requires explicit permission
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
            setOrientation((prev) => ({ ...prev, hasPermission: true }));
          } else {
            console.warn('DeviceOrientation permission denied');
            setOrientation((prev) => ({ ...prev, hasPermission: false }));
          }
        })
        .catch((error: Error) => {
          console.error('Error requesting DeviceOrientation permission:', error);
        });
    } else {
      // Non-iOS or older iOS - permission not required
      window.addEventListener('deviceorientation', handleOrientation);
      setOrientation((prev) => ({ ...prev, hasPermission: true }));
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [enabled]);

  return orientation;
};

export const requestDeviceOrientationPermission = async (): Promise<boolean> => {
  if (typeof DeviceOrientationEvent === 'undefined') {
    return false;
  }

  if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
    try {
      const permissionState = await (DeviceOrientationEvent as any).requestPermission();
      return permissionState === 'granted';
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  }

  // Permission not required
  return true;
};
