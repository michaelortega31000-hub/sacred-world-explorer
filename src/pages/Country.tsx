import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { MapPin, Trophy, Flag, Users, Target, CheckCircle2, Book, Plus, Calendar, Globe, Camera, Share2, Play, Pause, Download, Info, Sparkles, ArrowLeft, Clock } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getImageUrl } from '@/lib/imageHelper';

const Country = () => {
  const { country } = useParams<{ country: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { visitPlace, isPlaceVisited, userProgress, addToTrip, removeFromTrip, isInTrip } = useApp();
  const { toast: toastHook } = useToast();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
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

  // Resolve via shared helper (fuzzy filename support)
  const resolveImageUrl = (url?: string) => (url ? getImageUrl(url) : undefined);

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
    setIsCheckinModalOpen(true);
  };

  const handleGPSCheck = async () => {
    if (!selectedPlace) return;
    
    setCheckingLocation(true);
    
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          });
        });

        // Calculer la distance
        const distance = calculateDistance(
          position.coords.latitude,
          position.coords.longitude,
          selectedPlace.coordinates[1],
          selectedPlace.coordinates[0]
        );

        if (distance <= 500) {
          // Valider la visite
          visitPlace(selectedPlace.id, selectedPlace.points);
          setIsCheckinModalOpen(false);
          setTimeout(() => {
            setIsRewardModalOpen(true);
          }, 300);
          
          toastHook({
            title: "Visite validée !",
            description: `+${selectedPlace.points} points gagnés`,
          });
        } else {
          toastHook({
            title: "Trop loin",
            description: `Vous devez être à moins de 500m du lieu (actuellement à ${Math.round(distance)}m)`,
            variant: "destructive"
          });
        }
      } catch (error) {
        toastHook({
          title: "Erreur GPS",
          description: "Impossible d'accéder à votre position. Utilisez la photo comme preuve.",
          variant: "destructive"
        });
      }
    } else {
      toastHook({
        title: "GPS non disponible",
        description: "Utilisez la photo comme preuve de visite",
        variant: "destructive"
      });
    }
    
    setCheckingLocation(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedPlace) return;
    
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      toastHook({
        title: "Photo capturée",
        description: "Votre photo a été enregistrée comme preuve de visite",
      });
      
      // Valider automatiquement avec photo
      visitPlace(selectedPlace.id, selectedPlace.points);
      setTimeout(() => {
        setIsCheckinModalOpen(false);
        setIsRewardModalOpen(true);
      }, 1000);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Rayon de la Terre en mètres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const handleShare = async () => {
    if (!selectedPlace) return;
    
    const shareData = {
      title: selectedPlace.name,
      text: `J'ai visité ${selectedPlace.name} avec SacredWorld !`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toastHook({
          title: "Lien copié",
          description: "Le lien a été copié dans votre presse-papier",
        });
      }
    } catch (error) {
      console.error('Erreur de partage:', error);
    }
  };

  const handleAudioToggle = () => {
    setIsAudioPlaying(!isAudioPlaying);
    toastHook({
      title: isAudioPlaying ? "Audio en pause" : "Lecture audio",
      description: "Fonctionnalité audio à venir",
    });
  };

  const handleReport = () => {
    toastHook({
      title: "Signalement envoyé",
      description: "Merci pour votre contribution",
    });
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
              {t(`countries.${country}`, country)}
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
                                onClick={() => setSelectedPlace(place)}
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
                              <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center cursor-pointer" onClick={() => setSelectedPlace(place)}>
                                <MapPin className="w-16 h-16 text-primary" />
                              </div>
                            )}
                            <CardHeader className="cursor-pointer" onClick={() => setSelectedPlace(place)}>
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
                            <CardContent className="cursor-pointer" onClick={() => setSelectedPlace(place)}>
                              <p className="text-sm text-muted-foreground line-clamp-3">{place.description}</p>
                            </CardContent>
                            <CardFooter>
                              <Button
                                onClick={() => setSelectedPlace(place)}
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

      {/* Dialog détail du lieu (Écran 5) */}
      <Dialog open={!!selectedPlace} onOpenChange={() => setSelectedPlace(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {selectedPlace && (
            <>
              {/* Galerie d'images */}
              {selectedPlace.imageUrl && (
                <div className="relative w-full h-72 bg-muted">
                  <Carousel className="w-full h-full">
                    <CarouselContent>
                      {[selectedPlace.imageUrl, selectedPlace.imageUrl, selectedPlace.imageUrl].map((img, index) => (
                        <CarouselItem key={index}>
                          <div className="relative w-full h-72">
                            <img
                              src={resolveImageUrl(img) || img}
                              alt={`${selectedPlace.name} - Photo ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </Carousel>
                </div>
              )}

              {/* Contenu */}
              <div className="p-6 space-y-6">
                {/* En-tête */}
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-2">{selectedPlace.name}</h2>
                      <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {selectedPlace.city}, {selectedPlace.country}
                        </span>
                        <Badge variant="outline">{selectedPlace.type}</Badge>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-3xl font-bold" style={{ color: 'hsl(45 100% 51%)' }}>
                        +{selectedPlace.points}
                      </div>
                      <div className="text-sm text-muted-foreground">points</div>
                    </div>
                  </div>

                  {/* Badge à gagner */}
                  <Card className="border-2 bg-gradient-to-r from-primary/5 to-secondary/5" style={{ borderColor: 'hsl(45 100% 51%)' }}>
                    <CardContent className="flex items-center gap-3 p-4">
                      <Trophy className="w-8 h-8" style={{ color: 'hsl(45 100% 51%)' }} />
                      <div>
                        <p className="font-semibold">Badge à débloquer</p>
                        <p className="text-sm text-muted-foreground">
                          Visitez ce lieu pour gagner le badge "{selectedPlace.type}"
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* À savoir */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      À savoir
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="leading-relaxed">{selectedPlace.description}</p>
                    
                    <div className="pt-3 border-t space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <strong>Étiquette :</strong> Respectez les usages du lieu (tenue appropriée, silence, vérifiez les autorisations pour les photos)
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Temps moyen de visite : 1h30</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions principales */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => {
                      if (isPlaceVisited(selectedPlace.id)) {
                        toastHook({
                          title: "Déjà visité",
                          description: "Vous avez déjà visité ce lieu",
                        });
                      } else {
                        setIsCheckinModalOpen(true);
                      }
                    }}
                    disabled={isPlaceVisited(selectedPlace.id)}
                    size="lg"
                    className="w-full gap-2 text-lg py-6"
                    style={{
                      background: isPlaceVisited(selectedPlace.id) ? undefined : 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)',
                      color: isPlaceVisited(selectedPlace.id) ? undefined : 'black'
                    }}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    {isPlaceVisited(selectedPlace.id) ? 'Déjà visité' : 'Vérifier ma visite'}
                  </Button>

                  <Button
                    onClick={handleShare}
                    variant="outline"
                    size="lg"
                    className="w-full gap-2 text-lg py-6"
                  >
                    <Share2 className="w-5 h-5" />
                    Partager
                  </Button>
                </div>

                {/* Lecteur audio */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      🎧 Audio-guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Écoutez l'histoire fascinante de ce lieu (2 min)
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={handleAudioToggle}
                        variant="outline"
                        size="lg"
                        className="gap-2"
                      >
                        {isAudioPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        {isAudioPlaying ? 'Pause' : 'Écouter'}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="lg"
                        className="gap-2"
                      >
                        <Download className="w-5 h-5" />
                        Télécharger
                      </Button>
                    </div>

                    {isAudioPlaying && (
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary animate-pulse w-1/3" />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Signalement */}
                <div className="text-center">
                  <Button
                    onClick={handleReport}
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <Flag className="w-4 h-4" />
                    Suggérer une correction / Contenu sensible ?
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Check-in */}
      <Dialog open={isCheckinModalOpen} onOpenChange={setIsCheckinModalOpen}>
        <DialogContent className="max-w-md">
          <div className="text-center space-y-6 py-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-10 h-10 text-primary" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-2">Vérifier ma visite</h2>
              <p className="text-muted-foreground">
                Prouvez que vous êtes sur place
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleGPSCheck}
                disabled={checkingLocation}
                className="w-full gap-2"
                style={{
                  background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)',
                  color: 'black'
                }}
              >
                <MapPin className="w-5 h-5" />
                {checkingLocation ? 'Vérification GPS...' : 'Vérifier ma position GPS'}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-2 text-muted-foreground">ou</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                <Camera className="w-5 h-5" />
                Prendre une photo sur place
              </Button>
              
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              📍 Vous devez être à moins de 500m du lieu
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Récompense */}
      <Dialog open={isRewardModalOpen} onOpenChange={setIsRewardModalOpen}>
        <DialogContent className="max-w-md">
          <div className="text-center space-y-6 py-6">
            <div 
              className="w-32 h-32 mx-auto rounded-full flex items-center justify-center animate-scale-in"
              style={{
                background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)',
                animation: 'bounce 0.8s ease-in-out'
              }}
            >
              <Trophy className="w-16 h-16 text-white" />
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6" style={{ color: 'hsl(45 100% 51%)' }} />
                Félicitations !
                <Sparkles className="w-6 h-6" style={{ color: 'hsl(45 100% 51%)' }} />
              </h2>
              <p className="text-muted-foreground mb-4">
                Visite validée avec succès
              </p>
            </div>

            {selectedPlace && (
              <>
                <div className="py-6 px-8 bg-primary/5 rounded-2xl">
                  <div className="text-5xl font-bold mb-2" style={{ color: 'hsl(45 100% 51%)' }}>
                    +{selectedPlace.points}
                  </div>
                  <div className="text-lg text-muted-foreground">points gagnés</div>
                </div>

                <div className="flex items-center justify-center gap-2 p-4 bg-muted rounded-lg">
                  <Trophy className="w-6 h-6" style={{ color: 'hsl(45 100% 51%)' }} />
                  <span className="font-semibold">Badge "{selectedPlace.type}" débloqué !</span>
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleShare}
                variant="outline"
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                Partager
              </Button>
              <Button
                onClick={() => {
                  setIsRewardModalOpen(false);
                  setSelectedPlace(null);
                }}
                style={{
                  background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)',
                  color: 'black'
                }}
              >
                Continuer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default Country;
