import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, TrendingUp, Settings, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import NotificationHistory from '@/components/reminders/NotificationHistory';
import ReminderStats from '@/components/reminders/ReminderStats';
import ReminderManagement from '@/components/reminders/ReminderManagement';

const Reminders = () => {
  const navigate = useNavigate();
  const { session } = useApp();
  const [activeTab, setActiveTab] = useState('history');

  useEffect(() => {
    if (!session) {
      navigate('/auth');
    }
  }, [session, navigate]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        showBack 
        backTo="/calendar"
        backLabel="Calendrier"
      />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Bell className="w-8 h-8 text-primary" />
              Gestion des Rappels
            </h1>
            <p className="text-muted-foreground mt-2">
              Suivez vos notifications et gérez vos préférences de rappels
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/calendar')}
            className="gap-2"
          >
            <Calendar className="w-4 h-4" />
            Calendrier
          </Button>
        </div>

        {/* Onglets principaux */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="history" className="gap-2">
              <Bell className="w-4 h-4" />
              Historique
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="manage" className="gap-2">
              <Settings className="w-4 h-4" />
              Gestion
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-6">
            <NotificationHistory />
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <ReminderStats />
          </TabsContent>

          <TabsContent value="manage" className="mt-6">
            <ReminderManagement />
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Reminders;
