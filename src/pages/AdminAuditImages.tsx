import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useImageAudit, type AuditedPlace } from '@/hooks/useImageAudit';
import Header from '@/components/Header';
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  Download,
  ExternalLink,
  Loader2,
  Search,
  Globe
} from 'lucide-react';

const PlaceAuditCard = ({ 
  place, 
  onFetchWikipedia, 
  onUpdateImage,
  isFetchingWikipedia 
}: { 
  place: AuditedPlace; 
  onFetchWikipedia: () => void;
  onUpdateImage: (url: string) => void;
  isFetchingWikipedia: boolean;
}) => {
  const [imageError, setImageError] = useState(false);
  const [showWikipediaPreview, setShowWikipediaPreview] = useState(false);

  const statusConfig = {
    valid: { color: 'bg-green-500', icon: CheckCircle2, label: 'Image locale valide' },
    external: { color: 'bg-blue-500', icon: Globe, label: 'Image externe' },
    placeholder: { color: 'bg-yellow-500', icon: AlertCircle, label: 'Placeholder' },
    missing: { color: 'bg-red-500', icon: AlertCircle, label: 'Image manquante' },
  };

  const status = statusConfig[place.imageStatus];
  const StatusIcon = status.icon;

  return (
    <Card className="p-4 flex flex-col md:flex-row gap-4">
      {/* Image Preview */}
      <div className="relative w-full md:w-40 h-32 md:h-28 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
        {!imageError ? (
          <img
            src={place.imageUrl}
            alt={place.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
        <div className={`absolute top-2 left-2 w-3 h-3 rounded-full ${status.color}`} />
      </div>

      {/* Place Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold truncate">{place.name}</h3>
            <p className="text-sm text-muted-foreground">{place.city}, {place.country}</p>
          </div>
          <Badge variant={place.imageStatus === 'valid' || place.imageStatus === 'external' ? 'default' : 'destructive'}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {status.label}
          </Badge>
        </div>
        
        <p className="text-xs text-muted-foreground mt-1 truncate">
          {place.imageUrl}
        </p>

        {/* Wikipedia Preview */}
        {place.wikipediaImageUrl && (
          <div className="mt-2 p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Globe className="w-3 h-3" />
              Image Wikipedia trouvée
            </div>
            {showWikipediaPreview && (
              <img
                src={place.wikipediaImageUrl}
                alt="Wikipedia preview"
                className="w-32 h-20 object-cover rounded mt-1"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowWikipediaPreview(!showWikipediaPreview)}
              >
                {showWikipediaPreview ? 'Masquer' : 'Voir aperçu'}
              </Button>
              <Button
                size="sm"
                onClick={() => onUpdateImage(place.wikipediaImageUrl!)}
              >
                Utiliser cette image
              </Button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-3">
          <Button
            size="sm"
            variant="outline"
            onClick={onFetchWikipedia}
            disabled={isFetchingWikipedia}
          >
            {isFetchingWikipedia ? (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <Search className="w-3 h-3 mr-1" />
            )}
            Chercher sur Wikipedia
          </Button>
          
          {place.imageUrl.startsWith('http') && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open(place.imageUrl, '_blank')}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Voir l'image
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

const AdminAuditImages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    isLoading,
    filteredPlaces,
    countries,
    selectedCountry,
    setSelectedCountry,
    showOnlyProblems,
    setShowOnlyProblems,
    stats,
    loadAllPlaces,
    fetchWikipediaImage,
    updatePlaceImage,
    batchFetchWikipediaImages,
    fetchingWikipediaFor,
  } = useImageAudit();

  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0, name: '' });

  useEffect(() => {
    loadAllPlaces();
  }, [loadAllPlaces]);

  const handleBatchFetch = async () => {
    const placesToProcess = filteredPlaces.filter(p => 
      p.imageStatus === 'placeholder' || p.imageStatus === 'missing'
    );

    if (placesToProcess.length === 0) {
      toast({
        title: "Rien à traiter",
        description: "Tous les lieux ont déjà une image valide.",
      });
      return;
    }

    setIsBatchProcessing(true);
    setBatchProgress({ current: 0, total: placesToProcess.length, name: '' });

    try {
      const results = await batchFetchWikipediaImages(
        placesToProcess,
        (current, total, name) => {
          setBatchProgress({ current, total, name });
        }
      );

      toast({
        title: "Traitement terminé",
        description: `${results.success} images mises à jour, ${results.failed} échecs, ${results.skipped} ignorés`,
      });

      // Reload places to refresh the UI
      loadAllPlaces();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue pendant le traitement",
        variant: "destructive",
      });
    } finally {
      setIsBatchProcessing(false);
      setBatchProgress({ current: 0, total: 0, name: '' });
    }
  };

  const handleFetchWikipedia = async (place: AuditedPlace) => {
    await fetchWikipediaImage(place.id, place.name, place.country);
  };

  const handleUpdateImage = async (placeId: string, newUrl: string) => {
    try {
      await updatePlaceImage(placeId, newUrl);
      toast({
        title: "Image mise à jour",
        description: "L'image a été enregistrée dans la base de données.",
      });
      loadAllPlaces();
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'image.",
        variant: "destructive",
      });
    }
  };

  // Group places by country for display
  const placesByCountry = filteredPlaces.reduce((acc, place) => {
    if (!acc[place.country]) {
      acc[place.country] = [];
    }
    acc[place.country].push(place);
    return acc;
  }, {} as Record<string, AuditedPlace[]>);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'admin
        </Button>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Stats & Filters */}
          <div className="lg:w-80 space-y-4">
            <Card className="p-4">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Statistiques
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total des lieux</span>
                  <Badge variant="outline">{stats.total}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Images locales
                  </span>
                  <Badge variant="outline">{stats.withLocalImage}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Images externes
                  </span>
                  <Badge variant="outline">{stats.withExternalImage}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    Placeholders
                  </span>
                  <Badge variant="outline">{stats.withPlaceholder}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    Manquantes
                  </span>
                  <Badge variant="outline">{stats.missing}</Badge>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-2">
                  Couverture des images
                </div>
                <Progress 
                  value={((stats.withLocalImage + stats.withExternalImage) / stats.total) * 100} 
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round(((stats.withLocalImage + stats.withExternalImage) / stats.total) * 100)}% des lieux ont une image
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h2 className="font-semibold mb-4">Filtres</h2>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm mb-2 block">Pays</Label>
                  <Select
                    value={selectedCountry || 'all'}
                    onValueChange={(v) => setSelectedCountry(v === 'all' ? null : v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les pays" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les pays ({stats.total})</SelectItem>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="problems-only" className="text-sm">
                    Problèmes uniquement
                  </Label>
                  <Switch
                    id="problems-only"
                    checked={showOnlyProblems}
                    onCheckedChange={setShowOnlyProblems}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h2 className="font-semibold mb-4">Actions</h2>
              
              <div className="space-y-3">
                <Button
                  className="w-full"
                  onClick={loadAllPlaces}
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Recharger les données
                </Button>

                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={handleBatchFetch}
                  disabled={isBatchProcessing || isLoading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Corriger automatiquement
                </Button>

                {isBatchProcessing && (
                  <div className="space-y-2">
                    <Progress 
                      value={(batchProgress.current / batchProgress.total) * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      {batchProgress.current}/{batchProgress.total} - {batchProgress.name}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Main Content - Places List */}
          <div className="flex-1">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">
                  Lieux ({filteredPlaces.length})
                </h2>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <div className="space-y-6">
                    {Object.entries(placesByCountry).map(([country, places]) => (
                      <div key={country}>
                        <h3 className="font-medium text-lg mb-3 sticky top-0 bg-background py-2 border-b">
                          🌍 {country} ({places.length} lieux)
                        </h3>
                        <div className="space-y-3">
                          {places.map(place => (
                            <PlaceAuditCard
                              key={place.id}
                              place={place}
                              onFetchWikipedia={() => handleFetchWikipedia(place)}
                              onUpdateImage={(url) => handleUpdateImage(place.id, url)}
                              isFetchingWikipedia={fetchingWikipediaFor.has(place.id)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuditImages;
