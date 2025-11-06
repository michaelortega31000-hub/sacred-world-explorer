import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAllPlaces } from '@/data/placesData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Camera, 
  Share2, 
  Flag, 
  Play,
  Pause,
  Download,
  Trophy,
  Sparkles,
  Info,
  Users,
  Utensils,
  ImagePlus
} from 'lucide-react';
import { BackButton } from '@/components/BackButton';
import BottomNavigation from '@/components/BottomNavigation';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useToast } from '@/hooks/use-toast';
import { getImageUrl } from '@/lib/imageHelper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { logger } from '@/lib/logger';
import { AddMemoryDialog } from '@/components/AddMemoryDialog';
import ReligiousSymbol from '@/components/ReligiousSymbol';
import BadgeUnlock from '@/components/BadgeUnlock';
import { PhotoCapture } from '@/components/PhotoCapture';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast as sonnerToast } from 'sonner';

const PlaceDetail = () => {
  const { placeId } = useParams<{ placeId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { visitPlace, isPlaceVisited } = useApp();
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [communityPhotos, setCommunityPhotos] = useState<any[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [hasRestaurants, setHasRestaurants] = useState(false);
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
  const [badgeUnlockData, setBadgeUnlockData] = useState<{
    isOpen: boolean;
    badgeType: string;
    religion?: string;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
    placeName?: string;
  }>({
    isOpen: false,
    badgeType: '',
    tier: 'bronze'
  });
  const [isARMode, setIsARMode] = useState(false);
  const [isPhotoVerificationOpen, setIsPhotoVerificationOpen] = useState(false);
  
  const { position } = useGeolocation(true);

  // Resolve via shared helper (fuzzy filename support)
  const resolveImageUrl = (url?: string) => (url ? getImageUrl(url) : undefined);

  const allPlaces = getAllPlaces();
  const place = allPlaces.find(p => p.id === placeId);

  useEffect(() => {
    if (!place) {
      navigate('/world');
    } else {
      fetchCommunityPhotos();
      checkRestaurantsAvailability();
    }
  }, [place, navigate]);

  const checkRestaurantsAvailability = async () => {
    if (!place?.city) return;
    
    try {
      const { count, error } = await supabase
        .from('restaurants')
        .select('id', { count: 'exact', head: true })
        .eq('verified', true)
        .eq('city', place.city);

      if (!error && count !== null) {
        setHasRestaurants(count > 0);
      }
    } catch (error) {
      logger.error('Error checking restaurants:', error);
    }
  };

  const fetchCommunityPhotos = async () => {
    if (!placeId) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      
      // Fetch public photos + user's private photos
      let query = supabase
        .from('memories')
        .select('id, media_urls, title, created_at, is_public, user_id')
        .eq('place_id', placeId)
        .not('media_urls', 'is', null);
      
      if (user) {
        // Include public photos and user's own photos (public or private)
        query = query.or(`is_public.eq.true,user_id.eq.${user.id}`);
      } else {
        // Only public photos for non-authenticated users
        query = query.eq('is_public', true);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Flatten the media_urls arrays
      // Generate signed URLs for photos
      const photosWithUrls = await Promise.all(
        (data || []).flatMap(memory => 
          (memory.media_urls || []).map(async (path) => {
            const { data: signedUrlData } = await supabase.storage
              .from('memory-photos')
              .createSignedUrl(path, 3600); // 1 hour expiry
            
            return {
              url: signedUrlData?.signedUrl || '',
              title: memory.title,
              created_at: memory.created_at,
              is_own: user?.id === memory.user_id
            };
          })
        )
      );
      
      setCommunityPhotos(photosWithUrls.filter(p => p.url));
    } catch (error) {
      // Error handling without exposing details
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les photos',
        variant: 'destructive',
      });
    } finally {
      setLoadingPhotos(false);
    }
  };

  if (!place) return null;

  const handleCheckIn = async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    if (!currentSession?.user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour valider une visite",
        variant: "destructive"
      });
      return;
    }

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

        // Call server-side verification
        const response = await supabase.functions.invoke('verify-visit', {
          body: {
            placeId: placeId,
            placeCoordinates: place.coordinates,
            placePoints: place.points,
            userLat: position.coords.latitude,
            userLon: position.coords.longitude
          }
        });

        if (response.error) {
          throw response.error;
        }

        if (response.data?.success) {
          // Update local state
          visitPlace(placeId!, place.points);
          setIsCheckinModalOpen(false);
          setTimeout(() => {
            setIsRewardModalOpen(true);
          }, 300);
          
          toast({
            title: "Visite validée !",
            description: `+${response.data.points} points gagnés`,
          });
        } else {
          toast({
            title: "Vérification échouée",
            description: response.data?.error || "Vous êtes trop loin du lieu",
            variant: "destructive"
          });
        }
      } catch (error: any) {
        if (error?.message?.includes('Rate limit exceeded')) {
          toast({
            title: "Limite atteinte",
            description: "Maximum 10 vérifications par jour. Réessayez demain.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erreur GPS",
            description: "Impossible d'accéder à votre position. Utilisez la photo comme preuve.",
            variant: "destructive"
          });
        }
      }
    } else {
      toast({
        title: "GPS non disponible",
        description: "Utilisez la photo comme preuve de visite",
        variant: "destructive"
      });
    }
    
    setCheckingLocation(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      visitPlace(placeId!, place.points);
      toast({
        title: "Photo capturée",
        description: "Votre photo a été enregistrée comme preuve de visite",
      });
      
      // Valider automatiquement avec photo
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
    const shareData = {
      title: place.name,
      text: `J'ai visité ${place.name} avec SacredWorld !`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copier dans le presse-papier
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Lien copié",
          description: "Le lien a été copié dans votre presse-papier",
        });
      }
    } catch (error) {
      logger.error('Erreur de partage:', error);
    }
  };

  const handleAudioToggle = () => {
    setIsAudioPlaying(!isAudioPlaying);
    // TODO: Implémenter la lecture audio avec ElevenLabs
    toast({
      title: isAudioPlaying ? "Audio en pause" : "Lecture audio",
      description: "Fonctionnalité audio à venir",
    });
  };

  const handleReport = () => {
    toast({
      title: "Signalement envoyé",
      description: "Merci pour votre contribution",
    });
  };

  // Images de la galerie (pour l'exemple, on utilise la même image)
  const galleryImages = place.imageUrl ? [
    resolveImageUrl(place.imageUrl) || place.imageUrl, 
    resolveImageUrl(place.imageUrl) || place.imageUrl, 
    resolveImageUrl(place.imageUrl) || place.imageUrl
  ] : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <BackButton />

      <div className="flex-1 overflow-y-auto">
        {/* Galerie d'images */}
        {galleryImages.length > 0 && (
          <div className="relative w-full h-64 md:h-96 bg-muted">
            <Carousel className="w-full h-full">
              <CarouselContent>
                {galleryImages.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="relative w-full h-64 md:h-96">
                      <img
                        src={img}
                        alt={`${place.name} - Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {galleryImages.length > 1 && (
                <>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </>
              )}
            </Carousel>

            {/* AR Toggle - top left */}
            <div className="absolute top-4 left-4 z-10">
              <Button
                size="lg"
                variant={isARMode ? "default" : "outline"}
                className="gap-2 shadow-lg"
                onClick={() => setIsARMode(!isARMode)}
              >
                <Camera className="w-5 h-5" />
                {isARMode ? "AR activé" : "Activer AR"}
              </Button>
            </div>

            {/* Restaurant icon - top right */}
            {hasRestaurants && place.city && (
              <div className="absolute top-4 right-4 z-10">
                <Button
                  size="lg"
                  className="gap-2 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)',
                    color: 'black'
                  }}
                  onClick={() => navigate(`/country/${place.country}?tab=restaurants&city=${encodeURIComponent(place.city || '')}`)}
                >
                  <Utensils className="w-5 h-5" />
                  Restaurants à proximité
                </Button>
              </div>
            )}

            {/* Religious Symbol - top center (visible only in AR mode) */}
            {isARMode && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <ReligiousSymbol 
                  religion={place.religion}
                  unlocked={isPlaceVisited(placeId!)}
                  size="md"
                  intensity={isPlaceVisited(placeId!) ? 90 : 30}
                />
              </div>
            )}

            {/* Indicateur de position */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {galleryImages.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full bg-white/50"
                />
              ))}
            </div>
          </div>
        )}

        {/* Contenu principal */}
        <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
          {/* En-tête */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{place.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {place.city}, {place.country}
                  </span>
                  <Badge variant="outline">{place.type}</Badge>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold" style={{ color: 'hsl(45 100% 51%)' }}>
                  +{place.points}
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
                    Visitez ce lieu pour gagner le badge "{place.type}"
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
              <p className="leading-relaxed">{place.description}</p>
              
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
            {/* Vérifier ma visite - caché si déjà visité */}
            {!isPlaceVisited(placeId!) && (
              <div className="space-y-3 md:col-span-2">
                <div className="grid md:grid-cols-2 gap-3">
                  <Button
                    onClick={() => setIsCheckinModalOpen(true)}
                    variant="outline"
                    size="lg"
                    className="gap-2 text-lg py-6"
                  >
                    <MapPin className="w-5 h-5" />
                    Validation rapide
                  </Button>
                  
                  <Button
                    onClick={() => {
                      if (!position) {
                        sonnerToast.error('Activez la géolocalisation pour utiliser cette fonction');
                        return;
                      }
                      setIsPhotoVerificationOpen(true);
                    }}
                    disabled={!position}
                    size="lg"
                    className="gap-2 text-lg py-6"
                    style={{
                      background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)',
                      color: 'black'
                    }}
                  >
                    <Camera className="w-5 h-5" />
                    Vérifier avec photo
                  </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  💡 La validation photo utilise l'IA pour plus de sécurité
                </p>
              </div>
            )}

            {isPlaceVisited(placeId!) && (
              <div className="w-full p-4 bg-success/10 border border-success rounded-lg flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="font-semibold text-success">Lieu déjà visité</span>
              </div>
            )}

            {/* Partager */}
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

              {/* Barre de progression audio (si en lecture) */}
              {isAudioPlaying && (
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-pulse w-1/3" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Photos de la communauté */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Photos des visiteurs
                </CardTitle>
                <Button
                  onClick={() => setIsAddMemoryOpen(true)}
                  size="sm"
                  className="gap-2"
                  style={{
                    background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)',
                    color: 'black'
                  }}
                >
                  <ImagePlus className="w-4 h-4" />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingPhotos ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              ) : communityPhotos.length === 0 ? (
                <div className="text-center py-8">
                  <Camera className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Aucune photo partagée pour l'instant
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Soyez le premier à partager vos souvenirs !
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {communityPhotos.map((photo, index) => (
                    <div 
                      key={index} 
                      className="relative aspect-square cursor-pointer group"
                      onClick={() => setFullscreenImage(photo.url)}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title || 'Photo visiteur'}
                        className="w-full h-full object-cover rounded-lg transition-transform group-hover:scale-105"
                        onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                      />
                      {photo.is_own && (
                        <div className="absolute top-1 right-1 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded">
                          Vous
                        </div>
                      )}
                    </div>
                  ))}
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
      </div>

      {/* Navigation du bas */}
      <BottomNavigation />

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
                onClick={handleCheckIn}
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
            {/* Badge animé */}
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

            <div className="py-6 px-8 bg-primary/5 rounded-2xl">
              <div className="text-5xl font-bold mb-2" style={{ color: 'hsl(45 100% 51%)' }}>
                +{place.points}
              </div>
              <div className="text-lg text-muted-foreground">points gagnés</div>
            </div>

            <div className="flex items-center justify-center gap-2 p-4 bg-muted rounded-lg">
              <Trophy className="w-6 h-6" style={{ color: 'hsl(45 100% 51%)' }} />
              <span className="font-semibold">Badge "{place.type}" débloqué !</span>
            </div>

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
                onClick={() => setIsRewardModalOpen(false)}
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

      {/* Modal Fullscreen Image */}
      <Dialog open={!!fullscreenImage} onOpenChange={() => setFullscreenImage(null)}>
        <DialogContent className="max-w-4xl p-0">
          <div className="relative">
            <img
              src={fullscreenImage || ''}
              alt="Photo en plein écran"
              className="w-full h-auto max-h-[90vh] object-contain"
              onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Memory Dialog */}
      <AddMemoryDialog
        open={isAddMemoryOpen}
        onOpenChange={setIsAddMemoryOpen}
        placeId={placeId!}
        placeName={place.name}
        onSuccess={fetchCommunityPhotos}
      />

      {/* Badge Unlock Animation */}
      <BadgeUnlock
        isOpen={badgeUnlockData.isOpen}
        onClose={() => setBadgeUnlockData({ ...badgeUnlockData, isOpen: false })}
        badgeType={badgeUnlockData.badgeType}
        religion={badgeUnlockData.religion}
        tier={badgeUnlockData.tier}
        placeName={badgeUnlockData.placeName}
      />

      {/* Photo Verification */}
      {position && (
        <PhotoCapture
          isOpen={isPhotoVerificationOpen}
          onClose={() => setIsPhotoVerificationOpen(false)}
          placeId={placeId!}
          placeName={place?.name || ''}
          userLat={position.latitude}
          userLon={position.longitude}
          onSuccess={async ({ pointsEarned }) => {
            // Show badge unlock animation
            setBadgeUnlockData({
              isOpen: true,
              religion: place?.religion || '',
              badgeType: 'visit',
              tier: 'gold',
              placeName: place?.name
            });

            // Refresh the page data
            window.location.reload();
          }}
        />
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default PlaceDetail;
