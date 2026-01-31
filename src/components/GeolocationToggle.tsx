import { Switch } from '@/components/ui/switch';
import { MapPin } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface GeolocationToggleProps {
  className?: string;
}

const GeolocationToggle = ({ className = '' }: GeolocationToggleProps) => {
  const { userProgress, toggleGeolocation } = useApp();
  
  return (
    <div className={className}>
      <Switch 
        checked={userProgress.geolocationEnabled} 
        onCheckedChange={toggleGeolocation} 
        aria-label="Activer la géolocalisation" 
      />
    </div>
  );
};

export default GeolocationToggle;
