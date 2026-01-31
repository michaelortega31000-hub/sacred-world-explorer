import BottomNavigation from '@/components/BottomNavigation';
import CalendarTab from '@/components/CalendarTab';
import { ImageBackground } from '@/components/ImageBackground';
import { useApp } from '@/contexts/AppContext';
import { useMemo } from 'react';
import { mockPlaces } from '@/data/placesData';
import { inferReligionFromPlace } from '@/lib/religionHelper';
import { getImageUrl } from '@/lib/imageHelper';
import { BackButton } from '@/components/BackButton';
const Calendar = () => {
  const {
    userProgress
  } = useApp();
  const seasonalImage = useMemo(() => {
    const religion = userProgress.selectedReligion;
    const month = new Date().getMonth();
    const seasonalPlaces = mockPlaces.filter(place => {
      const placeReligion = place.religion || inferReligionFromPlace(place.type, place.name);
      return placeReligion === religion;
    });
    return seasonalPlaces.length > 0 ? getImageUrl(seasonalPlaces[month % seasonalPlaces.length]?.imageUrl || '') : getImageUrl('/src/assets/places/notre-dame.jpg');
  }, [userProgress.selectedReligion]);
  return <ImageBackground images={seasonalImage} blur={4} parallax={true} className="min-h-screen pb-20">
      <BackButton />
      
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="space-y-2">
            
            
          </div>

          <CalendarTab />
        </div>
      </div>

      <BottomNavigation />
    </ImageBackground>;
};
export default Calendar;