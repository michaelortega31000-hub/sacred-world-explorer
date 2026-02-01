import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { mockPlaces as localPlaces } from '@/data/placesData';
import {
  initOfflineDB,
  savePlaceOffline,
  saveCountryMetadata,
  getCountryMetadata,
  getOfflinePlacesByCountry,
  getAllDownloadedCountries,
  deleteCountryOfflineData,
  clearAllOfflineData,
  getOfflineStorageSize,
  formatBytes,
  type OfflinePlaceData,
  type OfflineCountryData,
} from '@/lib/offlineStorage';
import { useNetworkStatus } from './useNetworkStatus';
import { logger } from '@/lib/logger';

export interface DownloadProgress {
  country: string;
  phase: 'places' | 'images' | 'audio' | 'complete' | 'error';
  current: number;
  total: number;
  percentage: number;
  message: string;
}

export const useOfflineMode = () => {
  const { isOnline } = useNetworkStatus();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);
  const [downloadedCountries, setDownloadedCountries] = useState<OfflineCountryData[]>([]);
  const [storageUsed, setStorageUsed] = useState<string>('0 B');

  // Initialize and load downloaded countries
  useEffect(() => {
    const init = async () => {
      try {
        await initOfflineDB();
        await refreshDownloadedCountries();
        await updateStorageUsed();
      } catch (error) {
        logger.error('Failed to initialize offline storage:', error);
      }
    };
    init();
  }, []);

  const refreshDownloadedCountries = useCallback(async () => {
    try {
      const countries = await getAllDownloadedCountries();
      setDownloadedCountries(countries);
    } catch (error) {
      logger.error('Failed to get downloaded countries:', error);
    }
  }, []);

  const updateStorageUsed = useCallback(async () => {
    const size = await getOfflineStorageSize();
    setStorageUsed(formatBytes(size));
  }, []);

  // Check if a country is downloaded
  const isCountryDownloaded = useCallback((country: string): boolean => {
    return downloadedCountries.some(c => c.country === country);
  }, [downloadedCountries]);

  // Get places for a country (offline-first)
  const getPlacesForCountry = useCallback(async (country: string) => {
    // Try offline first
    const offlinePlaces = await getOfflinePlacesByCountry(country);
    if (offlinePlaces.length > 0) {
      return offlinePlaces;
    }

    // Fall back to online data
    if (isOnline) {
      // Try Supabase first
      const { data: dbPlaces } = await supabase
        .from('places')
        .select('*')
        .eq('country', country);

      if (dbPlaces && dbPlaces.length > 0) {
        return dbPlaces.map(p => ({
          id: p.id,
          name: p.name,
          country: p.country,
          city: p.city,
          description: p.description || '',
          type: p.type,
          religion: p.religion,
          coordinates: [
            (p.coordinates as any)?.lng || 0,
            (p.coordinates as any)?.lat || 0
          ] as [number, number],
          imageUrl: p.image_url,
          points: p.points_value,
          tags: p.tags,
        }));
      }

      // Fall back to local data
      return localPlaces.filter(p => p.country === country);
    }

    return [];
  }, [isOnline]);

  // Download a country for offline use
  const downloadCountry = useCallback(async (country: string): Promise<boolean> => {
    if (isDownloading) {
      toast.error('Un téléchargement est déjà en cours');
      return false;
    }

    setIsDownloading(true);
    let totalSize = 0;
    let placesDownloaded = 0;
    let imagesDownloaded = 0;

    try {
      // Phase 1: Get places data
      setDownloadProgress({
        country,
        phase: 'places',
        current: 0,
        total: 0,
        percentage: 0,
        message: 'Récupération des lieux...'
      });

      // Get places from Supabase
      const { data: dbPlaces, error } = await supabase
        .from('places')
        .select('*')
        .eq('country', country);

      let placesToDownload: any[] = [];

      if (dbPlaces && dbPlaces.length > 0) {
        placesToDownload = dbPlaces;
      } else {
        // Fall back to local data
        placesToDownload = localPlaces.filter(p => p.country === country);
      }

      if (placesToDownload.length === 0) {
        toast.warning(`Aucun lieu trouvé pour ${country}`);
        setIsDownloading(false);
        setDownloadProgress(null);
        return false;
      }

      const totalPlaces = placesToDownload.length;

      // Phase 2: Download images
      setDownloadProgress({
        country,
        phase: 'images',
        current: 0,
        total: totalPlaces,
        percentage: 10,
        message: `Téléchargement des images (0/${totalPlaces})...`
      });

      for (let i = 0; i < placesToDownload.length; i++) {
        const place = placesToDownload[i];
        let imageBlob: Blob | undefined;

        // Try to download image
        const imageUrl = place.image_url || place.imageUrl;
        if (imageUrl) {
          try {
            const response = await fetch(imageUrl, { mode: 'cors' });
            if (response.ok) {
              imageBlob = await response.blob();
              totalSize += imageBlob.size;
              imagesDownloaded++;
            }
          } catch (imgError) {
            logger.warn(`Failed to download image for ${place.name}:`, imgError);
          }
        }

        // Save place to IndexedDB
        const offlinePlace: OfflinePlaceData = {
          id: place.id,
          name: place.name,
          country: place.country,
          city: place.city,
          description: place.description || '',
          type: place.type,
          religion: place.religion,
          coordinates: [
            (place.coordinates as any)?.lng || place.coordinates?.[0] || 0,
            (place.coordinates as any)?.lat || place.coordinates?.[1] || 0
          ],
          imageUrl: imageUrl,
          imageBlob,
          points: place.points_value || place.points || 50,
          tags: place.tags,
          downloadedAt: Date.now(),
        };

        await savePlaceOffline(offlinePlace);
        placesDownloaded++;

        const progress = Math.round(10 + (i / totalPlaces) * 80);
        setDownloadProgress({
          country,
          phase: 'images',
          current: i + 1,
          total: totalPlaces,
          percentage: progress,
          message: `Téléchargement des données (${i + 1}/${totalPlaces})...`
        });
      }

      // Phase 3: Save metadata
      setDownloadProgress({
        country,
        phase: 'complete',
        current: totalPlaces,
        total: totalPlaces,
        percentage: 100,
        message: 'Finalisation...'
      });

      const metadata: OfflineCountryData = {
        country,
        placesCount: placesDownloaded,
        audioCount: 0, // Will be updated when audio is downloaded
        mapTilesCount: 0, // Will be updated when map tiles are downloaded
        totalSizeBytes: totalSize,
        downloadedAt: Date.now(),
        lastUpdated: Date.now(),
      };

      await saveCountryMetadata(metadata);
      await refreshDownloadedCountries();
      await updateStorageUsed();

      toast.success(`${country} téléchargé avec succès ! (${placesDownloaded} lieux, ${formatBytes(totalSize)})`);
      
      setDownloadProgress(null);
      setIsDownloading(false);
      return true;

    } catch (error) {
      logger.error('Download error:', error);
      setDownloadProgress({
        country,
        phase: 'error',
        current: 0,
        total: 0,
        percentage: 0,
        message: 'Erreur lors du téléchargement'
      });
      toast.error('Erreur lors du téléchargement. Veuillez réessayer.');
      setIsDownloading(false);
      return false;
    }
  }, [isDownloading, refreshDownloadedCountries, updateStorageUsed]);

  // Delete offline data for a country
  const deleteCountry = useCallback(async (country: string): Promise<boolean> => {
    try {
      await deleteCountryOfflineData(country);
      await refreshDownloadedCountries();
      await updateStorageUsed();
      toast.success(`Données hors-ligne de ${country} supprimées`);
      return true;
    } catch (error) {
      logger.error('Delete error:', error);
      toast.error('Erreur lors de la suppression');
      return false;
    }
  }, [refreshDownloadedCountries, updateStorageUsed]);

  // Clear all offline data
  const clearAll = useCallback(async (): Promise<boolean> => {
    try {
      await clearAllOfflineData();
      await refreshDownloadedCountries();
      await updateStorageUsed();
      toast.success('Toutes les données hors-ligne ont été supprimées');
      return true;
    } catch (error) {
      logger.error('Clear all error:', error);
      toast.error('Erreur lors de la suppression');
      return false;
    }
  }, [refreshDownloadedCountries, updateStorageUsed]);

  return {
    isOnline,
    isDownloading,
    downloadProgress,
    downloadedCountries,
    storageUsed,
    isCountryDownloaded,
    getPlacesForCountry,
    downloadCountry,
    deleteCountry,
    clearAll,
    refreshDownloadedCountries,
  };
};
