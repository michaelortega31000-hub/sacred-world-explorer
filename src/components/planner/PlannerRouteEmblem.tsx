// Header emblem for the Planner page. Replaces the generic brand logo with an
// image of the actual task: tracing a path between two sacred points on a
// celestial sphere. Gold-amber identity, subtle breath, no cyan.
interface Props {
  size?: number;
}

export const PlannerRouteEmblem = ({ size = 88 }: Props) => {
  const id = 'planner-route-emblem';
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* outer aurora */}
      <span
        className="absolute inset-0 rounded-full pointer-events-none hub-breath"
        style={{
          background:
            'radial-gradient(circle, rgba(244,197,66,0.22) 0%, rgba(244,197,66,0.08) 45%, transparent 70%)',
        }}
      />
      {/* inner ring */}
      <span
        className="absolute inset-2 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, #1a3a72 0%, #0c1a3e 60%, #050a1c 100%)',
          boxShadow:
            '0 0 0 1px rgba(244,197,66,0.30) inset, 0 0 18px rgba(244,197,66,0.18)',
        }}
      />

      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="relative"
      >
        <defs>
          <linearGradient id={`${id}-arc`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#F4C542" stopOpacity="0.95" />
            <stop offset="50%"  stopColor="#FDE68A" stopOpacity="1" />
            <stop offset="100%" stopColor="#FB923C" stopOpacity="0.95" />
          </linearGradient>
          <radialGradient id={`${id}-dot`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#FFF7CC" />
            <stop offset="60%" stopColor="#F4C542" />
            <stop offset="100%" stopColor="#B8860B" />
          </radialGradient>
        </defs>

        {/* faint meridians on the celestial sphere */}
        <g stroke="rgba(244,197,66,0.18)" strokeWidth="0.6" fill="none">
          <ellipse cx="50" cy="50" rx="34" ry="34" />
          <ellipse cx="50" cy="50" rx="34" ry="14" />
          <ellipse cx="50" cy="50" rx="14" ry="34" />
        </g>

        {/* great-circle arc — the planned route */}
        <path
          d="M 26 64 Q 50 18 74 42"
          fill="none"
          stroke={`url(#${id}-arc)`}
          strokeWidth="2.4"
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 4px rgba(244,197,66,0.6))' }}
        />

        {/* dashed return-path hint (animated) */}
        <path
          d="M 26 64 Q 50 18 74 42"
          fill="none"
          stroke="rgba(253,230,138,0.55)"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeDasharray="2 4"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="2.4s" repeatCount="indefinite" />
        </path>

        {/* departure point */}
        <circle cx="26" cy="64" r="4.5" fill={`url(#${id}-dot)`} style={{ filter: 'drop-shadow(0 0 4px #F4C542)' }} />
        <circle cx="26" cy="64" r="2"   fill="#FFF" />

        {/* destination — slightly larger, pulsing */}
        <g style={{ transformOrigin: '74px 42px' }}>
          <circle cx="74" cy="42" r="6" fill="none" stroke="#F4C542" strokeWidth="0.8" opacity="0.6">
            <animate attributeName="r"       from="4" to="9" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.65" to="0" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="74" cy="42" r="5" fill={`url(#${id}-dot)`} style={{ filter: 'drop-shadow(0 0 6px #F4C542)' }} />
          <circle cx="74" cy="42" r="2.4" fill="#FFF" />
        </g>

        {/* tiny North-Star above destination */}
        <g transform="translate(74,28)" fill="#FDE68A" opacity="0.85">
          <path d="M0,-3 L0.9,-0.9 L3,0 L0.9,0.9 L0,3 L-0.9,0.9 L-3,0 L-0.9,-0.9 Z" />
        </g>
      </svg>
    </div>
  );
};
