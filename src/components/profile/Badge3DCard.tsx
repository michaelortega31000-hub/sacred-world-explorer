import { useState } from 'react';
import { Trophy } from 'lucide-react';

interface Badge3DCardProps {
  icon: string;
  name: string;
  description: string;
  unlockedAt: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

const rarityColors = {
  common: 'border-gray-400',
  rare: 'border-blue-500',
  epic: 'border-purple-500',
  legendary: 'border-yellow-500',
};

const rarityGlows = {
  common: 'shadow-gray-400/20',
  rare: 'shadow-blue-500/30',
  epic: 'shadow-purple-500/40',
  legendary: 'shadow-yellow-500/50',
};

export const Badge3DCard = ({ 
  icon, 
  name, 
  description, 
  unlockedAt,
  rarity = 'common'
}: Badge3DCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative w-full h-48 perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 backface-hidden bg-gradient-to-br from-card to-card/50 backdrop-blur-sm rounded-xl border-2 ${rarityColors[rarity]} shadow-lg ${rarityGlows[rarity]} p-6 flex flex-col items-center justify-center`}
        >
          <div className="text-5xl mb-3">{icon}</div>
          <h3 className="font-bold text-foreground text-center">{name}</h3>
          <div className="absolute inset-0 shine-effect pointer-events-none rounded-xl" />
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm rounded-xl border-2 ${rarityColors[rarity]} shadow-lg ${rarityGlows[rarity]} p-6 flex flex-col justify-center`}
        >
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <p className="text-xs text-accent font-medium">
            Débloqué le {new Date(unlockedAt).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  );
};
