import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface Hotel {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  coordinates: { lat: number; lng: number };
  star_rating: number | null;
  price_range: 'budget' | 'mid' | 'luxury' | null;
  hotel_type: string[];
  amenities: string[];
  phone: string | null;
  website: string | null;
  description: string | null;
  verified: boolean;
}

// Convert DB coordinates to our format
const normalizeCoordinates = (coords: Json): { lat: number; lng: number } => {
  if (coords && typeof coords === 'object' && 'lat' in coords && 'lng' in coords) {
    const obj = coords as { lat: number; lng: number };
    return { lat: obj.lat, lng: obj.lng };
  }
  return { lat: 0, lng: 0 };
};

// Transform DB record to Hotel interface
const transformHotel = (data: any): Hotel => ({
  id: data.id,
  name: data.name,
  address: data.address,
  city: data.city,
  country: data.country,
  coordinates: normalizeCoordinates(data.coordinates),
  star_rating: data.star_rating,
  price_range: data.price_range,
  hotel_type: data.hotel_type || [],
  amenities: data.amenities || [],
  phone: data.phone,
  website: data.website,
  description: data.description,
  verified: data.verified,
});

/**
 * Fetch all verified hotels
 */
export const useHotels = () => {
  return useQuery({
    queryKey: ['hotels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('verified', true)
        .order('name');

      if (error) {
        console.error('Error fetching hotels:', error);
        throw error;
      }

      return (data || []).map(transformHotel);
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch hotels by city (with fuzzy matching for city name variations)
 */
export const useHotelsByCity = (city: string | undefined) => {
  return useQuery({
    queryKey: ['hotels', 'city', city],
    queryFn: async () => {
      if (!city) return [];

      // Normalize city name for matching
      const normalizedCity = city.toLowerCase().trim();
      
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('verified', true)
        .order('star_rating', { ascending: false });

      if (error) {
        console.error('Error fetching hotels by city:', error);
        throw error;
      }

      // Filter with fuzzy matching for city names (e.g., "Barcelona" vs "Barcelone")
      const filtered = (data || []).filter(hotel => {
        const hotelCity = hotel.city.toLowerCase().trim();
        return hotelCity === normalizedCity || 
               hotelCity.includes(normalizedCity) || 
               normalizedCity.includes(hotelCity);
      });

      return filtered.map(transformHotel);
    },
    enabled: !!city,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch a single hotel by ID
 */
export const useHotelById = (hotelId: string | undefined) => {
  return useQuery({
    queryKey: ['hotels', hotelId],
    queryFn: async () => {
      if (!hotelId) return null;

      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('id', hotelId)
        .single();

      if (error) {
        console.error('Error fetching hotel:', error);
        throw error;
      }

      return transformHotel(data);
    },
    enabled: !!hotelId,
  });
};

/**
 * Fetch hotels by country
 */
export const useHotelsByCountry = (country: string | undefined) => {
  return useQuery({
    queryKey: ['hotels', 'country', country],
    queryFn: async () => {
      if (!country) return [];

      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('verified', true)
        .ilike('country', `%${country}%`)
        .order('city', { ascending: true });

      if (error) {
        console.error('Error fetching hotels by country:', error);
        throw error;
      }

      return (data || []).map(transformHotel);
    },
    enabled: !!country,
    staleTime: 5 * 60 * 1000,
  });
};
