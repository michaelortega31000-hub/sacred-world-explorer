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
  const progressIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const estimatedDurationRef = useRef<number>(0);

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
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  // Load voices when available
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const startProgressTracking = useCallback((estimatedDuration: number) => {
    startTimeRef.current = Date.now();
    estimatedDurationRef.current = estimatedDuration;

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const progress = Math.min((elapsed / estimatedDuration) * 100, 99);
      
      setState(prev => ({
        ...prev,
        currentTime: elapsed,
        progress,
      }));
    }, 100);
  }, []);

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const play = useCallback(async (text: string, placeId: string) => {
    // Check browser support
    if (!('speechSynthesis' in window)) {
      toast({
        title: 'Non supporté',
        description: 'Votre navigateur ne supporte pas la synthèse vocale',
        variant: 'destructive',
      });
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    stopProgressTracking();

    setState(prev => ({
      ...prev,
      isLoading: true,
      isPlaying: false,
      isPaused: false,
      error: null,
      progress: 0,
      currentTime: 0,
    }));

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to find a French voice
    const voices = window.speechSynthesis.getVoices();
    const frenchVoice = voices.find(v => 
      v.lang === 'fr-FR' || v.lang.startsWith('fr')
    );
    if (frenchVoice) {
      utterance.voice = frenchVoice;
    }

    // Estimate duration (roughly 150 words per minute for French)
    const wordCount = text.split(/\s+/).length;
    const estimatedDuration = (wordCount / 150) * 60; // in seconds

    utterance.onstart = () => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isPlaying: true,
        duration: estimatedDuration,
      }));
      startProgressTracking(estimatedDuration);
    };

    utterance.onend = () => {
      stopProgressTracking();
      setState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        progress: 100,
        currentTime: estimatedDuration,
      }));
    };

    utterance.onerror = (event) => {
      stopProgressTracking();
      console.error('Speech synthesis error:', event);
      setState(prev => ({
        ...prev,
        isLoading: false,
        isPlaying: false,
        error: 'Erreur de lecture',
      }));
      
      if (event.error !== 'canceled') {
        toast({
          title: 'Erreur audio',
          description: 'Impossible de lire le texte',
          variant: 'destructive',
        });
      }
    };

    utterance.onpause = () => {
      stopProgressTracking();
      setState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
    };

    utterance.onresume = () => {
      startProgressTracking(estimatedDurationRef.current - state.currentTime);
      setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [toast, stopProgressTracking, startProgressTracking, state.currentTime]);

  const pause = useCallback(() => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      stopProgressTracking();
      setState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
    }
  }, [stopProgressTracking]);

  const resume = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    }
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    stopProgressTracking();
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      progress: 0,
      currentTime: 0,
    }));
  }, [stopProgressTracking]);

  // Seek is not supported with Web Speech API
  const seek = useCallback((time: number) => {
    toast({
      title: 'Non disponible',
      description: 'La navigation dans l\'audio n\'est pas supportée avec la voix navigateur',
    });
  }, [toast]);

  // Download is not supported with Web Speech API
  const download = useCallback((placeName: string) => {
    toast({
      title: 'Non disponible',
      description: 'Le téléchargement n\'est pas supporté avec la voix navigateur',
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
