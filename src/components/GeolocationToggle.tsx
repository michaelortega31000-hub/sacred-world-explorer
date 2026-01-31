import { Switch } from '@/components/ui/switch';
import { MapPin } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const GeolocationToggle = () => {
  const { userProgress, toggleGeolocation } = useApp();
  
  return (
    <div className="fixed bottom-24 left-4 z-50">
      <Switch 
        checked={userProgress.geolocationEnabled} 
        onCheckedChange={toggleGeolocation} 
        aria-label="Activer la géolocalisation" 
      />
    </div>
  );
};

export default GeolocationToggle;
