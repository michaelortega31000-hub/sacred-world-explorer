// Laurel-wreath medal — speaks to "badges / collection / honor".
export const BadgesEmblem = ({ size = 88 }: { size?: number }) => {
  const id = 'badges-emblem';
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }} aria-hidden>
      <span
        className="absolute inset-0 rounded-full pointer-events-none hub-breath"
        style={{ background: 'radial-gradient(circle, rgba(244,197,66,0.24) 0%, rgba(244,197,66,0.08) 45%, transparent 70%)' }}
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
          <radialGradient id={`${id}-medal`} cx="50%" cy="40%" r="60%">
            <stop offset="0%"   stopColor="#FFF7CC" />
            <stop offset="55%"  stopColor="#F4C542" />
            <stop offset="100%" stopColor="#8B6508" />
          </radialGradient>
          <linearGradient id={`${id}-leaf`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
        </defs>

        {/* laurel — left */}
        <g fill={`url(#${id}-leaf)`} opacity="0.85">
          {[60, 52, 44, 36, 28].map((y, i) => (
            <ellipse key={`L${i}`} cx={28} cy={y} rx="6" ry="3" transform={`rotate(${-30 + i * 8} 28 ${y})`} />
          ))}
        </g>
        {/* laurel — right (mirrored) */}
        <g fill={`url(#${id}-leaf)`} opacity="0.85">
          {[60, 52, 44, 36, 28].map((y, i) => (
            <ellipse key={`R${i}`} cx={72} cy={y} rx="6" ry="3" transform={`rotate(${30 - i * 8} 72 ${y})`} />
          ))}
        </g>

        {/* medallion */}
        <circle cx="50" cy="52" r="18" fill={`url(#${id}-medal)`} stroke="#FFF7CC" strokeWidth="1.2"
                style={{ filter: 'drop-shadow(0 0 8px rgba(244,197,66,0.55))' }} />
        {/* inner star */}
        <g transform="translate(50,52)" fill="#0c1a3e">
          <path d="M0,-9 L2.6,-2.8 L9,-2.8 L3.8,1.2 L5.5,8 L0,4 L-5.5,8 L-3.8,1.2 L-9,-2.8 L-2.6,-2.8 Z" opacity="0.85" />
        </g>

        {/* ribbon */}
        <path d="M44 70 L40 90 L50 84 L60 90 L56 70 Z" fill="#B8860B" stroke="#FDE68A" strokeWidth="0.8" opacity="0.9" />
      </svg>
    </div>
  );
};
