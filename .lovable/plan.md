# Add a visible Settings (Réglages) entry point

## Problem
From `/explore` (and most screens), there is no way to reach **Réglages / Settings**. The bottom nav only has Accueil, Planifier, Globe, Journal. The `/settings` page exists and is fully built, but it's currently only reachable through `/profile`, which itself has no dedicated nav slot.

## Goal
Make Settings reachable in **one tap from any main screen**, without crowding the compact header or breaking the symmetric layout (per the header-layout-v4 memory rule).

## Approach

### 1. Add a Settings (gear) icon in the global `Header.tsx`
- **Compact header branch** (`/explore`, `/profile`, `/country/*`, `/place/*`):
  - Insert a small `Settings` (lucide gear) icon button in the **right cluster**, placed **between the Mail icon and the Assistant orb**.
  - Same styling vocabulary as the Mail button: `w-11 h-11 rounded-full text-foreground hover:bg-primary/10`, with a Tooltip "Réglages".
  - On click: `navigate('/settings')`.
- **Standard header branch** (other pages):
  - Add the same gear icon next to the Mail/Assistant cluster, using the smaller `p-2` button style already used there.

### 2. Add a quick "Profil" shortcut alongside it
Since Profile is also currently hard to reach from `/explore`, add a tiny avatar/User icon button next to the gear in the same right cluster (compact branch only). Tooltip "Profil", navigates to `/profile`. This is optional — confirm before adding if it would crowd the header on a 758px viewport.

### 3. Keep existing elements intact
- Do **not** remove or resize: ChristianIcon, badges pill, GeolocationToggle, VoiceCommand, Mail, Assistant orb, centered SacredEmblem.
- Do **not** touch the bottom navigation (rule: keep 4-tab compact nav).
- Do **not** add Settings as a 5th bottom-nav tab.

### 4. Visual constraints
- Gear icon size: `w-5 h-5` inside an `11x11` round button (matches Mail).
- No glow, no gold ring — keep it discreet so the Assistant orb remains the visual anchor on the right.
- Respect mobile viewport (758 CSS px and below): icons should not wrap. If space becomes tight after adding the gear, reduce horizontal gaps from `gap-1 sm:gap-2` to `gap-0.5 sm:gap-1.5` in the right cluster only.

## Files to edit
- `src/components/Header.tsx` — add the Settings button in both header variants; import `Settings` from `lucide-react` and `useNavigate` (already imported).

## Out of scope
- No changes to `/settings` page content.
- No changes to routing, auth gates, or bottom navigation.
- No new memory entries needed (this is a UX completion, not a new rule).

## Question for you
Do you also want the small **Profil** avatar shortcut next to the gear, or just the **Settings gear** for now?
