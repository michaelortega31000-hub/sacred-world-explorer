import { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Trophy, MapPin, Compass, CheckCircle, Clock, Calendar, Flame, Building2, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { mockPlaces as placesData } from '@/data/placesData';
import { usePlaces } from '@/hooks/usePlaces';
import confetti from 'canvas-confetti';

const ChallengesTab = () => {
  const { userProgress, addPoints, userLocation, flyToLocation, updateStreak, getStreakBonus, awardQuestBadge } = useApp();
  const { data: allPlaces = [] } = usePlaces();
  const [claimedQuests, setClaimedQuests] = useState<string[]>(() => {
  const [claimedQuests, setClaimedQuests] = useState<string[]>(() => {
    const saved = localStorage.getItem('claimedQuests');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('claimedQuests', JSON.stringify(claimedQuests));
  }, [claimedQuests]);

  const handleClaimReward = async (questId: string, reward: number, isDaily: boolean = false, isMonthly: boolean = false, questName?: string, questDescription?: string) => {
    const bonusPercent = getStreakBonus();
    const bonusPoints = Math.floor(reward * bonusPercent / 100);
    const totalReward = reward + bonusPoints;
    
    addPoints(totalReward);
    setClaimedQuests([...claimedQuests, questId]);
    
    if (isDaily) {
      const oldStreak = userProgress.currentStreak;
      updateStreak();
      
      // Déclencher les confettis si nouveau record atteint
      if (oldStreak >= userProgress.longestStreak && oldStreak > 0) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#fb923c', '#f97316', '#ea580c', '#dc2626', '#ec4899'],
          startVelocity: 45,
          decay: 0.9,
          scalar: 1.2,
        });
        toast.success(`🔥 Nouveau record de série !`, {
          description: `${oldStreak + 1} jours consécutifs - Incroyable !`
        });
      }
    }
    
    // Award badge for monthly quests
    if (isMonthly && questName && questDescription) {
      const badgeAwarded = await awardQuestBadge(
        questId,
        questName,
        questDescription,
        '🏆'
      );
      
      if (badgeAwarded) {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#34E0A1', '#F4C542', '#0EA5E9', '#A855F7'],
          startVelocity: 50,
          decay: 0.85,
          scalar: 1.5,
        });
        toast.success(`🏆 Badge débloqué : ${questName}`, {
          description: 'Consultez votre profil pour voir vos badges !',
          duration: 5000,
        });
      }
    }
    
    if (bonusPoints > 0) {
      toast.success(`Bravo ! +${reward} points + ${bonusPoints} bonus (série ${userProgress.currentStreak}🔥) = ${totalReward} points !`, {
        icon: '🎉',
      });
    } else {
      toast.success(`Bravo ! +${totalReward} points gagnés !`, {
        icon: '🎉',
      });
    }
  };

  const getDaysUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const hoursLeft = Math.floor((midnight.getTime() - now.getTime()) / (1000 * 60 * 60));
    return hoursLeft;
  };

  const getDaysUntilMonday = () => {
    const today = new Date();
    const daysUntilMonday = (8 - today.getDay()) % 7 || 7;
    return daysUntilMonday;
  };

  const getDaysUntilEndOfMonth = () => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysLeft = Math.ceil((lastDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getContinent = (country: string): string => {
    const continentMap: { [key: string]: string } = {
      'France': 'Europe', 'Italy': 'Europe', 'Spain': 'Europe', 'Germany': 'Europe',
      'Egypt': 'Africa', 'Morocco': 'Africa', 'Tunisia': 'Africa',
      'India': 'Asia', 'China': 'Asia', 'Japan': 'Asia', 'Thailand': 'Asia',
      'USA': 'North America', 'Mexico': 'North America',
      'Brazil': 'South America', 'Argentina': 'South America',
      'Australia': 'Oceania',
    };
    return continentMap[country] || 'Unknown';
  };

  const questProgress = useMemo(() => {
    const visitedPlaces = userProgress.visitedPlaces || [];
    const continentsVisited = new Set(
      visitedPlaces.map(placeId => {
        const place = allPlaces.find(p => p.id === placeId);
        return place ? getContinent(place.country) : null;
      }).filter(Boolean)
    ).size;

    const christianPlaces = visitedPlaces.filter(placeId => {
      const place = allPlaces.find(p => p.id === placeId);
      return place?.religion === 'christianity';
    }).length;

    const europePlaces = visitedPlaces.filter(placeId => {
      const place = allPlaces.find(p => p.id === placeId);
      return place && getContinent(place.country) === 'Europe';
    }).length;

    const countriesVisited = new Set(
      visitedPlaces.map(placeId => {
        const place = allPlaces.find(p => p.id === placeId);
        return place?.country;
      }).filter(Boolean)
    ).size;

    const religionsVisited = new Set(
      visitedPlaces.map(placeId => {
        const place = allPlaces.find(p => p.id === placeId);
        return place?.religion;
      }).filter(Boolean)
    ).size;

    // Museum-specific progress
    const museumsVisited = visitedPlaces.filter(placeId => {
      const place = allPlaces.find(p => p.id === placeId);
      return place?.placeCategory === 'museum';
    }).length;

    const museumCountries = new Set(
      visitedPlaces
        .filter(placeId => {
          const place = allPlaces.find(p => p.id === placeId);
          return place?.placeCategory === 'museum';
        })
        .map(placeId => {
          const place = allPlaces.find(p => p.id === placeId);
          return place?.country;
        })
        .filter(Boolean)
    ).size;

    const manuscriptMuseums = visitedPlaces.filter(placeId => {
      const place = allPlaces.find(p => p.id === placeId);
      return place?.placeCategory === 'museum' && place?.tags?.includes('manuscrits');
    }).length;

    const museumContinents = new Set(
      visitedPlaces
        .filter(placeId => {
          const place = allPlaces.find(p => p.id === placeId);
          return place?.placeCategory === 'museum';
        })
        .map(placeId => {
          const place = allPlaces.find(p => p.id === placeId);
          return place ? getContinent(place.country) : null;
        })
        .filter(Boolean)
    ).size;

    return {
      continents: continentsVisited,
      christian: christianPlaces,
      europe: europePlaces,
      total: visitedPlaces.length,
      countries: countriesVisited,
      religions: religionsVisited,
      museums: museumsVisited,
      museumCountries,
      manuscriptMuseums,
      museumContinents,
    };
  }, [userProgress.visitedPlaces, allPlaces]);

  const dailyQuests = [
    {
      id: 'daily-1',
      title: 'Première Visite',
      description: 'Visitez 1 lieu sacré aujourd\'hui',
      progress: questProgress.total > 0 ? 1 : 0,
      goal: 1,
      reward: 50,
      icon: MapPin,
    },
    {
      id: 'daily-2',
      title: 'Explorateur Quotidien',
      description: 'Découvrez 3 nouveaux lieux',
      progress: Math.min(questProgress.total, 3),
      goal: 3,
      reward: 100,
      icon: Compass,
    },
  ];

  const weeklyQuests = [
    {
      id: 'continents',
      title: 'Explorateur Mondial',
      description: 'Visitez des lieux sur 3 continents différents',
      progress: questProgress.continents,
      goal: 3,
      reward: 500,
      icon: Compass,
    },
    {
      id: 'christian',
      title: 'Pèlerin Chrétien',
      description: 'Visitez 5 lieux chrétiens',
      progress: questProgress.christian,
      goal: 5,
      reward: 300,
      icon: Target,
    },
    {
      id: 'europe',
      title: 'Découvreur Européen',
      description: 'Visitez 10 lieux en Europe',
      progress: questProgress.europe,
      goal: 10,
      reward: 400,
      icon: MapPin,
    },
  ];

  const monthlyQuests = [
    {
      id: 'monthly-continents',
      title: 'Collectionneur de Continents',
      description: 'Visitez 5 continents différents',
      progress: questProgress.continents,
      goal: 5,
      reward: 1000,
      icon: Compass,
    },
    {
      id: 'monthly-pilgrimage',
      title: 'Maître Pèlerin',
      description: 'Visitez 25 lieux sacrés',
      progress: questProgress.total,
      goal: 25,
      reward: 1500,
      icon: Trophy,
    },
    {
      id: 'monthly-religions',
      title: 'Explorateur des Religions',
      description: 'Visitez des lieux de 4 religions différentes',
      progress: questProgress.religions,
      goal: 4,
      reward: 1200,
      icon: Target,
    },
    {
      id: 'monthly-countries',
      title: 'Voyage Mondial',
      description: 'Visitez 15 pays différents',
      progress: questProgress.countries,
      goal: 15,
      reward: 1300,
      icon: MapPin,
    },
  ];

  // Cultural/Museum Quests
  const cultureQuests = [
    {
      id: 'culture-first-museum',
      title: 'Premier Musée',
      description: 'Visitez votre premier musée culturel',
      progress: Math.min(questProgress.museums, 1),
      goal: 1,
      reward: 75,
      icon: Building2,
    },
    {
      id: 'culture-3-countries',
      title: 'Globe-Trotter Culturel',
      description: 'Visitez 3 musées dans 3 pays différents',
      progress: questProgress.museumCountries,
      goal: 3,
      reward: 300,
      icon: Compass,
    },
    {
      id: 'culture-art-lover',
      title: 'Amoureux de l\'Art',
      description: 'Visitez 5 musées culturels',
      progress: questProgress.museums,
      goal: 5,
      reward: 350,
      icon: Palette,
    },
    {
      id: 'culture-manuscripts',
      title: 'Chasseur de Manuscrits',
      description: 'Visitez 3 musées liés aux manuscrits',
      progress: questProgress.manuscriptMuseums,
      goal: 3,
      reward: 400,
      icon: Target,
    },
    {
      id: 'culture-curator',
      title: 'Curator',
      description: 'Visitez 10 musées culturels',
      progress: questProgress.museums,
      goal: 10,
      reward: 500,
      icon: Trophy,
    },
    {
      id: 'culture-heritage-guardian',
      title: 'Gardien du Patrimoine',
      description: 'Visitez des musées sur 3 continents',
      progress: questProgress.museumContinents,
      goal: 3,
      reward: 600,
      icon: MapPin,
    },
    {
      id: 'culture-mixed-itinerary',
      title: 'Itinéraire Mixte',
      description: 'Visitez 2 musées + 2 lieux religieux',
      progress: Math.min(questProgress.museums, 2) + Math.min(questProgress.total - questProgress.museums, 2),
      goal: 4,
      reward: 400,
      icon: Compass,
    },
    {
      id: 'culture-master',
      title: 'Maître de la Culture',
      description: 'Visitez 20 musées culturels',
      progress: questProgress.museums,
      goal: 20,
      reward: 1000,
      icon: Trophy,
    },
  ];

  const nearbyPlaces = useMemo(() => {
    if (!userLocation?.latitude || !userLocation?.longitude) {
      return [];
    }

    const placesWithDistance = placesData
      .map(place => ({
        ...place,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          place.coordinates[1],
          place.coordinates[0]
        )
      }))
      .filter(place => place.distance <= 50)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10)
      .map(place => ({
        ...place,
        distance: Math.round(place.distance * 10) / 10
      }));

    return placesWithDistance;
  }, [userLocation]);

  return (
    <div className="space-y-6">
      {/* Streak Display */}
      <Card className="border-accent/30 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center transition-all duration-500"
                style={{
                  width: `${Math.min(64 + userProgress.currentStreak * 2, 120)}px`,
                  height: `${Math.min(64 + userProgress.currentStreak * 2, 120)}px`,
                }}
              >
                <Flame 
                  className="text-white flame-pulse flame-glow transition-all duration-500" 
                  style={{
                    width: `${Math.min(32 + userProgress.currentStreak * 1, 64)}px`,
                    height: `${Math.min(32 + userProgress.currentStreak * 1, 64)}px`,
                    filter: `brightness(${1 + userProgress.currentStreak * 0.03})`,
                  }}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold">{userProgress.currentStreak} jour{userProgress.currentStreak > 1 ? 's' : ''}</h3>
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Série en cours • Bonus: +{getStreakBonus()}%
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Record</div>
              <div className="text-xl font-bold flex items-center gap-1">
                <Trophy className="w-5 h-5 text-accent" />
                {userProgress.longestStreak}
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progression des bonus</span>
              <span>Prochain palier: {
                userProgress.currentStreak <= 1 ? '2 jours (+5%)' :
                userProgress.currentStreak <= 3 ? '4 jours (+10%)' :
                userProgress.currentStreak <= 7 ? '8 jours (+20%)' :
                userProgress.currentStreak <= 14 ? '15 jours (+30%)' :
                userProgress.currentStreak <= 30 ? '31 jours (+50%)' : 'Maximum atteint!'
              }</span>
            </div>
            <Progress 
              value={Math.min((userProgress.currentStreak / 30) * 100, 100)} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="w-full grid grid-cols-5 sm:inline-flex sm:justify-start">
          <TabsTrigger value="daily" className="flex-shrink-0 gap-2">
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Journalière</span>
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex-shrink-0 gap-2">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Hebdomadaire</span>
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex-shrink-0 gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Mensuelle</span>
          </TabsTrigger>
          <TabsTrigger value="culture" className="flex-shrink-0 gap-2">
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">Culture</span>
          </TabsTrigger>
          <TabsTrigger value="nearby" className="flex-shrink-0 gap-2">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">À proximité</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-6">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <CardTitle>Quêtes Journalières</CardTitle>
                </div>
                <Badge variant="outline">
                  Réinitialisation dans {getDaysUntilMidnight()}h
                </Badge>
              </div>
              <CardDescription>
                Complétez ces défis quotidiens pour gagner des points bonus
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            {dailyQuests.map((quest) => {
              const Icon = quest.icon;
              const isCompleted = quest.progress >= quest.goal;
              const isClaimed = claimedQuests.includes(quest.id);
              const progressPercent = Math.min((quest.progress / quest.goal) * 100, 100);

              return (
                <Card key={quest.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <CardTitle className="text-xl">{quest.title}</CardTitle>
                          <CardDescription>{quest.description}</CardDescription>
                        </div>
                      </div>
                      {isCompleted && (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Progression: {quest.progress} / {quest.goal}
                        </span>
                        <span className="font-medium">{Math.round(progressPercent)}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-accent" />
                        <span className="font-semibold text-accent">+{quest.reward} points</span>
                      </div>
                      <Button
                        disabled={!isCompleted || isClaimed}
                        onClick={() => handleClaimReward(quest.id, quest.reward, true)}
                        variant={isCompleted && !isClaimed ? 'default' : 'outline'}
                      >
                        {isClaimed ? 'Réclamé' : isCompleted ? 'Réclamer' : 'En cours'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <CardTitle>Quêtes Hebdomadaires</CardTitle>
                </div>
                <Badge variant="outline">
                  Réinitialisation dans {getDaysUntilMonday()} jours
                </Badge>
              </div>
              <CardDescription>
                Complétez ces défis avant la fin de la semaine pour gagner des points bonus
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            {weeklyQuests.map((quest) => {
              const Icon = quest.icon;
              const isCompleted = quest.progress >= quest.goal;
              const isClaimed = claimedQuests.includes(quest.id);
              const progressPercent = Math.min((quest.progress / quest.goal) * 100, 100);

              return (
                <Card key={quest.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <CardTitle className="text-xl">{quest.title}</CardTitle>
                          <CardDescription>{quest.description}</CardDescription>
                        </div>
                      </div>
                      {isCompleted && (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Progression: {quest.progress} / {quest.goal}
                        </span>
                        <span className="font-medium">{Math.round(progressPercent)}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-accent" />
                        <span className="font-semibold text-accent">+{quest.reward} points</span>
                      </div>
                      <Button
                        disabled={!isCompleted || isClaimed}
                        onClick={() => handleClaimReward(quest.id, quest.reward)}
                        variant={isCompleted && !isClaimed ? 'default' : 'outline'}
                      >
                        {isClaimed ? 'Réclamé' : isCompleted ? 'Réclamer' : 'En cours'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  <CardTitle>Quêtes Mensuelles</CardTitle>
                </div>
                <Badge variant="outline">
                  Réinitialisation dans {getDaysUntilEndOfMonth()} jours
                </Badge>
              </div>
              <CardDescription>
                Relevez ces défis ambitieux pour gagner des récompenses exceptionnelles
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            {monthlyQuests.map((quest) => {
              const Icon = quest.icon;
              const isCompleted = quest.progress >= quest.goal;
              const isClaimed = claimedQuests.includes(quest.id);
              const progressPercent = Math.min((quest.progress / quest.goal) * 100, 100);

              return (
                <Card key={quest.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-accent" />
                        </div>
                        <div className="space-y-1">
                          <CardTitle className="text-xl">{quest.title}</CardTitle>
                          <CardDescription>{quest.description}</CardDescription>
                        </div>
                      </div>
                      {isCompleted && (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Progression: {quest.progress} / {quest.goal}
                        </span>
                        <span className="font-medium">{Math.round(progressPercent)}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-accent" />
                        <span className="font-semibold text-accent">+{quest.reward} points</span>
                      </div>
                      <Button
                        disabled={!isCompleted || isClaimed}
                        onClick={() => handleClaimReward(quest.id, quest.reward, false, true, quest.title, quest.description)}
                        variant={isCompleted && !isClaimed ? 'default' : 'outline'}
                      >
                        {isClaimed ? 'Réclamé' : isCompleted ? 'Réclamer' : 'En cours'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="culture" className="space-y-6">
          <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-500" />
                  <CardTitle>Quêtes Culture & Musées</CardTitle>
                </div>
                <Badge variant="outline" className="border-blue-500/30 text-blue-600">
                  {questProgress.museums} musées visités
                </Badge>
              </div>
              <CardDescription>
                Explorez les musées culturels du monde et débloquez des récompenses exclusives
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            {cultureQuests.map((quest) => {
              const Icon = quest.icon;
              const isCompleted = quest.progress >= quest.goal;
              const isClaimed = claimedQuests.includes(quest.id);
              const progressPercent = Math.min((quest.progress / quest.goal) * 100, 100);

              return (
                <Card key={quest.id} className="overflow-hidden border-blue-500/10">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="space-y-1">
                          <CardTitle className="text-xl">{quest.title}</CardTitle>
                          <CardDescription>{quest.description}</CardDescription>
                        </div>
                      </div>
                      {isCompleted && (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Progression: {quest.progress} / {quest.goal}
                        </span>
                        <span className="font-medium">{Math.round(progressPercent)}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold text-blue-600">+{quest.reward} points</span>
                      </div>
                      <Button
                        disabled={!isCompleted || isClaimed}
                        onClick={() => handleClaimReward(quest.id, quest.reward, false, true, quest.title, quest.description)}
                        variant={isCompleted && !isClaimed ? 'default' : 'outline'}
                      >
                        {isClaimed ? 'Réclamé' : isCompleted ? 'Réclamer' : 'En cours'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="nearby" className="space-y-4">
          <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
            <CardHeader>
              <CardTitle>Lieux à proximité</CardTitle>
              <CardDescription>
                Découvrez les lieux sacrés dans un rayon de 50 km
              </CardDescription>
            </CardHeader>
          </Card>

          {!userProgress.geolocationEnabled ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Activez la géolocalisation dans les réglages pour découvrir les lieux près de vous
                </p>
              </CardContent>
            </Card>
          ) : nearbyPlaces.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Compass className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Aucun lieu sacré trouvé dans un rayon de 50 km
                </p>
              </CardContent>
            </Card>
          ) : (
            nearbyPlaces.map((place) => (
              <Card key={place.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{place.name}</CardTitle>
                      <CardDescription>{place.country}</CardDescription>
                    </div>
                    <Badge variant="secondary">{place.distance} km</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-primary" />
                      <span className="font-semibold">+{place.points} points</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => flyToLocation(place.coordinates[1], place.coordinates[0], 12)}
                    >
                      Voir sur la carte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChallengesTab;
