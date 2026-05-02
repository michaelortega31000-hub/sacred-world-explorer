import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Compass, Award, Coins, Star } from 'lucide-react';
import type { Track } from '@/types/track';

// 2D stylized globe preview with a colored "spiritual overlay" — glowing
// auras at sacred sites, badge medallions, blessing tokens, skill nodes.
// Tapping a marker selects it and surfaces a one-line description.
// The full 3D experience lives at /explore.

interface Marker {
  id: string;
  type: 'badge' | 'token' | 'skill';
  // x/y in % (0..100) on the projected world map.
  x: number;
  y: number;
  label: string;
  hint: string;
  track?: Track | 'common';
}

const MARKERS: Marker[] = [
  { id: 'rome',          type: 'badge', x: 52, y: 50, label: 'Rome',           hint: 'Saint-Pierre · 2 quêtes ouvertes', track: 'catholic' },
  { id: 'jerusalem',     type: 'badge', x: 60, y: 56, label: 'Jérusalem',      hint: 'Saint-Sépulcre · récit partagé',    track: 'common' },
  { id: 'mont-stm',      type: 'badge', x: 47, y: 44, label: 'Mont-St-Michel', hint: 'Bonus distance × 2.4',              track: 'catholic' },
  { id: 'wittenberg',    type: 'token', x: 51, y: 40, label: 'Wittenberg',     hint: '« 95 thèses » à débloquer',         track: 'protestant' },
  { id: 'iona',          type: 'token', x: 44, y: 36, label: 'Iona',           hint: 'Token de pèlerin celte',            track: 'common' },
  { id: 'mt-athos',      type: 'skill', x: 57, y: 47, label: 'Mont-Athos',     hint: 'Skill orthodoxe : Hesychasme',      track: 'orthodox' },
  { id: 'compostelle',   type: 'badge', x: 44, y: 50, label: 'Compostelle',    hint: 'Chemin · 3 étapes franchies',       track: 'common' },
  { id: 'lourdes',       type: 'token', x: 47, y: 52, label: 'Lourdes',        hint: 'Token de grâce',                    track: 'catholic' },
  { id: 'antakya',       type: 'skill', x: 60, y: 50, label: 'Antakya',        hint: 'Skill : Pères de l\'Église',         track: 'orthodox' },
];

const TYPE_META: Record<Marker['type'], { color: string; halo: string; Icon: typeof Award; label: string }> = {
  badge: { color: '#F4C542', halo: 'rgba(244,197,66,0.55)', Icon: Award, label: 'badge' },
  token: { color: '#7DD3FC', halo: 'rgba(125,211,252,0.55)', Icon: Coins, label: 'token' },
  skill: { color: '#C084FC', halo: 'rgba(192,132,252,0.55)', Icon: Star,  label: 'skill' },
};

interface Props {
  onExplore: () => void;
  // Horizon mode: wider letterbox, only the user's nearest few sites, stronger
  // "go to the real globe" affordance. Used on the home page so the mini-globe
  // stops competing for attention with everything else on the screen.
  compact?: boolean;
  // x/y % center the horizon zooms around (defaults to Paris-ish if omitted).
  focusX?: number;
  focusY?: number;
  // How many markers to show in compact mode.
  maxMarkers?: number;
}

export const SpiritualGlobe = ({
  onExplore,
  compact = false,
  focusX = 49,
  focusY = 46,
  maxMarkers = 3,
}: Props) => {
  const [selected, setSelected] = useState<Marker | null>(null);

  // In compact mode, surface the markers closest to the focus point so the
  // home preview feels local + intimate.
  const visibleMarkers = compact
    ? [...MARKERS]
        .map((m) => ({ m, d: Math.hypot(m.x - focusX, m.y - focusY) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, maxMarkers)
        .map(({ m }) => m)
    : MARKERS;

  const counts = {
    badge: MARKERS.filter(m => m.type === 'badge').length,
    token: MARKERS.filter(m => m.type === 'token').length,
    skill: MARKERS.filter(m => m.type === 'skill').length,
  };

  return (
    <Card className="hub-card-glow relative overflow-hidden bg-gradient-to-br from-[#0c1a3e]/80 to-[#020716]/85 backdrop-blur-md border-white/10 p-3">
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-300" />
          <h2 className="text-[13px] font-semibold text-white tracking-wide">Globe spirituel</h2>
        </div>
        <button
          onClick={onExplore}
          className="text-[11px] text-amber-200 hover:text-amber-100 transition-colors px-2 py-1 rounded-md hover:bg-white/5"
        >
          Explorer →
        </button>
      </div>

      {/* The 2D globe canvas — wider letterbox in compact mode, square-ish otherwise */}
      <div
        className={`relative ${compact ? 'aspect-[16/6]' : 'aspect-[16/10]'} rounded-xl overflow-hidden bg-[radial-gradient(120%_80%_at_50%_30%,#0a234d_0%,#020716_70%)] border border-white/5`}
        style={
          compact
            ? {
                // Visually zoom by translating the SVG world so the focus point sits centered
                // and a tighter slice is shown. Achieved via background-position-like offset on the svg.
              }
            : undefined
        }
      >
        {/* Subtle starfield */}
        <div
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(1px 1px at 12% 18%, #fff 30%, transparent 31%),' +
              'radial-gradient(1px 1px at 64% 8%, #fff 30%, transparent 31%),' +
              'radial-gradient(1.4px 1.4px at 82% 28%, #fff 30%, transparent 31%),' +
              'radial-gradient(1px 1px at 22% 78%, #fff 30%, transparent 31%),' +
              'radial-gradient(1.2px 1.2px at 88% 70%, #fff 30%, transparent 31%),' +
              'radial-gradient(1px 1px at 36% 90%, #fff 30%, transparent 31%)',
            backgroundSize: '100% 100%',
          }}
        />

        {/* Stylized world (decorative continents — equirectangular-ish blobs) */}
        <svg
          viewBox="0 0 1000 600"
          className="absolute inset-0 w-full h-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="continent" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(120,170,220,0.25)" />
              <stop offset="100%" stopColor="rgba(70,110,160,0.15)" />
            </linearGradient>
          </defs>
          <g fill="url(#continent)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8">
            {/* North America */}
            <path d="M120,160 Q90,200 110,260 Q140,320 200,330 Q230,300 250,250 Q235,200 220,170 Q190,130 160,140 Z" />
            {/* South America */}
            <path d="M260,360 Q245,420 270,500 Q300,540 320,510 Q340,440 320,380 Q300,355 280,355 Z" />
            {/* Europe */}
            <path d="M460,200 Q445,230 470,260 Q510,275 540,250 Q545,215 525,195 Q495,180 470,190 Z" />
            {/* Africa */}
            <path d="M470,300 Q455,360 480,440 Q515,490 555,470 Q580,400 565,330 Q540,290 510,295 Z" />
            {/* Asia */}
            <path d="M560,180 Q570,230 620,250 Q700,260 770,230 Q820,200 810,170 Q740,140 670,150 Q600,160 560,170 Z" />
            {/* India */}
            <path d="M650,290 Q640,340 660,360 Q690,355 695,320 Q685,295 670,285 Z" />
            {/* SE Asia / archipelago */}
            <path d="M780,310 Q790,350 830,355 Q870,340 870,310 Q830,295 800,300 Z" />
            {/* Oceania */}
            <path d="M820,420 Q810,460 850,470 Q900,460 905,430 Q870,410 830,415 Z" />
          </g>

          {/* faint meridians */}
          <g stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" fill="none">
            <ellipse cx="500" cy="300" rx="450" ry="280" />
            <ellipse cx="500" cy="300" rx="350" ry="280" />
            <ellipse cx="500" cy="300" rx="220" ry="280" />
            <line x1="50"  y1="300" x2="950" y2="300" />
            <line x1="500" y1="20"  x2="500" y2="580" />
          </g>
        </svg>

        {/* Spiritual overlay — auras */}
        {visibleMarkers.map((m) => {
          const meta = TYPE_META[m.type];
          return (
            <span
              key={m.id + '_aura'}
              aria-hidden
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${m.x}%`, top: `${m.y}%`,
                width: 80, height: 80,
                marginLeft: -40, marginTop: -40,
                background: `radial-gradient(circle, ${meta.halo} 0%, transparent 65%)`,
                opacity: 0.85,
                animation: 'hub-breath 4s ease-in-out infinite',
                animationDelay: `${(parseInt(m.id, 36) % 7) * 0.2}s`,
              }}
            />
          );
        })}

        {/* Markers */}
        {visibleMarkers.map((m) => {
          const meta = TYPE_META[m.type];
          const isSel = selected?.id === m.id;
          const Icon = meta.Icon;
          return (
            <button
              key={m.id}
              onClick={() => setSelected(isSel ? null : m)}
              aria-label={`${meta.label} : ${m.label}`}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 rounded-full
                         flex items-center justify-center transition-transform
                         ${isSel ? 'scale-125' : 'hover:scale-110'} active:scale-95`}
              style={{
                left: `${m.x}%`, top: `${m.y}%`,
                width: 22, height: 22,
                background: `linear-gradient(135deg, ${meta.color}, ${meta.color}aa)`,
                boxShadow: `0 0 14px ${meta.halo}, 0 0 0 1.5px ${meta.color}, 0 0 0 3px rgba(0,0,0,0.4)`,
                color: '#000',
              }}
            >
              <Icon className="w-3 h-3" strokeWidth={2.5} />
            </button>
          );
        })}

        {/* Selection callout */}
        {selected && (
          <div
            className="absolute z-20 px-3 py-2 rounded-lg
                       bg-black/75 backdrop-blur-md border text-white text-[11px]
                       hub-rank-rise pointer-events-none"
            style={{
              left: `${Math.min(78, Math.max(2, selected.x - 8))}%`,
              top: `${Math.max(2, selected.y - 18)}%`,
              borderColor: TYPE_META[selected.type].color + '70',
              boxShadow: `0 0 14px ${TYPE_META[selected.type].halo}`,
            }}
          >
            <div className="flex items-center gap-1.5 font-semibold" style={{ color: TYPE_META[selected.type].color }}>
              <span className="uppercase tracking-wider text-[9px]">{TYPE_META[selected.type].label}</span>
              <span className="text-white">· {selected.label}</span>
            </div>
            <div className="text-white/80 leading-snug mt-0.5">{selected.hint}</div>
          </div>
        )}
      </div>

      {/* In compact mode the legend is replaced by an explicit "go bigger" CTA. */}
      {compact ? (
        <button
          onClick={onExplore}
          className="mt-2 w-full rounded-lg border border-amber-300/25
                     bg-gradient-to-r from-amber-300/10 via-white/0 to-amber-300/10
                     hover:from-amber-300/20 hover:to-amber-300/20
                     text-amber-100 text-[11.5px] py-1.5 transition-colors
                     flex items-center justify-center gap-1.5"
        >
          Plus de lieux dans le monde
          <span aria-hidden>→</span>
        </button>
      ) : (
        <div className="flex items-center justify-between mt-3 text-[11px] px-1">
          <LegendChip color={TYPE_META.badge.color} icon={Award} label="Badges" count={counts.badge} />
          <LegendChip color={TYPE_META.token.color} icon={Coins} label="Tokens" count={counts.token} />
          <LegendChip color={TYPE_META.skill.color} icon={Star}  label="Skills" count={counts.skill} />
        </div>
      )}
    </Card>
  );
};

const LegendChip = ({ color, icon: Icon, label, count }: { color: string; icon: typeof Award; label: string; count: number }) => (
  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/10">
    <span
      className="w-3 h-3 rounded-full inline-flex items-center justify-center"
      style={{ background: color, boxShadow: `0 0 6px ${color}90` }}
    >
      <Icon className="w-2 h-2 text-black" strokeWidth={3} />
    </span>
    <span className="text-white/80">{label}</span>
    <span className="font-semibold text-white tabular-nums">{count}</span>
  </div>
);
