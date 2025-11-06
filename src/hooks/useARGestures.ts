import { useState, useEffect, useRef, RefObject } from 'react';

interface GestureState {
  isPinching: boolean;
  isRotating: boolean;
  isTapping: boolean;
  isLongPress: boolean;
  pinchScale: number;
  rotationAngle: number;
  tapPosition: { x: number; y: number } | null;
}

interface UseARGesturesOptions {
  enabled?: boolean;
  onPinch?: (scale: number) => void;
  onRotate?: (angle: number) => void;
  onTap?: (position: { x: number; y: number }) => void;
  onLongPress?: () => void;
}

export const useARGestures = (
  elementRef: RefObject<HTMLElement>,
  options: UseARGesturesOptions = {}
) => {
  const { enabled = true, onPinch, onRotate, onTap, onLongPress } = options;

  const [gestureState, setGestureState] = useState<GestureState>({
    isPinching: false,
    isRotating: false,
    isTapping: false,
    isLongPress: false,
    pinchScale: 1,
    rotationAngle: 0,
    tapPosition: null,
  });

  const touchStartRef = useRef<{ touches: Touch[]; time: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialDistanceRef = useRef<number>(0);
  const initialAngleRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const element = elementRef.current;

    const getDistance = (touch1: Touch, touch2: Touch) => {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const getAngle = (touch1: Touch, touch2: Touch) => {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.atan2(dy, dx);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touches = Array.from(e.touches);
      touchStartRef.current = { touches, time: Date.now() };

      if (touches.length === 1) {
        // Single touch - potential tap or long press
        longPressTimerRef.current = setTimeout(() => {
          setGestureState((prev) => ({ ...prev, isLongPress: true }));
          onLongPress?.();
          // Haptic feedback for long press
          if ('vibrate' in navigator) {
            navigator.vibrate(200);
          }
        }, 500);
      } else if (touches.length === 2) {
        // Two touches - pinch or rotate
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
        }
        initialDistanceRef.current = getDistance(touches[0], touches[1]);
        initialAngleRef.current = getAngle(touches[0], touches[1]);
        setGestureState((prev) => ({
          ...prev,
          isPinching: true,
          isRotating: true,
        }));
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touches = Array.from(e.touches);

      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }

      if (touches.length === 2) {
        const currentDistance = getDistance(touches[0], touches[1]);
        const currentAngle = getAngle(touches[0], touches[1]);

        const scale = currentDistance / initialDistanceRef.current;
        const angleDelta = currentAngle - initialAngleRef.current;

        setGestureState((prev) => ({
          ...prev,
          pinchScale: scale,
          rotationAngle: angleDelta,
        }));

        onPinch?.(scale);
        onRotate?.(angleDelta);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }

      const touchDuration = Date.now() - (touchStartRef.current?.time || 0);
      const touches = touchStartRef.current?.touches || [];

      // Detect tap (short touch, single finger)
      if (touches.length === 1 && touchDuration < 300 && !gestureState.isLongPress) {
        const touch = touches[0];
        const position = {
          x: touch.clientX,
          y: touch.clientY,
        };
        
        setGestureState((prev) => ({
          ...prev,
          isTapping: true,
          tapPosition: position,
        }));

        onTap?.(position);

        // Haptic feedback for tap
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }

        // Reset tap state
        setTimeout(() => {
          setGestureState((prev) => ({
            ...prev,
            isTapping: false,
            tapPosition: null,
          }));
        }, 100);
      }

      // Reset gesture state
      setGestureState((prev) => ({
        ...prev,
        isPinching: false,
        isRotating: false,
        isLongPress: false,
        pinchScale: 1,
        rotationAngle: 0,
      }));

      initialDistanceRef.current = 0;
      initialAngleRef.current = 0;
      touchStartRef.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, [enabled, elementRef, onPinch, onRotate, onTap, onLongPress, gestureState.isLongPress]);

  return gestureState;
};

// Haptic feedback utility
export const hapticFeedback = (pattern: 'tap' | 'success' | 'error' | 'warning') => {
  if (!('vibrate' in navigator)) return;

  const patterns = {
    tap: 50,
    success: [100, 50, 100],
    error: 200,
    warning: [100, 100, 100],
  };

  navigator.vibrate(patterns[pattern]);
};
