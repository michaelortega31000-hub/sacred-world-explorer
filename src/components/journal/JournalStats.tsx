import React from 'react';
import { MapPin, Globe, Trophy, Camera, Flame, Flag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { JournalStats as Stats } from '@/hooks/useTravelJournal';

interface JournalStatsProps {
  stats: Stats;
}

const JournalStats: React.FC<JournalStatsProps> = ({ stats }) => {
  const statItems = [
    {
      icon: MapPin,
      label: 'Lieux visités',
      value: stats.totalPlaces,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Globe,
      label: 'Pays explorés',
      value: stats.totalCountries,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10'
    },
    {
      icon: Trophy,
      label: 'Points gagnés',
      value: stats.totalPoints,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10'
    },
    {
      icon: Camera,
      label: 'Photos',
      value: stats.totalPhotos,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Flame,
      label: 'Meilleure série',
      value: stats.longestStreak,
      suffix: 'j',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Main stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statItems.map((item, index) => (
          <Card 
            key={item.label} 
            className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
          >
            <CardContent className="p-3 text-center">
              <div className={`w-10 h-10 mx-auto rounded-full ${item.bgColor} flex items-center justify-center mb-2`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {item.value}
                {item.suffix && <span className="text-sm text-muted-foreground ml-0.5">{item.suffix}</span>}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{item.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Countries visited */}
      {stats.countriesVisited.length > 0 && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Flag className="w-4 h-4 text-primary" />
              <h3 className="font-medium text-foreground text-sm">Pays explorés</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {stats.countriesVisited.map(country => (
                <span 
                  key={country}
                  className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                >
                  {country}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JournalStats;
