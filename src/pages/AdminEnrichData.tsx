import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { ArrowLeft, Database, Plus, CheckCircle2, Link as LinkIcon, Trash2, ExternalLink } from 'lucide-react';
import { useIsAdmin } from '@/hooks/useIsAdmin';

const RELIGIONS = [
  'Christianisme',
  'Islam',
  'Judaïsme',
  'Bouddhisme',
  'Hindouisme',
  'Sikhisme',
  'Shinto',
  'Taoïsme',
  'Jaïnisme',
  'Bahaïsme',
  'Zoroastrisme',
  'Confucianisme',
  'Spiritualité autochtone',
  'Antique',
  'Multi-confessionnel'
];

const PLACE_TYPES = [
  'Cathédrale',
  'Église',
  'Basilique',
  'Chapelle',
  'Abbaye',
  'Monastère',
  'Mosquée',
  'Synagogue',
  'Temple',
  'Pagode',
  'Stupa',
  'Sanctuaire',
  'Shrine',
  'Gurdwara',
  'Site sacré',
  'Ruines',
  'Grotte',
  'Montagne sacrée'
];

const DATA_SOURCES = [
  { value: 'manual', label: 'Saisie manuelle' },
  { value: 'wikipedia', label: 'Wikipedia' },
  { value: 'unesco', label: 'UNESCO' },
  { value: 'britannica', label: 'Britannica' },
  { value: 'official', label: 'Site officiel' },
  { value: 'academic', label: 'Source académique' }
];

interface PlaceFormData {
  id: string;
  name: string;
  country: string;
  city: string;
  type: string;
  religion: string;
  description: string;
  coordinates: { lat: number; lng: number };
  sourceUrls: string[];
  dataSource: string;
  imageUrl: string;
}

const AdminEnrichData = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isAdmin, loading: isAdminLoading } = useIsAdmin();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<PlaceFormData>({
    id: '',
    name: '',
    country: '',
    city: '',
    type: '',
    religion: '',
    description: '',
    coordinates: { lat: 0, lng: 0 },
    sourceUrls: [''],
    dataSource: 'manual',
    imageUrl: ''
  });

  const generateId = (name: string, country: string) => {
    const countryCode = country.toLowerCase().slice(0, 3);
    const namePart = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 20);
    const randomSuffix = Math.random().toString(36).slice(2, 6);
    return `${countryCode}-${namePart}-${randomSuffix}`;
  };

  const handleInputChange = (field: keyof PlaceFormData, value: string | number | { lat: number; lng: number }) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSourceUrlChange = (index: number, value: string) => {
    const newUrls = [...formData.sourceUrls];
    newUrls[index] = value;
    setFormData(prev => ({ ...prev, sourceUrls: newUrls }));
  };

  const addSourceUrl = () => {
    setFormData(prev => ({ ...prev, sourceUrls: [...prev.sourceUrls, ''] }));
  };

  const removeSourceUrl = (index: number) => {
    if (formData.sourceUrls.length > 1) {
      const newUrls = formData.sourceUrls.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, sourceUrls: newUrls }));
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.country || !formData.city || !formData.type) {
      toast({
        title: "Champs requis manquants",
        description: "Veuillez remplir le nom, pays, ville et type.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const placeId = formData.id || generateId(formData.name, formData.country);
      const validSourceUrls = formData.sourceUrls.filter(url => url.trim() !== '');

      const { error } = await supabase
        .from('places')
        .upsert({
          id: placeId,
          name: formData.name,
          country: formData.country,
          city: formData.city,
          type: formData.type,
          religion: formData.religion || null,
          description: formData.description || null,
          coordinates: formData.coordinates,
          image_url: formData.imageUrl || null,
          source_urls: validSourceUrls.length > 0 ? validSourceUrls : null,
          data_source: formData.dataSource,
          verified_by: user.id,
          verified_at: new Date().toISOString(),
          verification_status: 'verified',
          points_value: 10
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      // Invalidate places cache so UI updates immediately
      queryClient.invalidateQueries({ queryKey: ['places-merged'] });

      toast({
        title: "Lieu enregistré",
        description: `${formData.name} a été ajouté à la base de données.`
      });

      // Reset form
      setFormData({
        id: '',
        name: '',
        country: '',
        city: '',
        type: '',
        religion: '',
        description: '',
        coordinates: { lat: 0, lng: 0 },
        sourceUrls: [''],
        dataSource: 'manual',
        imageUrl: ''
      });

    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le lieu.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isAdminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">Accès réservé aux administrateurs.</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Retour à l'accueil
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour Admin
        </Button>

        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Enrichissement des données</h1>
                <p className="text-muted-foreground">
                  Ajoutez ou modifiez des lieux sacrés avec des sources vérifiées
                </p>
              </div>
            </div>

            <div className="border-t pt-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du lieu *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ex: Notre-Dame de Paris"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select value={formData.type} onValueChange={(v) => handleInputChange('type', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLACE_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Pays *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Ex: France"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Ex: Paris"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="religion">Tradition religieuse</Label>
                  <Select value={formData.religion} onValueChange={(v) => handleInputChange('religion', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la tradition" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELIGIONS.map(religion => (
                        <SelectItem key={religion} value={religion}>{religion}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataSource">Source principale</Label>
                  <Select value={formData.dataSource} onValueChange={(v) => handleInputChange('dataSource', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type de source" />
                    </SelectTrigger>
                    <SelectContent>
                      {DATA_SOURCES.map(source => (
                        <SelectItem key={source.value} value={source.value}>{source.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat">Latitude</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="any"
                    value={formData.coordinates.lat || ''}
                    onChange={(e) => handleInputChange('coordinates', { 
                      ...formData.coordinates, 
                      lat: parseFloat(e.target.value) || 0 
                    })}
                    placeholder="Ex: 48.8530"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng">Longitude</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="any"
                    value={formData.coordinates.lng || ''}
                    onChange={(e) => handleInputChange('coordinates', { 
                      ...formData.coordinates, 
                      lng: parseFloat(e.target.value) || 0 
                    })}
                    placeholder="Ex: 2.3499"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL de l'image</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (vérifiée)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Description historique et architecturale du lieu..."
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Copiez uniquement des informations vérifiées depuis des sources fiables.
                </p>
              </div>

              {/* Source URLs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>URLs des sources</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addSourceUrl}>
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
                {formData.sourceUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <Input
                        type="url"
                        value={url}
                        onChange={(e) => handleSourceUrlChange(index, e.target.value)}
                        placeholder="https://fr.wikipedia.org/wiki/..."
                      />
                    </div>
                    {url && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => window.open(url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    {formData.sourceUrls.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeSourceUrl(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">
                  Sources recommandées : Wikipedia, UNESCO, Britannica, sites officiels
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? (
                    <>Enregistrement...</>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Enregistrer le lieu vérifié
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminEnrichData;
