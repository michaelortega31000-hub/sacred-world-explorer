import { isSameDay } from 'date-fns';
import { ReligiousEvent } from '@/data/religiousEvents';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DayProps } from 'react-day-picker';
import { Sparkles } from 'lucide-react';

interface CalendarDayCellProps extends DayProps {
  events: ReligiousEvent[];
}

const CalendarDayCell = ({ date, displayMonth, events }: CalendarDayCellProps) => {
  const dayEvents = events.filter(event => isSameDay(event.date, date));
  
  // Separate major feasts from saints
  const majorEvents = dayEvents.filter(e => e.subType !== 'saint');
  const saintEvents = dayEvents.filter(e => e.subType === 'saint');
  
  const hasEvents = dayEvents.length > 0;
  const hasMajorEvents = majorEvents.length > 0;
  const displayDots = majorEvents.slice(0, 3); // Only show dots for major events
  const remainingMajorCount = majorEvents.length > 3 ? majorEvents.length - 3 : 0;
  const isToday = isSameDay(date, new Date());

  if (!hasEvents) {
    return <>{date.getDate()}</>;
  }

  // Get primary color for background effect (prefer major events)
  const primaryColor = majorEvents[0]?.color || saintEvents[0]?.color || '#D4AF37';

  const DayContent = (
    <div
      className={cn(
        "relative w-full h-full flex items-center justify-center transition-all duration-200",
        hasEvents && "calendar-day-with-events hover:scale-110"
      )}
      style={{
        background: hasMajorEvents 
          ? `radial-gradient(circle at center, ${primaryColor}15 0%, transparent 70%)`
          : saintEvents.length > 0 
            ? `radial-gradient(circle at center, #D4AF3710 0%, transparent 70%)`
            : undefined,
      }}
    >
      {/* Badge de comptage si plus de 3 événements majeurs */}
      {remainingMajorCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[8px] font-bold text-white bg-primary rounded-full shadow-md animate-pulse-gentle z-10">
          {remainingMajorCount}+
        </span>
      )}
      
      {/* Small golden halo indicator for saints (when no major events) */}
      {saintEvents.length > 0 && !hasMajorEvents && (
        <span className="absolute -top-0.5 -right-0.5 text-[8px] z-10">✨</span>
      )}

      {/* Numéro du jour */}
      <span className="relative z-10 font-semibold">{date.getDate()}</span>

      {/* Dots colorés pour événements majeurs uniquement */}
      {hasMajorEvents && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-0.5 z-10">
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
      
      {/* Small golden dot for saints only days */}
      {saintEvents.length > 0 && !hasMajorEvents && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
          <div
            className="w-1 h-1 rounded-full"
            style={{
              backgroundColor: '#D4AF37',
              boxShadow: '0 0 4px #D4AF37',
            }}
          />
        </div>
      )}

      {/* Glow effect au survol */}
      <div
        className="absolute inset-0 rounded-md opacity-0 hover:opacity-20 transition-opacity pointer-events-none"
        style={{
          boxShadow: `0 0 20px ${primaryColor}`,
        }}
      />
    </div>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full h-full">{DayContent}</div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs p-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              {dayEvents.length} événement{dayEvents.length > 1 ? 's' : ''}
            </p>
            
            {/* Major events first */}
            {majorEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: event.color }}
                />
                <span className="text-xs truncate font-medium">{event.nameFr}</span>
              </div>
            ))}
            
            {/* Saints with halo icon */}
            {saintEvents.slice(0, 2).map((event) => (
              <div key={event.id} className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 flex-shrink-0 text-amber-500" />
                <span className="text-xs truncate text-amber-600 dark:text-amber-400">
                  {event.nameFr}
                </span>
              </div>
            ))}
            
            {(majorEvents.length > 3 || saintEvents.length > 2) && (
              <p className="text-xs text-muted-foreground italic">
                +{Math.max(0, majorEvents.length - 3) + Math.max(0, saintEvents.length - 2)} autre{(majorEvents.length - 3) + (saintEvents.length - 2) > 1 ? 's' : ''}
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
