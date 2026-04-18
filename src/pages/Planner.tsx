import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { ArrowLeft, MapPin, Plus, Route as RouteIcon, Save, Cross } from 'lucide-react';
import { toast } from 'sonner';
import ItineraryGlobe3D from '@/components/ItineraryGlobe3D';
import BottomNavigation from '@/components/BottomNavigation';
import { Logo } from '@/components/ui/logo';
import { getImagesByCountry } from '@/lib/religionImageHelper';

// Sample sacred Christian places in France for the cinematic globe arc
const SAMPLE_PLACES = [
  { id: 'mont-saint-michel', name: 'Mont-Saint-Michel', lat: 48.636, lng: -1.511 },
  { id: 'notre-dame', name: 'Notre-Dame de Paris', lat: 48.853, lng: 2.349 },
  { id: 'chartres', name: 'Chartres', lat: 48.447, lng: 1.487 },
  { id: 'lourdes', name: 'Lourdes', lat: 43.097, lng: -0.046 },
];

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

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'glass' | 'cta';
}

const ActionButton = ({ icon, label, onClick, variant = 'glass' }: ActionButtonProps) => {
  if (variant === 'cta') {
    return (
      <button
        onClick={onClick}
        className="group relative w-full overflow-hidden rounded-2xl px-6 py-4 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: 'linear-gradient(135deg, #F4C542 0%, #E0A84C 50%, #C9882B 100%)',
          boxShadow:
            '0 0 30px rgba(244, 197, 66, 0.5), 0 0 60px rgba(224, 168, 76, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex items-center justify-center gap-3 text-[#0E1B3F]">
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
        background:
          'linear-gradient(135deg, rgba(20, 43, 79, 0.7) 0%, rgba(14, 27, 63, 0.85) 100%)',
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

const Planner = () => {
  const navigate = useNavigate();
  const [departure, setDeparture] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [routeDrawn, setRouteDrawn] = useState(false);

  const heroImage = useMemo(() => {
    const images = getImagesByCountry('France', 1);
    return images[0];
  }, []);

  const handleSetDeparture = () => {
    setDeparture('Paris');
    toast.success('Départ défini', { description: 'Paris sélectionné comme point de départ' });
  };

  const handleAddDestination = () => {
    const next = SAMPLE_PLACES[destinations.length % SAMPLE_PLACES.length];
    setDestinations((prev) => [...prev, next.id]);
    toast.success('Destination ajoutée', { description: next.name });
  };

  const handleDrawRoute = () => {
    if (destinations.length < 1) {
      toast.error('Ajoutez au moins une destination');
      return;
    }
    setRouteDrawn(true);
    toast.success('Parcours tracé', { description: 'Visualisez votre voyage sacré' });
  };

  const handleSave = () => {
    toast.success('Trajet enregistré ✨', {
      description: 'Votre pèlerinage est prêt',
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
      <div className="absolute inset-0 opacity-70">
        <ItineraryGlobe3D
          places={SAMPLE_PLACES}
          autoRotateSpeed={0.4}
          latLngToVector3={latLngToVector3}
          createArcPoints={createArcPoints}
        />
      </div>

      {/* Hero photo overlay (Mont-Saint-Michel) */}
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
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-colors hover:bg-white/10"
            style={{
              background: 'rgba(14, 27, 63, 0.6)',
              border: '1px solid rgba(244, 197, 66, 0.25)',
            }}
            aria-label="Retour"
          >
            <ArrowLeft className="h-5 w-5 text-[#F4C542]" />
          </button>
          <Logo variant="main" size="small" effect="glow" />
          <div className="w-10" aria-hidden />
        </header>

        {/* Title block */}
        <div className="flex flex-col items-center px-6 pt-6 text-center">
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
            style={{
              filter: 'drop-shadow(0 0 8px rgba(244, 197, 66, 0.5))',
            }}
          >
            ✦ Vers un lieu sacré ✦
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex-1 flex flex-col justify-end px-5 pb-28 sm:px-8 sm:pb-32">
          <div className="mx-auto w-full max-w-md space-y-3">
            <ActionButton
              icon={<MapPin className="h-4 w-4" />}
              label={departure ? `Départ : ${departure}` : 'Définir un départ'}
              onClick={handleSetDeparture}
            />
            <ActionButton
              icon={<Plus className="h-4 w-4" />}
              label={
                destinations.length > 0
                  ? `Ajouter une destination (${destinations.length})`
                  : 'Ajouter une destination'
              }
              onClick={handleAddDestination}
            />
            <ActionButton
              icon={<RouteIcon className="h-4 w-4" />}
              label={routeDrawn ? 'Parcours tracé ✓' : 'Tracer le parcours'}
              onClick={handleDrawRoute}
            />
            <div className="pt-2">
              <ActionButton
                icon={<Save className="h-5 w-5" />}
                label="Enregistrer le trajet"
                onClick={handleSave}
                variant="cta"
              />
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Planner;
