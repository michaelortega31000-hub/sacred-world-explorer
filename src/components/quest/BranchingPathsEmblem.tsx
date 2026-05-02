// Two-paths emblem — a single trunk forks into two glowing routes.
// Speaks to "changer de tradition" without making it feel like a decision tree.
export const BranchingPathsEmblem = ({ size = 88 }: { size?: number }) => {
  const id = 'branching-emblem';
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }} aria-hidden>
      <span
        className="absolute inset-0 rounded-full pointer-events-none hub-breath"
        style={{ background: 'radial-gradient(circle, rgba(244,197,66,0.22) 0%, rgba(244,197,66,0.08) 45%, transparent 70%)' }}
      />
      <span
        className="absolute inset-2 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #1a3a72 0%, #0c1a3e 60%, #050a1c 100%)',
          boxShadow: '0 0 0 1px rgba(244,197,66,0.30) inset, 0 0 18px rgba(244,197,66,0.18)',
        }}
      />
      <svg viewBox="0 0 100 100" width={size} height={size} className="relative">
        <defs>
          <linearGradient id={`${id}-gold`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#B8860B" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>
          <radialGradient id={`${id}-dot`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF7CC" />
            <stop offset="60%" stopColor="#F4C542" />
            <stop offset="100%" stopColor="#B8860B" />
          </radialGradient>
        </defs>

        {/* trunk */}
        <path d="M50 82 L50 56" stroke={`url(#${id}-gold)`} strokeWidth="3" strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 4px rgba(244,197,66,0.6))' }} />
        {/* left branch */}
        <path d="M50 56 Q40 44 28 32" fill="none" stroke={`url(#${id}-gold)`} strokeWidth="2.4" strokeLinecap="round" />
        {/* right branch */}
        <path d="M50 56 Q60 44 72 32" fill="none" stroke={`url(#${id}-gold)`} strokeWidth="2.4" strokeLinecap="round" />

        {/* dashed echo on each branch — drifting */}
        <path d="M50 56 Q40 44 28 32" fill="none" stroke="rgba(253,230,138,0.55)" strokeWidth="0.8" strokeDasharray="2 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M50 56 Q60 44 72 32" fill="none" stroke="rgba(253,230,138,0.55)" strokeWidth="0.8" strokeDasharray="2 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="3s" repeatCount="indefinite" />
        </path>

        {/* origin dot */}
        <circle cx="50" cy="82" r="4.5" fill={`url(#${id}-dot)`} style={{ filter: 'drop-shadow(0 0 4px #F4C542)' }} />
        <circle cx="50" cy="82" r="2"   fill="#FFF" />

        {/* destination — left (smaller, ambient) */}
        <circle cx="28" cy="32" r="4" fill={`url(#${id}-dot)`} opacity="0.85" />
        {/* destination — right (active, pulsing) */}
        <g>
          <circle cx="72" cy="32" r="6" fill="none" stroke="#F4C542" strokeWidth="0.8" opacity="0.6">
            <animate attributeName="r"       from="4" to="9" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.65" to="0" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="72" cy="32" r="5" fill={`url(#${id}-dot)`} style={{ filter: 'drop-shadow(0 0 6px #F4C542)' }} />
          <circle cx="72" cy="32" r="2.4" fill="#FFF" />
        </g>
      </svg>
    </div>
  );
};
