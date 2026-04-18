import { useEffect, useState } from 'react';
import { getImageUrl } from '@/lib/imageHelper';

interface HeroSlide {
  name: string;
  city: string;
  image: string;
}

const slides: HeroSlide[] = [
  { name: 'Mont-Saint-Michel', city: 'Normandie', image: '/src/assets/places/mont-saint-michel.jpg' },
  { name: 'Notre-Dame de Paris', city: 'Paris', image: '/src/assets/places/notre-dame.jpg' },
  { name: 'Sanctuaire de Lourdes', city: 'Lourdes', image: '/src/assets/places/lourdes.jpg' },
  { name: 'Sacré-Cœur', city: 'Paris', image: '/src/assets/places/sacre-coeur.jpg' },
  { name: 'Cathédrale de Chartres', city: 'Chartres', image: '/src/assets/places/chartres.jpg' },
  { name: 'Cité du Vatican', city: 'Rome', image: '/src/assets/places/vatican.jpg' },
];

interface HeroCarouselProps {
  className?: string;
}

export const HeroCarousel = ({ className = '' }: HeroCarouselProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`relative w-full h-72 sm:h-96 overflow-hidden rounded-2xl ${className}`}>
      {slides.map((slide, i) => (
        <div
          key={slide.name}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i !== index}
        >
          <img
            src={getImageUrl(slide.image)}
            alt={`${slide.name} – ${slide.city}`}
            className="w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/images/place-placeholder.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-xs uppercase tracking-widest opacity-80">Patrimoine sacré</p>
            <h3 className="text-2xl sm:text-3xl font-bold drop-shadow-lg">{slide.name}</h3>
            <p className="text-sm opacity-90">{slide.city}</p>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Voir la diapositive ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-6 bg-primary' : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
