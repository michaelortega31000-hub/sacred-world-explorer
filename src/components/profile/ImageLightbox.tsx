import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{ url: string; name: string; id: string }>;
  currentIndex: number;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export const ImageLightbox = ({ 
  isOpen, 
  onClose, 
  images, 
  currentIndex,
  onNavigate 
}: ImageLightboxProps) => {
  const currentImage = images[currentIndex];
  
  if (!currentImage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-0">
        <div className="relative w-full h-full flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </Button>

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
                onClick={() => onNavigate('prev')}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
                onClick={() => onNavigate('next')}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          <img
            src={currentImage.url}
            alt={currentImage.name}
            className="max-w-full max-h-[90vh] object-contain"
          />

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <h3 className="text-white text-xl font-semibold">{currentImage.name}</h3>
            <p className="text-white/70 text-sm mt-1">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
