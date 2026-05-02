// Open-book emblem with glowing pages — speaks to "journal".
export const JournalEmblem = ({ size = 88 }: { size?: number }) => {
  const id = 'journal-emblem';
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
          <linearGradient id={`${id}-gold`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
          <radialGradient id={`${id}-page`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFF7CC" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#F4C542" stopOpacity="0.15" />
          </radialGradient>
        </defs>

        {/* glowing left page */}
        <path d="M50 28 Q34 30 22 36 L22 72 Q34 66 50 68 Z" fill={`url(#${id}-page)`} stroke={`url(#${id}-gold)`} strokeWidth="1.2" />
        {/* glowing right page */}
        <path d="M50 28 Q66 30 78 36 L78 72 Q66 66 50 68 Z" fill={`url(#${id}-page)`} stroke={`url(#${id}-gold)`} strokeWidth="1.2" />
        {/* spine */}
        <line x1="50" y1="28" x2="50" y2="68" stroke="#F4C542" strokeWidth="1" opacity="0.7" />
        {/* ruled lines, subtle */}
        <g stroke="#F4C542" strokeWidth="0.5" opacity="0.55">
          <line x1="28" y1="44" x2="46" y2="42" />
          <line x1="28" y1="50" x2="46" y2="48" />
          <line x1="28" y1="56" x2="44" y2="54" />
          <line x1="54" y1="42" x2="72" y2="44" />
          <line x1="54" y1="48" x2="72" y2="50" />
          <line x1="54" y1="54" x2="70" y2="56" />
        </g>
        {/* tiny star above spine — written under the stars */}
        <g transform="translate(50,18)" fill="#FDE68A">
          <path d="M0,-3 L0.9,-0.9 L3,0 L0.9,0.9 L0,3 L-0.9,0.9 L-3,0 L-0.9,-0.9 Z" />
          <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
        </g>
        {/* faint motes */}
        <g fill="#FDE68A">
          <circle cx="22" cy="22" r="0.8" opacity="0.7" />
          <circle cx="78" cy="22" r="0.6" opacity="0.6" />
          <circle cx="76" cy="80" r="0.7" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
};
