import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { ArrowLeft, MapPin, Plus, Route as RouteIcon, Save, Cross, X } from 'lucide-react';
import { toast } from 'sonner';
import ItineraryGlobe3D from '@/components/ItineraryGlobe3D';
import BottomNavigation from '@/components/BottomNavigation';
import { Logo } from '@/components/ui/logo';
import { getImagesByCountry } from '@/lib/religionImageHelper';
import PlaceSelectorModal, { type SelectedPlace } from '@/components/planner/PlaceSelectorModal';
import { useApp } from '@/contexts/AppContext';

// Convert lat/lng to 3D vector on the unit sphere
const latLngToVector3 = (lat: number, lng: number, radius = 1) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

// Build a curved arc between two points on the globe
const createArcPoints = (start: THREE.Vector3, end: THREE.Vector3, segments = 50) => {
  const points: THREE.Vector3[] = [];
  const mid = start.clone().add(end).multiplyScalar(0.5);
  const dist = start.distanceTo(end);
  mid.normalize().multiplyScalar(1 + dist * 0.3);
  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  for (let i = 0; i <= segments; i++) {
    points.push(curve.getPoint(i / segments));
  }
  return points;
};

// Default empty-state markers (softly highlight France)
const EMPTY_PLACES = [
  { id: 'placeholder-fr', name: 'France', lat: 46.6, lng: 2.5 },
];

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'glass' | 'cta';
  disabled?: boolean;
}

const ActionButton = ({ icon, label, onClick, variant = 'glass', disabled = false }: ActionButtonProps) => {
  if (variant === 'cta') {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="group relative w-full overflow-hidden rounded-2xl px-6 py-4 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 enabled:hover:scale-[1.02] enabled:active:scale-[0.98]"
        style={{
          background: disabled
            ? 'linear-gradient(135deg, #2a3a5c 0%, #1f2c47 100%)'
            : 'linear-gradient(135deg, #F4C542 0%, #E0A84C 50%, #C9882B 100%)',
          boxShadow: disabled
            ? 'none'
            : '0 0 30px rgba(244, 197, 66, 0.5), 0 0 60px rgba(224, 168, 76, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
        }}
      >
        {!disabled && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
        <div className={`relative flex items-center justify-center gap-3 ${disabled ? 'text-white/60' : 'text-[#0E1B3F]'}`}>
          <Cross className="w-4 h-4 opacity-70" strokeWidth={2.5} />
          {icon}
          <span className="text-base font-semibold tracking-wide">{label}</span>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-2xl px-5 py-3.5 text-left transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
      style={{
        background: 'linear-gradient(135deg, rgba(20, 43, 79, 0.7) 0%, rgba(14, 27, 63, 0.85) 100%)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(244, 197, 66, 0.25)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(244, 197, 66, 0.1)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#F4C542]/0 via-[#F4C542]/10 to-[#F4C542]/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{
            background: 'rgba(244, 197, 66, 0.12)',
            border: '1px solid rgba(244, 197, 66, 0.3)',
          }}
        >
          <div className="text-[#F4C542]">{icon}</div>
        </div>
        <span className="flex-1 text-sm font-medium text-white/95">{label}</span>
        <Cross className="w-3.5 h-3.5 text-[#F4C542]/40" strokeWidth={2} />
      </div>
    </button>
  );
};

type SelectionMode = 'departure' | 'destination' | null;

const Planner = () => {
  const navigate = useNavigate();
  const { reorderTrip } = useApp();
  const [departure, setDeparture] = useState<SelectedPlace | null>(null);
  const [destinations, setDestinations] = useState<SelectedPlace[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<SelectionMode>(null);
  const [tripSaved, setTripSaved] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('sacred-saved-trip');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.departure) setDeparture(parsed.departure);
      if (Array.isArray(parsed?.destinations)) setDestinations(parsed.destinations);
      if (parsed?.departure && parsed?.destinations?.length) setTripSaved(true);
    } catch {
      // ignore
    }
  }, []);

  const heroImage = useMemo(() => {
    const images = getImagesByCountry('France', 1);
    return images[0];
  }, []);

  // Live globe markers/arcs from real selection
  const globePlaces = useMemo(() => {
    const all = [departure, ...destinations].filter(Boolean) as SelectedPlace[];
    if (all.length === 0) return EMPTY_PLACES;
    return all.map((p) => ({ id: p.placeId, name: p.name, lat: p.lat, lng: p.lng }));
  }, [departure, destinations]);

  const openSelector = (m: SelectionMode) => {
    setMode(m);
    setModalOpen(true);
  };

  const handleSelect = (place: SelectedPlace) => {
    if (mode === 'departure') {
      setDeparture(place);
      toast.success('Départ défini', { description: `${place.name}, ${place.city}` });
    } else if (mode === 'destination') {
      setDestinations((prev) => [...prev, place]);
      toast.success('Destination ajoutée', { description: `${place.name}, ${place.city}` });
    }
    setMode(null);
    setTripSaved(false);
  };

  const removeDestination = (idx: number) => {
    setDestinations((prev) => prev.filter((_, i) => i !== idx));
    setTripSaved(false);
  };

  const clearDeparture = () => {
    setDeparture(null);
    setTripSaved(false);
  };

  const canSave = !!departure && destinations.length >= 1;

  const handleSave = () => {
    if (!canSave) {
      toast.error('Définissez un départ et au moins une destination');
      return;
    }
    setTripSaved(true);
    try {
      localStorage.setItem(
        'sacred-saved-trip',
        JSON.stringify({
          departure,
          destinations,
          savedAt: new Date().toISOString(),
        })
      );
      // Notify other tabs/components in the same window
      window.dispatchEvent(new CustomEvent('sacred-saved-trip-updated'));
      // Sync trip place IDs into userProgress so "Mon itinéraire" picks them up
      const ids = [departure!.placeId, ...destinations.map((d) => d.placeId)].filter(Boolean);
      if (ids.length) reorderTrip(ids);
    } catch {
      // ignore quota errors
    }
    toast.success('Trajet enregistré ✨', {
      description: `${departure!.city} → ${destinations.length} étape(s)`,
    });
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at center, #142B4F 0%, #0E1B3F 50%, #0A1628 100%)',
      }}
    >
      {/* 3D Globe background */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${tripSaved ? 'opacity-95' : 'opacity-80'}`}>
        <ItineraryGlobe3D
          places={globePlaces}
          autoRotateSpeed={0.4}
          latLngToVector3={latLngToVector3}
          createArcPoints={createArcPoints}
          enhanced
          tripSaved={tripSaved}
        />
      </div>

      {/* Hero photo overlay */}
      {heroImage && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'overlay',
            opacity: 0.25,
            maskImage:
              'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)',
          }}
        />
      )}

      {/* Vignette + golden ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(244, 197, 66, 0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(10, 22, 40, 0.6) 0%, transparent 60%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-6 pb-2 sm:px-6">
          <div className="w-10" aria-hidden />
          <div className="inline-block scale-[1.18] origin-center">
            <Logo variant="main" size="small" effect="glow" />
          </div>
          <div className="w-10" aria-hidden />
        </header>

        {/* Title block - lowered for breathing room */}
        <div className="flex flex-col items-center px-6 pt-16 sm:pt-20 text-center">
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{
              background:
                'linear-gradient(135deg, #FFFFFF 0%, #F4C542 60%, #E0A84C 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 2px 12px rgba(244, 197, 66, 0.3))',
            }}
          >
            Planifier un trajet
          </h1>
          <p
            className="mt-2 text-sm font-medium tracking-wide text-[#F4C542]/85"
            style={{ filter: 'drop-shadow(0 0 8px rgba(244, 197, 66, 0.5))' }}
          >
            ✦ Vers un lieu sacré ✦
          </p>
        </div>

        {/* Action panel */}
        <div className="flex-1 flex flex-col justify-end px-5 pb-28 sm:px-8 sm:pb-32">
          <div className="mx-auto w-full max-w-md space-y-3">
            {/* Selected chips */}
            {(departure || destinations.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-1">
                {departure && (
                  <Chip
                    label={`Départ : ${departure.city}`}
                    onRemove={clearDeparture}
                    accent
                  />
                )}
                {destinations.map((d, i) => (
                  <Chip
                    key={`${d.placeId}-${i}`}
                    label={d.city}
                    onRemove={() => removeDestination(i)}
                  />
                ))}
              </div>
            )}

            <ActionButton
              icon={<MapPin className="h-4 w-4" />}
              label={departure ? `Départ : ${departure.name}` : 'Définir un départ'}
              onClick={() => openSelector('departure')}
            />
            <ActionButton
              icon={<Plus className="h-4 w-4" />}
              label={
                destinations.length > 0
                  ? `Ajouter une destination (${destinations.length})`
                  : 'Ajouter une destination'
              }
              onClick={() => openSelector('destination')}
            />
            <ActionButton
              icon={<RouteIcon className="h-4 w-4" />}
              label={
                canSave
                  ? `Parcours : ${destinations.length + 1} étapes`
                  : 'Définissez un départ + une destination'
              }
              onClick={() => {
                if (canSave) {
                  toast.success('Parcours tracé', { description: 'Visualisé sur le globe' });
                } else {
                  toast.error('Sélectionnez au moins un départ et une destination');
                }
              }}
            />
            <div className="pt-2">
              <ActionButton
                icon={<Save className="h-5 w-5" />}
                label="Enregistrer le trajet"
                onClick={handleSave}
                variant="cta"
                disabled={!canSave}
              />
            </div>
          </div>
        </div>
      </div>

      <PlaceSelectorModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSelect={handleSelect}
        title={mode === 'departure' ? 'Choisir un point de départ' : 'Ajouter une destination'}
      />

      <BottomNavigation />
    </div>
  );
};

const Chip = ({ label, onRemove, accent = false }: { label: string; onRemove: () => void; accent?: boolean }) => (
  <div
    className="inline-flex items-center gap-1.5 rounded-full pl-3 pr-1.5 py-1 text-xs font-medium"
    style={{
      background: accent ? 'rgba(244,197,66,0.15)' : 'rgba(20,43,79,0.7)',
      border: `1px solid ${accent ? 'rgba(244,197,66,0.5)' : 'rgba(244,197,66,0.25)'}`,
      color: accent ? '#F4C542' : 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(8px)',
    }}
  >
    <span className="truncate max-w-[160px]">{label}</span>
    <button
      onClick={onRemove}
      className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-white/10"
      aria-label="Retirer"
    >
      <X className="h-3 w-3" />
    </button>
  </div>
);

export default Planner;
