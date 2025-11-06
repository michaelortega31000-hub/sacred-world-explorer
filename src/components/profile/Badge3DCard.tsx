import { useState } from 'react';
import { Trophy } from 'lucide-react';

interface Badge3DCardProps {
  icon: string;
  name: string;
  description: string;
  unlockedAt: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

const rarityStyles = {
  common: {
    border: 'border-muted',
    bg: 'from-muted/20 to-muted/5',
    glow: 'shadow-muted/10',
    text: 'text-muted-foreground',
  },
  rare: {
    border: 'border-primary',
    bg: 'from-primary/20 to-primary/5',
    glow: 'shadow-primary/30 shadow-lg',
    text: 'text-primary',
  },
  epic: {
    border: 'border-purple-500',
    bg: 'from-purple-500/20 to-purple-500/5',
    glow: 'shadow-purple-500/40 shadow-xl',
    text: 'text-purple-400',
  },
  legendary: {
    border: 'border-accent animate-pulse',
    bg: 'from-accent/30 to-accent/10',
    glow: 'shadow-accent/50 shadow-2xl',
    text: 'text-accent',
  },
};

export const Badge3DCard = ({ 
  icon, 
  name, 
  description, 
  unlockedAt,
  rarity = 'common'
}: Badge3DCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const styles = rarityStyles[rarity];
  
  return (
    <div
      className="relative w-full h-48 perspective-1000 group"
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
          className={`absolute inset-0 backface-hidden bg-gradient-to-br ${styles.bg} backdrop-blur-sm rounded-xl border-2 ${styles.border} ${styles.glow} p-6 flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105`}
        >
          <div className="text-5xl mb-3 drop-shadow-lg">{icon}</div>
          <h3 className={`font-bold text-center ${styles.text}`}>{name}</h3>
          <div className="absolute inset-0 shine-effect pointer-events-none rounded-xl" />
          {rarity === 'legendary' && (
            <div className="absolute inset-0 rounded-xl opacity-50" 
              style={{
                background: 'radial-gradient(circle at 50% 50%, hsl(var(--accent) / 0.3), transparent)',
                animation: 'glow-pulse 2s ease-in-out infinite'
              }}
            />
          )}
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br ${styles.bg} backdrop-blur-sm rounded-xl border-2 ${styles.border} ${styles.glow} p-6 flex flex-col justify-between`}
        >
          <div>
            <div className={`text-xs font-bold uppercase mb-2 ${styles.text}`}>
              {rarity}
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <p className="text-xs text-accent/70 font-medium">
            Débloqué le {new Date(unlockedAt).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  );
};
