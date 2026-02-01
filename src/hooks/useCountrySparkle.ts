import confetti from 'canvas-confetti';
import { useApp } from '@/contexts/AppContext';
import { sparkleColorPalettes } from '@/types/globeSettings';

export const useCountrySparkle = () => {
  const { userProgress } = useApp();
  const globeSettings = userProgress.globeSettings;

  const triggerSparkle = (x: number, y: number) => {
    // Check if sparkle is enabled
    if (!globeSettings.sparkleEnabled) {
      return;
    }

    // Position normalisée (0-1) pour canvas-confetti
    const originX = x / window.innerWidth;
    const originY = y / window.innerHeight;

    // Get colors based on user preference
    const colors = sparkleColorPalettes[globeSettings.sparkleColor];
    const secondaryColors = globeSettings.sparkleColor === 'rainbow' 
      ? colors 
      : [colors[0], '#FFFFFF', colors[2] || colors[1]];

    // Premier burst - étoiles
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { x: originX, y: originY },
      colors: colors,
      shapes: ['star'],
      scalar: 0.8,
      gravity: 0.6,
      ticks: 80,
      startVelocity: 15,
    });

    // Deuxième burst légèrement décalé - effet pétillant
    setTimeout(() => {
      confetti({
        particleCount: 15,
        spread: 40,
        origin: { x: originX, y: originY },
        colors: secondaryColors,
        shapes: ['circle'],
        scalar: 0.5,
        gravity: 0.4,
        ticks: 60,
        startVelocity: 10,
      });
    }, 50);
  };

  return { triggerSparkle };
};
