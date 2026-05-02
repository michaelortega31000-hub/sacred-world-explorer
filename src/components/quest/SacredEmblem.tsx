// Pure SVG SacredWorld emblem — vectorized from the original artwork.
// The original: a stylized human figure with arms raised in a V, set against
// an asymmetric sunburst on an inner amber disc, ringed by an outer halo.
// We reproduce that here in pure SVG so the emblem lives on transparent
// background (no rectangular ghost) and renders in the cathedral gold palette.

interface Props {
  size?: number;
  className?: string;
  animate?: boolean;
}

export const SacredEmblem = ({ size = 200, className = '', animate = true }: Props) => {
  // Sun rays: pseudo-random angles + lengths to mimic the original's organic,
  // hand-drawn feel rather than a perfectly symmetrical sunburst.
  const RAYS: Array<{ angle: number; length: number; width: number }> = [
    { angle:   0, length: 92, width: 3.6 },
    { angle:  14, length: 76, width: 2.8 },
    { angle:  28, length: 88, width: 3.2 },
    { angle:  42, length: 70, width: 2.4 },
    { angle:  56, length: 84, width: 3.0 },
    { angle:  70, length: 78, width: 2.6 },
    { angle:  84, length: 90, width: 3.4 },
    { angle:  98, length: 72, width: 2.4 },
    { angle: 112, length: 86, width: 3.2 },
    { angle: 126, length: 74, width: 2.6 },
    { angle: 140, length: 92, width: 3.4 },
    { angle: 154, length: 80, width: 2.8 },
    { angle: 168, length: 86, width: 3.2 },
    { angle: 182, length: 76, width: 2.6 },
    { angle: 196, length: 88, width: 3.4 },
    { angle: 210, length: 72, width: 2.4 },
    { angle: 224, length: 84, width: 3.0 },
    { angle: 238, length: 78, width: 2.6 },
    { angle: 252, length: 90, width: 3.2 },
    { angle: 266, length: 74, width: 2.4 },
    { angle: 280, length: 86, width: 3.0 },
    { angle: 294, length: 76, width: 2.6 },
    { angle: 308, length: 92, width: 3.4 },
    { angle: 322, length: 78, width: 2.8 },
    { angle: 336, length: 84, width: 3.0 },
    { angle: 350, length: 72, width: 2.4 },
  ];

  return (
    <svg
      viewBox="0 0 240 240"
      width={size}
      height={size}
      className={`${className} ${animate ? 'sacred-emblem-breath' : ''}`}
      role="img"
      aria-label="SacredWorld emblem"
    >
      <defs>
        {/* Outer halo — soft warm gold (original was turquoise; unified to gold) */}
        <radialGradient id="se-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(244,197,66,0.55)" />
          <stop offset="60%"  stopColor="rgba(244,197,66,0.20)" />
          <stop offset="100%" stopColor="rgba(244,197,66,0.00)" />
        </radialGradient>

        {/* Inner amber disc — saffron orange to deeper amber */}
        <radialGradient id="se-disc" cx="50%" cy="40%" r="65%">
          <stop offset="0%"   stopColor="#FFD86B" />
          <stop offset="55%"  stopColor="#F4A93C" />
          <stop offset="100%" stopColor="#B86A14" />
        </radialGradient>

        {/* Ray gradient — bright outer tip → warm amber base */}
        <linearGradient id="se-ray" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%"   stopColor="rgba(255,234,170,0.95)" />
          <stop offset="55%"  stopColor="rgba(244,197,66,0.92)" />
          <stop offset="100%" stopColor="rgba(244,168,40,0.55)" />
        </linearGradient>

        {/* Figure highlight — luminous parchment */}
        <linearGradient id="se-figure" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%"   stopColor="#FFF6D6" />
          <stop offset="60%"  stopColor="#FFE9A3" />
          <stop offset="100%" stopColor="#F4C542" />
        </linearGradient>

        {/* Soft glow for the rays */}
        <filter id="se-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Stronger glow for the central figure */}
        <filter id="se-figure-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 1. Outer halo glow — soft, no hard ring */}
      <circle cx="120" cy="120" r="118" fill="url(#se-halo)" />

      {/* 2. Sun rays — organic, asymmetric spikes */}
      <g filter="url(#se-glow)">
        {RAYS.map((r, i) => (
          <polygon
            key={i}
            points={`120,${120 - r.length} ${120 - r.width},${120 - 38} ${120 + r.width},${120 - 38}`}
            fill="url(#se-ray)"
            transform={`rotate(${r.angle} 120 120)`}
          />
        ))}
      </g>

      {/* 4. Inner amber disc (the saffron sun behind the figure) */}
      <circle cx="120" cy="120" r="44" fill="url(#se-disc)" />
      {/* Subtle inner ring to define the disc edge */}
      <circle
        cx="120"
        cy="120"
        r="44"
        fill="none"
        stroke="rgba(255,234,170,0.4)"
        strokeWidth="0.8"
      />

      {/* 5. Central figure — bolder silhouette: head, V-arms, tapering body */}
      <g
        filter="url(#se-figure-glow)"
        fill="url(#se-figure)"
        stroke="rgba(255,234,170,0.70)"
        strokeWidth="0.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* Single combined silhouette path — arms up + torso + flowing skirt */}
        <path d="
          M 120,87
          C 116.5,87 114,89.5 114,93
          C 114,96.5 116.5,99 120,99
          C 123.5,99 126,96.5 126,93
          C 126,89.5 123.5,87 120,87
          Z
          M 113,103
          C 107,99 99,93 90,84
          C 87,81 84,79 81,77
          C 84,82 88,87 92,92
          C 98,100 104,107 110,112
          L 113,108
          Z
          M 127,103
          C 133,99 141,93 150,84
          C 153,81 156,79 159,77
          C 156,82 152,87 148,92
          C 142,100 136,107 130,112
          L 127,108
          Z
          M 113,108
          C 113,116 111,124 110,134
          C 109,144 107,154 109,162
          C 110,167 112,170 115,172
          L 125,172
          C 128,170 130,167 131,162
          C 133,154 131,144 130,134
          C 129,124 127,116 127,108
          C 126,107 125,106 124,106
          L 116,106
          C 115,106 114,107 113,108
          Z
        " />

        {/* Flame wisps at base */}
        <path d="
          M 116,170
          C 114,175 115,180 117.5,182
          C 119,180 119.5,178 120,176
          C 120.5,178 121,180 122.5,182
          C 125,180 126,175 124,170
          Z
        " />
      </g>
    </svg>
  );
};
