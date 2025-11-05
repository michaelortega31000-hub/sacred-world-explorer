import { useMemo } from "react";
import { format, isFuture, isPast, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { ReligiousEvent } from "@/data/religiousEvents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ListViewProps {
  events: ReligiousEvent[];
  onEventClick: (event: ReligiousEvent) => void;
}

const ListView = ({ events, onEventClick }: ListViewProps) => {
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
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
      <div className="space-y-3">
        {sortedEvents.map((event) => {
          const isUpcoming = isFuture(event.date);
          const countdown = getCountdown(event.date);

          return (
            <Card 
              key={event.id}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
              onClick={() => onEventClick(event)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: event.color }}
                      />
                      {event.nameFr}
                    </CardTitle>
                    <Badge 
                      variant="secondary" 
                      className="mt-2"
                    >
                      {event.tradition}
                    </Badge>
                  </div>
                  
                  {isUpcoming && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {countdown}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
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
    </ScrollArea>
  );
};

export default ListView;
