import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Check } from 'lucide-react';

interface RewardCardProps {
  icon: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  type: string;
  isUnlocked: boolean;
  isEquipped?: boolean;
  onEquip?: () => void;
}

const rarityColors = {
  common: 'border-muted text-muted-foreground',
  rare: 'border-primary text-primary',
  epic: 'border-purple-500 text-purple-400',
  legendary: 'border-accent text-accent',
};

const rarityGradients = {
  common: 'from-muted/10 to-muted/5',
  rare: 'from-primary/10 to-primary/5',
  epic: 'from-purple-500/10 to-purple-500/5',
  legendary: 'from-accent/20 to-accent/5',
};

const rarityLabels = {
  common: 'Commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire',
};

export const RewardCard = ({
  icon,
  name,
  description,
  rarity,
  type,
  isUnlocked,
  isEquipped,
  onEquip,
}: RewardCardProps) => {
  return (
    <Card
      className={`relative p-4 bg-gradient-to-br ${rarityGradients[rarity]} backdrop-blur-sm border-2 ${rarityColors[rarity]} transition-all duration-300 ${
        isUnlocked ? 'hover:scale-105 cursor-pointer' : 'opacity-60'
      } ${isEquipped ? 'ring-2 ring-primary shadow-lg' : ''}`}
      onClick={isUnlocked && onEquip ? onEquip : undefined}
    >
      {/* Rarity badge */}
      <div className="absolute -top-2 -right-2">
        <Badge
          className={`text-xs ${rarityColors[rarity]} bg-card`}
        >
          {rarityLabels[rarity]}
        </Badge>
      </div>

      {/* Locked/Equipped indicator */}
      {!isUnlocked && (
        <div className="absolute top-2 left-2">
          <div className="bg-card/80 backdrop-blur-sm rounded-full p-1.5">
            <Lock className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      )}
      {isEquipped && (
        <div className="absolute top-2 left-2">
          <div className="bg-primary rounded-full p-1.5">
            <Check className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
      )}

      <div className="flex flex-col items-center text-center space-y-2 mt-2">
        <div className={`text-5xl ${!isUnlocked ? 'grayscale' : ''}`}>
          {icon}
        </div>
        <div>
          <h3 className={`font-bold ${rarityColors[rarity]}`}>{name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <Badge variant="outline" className="text-xs capitalize">
          {type}
        </Badge>
        {isEquipped && (
          <Badge className="text-xs bg-primary">
            Équipé
          </Badge>
        )}
      </div>
    </Card>
  );
};
