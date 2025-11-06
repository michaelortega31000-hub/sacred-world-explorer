import { supabase } from '@/integrations/supabase/client';
import { mockPlaces } from '@/data/placesData';
import { Place } from '@/contexts/AppContext';

export const migratePlacesToSupabase = async (
  onProgress?: (current: number, total: number, placeName: string) => void
): Promise<{ success: number; errors: number; details: string[] }> => {
  const total = mockPlaces.length;
  let success = 0;
  let errors = 0;
  const errorDetails: string[] = [];

  console.log(`Starting migration of ${total} places...`);

  // Process in batches of 10 to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < total; i += batchSize) {
    const batch = mockPlaces.slice(i, Math.min(i + batchSize, total));
    
    const promises = batch.map(async (place: Place) => {
      try {
        onProgress?.(i + batch.indexOf(place) + 1, total, place.name);
        
        const { error } = await supabase
          .from('places')
          .upsert({
            id: place.id,
            name: place.name,
            country: place.country,
            city: place.city,
            type: place.type,
            description: place.description,
            points_value: place.points,
            coordinates: {
              lng: place.coordinates[0],
              lat: place.coordinates[1]
            },
            image_url: place.imageUrl,
            religion: place.religion || null
          }, {
            onConflict: 'id'
          });

        if (error) {
          console.error(`Error migrating ${place.name}:`, error);
          errorDetails.push(`${place.name}: ${error.message}`);
          return false;
        }
        return true;
      } catch (err) {
        console.error(`Exception migrating ${place.name}:`, err);
        errorDetails.push(`${place.name}: ${err}`);
        return false;
      }
    });

    const results = await Promise.all(promises);
    success += results.filter(r => r).length;
    errors += results.filter(r => !r).length;

    // Small delay between batches
    if (i + batchSize < total) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log(`Migration complete: ${success} succeeded, ${errors} failed`);
  
  return {
    success,
    errors,
    details: errorDetails
  };
};
