import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, CheckCircle2, Clock, Filter, Sparkles, Globe, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { getPlaceById } from '@/data/placesData';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { religiousEvents2025, getEventsByDate, getEventsByTradition, getAllEventDates, ReligiousEvent } from '@/data/religiousEvents';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface VisitEvent {
  date: Date;
  placeId: string;
  placeName: string;
  type: 'visited' | 'planned';
}

type TraditionFilter = 'all' | 'christianity' | 'islam' | 'judaism' | 'hinduism' | 'buddhism' | 'other';

const CalendarTab = () => {
  const { userProgress } = useApp();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<VisitEvent[]>([]);
  const [traditionFilter, setTraditionFilter] = useState<TraditionFilter>('all');
  const [selectedEvent, setSelectedEvent] = useState<ReligiousEvent | null>(null);

  useEffect(() => {
    // Créer des événements à partir des lieux visités et planifiés
    const visitedEvents: VisitEvent[] = userProgress.visitedPlaces.map(placeId => {
      const place = getPlaceById(placeId);
      return {
        date: new Date(),
        placeId,
        placeName: place?.name || 'Lieu inconnu',
        type: 'visited' as const
      };
    });

    const plannedEvents: VisitEvent[] = userProgress.tripPlaces.map(placeId => {
      const place = getPlaceById(placeId);
      return {
        date: new Date(),
        placeId,
        placeName: place?.name || 'Lieu inconnu',
        type: 'planned' as const
      };
    });

    setEvents([...visitedEvents, ...plannedEvents]);
  }, [userProgress.visitedPlaces, userProgress.tripPlaces]);

  const filteredReligiousEvents = traditionFilter === 'all' 
    ? religiousEvents2025 
    : getEventsByTradition(traditionFilter);

  const eventsForSelectedDate = selectedDate
    ? events.filter(event => isSameDay(event.date, selectedDate))
    : [];

  const religiousEventsForSelectedDate = selectedDate
    ? getEventsByDate(selectedDate).filter(event => 
        traditionFilter === 'all' || event.tradition === traditionFilter
      )
    : [];

  const daysWithPersonalEvents = events.map(event => event.date);
  const daysWithReligiousEvents = filteredReligiousEvents.map(event => event.date);

  const traditionColors: Record<string, string> = {
    christianity: '#C6A45A',
    islam: '#00C6FF',
    judaism: '#4A90E2',
    hinduism: '#FF69B4',
    buddhism: '#50C878',
    other: '#FFFFFF'
  };

  const traditionLabels: Record<TraditionFilter, { icon: string; label: string }> = {
    all: { icon: '🌕', label: 'Toutes traditions' },
    christianity: { icon: '✝️', label: 'Chrétiennes' },
    islam: { icon: '☪️', label: 'Musulmanes' },
    judaism: { icon: '✡️', label: 'Juives' },
    hinduism: { icon: '🕉️', label: 'Hindoues' },
    buddhism: { icon: '☸️', label: 'Bouddhistes' },
    other: { icon: '🕊️', label: 'Autres' }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden pb-24"
      style={{ background: '#0E1B3F' }}
    >
      {/* Background globe blur */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(52, 224, 161, 0.2) 0%, transparent 70%)'
          }}
        />
      </div>

      <div className="container mx-auto p-6 space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="text-4xl font-serif font-bold mb-2 flex items-center justify-center gap-3"
            style={{ color: '#34E0A1' }}
          >
            <Sparkles className="w-8 h-8" />
            Calendrier Spirituel Mondial
          </h1>
          <p className="text-lg" style={{ color: '#F5F5F5' }}>
            Découvrez les célébrations religieuses et culturelles du monde entier
          </p>
        </div>

        {/* Tradition Filters */}
        <Card 
          className="backdrop-blur-md border-2"
          style={{
            background: 'rgba(234, 215, 181, 0.6)',
            borderColor: 'rgba(52, 224, 161, 0.3)',
            boxShadow: '0 0 20px rgba(244, 197, 66, 0.2)'
          }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: '#0E1B3F' }}>
              <Filter className="w-5 h-5" />
              Filtrer par tradition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(traditionLabels) as TraditionFilter[]).map((tradition) => (
                <Button
                  key={tradition}
                  onClick={() => setTraditionFilter(tradition)}
                  variant={traditionFilter === tradition ? 'default' : 'outline'}
                  className="gap-2 transition-all"
                  style={traditionFilter === tradition ? {
                    background: traditionColors[tradition],
                    color: tradition === 'other' ? '#0E1B3F' : '#FFFFFF',
                    borderColor: traditionColors[tradition]
                  } : {
                    borderColor: traditionColors[tradition],
                    color: '#0E1B3F'
                  }}
                >
                  <span className="text-lg">{traditionLabels[tradition].icon}</span>
                  <span className="hidden sm:inline">{traditionLabels[tradition].label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendrier */}
          <Card 
            className="backdrop-blur-md border-2"
            style={{
              background: 'rgba(234, 215, 181, 0.9)',
              borderColor: 'rgba(52, 224, 161, 0.3)',
              boxShadow: '0 0 30px rgba(52, 224, 161, 0.2)'
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#0E1B3F' }}>
                <CalendarIcon className="w-5 h-5" />
                Calendrier 2025
              </CardTitle>
              <CardDescription style={{ color: 'rgba(14, 27, 63, 0.7)' }}>
                Les points colorés indiquent les événements religieux
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={fr}
                className={cn("rounded-md border pointer-events-auto")}
                modifiers={{
                  hasPersonalEvent: daysWithPersonalEvents,
                  hasReligiousEvent: daysWithReligiousEvents
                }}
                modifiersClassNames={{
                  hasPersonalEvent: 'font-bold bg-primary/20 rounded-full',
                  hasReligiousEvent: 'relative'
                }}
              />
            </CardContent>
          </Card>

          {/* Événements du jour sélectionné */}
          <Card 
            className="backdrop-blur-md border-2"
            style={{
              background: 'rgba(234, 215, 181, 0.9)',
              borderColor: 'rgba(52, 224, 161, 0.3)',
              boxShadow: '0 0 30px rgba(52, 224, 161, 0.2)'
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: '#0E1B3F' }}>
                {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: fr }) : 'Aucune date sélectionnée'}
              </CardTitle>
              <CardDescription style={{ color: 'rgba(14, 27, 63, 0.7)' }}>
                {religiousEventsForSelectedDate.length + eventsForSelectedDate.length} événement{(religiousEventsForSelectedDate.length + eventsForSelectedDate.length) > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {religiousEventsForSelectedDate.length === 0 && eventsForSelectedDate.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'rgba(14, 27, 63, 0.3)' }} />
                    <p style={{ color: 'rgba(14, 27, 63, 0.6)' }}>
                      Aucun événement ce jour
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Religious Events */}
                    {religiousEventsForSelectedDate.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className="p-4 rounded-lg border transition-all cursor-pointer hover:shadow-lg"
                        style={{
                          background: 'rgba(255, 255, 255, 0.5)',
                          borderColor: event.color,
                          borderWidth: '2px'
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5"
                            style={{ 
                              backgroundColor: event.color,
                              boxShadow: `0 0 10px ${event.color}`
                            }}
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1" style={{ color: '#0E1B3F' }}>
                              {event.nameFr}
                            </h4>
                            <p className="text-sm mb-2" style={{ color: 'rgba(14, 27, 63, 0.7)' }}>
                              {event.descriptionFr}
                            </p>
                            <Badge 
                              className="text-xs"
                              style={{ 
                                backgroundColor: event.color,
                                color: event.tradition === 'other' ? '#0E1B3F' : '#FFFFFF'
                              }}
                            >
                              {traditionLabels[event.tradition].icon} {traditionLabels[event.tradition].label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Personal Events */}
                    {eventsForSelectedDate.map((event, index) => (
                      <div
                        key={`${event.placeId}-${index}`}
                        className="p-4 rounded-lg border transition-all"
                        style={{
                          background: 'rgba(255, 255, 255, 0.5)',
                          borderColor: event.type === 'visited' ? '#34E0A1' : '#F4C542',
                          borderWidth: '2px'
                        }}
                      >
                        <div className="flex items-start gap-3">
                          {event.type === 'visited' ? (
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#34E0A1' }} />
                          ) : (
                            <Clock className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#F4C542' }} />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1" style={{ color: '#0E1B3F' }}>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card 
            className="backdrop-blur-md border-2"
            style={{
              background: 'rgba(234, 215, 181, 0.8)',
              borderColor: 'rgba(52, 224, 161, 0.3)'
            }}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: 'rgba(14, 27, 63, 0.7)' }}>Lieux visités</p>
                  <p className="text-3xl font-bold" style={{ color: '#34E0A1' }}>
                    {userProgress.visitedPlaces.length}
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 opacity-50" style={{ color: '#34E0A1' }} />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="backdrop-blur-md border-2"
            style={{
              background: 'rgba(234, 215, 181, 0.8)',
              borderColor: 'rgba(52, 224, 161, 0.3)'
            }}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: 'rgba(14, 27, 63, 0.7)' }}>Lieux planifiés</p>
                  <p className="text-3xl font-bold" style={{ color: '#F4C542' }}>
                    {userProgress.tripPlaces.length}
                  </p>
                </div>
                <Clock className="w-8 h-8 opacity-50" style={{ color: '#F4C542' }} />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="backdrop-blur-md border-2"
            style={{
              background: 'rgba(234, 215, 181, 0.8)',
              borderColor: 'rgba(52, 224, 161, 0.3)'
            }}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: 'rgba(14, 27, 63, 0.7)' }}>Événements 2025</p>
                  <p className="text-3xl font-bold" style={{ color: '#0E1B3F' }}>
                    {filteredReligiousEvents.length}
                  </p>
                </div>
                <Sparkles className="w-8 h-8 opacity-50" style={{ color: '#C6A45A' }} />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="backdrop-blur-md border-2"
            style={{
              background: 'rgba(234, 215, 181, 0.8)',
              borderColor: 'rgba(52, 224, 161, 0.3)'
            }}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: 'rgba(14, 27, 63, 0.7)' }}>Traditions</p>
                  <p className="text-3xl font-bold" style={{ color: '#0E1B3F' }}>
                    6
                  </p>
                </div>
                <Globe className="w-8 h-8 opacity-50" style={{ color: '#00C6FF' }} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Detail Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent 
          className="max-w-2xl backdrop-blur-xl border-2"
          style={{
            background: 'rgba(234, 215, 181, 0.95)',
            borderColor: selectedEvent?.color || '#34E0A1',
            boxShadow: `0 0 40px ${selectedEvent?.color || '#34E0A1'}40`
          }}
        >
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-2xl" style={{ color: '#0E1B3F' }}>
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ 
                      backgroundColor: selectedEvent.color,
                      boxShadow: `0 0 15px ${selectedEvent.color}`
                    }}
                  />
                  {selectedEvent.nameFr}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Badge 
                    className="mb-3"
                    style={{ 
                      backgroundColor: selectedEvent.color,
                      color: selectedEvent.tradition === 'other' ? '#0E1B3F' : '#FFFFFF'
                    }}
                  >
                    {traditionLabels[selectedEvent.tradition].icon} {traditionLabels[selectedEvent.tradition].label}
                  </Badge>
                  
                  <p className="text-lg leading-relaxed" style={{ color: '#0E1B3F' }}>
                    {selectedEvent.descriptionFr}
                  </p>
                </div>

                <div 
                  className="p-4 rounded-lg"
                  style={{ background: 'rgba(255, 255, 255, 0.5)' }}
                >
                  <p className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: '#0E1B3F' }}>
                    <CalendarIcon className="w-4 h-4" />
                    {format(selectedEvent.date, 'EEEE dd MMMM yyyy', { locale: fr })}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      navigate('/world?tab=map');
                      setSelectedEvent(null);
                    }}
                    className="flex-1 gap-2"
                    style={{
                      background: selectedEvent.color,
                      color: selectedEvent.tradition === 'other' ? '#0E1B3F' : '#FFFFFF'
                    }}
                  >
                    <Globe className="w-4 h-4" />
                    Voir sur la carte
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setSelectedEvent(null)}
                    style={{ borderColor: selectedEvent.color, color: '#0E1B3F' }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarTab;
