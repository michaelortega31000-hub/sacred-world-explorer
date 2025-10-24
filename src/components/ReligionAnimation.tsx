import { useEffect, useState } from 'react';
import { useApp, Religion } from '@/contexts/AppContext';
import angelImg from '@/assets/animations/angel-3d.png';
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
        count: 4,
        size: 'w-32 h-32',
        animationClass: 'animate-angel-orbit'
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

    // Masquer l'animation après 7 secondes d'affichage
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" style={{ perspective: '1000px' }}>
      {Array.from({ length: config.count }).map((_, index) => {
        const delay = index * 0.3;
        const topPosition = 20 + (index * 15);
        
        return (
          <div
            key={index}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div
              className={`${config.size} ${config.animationClass}`}
              style={{
                ['--orbit-radius' as any]: `${28 + index * 6}vh`,
                animationDelay: `${delay}s`,
                opacity: 0.95,
                mixBlendMode: 'screen',
                filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))',
                transformStyle: 'preserve-3d'
              }}
            >
              <img 
                src={config.image} 
                alt=""
                className="w-full h-full object-contain"
                style={{
                  filter: 'brightness(1.3) contrast(1.2) drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))',
                  transformStyle: 'preserve-3d'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
