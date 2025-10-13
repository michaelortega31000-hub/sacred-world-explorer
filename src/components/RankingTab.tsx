import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, Award, Star, Lock, Church, Sparkles, Mountain, Heart } from 'lucide-react';

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
    },
    // Special place badges
    {
      id: 'mecca_badge',
      name: 'La Mecque',
      description: 'Visitez la Kaaba à La Mecque',
      icon: Sparkles,
      pointsRequired: 0,
      color: 'text-emerald-500'
    },
    {
      id: 'notre_dame_badge',
      name: 'Notre-Dame',
      description: 'Visitez Notre-Dame de Paris',
      icon: Church,
      pointsRequired: 0,
      color: 'text-rose-500'
    },
    {
      id: 'vatican_badge',
      name: 'Vatican',
      description: 'Visitez la Basilique Saint-Pierre',
      icon: Church,
      pointsRequired: 0,
      color: 'text-amber-500'
    },
    {
      id: 'taj_mahal_badge',
      name: 'Taj Mahal',
      description: 'Visitez le Taj Mahal',
      icon: Heart,
      pointsRequired: 0,
      color: 'text-pink-500'
    },
    {
      id: 'western_wall_badge',
      name: 'Mur des Lamentations',
      description: 'Visitez le Mur occidental à Jérusalem',
      icon: Mountain,
      pointsRequired: 0,
      color: 'text-stone-500'
    },
    {
      id: 'golden_temple_badge',
      name: 'Temple d\'Or',
      description: 'Visitez le Temple d\'Or d\'Amritsar',
      icon: Sparkles,
      pointsRequired: 0,
      color: 'text-yellow-400'
    },
    {
      id: 'angkor_wat_badge',
      name: 'Angkor Wat',
      description: 'Visitez le temple d\'Angkor Wat',
      icon: Mountain,
      pointsRequired: 0,
      color: 'text-orange-500'
    },
    {
      id: 'sagrada_familia_badge',
      name: 'Sagrada Familia',
      description: 'Visitez la Sagrada Familia de Barcelone',
      icon: Church,
      pointsRequired: 0,
      color: 'text-indigo-500'
    }
  ];

  const badgeIcons = {
    explorer: <Star className="w-4 h-4" />,
    pilgrim: <Award className="w-4 h-4" />,
    master: <Trophy className="w-4 h-4" />,
    mecca_badge: <Sparkles className="w-4 h-4" />,
    notre_dame_badge: <Church className="w-4 h-4" />,
    vatican_badge: <Church className="w-4 h-4" />,
    taj_mahal_badge: <Heart className="w-4 h-4" />,
    western_wall_badge: <Mountain className="w-4 h-4" />,
    golden_temple_badge: <Sparkles className="w-4 h-4" />,
    angkor_wat_badge: <Mountain className="w-4 h-4" />,
    sagrada_familia_badge: <Church className="w-4 h-4" />
  };

  const badgeNames = {
    explorer: 'Explorateur (100 pts)',
    pilgrim: 'Pèlerin (500 pts)',
    master: 'Maître (1000 pts)',
    mecca_badge: 'La Mecque',
    notre_dame_badge: 'Notre-Dame',
    vatican_badge: 'Vatican',
    taj_mahal_badge: 'Taj Mahal',
    western_wall_badge: 'Mur des Lamentations',
    golden_temple_badge: 'Temple d\'Or',
    angkor_wat_badge: 'Angkor Wat',
    sagrada_familia_badge: 'Sagrada Familia'
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

      {/* Dialog pour afficher tous les badges obtenus */}
      <Dialog open={badgesDialogOpen} onOpenChange={setBadgesDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-6 h-6 text-secondary" />
              Mes Badges Obtenus
            </DialogTitle>
            <DialogDescription>
              {userProgress.badges.length} badge{userProgress.badges.length > 1 ? 's' : ''} débloqué{userProgress.badges.length > 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh] pr-4">
            {userProgress.badges.length === 0 ? (
              <div className="text-center py-12">
                <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">
                  Vous n'avez pas encore débloqué de badges
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Visitez des lieux pour commencer votre collection !
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allBadges
                  .filter((badge) => userProgress.badges.includes(badge.id))
                  .map((badge) => {
                    const Icon = badge.icon;
                    
                    return (
                      <Card 
                        key={badge.id}
                        className="relative overflow-hidden border-primary shadow-lg hover:shadow-xl transition-shadow"
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-3 text-lg">
                            <div className="p-3 rounded-full bg-primary/10">
                              <Icon className={`w-7 h-7 ${badge.color}`} />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">{badge.name}</div>
                              <Badge variant="default" className="mt-1 text-xs">
                                ✓ Obtenu
                              </Badge>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {badge.description}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RankingTab;
