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

  const handleTranscription = (transcription: string) => {
    try {
      setIsProcessing(true);

      // Parser la commande "amène-moi" ou "emmène-moi"
      const commandRegex = /(?:am[èe]ne[- ]moi|emm[èe]ne[- ]moi)\s+(?:à|a|au|aux)?\s*(.+)/i;
      const match = transcription.match(commandRegex);

      if (match && match[1]) {
        const locationName = match[1].trim();
        console.log('Lieu recherché:', locationName);
        
        const place = findCityOrPlace(locationName);

        if (place) {
          // Toujours zoomer sur la ville/lieu sans naviguer
          const [lng, lat] = place.coordinates;
          flyToLocation(lat, lng, 12);
          toast({
            title: "🎯 Destination trouvée !",
            description: `Zoom sur ${place.city || place.name}`,
          });
        } else {
          // Suggestions de lieux similaires
          const suggestions = mockPlaces
            .filter(p => {
              const pName = normalizeText(p.name);
              const search = normalizeText(locationName);
              return pName.includes(search.substring(0, 3)) || 
                     search.includes(pName.substring(0, 3));
            })
            .slice(0, 3)
            .map(p => p.name)
            .join(', ');

          toast({
            title: "Lieu non trouvé",
            description: suggestions 
              ? `Vouliez-vous dire : ${suggestions} ?`
              : "Je n'ai pas trouvé ce lieu dans la base de données",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Commande non reconnue",
          description: "Dites 'amène-moi' suivi du nom d'un lieu",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur traitement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter la commande vocale",
        variant: "destructive",
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
