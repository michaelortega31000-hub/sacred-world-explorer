import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Trophy, Volume2, Calendar, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { getPlaceById } from '@/data/placesData';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Badge } from '@/components/ui/badge';
import { getImageUrl } from '@/lib/imageHelper';

interface VisitHistoryEntry {
  id: string;
  place_id: string;
  visit_timestamp: string;
  points_earned: number;
  badge_id: string | null;
  audio_played: boolean;
  gps_location: any;
}

const MyVisitsTab = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userProgress } = useApp();
  const [visits, setVisits] = useState<VisitHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = userProgress.language === 'fr' ? fr : enUS;

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from('visit_history')
        .select('*')
        .eq('user_id', user.id)
        .order('visit_timestamp', { ascending: false });

      if (error) throw error;
      setVisits(data || []);
    } catch (error) {
      toast({
        title: userProgress.language === 'fr' ? 'Erreur' : 'Error',
        description: userProgress.language === 'fr' 
          ? 'Impossible de charger l\'historique des visites' 
          : 'Unable to load visit history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewOnMap = (placeId: string) => {
    navigate(`/place/${placeId}`);
  };

  const handleReplayAudio = (placeId: string) => {
    navigate(`/place/${placeId}?audio=true`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">
          {userProgress.language === 'fr' ? 'Chargement...' : 'Loading...'}
        </p>
      </div>
    );
  }

  if (visits.length === 0) {
    return (
      <Card className="border-2 border-primary/20">
        <CardContent className="py-12 text-center">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-xl text-muted-foreground mb-2">
            {userProgress.language === 'fr' 
              ? 'Aucune visite enregistrée' 
              : 'No visits recorded'}
          </p>
          <p className="text-muted-foreground">
            {userProgress.language === 'fr'
              ? 'Vos visites vérifiées apparaîtront ici'
              : 'Your verified visits will appear here'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-4 pr-4">
        {visits.map((visit) => {
          const place = getPlaceById(visit.place_id);
          if (!place) return null;

          return (
            <Card 
              key={visit.id}
              className="overflow-hidden hover:shadow-lg transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(20, 43, 79, 0.95) 0%, rgba(14, 27, 63, 0.98) 100%)',
                border: '1px solid rgba(52, 224, 161, 0.2)'
              }}
            >
              <CardContent className="p-0">
                <div className="flex gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={getImageUrl(place.id)}
                      alt={place.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {place.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {place.city}, {place.country}
                        </p>
                      </div>
                    </div>

                    {/* Visit info */}
                    <div className="flex flex-wrap gap-2 items-center text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {format(new Date(visit.visit_timestamp), 'PPp', { locale })}
                        </span>
                      </div>
                      
                      {visit.points_earned > 0 && (
                        <Badge variant="secondary" className="gap-1">
                          <Trophy className="w-3 h-3" />
                          +{visit.points_earned} pts
                        </Badge>
                      )}

                      {visit.badge_id && (
                        <Badge variant="default" className="gap-1">
                          🏆 {visit.badge_id}
                        </Badge>
                      )}

                      {visit.audio_played && (
                        <Badge variant="outline" className="gap-1">
                          <Volume2 className="w-3 h-3" />
                          {userProgress.language === 'fr' ? 'Audio écouté' : 'Audio played'}
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReplayAudio(visit.place_id)}
                        className="gap-2"
                      >
                        <Play className="w-3 h-3" />
                        {userProgress.language === 'fr' ? 'Réécouter' : 'Replay audio'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewOnMap(visit.place_id)}
                        className="gap-2"
                      >
                        <MapPin className="w-3 h-3" />
                        {userProgress.language === 'fr' ? 'Voir sur la carte' : 'View on map'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default MyVisitsTab;
