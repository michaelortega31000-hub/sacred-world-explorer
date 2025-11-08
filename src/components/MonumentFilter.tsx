import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X, Search, Save, Trash2, Star } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { religionColors } from '@/config/religionColors';
import { Religion } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

export interface FilterOptions {
  religions: Religion[];
  types: string[];
}

interface FilterPreset {
  id: string;
  name: string;
  filters: FilterOptions;
}

const PRESETS_STORAGE_KEY = 'monument-filter-presets';

interface MonumentFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  externalFilters?: FilterOptions;
  matchingCount?: number;
}

const MonumentFilter = ({ onFilterChange, externalFilters, matchingCount }: MonumentFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReligions, setSelectedReligions] = useState<Religion[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [presetName, setPresetName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);
  const { toast } = useToast();

  // Load presets from localStorage on mount
  useEffect(() => {
    const savedPresets = localStorage.getItem(PRESETS_STORAGE_KEY);
    if (savedPresets) {
      try {
        setPresets(JSON.parse(savedPresets));
      } catch (error) {
        console.error('Failed to load presets:', error);
      }
    }
  }, []);

  // Synchroniser avec des filtres externes (contrôle par le parent)
  useEffect(() => {
    if (externalFilters) {
      setSelectedReligions(externalFilters.religions || []);
      setSelectedTypes(externalFilters.types || []);
    }
  }, [externalFilters]);

  const religions: { id: Religion; name: string }[] = [
    { id: 'christianity', name: 'Christianisme' },
    { id: 'islam', name: 'Islam' },
    { id: 'judaism', name: 'Judaïsme' },
    { id: 'buddhism', name: 'Bouddhisme' },
    { id: 'hinduism', name: 'Hindouisme' },
    { id: 'traditional', name: 'Traditions' },
  ];

  const monumentTypes = [
    'Cathédrale',
    'Basilique',
    'Église',
    'Abbaye',
    'Chapelle',
    'Mosquée',
    'Synagogue',
    'Temple',
    'Pagode',
    'Monastère',
    'Sanctuaire',
    'Pyramide',
    'Site archéologique',
    'Monument',
  ];

  const handleReligionToggle = (religion: Religion) => {
    const newReligions = selectedReligions.includes(religion)
      ? selectedReligions.filter(r => r !== religion)
      : [...selectedReligions, religion];
    
    setSelectedReligions(newReligions);
    console.log('🎯 Religion filter changed:', { religions: newReligions, types: selectedTypes });
    onFilterChange({ religions: newReligions, types: selectedTypes });
  };

  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    setSelectedTypes(newTypes);
    console.log('🎯 Type filter changed:', { religions: selectedReligions, types: newTypes });
    onFilterChange({ religions: selectedReligions, types: newTypes });
  };

  const clearFilters = () => {
    setSelectedReligions([]);
    setSelectedTypes([]);
    onFilterChange({ religions: [], types: [] });
  };

  const savePreset = () => {
    if (!presetName.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez entrer un nom pour ce préréglage",
        variant: "destructive",
      });
      return;
    }

    if (!hasActiveFilters) {
      toast({
        title: "Aucun filtre actif",
        description: "Veuillez sélectionner au moins un filtre avant de sauvegarder",
        variant: "destructive",
      });
      return;
    }

    const newPreset: FilterPreset = {
      id: Date.now().toString(),
      name: presetName.trim(),
      filters: {
        religions: selectedReligions,
        types: selectedTypes,
      },
    };

    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updatedPresets));
    
    setPresetName('');
    setShowSavePreset(false);
    
    toast({
      title: "Préréglage sauvegardé",
      description: `"${newPreset.name}" a été ajouté à vos préréglages`,
    });
  };

  const loadPreset = (preset: FilterPreset) => {
    setSelectedReligions(preset.filters.religions);
    setSelectedTypes(preset.filters.types);
    onFilterChange(preset.filters);
    
    toast({
      title: "Préréglage appliqué",
      description: `Filtres de "${preset.name}" appliqués`,
    });
  };

  const deletePreset = (presetId: string) => {
    const updatedPresets = presets.filter(p => p.id !== presetId);
    setPresets(updatedPresets);
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updatedPresets));
    
    toast({
      title: "Préréglage supprimé",
      description: "Le préréglage a été supprimé",
    });
  };

  const hasActiveFilters = selectedReligions.length > 0 || selectedTypes.length > 0;
  const activeFiltersCount = selectedReligions.length + selectedTypes.length;

  // Filter religions and types based on search query
  const filteredReligions = religions.filter(religion =>
    religion.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMonumentTypes = monumentTypes.filter(type =>
    type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative">
      {/* Filter Button */}
      <Button
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "gap-3 backdrop-blur-md border-2 transition-all duration-300 relative h-14 px-6 text-base font-semibold shadow-xl",
          hasActiveFilters && "ring-2 ring-[#34E0A1] ring-offset-2 ring-offset-[#0E1B3F]"
        )}
        style={{
          background: hasActiveFilters
            ? 'linear-gradient(135deg, rgba(52, 224, 161, 0.95) 0%, rgba(52, 224, 161, 0.8) 100%)'
            : 'linear-gradient(135deg, rgba(20, 43, 79, 0.95) 0%, rgba(14, 27, 63, 0.9) 100%)',
          color: hasActiveFilters ? '#0E1B3F' : '#F5F5F5',
          borderColor: hasActiveFilters ? '#34E0A1' : 'rgba(52, 224, 161, 0.4)',
          boxShadow: hasActiveFilters
            ? '0 8px 32px rgba(52, 224, 161, 0.5), 0 0 20px rgba(52, 224, 161, 0.3)'
            : '0 8px 24px rgba(20, 43, 79, 0.6), 0 0 15px rgba(244, 197, 66, 0.2)',
        }}
      >
        <Filter className="w-5 h-5" />
        <span className="hidden sm:inline">Filtre</span>
        
        {/* Active Religion Color Dots */}
        {selectedReligions.length > 0 && (
          <div className="flex gap-1 items-center">
            {selectedReligions.slice(0, 3).map((religionId) => {
              const colorConfig = religionColors[religionId];
              return (
                <div
                  key={religionId}
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{
                    background: colorConfig.marker,
                    boxShadow: `0 0 6px ${colorConfig.marker}`,
                  }}
                />
              );
            })}
            {selectedReligions.length > 3 && (
              <span className="text-xs font-bold">+{selectedReligions.length - 3}</span>
            )}
          </div>
        )}
        
        {/* Active Filters Count Badge */}
        {hasActiveFilters && (
          <Badge 
            variant="secondary"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-[#F4C542] text-[#0E1B3F] border-2 border-[#0E1B3F] text-xs font-bold"
          >
            {activeFiltersCount}
          </Badge>
        )}
      </Button>

      {/* Filter Panel */}
      {isOpen && (
        <div
          className="fixed left-2 sm:left-4 z-[70] bottom-28 sm:bottom-24 w-80 max-w-[calc(100vw-2rem)] max-h-[70vh] overflow-y-auto backdrop-blur-xl border-2 rounded-2xl shadow-2xl animate-scale-in"
          style={{
            background: 'rgba(20, 43, 79, 0.98)',
            borderColor: 'rgba(52, 224, 161, 0.4)',
            boxShadow: '0 8px 40px rgba(52, 224, 161, 0.3), 0 0 60px rgba(14, 27, 63, 0.6)',
          }}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 backdrop-blur-xl border-b" style={{ 
            background: 'rgba(14, 27, 63, 0.9)', 
            borderColor: 'rgba(52, 224, 161, 0.2)' 
          }}>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-[#F5F5F5] font-playfair">
                  Filtres
                </h3>
                {hasActiveFilters && (
                  <Badge 
                    variant="secondary"
                    className="bg-[#F4C542] text-[#0E1B3F] text-xs font-bold"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#EAD7B5] hover:text-[#34E0A1] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Stats Row */}
            <div className="px-4 pb-3 flex items-center justify-between gap-2">
              {hasActiveFilters && matchingCount !== undefined && (
                <span className="text-xs text-[#EAD7B5]">
                  {matchingCount} monument{matchingCount !== 1 ? 's' : ''} trouvé{matchingCount !== 1 ? 's' : ''}
                </span>
              )}
              <div className="flex gap-2 ml-auto">
                {hasActiveFilters && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowSavePreset(!showSavePreset)}
                      className="h-7 px-2 text-xs text-[#34E0A1] hover:text-[#3ffab8] hover:bg-[#34E0A1]/10"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Sauver
                    </Button>
                    <button
                      onClick={clearFilters}
                      className="text-xs text-[#F4C542] hover:text-[#F4C542]/80 transition-colors font-inter"
                    >
                      ✕ Effacer
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Save Preset Input */}
            {showSavePreset && (
              <div className="px-4 pb-3 animate-scale-in">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Nom du préréglage..."
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && savePreset()}
                    className="h-8 text-sm bg-white/5 border-[#34E0A1]/30 text-[#F5F5F5] placeholder:text-[#EAD7B5]/50"
                  />
                  <Button
                    size="sm"
                    onClick={savePreset}
                    className="h-8 px-3 bg-[#34E0A1] text-[#0E1B3F] hover:bg-[#3ffab8]"
                  >
                    <Save className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Saved Presets Section */}
          {presets.length > 0 && (
            <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(52, 224, 161, 0.1)' }}>
              <h4 className="text-sm font-semibold text-[#EAD7B5] mb-3 font-inter flex items-center gap-2">
                <Star className="w-4 h-4 text-[#F4C542]" />
                Préréglages ({presets.length})
              </h4>
              <div className="space-y-2">
                {presets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <button
                      onClick={() => loadPreset(preset)}
                      className="flex-1 text-left text-sm text-[#F5F5F5] hover:text-[#34E0A1] transition-colors font-inter"
                    >
                      {preset.name}
                      <span className="ml-2 text-xs text-[#EAD7B5]/60">
                        ({preset.filters.religions.length + preset.filters.types.length})
                      </span>
                    </button>
                    <button
                      onClick={() => deletePreset(preset.id)}
                      className="text-[#F4C542]/60 hover:text-[#F4C542] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="p-4 border-b" style={{ borderColor: 'rgba(52, 224, 161, 0.1)' }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#EAD7B5]/60" />
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-[#34E0A1]/30 text-[#F5F5F5] placeholder:text-[#EAD7B5]/50 focus:border-[#34E0A1] focus:ring-[#34E0A1]/30"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#EAD7B5]/60 hover:text-[#34E0A1] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Religions Section */}
          <div className="p-4 border-b" style={{ borderColor: 'rgba(52, 224, 161, 0.1)' }}>
            <h4 className="text-sm font-semibold text-[#EAD7B5] mb-3 font-inter">
              Par Religion {filteredReligions.length < religions.length && (
                <span className="text-xs text-[#EAD7B5]/60">({filteredReligions.length})</span>
              )}
            </h4>
            {filteredReligions.length === 0 ? (
              <p className="text-sm text-[#EAD7B5]/60 py-4 text-center">Aucune religion trouvée</p>
            ) : (
              <div className="space-y-2">
                {filteredReligions.map((religion) => {
                const isChecked = selectedReligions.includes(religion.id);
                const colorConfig = religionColors[religion.id];
                
                return (
                  <label
                    key={religion.id}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200",
                      isChecked ? "bg-white/10" : "hover:bg-white/5"
                    )}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleReligionToggle(religion.id)}
                      style={{
                        borderColor: colorConfig.marker,
                      }}
                      className={cn(
                        isChecked && "data-[state=checked]:bg-transparent"
                      )}
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        background: colorConfig.marker,
                        boxShadow: `0 0 8px ${colorConfig.marker}80`
                      }}
                    />
                    <span className={cn(
                      "text-sm font-medium font-inter transition-colors",
                      isChecked ? "text-[#F5F5F5]" : "text-[#EAD7B5]/80"
                    )}>
                      {religion.name}
                    </span>
                  </label>
                );
                })}
              </div>
            )}
          </div>

          {/* Monument Types Section */}
          <div className="p-4">
            <h4 className="text-sm font-semibold text-[#EAD7B5] mb-3 font-inter">
              Par Type de Monument {filteredMonumentTypes.length < monumentTypes.length && (
                <span className="text-xs text-[#EAD7B5]/60">({filteredMonumentTypes.length})</span>
              )}
            </h4>
            {filteredMonumentTypes.length === 0 ? (
              <p className="text-sm text-[#EAD7B5]/60 py-4 text-center">Aucun type trouvé</p>
            ) : (
              <div className="space-y-2">
                {filteredMonumentTypes.map((type) => {
                const isChecked = selectedTypes.includes(type);
                
                return (
                  <label
                    key={type}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200",
                      isChecked ? "bg-white/10" : "hover:bg-white/5"
                    )}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleTypeToggle(type)}
                      style={{
                        borderColor: isChecked ? '#34E0A1' : 'rgba(234, 215, 181, 0.5)',
                      }}
                      className={cn(
                        isChecked && "data-[state=checked]:bg-[#34E0A1]"
                      )}
                    />
                    <span className={cn(
                      "text-sm font-medium font-inter transition-colors",
                      isChecked ? "text-[#F5F5F5]" : "text-[#EAD7B5]/80"
                    )}>
                      {type}
                    </span>
                  </label>
                );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonumentFilter;
