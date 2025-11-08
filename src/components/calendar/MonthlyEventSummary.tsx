import { ReligiousEvent } from '@/data/religiousEvents';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isSameMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MonthlyEventSummaryProps {
  selectedDate: Date;
  events: ReligiousEvent[];
  traditionColors: Record<string, string>;
  traditionLabels: Record<string, { icon: string; label: string }>;
}

const MonthlyEventSummary = ({ 
  selectedDate, 
  events, 
  traditionColors, 
  traditionLabels 
}: MonthlyEventSummaryProps) => {
  // Filter events for the selected month
  const monthEvents = events.filter(event => isSameMonth(event.date, selectedDate));
  
  // Group events by tradition
  const eventsByTradition = monthEvents.reduce((acc, event) => {
    const tradition = event.tradition;
    if (!acc[tradition]) {
      acc[tradition] = [];
    }
    acc[tradition].push(event);
    return acc;
  }, {} as Record<string, ReligiousEvent[]>);

  // Sort traditions by event count (descending)
  const sortedTraditions = Object.entries(eventsByTradition).sort(
    ([, a], [, b]) => b.length - a.length
  );

  const totalEvents = monthEvents.length;
  const monthName = format(selectedDate, 'MMMM yyyy', { locale: fr });

  return (
    <Card className="border-border bg-gradient-to-br from-card via-card to-card/80 shadow-lg relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 30% 20%, hsl(var(--primary) / 0.3) 0%, transparent 50%)',
          filter: 'blur(60px)'
        }} />
      </div>

      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <CardTitle className="text-foreground capitalize">
              {monthName}
            </CardTitle>
          </div>
          <Badge variant="secondary" className="gap-1">
            <TrendingUp className="w-3 h-3" />
            {totalEvents} événement{totalEvents > 1 ? 's' : ''}
          </Badge>
        </div>
        <CardDescription className="text-muted-foreground">
          Résumé des célébrations par tradition
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10">
        {totalEvents === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
            <p className="text-sm text-muted-foreground">
              Aucun événement ce mois-ci
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedTraditions.map(([tradition, traditionEvents]) => {
              const label = traditionLabels[tradition];
              const color = traditionColors[tradition];
              const percentage = Math.round((traditionEvents.length / totalEvents) * 100);

              return (
                <div
                  key={tradition}
                  className={cn(
                    "group relative p-3 rounded-lg border-2 transition-all duration-300",
                    "hover:shadow-lg hover:scale-[1.02] cursor-pointer",
                    "bg-secondary/30 hover:bg-secondary/50"
                  )}
                  style={{
                    borderColor: color,
                    boxShadow: `0 0 10px ${color}20`,
                  }}
                >
                  {/* Progress bar background */}
                  <div 
                    className="absolute inset-0 rounded-lg opacity-10 transition-opacity group-hover:opacity-20"
                    style={{
                      background: `linear-gradient(90deg, ${color}40 0%, transparent ${percentage}%)`,
                    }}
                  />

                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 transition-transform group-hover:scale-110"
                        style={{
                          backgroundColor: `${color}20`,
                          borderColor: color,
                          boxShadow: `0 0 10px ${color}40`,
                        }}
                      >
                        {label?.icon || '🌟'}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">
                            {label?.label || tradition}
                          </h4>
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                            style={{
                              backgroundColor: `${color}30`,
                              color: 'hsl(var(--foreground))',
                              borderColor: color,
                            }}
                          >
                            {percentage}%
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {traditionEvents.length} célébration{traditionEvents.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div 
                      className="text-2xl font-bold transition-transform group-hover:scale-110"
                      style={{ color }}
                    >
                      {traditionEvents.length}
                    </div>
                  </div>

                  {/* Glow effect on hover */}
                  <div 
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      boxShadow: `0 0 20px ${color}30, inset 0 0 20px ${color}10`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyEventSummary;
