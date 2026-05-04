import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Sparkles, Heart, Hand } from 'lucide-react';
import { useState } from 'react';
import { CommunityPhotoRow, ReactionKind, toggleReaction } from '@/lib/placePhotos';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

const TRADITION_LABELS: Record<string, string> = {
  christianity: 'Christianisme',
  islam: 'Islam',
  judaism: 'Judaïsme',
  hinduism: 'Hindouisme',
  buddhism: 'Bouddhisme',
  sikhism: 'Sikhisme',
  shinto: 'Shintoïsme',
  taoism: 'Taoïsme',
  indigenous: 'Spiritualités autochtones',
  other: 'Autre',
};

interface Props {
  photo: CommunityPhotoRow;
  myReactions: Set<ReactionKind>;
}

export const CommunityPhotoCard = ({ photo, myReactions }: Props) => {
  const [counts, setCounts] = useState({
    sparkle: photo.reaction_sparkle,
    heart: photo.reaction_heart,
    hands: photo.reaction_hands,
  });
  const [mine, setMine] = useState<Set<ReactionKind>>(new Set(myReactions));

  const handleReact = async (kind: ReactionKind) => {
    const had = mine.has(kind);
    // optimistic
    const nextMine = new Set(mine);
    had ? nextMine.delete(kind) : nextMine.add(kind);
    setMine(nextMine);
    setCounts((c) => ({ ...c, [kind]: Math.max(0, c[kind] + (had ? -1 : 1)) }));

    try {
      await toggleReaction(photo.id, kind);
    } catch (err) {
      // revert
      setMine(new Set(mine));
      setCounts((c) => ({ ...c, [kind]: photo[`reaction_${kind}` as const] }));
      logger.error('[CommunityPhotoCard] reaction failed', err);
      toast.error(err instanceof Error ? err.message : 'Réaction impossible.');
    }
  };

  const location = [photo.city, photo.country].filter(Boolean).join(', ');
  const traditionLabel = photo.tradition ? TRADITION_LABELS[photo.tradition] ?? photo.tradition : null;
  const authorName = photo.author_username ?? 'Pèlerin anonyme';

  return (
    <Card className="overflow-hidden bg-card/60 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
        <img
          src={photo.url}
          alt={photo.place_name}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/place-placeholder.jpg'; }}
        />
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate">{photo.place_name}</h3>
            {location && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{location}</span>
              </p>
            )}
          </div>
          {traditionLabel && (
            <Badge variant="secondary" className="flex-shrink-0 text-[10px]">{traditionLabel}</Badge>
          )}
        </div>

        {photo.caption && (
          <p className="text-sm text-foreground/80 line-clamp-3">{photo.caption}</p>
        )}

        <div className="flex items-center gap-2 pt-1 border-t border-primary/10">
          <Avatar className="w-7 h-7 border border-primary/20">
            <AvatarImage src={photo.author_avatar_url ?? ''} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {authorName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground flex-1 truncate">{authorName}</span>

          <div className="flex items-center gap-1">
            <ReactionButton icon={<Sparkles className="w-4 h-4" />} count={counts.sparkle} active={mine.has('sparkle')} onClick={() => handleReact('sparkle')} />
            <ReactionButton icon={<Heart className="w-4 h-4" />} count={counts.heart} active={mine.has('heart')} onClick={() => handleReact('heart')} />
            <ReactionButton icon={<Hand className="w-4 h-4" />} count={counts.hands} active={mine.has('hands')} onClick={() => handleReact('hands')} />
          </div>
        </div>
      </div>
    </Card>
  );
};

const ReactionButton = ({
  icon, count, active, onClick,
}: { icon: React.ReactNode; count: number; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
      active ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
    }`}
  >
    {icon}
    {count > 0 && <span>{count}</span>}
  </button>
);

export default CommunityPhotoCard;
