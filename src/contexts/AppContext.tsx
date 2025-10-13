import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGeolocation, UserGeolocation } from '@/hooks/useGeolocation';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

export type Religion = 'christianity' | 'islam' | 'judaism' | 'buddhism' | 'hinduism' | 'astronomy' | 'traditional' | 'atheism';

export interface Place {
  id: string;
  name: string;
  country: string;
  city?: string;
  type: string;
  description: string;
  points: number;
  coordinates: [number, number];
  imageUrl?: string;
  religion?: Religion;
}

export interface UserProgress {
  selectedReligion: Religion | null;
  language: string;
  totalPoints: number;
  visitedPlaces: string[];
  badges: string[];
  tripPlaces: string[];
  geolocationEnabled: boolean;
  plannedRouteStartCity: string;
  showPlannedRoute: boolean;
}

interface AppContextType {
  userProgress: UserProgress;
  session: Session | null;
  updateReligion: (religion: Religion) => void;
  updateLanguage: (language: string) => void;
  visitPlace: (placeId: string, points: number) => void;
  isPlaceVisited: (placeId: string) => boolean;
  addToTrip: (placeId: string) => void;
  removeFromTrip: (placeId: string) => void;
  isInTrip: (placeId: string) => boolean;
  clearTrip: () => void;
  addPoints: (points: number) => void;
  toggleGeolocation: () => void;
  updatePlannedRoute: (startCity: string, showRoute: boolean) => void;
  userLocation: UserGeolocation | null;
  geolocationError: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'sacredworld_progress';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        geolocationEnabled: parsed.geolocationEnabled ?? false
      };
    }
    return {
      selectedReligion: null,
      language: 'fr',
      totalPoints: 0,
      visitedPlaces: [],
      badges: [],
      tripPlaces: [],
      geolocationEnabled: false,
      plannedRouteStartCity: '',
      showPlannedRoute: false
    };
  });

  const { position, error } = useGeolocation(userProgress.geolocationEnabled);

  // Establish auth state listener and session management
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load progress from database when session is established
  useEffect(() => {
    const loadProgressFromDB = async () => {
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading progress from DB:', error);
        return;
      }

      if (data) {
        const dbProgress: UserProgress = {
          selectedReligion: data.selected_religion as Religion | null,
          language: data.language,
          totalPoints: data.total_points,
          visitedPlaces: data.visited_places,
          badges: data.badges,
          tripPlaces: data.trip_places,
          geolocationEnabled: data.geolocation_enabled,
          plannedRouteStartCity: data.planned_route_start_city || '',
          showPlannedRoute: data.show_planned_route || false
        };
        setUserProgress(dbProgress);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dbProgress));
      } else {
        // Migrate localStorage data to DB
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          await supabase.from('user_progress').insert({
            user_id: session.user.id,
            selected_religion: parsed.selectedReligion,
            language: parsed.language || 'fr',
            total_points: parsed.totalPoints || 0,
            visited_places: parsed.visitedPlaces || [],
            badges: parsed.badges || [],
            trip_places: parsed.tripPlaces || [],
            geolocation_enabled: parsed.geolocationEnabled || false,
            planned_route_start_city: parsed.plannedRouteStartCity || '',
            show_planned_route: parsed.showPlannedRoute || false
          });
        }
      }
    };

    loadProgressFromDB();
  }, [session]);

  // Sync progress to database whenever it changes
  useEffect(() => {
    const syncToDB = async () => {
      if (!session?.user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
        return;
      }

      await supabase
        .from('user_progress')
        .upsert({
          user_id: session.user.id,
          selected_religion: userProgress.selectedReligion,
          language: userProgress.language,
          total_points: userProgress.totalPoints,
          visited_places: userProgress.visitedPlaces,
          badges: userProgress.badges,
          trip_places: userProgress.tripPlaces,
          geolocation_enabled: userProgress.geolocationEnabled,
          planned_route_start_city: userProgress.plannedRouteStartCity,
          show_planned_route: userProgress.showPlannedRoute
        }, {
          onConflict: 'user_id'
        });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
    };

    syncToDB();
  }, [userProgress, session]);

  const updateReligion = (religion: Religion) => {
    setUserProgress(prev => ({ ...prev, selectedReligion: religion }));
  };

  const updateLanguage = (language: string) => {
    setUserProgress(prev => ({ ...prev, language }));
  };

  const visitPlace = (placeId: string, points: number) => {
    setUserProgress(prev => {
      if (prev.visitedPlaces.includes(placeId)) return prev;
      
      const newTotalPoints = prev.totalPoints + points;
      const newBadges = [...prev.badges];
      
      // Award badges based on milestones
      if (newTotalPoints >= 100 && !newBadges.includes('explorer')) {
        newBadges.push('explorer');
      }
      if (newTotalPoints >= 500 && !newBadges.includes('pilgrim')) {
        newBadges.push('pilgrim');
      }
      if (newTotalPoints >= 1000 && !newBadges.includes('master')) {
        newBadges.push('master');
      }
      
      // Award special badges for visiting specific places
      const specialPlaceBadges: Record<string, string> = {
        'mecca-kaaba': 'mecca_badge',
        'notre-dame': 'notre_dame_badge',
        'vatican': 'vatican_badge',
        'taj-mahal': 'taj_mahal_badge',
        'western-wall': 'western_wall_badge',
        'golden-temple': 'golden_temple_badge',
        'angkor-wat': 'angkor_wat_badge',
        'sagrada-familia': 'sagrada_familia_badge'
      };
      
      const badgeId = specialPlaceBadges[placeId];
      if (badgeId && !newBadges.includes(badgeId)) {
        newBadges.push(badgeId);
      }
      
      // Remove place from trip planner when visited
      const newTripPlaces = prev.tripPlaces.filter(id => id !== placeId);
      
      const newProgress = {
        ...prev,
        visitedPlaces: [...prev.visitedPlaces, placeId],
        totalPoints: newTotalPoints,
        badges: newBadges,
        tripPlaces: newTripPlaces
      };
      
      return newProgress;
    });
  };

  const isPlaceVisited = (placeId: string) => {
    return userProgress.visitedPlaces.includes(placeId);
  };

  const addToTrip = (placeId: string) => {
    const currentTrip = userProgress.tripPlaces || [];
    if (!currentTrip.includes(placeId)) {
      setUserProgress(prev => ({
        ...prev,
        tripPlaces: [...currentTrip, placeId]
      }));
    }
  };

  const removeFromTrip = (placeId: string) => {
    setUserProgress(prev => ({
      ...prev,
      tripPlaces: (prev.tripPlaces || []).filter(id => id !== placeId)
    }));
  };

  const isInTrip = (placeId: string) => {
    return userProgress.tripPlaces?.includes(placeId) ?? false;
  };

  const clearTrip = () => {
    setUserProgress(prev => ({
      ...prev,
      tripPlaces: []
    }));
  };

  const addPoints = (points: number) => {
    setUserProgress(prev => {
      const newTotalPoints = prev.totalPoints + points;
      const newBadges = [...prev.badges];
      
      // Award badges based on milestones
      if (newTotalPoints >= 100 && !newBadges.includes('explorer')) {
        newBadges.push('explorer');
      }
      if (newTotalPoints >= 500 && !newBadges.includes('pilgrim')) {
        newBadges.push('pilgrim');
      }
      if (newTotalPoints >= 1000 && !newBadges.includes('master')) {
        newBadges.push('master');
      }
      
      return {
        ...prev,
        totalPoints: newTotalPoints,
        badges: newBadges
      };
    });
  };

  const toggleGeolocation = () => {
    setUserProgress(prev => ({
      ...prev,
      geolocationEnabled: !prev.geolocationEnabled
    }));
  };

  const updatePlannedRoute = (startCity: string, showRoute: boolean) => {
    setUserProgress(prev => ({
      ...prev,
      plannedRouteStartCity: startCity,
      showPlannedRoute: showRoute
    }));
  };

  return (
    <AppContext.Provider value={{ 
      userProgress,
      session,
      updateReligion, 
      updateLanguage, 
      visitPlace, 
      isPlaceVisited,
      addToTrip,
      removeFromTrip,
      isInTrip,
      clearTrip,
      addPoints,
      toggleGeolocation,
      updatePlannedRoute,
      userLocation: position,
      geolocationError: error?.message || null
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
