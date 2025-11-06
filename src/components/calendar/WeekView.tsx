import { useMemo } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { ReligiousEvent } from "@/data/religiousEvents";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WeekViewProps {
  selectedDate: Date;
  events: ReligiousEvent[];
  onEventClick: (event: ReligiousEvent) => void;
}

const WeekView = ({ selectedDate, events, onEventClick }: WeekViewProps) => {
  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [selectedDate]);

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day));
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDays.map((day) => {
        const dayEvents = getEventsForDay(day);
        const isToday = isSameDay(day, new Date());

        return (
          <Card 
            key={day.toISOString()} 
            className={`p-3 min-h-[200px] transition-all hover:shadow-lg ${
              isToday ? 'ring-2 ring-primary shadow-primary/20' : ''
            }`}
          >
            <div className="text-center mb-3">
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                {format(day, 'EEE', { locale: fr })}
              </p>
              <p className={`text-xl font-bold ${isToday ? 'text-primary' : ''}`}>
                {format(day, 'd')}
              </p>
            </div>
            
            <div className="space-y-2">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className="cursor-pointer transition-all hover:scale-105 group"
                >
                  <div
                    className="relative rounded-lg overflow-hidden p-2 border-l-4 transition-all"
                    style={{
                      background: `linear-gradient(90deg, ${event.color}15 0%, transparent 100%)`,
                      borderLeftColor: event.color,
                      boxShadow: `0 2px 8px ${event.color}20`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform"
                        style={{
                          backgroundColor: event.color,
                          boxShadow: `0 0 8px ${event.color}`,
                        }}
                      />
                      <span className="text-xs font-medium line-clamp-2 text-foreground">
                        {event.nameFr}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default WeekView;
