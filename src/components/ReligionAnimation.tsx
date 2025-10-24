import { useEffect, useState } from 'react';
import { useApp, Religion } from '@/contexts/AppContext';
import angelImg from '@/assets/animations/angel.png';
import crescentImg from '@/assets/animations/crescent.png';
import starDavidImg from '@/assets/animations/star-david.png';
import lotusImg from '@/assets/animations/lotus.png';
import omImg from '@/assets/animations/om.png';
import starsImg from '@/assets/animations/stars.png';
import spiritImg from '@/assets/animations/spirit.png';

interface ReligionAnimationConfig {
  image: string;
  count: number;
  size: string;
  animationClass: string;
}

const getReligionAnimation = (religion: Religion | null): ReligionAnimationConfig => {
  switch (religion) {
    case 'christianity':
      return {
        image: angelImg,
        count: 3,
        size: 'w-24 h-24',
        animationClass: 'animate-angel-fly'
      };
    case 'islam':
      return {
        image: crescentImg,
        count: 4,
        size: 'w-20 h-20',
        animationClass: 'animate-crescent-float'
      };
    case 'judaism':
      return {
        image: starDavidImg,
        count: 3,
        size: 'w-20 h-20',
        animationClass: 'animate-star-rotate'
      };
    case 'buddhism':
      return {
        image: lotusImg,
        count: 4,
        size: 'w-24 h-24',
        animationClass: 'animate-lotus-float'
      };
    case 'hinduism':
      return {
        image: omImg,
        count: 3,
        size: 'w-24 h-24',
        animationClass: 'animate-om-pulse'
      };
    case 'astronomy':
      return {
        image: starsImg,
        count: 5,
        size: 'w-16 h-16',
        animationClass: 'animate-stars-twinkle'
      };
    default:
      return {
        image: spiritImg,
        count: 3,
        size: 'w-20 h-20',
        animationClass: 'animate-spirit-glow'
      };
  }
};

export const ReligionAnimation = () => {
  const { userProgress } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const config = getReligionAnimation(userProgress.selectedReligion);

  useEffect(() => {
    // Afficher l'animation 3 secondes après le montage
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    // Masquer l'animation après 2.5 secondes d'affichage
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 5500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: config.count }).map((_, index) => {
        const delay = index * 0.3;
        const topPosition = 20 + (index * 15);
        
        return (
          <div
            key={index}
            className={`absolute ${config.size} ${config.animationClass}`}
            style={{
              top: `${topPosition}%`,
              animationDelay: `${delay}s`,
              opacity: 0.9
            }}
          >
            <img 
              src={config.image} 
              alt="spiritual animation" 
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        );
      })}
    </div>
  );
};
