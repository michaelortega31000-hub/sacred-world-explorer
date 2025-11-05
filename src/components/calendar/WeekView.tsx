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
          <Card key={day.toISOString()} className={`p-3 min-h-[200px] ${isToday ? 'ring-2 ring-primary' : ''}`}>
            <div className="text-center mb-3">
              <p className="text-xs text-muted-foreground uppercase">
                {format(day, 'EEE', { locale: fr })}
              </p>
              <p className={`text-lg font-bold ${isToday ? 'text-primary' : ''}`}>
                {format(day, 'd')}
              </p>
            </div>
            
            <div className="space-y-2">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Badge 
                    style={{ backgroundColor: event.color }}
                    className="w-full text-white text-xs py-1 px-2 justify-start"
                  >
                    {event.nameFr}
                  </Badge>
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
