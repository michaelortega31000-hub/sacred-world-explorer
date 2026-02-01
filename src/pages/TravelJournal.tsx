import React, { useState } from 'react';
import { Book, Map, BarChart3, Calendar } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { BackButton } from '@/components/BackButton';
import { ImageBackground } from '@/components/ImageBackground';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useApp } from '@/contexts/AppContext';
import { getBackgroundRotationImages } from '@/lib/religionImageHelper';
import { useTravelJournal, JournalEntry } from '@/hooks/useTravelJournal';
import JournalTimeline from '@/components/journal/JournalTimeline';
import JournalMap from '@/components/journal/JournalMap';
import JournalStats from '@/components/journal/JournalStats';
import JournalPDFExport from '@/components/journal/JournalPDFExport';
import JournalEntryDetail from '@/components/journal/JournalEntryDetail';

const TravelJournal = () => {
  const { userProgress } = useApp();
  const backgroundImages = getBackgroundRotationImages(userProgress.selectedReligion);
  const { entries, loading, stats, journeyPath } = useTravelJournal();
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleEntryClick = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setDetailOpen(true);
  };

  return (
    <ImageBackground 
      images={backgroundImages}
      carousel={true}
      blur={3}
      overlay="gradient"
      className="min-h-screen pb-20"
    >
      <div className="min-h-screen relative">
        <BackButton />
        
        <div className="container mx-auto px-4 py-6 pt-16 relative z-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-3">
                <Book className="w-8 h-8 text-primary" />
                Mon Carnet de Voyage
              </h1>
              <p className="text-muted-foreground mt-1">
                Revivez vos explorations spirituelles
              </p>
            </div>
            <JournalPDFExport 
              entries={entries} 
              stats={stats} 
              username={userProgress.selectedReligion ? `Explorateur ${userProgress.selectedReligion}` : 'Explorateur'} 
            />
          </div>

          {loading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-96 rounded-xl" />
            </div>
          ) : (
            <Tabs defaultValue="timeline" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 bg-background/50 backdrop-blur-sm">
                <TabsTrigger value="timeline" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Timeline</span>
                </TabsTrigger>
                <TabsTrigger value="map" className="gap-2">
                  <Map className="w-4 h-4" />
                  <span className="hidden sm:inline">Carte</span>
                </TabsTrigger>
                <TabsTrigger value="stats" className="gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Stats</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="animate-fade-in">
                <div className="bg-card/30 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                  <JournalTimeline 
                    entries={entries} 
                    onEntryClick={handleEntryClick}
                  />
                </div>
              </TabsContent>

              <TabsContent value="map" className="animate-fade-in">
                <JournalMap 
                  journeyPath={journeyPath}
                  className="h-[500px]"
                />
              </TabsContent>

              <TabsContent value="stats" className="animate-fade-in">
                <JournalStats stats={stats} />
              </TabsContent>
            </Tabs>
          )}
        </div>

        {/* Entry detail modal */}
        <JournalEntryDetail 
          entry={selectedEntry}
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
        />

        <BottomNavigation />
      </div>
    </ImageBackground>
  );
};

export default TravelJournal;
