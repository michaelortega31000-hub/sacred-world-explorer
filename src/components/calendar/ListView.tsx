import { useMemo } from "react";
import { format, isFuture, differenceInDays, getMonth, getYear } from "date-fns";
import { fr } from "date-fns/locale";
import { ReligiousEvent } from "@/data/religiousEvents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ListViewProps {
  events: ReligiousEvent[];
  onEventClick: (event: ReligiousEvent) => void;
}

const ListView = ({ events, onEventClick }: ListViewProps) => {
  // Grouper les événements par mois
  const eventsByMonth = useMemo(() => {
    const grouped: Record<string, ReligiousEvent[]> = {};
    
    [...events]
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .forEach((event) => {
        const monthKey = `${getYear(event.date)}-${getMonth(event.date)}`;
        if (!grouped[monthKey]) {
          grouped[monthKey] = [];
        }
        grouped[monthKey].push(event);
      });
    
    return grouped;
  }, [events]);

  const getCountdown = (eventDate: Date) => {
    const today = new Date();
    const days = differenceInDays(eventDate, today);
    
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Demain";
    if (days > 0) return `Dans ${days} jours`;
    return `Il y a ${Math.abs(days)} jours`;
  };

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-6">
        {Object.entries(eventsByMonth).map(([monthKey, monthEvents]) => {
          const firstEvent = monthEvents[0];
          const monthName = format(firstEvent.date, 'MMMM yyyy', { locale: fr });

          return (
            <div key={monthKey} className="space-y-3">
              {/* Header du mois */}
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-2 -mx-2 px-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="text-lg font-bold capitalize text-foreground">
                    {monthName}
                  </h3>
                  <Badge variant="secondary" className="ml-auto">
                    {monthEvents.length} événement{monthEvents.length > 1 ? 's' : ''}
                  </Badge>
                </div>
                <Separator className="mt-2" />
              </div>

              {/* Événements du mois */}
              {monthEvents.map((event) => {
                const isUpcoming = isFuture(event.date);
                const countdown = getCountdown(event.date);

                return (
                  <Card 
                    key={event.id}
                    className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.01] group relative overflow-hidden"
                    onClick={() => onEventClick(event)}
                  >
                    {/* Gradient background léger */}
                    <div
                      className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
                      style={{
                        background: `linear-gradient(135deg, ${event.color}40 0%, transparent 100%)`,
                      }}
                    />

                    <CardHeader className="pb-3 relative">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform" 
                              style={{ 
                                backgroundColor: event.color,
                                boxShadow: `0 0 12px ${event.color}60`,
                              }}
                            />
                            <span className="group-hover:text-primary transition-colors">
                              {event.nameFr}
                            </span>
                          </CardTitle>
                          <Badge 
                            className="mt-2"
                            style={{
                              backgroundColor: `${event.color}20`,
                              color: event.color,
                              borderColor: event.color,
                            }}
                          >
                            {event.tradition}
                          </Badge>
                        </div>
                        
                        {isUpcoming && (
                          <Badge variant="outline" className="flex items-center gap-1 animate-pulse-subtle">
                            <Clock className="h-3 w-3" />
                            {countdown}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="relative">
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {event.descriptionFr}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(event.date, "d MMMM yyyy", { locale: fr })}
                        </div>
                        
                        {event.relatedPlaces && event.relatedPlaces.length > 0 && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.relatedPlaces.length} lieu{event.relatedPlaces.length > 1 ? 'x' : ''}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default ListView;
