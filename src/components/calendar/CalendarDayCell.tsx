import { isSameDay } from 'date-fns';
import { ReligiousEvent } from '@/data/religiousEvents';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface CalendarDayCellProps {
  day: Date;
  events: ReligiousEvent[];
  isSelected?: boolean;
  isToday?: boolean;
  onClick?: () => void;
}

const CalendarDayCell = ({ day, events, isSelected, isToday, onClick }: CalendarDayCellProps) => {
  const dayEvents = events.filter(event => isSameDay(event.date, day));
  const hasEvents = dayEvents.length > 0;
  const displayDots = dayEvents.slice(0, 3);
  const remainingCount = dayEvents.length > 3 ? dayEvents.length - 3 : 0;

  const DayContent = (
    <div
      onClick={onClick}
      className={cn(
        "relative h-9 w-9 p-0 font-normal flex items-center justify-center rounded-md cursor-pointer transition-all duration-200",
        isToday && "bg-accent text-accent-foreground font-bold",
        isSelected && "bg-primary text-primary-foreground",
        hasEvents && "calendar-day-with-events hover:scale-110",
        !hasEvents && "hover:bg-accent/50"
      )}
      style={
        hasEvents
          ? {
              background: `radial-gradient(circle at center, ${displayDots[0]?.color}15 0%, transparent 70%)`,
            }
          : undefined
      }
    >
      {/* Badge de comptage si plus de 3 événements */}
      {remainingCount > 0 && (
        <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-[8px] font-bold text-white bg-primary rounded-full shadow-md animate-pulse-gentle z-10">
          {remainingCount}+
        </span>
      )}

      {/* Numéro du jour */}
      <span className="relative z-10">{day.getDate()}</span>

      {/* Dots colorés pour chaque événement */}
      {hasEvents && (
        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5 z-10">
          {displayDots.map((event, idx) => (
            <div
              key={idx}
              className="w-1.5 h-1.5 rounded-full animate-pulse-subtle"
              style={{
                backgroundColor: event.color,
                boxShadow: `0 0 6px ${event.color}`,
              }}
            />
          ))}
        </div>
      )}

      {/* Glow effect au survol */}
      {hasEvents && (
        <div
          className="absolute inset-0 rounded-md opacity-0 hover:opacity-20 transition-opacity pointer-events-none"
          style={{
            boxShadow: `0 0 20px ${displayDots[0]?.color}`,
          }}
        />
      )}
    </div>
  );

  if (!hasEvents) {
    return DayContent;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {DayContent}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs p-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              {dayEvents.length} événement{dayEvents.length > 1 ? 's' : ''}
            </p>
            {dayEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: event.color }}
                />
                <span className="text-xs truncate">{event.nameFr}</span>
              </div>
            ))}
            {remainingCount > 0 && (
              <p className="text-xs text-muted-foreground italic">
                +{remainingCount} autre{remainingCount > 1 ? 's' : ''}
              </p>
            )}
            <p className="text-xs text-primary mt-2">Cliquer pour voir les détails</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CalendarDayCell;
