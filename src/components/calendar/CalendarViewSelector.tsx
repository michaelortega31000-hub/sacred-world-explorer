import { Calendar, List, Grid3x3, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";

type CalendarView = 'month' | 'week' | 'list' | 'year';

interface CalendarViewSelectorProps {
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

const CalendarViewSelector = ({ currentView, onViewChange }: CalendarViewSelectorProps) => {
  const views = [
    { id: 'month' as CalendarView, label: 'Mois', icon: Calendar },
    { id: 'week' as CalendarView, label: 'Semaine', icon: CalendarRange },
    { id: 'list' as CalendarView, label: 'Liste', icon: List },
    { id: 'year' as CalendarView, label: 'Année', icon: Grid3x3 },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {views.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          variant={currentView === id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewChange(id)}
          className="gap-2"
        >
          <Icon className="h-4 w-4" />
          {label}
        </Button>
      ))}
    </div>
  );
};

export default CalendarViewSelector;
