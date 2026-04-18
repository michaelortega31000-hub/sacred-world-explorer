import crossGolden from '@/assets/icons/cross-golden.png';

interface ChristianIconProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Single, elegant Christian cross used across the app.
 * Replaces the multi-faith ReligionIcon on user-facing surfaces.
 */
export const ChristianIcon = ({ size = 'md', className = '' }: ChristianIconProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-14 h-14',
  };

  return (
    <img
      src={crossGolden}
      alt="Croix chrétienne"
      className={`${sizeClasses[size]} object-contain ${className}`}
    />
  );
};

export default ChristianIcon;
