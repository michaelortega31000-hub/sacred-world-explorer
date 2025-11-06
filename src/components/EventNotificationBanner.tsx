import { useEventReminders } from '@/hooks/useEventReminders';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, X } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';

const EventNotificationBanner = () => {
  const { userProgress } = useApp();
  const { upcomingEvents, requestNotificationPermission } = useEventReminders(userProgress.selectedReligion);
  const [dismissed, setDismissed] = useState(false);
  const [permissionDismissed, setPermissionDismissed] = useState(
    localStorage.getItem('notificationPermissionDismissed') === 'true'
  );

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setPermissionDismissed(true);
      localStorage.setItem('notificationPermissionDismissed', 'true');
    }
  };

  const handleDismissPermission = () => {
    setPermissionDismissed(true);
    localStorage.setItem('notificationPermissionDismissed', 'true');
  };

  // Show notification permission request if not granted and not dismissed
  if (!permissionDismissed && 'Notification' in window && Notification.permission === 'default') {
    return (
      <Card className="p-4 bg-primary/10 border-primary/20 relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0"
          onClick={handleDismissPermission}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="flex items-start gap-3 pr-8">
          <div className="p-2 bg-primary/20 rounded-full">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">
              Activer les notifications
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Recevez des rappels pour les événements religieux à venir
            </p>
            <Button onClick={handleEnableNotifications} size="sm">
              Activer
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Show upcoming events if any and not dismissed
  if (upcomingEvents.length > 0 && !dismissed) {
    return (
      <Card className="p-4 bg-accent/10 border-accent/20 relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0"
          onClick={() => setDismissed(true)}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="flex items-start gap-3 pr-8">
          <div className="p-2 bg-accent/20 rounded-full">
            <Calendar className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-foreground">
              Événements à venir
            </h3>
            {upcomingEvents.map(({ event, daysUntil }) => (
              <div key={`${event.id}-${daysUntil}`} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {event.nameFr}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {event.descriptionFr}
                  </p>
                </div>
                <Badge 
                  variant="secondary" 
                  className="ml-2"
                  style={{ backgroundColor: event.color + '20', color: event.color }}
                >
                  {daysUntil === 0 ? 'Aujourd\'hui' : 
                   daysUntil === 1 ? 'Demain' : 
                   `Dans ${daysUntil}j`}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return null;
};

export default EventNotificationBanner;
