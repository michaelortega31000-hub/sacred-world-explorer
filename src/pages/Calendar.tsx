import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import CalendarTab from '@/components/CalendarTab';

const Calendar = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Calendrier Religieux
            </h1>
            <p className="text-lg text-muted-foreground">
              Découvrez les fêtes et célébrations du monde entier
            </p>
          </div>

          <CalendarTab />
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Calendar;
