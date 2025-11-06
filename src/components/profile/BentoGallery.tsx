import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { ImageLightbox } from './ImageLightbox';

interface BentoGalleryProps {
  places: Array<{ id: string; name: string; imageUrl: string }>;
  maxDisplay?: number;
}

export const BentoGallery = ({ places, maxDisplay = 9 }: BentoGalleryProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayPlaces = places.slice(0, maxDisplay);
  const images = displayPlaces.map(p => ({ url: p.imageUrl, name: p.name, id: p.id }));

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const navigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <>
      <Card className="p-6 bg-card/80 backdrop-blur-sm border-primary/20">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          Lieux visités ({places.length})
        </h3>
        <div className="grid grid-cols-3 gap-2 auto-rows-[120px]">
          {displayPlaces.map((place, index) => {
            const isLarge = index === 0 || index === 4;
            return (
              <div
                key={place.id}
                className={`relative rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                  isLarge ? 'col-span-2 row-span-2' : ''
                }`}
                onClick={() => openLightbox(index)}
              >
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span className="text-white text-sm font-medium line-clamp-2">
                    {place.name}
                  </span>
                </div>
                <div className="absolute inset-0 shine-effect pointer-events-none" />
              </div>
            );
          })}
        </div>
      </Card>

      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={images}
        currentIndex={currentIndex}
        onNavigate={navigate}
      />
    </>
  );
};
