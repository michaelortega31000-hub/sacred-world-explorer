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
  activity_type: 'walking' | 'cycling' | 'transport' | 'unknown';
  speed: number | null;
}

type ActivityType = 'walking' | 'cycling' | 'transport' | 'unknown';

// Determine activity type based on speed (km/h)
const getActivityType = (speedKmh: number): ActivityType => {
  if (speedKmh < 0) return 'unknown';
  if (speedKmh <= 8) return 'walking';
  if (speedKmh <= 30) return 'cycling';
  return 'transport';
};

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

      // Cast activity_type to proper type
      const typedData = (data || []).map(point => ({
        ...point,
        activity_type: (point.activity_type || 'unknown') as ActivityType,
      }));

      setHistory(typedData);
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

        let distance = 0;
        let speed = 0;
        let activityType: ActivityType = 'unknown';

        // Calculate distance and speed if we have a previous position
        if (lastRecordedPosition.current) {
          distance = calculateDistance(
            lastRecordedPosition.current.lat,
            lastRecordedPosition.current.lng,
            position.latitude,
            position.longitude
          );

          // Don't record if moved less than 10m
          if (distance < 10) {
            return;
          }

          // Calculate speed (30 seconds between records)
          const timeInHours = 30 / 3600; // 30 seconds in hours
          speed = distance / 1000 / timeInHours; // Convert to km/h
          activityType = getActivityType(speed);
        }

        const { error } = await supabase.from('location_history').insert({
          user_id: user.id,
          latitude: position.latitude,
          longitude: position.longitude,
          accuracy: position.accuracy,
          recorded_at: new Date(position.timestamp).toISOString(),
          speed: speed > 0 ? speed : null,
          activity_type: activityType,
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
