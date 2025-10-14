import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';
import { useRateLimit } from '@/hooks/useRateLimit';
import { logger } from '@/lib/logger';

// Validation schema with HTML sanitization
const noHtmlRegex = /<[^>]*>/g;

const restaurantSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Le nom est requis')
    .max(200, 'Le nom ne peut pas dépasser 200 caractères')
    .refine(val => !noHtmlRegex.test(val), {
      message: 'Les balises HTML ne sont pas autorisées'
    }),
  cuisine: z.string()
    .trim()
    .min(1, 'Le type de cuisine est requis')
    .max(100, 'Le type de cuisine ne peut pas dépasser 100 caractères')
    .refine(val => !noHtmlRegex.test(val), {
      message: 'Les balises HTML ne sont pas autorisées'
    }),
  address: z.string()
    .trim()
    .min(1, 'L\'adresse est requise')
    .max(300, 'L\'adresse ne peut pas dépasser 300 caractères')
    .refine(val => !noHtmlRegex.test(val), {
      message: 'Les balises HTML ne sont pas autorisées'
    }),
  city: z.string()
    .trim()
    .min(1, 'La ville est requise')
    .max(100, 'La ville ne peut pas dépasser 100 caractères')
    .refine(val => !noHtmlRegex.test(val), {
      message: 'Les balises HTML ne sont pas autorisées'
    }),
  country: z.string()
    .trim()
    .min(1, 'Le pays est requis')
    .max(100, 'Le pays ne peut pas dépasser 100 caractères')
    .refine(val => !noHtmlRegex.test(val), {
      message: 'Les balises HTML ne sont pas autorisées'
    }),
  phone: z.string().trim().regex(/^[+]?[0-9\s\-()]*$/, 'Format de téléphone invalide').max(20, 'Le téléphone ne peut pas dépasser 20 caractères').optional().or(z.literal('')),
  website: z.string().trim().url('URL invalide').max(500, 'L\'URL ne peut pas dépasser 500 caractères').optional().or(z.literal('')),
  description: z.string()
    .trim()
    .max(2000, 'La description ne peut pas dépasser 2000 caractères')
    .refine(val => val === '' || !noHtmlRegex.test(val), {
      message: 'Les balises HTML ne sont pas autorisées'
    })
    .optional()
    .or(z.literal('')),
});

type RestaurantType = 'halal' | 'kosher' | 'vegetarian' | 'vegan' | 'neutral';

const restaurantTypes = [
  { value: 'halal', label: 'Halal', emoji: '☪️' },
  { value: 'kosher', label: 'Cachère', emoji: '✡️' },
  { value: 'vegetarian', label: 'Végétarien', emoji: '🥗' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱' },
  { value: 'neutral', label: 'Neutre', emoji: '🍴' },
];

export const AddRestaurantDialog = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<RestaurantType[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    website: '',
    description: '',
  });

  const handleTypeToggle = (type: RestaurantType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedTypes.length === 0) {
      toast.error('Veuillez sélectionner au moins un type de restaurant');
      return;
    }

    // Validate input
    const validation = restaurantSchema.safeParse(formData);

    if (!validation.success) {
      const error = validation.error.errors[0];
      toast.error(error.message);
      return;
    }

    setLoading(true);

    try {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
      
      if (!user) {
        toast.error('Vous devez être connecté pour ajouter un restaurant');
        return;
      }

      const { error } = await supabase
        .from('restaurants')
        .insert({
          name: validation.data.name,
          cuisine: validation.data.cuisine,
          address: validation.data.address,
          city: validation.data.city,
          country: validation.data.country,
          phone: validation.data.phone || null,
          website: validation.data.website || null,
          description: validation.data.description || null,
          type: selectedTypes,
          created_by: user.id,
        });

      if (error) throw error;

      toast.success('Restaurant ajouté avec succès ! Il sera visible après vérification.');
      setOpen(false);
      setFormData({
        name: '',
        cuisine: '',
        address: '',
        city: '',
        country: '',
        phone: '',
        website: '',
        description: '',
      });
      setSelectedTypes([]);
      onSuccess?.();
    } catch (error) {
      logger.error('Error adding restaurant:', error);
      toast.error('Erreur lors de l\'ajout du restaurant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un restaurant
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un restaurant</DialogTitle>
          <DialogDescription>
            Proposez un restaurant à la communauté. Il sera visible après vérification.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du restaurant *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Type de restaurant *</Label>
            <div className="flex flex-wrap gap-2">
              {restaurantTypes.map((type) => (
                <Badge
                  key={type.value}
                  variant={selectedTypes.includes(type.value as RestaurantType) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleTypeToggle(type.value as RestaurantType)}
                >
                  {type.emoji} {type.label}
                  {selectedTypes.includes(type.value as RestaurantType) && (
                    <X className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cuisine">Type de cuisine *</Label>
            <Input
              id="cuisine"
              value={formData.cuisine}
              onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
              placeholder="Ex: Marocaine, Française, Italienne..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Pays *</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Décrivez le restaurant, son ambiance, ses spécialités..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Ajout en cours...' : 'Ajouter le restaurant'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
