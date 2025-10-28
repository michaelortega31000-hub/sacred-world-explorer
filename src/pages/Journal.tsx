import { useState } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import MemoriesTab from '@/components/MemoriesTab';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

const Journal = () => {
  const handleExportPDF = () => {
    toast.info('Exportation PDF en cours...', {
      description: 'Cette fonctionnalité sera bientôt disponible',
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Mon Journal
              </h1>
              <p className="text-lg text-muted-foreground">
                Vos souvenirs et émotions de voyage
              </p>
            </div>
            <Button onClick={handleExportPDF} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exporter PDF
            </Button>
          </div>

          <MemoriesTab />
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Journal;
