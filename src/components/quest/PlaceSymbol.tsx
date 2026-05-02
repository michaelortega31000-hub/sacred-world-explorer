// PlaceSymbol — typographic / iconic placeholder for places without a
// verified photograph. Honest: never shows misleading photo data.
//
// Renders a cathedral-glass card with:
//   - a lucide icon chosen by place type (church, monastery, ruin, etc.)
//   - a soft warm-gold radial backlight
//   - the place name in Cinzel (truncated)
//
// Used wherever `place.imageUrl` is missing — Wikidata-sourced sites get
// the symbol instead of P18 (which is community-edited and often wrong).

import { Church, Castle, Mountain, BookOpen, Crown, Sparkles, Building2, type LucideIcon } from 'lucide-react';
import { ContributePhotoButton } from './ContributePhotoButton';

interface Props {
  type?: string;
  name?: string;
  className?: string;
  /** When provided, shows a "Contribuer une photo" CTA in the corner. */
  placeId?: string;
}

// Map place type label → lucide icon. Strings come from the Wikidata
// type mapping in src/lib/wikidataPlaces.ts and the local mockPlaces dataset.
const ICON_FOR_TYPE = (type?: string): LucideIcon => {
  if (!type) return Sparkles;
  const t = type.toLowerCase();
  if (t.includes('cathédrale') || t.includes('cathedral')) return Crown;
  if (t.includes('basilique') || t.includes('basilica')) return Crown;
  if (t.includes('église') || t.includes('eglise') || t.includes('church')) return Church;
  if (t.includes('chapelle') || t.includes('chapel')) return Church;
  if (t.includes('monastère') || t.includes('monastery')) return Building2;
  if (t.includes('abbaye') || t.includes('abbey')) return Building2;
  if (t.includes('sanctuaire') || t.includes('sanctuary') || t.includes('shrine')) return Sparkles;
  if (t.includes('archéologique') || t.includes('archaeological') || t.includes('ruine')) return Mountain;
  if (t.includes('unesco') || t.includes('heritage')) return Crown;
  if (t.includes('musée') || t.includes('museum')) return BookOpen;
  if (t.includes('château') || t.includes('castle')) return Castle;
  return Sparkles;
};

export const PlaceSymbol = ({ type, name, className = '', placeId }: Props) => {
  const Icon = ICON_FOR_TYPE(type);

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{
        background:
          'radial-gradient(ellipse at 50% 30%, rgba(40,32,18,0.95) 0%, rgba(7,7,15,0.98) 70%)',
      }}
    >
      {/* Soft amber backlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(244,197,66,0.18) 0%, transparent 60%)',
        }}
      />

      {/* Subtle grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
        }}
      />

      {/* Centered icon + name */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background:
              'radial-gradient(circle, rgba(244,197,66,0.18) 0%, rgba(7,7,15,0.40) 70%)',
            border: '1px solid rgba(244,197,66,0.30)',
            boxShadow:
              '0 0 24px rgba(244,197,66,0.18), inset 0 0 12px rgba(244,197,66,0.10)',
          }}
        >
          <Icon
            className="w-7 h-7"
            style={{
              color: 'rgba(244,197,66,0.88)',
              filter: 'drop-shadow(0 0 6px rgba(244,197,66,0.45))',
            }}
            strokeWidth={1.6}
          />
        </div>

        {name && (
          <div className="max-w-[80%]">
            <div className="text-[10px] uppercase tracking-[0.18em] text-amber-200/60 mb-1">
              {type ?? 'Lieu sacré'}
            </div>
            <div className="font-cinzel text-[15px] text-amber-50/90 leading-tight line-clamp-2">
              {name}
            </div>
          </div>
        )}
      </div>

      {/* Contribute-photo CTA — only when we have a placeId to attach to */}
      {placeId && name && (
        <ContributePhotoButton placeId={placeId} placeName={name} />
      )}
    </div>
  );
};
