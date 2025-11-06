// Audio effects utilities using Web Audio API

let audioContext: AudioContext | null = null;

// Initialize audio context (lazy initialization to avoid autoplay issues)
const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

/**
 * Play a subtle whoosh sound effect
 * Perfect for zoom/transition animations
 */
export const playWhooshSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Create oscillator for the whoosh effect
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Whoosh effect: frequency sweep from high to low
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.3);
    
    // Volume envelope: fade in quickly, fade out smoothly
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05); // Subtle volume
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    // Play the sound
    oscillator.start(now);
    oscillator.stop(now + 0.4);
    
    // Clean up
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  } catch (error) {
    // Silently fail if audio context is not available
    console.debug('Audio playback not available:', error);
  }
};

/**
 * Play a subtle click sound
 * Perfect for button clicks and interactions
 */
export const playClickSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Short, high-pitched click
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1200, now);
    
    // Very short envelope
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    oscillator.start(now);
    oscillator.stop(now + 0.05);
    
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  } catch (error) {
    console.debug('Audio playback not available:', error);
  }
};

/**
 * Resume audio context after user interaction (required by some browsers)
 */
export const resumeAudioContext = () => {
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
};
