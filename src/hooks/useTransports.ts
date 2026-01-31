import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export type TransportType = 'metro' | 'bus' | 'tram' | 'train' | 'airport' | 'ferry';

export interface TransportStop {
  id: string;
  name: string;
  city: string;
  country: string;
  coordinates: { lat: number; lng: number };
  transport_type: TransportType;
  line_name: string | null;
  operator: string | null;
  accessibility: boolean;
  connections: string[];
  description: string | null;
  verified: boolean;
}

/**
 * Get icon for transport type
 */
export const getTransportIcon = (type: TransportType): string => {
  const icons: Record<TransportType, string> = {
    metro: '🚇',
    bus: '🚌',
    tram: '🚃',
    train: '🚆',
    airport: '✈️',
    ferry: '⛴️',
  };
  return icons[type] || '🚏';
};

/**
 * Get label for transport type
 */
export const getTransportLabel = (type: TransportType): string => {
  const labels: Record<TransportType, string> = {
    metro: 'Métro',
    bus: 'Bus',
    tram: 'Tramway',
    train: 'Train / Gare',
    airport: 'Aéroport',
    ferry: 'Ferry',
  };
  return labels[type] || type;
};

// Convert DB coordinates to our format
const normalizeCoordinates = (coords: Json): { lat: number; lng: number } => {
  if (coords && typeof coords === 'object' && 'lat' in coords && 'lng' in coords) {
    const obj = coords as { lat: number; lng: number };
    return { lat: obj.lat, lng: obj.lng };
  }
  return { lat: 0, lng: 0 };
};

// Transform DB record to TransportStop interface
const transformTransport = (data: any): TransportStop => ({
  id: data.id,
  name: data.name,
  city: data.city,
  country: data.country,
  coordinates: normalizeCoordinates(data.coordinates),
  transport_type: data.transport_type as TransportType,
  line_name: data.line_name,
  operator: data.operator,
  accessibility: data.accessibility,
  connections: data.connections || [],
  description: data.description,
  verified: data.verified,
});

/**
 * Fetch all verified transport stops
 */
export const useTransports = () => {
  return useQuery({
    queryKey: ['transport_stops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transport_stops')
        .select('*')
        .eq('verified', true)
        .order('name');

      if (error) {
        console.error('Error fetching transport stops:', error);
        throw error;
      }

      return (data || []).map(transformTransport);
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch transport stops by city (with fuzzy matching)
 */
export const useTransportsByCity = (city: string | undefined) => {
  return useQuery({
    queryKey: ['transport_stops', 'city', city],
    queryFn: async () => {
      if (!city) return [];

      const normalizedCity = city.toLowerCase().trim();

      const { data, error } = await supabase
        .from('transport_stops')
        .select('*')
        .eq('verified', true)
        .order('transport_type');

      if (error) {
        console.error('Error fetching transport stops by city:', error);
        throw error;
      }

      // Filter with fuzzy matching for city names
      const filtered = (data || []).filter(stop => {
        const stopCity = stop.city.toLowerCase().trim();
        return stopCity === normalizedCity || 
               stopCity.includes(normalizedCity) || 
               normalizedCity.includes(stopCity);
      });

      return filtered.map(transformTransport);
    },
    enabled: !!city,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch transport stops by type
 */
export const useTransportsByType = (type: TransportType | undefined) => {
  return useQuery({
    queryKey: ['transport_stops', 'type', type],
    queryFn: async () => {
      if (!type) return [];

      const { data, error } = await supabase
        .from('transport_stops')
        .select('*')
        .eq('verified', true)
        .eq('transport_type', type)
        .order('city');

      if (error) {
        console.error('Error fetching transport stops by type:', error);
        throw error;
      }

      return (data || []).map(transformTransport);
    },
    enabled: !!type,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch a single transport stop by ID
 */
export const useTransportById = (stopId: string | undefined) => {
  return useQuery({
    queryKey: ['transport_stops', stopId],
    queryFn: async () => {
      if (!stopId) return null;

      const { data, error } = await supabase
        .from('transport_stops')
        .select('*')
        .eq('id', stopId)
        .single();

      if (error) {
        console.error('Error fetching transport stop:', error);
        throw error;
      }

      return transformTransport(data);
    },
    enabled: !!stopId,
  });
};

/**
 * Fetch transport stops by country
 */
export const useTransportsByCountry = (country: string | undefined) => {
  return useQuery({
    queryKey: ['transport_stops', 'country', country],
    queryFn: async () => {
      if (!country) return [];

      const { data, error } = await supabase
        .from('transport_stops')
        .select('*')
        .eq('verified', true)
        .ilike('country', `%${country}%`)
        .order('city');

      if (error) {
        console.error('Error fetching transport stops by country:', error);
        throw error;
      }

      return (data || []).map(transformTransport);
    },
    enabled: !!country,
    staleTime: 5 * 60 * 1000,
  });
};
