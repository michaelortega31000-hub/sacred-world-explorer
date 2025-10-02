import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAllPlaces } from '@/data/placesData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
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
  Info
} from 'lucide-react';
import Header from '@/components/Header';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useToast } from '@/hooks/use-toast';
import { getImageUrl } from '@/lib/imageHelper';

const PlaceDetail = () => {
  const { placeId } = useParams<{ placeId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Resolve via shared helper (fuzzy filename support)
  const resolveImageUrl = (url?: string) => (url ? getImageUrl(url) : undefined);

  const allPlaces = getAllPlaces();
  const place = allPlaces.find(p => p.id === placeId);

  useEffect(() => {
    if (!place) {
      navigate('/world');
    }
  }, [place, navigate]);

  if (!place) return null;

  const handleCheckIn = async () => {
    setCheckingLocation(true);
    
    // Simuler la vérification GPS
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          });
        });

        // Calculer la distance (simplifié)
        const distance = calculateDistance(
          position.coords.latitude,
          position.coords.longitude,
          place.coordinates[1],
          place.coordinates[0]
        );

        if (distance <= 500) {
          // Dans le rayon de 500m
          setIsCheckinModalOpen(false);
          setTimeout(() => {
            setIsRewardModalOpen(true);
          }, 300);
          
          toast({
            title: "Visite validée !",
            description: `+${place.points} points gagnés`,
          });
        } else {
          toast({
            title: "Trop loin",
            description: `Vous devez être à moins de 500m du lieu (actuellement à ${Math.round(distance)}m)`,
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Erreur GPS",
          description: "Impossible d'accéder à votre position. Utilisez la photo comme preuve.",
          variant: "destructive"
        });
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
      console.error('Erreur de partage:', error);
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
      <Header showBack backTo={`/country/${place.country}`} backLabel="Retour" />

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
            {/* Vérifier ma visite */}
            <Button
              onClick={() => setIsCheckinModalOpen(true)}
              size="lg"
              className="w-full gap-2 text-lg py-6"
              style={{
                background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)',
                color: 'black'
              }}
            >
              <CheckCircle2 className="w-5 h-5" />
              Vérifier ma visite
            </Button>

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
