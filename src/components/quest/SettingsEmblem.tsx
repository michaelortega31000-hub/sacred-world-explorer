// Slow-rotating gear with a sacred dot — speaks to "réglages" without
// feeling like a desktop control panel.
export const SettingsEmblem = ({ size = 88 }: { size?: number }) => {
  const id = 'settings-emblem';
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
          <linearGradient id={`${id}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
        </defs>

        {/* gear group — rotated by SMIL animateTransform around (50,50) */}
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="40s"
            repeatCount="indefinite"
          />
          {/* 8 teeth */}
          {Array.from({ length: 8 }).map((_, i) => (
            <rect
              key={i}
              x="47" y="20" width="6" height="12" rx="1.5"
              fill={`url(#${id}-gold)`}
              transform={`rotate(${i * 45} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="20" fill="none" stroke={`url(#${id}-gold)`} strokeWidth="3.5" />
          <circle cx="50" cy="50" r="12" fill="none" stroke={`url(#${id}-gold)`} strokeWidth="1.8" />
        </g>

        {/* steady inner dot — center of stillness amid the spin */}
        <circle cx="50" cy="50" r="3.5" fill="#FFF7CC" style={{ filter: 'drop-shadow(0 0 6px #F4C542)' }} />
      </svg>
    </div>
  );
};
