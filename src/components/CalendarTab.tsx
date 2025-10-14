import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useApp } from '@/contexts/AppContext';
import { getPlaceById } from '@/data/placesData';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, isSameDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface VisitEvent {
  date: Date;
  placeId: string;
  placeName: string;
  type: 'visited' | 'planned';
}

const CalendarTab = () => {
  const { userProgress } = useApp();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<VisitEvent[]>([]);

  useEffect(() => {
    // Créer des événements à partir des lieux visités et planifiés
    const visitedEvents: VisitEvent[] = userProgress.visitedPlaces.map(placeId => {
      const place = getPlaceById(placeId);
      return {
        date: new Date(), // En réalité, il faudrait stocker la date de visite
        placeId,
        placeName: place?.name || 'Lieu inconnu',
        type: 'visited' as const
      };
    });

    const plannedEvents: VisitEvent[] = userProgress.tripPlaces.map(placeId => {
      const place = getPlaceById(placeId);
      return {
        date: new Date(), // Date de planification
        placeId,
        placeName: place?.name || 'Lieu inconnu',
        type: 'planned' as const
      };
    });

    setEvents([...visitedEvents, ...plannedEvents]);
  }, [userProgress.visitedPlaces, userProgress.tripPlaces]);

  const eventsForSelectedDate = selectedDate
    ? events.filter(event => isSameDay(event.date, selectedDate))
    : [];

  const daysWithEvents = events.map(event => event.date);

  return (
    <div className="container mx-auto p-6 space-y-6 pb-24">
      <div className="text-center mb-8">
        <h1 
          className="text-4xl font-serif font-bold mb-2"
          style={{ color: '#34E0A1' }}
        >
          Mon Calendrier
        </h1>
        <p className="text-muted-foreground text-lg">
          Planifiez et suivez vos visites spirituelles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendrier */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              Calendrier des Visites
            </CardTitle>
            <CardDescription>
              Sélectionnez une date pour voir vos visites
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={fr}
              className="rounded-md border"
              modifiers={{
                hasEvent: daysWithEvents
              }}
              modifiersStyles={{
                hasEvent: {
                  fontWeight: 'bold',
                  color: '#34E0A1'
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Événements du jour sélectionné */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: fr }) : 'Aucune date sélectionnée'}
            </CardTitle>
            <CardDescription>
              {eventsForSelectedDate.length} événement{eventsForSelectedDate.length > 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {eventsForSelectedDate.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Aucune visite prévue ou effectuée ce jour
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {eventsForSelectedDate.map((event, index) => (
                    <div
                      key={`${event.placeId}-${index}`}
                      className="p-4 rounded-lg border transition-all hover:border-primary"
                      style={{
                        background: 'rgba(234, 215, 181, 0.1)',
                        borderColor: event.type === 'visited' ? '#34E0A1' : '#F4C542'
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {event.type === 'visited' ? (
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">
                            {event.placeName}
                          </h4>
                          <Badge 
                            variant={event.type === 'visited' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {event.type === 'visited' ? 'Visité' : 'Planifié'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lieux visités</p>
                <p className="text-3xl font-bold text-primary">
                  {userProgress.visitedPlaces.length}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lieux planifiés</p>
                <p className="text-3xl font-bold text-yellow-500">
                  {userProgress.tripPlaces.length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-3xl font-bold text-foreground">
                  {userProgress.visitedPlaces.length + userProgress.tripPlaces.length}
                </p>
              </div>
              <MapPin className="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarTab;
