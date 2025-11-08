import { useState } from "react";
import { ReligiousEvent } from "@/data/religiousEvents";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Heart, Share2, Bell, Book, Utensils, Music, Sparkles } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SetReminderDialog from "./SetReminderDialog";

interface EventDetailEnrichedProps {
  event: ReligiousEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EventDetailEnriched = ({ event, open, onOpenChange }: EventDetailEnrichedProps) => {
  const navigate = useNavigate();
  const [showReminderDialog, setShowReminderDialog] = useState(false);

  if (!event) return null;

  const getCountdown = () => {
    const days = differenceInDays(event.date, new Date());
    if (days === 0) return "C'est aujourd'hui !";
    if (days === 1) return "Demain";
    if (days > 0) return `Dans ${days} jours`;
    return `Il y a ${Math.abs(days)} jours`;
  };

  const handleAddReminder = () => {
    setShowReminderDialog(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${event.nameFr} - ${format(event.date, 'd MMMM yyyy', { locale: fr })}`);
    toast.success("Lien copié !");
  };

  const handleViewPlaces = () => {
    onOpenChange(false);
    navigate('/explore');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: event.color }}
                />
                {event.nameFr}
              </DialogTitle>
              <Badge className="mt-2" style={{ backgroundColor: event.color }}>
                {event.tradition}
              </Badge>
            </div>
            
            <Badge variant="outline" className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4" />
              {getCountdown()}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Date & Basic Info */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {format(event.date, "EEEE d MMMM yyyy", { locale: fr })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={handleAddReminder}>
                <Bell className="h-4 w-4 mr-2" />
                Rappel
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
              {event.relatedPlaces && event.relatedPlaces.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleViewPlaces}>
                  <MapPin className="h-4 w-4 mr-2" />
                  Voir les lieux ({event.relatedPlaces.length})
                </Button>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Book className="h-4 w-4" />
                Description
              </h3>
              <p className="text-muted-foreground">
                {event.longDescriptionFr || event.descriptionFr}
              </p>
            </div>

            {/* Rituals */}
            {event.rituals && event.rituals.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Rituels et Pratiques
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {event.rituals.map((ritual, idx) => (
                      <li key={idx}>{ritual}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Traditional Foods */}
            {event.traditionalFoods && event.traditionalFoods.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Utensils className="h-4 w-4" />
                    Gastronomie Traditionnelle
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {event.traditionalFoods.map((food, idx) => (
                      <li key={idx}>{food}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Symbolism */}
            {event.symbolism && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Symbolisme
                  </h3>
                  <p className="text-muted-foreground">
                    {event.symbolism}
                  </p>
                </div>
              </>
            )}

            {/* Quotes */}
            {event.quotes && event.quotes.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Citations</h3>
                  <div className="space-y-2">
                    {event.quotes.map((quote, idx) => (
                      <blockquote key={idx} className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                        {quote}
                      </blockquote>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Video */}
            {event.videoUrl && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Vidéo</h3>
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <iframe
                      src={event.videoUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>

      {/* Set Reminder Dialog */}
      <SetReminderDialog 
        event={event}
        open={showReminderDialog}
        onOpenChange={setShowReminderDialog}
      />
    </Dialog>
  );
};

export default EventDetailEnriched;
