import React, { useState, useMemo } from 'react';
import { Download, Trash2, HardDrive, Loader2, Check, X, Search, MapPin, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useOfflineMode } from '@/hooks/useOfflineMode';
import { mockPlaces as places } from '@/data/placesData';
import { formatBytes } from '@/lib/offlineStorage';
import { cn } from '@/lib/utils';

interface OfflineDownloadManagerProps {
  className?: string;
}

export const OfflineDownloadManager: React.FC<OfflineDownloadManagerProps> = ({ className }) => {
  const {
    isOnline,
    isDownloading,
    downloadProgress,
    downloadedCountries,
    storageUsed,
    isCountryDownloaded,
    downloadCountry,
    deleteCountry,
    clearAll,
  } = useOfflineMode();

  const [searchQuery, setSearchQuery] = useState('');
  const [countryToDelete, setCountryToDelete] = useState<string | null>(null);

  // Get unique countries from places data with counts
  const availableCountries = useMemo(() => {
    const countryMap = new Map<string, number>();
    places.forEach(place => {
      const count = countryMap.get(place.country) || 0;
      countryMap.set(place.country, count + 1);
    });
    
    return Array.from(countryMap.entries())
      .map(([country, count]) => ({ country, placesCount: count }))
      .sort((a, b) => a.country.localeCompare(b.country));
  }, []);

  // Filter countries by search
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return availableCountries;
    const query = searchQuery.toLowerCase();
    return availableCountries.filter(c => 
      c.country.toLowerCase().includes(query)
    );
  }, [availableCountries, searchQuery]);

  const handleDownload = async (country: string) => {
    if (!isOnline) return;
    await downloadCountry(country);
  };

  const handleDelete = async (country: string) => {
    await deleteCountry(country);
    setCountryToDelete(null);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with storage info */}
      <Card className="border-border/50 bg-gradient-to-br from-card to-card/80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <WifiOff className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Mode Hors-ligne</CardTitle>
                <CardDescription>
                  Téléchargez les données d'un pays pour y accéder sans connexion
                </CardDescription>
              </div>
            </div>
            {!isOnline && (
              <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                <WifiOff className="w-3 h-3 mr-1" />
                Hors-ligne
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Espace utilisé :</span>
              <span className="text-sm font-medium">{storageUsed}</span>
            </div>
            {downloadedCountries.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Tout supprimer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer toutes les données ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action supprimera toutes les données hors-ligne ({downloadedCountries.length} pays).
                      Vous devrez les retélécharger pour y accéder sans connexion.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={clearAll} className="bg-destructive text-destructive-foreground">
                      Supprimer tout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Download progress */}
      {downloadProgress && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{downloadProgress.country}</span>
                <span className="text-sm text-muted-foreground">
                  {downloadProgress.percentage}%
                </span>
              </div>
              <Progress value={downloadProgress.percentage} className="h-2" />
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {downloadProgress.message}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Downloaded countries */}
      {downloadedCountries.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              Pays téléchargés ({downloadedCountries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {downloadedCountries.map((country) => (
                <div
                  key={country.country}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    <div>
                      <p className="font-medium">{country.country}</p>
                      <p className="text-xs text-muted-foreground">
                        {country.placesCount} lieux • {formatBytes(country.totalSizeBytes)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(country.country)}
                      disabled={!isOnline || isDownloading}
                      title="Mettre à jour"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <AlertDialog open={countryToDelete === country.country} onOpenChange={(open) => !open && setCountryToDelete(null)}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setCountryToDelete(country.country)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer {country.country} ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Les données hors-ligne de ce pays seront supprimées.
                            Vous pourrez les retélécharger ultérieurement.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(country.country)}
                            className="bg-destructive text-destructive-foreground"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available countries to download */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Pays disponibles</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un pays..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-3">
            <div className="space-y-2">
              {filteredCountries.map(({ country, placesCount }) => {
                const isDownloaded = isCountryDownloaded(country);
                const isCurrentlyDownloading = downloadProgress?.country === country;

                return (
                  <div
                    key={country}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg transition-colors',
                      isDownloaded 
                        ? 'bg-emerald-500/10 border border-emerald-500/20' 
                        : 'bg-muted/30 hover:bg-muted/50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className={cn(
                        'w-4 h-4',
                        isDownloaded ? 'text-emerald-500' : 'text-muted-foreground'
                      )} />
                      <div>
                        <p className="font-medium">{country}</p>
                        <p className="text-xs text-muted-foreground">
                          {placesCount} lieux sacrés
                        </p>
                      </div>
                    </div>
                    
                    {isDownloaded ? (
                      <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        <Check className="w-3 h-3 mr-1" />
                        Téléchargé
                      </Badge>
                    ) : isCurrentlyDownloading ? (
                      <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        En cours...
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(country)}
                        disabled={!isOnline || isDownloading}
                        className="gap-1"
                      >
                        <Download className="w-4 h-4" />
                        Télécharger
                      </Button>
                    )}
                  </div>
                );
              })}
              
              {filteredCountries.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Aucun pays trouvé</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
