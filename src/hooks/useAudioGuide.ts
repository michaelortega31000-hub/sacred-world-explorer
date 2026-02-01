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

// In-memory cache for generated audio
const audioCache = new Map<string, Blob>();

export const useAudioGuide = (): UseAudioGuideReturn => {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const currentPlaceIdRef = useRef<string | null>(null);

  const [state, setState] = useState<AudioGuideState>({
    isLoading: false,
    isPlaying: false,
    isPaused: false,
    progress: 0,
    currentTime: 0,
    duration: 0,
    error: null,
  });

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      setState(prev => ({
        ...prev,
        currentTime,
        duration: duration || 0,
        progress: duration ? (currentTime / duration) * 100 : 0,
      }));
    }
  }, []);

  const setupAudioEvents = useCallback((audio: HTMLAudioElement) => {
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', () => {
      setState(prev => ({ ...prev, duration: audio.duration }));
    });
    audio.addEventListener('ended', () => {
      setState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        progress: 100,
      }));
    });
    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      setState(prev => ({
        ...prev,
        isLoading: false,
        isPlaying: false,
        error: 'Erreur de lecture audio',
      }));
    });
  }, [updateProgress]);

  const play = useCallback(async (text: string, placeId: string) => {
    // If same place is paused, just resume
    if (currentPlaceIdRef.current === placeId && state.isPaused && audioRef.current) {
      audioRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
      return;
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
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
        // Fetch from edge function
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ text, placeId }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Erreur génération audio');
        }

        audioBlob = await response.blob();
        
        // Cache the audio
        audioCache.set(placeId, audioBlob);
      }

      // Create audio URL and play
      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrlRef.current = audioUrl;
      currentPlaceIdRef.current = placeId;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      setupAudioEvents(audio);

      await audio.play();

      setState(prev => ({
        ...prev,
        isLoading: false,
        isPlaying: true,
        isPaused: false,
      }));
    } catch (error: any) {
      console.error('Audio guide error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        isPlaying: false,
        error: error.message || 'Erreur de lecture',
      }));
      toast({
        title: 'Erreur audio',
        description: error.message || 'Impossible de générer l\'audio',
        variant: 'destructive',
      });
    }
  }, [state.isPaused, setupAudioEvents, toast]);

  const pause = useCallback(() => {
    if (audioRef.current && state.isPlaying) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
    }
  }, [state.isPlaying]);

  const resume = useCallback(() => {
    if (audioRef.current && state.isPaused) {
      audioRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    }
  }, [state.isPaused]);

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
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      updateProgress();
    }
  }, [updateProgress]);

  const download = useCallback((placeName: string) => {
    if (!currentPlaceIdRef.current) {
      toast({
        title: 'Aucun audio',
        description: 'Lancez d\'abord la lecture pour télécharger',
        variant: 'destructive',
      });
      return;
    }

    const blob = audioCache.get(currentPlaceIdRef.current);
    if (!blob) {
      toast({
        title: 'Audio non disponible',
        description: 'L\'audio n\'est pas encore généré',
        variant: 'destructive',
      });
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audioguide-${placeName.replace(/\s+/g, '-').toLowerCase()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Téléchargement',
      description: 'Audio téléchargé avec succès',
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
