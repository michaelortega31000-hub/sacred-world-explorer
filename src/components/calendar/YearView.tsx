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

  const getHeatmapColor = (count: number) => {
    if (count === 0) return 'bg-muted/30';
    if (count === 1) return 'bg-primary/30';
    if (count === 2) return 'bg-primary/60';
    return 'bg-primary';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {months.map((month, idx) => {
        const eventCount = getEventsCountForMonth(month);
        const days = getDaysInMonth(month);

        return (
          <Card 
            key={idx}
            className="p-4 cursor-pointer hover:shadow-lg transition-all hover:scale-105"
            onClick={() => onMonthClick(idx)}
          >
            <div className="text-center mb-3">
              <h3 className="font-bold text-lg">
                {format(month, 'MMMM', { locale: fr })}
              </h3>
              <p className="text-xs text-muted-foreground">
                {eventCount} événement{eventCount > 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const count = getEventsCountForDay(day);
                return (
                  <div
                    key={day.toISOString()}
                    className={`aspect-square rounded-sm ${getHeatmapColor(count)}`}
                    title={`${format(day, 'd MMMM', { locale: fr })} - ${count} événement${count > 1 ? 's' : ''}`}
                  />
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
