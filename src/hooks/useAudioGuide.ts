import { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AudioGuideState {
  isLoading: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  error: string | null;
}

interface UseAudioGuideReturn {
  state: AudioGuideState;
  play: (text: string, placeId: string) => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  seek: (time: number) => void;
  download: (placeName: string) => void;
}

// Cache for audio blobs by placeId
const audioCache = new Map<string, Blob>();

export const useAudioGuide = (): UseAudioGuideReturn => {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);

  const [state, setState] = useState<AudioGuideState>({
    isLoading: false,
    isPlaying: false,
    isPaused: false,
    progress: 0,
    currentTime: 0,
    duration: 0,
    error: null,
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const play = useCallback(async (text: string, placeId: string) => {
    // Stop any current playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      isPlaying: false,
      isPaused: false,
      error: null,
      progress: 0,
      currentTime: 0,
    }));

    try {
      let audioBlob: Blob;

      // Check cache first
      if (audioCache.has(placeId)) {
        audioBlob = audioCache.get(placeId)!;
      } else {
        // Call ElevenLabs edge function with Laura's voice
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({
              text,
              voiceId: 'FGY2WhTYpPnrIDTdsKH5', // Laura - French voice
              placeId,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Erreur ${response.status}`);
        }

        audioBlob = await response.blob();
        
        // Cache the audio
        audioCache.set(placeId, audioBlob);
      }

      audioBlobRef.current = audioBlob;

      // Create audio element and play
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        setState(prev => ({
          ...prev,
          duration: audio.duration,
        }));
      };

      audio.ontimeupdate = () => {
        const progress = audio.duration > 0 
          ? (audio.currentTime / audio.duration) * 100 
          : 0;
        setState(prev => ({
          ...prev,
          currentTime: audio.currentTime,
          progress,
        }));
      };

      audio.onended = () => {
        setState(prev => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
          progress: 100,
        }));
      };

      audio.onerror = () => {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isPlaying: false,
          error: 'Erreur de lecture audio',
        }));
        toast({
          title: 'Erreur audio',
          description: 'Impossible de lire l\'audio',
          variant: 'destructive',
        });
      };

      await audio.play();
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isPlaying: true,
      }));

    } catch (error) {
      console.error('Audio guide error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isPlaying: false,
        error: errorMessage,
      }));

      toast({
        title: 'Erreur audioguide',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [toast]);

  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        progress: 0,
        currentTime: 0,
      }));
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current && isFinite(time)) {
      audioRef.current.currentTime = Math.max(0, Math.min(time, audioRef.current.duration || 0));
    }
  }, []);

  const download = useCallback((placeName: string) => {
    if (!audioBlobRef.current) {
      toast({
        title: 'Téléchargement impossible',
        description: 'Lancez d\'abord la lecture pour générer l\'audio',
      });
      return;
    }

    const url = URL.createObjectURL(audioBlobRef.current);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audioguide-${placeName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Téléchargement démarré',
      description: 'L\'audioguide est en cours de téléchargement',
    });
  }, [toast]);

  return {
    state,
    play,
    pause,
    resume,
    stop,
    seek,
    download,
  };
};
