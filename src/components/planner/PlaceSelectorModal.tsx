import { useMemo, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Search, MapPin, Cross } from 'lucide-react';
import { getPlacesByCountry, getAllCountries, getContinent } from '@/data/placesData';
import type { Place } from '@/contexts/AppContext';

export type SelectedPlace = {
  placeId: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (place: SelectedPlace) => void;
  title?: string;
  /** When provided, jumps directly to step 3 for that country */
  initialCountry?: string | null;
};

const CONTINENTS = [
  { id: 'Europe', label: 'Europe', emoji: '🇪🇺' },
  { id: 'Amérique du Nord', label: 'Amérique du Nord', emoji: '🌎' },
  { id: 'Amérique du Sud', label: 'Amérique du Sud', emoji: '🌎' },
  { id: 'Asie', label: 'Asie', emoji: '🌏' },
  { id: 'Afrique', label: 'Afrique', emoji: '🌍' },
  { id: 'Océanie', label: 'Océanie', emoji: '🏝️' },
];

const SUBTITLES = {
  1: 'Choisissez un continent',
  2: 'Choisissez un pays',
  3: 'Choisissez un lieu sacré',
} as const;

const PlaceSelectorModal = ({ open, onOpenChange, onSelect, title = 'Sélectionner un lieu', initialCountry }: Props) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [continent, setContinent] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Reset / jump on open
  useEffect(() => {
    if (!open) return;
    if (initialCountry) {
      setCountry(initialCountry);
      setContinent(getContinent(initialCountry));
      setStep(3);
    } else {
      setStep(1);
      setContinent(null);
      setCountry(null);
    }
    setSearch('');
  }, [open, initialCountry]);

  const allCountries = useMemo(() => getAllCountries(), []);

  const countriesForContinent = useMemo(() => {
    if (!continent) return [];
    const list = allCountries.filter((c) => getContinent(c) === continent);
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((c) => c.toLowerCase().includes(q));
  }, [continent, allCountries, search]);

  const placesForCountry: Place[] = useMemo(() => {
    if (!country) return [];
    return getPlacesByCountry(country);
  }, [country]);

  const goBack = () => {
    if (step === 3) {
      setStep(2);
      setCountry(null);
      setSearch('');
    } else if (step === 2) {
      setStep(1);
      setContinent(null);
      setSearch('');
    }
  };

  const handlePickPlace = (p: Place) => {
    onSelect({
      placeId: p.id,
      name: p.name,
      city: p.city || p.country,
      country: p.country,
      lat: p.coordinates[1],
      lng: p.coordinates[0],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg max-h-[85vh] p-0 overflow-hidden border-0"
        style={{
          background: 'linear-gradient(160deg, #142B4F 0%, #0E1B3F 60%, #0A1628 100%)',
          boxShadow: '0 0 60px rgba(244,197,66,0.15), 0 20px 60px rgba(0,0,0,0.6)',
        }}
      >
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-[#F4C542]/15">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                onClick={goBack}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#F4C542]/25 bg-[#0E1B3F]/60 hover:bg-[#0E1B3F]/90 transition-colors"
                aria-label="Retour"
              >
                <ChevronLeft className="h-4 w-4 text-[#F4C542]" />
              </button>
            )}
            <DialogTitle className="text-white text-base font-semibold flex-1">{title}</DialogTitle>
          </div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-[#F4C542]/70 mt-2">
            <span className={step === 1 ? 'text-[#F4C542] font-semibold' : ''}>Continent</span>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className={step === 2 ? 'text-[#F4C542] font-semibold' : continent ? '' : 'opacity-40'}>
              {continent || 'Pays'}
            </span>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className={step === 3 ? 'text-[#F4C542] font-semibold' : country ? '' : 'opacity-40'}>
              {country || 'Lieu sacré'}
            </span>
          </div>
          {/* Guidance subtitle */}
          <p className="text-center text-sm text-[#F4C542]/85 mt-3 italic tracking-wide">
            ✦ {SUBTITLES[step]} ✦
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-130px)]">
          <div className="p-5">
            {/* Step 1: Continent */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {CONTINENTS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setContinent(c.id);
                      setStep(2);
                    }}
                    className="group relative overflow-hidden rounded-2xl px-4 py-6 text-center transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                    style={{
                      background: 'linear-gradient(135deg, rgba(20,43,79,0.7) 0%, rgba(14,27,63,0.85) 100%)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(244,197,66,0.25)',
                      boxShadow: 'inset 0 1px 0 rgba(244,197,66,0.1)',
                    }}
                  >
                    <div className="text-3xl mb-1.5">{c.emoji}</div>
                    <div className="text-sm font-semibold text-white/95">{c.label}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Country */}
            {step === 2 && (
              <div>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#F4C542]/60" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher un pays..."
                    className="pl-9 bg-[#0E1B3F]/60 border-[#F4C542]/25 text-white placeholder:text-white/40"
                  />
                </div>
                {countriesForContinent.length === 0 ? (
                  <div className="text-center text-white/60 text-sm py-8">
                    Aucun pays disponible.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {countriesForContinent.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCountry(c);
                          setStep(3);
                          setSearch('');
                        }}
                        className="w-full flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all hover:scale-[1.01]"
                        style={{
                          background: 'linear-gradient(135deg, rgba(20,43,79,0.6) 0%, rgba(14,27,63,0.8) 100%)',
                          border: '1px solid rgba(244,197,66,0.18)',
                        }}
                      >
                        <span className="text-sm font-medium text-white/95">{c}</span>
                        <ChevronRight className="h-4 w-4 text-[#F4C542]/60" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Place */}
            {step === 3 && (
              <div>
                {placesForCountry.length === 0 ? (
                  <div className="text-center text-white/60 text-sm py-10 px-4">
                    Aucun lieu disponible pour ce pays pour l'instant.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {placesForCountry.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handlePickPlace(p)}
                        className="w-full text-left rounded-2xl overflow-hidden transition-all hover:scale-[1.01] group"
                        style={{
                          background: 'linear-gradient(135deg, rgba(20,43,79,0.7) 0%, rgba(14,27,63,0.9) 100%)',
                          border: '1px solid rgba(244,197,66,0.22)',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                        }}
                      >
                        <div className="relative">
                          {p.imageUrl && (
                            <div
                              className="h-28 w-full bg-cover bg-center"
                              style={{ backgroundImage: `url(${p.imageUrl})` }}
                            />
                          )}
                          {/* Lieu sacré badge */}
                          <div
                            className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold"
                            style={{
                              background: 'rgba(14,27,63,0.85)',
                              backdropFilter: 'blur(8px)',
                              border: '1px solid rgba(244,197,66,0.5)',
                              color: '#F4C542',
                              boxShadow: '0 0 12px rgba(244,197,66,0.3)',
                            }}
                          >
                            <Cross className="h-3 w-3" strokeWidth={2.5} />
                            <span>Lieu sacré</span>
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-white truncate">{p.name}</h3>
                              <div className="flex items-center gap-1 text-xs text-[#F4C542]/80 mt-0.5">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{p.city}</span>
                              </div>
                            </div>
                            <span className="text-[10px] text-white/50 uppercase tracking-wider shrink-0">
                              {p.type}
                            </span>
                          </div>
                          {p.description && (
                            <p className="text-xs text-white/65 mt-2 line-clamp-2">{p.description}</p>
                          )}
                          <div
                            className="mt-3 text-center text-xs font-semibold py-1.5 rounded-lg"
                            style={{
                              background: 'linear-gradient(135deg, #F4C542 0%, #E0A84C 100%)',
                              color: '#0E1B3F',
                            }}
                          >
                            Choisir ce lieu
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PlaceSelectorModal;
