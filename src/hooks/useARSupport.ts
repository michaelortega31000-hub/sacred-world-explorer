import { useState, useEffect } from 'react';

interface ARSupport {
  isSupported: boolean;
  hasDeviceOrientation: boolean;
  hasWebGL: boolean;
  isIOS: boolean;
  needsPermission: boolean;
}

export const useARSupport = (): ARSupport => {
  const [support, setSupport] = useState<ARSupport>({
    isSupported: false,
    hasDeviceOrientation: false,
    hasWebGL: false,
    isIOS: false,
    needsPermission: false,
  });

  useEffect(() => {
    const checkSupport = () => {
      // Check WebGL support
      const canvas = document.createElement('canvas');
      const hasWebGL = !!(
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      );

      // Check DeviceOrientation support
      const hasDeviceOrientation = typeof DeviceOrientationEvent !== 'undefined';

      // Check if iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

      // Check if permission is required (iOS 13+)
      const needsPermission =
        typeof (DeviceOrientationEvent as any)?.requestPermission === 'function';

      const isSupported = hasWebGL && hasDeviceOrientation;

      setSupport({
        isSupported,
        hasDeviceOrientation,
        hasWebGL,
        isIOS,
        needsPermission,
      });
    };

    checkSupport();
  }, []);

  return support;
};
