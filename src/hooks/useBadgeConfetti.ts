import confetti from 'canvas-confetti';

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

const rarityConfettiConfig = {
  common: {
    particleCount: 30,
    spread: 40,
    colors: ['#9ca3af', '#d1d5db', '#6b7280'],
  },
  rare: {
    particleCount: 50,
    spread: 60,
    colors: ['hsl(173, 80%, 40%)', 'hsl(173, 58%, 39%)', 'hsl(142, 76%, 36%)'],
  },
  epic: {
    particleCount: 80,
    spread: 80,
    colors: ['#a855f7', '#c084fc', '#e879f9'],
  },
  legendary: {
    particleCount: 150,
    spread: 120,
    colors: ['hsl(48, 96%, 53%)', 'hsl(45, 93%, 47%)', 'hsl(43, 96%, 56%)'],
    scalar: 1.5,
  },
};

export const useBadgeConfetti = () => {
  const triggerConfetti = (rarity: Rarity, element?: HTMLElement) => {
    const config = rarityConfettiConfig[rarity];
    
    if (!element) {
      confetti({
        ...config,
        origin: { x: 0.5, y: 0.5 },
        gravity: 1,
        ticks: 200,
        scalar: 'scalar' in config ? config.scalar : 1,
      });
      return;
    }

    const rect = element.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      ...config,
      origin: { x, y },
      gravity: 1,
      ticks: 200,
      scalar: 'scalar' in config ? config.scalar : 1,
    });

    if (rarity === 'legendary') {
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 360,
          colors: config.colors,
          origin: { x, y },
          gravity: 0.8,
          ticks: 150,
          scalar: 1.2,
        });
      }, 150);
    }
  };

  const triggerMultipleConfetti = (rarity: Rarity) => {
    const config = rarityConfettiConfig[rarity];
    const count = rarity === 'legendary' ? 5 : rarity === 'epic' ? 3 : 2;
    
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        confetti({
          ...config,
          origin: { 
            x: Math.random() * 0.4 + 0.3, 
            y: Math.random() * 0.4 + 0.3 
          },
          gravity: 1,
          ticks: 200,
        });
      }, i * 100);
    }
  };

  return { triggerConfetti, triggerMultipleConfetti };
};
