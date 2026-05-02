// Phase 2 — Four-track audience model.
// catholic | protestant | orthodox | heritage. `common` is content-only (not a user track).

export type Track = 'catholic' | 'protestant' | 'orthodox' | 'heritage';
export type TrackScope = Track | 'common';

export const TRACKS: Track[] = ['catholic', 'protestant', 'orthodox', 'heritage'];

export interface DenominationRow {
  id: string;
  code: Track;
  parent_id: string | null;
  label_fr: string;
  label_en: string;
  description_fr: string | null;
  description_en: string | null;
  display_order: number;
  active: boolean;
}

// Legacy → Track mapping for transitional code that still reads
// user_progress.denomination text. New code should ignore this.
export const LEGACY_DENOMINATION_TO_TRACK: Record<string, Track> = {
  catholique: 'catholic',
  protestant: 'protestant',
  curieux: 'heritage',
};

export interface Consents {
  version: number;
  geolocation_checkin?: { granted: boolean; ts: string };
  geolocation_friends?: { granted: boolean; ts: string };
  community_map?: { granted: boolean; ts: string };
}

export const EMPTY_CONSENTS: Consents = { version: 1 };
