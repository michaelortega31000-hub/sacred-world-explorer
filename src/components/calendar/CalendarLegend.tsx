import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReligiousEvent } from '@/data/religiousEvents';
import { Info } from 'lucide-react';

interface CalendarLegendProps {
  events: ReligiousEvent[];
  traditionColors: Record<string, string>;
  traditionLabels: Record<string, { icon: string; label: string }>;
}

const CalendarLegend = ({ events, traditionColors, traditionLabels }: CalendarLegendProps) => {
  // Compter les événements par tradition
  const eventCountByTradition = events.reduce((acc, event) => {
    acc[event.tradition] = (acc[event.tradition] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Traditions à afficher (seulement celles avec des événements)
  const activeTraditions = Object.keys(eventCountByTradition).filter(
    tradition => tradition !== 'all'
  );

  if (activeTraditions.length === 0) return null;

  return (
    <Card className="border-border bg-card/50 shadow-lg backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Info className="w-4 h-4" />
          Légende des traditions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {activeTraditions.map((tradition) => {
            const color = traditionColors[tradition] || '#FFFFFF';
            const label = traditionLabels[tradition];
            const count = eventCountByTradition[tradition];

            return (
              <div
                key={tradition}
                className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all group"
              >
                {/* Carré coloré */}
                <div
                  className="w-4 h-4 rounded flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 0 8px ${color}40`,
                  }}
                />
                
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-sm">{label?.icon}</span>
                    <span className="text-xs font-medium truncate">
                      {label?.label}
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[10px] h-4 px-1 mt-0.5 w-fit"
                  >
                    {count} événement{count > 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarLegend;
