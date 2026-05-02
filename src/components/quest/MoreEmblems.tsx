// A small library of thematic emblems sharing the celestial-bowl frame.
// Visual language pinned: gold radial bowl, breathing aurora, gold-amber motif
// inside, optional pulsing dot or animated dash.
import type { ReactNode } from 'react';

interface InnerProps {
  children: ReactNode;
  size?: number;
}

const Bowl = ({ children, size = 88 }: InnerProps) => (
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
    {children}
  </div>
);

const goldGradId = (id: string) => `${id}-gold`;
const goldDef = (id: string) => (
  <defs>
    <linearGradient id={goldGradId(id)} x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FDE68A" />
      <stop offset="100%" stopColor="#B8860B" />
    </linearGradient>
  </defs>
);

// Profile — silhouette with halo
export const ProfileEmblem = ({ size = 88 }: { size?: number }) => {
  const id = 'profile-emblem';
  return (
    <Bowl size={size}>
      <svg viewBox="0 0 100 100" width={size} height={size} className="relative">
        {goldDef(id)}
        {/* halo arc */}
        <path d="M30 32 Q50 14 70 32" fill="none" stroke={`url(#${goldGradId(id)})`} strokeWidth="2"
              strokeLinecap="round" opacity="0.85"
              style={{ filter: 'drop-shadow(0 0 4px rgba(244,197,66,0.6))' }} />
        <path d="M30 32 Q50 14 70 32" fill="none" stroke="rgba(253,230,138,0.55)" strokeWidth="0.8" strokeDasharray="2 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="3s" repeatCount="indefinite" />
        </path>
        {/* head */}
        <circle cx="50" cy="42" r="11" fill={`url(#${goldGradId(id)})`} stroke="#FFF7CC" strokeWidth="1" />
        {/* shoulders */}
        <path d="M28 82 Q28 62 50 60 Q72 62 72 82 Z" fill={`url(#${goldGradId(id)})`} stroke="#FFF7CC" strokeWidth="1" opacity="0.9" />
        {/* tiny star above halo */}
        <g transform="translate(50,12)" fill="#FDE68A">
          <path d="M0,-2.5 L0.7,-0.7 L2.5,0 L0.7,0.7 L0,2.5 L-0.7,0.7 L-2.5,0 L-0.7,-0.7 Z" />
        </g>
      </svg>
    </Bowl>
  );
};

// Avatars — three faces in a row
export const AvatarsEmblem = ({ size = 88 }: { size?: number }) => {
  const id = 'avatars-emblem';
  return (
    <Bowl size={size}>
      <svg viewBox="0 0 100 100" width={size} height={size} className="relative">
        {goldDef(id)}
        {/* central face */}
        <circle cx="50" cy="44" r="11" fill={`url(#${goldGradId(id)})`} stroke="#FFF7CC" strokeWidth="1.2" />
        <path d="M32 80 Q32 62 50 60 Q68 62 68 80 Z" fill={`url(#${goldGradId(id)})`} opacity="0.95" />
        {/* left face (smaller, behind) */}
        <circle cx="28" cy="50" r="7.5" fill={`url(#${goldGradId(id)})`} opacity="0.55" stroke="#FFF7CC" strokeWidth="0.7" />
        <path d="M14 78 Q14 66 28 64 Q35 65 36 70 L32 80 Z" fill={`url(#${goldGradId(id)})`} opacity="0.45" />
        {/* right face */}
        <circle cx="72" cy="50" r="7.5" fill={`url(#${goldGradId(id)})`} opacity="0.55" stroke="#FFF7CC" strokeWidth="0.7" />
        <path d="M86 78 Q86 66 72 64 Q65 65 64 70 L68 80 Z" fill={`url(#${goldGradId(id)})`} opacity="0.45" />
        {/* sparkle */}
        <g transform="translate(50,20)" fill="#FDE68A">
          <path d="M0,-2.5 L0.7,-0.7 L2.5,0 L0.7,0.7 L0,2.5 L-0.7,0.7 L-2.5,0 L-0.7,-0.7 Z">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2.6s" repeatCount="indefinite" />
          </path>
        </g>
      </svg>
    </Bowl>
  );
};

// Reminders — bell with pulsing star
export const RemindersEmblem = ({ size = 88 }: { size?: number }) => {
  const id = 'reminders-emblem';
  return (
    <Bowl size={size}>
      <svg viewBox="0 0 100 100" width={size} height={size} className="relative">
        {goldDef(id)}
        {/* bell body */}
        <path d="M50 22 Q34 22 32 46 Q31 62 26 70 L74 70 Q69 62 68 46 Q66 22 50 22 Z"
              fill={`url(#${goldGradId(id)})`} stroke="#FFF7CC" strokeWidth="1.2"
              style={{ filter: 'drop-shadow(0 0 4px rgba(244,197,66,0.45))' }} />
        {/* clapper */}
        <circle cx="50" cy="78" r="3.5" fill="#FDE68A" />
        {/* top button */}
        <rect x="46" y="14" width="8" height="6" rx="2" fill={`url(#${goldGradId(id)})`} />
        {/* sound waves */}
        <path d="M16 36 Q22 46 16 56" fill="none" stroke="#FDE68A" strokeWidth="1.4" opacity="0.6" strokeLinecap="round">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.4s" repeatCount="indefinite" />
        </path>
        <path d="M84 36 Q78 46 84 56" fill="none" stroke="#FDE68A" strokeWidth="1.4" opacity="0.6" strokeLinecap="round">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.4s" repeatCount="indefinite" begin="0.4s" />
        </path>
      </svg>
    </Bowl>
  );
};

// Places — pin with horizon ring
export const PlacesEmblem = ({ size = 88 }: { size?: number }) => {
  const id = 'places-emblem';
  return (
    <Bowl size={size}>
      <svg viewBox="0 0 100 100" width={size} height={size} className="relative">
        {goldDef(id)}
        {/* horizon ring */}
        <ellipse cx="50" cy="76" rx="28" ry="6" fill="none" stroke={`url(#${goldGradId(id)})`} strokeWidth="1.4" opacity="0.7" />
        <ellipse cx="50" cy="76" rx="14" ry="3" fill="none" stroke="rgba(253,230,138,0.35)" strokeWidth="0.8" />
        {/* pin */}
        <path d="M50 22 Q34 22 34 40 Q34 56 50 74 Q66 56 66 40 Q66 22 50 22 Z"
              fill={`url(#${goldGradId(id)})`} stroke="#FFF7CC" strokeWidth="1.2"
              style={{ filter: 'drop-shadow(0 0 5px rgba(244,197,66,0.55))' }} />
        {/* pin core */}
        <circle cx="50" cy="40" r="5.5" fill="#0c1a3e" stroke="#FDE68A" strokeWidth="0.9" />
        {/* drift sparkle */}
        <g transform="translate(78,30)" fill="#FDE68A" opacity="0.7">
          <path d="M0,-2 L0.5,-0.5 L2,0 L0.5,0.5 L0,2 L-0.5,0.5 L-2,0 L-0.5,-0.5 Z" />
        </g>
      </svg>
    </Bowl>
  );
};
