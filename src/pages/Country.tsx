import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
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
import { cn } from '@/lib/utils';

const Country = () => {
  const { country } = useParams<{ country: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { visitPlace, isPlaceVisited, userProgress, addToTrip, removeFromTrip, isInTrip } = useApp();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const cityRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  const places = country ? getPlacesByCountry(country) : [];
  const allCountries = getAllCountries().sort((a, b) => {
    const nameA = t(`countries.${a}`, a);
    const nameB = t(`countries.${b}`, b);
    return nameA.localeCompare(nameB);
  });

  // Group places by city
  const citiesByLetter = Object.entries(
    places.reduce((acc, place) => {
      const city = place.city || 'Autres';
      if (!acc[city]) acc[city] = [];
      acc[city].push(place);
      return acc;
    }, {} as Record<string, Place[]>)
  ).sort(([cityA], [cityB]) => {
    if (cityA === 'Autres') return 1;
    if (cityB === 'Autres') return -1;
    return cityA.localeCompare(cityB);
  });

  // Resolve local asset URLs via Vite to avoid broken /src paths
  const placeImages = import.meta.glob('../assets/places/*', { eager: true, as: 'url' }) as Record<string, string>;
  const resolveImageUrl = (url?: string) => {
    if (!url) return undefined;
    const filename = url.split('/').pop() as string;
    const match = Object.entries(placeImages).find(([path]) => path.endsWith(filename));
    return (match?.[1] as string) || url;
  };

  // Get available letters
  const availableLetters = Array.from(
    new Set(
      citiesByLetter
        .map(([city]) => city[0].toUpperCase())
        .filter(letter => letter !== 'A' || citiesByLetter.some(([city]) => city !== 'Autres'))
    )
  ).sort();

  const handleCountryChange = (newCountry: string) => {
    navigate(`/country/${newCountry}`);
  };

  const scrollToLetter = (letter: string) => {
    const cityEntry = citiesByLetter.find(([city]) => 
      city[0].toUpperCase() === letter && city !== 'Autres'
    );
    if (cityEntry && cityRefs.current[cityEntry[0]]) {
      cityRefs.current[cityEntry[0]]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
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
              <TabsTrigger value="quest" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <Target className="w-4 h-4" />
                {t('tabs.weeklyQuest')}
              </TabsTrigger>
              <TabsTrigger value="trip" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <Calendar className="w-4 h-4" />
                {t('tabs.tripPlanner')}
              </TabsTrigger>
              <TabsTrigger value="rankings" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <Trophy className="w-4 h-4" />
                Classements
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="places" className="flex-1 m-0 p-6 relative">
          {/* Alphabet Navigator */}
          {availableLetters.length > 0 && (
            <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 bg-card border-2 border-primary/20 rounded-full shadow-lg p-2">
              <div className="flex flex-col gap-1">
                {availableLetters.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => scrollToLetter(letter)}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                      "hover:bg-primary hover:text-primary-foreground hover:scale-110",
                      "text-foreground/70"
                    )}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {country}
            </h1>
            <p className="text-muted-foreground mb-8">
              {places.length} {places.length === 1 ? 'lieu sacré' : 'lieux sacrés'}
            </p>

            {/* Group places by city */}
            {citiesByLetter.map(([city, cityPlaces]) => (
                <div 
                  key={city} 
                  className="mb-12 scroll-mt-24"
                  ref={(el) => { cityRefs.current[city] = el; }}
                >
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
                                onClick={() => navigate(`/place/${place.id}`)}
                              >
                                <img 
                                  src={resolveImageUrl(place.imageUrl) || place.imageUrl}
                                  alt={place.name}
                                  loading="lazy"
                                  onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
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
                              <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center cursor-pointer" onClick={() => navigate(`/place/${place.id}`)}>
                                <MapPin className="w-16 h-16 text-primary" />
                              </div>
                            )}
                            <CardHeader className="cursor-pointer" onClick={() => navigate(`/place/${place.id}`)}>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <CardTitle className="flex-1">{place.name}</CardTitle>
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
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
                            <CardContent className="cursor-pointer" onClick={() => navigate(`/place/${place.id}`)}>
                              <p className="text-sm text-muted-foreground line-clamp-3">{place.description}</p>
                            </CardContent>
                            <CardFooter>
                              <Button
                                onClick={() => navigate(`/place/${place.id}`)}
                                className="w-full"
                                variant={visited ? 'secondary' : 'default'}
                              >
                                {visited ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    {t('country.visited')}
                                  </>
                                ) : (
                                  'Voir les détails'
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

        <TabsContent value="rankings" className="flex-1 m-0">
          <div className="container mx-auto p-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="personal" className="gap-2">
                  <Trophy className="w-4 h-4" />
                  {t('tabs.myRanking')}
                </TabsTrigger>
                <TabsTrigger value="country" className="gap-2">
                  <Flag className="w-4 h-4" />
                  {t('tabs.countryRanking')}
                </TabsTrigger>
                <TabsTrigger value="religion" className="gap-2">
                  <Users className="w-4 h-4" />
                  {t('tabs.religionRanking')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <RankingTab />
              </TabsContent>

              <TabsContent value="country">
                <CountryRankingTab />
              </TabsContent>

              <TabsContent value="religion">
                <ReligionRankingTab />
              </TabsContent>
            </Tabs>
          </div>
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
                src={resolveImageUrl(selectedPlace.imageUrl) || selectedPlace.imageUrl}
                alt={selectedPlace.name}
                loading="lazy"
                onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
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
