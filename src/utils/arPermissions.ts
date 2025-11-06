export const checkARSupport = (): {
  isSupported: boolean;
  reason?: string;
} => {
  // Check WebGL
  const canvas = document.createElement('canvas');
  const hasWebGL = !!(
    canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  );

  if (!hasWebGL) {
    return {
      isSupported: false,
      reason: 'WebGL non supporté sur cet appareil',
    };
  }

  // Check DeviceOrientation
  const hasDeviceOrientation = typeof DeviceOrientationEvent !== 'undefined';

  if (!hasDeviceOrientation) {
    return {
      isSupported: false,
      reason: 'Capteurs de mouvement non disponibles',
    };
  }

  return { isSupported: true };
};

export const requestMotionPermission = async (): Promise<{
  granted: boolean;
  error?: string;
}> => {
  // Check if permission API exists (iOS 13+)
  if (
    typeof DeviceOrientationEvent !== 'undefined' &&
    typeof (DeviceOrientationEvent as any).requestPermission === 'function'
  ) {
    try {
      const permission = await (DeviceOrientationEvent as any).requestPermission();
      
      if (permission === 'granted') {
        return { granted: true };
      } else {
        return {
          granted: false,
          error: 'Permission refusée. Activez les capteurs dans les réglages.',
        };
      }
    } catch (error) {
      return {
        granted: false,
        error: 'Erreur lors de la demande de permission',
      };
    }
  }

  // No permission required for non-iOS or older iOS
  return { granted: true };
};
