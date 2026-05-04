// "Partager un lieu sacré" — submission dialog for community-contributed places.
// Lets a user add a brand-new sacred place (small village church, local shrine…)
// with photo + name + tradition + country/city. Goes through moderation.

import { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Loader2, MapPin, X } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';
import { submitNewSacredPlace } from '@/lib/placePhotos';
import { logger } from '@/lib/logger';

const TRADITIONS: Array<{ value: string; label: string }> = [
  { value: 'christianity', label: 'Christianisme' },
  { value: 'islam', label: 'Islam' },
  { value: 'judaism', label: 'Judaïsme' },
  { value: 'hinduism', label: 'Hindouisme' },
  { value: 'buddhism', label: 'Bouddhisme' },
  { value: 'sikhism', label: 'Sikhisme' },
  { value: 'shinto', label: 'Shintoïsme' },
  { value: 'taoism', label: 'Taoïsme' },
  { value: 'indigenous', label: 'Spiritualités autochtones' },
  { value: 'other', label: 'Autre tradition' },
];

const schema = z.object({
  name: z.string().trim().min(3, 'Au moins 3 caractères').max(120, 'Maximum 120 caractères'),
  country: z.string().trim().min(2, 'Indiquez le pays').max(80),
  city: z.string().trim().max(80).optional(),
  tradition: z.string().min(1, 'Choisissez une tradition'),
  caption: z.string().trim().max(400).optional(),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCountry?: string;
  onSubmitted?: () => void;
}

export const AddSacredPlaceDialog = ({ open, onOpenChange, defaultCountry, onSubmitted }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [country, setCountry] = useState(defaultCountry ?? '');
  const [city, setCity] = useState('');
  const [tradition, setTradition] = useState('');
  const [caption, setCaption] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);

  const reset = () => {
    setFile(null);
    setPreview(null);
    setName('');
    setCountry(defaultCountry ?? '');
    setCity('');
    setTradition('');
    setCaption('');
    setCoords(null);
  };

  const onPickFile = () => fileInputRef.current?.click();

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image.');
      return;
    }
    if (f.size > 8 * 1024 * 1024) {
      toast.error('Photo trop lourde — limite 8 Mo.');
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Géolocalisation indisponible sur cet appareil.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
        toast.success('Position enregistrée.');
      },
      (err) => {
        setLocating(false);
        logger.warn('[AddSacredPlace] geolocation failed', err);
        toast.error('Impossible d\'obtenir votre position.');
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Ajoutez une photo du lieu.');
      return;
    }
    const parsed = schema.safeParse({ name, country, city, tradition, caption });
    if (!parsed.success) {
      const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
      toast.error(first ?? 'Vérifiez les champs.');
      return;
    }

    setSubmitting(true);
    try {
      await submitNewSacredPlace({
        name: parsed.data.name,
        country: parsed.data.country,
        city: parsed.data.city,
        tradition: parsed.data.tradition,
        caption: parsed.data.caption,
        latitude: coords?.lat,
        longitude: coords?.lng,
        file,
      });
      toast.success('Merci pour votre contribution !', {
        description: 'Elle apparaîtra dans la communauté une fois validée.',
      });
      reset();
      onOpenChange(false);
      onSubmitted?.();
    } catch (err) {
      logger.error('[AddSacredPlace] submit failed', err);
      toast.error(err instanceof Error ? err.message : 'Échec de l\'envoi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!submitting) onOpenChange(v); }}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Partager un lieu sacré</DialogTitle>
          <DialogDescription>
            Une chapelle de village, une mosquée de quartier, un temple oublié… Faites-le découvrir au monde.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Photo */}
          <div>
            <Label>Photo du lieu *</Label>
            {preview ? (
              <div className="relative mt-1">
                <img src={preview} alt="Aperçu" className="w-full h-48 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80"
                  aria-label="Retirer la photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onPickFile}
                className="mt-1 w-full h-32 border-2 border-dashed border-primary/30 rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/60 hover:text-primary transition-colors"
              >
                <Camera className="w-6 h-6" />
                <span className="text-sm">Ajouter une photo</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onFileSelected}
              className="hidden"
            />
          </div>

          <div>
            <Label htmlFor="sp-name">Nom du lieu *</Label>
            <Input
              id="sp-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Église Saint-Pierre de…"
              maxLength={120}
            />
          </div>

          <div>
            <Label>Tradition *</Label>
            <Select value={tradition} onValueChange={setTradition}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une tradition" />
              </SelectTrigger>
              <SelectContent>
                {TRADITIONS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="sp-country">Pays *</Label>
              <Input
                id="sp-country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="France"
                maxLength={80}
              />
            </div>
            <div>
              <Label htmlFor="sp-city">Ville</Label>
              <Input
                id="sp-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Conques"
                maxLength={80}
              />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={useMyLocation}
            disabled={locating}
            className="w-full"
          >
            {locating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4 mr-2" />
            )}
            {coords ? 'Position enregistrée ✓' : 'Utiliser ma position (optionnel)'}
          </Button>

          <div>
            <Label htmlFor="sp-caption">Quelques mots (optionnel)</Label>
            <Textarea
              id="sp-caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Petite chapelle romane du XIIe siècle…"
              maxLength={400}
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Envoyer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSacredPlaceDialog;
