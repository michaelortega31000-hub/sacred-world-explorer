// Comparison panel — 3 distinct design directions for the SacredWorld emblem.
// Visit /logo-iterations to see them side-by-side and pick a direction.

import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SacredEmblem } from '@/components/quest/SacredEmblem';

// ============================================================================
// Variant B — "Cathedral Rose"
// Inspired by stained-glass rose windows. Geometric, symmetric, architectural.
// 8-fold radial symmetry, no figure — sacred geometry replaces anthropomorphism.
// ============================================================================
const RoseVariant = ({ size = 188 }: { size?: number }) => {
  const PETAL_COUNT = 8;
  const angles = Array.from({ length: PETAL_COUNT }, (_, i) => (i * 360) / PETAL_COUNT);

  return (
    <svg viewBox="0 0 240 240" width={size} height={size} role="img" aria-label="Cathedral Rose">
      <defs>
        <radialGradient id="rose-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(244,197,66,0.50)" />
          <stop offset="60%" stopColor="rgba(244,197,66,0.18)" />
          <stop offset="100%" stopColor="rgba(244,197,66,0)" />
        </radialGradient>
        <linearGradient id="rose-petal" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,234,170,0.95)" />
          <stop offset="100%" stopColor="rgba(244,168,40,0.55)" />
        </linearGradient>
        <radialGradient id="rose-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE9A3" />
          <stop offset="100%" stopColor="#B07A12" />
        </radialGradient>
      </defs>

      {/* Outer halo */}
      <circle cx="120" cy="120" r="118" fill="url(#rose-halo)" />

      {/* Outer ring of small triangles (sun rays) */}
      {Array.from({ length: 24 }, (_, i) => i * 15).map((a) => (
        <polygon
          key={`ray-${a}`}
          points="120,28 117,52 123,52"
          fill="rgba(244,197,66,0.65)"
          transform={`rotate(${a} 120 120)`}
        />
      ))}

      {/* Inner ring */}
      <circle cx="120" cy="120" r="78" fill="none" stroke="rgba(244,197,66,0.40)" strokeWidth="1.2" />

      {/* 8 petals — almond/vesica shapes */}
      {angles.map((a) => (
        <g key={`petal-${a}`} transform={`rotate(${a} 120 120)`}>
          <path
            d="M 120,62 C 130,82 130,108 120,118 C 110,108 110,82 120,62 Z"
            fill="url(#rose-petal)"
            stroke="rgba(255,234,170,0.55)"
            strokeWidth="0.6"
          />
        </g>
      ))}

      {/* Inner geometric ring */}
      <circle cx="120" cy="120" r="44" fill="none" stroke="rgba(255,234,170,0.55)" strokeWidth="0.8" />

      {/* Core medallion */}
      <circle cx="120" cy="120" r="36" fill="url(#rose-core)" />

      {/* Hexagram overlay on the core */}
      <g stroke="rgba(120,70,8,0.6)" strokeWidth="1" fill="none">
        <polygon points="120,90 145,128 95,128" />
        <polygon points="120,150 145,112 95,112" />
      </g>

      {/* Central jewel */}
      <circle cx="120" cy="120" r="3.6" fill="#FFF6D6" stroke="rgba(120,70,8,0.6)" strokeWidth="0.6" />
    </svg>
  );
};

// ============================================================================
// Variant C — "Pilgrim's Cross"
// Minimal, devotional. A luminous Latin cross at the center, thin sun ring,
// soft halo. Reads instantly at any size — favicon-friendly.
// ============================================================================
const CrossVariant = ({ size = 188 }: { size?: number }) => {
  return (
    <svg viewBox="0 0 240 240" width={size} height={size} role="img" aria-label="Pilgrim's Cross">
      <defs>
        <radialGradient id="cross-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(244,197,66,0.55)" />
          <stop offset="55%" stopColor="rgba(244,197,66,0.20)" />
          <stop offset="100%" stopColor="rgba(244,197,66,0)" />
        </radialGradient>
        <linearGradient id="cross-fill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF6D6" />
          <stop offset="50%" stopColor="#F4C542" />
          <stop offset="100%" stopColor="#B07A12" />
        </linearGradient>
        <filter id="cross-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer halo */}
      <circle cx="120" cy="120" r="116" fill="url(#cross-halo)" />

      {/* Thin sun ring — short, subtle ticks instead of rays */}
      {Array.from({ length: 36 }, (_, i) => i * 10).map((a) => (
        <line
          key={`tick-${a}`}
          x1="120"
          y1="34"
          x2="120"
          y2="44"
          stroke="rgba(244,197,66,0.55)"
          strokeWidth="1.4"
          strokeLinecap="round"
          transform={`rotate(${a} 120 120)`}
        />
      ))}

      {/* Outer ring — very thin */}
      <circle cx="120" cy="120" r="64" fill="none" stroke="rgba(244,197,66,0.35)" strokeWidth="0.8" />

      {/* Inner halo glow */}
      <circle cx="120" cy="120" r="56" fill="rgba(244,197,66,0.10)" />

      {/* Latin cross — luminous */}
      <g
        fill="url(#cross-fill)"
        stroke="rgba(255,234,170,0.85)"
        strokeWidth="0.8"
        strokeLinejoin="round"
        filter="url(#cross-glow)"
      >
        {/* Vertical bar */}
        <rect x="115" y="74" width="10" height="80" rx="2" />
        {/* Horizontal bar — placed at upper third */}
        <rect x="92" y="100" width="56" height="10" rx="2" />
      </g>

      {/* Tiny central jewel at the crossing */}
      <circle cx="120" cy="105" r="2.4" fill="#FFF6D6" />
    </svg>
  );
};

// ============================================================================
// Page — comparison panel
// ============================================================================
const VARIANTS = [
  {
    id: 'A',
    name: 'Pilgrim\'s Sun',
    pitch: 'Joyful & anthropocentric',
    note: 'A worshipper figure with arms raised in a V, set against an organic asymmetric sunburst. Spiritual, warm, human-centered.',
    Component: SacredEmblem,
  },
  {
    id: 'B',
    name: 'Cathedral Rose',
    pitch: 'Architectural & timeless',
    note: 'Inspired by stained-glass rose windows. 8-fold radial symmetry, sacred geometry, no figure. Reads as patrimony, not a person.',
    Component: RoseVariant,
  },
  {
    id: 'C',
    name: 'Pilgrim\'s Cross',
    pitch: 'Minimal & devotional',
    note: 'A luminous Latin cross over a thin sun ring and soft halo. Instantly readable at any size — works as favicon, app icon, watermark.',
    Component: CrossVariant,
  },
];

const LogoIterations = () => {
  return (
    <div className="cathedral-rose-bg min-h-screen relative">
      <header className="px-4 pt-6 pb-4 max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/welcome" className="inline-flex items-center gap-2 text-amber-200/80 hover:text-amber-100 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
        <h1 className="font-cinzel text-xl text-amber-100 tracking-wide">Logo iterations</h1>
        <div className="w-16" />
      </header>

      <main className="px-4 pb-16 max-w-6xl mx-auto">
        <p className="text-center text-white/60 text-sm mb-10 max-w-xl mx-auto">
          Three distinct directions for the SacredWorld emblem. Each is a pure SVG — no rectangular asset frame, vector-clean at any size.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {VARIANTS.map((v) => {
            const Emblem = v.Component;
            return (
              <article
                key={v.id}
                className="cg-lead rounded-2xl p-6 flex flex-col items-center text-center gap-4"
              >
                {/* Variant label */}
                <div className="flex items-center gap-2 self-start">
                  <span
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full
                               bg-amber-300/15 border border-amber-300/40 text-amber-200 text-xs font-bold"
                  >
                    {v.id}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-amber-200/80">
                    {v.pitch}
                  </span>
                </div>

                {/* Emblem stage — dark backdrop to test contrast */}
                <div
                  className="w-full aspect-square rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 40%, rgba(15,15,28,1) 0%, rgba(7,7,15,1) 100%)',
                    border: '1px solid rgba(244,197,66,0.10)',
                  }}
                >
                  <Emblem size={188} />
                </div>

                {/* Tiny preview — favicon scale */}
                <div className="flex items-center gap-3 self-start">
                  <span className="text-[10px] uppercase tracking-wider text-white/45">@32px</span>
                  <Emblem size={32} />
                  <span className="text-[10px] uppercase tracking-wider text-white/45">@48px</span>
                  <Emblem size={48} />
                </div>

                {/* Name + description */}
                <div className="text-left w-full">
                  <h2 className="font-cinzel text-lg text-amber-50 mb-1">{v.name}</h2>
                  <p className="text-[12.5px] text-white/65 leading-relaxed">{v.note}</p>
                </div>
              </article>
            );
          })}
        </div>

        <p className="text-center text-[11px] text-white/40 mt-10">
          Tell me which direction speaks — A, B, or C — and I'll wire it through the app.
        </p>
      </main>
    </div>
  );
};

export default LogoIterations;
