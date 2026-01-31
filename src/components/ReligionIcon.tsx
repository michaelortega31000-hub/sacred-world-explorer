import type { Religion } from '@/contexts/AppContext';
import crossGolden from '@/assets/icons/cross-golden.png';
import crescent from '@/assets/animations/crescent.png';
import starDavid from '@/assets/animations/star-david.png';
import lotus from '@/assets/animations/lotus.png';
import om from '@/assets/animations/om.png';
import spirit from '@/assets/animations/spirit.png';
import stars from '@/assets/animations/stars.png';

const religionImages: Record<Religion, string> = {
  christianity: crossGolden,
  islam: crescent,
  judaism: starDavid,
  buddhism: lotus,
  hinduism: om,
  traditional: spirit,
  atheism: stars,
  astronomy: stars,
};

interface ReligionIconProps {
  religion: Religion;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ReligionIcon = ({ religion, size = 'md', className = '' }: ReligionIconProps) => {
  const imageSrc = religionImages[religion];
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  return (
    <img 
      src={imageSrc} 
      alt={religion} 
      className={`${sizeClasses[size]} object-contain ${className}`}
    />
  );
};

export default ReligionIcon;
