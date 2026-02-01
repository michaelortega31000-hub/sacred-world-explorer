import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Religion } from '@/contexts/AppContext';

interface AudioGuideState {
  isLoading: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  error: string | null;
  ambientPlaying: boolean;
  narrationPlaying: boolean;
}

interface AmbientSound {
  id: string;
  name: string;
  category: 'sacred' | 'nature' | 'urban' | 'meditation';
  religion?: Religion;
}

// Ambient soundscapes mapped by place type/religion
const AMBIENT_PRESETS: Record<string, { sounds: string[]; volume: number }> = {
  // Religious ambiences
  'christianity': { sounds: ['church-bells', 'choir-soft', 'organ-ambient'], volume: 0.15 },
  'islam': { sounds: ['adhan-distant', 'fountain', 'wind-desert'], volume: 0.12 },
  'buddhism': { sounds: ['temple-bells', 'singing-bowls', 'birds-forest'], volume: 0.15 },
  'hinduism': { sounds: ['temple-bells', 'mantras-soft', 'river-flow'], volume: 0.12 },
  'judaism': { sounds: ['shofar-distant', 'prayer-murmur', 'wind-soft'], volume: 0.1 },
  // Place type ambiences
  'Cathédrale': { sounds: ['church-reverb', 'footsteps-stone', 'choir-soft'], volume: 0.12 },
  'Mosquée': { sounds: ['fountain-courtyard', 'wind-soft', 'birds-distant'], volume: 0.1 },
  'Temple': { sounds: ['incense-ambience', 'bells-gentle', 'nature-soft'], volume: 0.12 },
  'Monastère': { sounds: ['monks-chant', 'nature-mountain', 'wind-soft'], volume: 0.1 },
  'Sanctuaire': { sounds: ['sacred-ambience', 'birds-forest', 'water-stream'], volume: 0.12 },
  'Basilique': { sounds: ['organ-soft', 'reverb-hall', 'candles-flicker'], volume: 0.1 },
  // Default
  'default': { sounds: ['nature-ambient', 'wind-soft'], volume: 0.08 }
};

// Voice IDs for different narrative styles
const NARRATOR_VOICES: Record<string, { id: string; name: string; style: string }> = {
  'documentary': { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', style: 'Documentary narrator' },
  'storyteller': { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura', style: 'Warm storyteller' },
  'guide': { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', style: 'Professional guide' },
  'mystical': { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel', style: 'Mystical narrator' },
};

interface UseImmersiveAudioGuideOptions {
  narratorStyle?: 'documentary' | 'storyteller' | 'guide' | 'mystical';
  ambientVolume?: number;
  narrationVolume?: number;
}

export const useImmersiveAudioGuide = (options: UseImmersiveAudioGuideOptions = {}) => {
  const { 
    narratorStyle = 'storyteller',
    ambientVolume = 0.12,
    narrationVolume = 0.85
  } = options;

  const { toast } = useToast();
  const narrationAudioRef = useRef<HTMLAudioElement | null>(null);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const audioBlobUrlRef = useRef<string | null>(null);

  const [state, setState] = useState<AudioGuideState>({
    isLoading: false,
    isPlaying: false,
    isPaused: false,
    progress: 0,
    currentTime: 0,
    duration: 0,
    error: null,
    ambientPlaying: false,
    narrationPlaying: false,
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (narrationAudioRef.current) {
      narrationAudioRef.current.pause();
      narrationAudioRef.current = null;
    }
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
      ambientAudioRef.current = null;
    }
    if (audioBlobUrlRef.current) {
      URL.revokeObjectURL(audioBlobUrlRef.current);
      audioBlobUrlRef.current = null;
    }
    window.speechSynthesis.cancel();
  }, []);

  // Get ambient preset based on place type or religion
  const getAmbientPreset = useCallback((placeType?: string, religion?: Religion) => {
    if (religion && AMBIENT_PRESETS[religion]) {
      return AMBIENT_PRESETS[religion];
    }
    if (placeType && AMBIENT_PRESETS[placeType]) {
      return AMBIENT_PRESETS[placeType];
    }
    return AMBIENT_PRESETS['default'];
  }, []);

  // Start ambient soundscape (simulated with Web Audio API oscillators for now)
  const startAmbientSound = useCallback((placeType?: string, religion?: Religion) => {
    const preset = getAmbientPreset(placeType, religion);
    
    // Create ambient audio context for subtle background
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a subtle ambient drone
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 110; // Low A note
      
      filter.type = 'lowpass';
      filter.frequency.value = 200;
      
      gainNode.gain.value = 0;
      gainNode.gain.linearRampToValueAtTime(preset.volume * ambientVolume, audioContext.currentTime + 3);
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      
      // Store for cleanup
      (ambientAudioRef.current as any) = {
        context: audioContext,
        oscillator,
        gainNode,
        stop: () => {
          gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2);
          setTimeout(() => {
            oscillator.stop();
            audioContext.close();
          }, 2500);
        }
      };
      
      setState(prev => ({ ...prev, ambientPlaying: true }));
    } catch (error) {
      console.warn('Ambient audio not supported:', error);
    }
  }, [getAmbientPreset, ambientVolume]);

  // Stop ambient sound
  const stopAmbientSound = useCallback(() => {
    if (ambientAudioRef.current && (ambientAudioRef.current as any).stop) {
      (ambientAudioRef.current as any).stop();
      ambientAudioRef.current = null;
    }
    setState(prev => ({ ...prev, ambientPlaying: false }));
  }, []);

  // Main play function with ElevenLabs + fallback
  const play = useCallback(async (
    text: string, 
    placeId: string,
    placeType?: string,
    religion?: Religion
  ) => {
    cleanup();

    setState(prev => ({
      ...prev,
      isLoading: true,
      isPlaying: false,
      isPaused: false,
      error: null,
      progress: 0,
      currentTime: 0,
    }));

    // Start ambient sound
    startAmbientSound(placeType, religion);

    const voiceConfig = NARRATOR_VOICES[narratorStyle];

    try {
      // Try ElevenLabs first
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
            voiceId: voiceConfig.id,
            placeId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`ElevenLabs error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      audioBlobUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audio.volume = narrationVolume;
      narrationAudioRef.current = audio;

      audio.onloadedmetadata = () => {
        setState(prev => ({ ...prev, duration: audio.duration }));
      };

      audio.onplay = () => {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isPlaying: true,
          narrationPlaying: true,
        }));

        // Progress tracking
        progressIntervalRef.current = window.setInterval(() => {
          if (audio) {
            const progress = (audio.currentTime / audio.duration) * 100;
            setState(prev => ({
              ...prev,
              currentTime: audio.currentTime,
              progress: isNaN(progress) ? 0 : progress,
            }));
          }
        }, 100);
      };

      audio.onended = () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        stopAmbientSound();
        setState(prev => ({
          ...prev,
          isPlaying: false,
          narrationPlaying: false,
          progress: 100,
        }));
      };

      audio.onerror = () => {
        throw new Error('Audio playback failed');
      };

      await audio.play();

    } catch (error) {
      console.warn('ElevenLabs failed, using Web Speech API fallback:', error);
      
      // Fallback to Web Speech API
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = narrationVolume;

        const voices = window.speechSynthesis.getVoices();
        const frenchVoice = voices.find(v => v.lang.startsWith('fr')) || voices[0];
        if (frenchVoice) {
          utterance.voice = frenchVoice;
        }

        fallbackUtteranceRef.current = utterance;

        const estimatedDuration = (text.length / 5) / 150 * 60;
        const startTime = Date.now();

        setState(prev => ({ ...prev, duration: estimatedDuration }));

        utterance.onstart = () => {
          setState(prev => ({
            ...prev,
            isLoading: false,
            isPlaying: true,
            narrationPlaying: true,
          }));

          progressIntervalRef.current = window.setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = Math.min((elapsed / estimatedDuration) * 100, 100);
            setState(prev => ({
              ...prev,
              currentTime: elapsed,
              progress,
            }));
          }, 100);
        };

        utterance.onend = () => {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
          stopAmbientSound();
          setState(prev => ({
            ...prev,
            isPlaying: false,
            narrationPlaying: false,
            progress: 100,
          }));
        };

        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          stopAmbientSound();
          setState(prev => ({
            ...prev,
            isLoading: false,
            isPlaying: false,
            error: 'Erreur de lecture audio',
          }));
        };

        window.speechSynthesis.speak(utterance);

      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        stopAmbientSound();
        setState(prev => ({
          ...prev,
          isLoading: false,
          isPlaying: false,
          error: 'Audio non disponible',
        }));
        toast({
          title: 'Audio indisponible',
          description: 'Impossible de lancer l\'audioguide',
          variant: 'destructive',
        });
      }
    }
  }, [narratorStyle, narrationVolume, cleanup, startAmbientSound, stopAmbientSound, toast]);

  const pause = useCallback(() => {
    if (narrationAudioRef.current) {
      narrationAudioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
    } else if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
    }
  }, []);

  const resume = useCallback(() => {
    if (narrationAudioRef.current && state.isPaused) {
      narrationAudioRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    } else if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    }
  }, [state.isPaused]);

  const stop = useCallback(() => {
    cleanup();
    stopAmbientSound();
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      narrationPlaying: false,
      progress: 0,
      currentTime: 0,
    }));
  }, [cleanup, stopAmbientSound]);

  const seek = useCallback((time: number) => {
    if (narrationAudioRef.current) {
      narrationAudioRef.current.currentTime = time;
      setState(prev => ({ ...prev, currentTime: time }));
    }
  }, []);

  const setNarrationVolume = useCallback((volume: number) => {
    if (narrationAudioRef.current) {
      narrationAudioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  const setAmbientVolume = useCallback((volume: number) => {
    if (ambientAudioRef.current && (ambientAudioRef.current as any).gainNode) {
      (ambientAudioRef.current as any).gainNode.gain.value = Math.max(0, Math.min(0.3, volume));
    }
  }, []);

  const download = useCallback(async (placeName: string) => {
    if (audioBlobUrlRef.current) {
      const a = document.createElement('a');
      a.href = audioBlobUrlRef.current;
      a.download = `audioguide-${placeName.replace(/\s+/g, '-').toLowerCase()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: 'Téléchargement démarré',
        description: `Audioguide de ${placeName}`,
      });
    } else {
      toast({
        title: 'Téléchargement indisponible',
        description: 'Lancez d\'abord l\'audioguide ElevenLabs',
      });
    }
  }, [toast]);

  return {
    state,
    play,
    pause,
    resume,
    stop,
    seek,
    download,
    setNarrationVolume,
    setAmbientVolume,
    narratorVoices: NARRATOR_VOICES,
  };
};
