import { Switch } from '@/components/ui/switch';
import { MapPin } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const GeolocationToggle = () => {
  const { userProgress, toggleGeolocation, userLocation } = useApp();
  
  return (
    <div className="fixed bottom-24 left-4 z-50 flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg border border-border/50">
      <MapPin className={`w-4 h-4 ${
        userProgress.geolocationEnabled && userLocation 
          ? 'text-primary' 
          : 'text-muted-foreground'
      }`} />
      <Switch 
        checked={userProgress.geolocationEnabled} 
        onCheckedChange={toggleGeolocation} 
        aria-label="Activer la géolocalisation" 
      />
    </div>
  );
};

export default GeolocationToggle;
