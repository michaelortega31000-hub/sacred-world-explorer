import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Check, X, Calendar, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NotificationHistoryItem {
  id: string;
  event_id: string;
  event_name: string;
  event_date: string;
  sent_at: string;
  notification_type: string;
  opened: boolean;
  opened_at: string | null;
  reminder_time_minutes: number;
}

const NotificationHistory = () => {
  const { session } = useApp();
  const [history, setHistory] = useState<NotificationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchHistory();
    }
  }, [session?.user?.id]);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_history')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('sent_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'push':
        return { label: 'Push', color: 'bg-primary/10 text-primary' };
      case 'browser':
        return { label: 'Navigateur', color: 'bg-blue-500/10 text-blue-500' };
      case 'failed':
        return { label: 'Échec', color: 'bg-destructive/10 text-destructive' };
      default:
        return { label: type, color: 'bg-muted text-muted-foreground' };
    }
  };

  const getReminderTimeLabel = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min avant`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      return `${hours}h avant`;
    } else {
      const days = Math.floor(minutes / 1440);
      return `${days}j avant`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-xl font-semibold mb-2">Aucun historique</h3>
        <p className="text-muted-foreground">
          Les notifications que vous recevrez apparaîtront ici
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Historique des notifications</h2>
        <Badge variant="secondary">
          {history.length} notification{history.length > 1 ? 's' : ''}
        </Badge>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-3">
          {history.map((item) => {
            const typeInfo = getNotificationTypeLabel(item.notification_type);
            
            return (
              <Card key={item.id} className="p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Icône de statut */}
                  <div className={`mt-1 p-2 rounded-full ${item.opened ? 'bg-primary/10' : 'bg-muted'}`}>
                    {item.opened ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <Bell className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-foreground truncate">
                        {item.event_name}
                      </h3>
                      <Badge className={typeInfo.color} variant="secondary">
                        {typeInfo.label}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {format(new Date(item.event_date), 'PPP', { locale: fr })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>
                          Rappel {getReminderTimeLabel(item.reminder_time_minutes)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span>
                          Envoyée {formatDistanceToNow(new Date(item.sent_at), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </span>
                        {item.opened && item.opened_at && (
                          <>
                            <span>•</span>
                            <span className="text-primary">
                              Ouverte {formatDistanceToNow(new Date(item.opened_at), { 
                                addSuffix: true, 
                                locale: fr 
                              })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotificationHistory;
