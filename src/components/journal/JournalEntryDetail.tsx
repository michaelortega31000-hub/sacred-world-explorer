import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { X, MapPin, Calendar, Star, Camera, FileText, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { JournalEntry } from '@/hooks/useTravelJournal';
import { getPlaceImage } from '@/lib/imageHelper';

interface JournalEntryDetailProps {
  entry: JournalEntry | null;
  open: boolean;
  onClose: () => void;
}

const JournalEntryDetail: React.FC<JournalEntryDetailProps> = ({ entry, open, onClose }) => {
  const navigate = useNavigate();

  if (!entry) return null;

  const handleViewPlace = () => {
    onClose();
    navigate(`/place/${entry.placeId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] p-0 overflow-hidden">
        {/* Hero image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={getPlaceImage(entry.place)}
            alt={entry.place.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/images/place-placeholder.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm text-white hover:bg-black/50"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Title overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <Badge variant="secondary" className="mb-2 text-xs">
              {entry.place.type}
            </Badge>
            <h2 className="text-xl font-bold text-white">{entry.place.name}</h2>
            <div className="flex items-center gap-2 mt-1 text-white/80 text-sm">
              <MapPin className="w-3 h-3" />
              {entry.place.city}, {entry.place.country}
            </div>
          </div>
        </div>

        <ScrollArea className="max-h-[calc(85vh-12rem)]">
          <div className="p-4 space-y-4">
            {/* Visit info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="w-4 h-4" />
                Visité le {format(entry.visitedAt, 'd MMMM yyyy', { locale: fr })}
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold">{entry.place.points} pts</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-medium text-foreground mb-2">À propos</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {entry.place.description}
              </p>
            </div>

            {/* Photos */}
            {entry.photos.length > 0 && (
              <div>
                <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Photos ({entry.photos.length})
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {entry.photos.slice(0, 6).map((photo, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                {entry.photos.length > 6 && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    +{entry.photos.length - 6} autres photos
                  </p>
                )}
              </div>
            )}

            {/* Memories */}
            {entry.memories.length > 0 && (
              <div>
                <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Souvenirs ({entry.memories.length})
                </h3>
                <div className="space-y-2">
                  {entry.memories.map(memory => (
                    <div 
                      key={memory.id}
                      className="p-3 bg-muted/50 rounded-lg"
                    >
                      {memory.title && (
                        <h4 className="font-medium text-sm text-foreground mb-1">{memory.title}</h4>
                      )}
                      {memory.content && (
                        <p className="text-xs text-muted-foreground">{memory.content}</p>
                      )}
                      <p className="text-[10px] text-muted-foreground/70 mt-2">
                        {format(memory.createdAt, 'd MMM yyyy', { locale: fr })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action button */}
            <Button 
              className="w-full gap-2" 
              variant="outline"
              onClick={handleViewPlace}
            >
              <ExternalLink className="w-4 h-4" />
              Voir la fiche du lieu
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default JournalEntryDetail;
