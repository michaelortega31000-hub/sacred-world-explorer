import type { Track } from '@/types/track';

interface Props {
  track: Track | null;
  size?: number;
  glow?: boolean;
}

// Custom SVG emblems per tradition. Faith-respectful, simple, recognisable.
// Catholic — Latin cross with rays.
// Protestant — open Bible.
// Orthodox — Byzantine three-bar cross.
// Heritage — Romanesque arch / column motif.

export const TrackEmblem = ({ track, size = 40, glow = true }: Props) => {
  const accent = colorFor(track);
  const glowStyle = glow
    ? { filter: `drop-shadow(0 0 6px ${accent}80) drop-shadow(0 0 14px ${accent}40)` }
    : undefined;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${accent}30 0%, transparent 70%)`,
        }}
      />
      <svg
        viewBox="0 0 48 48"
        width={size * 0.62}
        height={size * 0.62}
        style={glowStyle}
      >
        {renderEmblem(track, accent)}
      </svg>
    </div>
  );
};

function colorFor(t: Track | null): string {
  if (t === 'catholic')   return '#F4C542';   // gold
  if (t === 'protestant') return '#7DB6FF';   // open-sky blue
  if (t === 'orthodox')   return '#D4AF37';   // byzantine deep-gold
  return '#C9A86A';                            // stone gold (heritage)
}

function renderEmblem(t: Track | null, accent: string) {
  if (t === 'catholic') {
    return (
      <g fill="none" stroke={accent} strokeWidth="2.4" strokeLinecap="round">
        {/* rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <line key={i}
            x1="24" y1="6" x2="24" y2="2"
            transform={`rotate(${deg} 24 24)`}
            opacity={i % 2 ? 0.45 : 0.7}
          />
        ))}
        {/* latin cross */}
        <path d="M24 12 L24 38 M16 22 L32 22" strokeWidth="3.4" />
      </g>
    );
  }
  if (t === 'protestant') {
    return (
      <g fill="none" stroke={accent} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        {/* open bible */}
        <path d="M6 14 Q14 12 24 16 Q34 12 42 14 L42 36 Q34 33 24 36 Q14 33 6 36 Z" />
        <line x1="24" y1="16" x2="24" y2="36" />
        {/* small cross above */}
        <path d="M24 4 L24 10 M21 7 L27 7" strokeWidth="1.8" />
      </g>
    );
  }
  if (t === 'orthodox') {
    return (
      <g fill="none" stroke={accent} strokeWidth="2.4" strokeLinecap="round">
        {/* three-bar cross */}
        <path d="M24 6 L24 42" strokeWidth="3" />
        <path d="M16 14 L32 14" strokeWidth="2.2" />
        <path d="M14 22 L34 22" strokeWidth="3" />
        <path d="M16 32 L32 28" strokeWidth="2.2" />
      </g>
    );
  }
  // heritage — simple romanesque arch + column
  return (
    <g fill="none" stroke={accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 38 L10 22 Q10 10 24 10 Q38 10 38 22 L38 38" />
      <path d="M6 42 L42 42" />
      <path d="M16 38 L16 22 M32 38 L32 22" strokeWidth="1.4" opacity="0.6" />
    </g>
  );
}
