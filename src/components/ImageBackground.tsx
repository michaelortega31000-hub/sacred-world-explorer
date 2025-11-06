import { useState, useEffect } from 'react';

interface ImageBackgroundProps {
  images: string | string[];
  overlay?: 'dark' | 'light' | 'gradient' | 'none';
  blur?: number;
  parallax?: boolean;
  carousel?: boolean;
  carouselInterval?: number;
  particles?: boolean;
  particleCount?: number;
  className?: string;
  children: React.ReactNode;
}

export const ImageBackground = ({ 
  images, 
  overlay = 'gradient', 
  blur = 0,
  parallax = false,
  carousel = false,
  carouselInterval = 8000,
  particles = false,
  particleCount = 20,
  className = '',
  children 
}: ImageBackgroundProps) => {
  const imageArray = Array.isArray(images) ? images : [images];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  // Carousel automatique
  useEffect(() => {
    if (!carousel || imageArray.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageArray.length);
    }, carouselInterval);
    return () => clearInterval(interval);
  }, [carousel, imageArray.length, carouselInterval]);

  // Effet parallax
  useEffect(() => {
    if (!parallax) return;
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [parallax]);

  const overlayStyles = {
    dark: 'bg-black/60',
    light: 'bg-white/40',
    gradient: 'bg-gradient-to-b from-black/70 via-black/50 to-black/70',
    none: ''
  };

  const parallaxTransform = parallax ? `translateY(${scrollY * 0.5}px)` : 'none';

  return (
    <div className={`relative ${className}`}>
      {/* Image de fond */}
      <div className="absolute inset-0 overflow-hidden">
        {imageArray.map((img, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transform: parallaxTransform,
                transition: parallax ? 'transform 0.1s ease-out' : undefined
              }}
            >
              <img
                src={img}
                alt="Background"
                className={`w-full h-full object-cover ${
                  isActive ? 'animate-ken-burns' : ''
                }`}
                style={{
                  filter: blur > 0 ? `blur(${blur}px)` : undefined,
                  animation: isActive && carousel ? 'ken-burns 15s ease-in-out infinite alternate' : undefined
                }}
                loading="lazy"
              />
            </div>
          );
        })}
        {/* Overlay */}
        <div className={`absolute inset-0 ${overlayStyles[overlay]}`} />
        
        {/* Particules flottantes */}
        {particles && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: particleCount }).map((_, i) => {
              const size = Math.random() * 4 + 2;
              const left = Math.random() * 100;
              const top = Math.random() * 100;
              const duration = Math.random() * 10 + 8;
              const delay = Math.random() * 5;
              const isGolden = Math.random() > 0.5;
              
              return (
                <div
                  key={i}
                  className={`absolute rounded-full ${
                    isGolden ? 'bg-sacred-gold/40' : 'bg-sacred-turquoise/30'
                  } animate-float-particle`}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${left}%`,
                    top: `${top}%`,
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`,
                    boxShadow: isGolden 
                      ? '0 0 10px hsl(var(--sacred-gold) / 0.6), 0 0 20px hsl(var(--sacred-gold) / 0.3)'
                      : '0 0 8px hsl(var(--sacred-turquoise) / 0.5), 0 0 16px hsl(var(--sacred-turquoise) / 0.2)'
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
