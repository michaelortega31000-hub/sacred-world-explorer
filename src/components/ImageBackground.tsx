import { useState, useEffect } from 'react';

interface ImageBackgroundProps {
  images: string | string[];
  overlay?: 'dark' | 'light' | 'gradient' | 'none';
  blur?: number;
  parallax?: boolean;
  carousel?: boolean;
  carouselInterval?: number;
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
        {imageArray.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: parallaxTransform,
              transition: parallax ? 'transform 0.1s ease-out' : undefined
            }}
          >
            <img
              src={img}
              alt="Background"
              className="w-full h-full object-cover"
              style={{
                filter: blur > 0 ? `blur(${blur}px)` : undefined
              }}
              loading="lazy"
            />
          </div>
        ))}
        {/* Overlay */}
        <div className={`absolute inset-0 ${overlayStyles[overlay]}`} />
      </div>

      {/* Contenu */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
