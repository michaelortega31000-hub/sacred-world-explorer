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
 * Play a success sound for visit validation
 * Celebratory ascending chime
 */
export const playSuccessSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Create two oscillators for a richer sound
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Ascending notes: C5 -> E5 -> G5
    osc1.type = 'sine';
    osc2.type = 'sine';
    
    // First note (C5 - 523Hz)
    osc1.frequency.setValueAtTime(523, now);
    osc2.frequency.setValueAtTime(523 * 2, now); // Octave higher
    
    // Second note (E5 - 659Hz)
    osc1.frequency.setValueAtTime(659, now + 0.12);
    osc2.frequency.setValueAtTime(659 * 2, now + 0.12);
    
    // Third note (G5 - 784Hz)
    osc1.frequency.setValueAtTime(784, now + 0.24);
    osc2.frequency.setValueAtTime(784 * 2, now + 0.24);
    
    // Volume envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.02);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.24);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
    
    osc1.onended = () => {
      osc1.disconnect();
      osc2.disconnect();
      gainNode.disconnect();
    };
  } catch (error) {
    console.debug('Audio playback not available:', error);
  }
};

/**
 * Play a badge unlock sound
 * Magical sparkle effect
 */
export const playBadgeUnlockSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Multiple oscillators for a magical sparkle effect
    const oscillators: OscillatorNode[] = [];
    const gainNode = ctx.createGain();
    
    gainNode.connect(ctx.destination);
    
    // Create ascending sparkle notes
    const frequencies = [880, 1109, 1319, 1568, 1760]; // A5, C#6, E6, G6, A6
    
    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      osc.connect(gainNode);
      oscillators.push(osc);
      
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.3);
    });
    
    // Magical envelope: quick attack, sustained decay
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.25, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
    
    oscillators[oscillators.length - 1].onended = () => {
      oscillators.forEach(osc => osc.disconnect());
      gainNode.disconnect();
    };
  } catch (error) {
    console.debug('Audio playback not available:', error);
  }
};

/**
 * Play an add-to-trip sound
 * Satisfying confirmation tone
 */
export const playAddToTripSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Two-note confirmation: E5 -> A5
    osc1.type = 'sine';
    osc2.type = 'triangle'; // Warmer sound
    
    osc1.frequency.setValueAtTime(659, now); // E5
    osc2.frequency.setValueAtTime(659, now);
    
    osc1.frequency.setValueAtTime(880, now + 0.1); // A5
    osc2.frequency.setValueAtTime(880, now + 0.1);
    
    // Pleasant envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.03);
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
    
    osc1.onended = () => {
      osc1.disconnect();
      osc2.disconnect();
      gainNode.disconnect();
    };
  } catch (error) {
    console.debug('Audio playback not available:', error);
  }
};

/**
 * Play a remove-from-trip sound
 * Soft descending tone
 */
export const playRemoveFromTripSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Descending tone: A4 -> E4
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, now); // A4
    oscillator.frequency.exponentialRampToValueAtTime(330, now + 0.15); // E4
    
    // Soft envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    
    oscillator.start(now);
    oscillator.stop(now + 0.25);
    
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  } catch (error) {
    console.debug('Audio playback not available:', error);
  }
};

/**
 * Play a gentle notification sound
 * Soft bell tone for reminders and notifications
 */
export const playNotificationSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Gentle two-tone bell: G5 -> C6
    osc1.type = 'sine';
    osc2.type = 'sine';
    
    // First bell (G5 - 784Hz)
    osc1.frequency.setValueAtTime(784, now);
    osc2.frequency.setValueAtTime(784 * 2, now); // Octave
    
    // Second bell (C6 - 1047Hz)
    osc1.frequency.setValueAtTime(1047, now + 0.15);
    osc2.frequency.setValueAtTime(1047 * 2, now + 0.15);
    
    // Soft, gentle envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.08, now + 0.02); // Very subtle
    gainNode.gain.linearRampToValueAtTime(0.06, now + 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.6);
    osc2.stop(now + 0.6);
    
    osc1.onended = () => {
      osc1.disconnect();
      osc2.disconnect();
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
