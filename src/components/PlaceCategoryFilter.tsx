import { useState, useEffect } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Building2, Church, Layers } from 'lucide-react';
import type { PlaceCategory } from '@/contexts/AppContext';

export type PlaceCategoryFilterValue = 'all' | PlaceCategory;

interface PlaceCategoryFilterProps {
  value?: PlaceCategoryFilterValue;
  onChange?: (value: PlaceCategoryFilterValue) => void;
  className?: string;
  persistKey?: string;
}

const STORAGE_KEY_PREFIX = 'sacredworld_category_filter_';

const PlaceCategoryFilter = ({
  value: controlledValue,
  onChange,
  className = '',
  persistKey = 'default'
}: PlaceCategoryFilterProps) => {
  const storageKey = `${STORAGE_KEY_PREFIX}${persistKey}`;
  
  const [internalValue, setInternalValue] = useState<PlaceCategoryFilterValue>(() => {
    const stored = localStorage.getItem(storageKey);
    return (stored as PlaceCategoryFilterValue) || 'all';
  });

  const value = controlledValue ?? internalValue;

  useEffect(() => {
    localStorage.setItem(storageKey, value);
  }, [value, storageKey]);

  const handleChange = (newValue: string) => {
    if (!newValue) return; // Prevent deselection
    const categoryValue = newValue as PlaceCategoryFilterValue;
    setInternalValue(categoryValue);
    onChange?.(categoryValue);
  };

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={handleChange}
      className={`bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-1 ${className}`}
    >
      <ToggleGroupItem
        value="all"
        aria-label="Tous les lieux"
        className="gap-1.5 px-3 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-md text-sm font-medium"
      >
        <Layers className="w-4 h-4" />
        <span className="hidden sm:inline">Tous</span>
      </ToggleGroupItem>
      
      <ToggleGroupItem
        value="religious_site"
        aria-label="Lieux religieux"
        className="gap-1.5 px-3 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-md text-sm font-medium"
      >
        
        <span className="hidden sm:inline">Lieux sacrés</span>
      </ToggleGroupItem>
      
    </ToggleGroup>
  );
};

export default PlaceCategoryFilter;
