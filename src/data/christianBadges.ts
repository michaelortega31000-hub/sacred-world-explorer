import type { Place } from '@/contexts/AppContext';

/**
 * Catalog of Christian-themed badges.
 *
 * Each badge has a `condition` predicate evaluated against a Place returned
 * by the existing `usePlaces` hook (shape: `Place` from AppContext).
 *
 * Fallback rule: if `getBadgeForPlace(place)` returns null, the UI MUST fall
 * back to the generic "DÉBLOQUÉ" label — never invent badge data.
 */
export interface ChristianBadge {
  id: string;
  label: string;
  description: string;
  icon: string; // emoji for lightweight rendering
  condition: (place: Place) => boolean;
}

export interface AggregateBadge {
  id: string;
  label: string;
  description: string;
  icon: string;
  /** Evaluated against the count of unlocked place ids. */
  condition: (unlockedCount: number, unlockedIds: string[]) => boolean;
}

const includesTag = (place: Place, tag: string) =>
  Array.isArray(place.tags) && place.tags.some((t) => t.toLowerCase() === tag.toLowerCase());

export const christianBadges: ChristianBadge[] = [
  {
    id: 'pelerin-lourdes',
    label: 'Pèlerin de Lourdes',
    description: 'Vous avez visité le sanctuaire marial de Lourdes.',
    icon: '🕯️',
    condition: (p) => p.id === 'lourdes' || /lourdes/i.test(p.id),
  },
  {
    id: 'mont-sacre',
    label: 'Mont sacré',
    description: 'Vous avez gravi le Mont-Saint-Michel.',
    icon: '⛰️',
    condition: (p) => p.id === 'mont-saint-michel' || /mont-saint-michel/i.test(p.id),
  },
  {
    id: 'coeur-paris',
    label: 'Cœur de Paris',
    description: 'Vous avez découvert la basilique du Sacré-Cœur.',
    icon: '❤️',
    condition: (p) => p.id === 'sacre-coeur' || /sacre-coeur/i.test(p.id),
  },
  {
    id: 'pelerin-vatican',
    label: 'Pèlerin du Vatican',
    description: 'Vous avez visité la cité du Vatican.',
    icon: '⛪',
    condition: (p) =>
      p.id === 'vatican' ||
      /vatican/i.test(p.id) ||
      (typeof p.country === 'string' && p.country.toLowerCase().includes('vatican')),
  },
  {
    id: 'cathedrale-gothique',
    label: 'Cathédrale gothique débloquée',
    description: 'Une cathédrale gothique majeure rejoint votre collection.',
    icon: '🏰',
    condition: (p) =>
      ['notre-dame-paris', 'chartres', 'reims', 'amiens', 'strasbourg', 'rouen'].includes(p.id) ||
      includesTag(p, 'gothique'),
  },
  {
    id: 'marcheur-compostelle',
    label: 'Marcheur de Saint-Jacques',
    description: 'Une étape sur les chemins de Compostelle.',
    icon: '🥾',
    condition: (p) => includesTag(p, 'compostelle') || /compostelle|santiago/i.test(p.id),
  },
  {
    id: 'gardien-reliques',
    label: 'Gardien des reliques',
    description: 'Vous avez visité une basilique abritant des reliques sacrées.',
    icon: '✨',
    condition: (p) =>
      p.type?.toLowerCase() === 'basilica' ||
      p.type?.toLowerCase() === 'basilique' ||
      (p.placeCategory === 'religious_site' && includesTag(p, 'reliques')),
  },
];

export const aggregateBadges: AggregateBadge[] = [
  {
    id: 'connaisseur-patrimoine',
    label: 'Connaisseur du patrimoine sacré',
    description: '10 lieux sacrés débloqués.',
    icon: '📜',
    condition: (count) => count >= 10,
  },
  {
    id: 'chemin-pelerinage-complete',
    label: 'Chemin de pèlerinage complété',
    description: 'Un itinéraire de pèlerinage entier parcouru.',
    icon: '🗺️',
    condition: (_count, ids) =>
      ids.filter((id) => /compostelle|lourdes|mont-saint-michel|chartres/i.test(id)).length >= 4,
  },
];

/**
 * Returns the first matching Christian badge for a given place, or null.
 * UI consumers MUST fall back to the generic "DÉBLOQUÉ" label when null.
 */
export function getBadgeForPlace(place: Place | null | undefined): ChristianBadge | null {
  if (!place) return null;
  for (const badge of christianBadges) {
    try {
      if (badge.condition(place)) return badge;
    } catch {
      // Defensive: if the condition throws on an unexpected shape, skip.
      continue;
    }
  }
  return null;
}

/**
 * Returns all aggregate badges that the user has earned based on unlocked count/ids.
 */
export function getEarnedAggregateBadges(unlockedIds: string[]): AggregateBadge[] {
  return aggregateBadges.filter((b) => {
    try {
      return b.condition(unlockedIds.length, unlockedIds);
    } catch {
      return false;
    }
  });
}
