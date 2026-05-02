// Pure SVG SacredWorld emblem — no rectangular asset frame.
// A radiant cathedral sun: 16 outer rays alternating long/short, an inner
// gilded disc with a cross-aurelio centerpiece, and an outer halo.
// Designed to live on a transparent background so it can sit on
// cathedral-rose-bg without showing the navy box of the bundled PNG.

interface Props {
  size?: number;
  className?: string;
  /** When true, animates the rays with a slow breath. */
  animate?: boolean;
}

export const SacredEmblem = ({ size = 200, className = '', animate = true }: Props) => {
  // Twelve long rays + twelve short rays interleaved (24 total) — a sunburst
  // dense enough to read as a halo at small sizes.
  const RAY_COUNT = 12;
  const longRays = Array.from({ length: RAY_COUNT }, (_, i) => (i / RAY_COUNT) * 360);
  const shortRays = longRays.map((a) => a + 360 / RAY_COUNT / 2);

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`${className} ${animate ? 'sacred-emblem-breath' : ''}`}
      role="img"
      aria-label="SacredWorld emblem"
    >
      <defs>
        {/* Outer halo gradient: warm gold fading to transparent */}
        <radialGradient id="se-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="rgba(244,197,66,0.55)" />
          <stop offset="55%" stopColor="rgba(244,197,66,0.18)" />
          <stop offset="100%" stopColor="rgba(244,197,66,0.00)" />
        </radialGradient>

        {/* Inner disc gradient — rich gold with a slight ember core */}
        <radialGradient id="se-disc" cx="50%" cy="40%" r="60%">
          <stop offset="0%"  stopColor="#FFE9A3" />
          <stop offset="45%" stopColor="#F4C542" />
          <stop offset="100%" stopColor="#B07A12" />
        </radialGradient>

        {/* Ray gradient: bright tip → warm amber base */}
        <linearGradient id="se-ray" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%"  stopColor="rgba(255,234,170,0.95)" />
          <stop offset="60%" stopColor="rgba(244,197,66,0.85)" />
          <stop offset="100%" stopColor="rgba(244,197,66,0.30)" />
        </linearGradient>

        {/* Soft inner glow filter */}
        <filter id="se-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer halo */}
      <circle cx="100" cy="100" r="98" fill="url(#se-halo)" />

      {/* Long rays — thin gold spears */}
      <g filter="url(#se-glow)">
        {longRays.map((angle) => (
          <polygon
            key={`L${angle}`}
            points="100,12 96,52 104,52"
            fill="url(#se-ray)"
            transform={`rotate(${angle} 100 100)`}
          />
        ))}
        {/* Short rays — soft inner bursts */}
        {shortRays.map((angle) => (
          <polygon
            key={`S${angle}`}
            points="100,30 97.5,55 102.5,55"
            fill="rgba(244,197,66,0.55)"
            transform={`rotate(${angle} 100 100)`}
          />
        ))}
      </g>

      {/* Subtle thin gold ring around the disc */}
      <circle
        cx="100"
        cy="100"
        r="48"
        fill="none"
        stroke="rgba(255,234,170,0.55)"
        strokeWidth="0.8"
      />

      {/* Inner gilded disc */}
      <circle cx="100" cy="100" r="44" fill="url(#se-disc)" filter="url(#se-glow)" />

      {/* Cross-aurelio centerpiece — slim luminous cross over the disc */}
      <g
        transform="translate(100,100)"
        fill="rgba(120,70,8,0.78)"
        stroke="rgba(255,234,170,0.85)"
        strokeWidth="0.8"
        strokeLinecap="round"
      >
        {/* vertical bar (slightly tall, classical proportions) */}
        <rect x="-2.4" y="-26" width="4.8" height="52" rx="1.4" />
        {/* horizontal bar (placed at upper third, like Latin cross) */}
        <rect x="-15" y="-9" width="30" height="4.8" rx="1.4" />
        {/* small inner gem at the crossing */}
        <circle r="2.4" fill="#FFE9A3" stroke="rgba(180,120,20,0.8)" strokeWidth="0.4" />
      </g>

      {/* Top crown highlight — a tiny luminous notch for visual gravity */}
      <circle cx="100" cy="58" r="1.6" fill="#FFF6D6" opacity="0.9" />
    </svg>
  );
};
