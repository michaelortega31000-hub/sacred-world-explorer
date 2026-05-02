import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAudioGuide } from '@/hooks/useAudioGuide';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { MapPin, Trophy, Flag, Users, Target, CheckCircle2, Book, Plus, Calendar, Globe, Camera, Share2, Play, Pause, Download, Info, Sparkles, Clock, Utensils, Loader2, Building2, Church, Hotel, Bus } from 'lucide-react';
import { useApp, Place } from '@/contexts/AppContext';
import { usePlacesByCountry, useAllCountries } from '@/hooks/usePlaces';
import RankingTab from '@/components/RankingTab';
import CountryRankingTab from '@/components/CountryRankingTab';
import FriendsRankingTab from '@/components/FriendsRankingTab';
import WeeklyQuestTab from '@/components/WeeklyQuestTab';
import TripPlannerTab from '@/components/TripPlannerTab';
import RestaurantsTab from '@/components/RestaurantsTab';
import { BackButton } from '@/components/BackButton';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getImageUrl } from '@/lib/imageHelper';
import { ImageBackground } from '@/components/ImageBackground';
import { getImagesByCountry } from '@/lib/religionImageHelper';
import { useAssistant } from '@/App';
import { MessageCircle } from 'lucide-react';
import { PlaceSymbol } from '@/components/quest/PlaceSymbol';
import { PlacePhoto } from '@/components/quest/PlacePhoto';


const Country = () => {
  const { countryName: country } = useParams<{ countryName: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { visitPlace, isPlaceVisited, userProgress, addToTrip, removeFromTrip, isInTrip } = useApp();
  const { toast: toastHook } = useToast();
  const backgroundImages = getImagesByCountry(country);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const audioGuide = useAudioGuide();
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  
  const cityRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Get active tab from URL or default to 'places'
  const activeTab = searchParams.get('tab') || 'places';
  
  // Use the hybrid hook to get merged places (DB + local)
  const { places, isLoading: placesLoading } = usePlacesByCountry(country);
  const { countries: allCountries, isLoading: countriesLoading } = useAllCountries();
  const { setIsOpen: openAssistant } = useAssistant();
  
  const sortedCountries = allCountries.sort((a, b) => {
    const nameA = t(`countries.${a}`, a);
    const nameB = t(`countries.${b}`, b);
    return nameA.localeCompare(nameB);
  });

  // Avertir si aucun monument trouvé (only after loading)
  useEffect(() => {
    if (country && !placesLoading && places.length === 0) {
      console.warn(`⚠️ Aucun monument trouvé pour le pays: "${country}"`);
      
      toast.error(
        `Aucun monument trouvé pour "${country}". Vérifiez le nom du pays.`,
        { duration: 5000 }
      );
    }
  }, [country, places.length, placesLoading]);


  // Category counts
  const categoryCounts = useMemo(() => {
    const religious = places.filter(p => (p.placeCategory || 'religious_site') === 'religious_site').length;
    const museums = places.filter(p => p.placeCategory === 'museum').length;
    return { religious, museums, total: places.length };
  }, [places]);

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

  // Resolve image URLs:
  // - External URLs (http/https) should be used as-is
  // - Local asset paths can go through getImageUrl (fuzzy filename support)
  const resolveImageUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return getImageUrl(url);
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
      logger.error('Erreur de partage:', error);
    }
  };

  const handleAudioToggle = () => {
    if (!selectedPlace?.description) {
      toastHook({
        title: "Aucun contenu audio",
        description: "Ce lieu n'a pas de description disponible",
        variant: "destructive"
      });
      return;
    }

    if (audioGuide.state.isPlaying) {
      audioGuide.pause();
    } else if (audioGuide.state.isPaused) {
      audioGuide.resume();
    } else {
      audioGuide.play(selectedPlace.description, selectedPlace.id);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioGuide.state.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = percentage * audioGuide.state.duration;
    audioGuide.seek(time);
  };

  // Stopper l'audio quand on ferme le modal
  useEffect(() => {
    if (!selectedPlace) {
      audioGuide.stop();
    }
  }, [selectedPlace]);

  const handleReport = () => {
    toastHook({
      title: "Signalement envoyé",
      description: "Merci pour votre contribution",
    });
  };

  return (
    <ImageBackground 
      images={backgroundImages}
      carousel={true}
      blur={3}
      overlay="gradient"
      className="min-h-screen flex flex-col"
    >
      <div className="min-h-screen flex flex-col relative">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          {/* Assistant Chat Button */}
          <Button
            onClick={() => openAssistant(true)}
            size="icon"
            className="w-12 h-12 rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
          
          {/* Country Selector */}
          <Select value={country} onValueChange={handleCountryChange}>
            <SelectTrigger className="w-[200px] bg-card border-border">
              <Globe className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Choisir un pays" />
            </SelectTrigger>
            <SelectContent className="max-h-[400px] bg-card border-border z-50">
              {sortedCountries.map((countryName) => (
                <SelectItem key={countryName} value={countryName}>
                  {t(`countries.${countryName}`, countryName)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => navigate(`/country/${country}?tab=${value}`)} className="flex-1 flex flex-col">
        <div className="border-b border-border bg-card sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-2 sm:px-4">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent overflow-x-auto flex-nowrap">
              <TabsTrigger value="places" className="gap-1 sm:gap-2 rounded-none border-b-2 data-[state=active]:border-primary px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm whitespace-nowrap">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t('country.title')}</span>
                <span className="sm:hidden">Lieux</span>
              </TabsTrigger>
              <TabsTrigger value="quest" className="gap-1 sm:gap-2 rounded-none border-b-2 data-[state=active]:border-primary px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm whitespace-nowrap">
                <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t('tabs.weeklyQuest')}</span>
                <span className="sm:hidden">Quête</span>
              </TabsTrigger>
              <TabsTrigger value="trip" className="gap-1 sm:gap-2 rounded-none border-b-2 data-[state=active]:border-primary px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm whitespace-nowrap">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t('tabs.tripPlanner')}</span>
                <span className="sm:hidden">Voyage</span>
              </TabsTrigger>
              <TabsTrigger value="restaurants" className="gap-1 sm:gap-2 rounded-none border-b-2 data-[state=active]:border-primary px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm whitespace-nowrap">
                <Utensils className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Restaurants</span>
                <span className="sm:hidden">Resto</span>
              </TabsTrigger>
              <TabsTrigger value="rankings" className="gap-1 sm:gap-2 rounded-none border-b-2 data-[state=active]:border-primary px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm whitespace-nowrap">
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Classements</span>
                <span className="sm:hidden">Rangs</span>
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
            <p className="text-muted-foreground mb-4">
              {placesLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Chargement...
                </span>
              ) : (
                <>
                  {categoryCounts.total} lieu{categoryCounts.total > 1 ? 'x' : ''}
                  <span className="text-sm ml-2">
                    ({categoryCounts.religious} sacrés · {categoryCounts.museums} musées)
                  </span>
                </>
              )}
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
                                <PlacePhoto
                                  src={resolveImageUrl(place.imageUrl) || place.imageUrl}
                                  alt={place.name}
                                  type={place.type}
                                  name={place.name}
                                  placeId={place.id}
                                  className="w-full h-full"
                                />
                                {/* Restaurant button - top left */}
                                <div className="absolute top-2 left-2">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Navigate to restaurants tab with place coordinates for proximity filtering
                                      const lat = place.coordinates[1];
                                      const lng = place.coordinates[0];
                                      navigate(`/country/${country}?tab=restaurants&city=${encodeURIComponent(place.city || '')}&lat=${lat}&lng=${lng}`);
                                    }}
                                    className="opacity-90 group-hover:opacity-100 transition-opacity"
                                    title="Voir les restaurants à proximité (50km)"
                                  >
                                    <Utensils className="w-4 h-4" />
                                  </Button>
                                </div>
                                {/* Add to trip button - top right */}
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
                              <div className="h-48 cursor-pointer relative" onClick={() => setSelectedPlace(place)}>
                                <PlaceSymbol type={place.type} name={place.name} placeId={place.id} />
                              </div>
                            )}
                            <CardHeader className="cursor-pointer" onClick={() => setSelectedPlace(place)}>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <CardTitle className="flex-1">{place.name}</CardTitle>
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                  {visited && <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />}
                                </div>
                              </div>
                              {/* Use a div instead of CardDescription (<p>) so the
                                  child Badges (<div>) don't violate DOM nesting. */}
                              <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                                {place.placeCategory === 'museum' ? (
                                  <Building2 className="w-3 h-3 text-blue-500" />
                                ) : (
                                  <Church className="w-3 h-3 text-amber-500" />
                                )}
                                <span>{place.type}</span>
                                {place.placeCategory === 'museum' && (
                                  <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/20">
                                    Musée
                                  </Badge>
                                )}
                                {place.tags?.includes('wikidata') && (
                                  <Badge
                                    variant="secondary"
                                    className="text-[10px] bg-amber-300/10 text-amber-200/85 border-amber-300/25 font-medium"
                                    title="Donnée enrichie depuis Wikidata (CC0)"
                                  >
                                    Wikidata
                                  </Badge>
                                )}
                              </div>
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
                <TabsTrigger value="friends" className="gap-2">
                  <Users className="w-4 h-4" />
                  Classement amis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <RankingTab />
              </TabsContent>

              <TabsContent value="country">
                <CountryRankingTab />
              </TabsContent>

              <TabsContent value="friends">
                <FriendsRankingTab />
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>

        <TabsContent value="quest" className="flex-1 m-0">
          <WeeklyQuestTab />
        </TabsContent>

        <TabsContent value="trip" className="flex-1 m-0 overflow-y-auto">
          <TripPlannerTab />
        </TabsContent>

        <TabsContent value="restaurants" className="flex-1 m-0 p-6">
          <RestaurantsTab 
            country={country || ''} 
            city={searchParams.get('city') || undefined}
            placeCoordinates={
              searchParams.get('lat') && searchParams.get('lng')
                ? [parseFloat(searchParams.get('lng')!), parseFloat(searchParams.get('lat')!)]
                : undefined
            }
          />
        </TabsContent>
      </Tabs>

      {/* Dialog détail du lieu (Écran 5) */}
      <Dialog open={!!selectedPlace} onOpenChange={() => setSelectedPlace(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {selectedPlace && (
            <>
              {/* Galerie d'images — only show carousel if we have a verified
                  photo. For unverified entries (Wikidata-sourced), show the
                  symbolic PlaceSymbol instead of misleading photography. */}
              {selectedPlace.imageUrl ? (
                <div className="relative w-full h-72 bg-muted">
                  <Carousel className="w-full h-full">
                    <CarouselContent>
                      {[selectedPlace.imageUrl, selectedPlace.imageUrl, selectedPlace.imageUrl].map((img, index) => (
                        <CarouselItem key={index}>
                          <div className="relative w-full h-72">
                            <PlacePhoto
                              src={resolveImageUrl(img) || img}
                              alt={`${selectedPlace.name} - Photo ${index + 1}`}
                              type={selectedPlace.type}
                              name={selectedPlace.name}
                              placeId={selectedPlace.id}
                              className="w-full h-full"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </Carousel>
                </div>
              ) : (
                <div className="relative w-full h-72">
                  <PlaceSymbol type={selectedPlace.type} name={selectedPlace.name} />
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

                {/* Services à proximité */}
                <Card className="border border-border/50 bg-gradient-to-br from-card to-card/80">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Services à proximité
                    </CardTitle>
                    <CardDescription>
                      Trouvez restaurants, hôtels et transports près de ce lieu
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        onClick={() => {
                          setSelectedPlace(null);
                          navigate(`/country/${country}?tab=restaurants&lat=${selectedPlace.coordinates[1]}&lng=${selectedPlace.coordinates[0]}`);
                        }}
                        variant="outline"
                        className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-primary/10 hover:border-primary/50"
                      >
                        <Utensils className="w-6 h-6 text-amber-500" />
                        <span className="text-xs font-medium">Restaurants</span>
                      </Button>
                      
                      <Button
                        onClick={() => {
                          setSelectedPlace(null);
                          navigate(`/place/${selectedPlace.id}?scrollTo=services`);
                        }}
                        variant="outline"
                        className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-primary/10 hover:border-primary/50"
                      >
                        <Hotel className="w-6 h-6 text-blue-500" />
                        <span className="text-xs font-medium">Hôtels</span>
                      </Button>
                      
                      <Button
                        onClick={() => {
                          setSelectedPlace(null);
                          navigate(`/place/${selectedPlace.id}?scrollTo=services`);
                        }}
                        variant="outline"
                        className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-primary/10 hover:border-primary/50"
                      >
                        <Bus className="w-6 h-6 text-green-500" />
                        <span className="text-xs font-medium">Transports</span>
                      </Button>
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
                        disabled={audioGuide.state.isLoading}
                      >
                        {audioGuide.state.isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Chargement...
                          </>
                        ) : audioGuide.state.isPlaying ? (
                          <>
                            <Pause className="w-5 h-5" />
                            Pause
                          </>
                        ) : audioGuide.state.isPaused ? (
                          <>
                            <Play className="w-5 h-5" />
                            Reprendre
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5" />
                            Écouter
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="lg"
                        className="gap-2"
                        onClick={() => selectedPlace && audioGuide.download(selectedPlace.name)}
                        disabled={!audioGuide.state.duration}
                      >
                        <Download className="w-5 h-5" />
                        Télécharger
                      </Button>
                    </div>

                    {(audioGuide.state.isPlaying || audioGuide.state.isPaused || audioGuide.state.progress > 0) && (
                      <div className="space-y-2">
                        <div 
                          className="w-full h-2 bg-muted rounded-full overflow-hidden cursor-pointer"
                          onClick={handleProgressClick}
                        >
                          <div 
                            className="h-full bg-primary transition-all duration-300" 
                            style={{ width: `${audioGuide.state.progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{formatTime(audioGuide.state.currentTime)}</span>
                          <span>{formatTime(audioGuide.state.duration)}</span>
                        </div>
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
    </ImageBackground>
  );
};

export default Country;
