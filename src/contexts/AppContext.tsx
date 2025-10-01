import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

export interface UserProgress {
  selectedReligion: Religion | null;
  language: string;
  totalPoints: number;
  visitedPlaces: string[];
  badges: string[];
  tripPlaces: string[];
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'sacredworld_progress';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      selectedReligion: null,
      language: 'fr',
      totalPoints: 0,
      visitedPlaces: [],
      badges: [],
      tripPlaces: []
    };
  });

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
      
      return {
        ...prev,
        visitedPlaces: [...prev.visitedPlaces, placeId],
        totalPoints: newTotalPoints,
        badges: newBadges
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
      clearTrip
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
