import React, { useState } from 'react';
import { FileDown, Loader2, Check, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { JournalEntry, JournalStats } from '@/hooks/useTravelJournal';
import { toast } from 'sonner';

interface JournalPDFExportProps {
  entries: JournalEntry[];
  stats: JournalStats;
  username?: string;
}

const JournalPDFExport: React.FC<JournalPDFExportProps> = ({ entries, stats, username = 'Explorateur' }) => {
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const generatePDF = async () => {
    if (entries.length === 0) {
      toast.error('Aucun voyage à exporter');
      return;
    }

    setExporting(true);

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPos = margin;

      // Helper function to add new page if needed
      const checkNewPage = (height: number) => {
        if (yPos + height > pageHeight - margin) {
          doc.addPage();
          yPos = margin;
          return true;
        }
        return false;
      };

      // ========== COVER PAGE ==========
      // Background gradient simulation
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // Decorative elements
      doc.setFillColor(59, 130, 246); // blue-500
      doc.circle(pageWidth - 30, 40, 60, 'F');
      doc.setFillColor(139, 92, 246); // violet-500
      doc.circle(30, pageHeight - 40, 40, 'F');

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(32);
      doc.setTextColor(255, 255, 255);
      doc.text('Carnet de Voyage', pageWidth / 2, 80, { align: 'center' });

      // Subtitle
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text('Sacred World Explorer', pageWidth / 2, 95, { align: 'center' });

      // Username
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.text(username, pageWidth / 2, 130, { align: 'center' });

      // Date
      doc.setFontSize(12);
      doc.setTextColor(148, 163, 184);
      doc.text(format(new Date(), 'd MMMM yyyy', { locale: fr }), pageWidth / 2, 145, { align: 'center' });

      // Stats summary box
      const statsY = 170;
      doc.setFillColor(30, 41, 59); // slate-800
      doc.roundedRect(margin, statsY, pageWidth - 2 * margin, 50, 5, 5, 'F');

      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      const statLabels = [
        { label: 'Lieux', value: stats.totalPlaces },
        { label: 'Pays', value: stats.totalCountries },
        { label: 'Points', value: stats.totalPoints },
        { label: 'Photos', value: stats.totalPhotos }
      ];

      const statWidth = (pageWidth - 2 * margin) / statLabels.length;
      statLabels.forEach((stat, i) => {
        const x = margin + statWidth * i + statWidth / 2;
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text(String(stat.value), x, statsY + 25, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);
        doc.text(stat.label, x, statsY + 38, { align: 'center' });
        doc.setTextColor(255, 255, 255);
      });

      // Countries visited
      if (stats.countriesVisited.length > 0) {
        doc.setFontSize(10);
        doc.setTextColor(148, 163, 184);
        const countriesText = stats.countriesVisited.join(' • ');
        doc.text(countriesText, pageWidth / 2, 240, { align: 'center', maxWidth: pageWidth - 40 });
      }

      // ========== JOURNEY PAGES ==========
      doc.addPage();
      yPos = margin;

      // Page header
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(15, 23, 42);
      doc.text('Mon Parcours', margin, yPos + 10);
      yPos += 25;

      // Horizontal line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 15;

      // Group entries by country
      const entriesByCountry: Record<string, JournalEntry[]> = {};
      entries.forEach(entry => {
        const country = entry.place.country;
        if (!entriesByCountry[country]) {
          entriesByCountry[country] = [];
        }
        entriesByCountry[country].push(entry);
      });

      // Render each country section
      for (const [country, countryEntries] of Object.entries(entriesByCountry)) {
        checkNewPage(40);

        // Country header
        doc.setFillColor(241, 245, 249); // slate-100
        doc.roundedRect(margin, yPos - 5, pageWidth - 2 * margin, 20, 3, 3, 'F');
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.text(`🌍 ${country}`, margin + 5, yPos + 8);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`${countryEntries.length} lieu${countryEntries.length > 1 ? 'x' : ''}`, pageWidth - margin - 5, yPos + 8, { align: 'right' });
        
        yPos += 25;

        // Render each entry
        for (const entry of countryEntries) {
          checkNewPage(45);

          // Entry box
          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(226, 232, 240);
          doc.setLineWidth(0.3);
          doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 35, 3, 3, 'FD');

          // Place name
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(15, 23, 42);
          doc.text(entry.place.name, margin + 5, yPos + 10);

          // Location
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(100, 116, 139);
          doc.text(`📍 ${entry.place.city}`, margin + 5, yPos + 18);

          // Type
          doc.text(`🏛 ${entry.place.type}`, margin + 70, yPos + 18);

          // Points
          doc.setTextColor(245, 158, 11); // amber-500
          doc.text(`⭐ ${entry.place.points} pts`, pageWidth - margin - 5, yPos + 10, { align: 'right' });

          // Date
          doc.setTextColor(100, 116, 139);
          doc.text(format(entry.visitedAt, 'd MMM yyyy', { locale: fr }), pageWidth - margin - 5, yPos + 18, { align: 'right' });

          // Description snippet
          if (entry.place.description) {
            doc.setFontSize(8);
            doc.setTextColor(71, 85, 105);
            const descSnippet = entry.place.description.substring(0, 120) + '...';
            doc.text(descSnippet, margin + 5, yPos + 28, { maxWidth: pageWidth - 2 * margin - 10 });
          }

          yPos += 42;
        }

        yPos += 10;
      }

      // ========== FOOTER ==========
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        if (i > 1) { // Skip cover page
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text(`Sacred World Explorer • Page ${i - 1}/${totalPages - 1}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        }
      }

      // Save the PDF
      const filename = `carnet-voyage-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      doc.save(filename);

      setExported(true);
      toast.success('Carnet exporté avec succès !');
      
      setTimeout(() => setExported(false), 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Erreur lors de l\'export');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      onClick={generatePDF}
      disabled={exporting || entries.length === 0}
      className="gap-2"
      variant={exported ? 'outline' : 'default'}
    >
      {exporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Export en cours...
        </>
      ) : exported ? (
        <>
          <Check className="w-4 h-4 text-green-500" />
          Exporté !
        </>
      ) : (
        <>
          <FileDown className="w-4 h-4" />
          Exporter en PDF
        </>
      )}
    </Button>
  );
};

export default JournalPDFExport;
