import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Trophy, Flag, Users, Target, CheckCircle2, Book, Plus, Calendar, Globe } from 'lucide-react';
import { useApp, Place } from '@/contexts/AppContext';
import { getPlacesByCountry, getAllCountries } from '@/data/placesData';
import RankingTab from '@/components/RankingTab';
import CountryRankingTab from '@/components/CountryRankingTab';
import ReligionRankingTab from '@/components/ReligionRankingTab';
import WeeklyQuestTab from '@/components/WeeklyQuestTab';
import TripPlannerTab from '@/components/TripPlannerTab';
import AudioImmersiveIcon from '@/components/AudioImmersiveIcon';
import Header from '@/components/Header';
import { toast } from 'sonner';

const Country = () => {
  const { country } = useParams<{ country: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { visitPlace, isPlaceVisited, userProgress, addToTrip, removeFromTrip, isInTrip } = useApp();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  
  const places = country ? getPlacesByCountry(country) : [];
  const allCountries = getAllCountries().sort((a, b) => {
    const nameA = t(`countries.${a}`, a);
    const nameB = t(`countries.${b}`, b);
    return nameA.localeCompare(nameB);
  });

  const handleCountryChange = (newCountry: string) => {
    navigate(`/country/${newCountry}`);
  };

  const handleCheckIn = async (placeId: string, placeName: string, points: number) => {
    if (isPlaceVisited(placeId)) {
      toast.info('Vous avez déjà visité ce lieu');
      return;
    }

    // Request geolocation
    if (!navigator.geolocation) {
      toast.error('La géolocalisation n\'est pas supportée par votre navigateur');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // Geolocation successful
        toast.info('Position validée ! Prenez une photo du lieu...');
        
        // Request camera access
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop()); // Stop immediately, we just need permission
          
          // If we get here, permissions are granted
          visitPlace(placeId, points);
          toast.success(`${placeName} visité ! +${points} points`, {
            description: `Total: ${userProgress.totalPoints + points} points`
          });
        } catch (error) {
          toast.error('Accès à la caméra requis pour valider la visite');
        }
      },
      (error) => {
        toast.error('Géolocalisation requise pour valider la visite');
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        showBack 
        backTo="/world" 
        backLabel={t('worldMap.back')}
      >
        <div className="flex items-center gap-4">
          <Select value={country} onValueChange={handleCountryChange}>
            <SelectTrigger className="w-[200px] bg-card border-border">
              <Globe className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Choisir un pays" />
            </SelectTrigger>
            <SelectContent className="max-h-[400px] bg-card border-border z-50">
              {allCountries.map((countryName) => (
                <SelectItem key={countryName} value={countryName}>
                  {t(`countries.${countryName}`, countryName)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{userProgress.totalPoints}</span> {t('country.points')}
          </div>
        </div>
      </Header>

      <Tabs defaultValue="places" className="flex-1 flex flex-col">
        <div className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
              <TabsTrigger value="places" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <MapPin className="w-4 h-4" />
                {t('country.title')}
              </TabsTrigger>
              <TabsTrigger value="ranking" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <Trophy className="w-4 h-4" />
                {t('tabs.myRanking')}
              </TabsTrigger>
              <TabsTrigger value="country" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <Flag className="w-4 h-4" />
                {t('tabs.countryRanking')}
              </TabsTrigger>
              <TabsTrigger value="religion" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <Users className="w-4 h-4" />
                {t('tabs.religionRanking')}
              </TabsTrigger>
              <TabsTrigger value="quest" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <Target className="w-4 h-4" />
                {t('tabs.weeklyQuest')}
              </TabsTrigger>
              <TabsTrigger value="trip" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <Calendar className="w-4 h-4" />
                {t('tabs.tripPlanner')}
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="places" className="flex-1 m-0 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {country}
            </h1>
            <p className="text-muted-foreground mb-8">
              {places.length} {places.length === 1 ? 'lieu sacré' : 'lieux sacrés'}
            </p>

            {/* Group places by city */}
            {Object.entries(
              places.reduce((acc, place) => {
                const city = place.city || 'Autres';
                if (!acc[city]) acc[city] = [];
                acc[city].push(place);
                return acc;
              }, {} as Record<string, Place[]>)
            )
              .sort(([cityA], [cityB]) => {
                if (cityA === 'Autres') return 1;
                if (cityB === 'Autres') return -1;
                return cityA.localeCompare(cityB);
              })
              .map(([city, cityPlaces]) => (
                <div key={city} className="mb-12">
                  <div className="flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">{city}</h2>
                    <span className="text-sm text-muted-foreground">
                      ({cityPlaces.length} {cityPlaces.length === 1 ? 'lieu' : 'lieux'})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cityPlaces.map((place) => {
                      const visited = isPlaceVisited(place.id);
                      const inTrip = isInTrip(place.id);
                      return (
                        <Card key={place.id} className={`overflow-hidden transition-all hover:shadow-lg ${visited ? 'opacity-75' : ''}`}>
                          {place.imageUrl ? (
                            <div 
                              className="h-48 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative group"
                              onClick={() => setSelectedPlace(place)}
                            >
                              <img 
                                src={place.imageUrl} 
                                alt={place.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 right-2">
                                <Button
                                  size="sm"
                                  variant={inTrip ? "default" : "secondary"}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (inTrip) {
                                      removeFromTrip(place.id);
                                      toast.success('Retiré du voyage');
                                    } else {
                                      addToTrip(place.id);
                                      toast.success('Ajouté au voyage');
                                    }
                                  }}
                                  className="opacity-90 group-hover:opacity-100 transition-opacity"
                                >
                                  {inTrip ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                  ) : (
                                    <Plus className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                              <MapPin className="w-16 h-16 text-primary" />
                            </div>
                          )}
                          <CardHeader>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <CardTitle className="flex-1">{place.name}</CardTitle>
                              <div className="flex items-center gap-2">
                                <AudioImmersiveIcon 
                                  isPremium={false}
                                  onClick={() => toast.info('Abonnez-vous au mode Premium pour débloquer l\'audio immersif ! 👑')}
                                />
                                {visited && <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />}
                              </div>
                            </div>
                            <CardDescription className="flex items-center gap-1">
                              <Book className="w-3 h-3" />
                              {place.type}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-3">{place.description}</p>
                          </CardContent>
                          <CardFooter>
                            <Button
                              onClick={() => handleCheckIn(place.id, place.name, place.points)}
                              disabled={visited}
                              className="w-full"
                              variant={visited ? 'secondary' : 'default'}
                            >
                              {visited ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  {t('country.visited')}
                                </>
                              ) : (
                                `Check-in (+${place.points} pts)`
                              )}
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="ranking" className="flex-1 m-0">
          <RankingTab />
        </TabsContent>

        <TabsContent value="country" className="flex-1 m-0">
          <CountryRankingTab />
        </TabsContent>

        <TabsContent value="religion" className="flex-1 m-0">
          <ReligionRankingTab />
        </TabsContent>

        <TabsContent value="quest" className="flex-1 m-0">
          <WeeklyQuestTab />
        </TabsContent>

        <TabsContent value="trip" className="flex-1 m-0">
          <TripPlannerTab />
        </TabsContent>
      </Tabs>

      {/* Dialog pour afficher la description complète */}
      <Dialog open={!!selectedPlace} onOpenChange={() => setSelectedPlace(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedPlace?.name}</DialogTitle>
            <DialogDescription className="text-base">
              {selectedPlace?.type} • {selectedPlace?.country}
            </DialogDescription>
          </DialogHeader>
          {selectedPlace?.imageUrl && (
            <div className="w-full h-64 overflow-hidden rounded-lg">
              <img 
                src={selectedPlace.imageUrl} 
                alt={selectedPlace.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="space-y-4">
            <p className="text-base leading-relaxed">{selectedPlace?.description}</p>
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-lg font-semibold" style={{ color: 'hsl(45 100% 51%)' }}>
                🏆 {selectedPlace?.points} points
              </span>
              <Button onClick={() => setSelectedPlace(null)}>Fermer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Country;
