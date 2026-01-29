import confetti from 'canvas-confetti';

export const useCountrySparkle = () => {
  const triggerSparkle = (x: number, y: number) => {
    // Position normalisée (0-1) pour canvas-confetti
    const originX = x / window.innerWidth;
    const originY = y / window.innerHeight;

    // Premier burst - étoiles dorées
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { x: originX, y: originY },
      colors: ['#F4C542', '#FFD700', '#FFF8E1', '#FFFFFF'],
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
        colors: ['#34E0A1', '#FFFFFF', '#F4C542'],
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
