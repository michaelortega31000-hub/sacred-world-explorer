import { useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { ReligiousEvent } from "@/data/religiousEvents";
import { Card } from "@/components/ui/card";

interface YearViewProps {
  year: number;
  events: ReligiousEvent[];
  onMonthClick: (month: number) => void;
}

const YearView = ({ year, events, onMonthClick }: YearViewProps) => {
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  }, [year]);

  const getEventsCountForMonth = (month: Date) => {
    return events.filter(event => isSameMonth(event.date, month)).length;
  };

  const getEventsCountForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day)).length;
  };

  const getDaysInMonth = (month: Date) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    return eachDayOfInterval({ start, end });
  };

  const getDominantTraditionColor = (day: Date) => {
    const dayEvents = events.filter(event => isSameDay(event.date, day));
    if (dayEvents.length === 0) return null;
    
    // Retourner la couleur du premier événement (ou on pourrait calculer la tradition dominante)
    return dayEvents[0].color;
  };

  const getHeatmapColor = (count: number, traditionColor: string | null) => {
    if (count === 0 || !traditionColor) return 'bg-muted/30';
    
    return {
      backgroundColor: traditionColor,
      opacity: Math.min(0.3 + (count * 0.2), 1),
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {months.map((month, idx) => {
        const eventCount = getEventsCountForMonth(month);
        const days = getDaysInMonth(month);

        return (
          <Card 
            key={idx}
            className="p-4 cursor-pointer hover:shadow-xl transition-all hover:scale-105 group"
            onClick={() => onMonthClick(idx)}
          >
            <div className="text-center mb-3">
              <h3 className="font-bold text-lg capitalize group-hover:text-primary transition-colors">
                {format(month, 'MMMM', { locale: fr })}
              </h3>
              <p className="text-xs text-muted-foreground">
                {eventCount} événement{eventCount > 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const count = getEventsCountForDay(day);
                const traditionColor = getDominantTraditionColor(day);
                const heatmapStyle = getHeatmapColor(count, traditionColor);

                return (
                  <div
                    key={day.toISOString()}
                    className="aspect-square rounded-sm transition-all hover:scale-125 hover:z-10 relative group/day"
                    style={
                      typeof heatmapStyle === 'object'
                        ? heatmapStyle
                        : undefined
                    }
                    title={`${format(day, 'd MMMM', { locale: fr })} - ${count} événement${count > 1 ? 's' : ''}`}
                  >
                    {count > 0 && (
                      <div
                        className="absolute inset-0 rounded-sm opacity-0 group-hover/day:opacity-100 transition-opacity"
                        style={{
                          boxShadow: `0 0 12px ${traditionColor}`,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default YearView;
