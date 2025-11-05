import { Star, Moon } from 'lucide-react';
import angelIcon from '@/assets/animations/angel.png';
import crescentIcon from '@/assets/animations/crescent.png';
import lotusIcon from '@/assets/animations/lotus.png';
import omIcon from '@/assets/animations/om.png';
import starDavidIcon from '@/assets/animations/star-david.png';
import starsIcon from '@/assets/animations/stars.png';

interface ReligiousSymbolProps {
  religion?: string;
  unlocked?: boolean;
  size?: 'sm' | 'md' | 'lg';
  intensity?: number; // 0-100 for proximity-based glow
}

const ReligiousSymbol = ({ 
  religion = 'christianity', 
  unlocked = false,
  size = 'md',
  intensity = 100 
}: ReligiousSymbolProps) => {
  const getSymbolImage = () => {
    switch (religion?.toLowerCase()) {
      case 'islam':
        return crescentIcon;
      case 'judaism':
        return starDavidIcon;
      case 'buddhism':
        return lotusIcon;
      case 'hinduism':
        return omIcon;
      case 'astronomy':
        return starsIcon;
      case 'christianity':
      default:
        return angelIcon;
    }
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  };

  const glowIntensity = unlocked ? intensity : 0;
  const opacity = unlocked ? 1 : 0.4;

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings */}
      <div 
        className="absolute inset-0 rounded-full animate-pulse"
        style={{
          background: `radial-gradient(circle, rgba(251, 191, 36, ${glowIntensity / 200}) 0%, transparent 70%)`,
          filter: `blur(${glowIntensity / 10}px)`,
          transform: `scale(${1 + glowIntensity / 100})`,
          transition: 'all 0.5s ease-out'
        }}
      />
      
      {/* Middle glow */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(251, 191, 36, ${glowIntensity / 150}) 0%, transparent 60%)`,
          filter: `blur(${glowIntensity / 15}px)`,
          transform: `scale(${1 + glowIntensity / 150})`,
          transition: 'all 0.5s ease-out'
        }}
      />

      {/* Symbol container with golden halo */}
      <div 
        className={`relative ${sizeClasses[size]} rounded-full flex items-center justify-center transition-all duration-500`}
        style={{
          opacity,
          boxShadow: unlocked 
            ? `0 0 ${glowIntensity / 2}px rgba(251, 191, 36, ${glowIntensity / 100}),
               0 0 ${glowIntensity}px rgba(251, 191, 36, ${glowIntensity / 150}),
               inset 0 0 ${glowIntensity / 3}px rgba(251, 191, 36, ${glowIntensity / 200})`
            : 'none',
          filter: unlocked ? 'brightness(1.2)' : 'grayscale(100%)',
          transform: unlocked ? 'scale(1)' : 'scale(0.9)'
        }}
      >
        <img 
          src={getSymbolImage()} 
          alt={religion}
          className="w-full h-full object-contain animate-[spin_20s_linear_infinite]"
          style={{
            animationPlayState: unlocked ? 'running' : 'paused'
          }}
        />
      </div>

      {/* Sparkle particles when unlocked */}
      {unlocked && glowIntensity > 70 && (
        <>
          <div className="absolute top-0 left-1/4 w-1 h-1 bg-amber-300 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
          <div className="absolute top-1/4 right-0 w-1 h-1 bg-amber-300 rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
          <div className="absolute bottom-0 right-1/4 w-1 h-1 bg-amber-300 rounded-full animate-ping" style={{ animationDelay: '0.6s' }} />
          <div className="absolute bottom-1/4 left-0 w-1 h-1 bg-amber-300 rounded-full animate-ping" style={{ animationDelay: '0.9s' }} />
        </>
      )}
    </div>
  );
};

export default ReligiousSymbol;
