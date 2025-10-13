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

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Vous devez être connecté pour ajouter un restaurant');
        return;
      }

      const { error } = await supabase
        .from('restaurants')
        .insert({
          ...formData,
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
      console.error('Error adding restaurant:', error);
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
