/**
 * IndexedDB storage for offline mode
 * Stores places, audio guides, and map tiles for offline access
 */

const DB_NAME = 'sacredworld-offline';
const DB_VERSION = 1;

export interface OfflinePlaceData {
  id: string;
  name: string;
  country: string;
  city?: string;
  description: string;
  type: string;
  religion?: string;
  coordinates: [number, number];
  imageUrl?: string;
  imageBlob?: Blob;
  points: number;
  tags?: string[];
  downloadedAt: number;
}

export interface OfflineAudioData {
  placeId: string;
  audioBlob: Blob;
  language: string;
  duration?: number;
  downloadedAt: number;
}

export interface OfflineMapTile {
  key: string;
  tileBlob: Blob;
  downloadedAt: number;
}

export interface OfflineCountryData {
  country: string;
  placesCount: number;
  audioCount: number;
  mapTilesCount: number;
  totalSizeBytes: number;
  downloadedAt: number;
  lastUpdated: number;
}

let db: IDBDatabase | null = null;

export const initOfflineDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open offline database'));
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Places store
      if (!database.objectStoreNames.contains('places')) {
        const placesStore = database.createObjectStore('places', { keyPath: 'id' });
        placesStore.createIndex('country', 'country', { unique: false });
        placesStore.createIndex('downloadedAt', 'downloadedAt', { unique: false });
      }

      // Audio guides store
      if (!database.objectStoreNames.contains('audio')) {
        const audioStore = database.createObjectStore('audio', { keyPath: 'placeId' });
        audioStore.createIndex('downloadedAt', 'downloadedAt', { unique: false });
      }

      // Map tiles store
      if (!database.objectStoreNames.contains('mapTiles')) {
        const tilesStore = database.createObjectStore('mapTiles', { keyPath: 'key' });
        tilesStore.createIndex('downloadedAt', 'downloadedAt', { unique: false });
      }

      // Country metadata store
      if (!database.objectStoreNames.contains('countries')) {
        database.createObjectStore('countries', { keyPath: 'country' });
      }
    };
  });
};

// Places operations
export const savePlaceOffline = async (place: OfflinePlaceData): Promise<void> => {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['places'], 'readwrite');
    const store = transaction.objectStore('places');
    const request = store.put(place);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error('Failed to save place offline'));
  });
};

export const getOfflinePlace = async (id: string): Promise<OfflinePlaceData | undefined> => {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['places'], 'readonly');
    const store = transaction.objectStore('places');
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Failed to get offline place'));
  });
};

export const getOfflinePlacesByCountry = async (country: string): Promise<OfflinePlaceData[]> => {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['places'], 'readonly');
    const store = transaction.objectStore('places');
    const index = store.index('country');
    const request = index.getAll(country);
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(new Error('Failed to get offline places'));
  });
};

export const getAllOfflinePlaces = async (): Promise<OfflinePlaceData[]> => {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['places'], 'readonly');
    const store = transaction.objectStore('places');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(new Error('Failed to get all offline places'));
  });
};

// Audio operations
export const saveAudioOffline = async (audio: OfflineAudioData): Promise<void> => {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['audio'], 'readwrite');
    const store = transaction.objectStore('audio');
    const request = store.put(audio);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error('Failed to save audio offline'));
  });
};

export const getOfflineAudio = async (placeId: string): Promise<OfflineAudioData | undefined> => {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['audio'], 'readonly');
    const store = transaction.objectStore('audio');
    const request = store.get(placeId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Failed to get offline audio'));
  });
};

// Map tiles operations
export const saveMapTile = async (tile: OfflineMapTile): Promise<void> => {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['mapTiles'], 'readwrite');
    const store = transaction.objectStore('mapTiles');
    const request = store.put(tile);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error('Failed to save map tile'));
  });
};

export const getMapTile = async (key: string): Promise<OfflineMapTile | undefined> => {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['mapTiles'], 'readonly');
    const store = transaction.objectStore('mapTiles');
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Failed to get map tile'));
  });
};

// Country metadata operations
export const saveCountryMetadata = async (metadata: OfflineCountryData): Promise<void> => {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['countries'], 'readwrite');
    const store = transaction.objectStore('countries');
    const request = store.put(metadata);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error('Failed to save country metadata'));
  });
};

export const getCountryMetadata = async (country: string): Promise<OfflineCountryData | undefined> => {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['countries'], 'readonly');
    const store = transaction.objectStore('countries');
    const request = store.get(country);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Failed to get country metadata'));
  });
};

export const getAllDownloadedCountries = async (): Promise<OfflineCountryData[]> => {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['countries'], 'readonly');
    const store = transaction.objectStore('countries');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(new Error('Failed to get downloaded countries'));
  });
};

// Delete operations
export const deleteCountryOfflineData = async (country: string): Promise<void> => {
  const database = await initOfflineDB();
  
  // Get all places for this country
  const places = await getOfflinePlacesByCountry(country);
  const placeIds = places.map(p => p.id);
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['places', 'audio', 'countries'], 'readwrite');
    
    // Delete places
    const placesStore = transaction.objectStore('places');
    placeIds.forEach(id => placesStore.delete(id));
    
    // Delete audio for these places
    const audioStore = transaction.objectStore('audio');
    placeIds.forEach(id => audioStore.delete(id));
    
    // Delete country metadata
    const countriesStore = transaction.objectStore('countries');
    countriesStore.delete(country);
    
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(new Error('Failed to delete country data'));
  });
};

export const clearAllOfflineData = async (): Promise<void> => {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['places', 'audio', 'mapTiles', 'countries'], 'readwrite');
    transaction.objectStore('places').clear();
    transaction.objectStore('audio').clear();
    transaction.objectStore('mapTiles').clear();
    transaction.objectStore('countries').clear();
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(new Error('Failed to clear offline data'));
  });
};

// Utility functions
export const getOfflineStorageSize = async (): Promise<number> => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return estimate.usage || 0;
  }
  return 0;
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
