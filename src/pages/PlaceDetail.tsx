import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePlaceById } from '@/hooks/usePlaces';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ImageBackground } from '@/components/ImageBackground';
import { getBackgroundRotationImages } from '@/lib/religionImageHelper';
import { Progress } from '@/components/ui/progress';
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
  ImagePlus,
  ImageIcon,
  Hotel,
  Plus,
  X,
  Loader2,
  MapPinned,
  Map as MapIcon,
  Square,
  Bus
} from 'lucide-react';
import POIMiniMap from '@/components/POIMiniMap';
import { BackButton } from '@/components/BackButton';
import BottomNavigation from '@/components/BottomNavigation';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useToast } from '@/hooks/use-toast';
import { getImageUrl } from '@/lib/imageHelper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useApp, SavedPOI } from '@/contexts/AppContext';
import { getMapboxToken } from '@/lib/mapboxHelper';
import { logger } from '@/lib/logger';
import { buildSamplePOIs } from '@/lib/samplePoiData';
import { AddMemoryDialog } from '@/components/AddMemoryDialog';
import ReligiousSymbol from '@/components/ReligiousSymbol';
import { ReligiousSymbol3D } from '@/components/ReligiousSymbol3D';
import BadgeUnlock from '@/components/BadgeUnlock';
import { PhotoCapture } from '@/components/PhotoCapture';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useARSupport } from '@/hooks/useARSupport';
import { requestMotionPermission } from '@/utils/arPermissions';
import { toast as sonnerToast } from 'sonner';
import { AROverlay } from '@/components/ar/AROverlay';
import { ARFilters, type FilterType } from '@/components/ar/ARFilters';
import { captureARScene, saveARCapture, shareARCapture } from '@/utils/arCapture';
import { hapticFeedback } from '@/hooks/useARGestures';
import { useAudioGuide } from '@/hooks/useAudioGuide';
import PlaceDimensionsTabs from '@/components/place/PlaceDimensionsTabs';

const PlaceDetail = () => {
  const { placeId } = useParams<{ placeId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { visitPlace, isPlaceVisited, savePOI, removePOI, getPOIsForPlace, addToTrip, removeFromTrip, isInTrip } = useApp();
  const audioGuide = useAudioGuide();
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [communityPhotos, setCommunityPhotos] = useState<any[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
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
  const [arPermissionGranted, setArPermissionGranted] = useState(false);
  const [isPhotoVerificationOpen, setIsPhotoVerificationOpen] = useState(false);
  const [arCanvas, setArCanvas] = useState<HTMLCanvasElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  
  // POI search states
  interface SearchedPOI {
    id: string;
    name: string;
    type: 'restaurant' | 'lodging' | 'transport';
    address: string;
    coordinates: [number, number];
    transportType?: string;
  }
  const [nearbyPOIs, setNearbyPOIs] = useState<SearchedPOI[]>([]);
  const [searchingPOIs, setSearchingPOIs] = useState(false);
  const [selectedPOIType, setSelectedPOIType] = useState<'restaurant' | 'hotel' | 'transport' | null>(null);
  
  const { userProgress } = useApp();
  const backgroundImages = getBackgroundRotationImages(userProgress.selectedReligion);
  const arSupport = useARSupport();
  
  const { position } = useGeolocation(true);

  // Use the hybrid hook to get merged place data
  const { place, isLoading: placeLoading } = usePlaceById(placeId);

  // Resolve via shared helper (fuzzy filename support)
  // External URLs (http/https) should be used as-is
  const resolveImageUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return getImageUrl(url);
  };

  useEffect(() => {
    if (!placeLoading && !place) {
      navigate('/world');
    } else if (place) {
      fetchCommunityPhotos();
    }
  }, [place, placeLoading, navigate]);

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

  // Show loading state
  if (placeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
    if (!place.description) {
      toast({
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
      audioGuide.play(place.description, placeId!);
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

  const handleARToggle = async () => {
    if (!isARMode) {
      // Check AR support
      if (!arSupport.isSupported) {
        sonnerToast.error('AR non supportée', {
          description: 'Votre appareil ne supporte pas la réalité augmentée 3D',
        });
        return;
      }

      // Request motion permission if needed (iOS)
      if (arSupport.needsPermission && !arPermissionGranted) {
        const result = await requestMotionPermission();
        if (!result.granted) {
          sonnerToast.error('Permission refusée', {
            description: result.error || 'Les capteurs de mouvement sont nécessaires',
          });
          return;
        }
        setArPermissionGranted(true);
      }

      sonnerToast.success('AR 3D activée', {
        description: 'Bougez votre téléphone pour interagir avec le symbole',
      });
    }
    setIsARMode(!isARMode);
  };

  const handleCaptureAR = async () => {
    if (!arCanvas) {
      sonnerToast.error('Canvas non disponible');
      return;
    }

    setIsCapturing(true);
    hapticFeedback('tap');

    try {
      const blob = await captureARScene(arCanvas, {
        width: 1920,
        height: 1920,
        quality: 0.95,
        format: 'png',
      });

      const url = URL.createObjectURL(blob);
      setCapturedImage(url);
      setShowFilters(true);
      hapticFeedback('success');
    } catch (error) {
      console.error('Capture failed:', error);
      sonnerToast.error('Échec de la capture');
      hapticFeedback('error');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleApplyFilter = async (filter: FilterType) => {
    if (!capturedImage) return;

    try {
      // Convert data URL to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();

      // Save to storage
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await saveARCapture(blob, session.user.id, place?.name || 'unknown');
      }

      // Share
      const shared = await shareARCapture(
        blob,
        place?.name || '',
        `${place?.city}, ${place?.country}` || ''
      );

      if (shared) {
        hapticFeedback('success');
        sonnerToast.success('AR partagé avec succès!');
      } else {
        hapticFeedback('warning');
        sonnerToast.success('AR copié dans le presse-papiers');
      }

      setShowFilters(false);
      setCapturedImage(null);
    } catch (error) {
      console.error('Share failed:', error);
      sonnerToast.error('Échec du partage');
      hapticFeedback('error');
    }
  };

  const handleReport = () => {
    toast({
      title: "Signalement envoyé",
      description: "Merci pour votre contribution",
    });
  };

  // Search for nearby POIs (restaurants, hotels, or transports) - first from database, then Mapbox fallback
  const searchNearbyPOIs = async (type: 'restaurant' | 'hotel' | 'transport') => {
    if (!place) return;
    
    setSearchingPOIs(true);
    setSelectedPOIType(type);
    setNearbyPOIs([]);
    
    try {
      const cityVariants = [
        place.city,
        place.city.toLowerCase(),
        // Handle common variations (Barcelone/Barcelona, etc.)
        place.city.replace(/e$/, 'a'), // Barcelone -> Barcelona
        place.city.replace(/a$/, 'e'), // Barcelona -> Barcelone
      ];
      
      // First try to get from database
      if (type === 'restaurant') {
        const { data: dbRestaurants, error } = await supabase
          .from('restaurants')
          .select('id, name, address, city, coordinates, cuisine, type')
          .eq('verified', true)
          .or(cityVariants.map(c => `city.ilike.%${c}%`).join(','));
        
        if (!error && dbRestaurants && dbRestaurants.length > 0) {
          const pois: SearchedPOI[] = dbRestaurants.slice(0, 10).map((r: any) => ({
            id: r.id,
            name: r.name,
            type: 'restaurant' as const,
            address: r.address || `${r.city}`,
            coordinates: r.coordinates ? [r.coordinates.lng, r.coordinates.lat] as [number, number] : place.coordinates
          }));
          
          setNearbyPOIs(pois);
          setSearchingPOIs(false);
          return;
        }
      }
      
      // For hotels, first try to get from database
      if (type === 'hotel') {
        const { data: dbHotels, error } = await supabase
          .from('hotels')
          .select('id, name, address, city, coordinates, star_rating, price_range')
          .eq('verified', true)
          .or(cityVariants.map(c => `city.ilike.%${c}%`).join(','))
          .order('star_rating', { ascending: false });
        
        if (!error && dbHotels && dbHotels.length > 0) {
          const pois: SearchedPOI[] = dbHotels.slice(0, 10).map((h: any) => ({
            id: h.id,
            name: h.star_rating ? `${h.name} ${'⭐'.repeat(Math.min(h.star_rating, 5))}` : h.name,
            type: 'lodging' as const,
            address: h.address || `${h.city}`,
            coordinates: h.coordinates ? [h.coordinates.lng, h.coordinates.lat] as [number, number] : place.coordinates
          }));
          
          setNearbyPOIs(pois);
          setSearchingPOIs(false);
          return;
        }
      }
      
      // For transports, get from database
      if (type === 'transport') {
        const { data: dbTransports, error } = await supabase
          .from('transport_stops')
          .select('id, name, city, coordinates, transport_type, line_name, operator')
          .eq('verified', true)
          .or(cityVariants.map(c => `city.ilike.%${c}%`).join(','))
          .order('transport_type');
        
        if (!error && dbTransports && dbTransports.length > 0) {
          const transportIcons: Record<string, string> = {
            metro: '🚇',
            bus: '🚌',
            tram: '🚃',
            train: '🚆',
            airport: '✈️',
            ferry: '⛴️',
          };
          
          const pois: SearchedPOI[] = dbTransports.slice(0, 15).map((t: any) => ({
            id: t.id,
            name: `${transportIcons[t.transport_type] || '🚏'} ${t.name}`,
            type: 'transport' as const,
            address: t.line_name ? `${t.line_name}${t.operator ? ` - ${t.operator}` : ''}` : t.city,
            coordinates: t.coordinates ? [t.coordinates.lng, t.coordinates.lat] as [number, number] : place.coordinates,
            transportType: t.transport_type
          }));
          
          setNearbyPOIs(pois);
          setSearchingPOIs(false);
          
          if (pois.length === 0) {
            toast({
              title: "Aucun résultat",
              description: `Aucun transport trouvé à ${place.city}`,
            });
          }
          return;
        } else {
          // No transports found
          setSearchingPOIs(false);
          toast({
            title: "Aucun résultat",
            description: `Aucun transport trouvé à ${place.city}`,
          });
          return;
        }
      }
      
      // Fallback to Mapbox if no results found in DB (for restaurants and hotels only)
      const mapboxToken = getMapboxToken();
      const query = type === 'hotel' ? 'hotel hostel lodging' : 'restaurant';
      const [lon, lat] = place.coordinates;
      
      // Bounding box of ~15km around the place (typical city radius)
      const offset = 0.15;
      const bbox = `${lon - offset},${lat - offset},${lon + offset},${lat + offset}`;
      
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        `proximity=${lon},${lat}&` +
        `bbox=${bbox}&` +
        `limit=10&` +
        `access_token=${mapboxToken}`
      );
      
      const data = await response.json();
      
      if (data.features) {
        // Filter to only include results that mention the city name
        const cityName = place.city.toLowerCase();
        const filtered = data.features.filter((f: any) => 
          f.place_name.toLowerCase().includes(cityName)
        );
        
        const pois: SearchedPOI[] = filtered.slice(0, 6).map((f: any) => ({
          id: f.id,
          name: f.text || f.place_name.split(',')[0],
          type: type === 'hotel' ? 'lodging' as const : 'restaurant' as const,
          address: f.place_name,
          coordinates: f.center as [number, number]
        }));
        
        setNearbyPOIs(pois);
        
        if (pois.length === 0) {
          toast({
            title: "Aucun résultat",
            description: `Aucun ${type === 'hotel' ? 'hôtel' : 'restaurant'} trouvé à ${place.city}`,
          });
        }
      }
    } catch (error) {
      console.error('Error searching POIs:', error);
      toast({
        title: "Erreur de recherche",
        description: "Impossible de trouver des établissements à proximité",
        variant: "destructive"
      });
    } finally {
      setSearchingPOIs(false);
    }
  };

  // Handle saving a POI
  const handleSavePOI = (poi: SearchedPOI) => {
    savePOI({
      id: poi.id,
      name: poi.name,
      type: poi.type,
      address: poi.address,
      coordinates: poi.coordinates,
      placeId: placeId!
    });
    
    toast({
      title: "Ajouté à l'itinéraire",
      description: `${poi.name} sauvegardé`,
    });
  };

  // Check if a POI is already saved
  const isPOISaved = (poiId: string) => {
    const savedPOIs = getPOIsForPlace(placeId!);
    return savedPOIs.some(p => p.id === poiId);
  };

  // Get saved POIs for this place
  const savedPOIsForPlace = placeId ? getPOIsForPlace(placeId) : [];

  // Images de la galerie (pour l'exemple, on utilise la même image)
  const galleryImages = place.imageUrl ? [
    resolveImageUrl(place.imageUrl) || place.imageUrl, 
    resolveImageUrl(place.imageUrl) || place.imageUrl, 
    resolveImageUrl(place.imageUrl) || place.imageUrl
  ] : [];

  return (
    <ImageBackground 
      images={backgroundImages}
      carousel={true}
      blur={3}
      overlay="gradient"
      className="min-h-screen flex flex-col"
    >
      <div className="min-h-screen flex flex-col relative">
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
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.currentTarget.src = '/images/place-placeholder.jpg'; }}
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

            {/* Restaurants shortcut - top left */}
            <div className="absolute top-4 left-4 z-10">
              <Button
                size="icon"
                variant="outline"
                className="w-10 h-10 shadow-lg bg-background/90 backdrop-blur-sm"
                onClick={() => {
                  const servicesSection = document.getElementById('services-section');
                  servicesSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Utensils className="w-5 h-5" />
              </Button>
            </div>

            {/* Religious Symbol 3D - fullscreen AR overlay */}
            {isARMode && (
              <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
                {arSupport.isSupported ? (
                  <>
                    <ReligiousSymbol3D
                      religion={place.religion || 'christianity'}
                      unlocked={isPlaceVisited(placeId!)}
                      size="lg"
                      intensity={isPlaceVisited(placeId!) ? 90 : 30}
                      useDeviceOrientation={arPermissionGranted}
                      showPerformance={true}
                      onCanvasReady={setArCanvas}
                    />
                    
                    {/* AR Overlay with contextual info */}
                    <AROverlay
                      placeName={place.name}
                      placeLocation={`${place.city}, ${place.country}`}
                      placePoints={place.points}
                      userPosition={position}
                      placePosition={{ latitude: place.coordinates[0], longitude: place.coordinates[1] }}
                      unlocked={isPlaceVisited(placeId!)}
                    />

                    {/* Capture button */}
                    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-auto z-10">
                      <Button
                        size="lg"
                        onClick={handleCaptureAR}
                        disabled={isCapturing}
                        className="rounded-full w-16 h-16 p-0"
                        style={{
                          background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)',
                          color: 'black'
                        }}
                      >
                        <ImageIcon className="w-8 h-8" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <ReligiousSymbol 
                    religion={place.religion}
                    unlocked={isPlaceVisited(placeId!)}
                    size="lg"
                    intensity={isPlaceVisited(placeId!) ? 90 : 30}
                  />
                )}
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

          {/* Add to collection CTA */}
          <Button
            onClick={() => {
              if (isInTrip(placeId!)) {
                removeFromTrip(placeId!);
                toast({
                  title: 'Retiré de votre collection',
                  description: `${place.name} a été retiré.`,
                });
              } else {
                addToTrip(placeId!);
                toast({
                  title: 'Ajouté à votre collection',
                  description: `${place.name} fait désormais partie de votre parcours de pèlerin.`,
                });
              }
            }}
            size="lg"
            className="w-full gap-2 text-base py-6"
            variant={isInTrip(placeId!) ? 'outline' : 'default'}
            style={
              !isInTrip(placeId!)
                ? {
                    background:
                      'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)',
                    color: 'black',
                  }
                : undefined
            }
          >
            {isInTrip(placeId!) ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Dans ma collection
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Ajouter à ma collection
              </>
            )}
          </Button>

          {/* Dimensions spirituelle & culturelle */}
          <PlaceDimensionsTabs
            placeName={place.name}
            placeType={place.type}
            description={place.description}
          />

          {/* Étiquette du lieu */}
          <Card>
            <CardContent className="pt-6 space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>Étiquette :</strong> Respectez les usages du lieu (tenue
                appropriée, silence, vérifiez les autorisations pour les photos).
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Temps moyen de visite : 1h30</span>
              </p>
            </CardContent>
          </Card>

          {/* Services à Proximité */}
          <Card id="services-section">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPinned className="w-5 h-5" />
                Services à proximité de {place.city}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search buttons */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => searchNearbyPOIs('restaurant')}
                  variant={selectedPOIType === 'restaurant' ? 'default' : 'outline'}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  disabled={searchingPOIs}
                  style={selectedPOIType === 'restaurant' ? {
                    background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)',
                    color: 'black'
                  } : undefined}
                >
                  {searchingPOIs && selectedPOIType === 'restaurant' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Utensils className="w-5 h-5" />
                  )}
                  <span className="text-xs">Restaurants</span>
                </Button>
                
                <Button
                  onClick={() => searchNearbyPOIs('hotel')}
                  variant={selectedPOIType === 'hotel' ? 'default' : 'outline'}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  disabled={searchingPOIs}
                  style={selectedPOIType === 'hotel' ? {
                    background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)',
                    color: 'black'
                  } : undefined}
                >
                  {searchingPOIs && selectedPOIType === 'hotel' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Hotel className="w-5 h-5" />
                  )}
                  <span className="text-xs">Hôtels</span>
                </Button>
                
                <Button
                  onClick={() => searchNearbyPOIs('transport')}
                  variant={selectedPOIType === 'transport' ? 'default' : 'outline'}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  disabled={searchingPOIs}
                  style={selectedPOIType === 'transport' ? {
                    background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)',
                    color: 'black'
                  } : undefined}
                >
                  {searchingPOIs && selectedPOIType === 'transport' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Bus className="w-5 h-5" />
                  )}
                  <span className="text-xs">Transports</span>
                </Button>
              </div>

              {/* Search results */}
              {nearbyPOIs.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {nearbyPOIs.length} résultat{nearbyPOIs.length > 1 ? 's' : ''} trouvé{nearbyPOIs.length > 1 ? 's' : ''} à {place.city}
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {nearbyPOIs.map((poi) => {
                      const saved = isPOISaved(poi.id);
                      return (
                        <div 
                          key={poi.id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{poi.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              📍 {poi.address}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant={saved ? 'outline' : 'default'}
                            onClick={() => {
                              if (saved) {
                                removePOI(poi.id);
                                toast({
                                  title: "Retiré",
                                  description: `${poi.name} retiré de l'itinéraire`,
                                });
                              } else {
                                handleSavePOI(poi);
                              }
                            }}
                            className="ml-2 shrink-0"
                            style={!saved ? {
                              background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)',
                              color: 'black'
                            } : undefined}
                          >
                            {saved ? (
                              <><CheckCircle2 className="w-4 h-4 mr-1" /> Sauvegardé</>
                            ) : (
                              <><Plus className="w-4 h-4 mr-1" /> Ajouter</>
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Saved POIs for this place */}
              {savedPOIsForPlace.length > 0 && (
                <div className="pt-3 border-t space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    POIs sauvegardés pour ce lieu ({savedPOIsForPlace.length})
                  </p>
                  <div className="space-y-2">
                    {savedPOIsForPlace.map((poi) => (
                      <div 
                        key={poi.id}
                        className="flex items-center justify-between p-2 bg-success/10 rounded-lg border border-success/20"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {poi.type === 'restaurant' ? (
                            <Utensils className="w-4 h-4 text-success shrink-0" />
                          ) : poi.type === 'transport' ? (
                            <Bus className="w-4 h-4 text-success shrink-0" />
                          ) : (
                            <Hotel className="w-4 h-4 text-success shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{poi.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{poi.address}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            removePOI(poi.id);
                            toast({
                              title: "Retiré",
                              description: `${poi.name} retiré de l'itinéraire`,
                            });
                          }}
                          className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Mini-map for saved POIs */}
                  <div className="pt-3">
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <MapIcon className="w-4 h-4" />
                      Carte des services
                    </p>
                    <POIMiniMap
                      placeCoordinates={place.coordinates as [number, number]}
                      placeName={place.name}
                      savedPOIs={savedPOIsForPlace}
                    />
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!searchingPOIs && nearbyPOIs.length === 0 && savedPOIsForPlace.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Recherchez des restaurants, hôtels ou transports à {place.city} pour les ajouter à votre itinéraire
                </p>
              )}
            </CardContent>
          </Card>
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
                Écoutez l'histoire fascinante de ce lieu
              </p>
              
              {/* Contrôles audio */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleAudioToggle}
                  disabled={audioGuide.state.isLoading}
                  size="lg"
                  className="gap-2"
                  style={{
                    background: audioGuide.state.isPlaying 
                      ? 'hsl(var(--muted))' 
                      : 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)',
                    color: audioGuide.state.isPlaying ? 'hsl(var(--foreground))' : 'black'
                  }}
                >
                  {audioGuide.state.isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Génération...
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
                
                {(audioGuide.state.isPlaying || audioGuide.state.isPaused) && (
                  <Button
                    onClick={() => audioGuide.stop()}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <Square className="w-4 h-4" />
                    Stop
                  </Button>
                )}
                
                <Button
                  onClick={() => audioGuide.download(place.name)}
                  variant="ghost"
                  size="lg"
                  className="gap-2"
                  disabled={!audioGuide.state.duration}
                >
                  <Download className="w-5 h-5" />
                  <span className="hidden sm:inline">Télécharger</span>
                </Button>
              </div>

              {/* Barre de progression audio */}
              {(audioGuide.state.isPlaying || audioGuide.state.isPaused || audioGuide.state.progress > 0) && (
                <div className="space-y-2">
                  <div 
                    className="w-full h-3 bg-muted rounded-full overflow-hidden cursor-pointer"
                    onClick={handleProgressClick}
                  >
                    <div 
                      className="h-full transition-all duration-200"
                      style={{ 
                        width: `${audioGuide.state.progress}%`,
                        background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)'
                      }} 
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(audioGuide.state.currentTime)}</span>
                    <span>{formatTime(audioGuide.state.duration)}</span>
                  </div>
                </div>
              )}

              {/* Message d'erreur */}
              {audioGuide.state.error && (
                <p className="text-sm text-destructive">{audioGuide.state.error}</p>
              )}

              <p className="text-xs text-muted-foreground">
                Voix : Laura (FR) • ElevenLabs
              </p>
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
          <DialogTitle className="sr-only">Vérifier ma visite</DialogTitle>
          <DialogDescription className="sr-only">
            Prouvez que vous êtes sur place en utilisant le GPS ou en prenant une photo
          </DialogDescription>
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
          <DialogTitle className="sr-only">Félicitations</DialogTitle>
          <DialogDescription className="sr-only">
            Visite validée avec succès, vous avez gagné des points et un badge
          </DialogDescription>
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
          <DialogTitle className="sr-only">Photo en plein écran</DialogTitle>
          <DialogDescription className="sr-only">
            Affichage de la photo de la communauté en grand format
          </DialogDescription>
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

      {/* AR Filters */}
      {showFilters && capturedImage && (
        <ARFilters
          imageUrl={capturedImage}
          onApply={handleApplyFilter}
          onClose={() => {
            setShowFilters(false);
            setCapturedImage(null);
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
    </ImageBackground>
  );
};

export default PlaceDetail;
