import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGeolocation, UserGeolocation } from '@/hooks/useGeolocation';

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
}

interface AppContextType {
  userProgress: UserProgress;
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
  userLocation: UserGeolocation | null;
  geolocationError: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'sacredworld_progress';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      geolocationEnabled: false
    };
  });

  const { position, error } = useGeolocation(userProgress.geolocationEnabled);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
  }, [userProgress]);

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
      
      return {
        ...prev,
        visitedPlaces: [...prev.visitedPlaces, placeId],
        totalPoints: newTotalPoints,
        badges: newBadges,
        tripPlaces: newTripPlaces
      };
    });
  };

  const isPlaceVisited = (placeId: string) => {
    return userProgress.visitedPlaces.includes(placeId);
  };

  const addToTrip = (placeId: string) => {
    const currentTrip = userProgress.tripPlaces || [];
    if (!currentTrip.includes(placeId)) {
      const newProgress = {
        ...userProgress,
        tripPlaces: [...currentTrip, placeId]
      };
      setUserProgress(newProgress);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    }
  };

  const removeFromTrip = (placeId: string) => {
    const currentTrip = userProgress.tripPlaces || [];
    const newProgress = {
      ...userProgress,
      tripPlaces: currentTrip.filter(id => id !== placeId)
    };
    setUserProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  };

  const isInTrip = (placeId: string) => {
    return userProgress.tripPlaces?.includes(placeId) ?? false;
  };

  const clearTrip = () => {
    const newProgress = {
      ...userProgress,
      tripPlaces: []
    };
    setUserProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
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

  return (
    <AppContext.Provider value={{ 
      userProgress, 
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
