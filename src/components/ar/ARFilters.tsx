import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';

export type FilterType = 'none' | 'vintage' | 'sacred' | 'golden' | 'mystic';

export interface FilterStyle {
  name: string;
  cssFilter: string;
  description: string;
}

export const FILTER_PRESETS: Record<FilterType, FilterStyle> = {
  none: {
    name: 'Aucun',
    cssFilter: 'none',
    description: 'Image originale',
  },
  vintage: {
    name: 'Vintage',
    cssFilter: 'sepia(0.5) contrast(1.2) brightness(0.9)',
    description: 'Style rétro',
  },
  sacred: {
    name: 'Sacré',
    cssFilter: 'saturate(1.3) brightness(1.1) contrast(1.1)',
    description: 'Couleurs vives',
  },
  golden: {
    name: 'Doré',
    cssFilter: 'sepia(0.3) saturate(1.5) hue-rotate(10deg) brightness(1.1)',
    description: 'Tons dorés',
  },
  mystic: {
    name: 'Mystique',
    cssFilter: 'saturate(0.8) brightness(0.9) contrast(1.3) hue-rotate(180deg)',
    description: 'Ambiance mystique',
  },
};

interface ARFiltersProps {
  imageUrl: string | null;
  onApply: (filter: FilterType) => void;
  onClose: () => void;
}

export const ARFilters = ({ imageUrl, onApply, onClose }: ARFiltersProps) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('none');

  if (!imageUrl) return null;

  const handleApply = () => {
    onApply(selectedFilter);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-xl font-bold">Filtres AR</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Preview */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="relative max-w-md w-full aspect-square">
          <img
            src={imageUrl}
            alt="AR Preview"
            className="w-full h-full object-contain rounded-lg"
            style={{
              filter: FILTER_PRESETS[selectedFilter].cssFilter,
              transition: 'filter 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Filter selection */}
      <div className="p-4 border-t border-border">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-5 gap-3 mb-4">
            {(Object.keys(FILTER_PRESETS) as FilterType[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedFilter === filter
                    ? 'border-primary scale-105'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <img
                  src={imageUrl}
                  alt={FILTER_PRESETS[filter].name}
                  className="w-full h-full object-cover"
                  style={{ filter: FILTER_PRESETS[filter].cssFilter }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-2">
                  <p className="text-xs font-medium text-center">
                    {FILTER_PRESETS[filter].name}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <Card className="bg-muted/50 p-3 mb-4">
            <p className="text-sm text-center text-muted-foreground">
              {FILTER_PRESETS[selectedFilter].description}
            </p>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Appliquer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
