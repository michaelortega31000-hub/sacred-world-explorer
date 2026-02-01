import { useState, useEffect, useMemo } from 'react';
import { useApp, Place } from '@/contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { mockPlaces } from '@/data/placesData';
import { logger } from '@/lib/logger';

export interface JournalEntry {
  id: string;
  placeId: string;
  place: Place;
  visitedAt: Date;
  memories: JournalMemory[];
  photos: string[];
}

export interface JournalMemory {
  id: string;
  title: string | null;
  content: string | null;
  mediaUrls: string[];
  createdAt: Date;
  memoryType: string;
}

export interface JournalStats {
  totalPlaces: number;
  totalCountries: number;
  totalPoints: number;
  totalPhotos: number;
  longestStreak: number;
  countriesVisited: string[];
}

export const useTravelJournal = () => {
  const { userProgress, session } = useApp();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJournalData = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Get visited places from user progress
        const visitedPlaceIds = userProgress.visitedPlaces || [];
        
        // Get memories from database
        const { data: memoriesData, error } = await supabase
          .from('memories')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) {
          logger.error('Error fetching memories:', error);
        }

        // Build journal entries from visited places
        const journalEntries: JournalEntry[] = visitedPlaceIds.map((placeId, index) => {
          const place = mockPlaces.find(p => p.id === placeId);
          if (!place) return null;

          // Get memories for this place
          const placeMemories = (memoriesData || [])
            .filter(m => m.place_id === placeId)
            .map(m => ({
              id: m.id,
              title: m.title,
              content: m.content,
              mediaUrls: m.media_urls || [],
              createdAt: new Date(m.created_at),
              memoryType: m.memory_type
            }));

          // Extract photos from memories
          const photos = placeMemories.flatMap(m => m.mediaUrls);

          // Simulate visit date based on order (in real app, would track actual visit dates)
          const baseDate = new Date();
          baseDate.setDate(baseDate.getDate() - (visitedPlaceIds.length - index) * 3);

          return {
            id: `entry-${placeId}`,
            placeId,
            place,
            visitedAt: baseDate,
            memories: placeMemories,
            photos
          };
        }).filter(Boolean) as JournalEntry[];

        // Sort by visit date
        journalEntries.sort((a, b) => a.visitedAt.getTime() - b.visitedAt.getTime());

        setEntries(journalEntries);
      } catch (err) {
        logger.error('Error loading journal:', err);
      } finally {
        setLoading(false);
      }
    };

    loadJournalData();
  }, [session?.user?.id, userProgress.visitedPlaces]);

  const stats: JournalStats = useMemo(() => {
    const countries = [...new Set(entries.map(e => e.place.country))];
    const totalPhotos = entries.reduce((sum, e) => sum + e.photos.length, 0);

    return {
      totalPlaces: entries.length,
      totalCountries: countries.length,
      totalPoints: userProgress.totalPoints,
      totalPhotos,
      longestStreak: userProgress.longestStreak,
      countriesVisited: countries
    };
  }, [entries, userProgress]);

  const entriesByCountry = useMemo(() => {
    const grouped: Record<string, JournalEntry[]> = {};
    entries.forEach(entry => {
      const country = entry.place.country;
      if (!grouped[country]) {
        grouped[country] = [];
      }
      grouped[country].push(entry);
    });
    return grouped;
  }, [entries]);

  const journeyPath = useMemo(() => {
    return entries.map(e => ({
      coordinates: e.place.coordinates,
      name: e.place.name,
      country: e.place.country,
      date: e.visitedAt
    }));
  }, [entries]);

  return {
    entries,
    loading,
    stats,
    entriesByCountry,
    journeyPath
  };
};
