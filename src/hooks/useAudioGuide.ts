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

export const useAudioGuide = (): UseAudioGuideReturn => {
  const { toast } = useToast();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const textLengthRef = useRef<number>(0);

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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const play = useCallback(async (text: string, placeId: string) => {
    // Stop any current playback
    window.speechSynthesis.cancel();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
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
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      // Try to find a French voice
      const voices = window.speechSynthesis.getVoices();
      const frenchVoice = voices.find(v => v.lang.startsWith('fr')) || voices[0];
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }

      utteranceRef.current = utterance;
      textLengthRef.current = text.length;
      
      // Estimate duration (approx 150 words per minute, 5 chars per word)
      const estimatedDuration = (text.length / 5) / 150 * 60;
      setState(prev => ({ ...prev, duration: estimatedDuration }));

      utterance.onstart = () => {
        startTimeRef.current = Date.now();
        setState(prev => ({
          ...prev,
          isLoading: false,
          isPlaying: true,
        }));
        
        // Progress tracking
        intervalRef.current = window.setInterval(() => {
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          const progress = Math.min((elapsed / estimatedDuration) * 100, 100);
          setState(prev => ({
            ...prev,
            currentTime: elapsed,
            progress,
          }));
        }, 100);
      };

      utterance.onend = () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setState(prev => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
          progress: 100,
        }));
      };

      utterance.onerror = (event) => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
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

      window.speechSynthesis.speak(utterance);

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
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
    }
  }, []);

  const resume = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    }
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      progress: 0,
      currentTime: 0,
    }));
  }, []);

  const seek = useCallback((time: number) => {
    // Web Speech API doesn't support seeking - inform user
    toast({
      title: 'Navigation non disponible',
      description: 'La navigation dans l\'audio sera disponible avec ElevenLabs',
    });
  }, [toast]);

  const download = useCallback((placeName: string) => {
    toast({
      title: 'Téléchargement non disponible',
      description: 'Le téléchargement sera disponible avec ElevenLabs',
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
