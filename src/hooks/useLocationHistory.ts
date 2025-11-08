import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { throttle } from '@/lib/throttle';
import type { UserGeolocation } from './useGeolocation';

interface LocationPoint {
  id: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  recorded_at: string;
}

interface UseLocationHistoryProps {
  enabled: boolean;
  userPosition: UserGeolocation | null;
}

// Calculate distance between two points in meters (Haversine)
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const useLocationHistory = ({ enabled, userPosition }: UseLocationHistoryProps) => {
  const [history, setHistory] = useState<LocationPoint[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const lastRecordedPosition = useRef<{ lat: number; lng: number } | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);

  // Load history from database
  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('location_history')
        .select('*')
        .order('recorded_at', { ascending: true })
        .limit(1000);

      if (error) throw error;

      setHistory(data || []);
    } catch (error) {
      console.error('Error loading location history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Record position to database (throttled)
  const recordPosition = useCallback(
    throttle(async (position: UserGeolocation) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check if user has moved at least 10 meters
        if (lastRecordedPosition.current) {
          const distance = calculateDistance(
            lastRecordedPosition.current.lat,
            lastRecordedPosition.current.lng,
            position.latitude,
            position.longitude
          );

          if (distance < 10) {
            return; // Don't record if moved less than 10m
          }
        }

        const { error } = await supabase.from('location_history').insert({
          user_id: user.id,
          latitude: position.latitude,
          longitude: position.longitude,
          accuracy: position.accuracy,
          recorded_at: new Date(position.timestamp).toISOString(),
        });

        if (error) throw error;

        // Update last recorded position
        lastRecordedPosition.current = {
          lat: position.latitude,
          lng: position.longitude,
        };

        // Reload history
        await loadHistory();
      } catch (error) {
        console.error('Error recording position:', error);
      }
    }, 30000), // Throttle to once every 30 seconds
    [loadHistory]
  );

  // Start recording
  const startRecording = useCallback(() => {
    setIsRecording(true);
    localStorage.setItem('location_tracking_enabled', 'true');
    toast.success('Enregistrement du parcours activé');

    // Start interval for recording
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }

    recordingIntervalRef.current = window.setInterval(() => {
      if (userPosition) {
        recordPosition(userPosition);
      }
    }, 30000); // Record every 30 seconds
  }, [userPosition, recordPosition]);

  // Stop recording
  const stopRecording = useCallback(() => {
    setIsRecording(false);
    localStorage.setItem('location_tracking_enabled', 'false');
    toast.success('Enregistrement du parcours arrêté');

    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
  }, []);

  // Clear history
  const clearHistory = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const pointsCount = history.length;

      const { error } = await supabase
        .from('location_history')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setHistory([]);
      lastRecordedPosition.current = null;
      toast.success(`${pointsCount} points supprimés`);
    } catch (error) {
      console.error('Error clearing history:', error);
      toast.error('Erreur lors de la suppression');
    }
  }, [history.length]);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Restore recording state from localStorage
  useEffect(() => {
    const trackingEnabled = localStorage.getItem('location_tracking_enabled') === 'true';
    if (trackingEnabled && enabled && userPosition) {
      startRecording();
    }
  }, []);

  // Record position when enabled and recording
  useEffect(() => {
    if (isRecording && enabled && userPosition) {
      recordPosition(userPosition);
    }
  }, [isRecording, enabled, userPosition, recordPosition]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  return {
    history,
    isRecording,
    loading,
    startRecording,
    stopRecording,
    clearHistory,
  };
};
