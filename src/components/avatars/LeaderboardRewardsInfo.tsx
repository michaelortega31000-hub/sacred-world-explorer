import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Medal, Trophy, Sparkles } from 'lucide-react';

export const LeaderboardRewardsInfo = () => {
  const rewards = [
    {
      rank: 1,
      icon: Crown,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500',
      name: 'Champion Collectionneur',
      description: 'Avatar légendaire exclusif',
      badge: '🥇'
    },
    {
      rank: 2,
      icon: Medal,
      color: 'text-gray-400',
      bgColor: 'bg-gray-400/10',
      borderColor: 'border-gray-400',
      name: 'Vice-Champion Collectionneur',
      description: 'Avatar légendaire exclusif',
      badge: '🥈'
    },
    {
      rank: 3,
      icon: Medal,
      color: 'text-amber-600',
      bgColor: 'bg-amber-600/10',
      borderColor: 'border-amber-600',
      name: 'Médaille de Bronze',
      description: 'Avatar épique exclusif',
      badge: '🥉'
    }
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 backdrop-blur-sm border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="w-8 h-8 text-primary" />
        <div>
          <h3 className="text-xl font-bold">Récompenses du Classement</h3>
          <p className="text-sm text-muted-foreground">
            Atteignez le top 3 pour débloquer des avatars exclusifs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rewards.map((reward) => {
          const Icon = reward.icon;
          return (
            <Card
              key={reward.rank}
              className={`p-4 ${reward.bgColor} border-2 ${reward.borderColor} hover:scale-105 transition-all`}
            >
              <div className="flex items-center justify-between mb-3">
                <Badge variant="secondary" className="text-lg">
                  {reward.badge} #{reward.rank}
                </Badge>
                <Icon className={`w-6 h-6 ${reward.color}`} />
              </div>
              
              <h4 className="font-bold mb-1">{reward.name}</h4>
              <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
              
              <div className="flex items-center gap-2 text-xs">
                <Sparkles className={`w-4 h-4 ${reward.color}`} />
                <span className="text-muted-foreground">
                  Avatar exclusif du top 3
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-background/50 rounded-lg border border-border/50">
        <p className="text-sm text-muted-foreground text-center">
          💡 Les récompenses sont débloquées automatiquement quand vous atteignez le top 3 du classement
        </p>
      </div>
    </Card>
  );
};
