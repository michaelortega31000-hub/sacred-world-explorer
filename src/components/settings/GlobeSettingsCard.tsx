import { Globe2, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import {
  MapStyle,
  AtmospherePreset,
  SparkleColor,
  mapStyleLabels,
  atmosphereLabels,
  sparkleColorLabels,
} from '@/types/globeSettings';

const GlobeSettingsCard = () => {
  const { userProgress, updateGlobeSettings } = useApp();
  const { toast } = useToast();
  const globeSettings = userProgress.globeSettings;

  const handleMapStyleChange = (value: MapStyle) => {
    updateGlobeSettings({ mapStyle: value });
    toast({
      title: 'Style de carte modifié',
      description: `Le style "${mapStyleLabels[value]}" a été appliqué`,
    });
  };

  const handleAtmosphereChange = (value: AtmospherePreset) => {
    updateGlobeSettings({ atmosphere: value });
    toast({
      title: 'Atmosphère modifiée',
      description: `L'atmosphère "${atmosphereLabels[value]}" a été appliquée`,
    });
  };

  const handleStarIntensityChange = (value: number[]) => {
    updateGlobeSettings({ starIntensity: value[0] });
  };

  const handleSparkleToggle = (checked: boolean) => {
    updateGlobeSettings({ sparkleEnabled: checked });
    toast({
      title: checked ? 'Effet scintillant activé' : 'Effet scintillant désactivé',
      description: checked
        ? 'Un effet visuel apparaîtra lors du clic sur un pays'
        : "L'effet a été désactivé",
    });
  };

  const handleSparkleColorChange = (value: SparkleColor) => {
    updateGlobeSettings({ sparkleColor: value });
    toast({
      title: 'Couleur modifiée',
      description: `La couleur "${sparkleColorLabels[value]}" a été appliquée`,
    });
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <Globe2 className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 space-y-6">
          <div>
            <Label className="text-lg font-semibold text-foreground mb-2 block">
              Personnalisation du Globe
            </Label>
            <p className="text-sm text-muted-foreground">
              Personnalisez l'apparence du globe 3D selon vos préférences
            </p>
          </div>

          {/* Map Style */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Style de carte</Label>
            <Select value={globeSettings.mapStyle} onValueChange={handleMapStyleChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(mapStyleLabels) as MapStyle[]).map((style) => (
                  <SelectItem key={style} value={style}>
                    {mapStyleLabels[style]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Atmosphere */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Atmosphère & espace</Label>
            <Select value={globeSettings.atmosphere} onValueChange={handleAtmosphereChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(atmosphereLabels) as AtmospherePreset[]).map((preset) => (
                  <SelectItem key={preset} value={preset}>
                    {atmosphereLabels[preset]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Star Intensity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">Intensité des étoiles</Label>
              <span className="text-sm text-muted-foreground">
                {Math.round(globeSettings.starIntensity * 100)}%
              </span>
            </div>
            <Slider
              value={[globeSettings.starIntensity]}
              onValueChange={handleStarIntensityChange}
              min={0}
              max={1}
              step={0.05}
              className="w-full"
            />
          </div>

          {/* Sparkle Effect */}
          <div className="space-y-4 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <Label className="text-sm font-medium text-foreground">Effet scintillant au clic</Label>
              </div>
              <Switch
                checked={globeSettings.sparkleEnabled}
                onCheckedChange={handleSparkleToggle}
              />
            </div>

            {globeSettings.sparkleEnabled && (
              <div className="space-y-2 pl-6">
                <Label className="text-sm font-medium text-muted-foreground">Couleur</Label>
                <Select value={globeSettings.sparkleColor} onValueChange={handleSparkleColorChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(sparkleColorLabels) as SparkleColor[]).map((color) => (
                      <SelectItem key={color} value={color}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              background:
                                color === 'gold'
                                  ? 'linear-gradient(135deg, #F4C542, #FFD700)'
                                  : color === 'turquoise'
                                  ? 'linear-gradient(135deg, #34E0A1, #00CED1)'
                                  : 'linear-gradient(135deg, #FF6B6B, #FFD93D, #6BCB77, #4D96FF, #C77DFF)',
                            }}
                          />
                          {sparkleColorLabels[color]}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GlobeSettingsCard;
