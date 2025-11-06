import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, CheckCircle2, Clock, Filter, Sparkles, Globe, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { getPlaceById } from '@/data/placesData';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, isSameDay, setMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { religiousEvents2025, getEventsByDate, getEventsByTradition, getAllEventDates, ReligiousEvent } from '@/data/religiousEvents';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import CalendarViewSelector from '@/components/calendar/CalendarViewSelector';
import WeekView from '@/components/calendar/WeekView';
import ListView from '@/components/calendar/ListView';
import YearView from '@/components/calendar/YearView';
import EventDetailEnriched from '@/components/calendar/EventDetailEnriched';
import EventNotificationBanner from '@/components/EventNotificationBanner';
import CalendarLegend from '@/components/calendar/CalendarLegend';
import UpcomingEventsWeek from '@/components/calendar/UpcomingEventsWeek';

interface VisitEvent {
  date: Date;
  placeId: string;
  placeName: string;
  type: 'visited' | 'planned';
}
type TraditionFilter = 'all' | 'christianity' | 'islam' | 'judaism' | 'hinduism' | 'buddhism' | 'other';
const CalendarTab = () => {
  const {
    userProgress
  } = useApp();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<VisitEvent[]>([]);
  const [traditionFilter, setTraditionFilter] = useState<TraditionFilter>('all');
  const [selectedEvent, setSelectedEvent] = useState<ReligiousEvent | null>(null);
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'list' | 'year'>('month');
  
  const handleMonthClick = (monthIndex: number) => {
    setSelectedDate(setMonth(new Date(), monthIndex));
    setCalendarView('month');
  };
  
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
  const filteredReligiousEvents = traditionFilter === 'all' ? religiousEvents2025 : getEventsByTradition(traditionFilter);
  const eventsForSelectedDate = selectedDate ? events.filter(event => isSameDay(event.date, selectedDate)) : [];
  const religiousEventsForSelectedDate = selectedDate ? getEventsByDate(selectedDate).filter(event => traditionFilter === 'all' || event.tradition === traditionFilter) : [];
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
  const traditionLabels: Record<TraditionFilter, {
    icon: string;
    label: string;
  }> = {
    all: {
      icon: '🌕',
      label: 'Toutes traditions'
    },
    christianity: {
      icon: '✝️',
      label: 'Chrétiennes'
    },
    islam: {
      icon: '☪️',
      label: 'Musulmanes'
    },
    judaism: {
      icon: '✡️',
      label: 'Juives'
    },
    hinduism: {
      icon: '🕉️',
      label: 'Hindoues'
    },
    buddhism: {
      icon: '☸️',
      label: 'Bouddhistes'
    },
    other: {
      icon: '🕊️',
      label: 'Autres'
    }
  };
  return <div className="min-h-screen bg-background pb-24 relative">
      {/* Subtle glow background effect */}
      <div className="absolute inset-0 opacity-5" style={{
      backgroundImage: 'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.2) 0%, transparent 50%)',
      filter: 'blur(100px)'
    }} />

      <div className="container mx-auto p-6 space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <h1 className="text-4xl font-serif font-bold flex items-center gap-3 text-primary">
              <Sparkles className="w-8 h-8" />
              Calendrier Spirituel Mondial
            </h1>
            <Button
              onClick={() => navigate('/reminders')}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Mes rappels</span>
            </Button>
          </div>
        </div>

        {/* Event Notification Banner */}
        <EventNotificationBanner />

        {/* Upcoming Events Week */}
        <UpcomingEventsWeek 
          events={filteredReligiousEvents}
          onEventClick={setSelectedEvent}
          traditionColors={traditionColors}
        />

        {/* View Selector */}
        <div className="mb-6">
          <CalendarViewSelector 
            currentView={calendarView}
            onViewChange={setCalendarView}
          />
        </div>

        {/* Tradition Filters */}
        <Card className="border-border bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Filter className="w-5 h-5" />
              Filtrer par tradition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(traditionLabels) as TraditionFilter[]).map(tradition => <Button key={tradition} onClick={() => setTraditionFilter(tradition)} variant={traditionFilter === tradition ? 'default' : 'outline'} className={cn("gap-2 transition-all", traditionFilter === tradition && "ring-2 ring-primary shadow-md bg-primary text-primary-foreground")}>
                  <span className="text-lg">{traditionLabels[tradition].icon}</span>
                  <span className="hidden sm:inline">{traditionLabels[tradition].label}</span>
                </Button>)}
            </div>
          </CardContent>
        </Card>

        {/* Légende des traditions */}
        <CalendarLegend 
          events={filteredReligiousEvents}
          traditionColors={traditionColors}
          traditionLabels={traditionLabels}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendrier Views */}
          <Card className="border-border bg-card shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <CalendarIcon className="w-5 h-5" />
                Calendrier 2025
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {calendarView === 'month' && 'Les points colorés indiquent les événements religieux'}
                {calendarView === 'week' && 'Planning hebdomadaire des événements'}
                {calendarView === 'list' && 'Liste chronologique des événements'}
                {calendarView === 'year' && 'Vue d\'ensemble de l\'année 2025'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              {calendarView === 'month' && (
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} locale={fr} className={cn("rounded-md border pointer-events-auto")} modifiers={{
                  hasPersonalEvent: daysWithPersonalEvents,
                  hasReligiousEvent: daysWithReligiousEvents
                }} modifiersClassNames={{
                  hasPersonalEvent: 'font-bold bg-primary/20 rounded-full',
                  hasReligiousEvent: 'has-religious-event'
                }} />
              )}
              
              {calendarView === 'week' && (
                <WeekView 
                  selectedDate={selectedDate || new Date()}
                  events={filteredReligiousEvents}
                  onEventClick={setSelectedEvent}
                />
              )}
              
              {calendarView === 'list' && (
                <ListView 
                  events={filteredReligiousEvents}
                  onEventClick={setSelectedEvent}
                />
              )}
              
              {calendarView === 'year' && (
                <YearView 
                  year={2025}
                  events={filteredReligiousEvents}
                  onMonthClick={handleMonthClick}
                />
              )}
            </CardContent>
          </Card>

          {/* Événements du jour sélectionné */}
          <Card className="border-border bg-card shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground">
                {selectedDate ? format(selectedDate, 'dd MMMM yyyy', {
                locale: fr
              }) : 'Aucune date sélectionnée'}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {religiousEventsForSelectedDate.length + eventsForSelectedDate.length} événement{religiousEventsForSelectedDate.length + eventsForSelectedDate.length > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {religiousEventsForSelectedDate.length === 0 && eventsForSelectedDate.length === 0 ? <div className="text-center py-12">
                    <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                    <p className="text-muted-foreground">
                      Aucun événement ce jour
                    </p>
                  </div> : <div className="space-y-3">
                    {/* Religious Events */}
                    {religiousEventsForSelectedDate.map(event => <div key={event.id} onClick={() => setSelectedEvent(event)} className="p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-lg hover:border-primary bg-secondary/50" style={{
                  borderColor: event.color
                }}>
                          <div className="flex items-start gap-3">
                            <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5" style={{
                      backgroundColor: event.color,
                      boxShadow: `0 0 10px ${event.color}`
                    }} />
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1 text-foreground">
                                {event.nameFr}
                              </h4>
                              <p className="text-sm mb-2 text-muted-foreground">
                                {event.descriptionFr}
                              </p>
                            <Badge className="text-xs" style={{
                        backgroundColor: event.color,
                        color: event.tradition === 'other' ? '#0E1B3F' : '#FFFFFF'
                      }}>
                              {traditionLabels[event.tradition].icon} {traditionLabels[event.tradition].label}
                            </Badge>
                          </div>
                        </div>
                      </div>)}

                    {/* Personal Events */}
                    {eventsForSelectedDate.map((event, index) => <div key={`${event.placeId}-${index}`} className="p-4 rounded-lg border-2 transition-all bg-secondary/50" style={{
                  borderColor: event.type === 'visited' ? 'hsl(var(--primary))' : 'hsl(var(--accent))'
                }}>
                        <div className="flex items-start gap-3">
                          {event.type === 'visited' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-1 text-primary" /> : <Clock className="w-5 h-5 flex-shrink-0 mt-1 text-accent" />}
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1 text-foreground">
                              {event.placeName}
                            </h4>
                            <Badge variant={event.type === 'visited' ? 'default' : 'secondary'} className="text-xs">
                              {event.type === 'visited' ? 'Visité' : 'Planifié'}
                            </Badge>
                          </div>
                        </div>
                      </div>)}
                  </div>}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border bg-card shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Lieux visités</p>
                  <p className="text-3xl font-bold text-primary">
                    {userProgress.visitedPlaces.length}
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 opacity-50 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Lieux planifiés</p>
                  <p className="text-3xl font-bold text-accent">
                    {userProgress.tripPlaces.length}
                  </p>
                </div>
                <Clock className="w-8 h-8 opacity-50 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Événements 2025</p>
                  <p className="text-3xl font-bold text-foreground">
                    {filteredReligiousEvents.length}
                  </p>
                </div>
                <Sparkles className="w-8 h-8 opacity-50 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Traditions</p>
                  <p className="text-3xl font-bold text-foreground">
                    6
                  </p>
                </div>
                <Globe className="w-8 h-8 opacity-50 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Detail Modal */}
      <EventDetailEnriched 
        event={selectedEvent}
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      />
    </div>;
};
export default CalendarTab;