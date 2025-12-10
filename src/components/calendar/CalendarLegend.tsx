import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReligiousEvent } from '@/data/religiousEvents';
import { Info, Calendar, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CalendarLegendProps {
  events: ReligiousEvent[];
  traditionColors: Record<string, string>;
  traditionLabels: Record<string, { icon: string; label: string }>;
  onEventClick?: (event: ReligiousEvent) => void;
}

const CalendarLegend = ({ events, traditionColors, traditionLabels, onEventClick }: CalendarLegendProps) => {
  const [selectedTradition, setSelectedTradition] = useState<string | null>(null);

  // Compter les événements par tradition
  const eventCountByTradition = events.reduce((acc, event) => {
    acc[event.tradition] = (acc[event.tradition] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Traditions à afficher (seulement celles avec des événements)
  const activeTraditions = Object.keys(eventCountByTradition).filter(
    tradition => tradition !== 'all'
  );

  // Filtrer les événements par tradition sélectionnée
  const filteredEvents = selectedTradition
    ? events.filter(event => event.tradition === selectedTradition)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  const handleTraditionClick = (tradition: string) => {
    setSelectedTradition(tradition);
  };

  const handleEventClick = (event: ReligiousEvent) => {
    setSelectedTradition(null);
    onEventClick?.(event);
  };

  if (activeTraditions.length === 0) return null;

  return (
    <>
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
                <button
                  key={tradition}
                  onClick={() => handleTraditionClick(tradition)}
                  className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all group cursor-pointer hover:scale-105 active:scale-95 text-left"
                  style={{
                    boxShadow: `0 0 0 1px ${color}20`,
                  }}
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
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dialog pour afficher les événements de la tradition */}
      <Dialog open={!!selectedTradition} onOpenChange={(open) => !open && setSelectedTradition(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-xl">{selectedTradition && traditionLabels[selectedTradition]?.icon}</span>
              <span>Événements {selectedTradition && traditionLabels[selectedTradition]?.label}</span>
              <Badge 
                variant="secondary" 
                className="ml-2"
                style={{
                  backgroundColor: selectedTradition ? `${traditionColors[selectedTradition]}20` : undefined,
                  color: selectedTradition ? traditionColors[selectedTradition] : undefined,
                }}
              >
                {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-2 pr-4">
              {filteredEvents.map((event) => {
                const color = traditionColors[event.tradition] || '#FFFFFF';
                const isPast = new Date(event.date) < new Date();
                
                return (
                  <button
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className={`w-full p-3 rounded-lg border transition-all hover:scale-[1.02] active:scale-[0.98] text-left ${
                      isPast ? 'opacity-60' : ''
                    }`}
                    style={{
                      borderColor: `${color}40`,
                      backgroundColor: `${color}10`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{event.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {event.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <div 
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: `${color}20`,
                            color: color,
                          }}
                        >
                          <Calendar className="w-3 h-3" />
                          {format(new Date(event.date), 'd MMM', { locale: fr })}
                        </div>
                        {isPast && (
                          <span className="text-[10px] text-muted-foreground">Passé</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalendarLegend;
