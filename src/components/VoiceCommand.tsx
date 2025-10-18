import { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { mockPlaces } from '@/data/placesData';

const VoiceCommand = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  const findPlace = (locationName: string) => {
    const normalized = normalizeText(locationName);
    
    // Recherche exacte d'abord
    let place = mockPlaces.find(p => 
      normalizeText(p.name) === normalized
    );

    // Si pas trouvé, recherche partielle
    if (!place) {
      place = mockPlaces.find(p => 
        normalizeText(p.name).includes(normalized) || 
        normalized.includes(normalizeText(p.name))
      );
    }

    return place;
  };

  const handleTranscription = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      toast({
        title: "Analyse en cours...",
        description: "Je traite votre commande vocale",
      });

      // Convertir en base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      await new Promise((resolve) => {
        reader.onloadend = resolve;
      });

      const base64Audio = (reader.result as string).split(',')[1];

      // Appeler l'edge function
      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: { audio: base64Audio }
      });

      if (error) throw error;

      const transcription = data.text.toLowerCase();
      console.log('Transcription:', transcription);

      // Parser la commande "amène-moi" ou "emmène-moi"
      const commandRegex = /(?:am[èe]ne[- ]moi|emm[èe]ne[- ]moi)\s+(?:à|a|au|aux)?\s*(.+)/i;
      const match = transcription.match(commandRegex);

      if (match && match[1]) {
        const locationName = match[1].trim();
        console.log('Lieu recherché:', locationName);
        
        const place = findPlace(locationName);

        if (place) {
          toast({
            title: "Destination trouvée !",
            description: `Navigation vers ${place.name}`,
          });
          navigate(`/place/${place.id}`);
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
      console.error('Erreur transcription:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter la commande vocale",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        handleTranscription(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);

      toast({
        title: "🎤 Enregistrement",
        description: "Dites 'amène-moi' suivi du lieu",
      });

      // Auto-stop après 5 secondes
      setTimeout(() => {
        if (mediaRecorder.current?.state === 'recording') {
          stopRecording();
        }
      }, 5000);

    } catch (error) {
      console.error('Erreur microphone:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      setIsRecording(false);
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
