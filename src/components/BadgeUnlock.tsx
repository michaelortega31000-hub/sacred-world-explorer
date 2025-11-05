import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ReligiousSymbol from './ReligiousSymbol';
import { Sparkles } from 'lucide-react';

interface BadgeUnlockProps {
  isOpen: boolean;
  onClose: () => void;
  badgeType: string;
  religion?: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  placeName?: string;
}

const BadgeUnlock = ({
  isOpen,
  onClose,
  badgeType,
  religion,
  tier,
  placeName
}: BadgeUnlockProps) => {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowParticles(true);
      const timer = setTimeout(() => {
        setShowParticles(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const getTierColor = () => {
    switch (tier) {
      case 'bronze':
        return 'from-amber-600 to-amber-800';
      case 'silver':
        return 'from-gray-300 to-gray-500';
      case 'gold':
        return 'from-yellow-400 to-yellow-600';
      case 'platinum':
        return 'from-blue-300 to-blue-500';
      case 'diamond':
        return 'from-cyan-300 to-purple-500';
      default:
        return 'from-amber-600 to-amber-800';
    }
  };

  const getTierLabel = () => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md overflow-hidden border-2 border-amber-500/50 bg-gradient-to-b from-background to-background/80">
        {/* Particles background */}
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-amber-400 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}

        <div className="relative space-y-6 py-8">
          {/* Title */}
          <div className="text-center space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-amber-500 animate-pulse" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Badge Débloqué !
            </h2>
          </div>

          {/* Religious Symbol */}
          <div className="flex justify-center py-4">
            <div className="relative">
              <ReligiousSymbol 
                religion={religion} 
                unlocked={true}
                size="lg"
                intensity={100}
              />
              
              {/* Tier badge */}
              <div 
                className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getTierColor()} shadow-lg`}
              >
                {getTierLabel()}
              </div>
            </div>
          </div>

          {/* Badge info */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">{badgeType}</h3>
            {placeName && (
              <p className="text-sm text-muted-foreground">
                Obtenu à {placeName}
              </p>
            )}
            {religion && (
              <p className="text-sm text-muted-foreground capitalize">
                Tradition : {religion}
              </p>
            )}
          </div>

          {/* Light rays effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-amber-500/20 via-transparent to-transparent animate-pulse" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BadgeUnlock;
