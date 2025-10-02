import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trophy, Award, Star, Lock } from 'lucide-react';

const RankingTab = () => {
  const { t } = useTranslation();
  const { userProgress } = useApp();
  const [badgesDialogOpen, setBadgesDialogOpen] = useState(false);

  const allBadges = [
    {
      id: 'explorer',
      name: 'Explorateur',
      description: 'Visitez vos 5 premiers lieux sacrés',
      icon: Star,
      pointsRequired: 100,
      color: 'text-blue-500'
    },
    {
      id: 'pilgrim',
      name: 'Pèlerin',
      description: 'Accumulez 500 points d\'exploration',
      icon: Award,
      pointsRequired: 500,
      color: 'text-purple-500'
    },
    {
      id: 'master',
      name: 'Maître',
      description: 'Atteignez le niveau expert avec 1000 points',
      icon: Trophy,
      pointsRequired: 1000,
      color: 'text-yellow-500'
    }
  ];

  const badgeIcons = {
    explorer: <Star className="w-4 h-4" />,
    pilgrim: <Award className="w-4 h-4" />,
    master: <Trophy className="w-4 h-4" />
  };

  const badgeNames = {
    explorer: 'Explorateur (100 pts)',
    pilgrim: 'Pèlerin (500 pts)',
    master: 'Maître (1000 pts)'
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              {t('ranking.yourPoints')}
            </CardTitle>
            <CardDescription>Score total accumulé</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {userProgress.totalPoints}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {userProgress.visitedPlaces.length} lieux visités
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setBadgesDialogOpen(true)}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-secondary" />
              {t('ranking.badges')}
            </CardTitle>
            <CardDescription>Cliquez pour voir tous les badges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userProgress.badges.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Visitez des lieux pour débloquer des badges !
                </p>
              ) : (
                userProgress.badges.map((badge) => (
                  <Badge key={badge} variant="secondary" className="gap-1">
                    {badgeIcons[badge as keyof typeof badgeIcons]}
                    {badgeNames[badge as keyof typeof badgeNames]}
                  </Badge>
                ))
              )}
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="text-xs text-muted-foreground">Prochains badges :</div>
              {!userProgress.badges.includes('explorer') && (
                <div className="text-sm">
                  🎯 Explorateur à {100 - userProgress.totalPoints} points
                </div>
              )}
              {!userProgress.badges.includes('pilgrim') && userProgress.totalPoints >= 100 && (
                <div className="text-sm">
                  🎯 Pèlerin à {500 - userProgress.totalPoints} points
                </div>
              )}
              {!userProgress.badges.includes('master') && userProgress.totalPoints >= 500 && (
                <div className="text-sm">
                  🎯 Maître à {1000 - userProgress.totalPoints} points
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t('ranking.position')}</CardTitle>
            <CardDescription>Classement général (simulation)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <div className="font-medium">Marco Explorer</div>
                    <div className="text-sm text-muted-foreground">2,450 points</div>
                  </div>
                </div>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <div className="font-medium">Sofia Voyager</div>
                    <div className="text-sm text-muted-foreground">1,890 points</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <div className="font-medium">Alex Wanderer</div>
                    <div className="text-sm text-muted-foreground">1,230 points</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border-2 border-primary">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    ?
                  </div>
                  <div>
                    <div className="font-medium">Vous</div>
                    <div className="text-sm text-muted-foreground">{userProgress.totalPoints} points</div>
                  </div>
                </div>
                <Star className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog pour afficher tous les badges */}
      <Dialog open={badgesDialogOpen} onOpenChange={setBadgesDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-6 h-6 text-secondary" />
              Collection de badges
            </DialogTitle>
            <DialogDescription>
              Vos récompenses obtenues et à débloquer
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {allBadges.map((badge) => {
              const isUnlocked = userProgress.badges.includes(badge.id);
              const Icon = badge.icon;
              const progress = Math.min((userProgress.totalPoints / badge.pointsRequired) * 100, 100);
              
              return (
                <Card 
                  key={badge.id}
                  className={`relative overflow-hidden ${
                    isUnlocked ? 'border-primary' : 'opacity-60'
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className={`p-2 rounded-full ${isUnlocked ? 'bg-primary/10' : 'bg-muted'}`}>
                        {isUnlocked ? (
                          <Icon className={`w-6 h-6 ${badge.color}`} />
                        ) : (
                          <Lock className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      {badge.name}
                      {isUnlocked && (
                        <Badge variant="default" className="ml-auto">Obtenu ✓</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {badge.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progression</span>
                        <span className="font-medium">
                          {userProgress.totalPoints} / {badge.pointsRequired} pts
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      
                      {!isUnlocked && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Encore {badge.pointsRequired - userProgress.totalPoints} points à gagner
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RankingTab;
