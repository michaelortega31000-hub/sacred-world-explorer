import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockPlaces } from '@/data/placesData';
import { useApp } from '@/contexts/AppContext';

// Types pour Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

// Cache de géocodage pour éviter les appels répétés
const geocodeCache = new Map<string, { lat: number; lng: number; name?: string }>();

const VoiceCommand = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognition = useRef<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { flyToLocation } = useApp();

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  const findCityOrPlace = (locationName: string) => {
    const normalized = normalizeText(locationName);
    
    // PRIORITÉ 1: Recherche exacte par ville (pour les capitales/villes)
    let place = mockPlaces.find(p => 
      p.city && normalizeText(p.city) === normalized
    );

    // PRIORITÉ 2: Recherche partielle par ville
    if (!place) {
      place = mockPlaces.find(p => 
        p.city && (normalizeText(p.city).includes(normalized) || 
        normalized.includes(normalizeText(p.city)))
      );
    }

    // PRIORITÉ 3: Recherche exacte par nom de lieu
    if (!place) {
      place = mockPlaces.find(p => 
        normalizeText(p.name) === normalized
      );
    }

    // PRIORITÉ 4: Recherche partielle par nom
    if (!place) {
      place = mockPlaces.find(p => 
        normalizeText(p.name).includes(normalized) || 
        normalized.includes(normalizeText(p.name))
      );
    }

    return place;
  };

  // Récupère le token Mapbox (env -> localStorage -> défaut)
  const getMapboxToken = () => {
    return (
      import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN ||
      import.meta.env.VITE_MAPBOX_TOKEN ||
      localStorage.getItem('mapbox_token') ||
      'pk.eyJ1Ijoic2FjcmVkd29sZCIsImEiOiJjbWc3eXQ1YWIwMWxlMmtzaHppZWxkMzhnIn0.Rdmr8Vf5k04a-Z-8M0Uvaw'
    );
  };

  // Géocodage Mapbox avec timeout et cache
  const geocodeCity = async (query: string, timeoutMs = 2000): Promise<{ lat: number; lng: number; name?: string } | null> => {
    const normalizedQuery = normalizeText(query);
    
    // Vérifier le cache d'abord
    if (geocodeCache.has(normalizedQuery)) {
      console.log('🎯 Résultat trouvé dans le cache:', normalizedQuery);
      return geocodeCache.get(normalizedQuery)!;
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      const token = getMapboxToken();
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?types=place,locality&language=fr&limit=1&access_token=${token}`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!res.ok) return null;
      const data = await res.json();
      const feature = data.features?.[0];
      if (!feature?.center) return null;
      const [lng, lat] = feature.center;
      const name = feature.text_fr || feature.text || feature.place_name_fr || feature.place_name;
      
      const result = { lat, lng, name };
      geocodeCache.set(normalizedQuery, result);
      return result;
    } catch (e) {
      clearTimeout(timeoutId);
      if ((e as any).name === 'AbortError') {
        console.log('⏱️ Geocoding timeout après 2 secondes');
        toast({
          title: 'Timeout',
          description: 'La recherche a pris trop de temps',
          variant: 'destructive',
        });
      } else {
        console.error('Geocoding error', e);
      }
      return null;
    }
  };

  // Détermine le zoom selon le type de lieu
  const getAdaptiveZoom = (place: any): number => {
    const type = normalizeText(place.type);
    
    // Monuments/Sites très larges - Vue plus éloignée
    if (type.includes('pyramide') || 
        type.includes('site') || 
        type.includes('cite') ||
        type.includes('complexe') ||
        type.includes('ruines')) {
      return 13;
    }
    
    // Grandes structures religieuses - Vue moyenne
    if (type.includes('cathedrale') || 
        type.includes('basilique') || 
        type.includes('mosquee') ||
        type.includes('temple') ||
        type.includes('abbaye')) {
      return 15;
    }
    
    // Petites structures ou sanctuaires - Vue plus proche
    if (type.includes('chapelle') || 
        type.includes('eglise') || 
        type.includes('synagogue') ||
        type.includes('sanctuaire') ||
        type.includes('monastere')) {
      return 16;
    }
    
    // Vue par défaut pour les villes ou lieux inconnus
    return 12;
  };
  // Initialiser Web Speech API
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current!.continuous = false;
      recognition.current!.lang = 'fr-FR';
      recognition.current!.interimResults = false;
      recognition.current!.maxAlternatives = 1;

      recognition.current!.onstart = () => {
        setIsRecording(true);
        toast({
          title: "🎤 Enregistrement",
          description: "Dites 'amène-moi' suivi du lieu",
        });
      };

      recognition.current!.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('Transcription:', transcript);
        handleTranscription(transcript);
      };

      recognition.current!.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Erreur reconnaissance vocale:', event.error);
        setIsRecording(false);
        setIsProcessing(false);
        
        let errorMessage = "Erreur de reconnaissance vocale";
        if (event.error === 'no-speech') {
          errorMessage = "Aucune parole détectée";
        } else if (event.error === 'not-allowed') {
          errorMessage = "Permission microphone refusée";
        }
        
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
      };

      recognition.current!.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, []);

  const handleTranscription = async (transcription: string) => {
    try {
      setIsProcessing(true);

      // Parser la commande "amène-moi" / "amènes-moi" ou "emmène-moi" / "emmènes-moi"
      const commandRegex = /(?:am[èe]ne[s]?[- ]moi|emm[èe]ne[s]?[- ]moi)\s+(?:à|a|au|aux)?\s*(.+)/i;
      const match = transcription.match(commandRegex);

      if (match && match[1]) {
        const locationName = match[1].trim();
        console.log('Lieu recherché:', locationName);
        
        // 1) Essayer de trouver dans la base des lieux (pour centrer sur un monument connu)
        const place = findCityOrPlace(locationName);

        if (place) {
          const [lng, lat] = place.coordinates;
          const adaptiveZoom = getAdaptiveZoom(place);
          
          if (location.pathname !== '/explore') {
            navigate('/explore');
            setTimeout(() => {
              flyToLocation(lat, lng, adaptiveZoom, true); // preserveView = true
            }, 100);
          } else {
            flyToLocation(lat, lng, adaptiveZoom, true);
          }
          toast({
            title: '🎯 Destination trouvée !',
            description: `Zoom sur ${place.city || place.name}`,
          });
          return;
        }

        // 2) Fallback: géocoder n'importe quelle ville (ex: Tokyo)
        const geo = await geocodeCity(locationName);
        if (geo) {
          if (location.pathname !== '/explore') {
            navigate('/explore');
            setTimeout(() => {
              flyToLocation(geo.lat, geo.lng, 12, true); // Zoom 12 pour les villes, preserveView = true
            }, 100);
          } else {
            flyToLocation(geo.lat, geo.lng, 12, true);
          }
          toast({
            title: '🎯 Destination trouvée !',
            description: `Zoom sur ${geo.name || locationName}`,
          });
          return;
        }

        // 3) Aucune correspondance: proposer des suggestions
        const suggestions = mockPlaces
          .filter(p => {
            const pName = normalizeText(p.name);
            const search = normalizeText(locationName);
            return pName.includes(search.substring(0, 3)) || search.includes(pName.substring(0, 3));
          })
          .slice(0, 3)
          .map(p => p.name)
          .join(', ');

        toast({
          title: 'Lieu non trouvé',
          description: suggestions
            ? `Vouliez-vous dire : ${suggestions} ?`
            : "Je n'ai pas trouvé ce lieu",
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Commande non reconnue',
          description: "Dites 'amène-moi' suivi du nom d'un lieu",
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erreur traitement:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de traiter la commande vocale',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = () => {
    if (!recognition.current) {
      toast({
        title: "Non supporté",
        description: "Votre navigateur ne supporte pas la reconnaissance vocale",
        variant: "destructive",
      });
      return;
    }

    try {
      recognition.current.start();
    } catch (error) {
      console.error('Erreur démarrage:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la reconnaissance vocale",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (recognition.current) {
      recognition.current.stop();
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isProcessing}
      className={`relative ${isRecording ? 'animate-pulse' : ''}`}
      title="Commande vocale"
    >
      {isRecording ? (
        <MicOff className="h-5 w-5 text-destructive" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </Button>
  );
};

export default VoiceCommand;
