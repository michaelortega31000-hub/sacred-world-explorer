import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getBadgeForPlace } from '@/data/christianBadges';
import { PlacePhoto } from '@/components/quest/PlacePhoto';
import type { Place, PlaceCategory, Religion } from '@/contexts/AppContext';

interface PlaceCardProps {
  id: string;
  name: string;
  city: string;
  country: string;
  religion?: string;
  imageUrl?: string;
  unlocked?: boolean;
  distance?: number; // in meters
  proximityIntensity?: number; // 0-100
  /** Optional extra fields used by the badge condition matcher. */
  type?: string;
  placeCategory?: PlaceCategory;
  tags?: string[];
}

const PlaceCard = ({
  id,
  name,
  city,
  country,
  religion,
  imageUrl,
  unlocked = false,
  distance,
  proximityIntensity = 0,
  type,
  placeCategory,
  tags
}: PlaceCardProps) => {
  const navigate = useNavigate();

  // Phase 3 — Christian badge lookup with fallback to generic "DÉBLOQUÉ".
  const matchedBadge = unlocked
    ? getBadgeForPlace({
        id,
        name,
        city,
        country,
        religion: religion as Religion,
        type: type ?? '',
        placeCategory,
        tags,
        description: '',
        points: 0,
        coordinates: [0, 0],
      } as Place)
    : null;
  const unlockedLabel = matchedBadge ? `${matchedBadge.icon} ${matchedBadge.label.toUpperCase()}` : '✓ DÉBLOQUÉ';

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group relative">
      {/* Background image — falls back to typographic symbol on error/missing */}
      <div
        className="relative h-48 overflow-hidden transition-transform duration-500 group-hover:scale-110"
        style={{ filter: unlocked ? 'brightness(1)' : 'brightness(0.6) grayscale(50%)' }}
      >
        <PlacePhoto
          src={imageUrl}
          alt={name}
          type={type}
          name={name}
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Distance indicator */}
        {distance !== undefined && (
          <div className="absolute top-4 right-4 z-10">
            <Badge 
              variant={proximityIntensity > 70 ? 'default' : 'secondary'}
              className="gap-1 animate-pulse"
            >
              <MapPin className="w-3 h-3" />
              {formatDistance(distance)}
            </Badge>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute bottom-4 left-4 z-10">
          <Badge 
            variant={unlocked ? 'default' : 'outline'}
            className={unlocked ? 'bg-amber-500 text-white border-amber-400' : 'bg-background/80'}
          >
            {unlocked ? unlockedLabel : 'À DÉCOUVRIR'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {city}, {country}
          </p>
        </div>

        <Button 
          onClick={() => navigate(`/place/${id}`)}
          variant="outline" 
          className="w-full gap-2"
        >
          <Info className="w-4 h-4" />
          Infos culturelles
        </Button>
      </div>
    </Card>
  );
};

export default PlaceCard;
