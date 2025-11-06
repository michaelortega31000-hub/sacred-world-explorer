import { useState, useEffect, useRef } from 'react';
import { Trophy } from 'lucide-react';
import { useBadgeConfetti } from '@/hooks/useBadgeConfetti';

interface Badge3DCardProps {
  icon: string;
  name: string;
  description: string;
  unlockedAt: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  isNew?: boolean;
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
  rarity = 'common',
  isNew = false
}: Badge3DCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showConfetti, setShowConfetti] = useState(isNew);
  const cardRef = useRef<HTMLDivElement>(null);
  const { triggerConfetti } = useBadgeConfetti();
  const styles = rarityStyles[rarity];

  useEffect(() => {
    if (showConfetti && cardRef.current) {
      const timer = setTimeout(() => {
        triggerConfetti(rarity, cardRef.current || undefined);
        setShowConfetti(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [showConfetti, rarity, triggerConfetti]);
  
  return (
    <div
      ref={cardRef}
      className="relative w-full h-48 perspective-1000 group"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => {
        if (!isNew) {
          triggerConfetti(rarity, cardRef.current || undefined);
        }
      }}
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
          {isNew && (
            <div className="absolute -top-2 -right-2 z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-accent rounded-full blur-md opacity-75 animate-pulse" />
                <div className="relative bg-gradient-to-r from-accent to-accent/80 text-accent-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-accent/50 animate-pulse">
                  NOUVEAU
                </div>
              </div>
            </div>
          )}
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
          {isNew && (
            <div className="absolute -top-2 -right-2 z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-accent rounded-full blur-md opacity-75 animate-pulse" />
                <div className="relative bg-gradient-to-r from-accent to-accent/80 text-accent-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-accent/50 animate-pulse">
                  NOUVEAU
                </div>
              </div>
            </div>
          )}
          <div>
            <div className={`text-xs font-bold uppercase mb-2 ${styles.text}`}>
              {rarity}
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-accent/70 font-medium">
              Débloqué le {new Date(unlockedAt).toLocaleDateString('fr-FR')}
            </p>
            {isNew && (
              <p className="text-xs text-accent font-bold animate-pulse">
                ✨ Débloqué récemment !
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
