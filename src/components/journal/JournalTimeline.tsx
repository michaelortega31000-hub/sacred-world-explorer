import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MapPin, Calendar, Camera, Star, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { JournalEntry } from '@/hooks/useTravelJournal';
import { getPlaceImage } from '@/lib/imageHelper';

interface JournalTimelineProps {
  entries: JournalEntry[];
  onEntryClick?: (entry: JournalEntry) => void;
}

const JournalTimeline: React.FC<JournalTimelineProps> = ({ entries, onEntryClick }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-medium text-foreground mb-2">Aucun voyage enregistré</h3>
        <p className="text-muted-foreground">
          Visitez des lieux sacrés pour commencer votre carnet de voyage
        </p>
      </div>
    );
  }

  // Group entries by month/year
  const groupedEntries: Record<string, JournalEntry[]> = {};
  entries.forEach(entry => {
    const key = format(entry.visitedAt, 'MMMM yyyy', { locale: fr });
    if (!groupedEntries[key]) {
      groupedEntries[key] = [];
    }
    groupedEntries[key].push(entry);
  });

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/30" />

        {Object.entries(groupedEntries).map(([monthYear, monthEntries]) => (
          <div key={monthYear} className="mb-8">
            {/* Month header */}
            <div className="flex items-center gap-3 mb-4 ml-10">
              <Badge variant="outline" className="bg-background/80 backdrop-blur-sm capitalize text-sm font-medium">
                <Calendar className="w-3 h-3 mr-1.5" />
                {monthYear}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {monthEntries.length} lieu{monthEntries.length > 1 ? 'x' : ''}
              </span>
            </div>

            {/* Entries for this month */}
            {monthEntries.map((entry, index) => (
              <div 
                key={entry.id} 
                className="relative mb-4 group cursor-pointer"
                onClick={() => onEntryClick?.(entry)}
              >
                {/* Timeline dot */}
                <div className="absolute left-2 top-6 w-4 h-4 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background shadow-lg z-10 group-hover:scale-125 transition-transform" />

                {/* Entry card */}
                <Card className="ml-10 overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all group-hover:shadow-lg group-hover:border-primary/30">
                  <CardContent className="p-0">
                    <div className="flex gap-3">
                      {/* Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden">
                        <img
                          src={getPlaceImage(entry.place)}
                          alt={entry.place.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/images/place-placeholder.jpg';
                          }}
                        />
                        {entry.photos.length > 0 && (
                          <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm rounded-full px-1.5 py-0.5 flex items-center gap-1">
                            <Camera className="w-3 h-3 text-white" />
                            <span className="text-[10px] text-white font-medium">{entry.photos.length}</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 py-2 pr-3 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                              {entry.place.name}
                            </h4>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              {entry.place.city}, {entry.place.country}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            {entry.place.type}
                          </Badge>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-[10px] font-medium">{entry.place.points} pts</span>
                          </div>
                        </div>

                        <p className="text-[10px] text-muted-foreground mt-1">
                          {format(entry.visitedAt, 'd MMMM yyyy', { locale: fr })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default JournalTimeline;
