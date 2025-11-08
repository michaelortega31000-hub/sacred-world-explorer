import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { religionColors } from '@/config/religionColors';
import { Religion } from '@/contexts/AppContext';

export interface FilterOptions {
  religions: Religion[];
  types: string[];
}

interface MonumentFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  externalFilters?: FilterOptions;
  matchingCount?: number;
}

const MonumentFilter = ({ onFilterChange, externalFilters, matchingCount }: MonumentFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReligions, setSelectedReligions] = useState<Religion[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

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

  const hasActiveFilters = selectedReligions.length > 0 || selectedTypes.length > 0;

  return (
    <div className="relative">
      {/* Filter Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "gap-2 backdrop-blur-md border-2 transition-all duration-300",
          hasActiveFilters && "ring-2 ring-[#34E0A1] ring-offset-2 ring-offset-[#0E1B3F]"
        )}
        style={{
          background: hasActiveFilters
            ? 'linear-gradient(135deg, rgba(52, 224, 161, 0.9) 0%, rgba(52, 224, 161, 0.7) 100%)'
            : 'rgba(20, 43, 79, 0.8)',
          color: hasActiveFilters ? '#0E1B3F' : '#F5F5F5',
          borderColor: hasActiveFilters ? '#34E0A1' : 'rgba(52, 224, 161, 0.3)',
          boxShadow: hasActiveFilters
            ? '0 0 20px rgba(52, 224, 161, 0.4)'
            : '0 0 10px rgba(244, 197, 66, 0.2)',
        }}
      >
        <Filter className="w-4 h-4" />
        <span className="hidden sm:inline">Filtre</span>
        {matchingCount !== undefined && matchingCount >= 0 && (
          <span className="text-xs bg-[#0E1B3F] text-[#34E0A1] px-2 py-0.5 rounded-full font-semibold min-w-[28px] text-center">
            {matchingCount}
          </span>
        )}
      </Button>

      {/* Filter Panel */}
      {isOpen && (
        <div
          className="fixed top-16 left-2 sm:left-4 w-80 max-h-[70vh] overflow-y-auto backdrop-blur-xl border-2 rounded-2xl shadow-2xl animate-fade-in z-50"
          style={{
            background: 'rgba(20, 43, 79, 0.98)',
            borderColor: 'rgba(52, 224, 161, 0.3)',
            boxShadow: '0 0 30px rgba(52, 224, 161, 0.2)',
          }}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 backdrop-blur-xl border-b" style={{ 
            background: 'rgba(14, 27, 63, 0.9)', 
            borderColor: 'rgba(52, 224, 161, 0.2)' 
          }}>
            <div className="flex items-center justify-between p-4">
              <h3 className="text-lg font-semibold text-[#F5F5F5] font-playfair">
                Filtres
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#EAD7B5] hover:text-[#34E0A1] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full px-4 pb-3 text-sm text-[#34E0A1] hover:text-[#3ffab8] transition-colors text-left font-inter"
              >
                ✕ Effacer tous les filtres
              </button>
            )}
          </div>

          {/* Religions Section */}
          <div className="p-4 border-b" style={{ borderColor: 'rgba(52, 224, 161, 0.1)' }}>
            <h4 className="text-sm font-semibold text-[#EAD7B5] mb-3 font-inter">
              Par Religion
            </h4>
            <div className="space-y-2">
              {religions.map((religion) => {
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
          </div>

          {/* Monument Types Section */}
          <div className="p-4">
            <h4 className="text-sm font-semibold text-[#EAD7B5] mb-3 font-inter">
              Par Type de Monument
            </h4>
            <div className="space-y-2">
              {monumentTypes.map((type) => {
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
          </div>
        </div>
      )}
    </div>
  );
};

export default MonumentFilter;
