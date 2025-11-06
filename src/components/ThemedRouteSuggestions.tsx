import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Place } from '@/contexts/AppContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RouteTheme {
  value: string;
  label: string;
  religion?: string;
  icon: string;
}

interface RouteSuggestion {
  title: string;
  description: string;
  placeIds: string[];
  estimatedDays: number;
  difficulty: 'facile' | 'modéré' | 'difficile';
  highlights: string[];
}

interface ThemedRouteSuggestionsProps {
  availablePlaces: Place[];
  onApplyRoute: (placeIds: string[]) => void;
}

const themes: RouteTheme[] = [
  { value: 'christian-pilgrimage', label: 'Pèlerinages Chrétiens', religion: 'christianity', icon: '✝️' },
  { value: 'buddhist-temples', label: 'Temples Bouddhistes', religion: 'buddhism', icon: '☸️' },
  { value: 'islamic-heritage', label: 'Patrimoine Islamique', religion: 'islam', icon: '☪️' },
  { value: 'jewish-heritage', label: 'Patrimoine Juif', religion: 'judaism', icon: '✡️' },
  { value: 'hindu-sacred', label: 'Sites Sacrés Hindous', religion: 'hinduism', icon: '🕉️' },
  { value: 'gothic-cathedrals', label: 'Cathédrales Gothiques', icon: '⛪' },
  { value: 'ancient-temples', label: 'Temples Antiques', icon: '🏛️' },
  { value: 'spiritual-nature', label: 'Spiritualité & Nature', icon: '⛰️' },
];

const ThemedRouteSuggestions = ({ availablePlaces, onApplyRoute }: ThemedRouteSuggestionsProps) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [suggestions, setSuggestions] = useState<RouteSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const generateSuggestions = async () => {
    if (!selectedTheme || availablePlaces.length === 0) {
      toast.error('Veuillez sélectionner un thème et avoir des lieux disponibles');
      return;
    }

    setLoading(true);
    try {
      const theme = themes.find(t => t.value === selectedTheme);
      
      const { data, error } = await supabase.functions.invoke('suggest-themed-routes', {
        body: {
          theme: theme?.label,
          religion: theme?.religion,
          availablePlaces: availablePlaces,
          maxPlaces: 10
        }
      });

      if (error) throw error;

      if (data?.routes) {
        setSuggestions(data.routes);
        toast.success('Suggestions générées avec succès!');
      } else {
        throw new Error('Aucune suggestion générée');
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error('Erreur lors de la génération des suggestions');
    } finally {
      setLoading(false);
    }
  };

  const applyRoute = (suggestion: RouteSuggestion) => {
    onApplyRoute(suggestion.placeIds);
    toast.success(`Itinéraire "${suggestion.title}" appliqué!`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'modéré': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'difficile': return 'bg-red-500/20 text-red-700 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPlaceDetails = (placeId: string) => {
    return availablePlaces.find(p => p.id === placeId);
  };

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Suggestions d'itinéraires thématiques
        </CardTitle>
        <CardDescription>
          Découvrez des parcours inspirants générés par IA selon vos intérêts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Select value={selectedTheme} onValueChange={setSelectedTheme}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Choisir un thème..." />
            </SelectTrigger>
            <SelectContent className="z-50 bg-background">
              {themes.map(theme => (
                <SelectItem key={theme.value} value={theme.value}>
                  {theme.icon} {theme.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={generateSuggestions}
            disabled={!selectedTheme || loading || availablePlaces.length === 0}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Générer
              </>
            )}
          </Button>
        </div>

        {availablePlaces.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucun lieu disponible dans votre sélection</p>
            <p className="text-sm mt-1">Ajoutez des lieux à votre voyage pour obtenir des suggestions</p>
          </div>
        )}

        {suggestions.length > 0 && (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => {
                const isExpanded = expandedIndex === index;
                
                return (
                  <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{suggestion.title}</CardTitle>
                          <CardDescription className="text-sm">
                            {suggestion.description}
                          </CardDescription>
                        </div>
                        <Button
                          onClick={() => applyRoute(suggestion)}
                          size="sm"
                          className="flex-shrink-0"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Appliquer
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="outline" className="gap-1">
                          <Calendar className="w-3 h-3" />
                          {suggestion.estimatedDays} jour{suggestion.estimatedDays > 1 ? 's' : ''}
                        </Badge>
                        <Badge variant="outline" className={getDifficultyColor(suggestion.difficulty)}>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {suggestion.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          <MapPin className="w-3 h-3 mr-1" />
                          {suggestion.placeIds.length} lieux
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between mb-2"
                        onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      >
                        <span className="text-sm font-medium">Détails de l'itinéraire</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>

                      {isExpanded && (
                        <div className="space-y-3 animate-in fade-in-50 duration-200">
                          {/* Points forts */}
                          <div>
                            <h4 className="text-sm font-semibold mb-2 text-primary">Points forts :</h4>
                            <ul className="space-y-1">
                              {suggestion.highlights.map((highlight, i) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Liste des lieux */}
                          <div>
                            <h4 className="text-sm font-semibold mb-2 text-secondary">Lieux de l'itinéraire :</h4>
                            <div className="space-y-2">
                              {suggestion.placeIds.map((placeId, i) => {
                                const place = getPlaceDetails(placeId);
                                if (!place) return null;
                                
                                return (
                                  <div 
                                    key={placeId} 
                                    className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg"
                                  >
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold">
                                      {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">{place.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {place.city}, {place.country}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ThemedRouteSuggestions;
