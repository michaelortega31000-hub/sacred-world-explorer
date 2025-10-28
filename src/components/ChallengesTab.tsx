import { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Trophy, MapPin, Compass, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { mockPlaces as placesData } from '@/data/placesData';

const ChallengesTab = () => {
  const { userProgress, addPoints } = useApp();
  const [claimedQuests, setClaimedQuests] = useState<string[]>(() => {
    const saved = localStorage.getItem('claimedQuests');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('claimedQuests', JSON.stringify(claimedQuests));
  }, [claimedQuests]);

  const handleClaimReward = (questId: string, reward: number) => {
    addPoints(reward);
    setClaimedQuests([...claimedQuests, questId]);
    toast.success(`Bravo ! +${reward} points gagnés !`, {
      icon: '🎉',
    });
  };

  const getDaysUntilMonday = () => {
    const today = new Date();
    const daysUntilMonday = (8 - today.getDay()) % 7 || 7;
    return daysUntilMonday;
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
        const place = placesData.find(p => p.id === placeId);
        return place ? getContinent(place.country) : null;
      }).filter(Boolean)
    ).size;

    const christianPlaces = visitedPlaces.filter(placeId => {
      const place = placesData.find(p => p.id === placeId);
      return place?.religion === 'christianity';
    }).length;

    const europePlaces = visitedPlaces.filter(placeId => {
      const place = placesData.find(p => p.id === placeId);
      return place && getContinent(place.country) === 'Europe';
    }).length;

    return {
      continents: continentsVisited,
      christian: christianPlaces,
      europe: europePlaces,
      total: visitedPlaces.length,
    };
  }, [userProgress.visitedPlaces]);

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

  const nearbyPlaces = useMemo(() => {
    return placesData.slice(0, 5).map(place => ({
      ...place,
      distance: Math.floor(Math.random() * 50) + 1,
    }));
  }, []);

  const culturalItineraries = [
    {
      id: 'christian-europe',
      title: 'Route des Cathédrales',
      description: 'Parcourez les plus belles cathédrales d\'Europe',
      places: 12,
      points: 1200,
      duration: '2 semaines',
      difficulty: 'Moyen',
    },
    {
      id: 'buddhist-asia',
      title: 'Temples d\'Asie',
      description: 'Explorez les temples bouddhistes emblématiques',
      places: 8,
      points: 800,
      duration: '10 jours',
      difficulty: 'Facile',
    },
    {
      id: 'islamic-middle-east',
      title: 'Merveilles Islamiques',
      description: 'Découvrez l\'architecture islamique',
      places: 10,
      points: 1000,
      duration: '12 jours',
      difficulty: 'Avancé',
    },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">Hebdomadaires</TabsTrigger>
          <TabsTrigger value="itineraries">Itinéraires</TabsTrigger>
          <TabsTrigger value="nearby">À proximité</TabsTrigger>
        </TabsList>

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

        <TabsContent value="itineraries" className="space-y-4">
          {culturalItineraries.map((itinerary) => (
            <Card key={itinerary.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{itinerary.title}</CardTitle>
                    <CardDescription>{itinerary.description}</CardDescription>
                  </div>
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Lieux</p>
                    <p className="font-semibold">{itinerary.places} sites</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Durée</p>
                    <p className="font-semibold">{itinerary.duration}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Difficulté</p>
                    <p className="font-semibold">{itinerary.difficulty}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-accent" />
                    <span className="font-semibold text-accent">+{itinerary.points} points</span>
                  </div>
                  <Button variant="outline">
                    Voir l'itinéraire
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="nearby" className="space-y-4">
          <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
            <CardHeader>
              <CardTitle>Lieux à proximité</CardTitle>
              <CardDescription>
                Découvrez les lieux sacrés près de vous
              </CardDescription>
            </CardHeader>
          </Card>

          {nearbyPlaces.map((place) => (
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
                  <Button variant="outline" size="sm">
                    Voir sur la carte
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChallengesTab;
