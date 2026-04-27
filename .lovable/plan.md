## Goal

Replace the old SacredWorld logo with the new official one (golden sun-figure with turquoise halo on deep blue, uploaded as `iZcEy.jpg`) everywhere it appears in the app — including the inline SVG emblem on the Splash page shown in the screenshot.

## Approach

1. **Save the new logo as a real image asset** (one source of truth).
   - Copy `user-uploads://iZcEy.jpg` → `src/assets/sacredworld-logo-official.png` (used by all React components via ES module import).
   - Also copy it to `public/logo-icon.png` (overwrites the existing file used by push notifications and as the PWA icon).

2. **Centralize the import** in `src/components/ui/logo.tsx` so both `variant="main"` and `variant="icon"` point to the new asset. The existing `<Logo />` wrapper, sizing, and glow effects stay unchanged — only the underlying image file changes.

3. **Update every direct logo import** to use the new asset:

   | File | Current import | New import |
   |---|---|---|
   | `src/components/ui/logo.tsx` | `logo-glow.png` + `logo-v4.png` | `sacredworld-logo-official.png` (both variants) |
   | `src/pages/Welcome.tsx` | `sacredworld-logo-new.png` + `logo-glow.png` | `sacredworld-logo-official.png` |
   | `src/pages/Traditions.tsx` | `sacredworld-logo.png` | `sacredworld-logo-official.png` |
   | `src/pages/Auth.tsx` | `sacredworld-logo.png` | `sacredworld-logo-official.png` |
   | `src/pages/NotFound.tsx` | `logo-glow.png` | `sacredworld-logo-official.png` |
   | `src/components/Header.tsx` | `sacred-world-logo-header.png` | `sacredworld-logo-official.png` |

4. **Splash page (`src/pages/Splash.tsx`)** — this is the page in the screenshot. Today the central emblem is a hand-drawn inline SVG (sun rays + figure built from `<circle>`/`<path>` with `sunGradient`). Replace that SVG block (around lines 337–374) with an `<img src={sacredWorldLogo} />` rendering the new official logo. Keep:
   - the surrounding container, sizing (`w-36 h-36` → bumped to `w-44 h-44` so it matches the screenshot's prominence),
   - the soft turquoise halo glow (`blur-3xl` ring behind it),
   - the floating "flower-of-life" ornaments on the sides,
   - all auth / language / tutorial / "Continuer" / "Hors ligne" / "Tutoriel" / "Déconnexion" logic and layout untouched.

   The new logo image already contains its own halo + rays, so the extra decorative ring SVG inside the emblem is removed to avoid double-glow; the outer `bg-[#3a8a6b]/25 blur-3xl` aura is kept for soft integration with the dark background.

5. **Push notifications** (`src/hooks/useEventReminders.ts`) keep referencing `/logo-icon.png` — no code change needed since we overwrote that file in step 1.

6. **Leave the old asset files in place** (`logo-v4.png`, `logo-glow.png`, `sacredworld-logo.png`, etc.) but unreferenced. Safer than deleting in case any cached PWA manifest still points at them; can be cleaned up in a later pass.

## Out of scope

- No changes to the favicon (`public/favicon.ico`) — that's a separate `.ico` format and the user only mentioned the in-app logo. Can be addressed later if requested.
- No layout, color-token, or copy changes on any page. Pure asset swap + Splash emblem swap.

## Files touched

- `src/assets/sacredworld-logo-official.png` (new)
- `public/logo-icon.png` (overwrite)
- `src/components/ui/logo.tsx`
- `src/components/Header.tsx`
- `src/pages/Splash.tsx`
- `src/pages/Welcome.tsx`
- `src/pages/Traditions.tsx`
- `src/pages/Auth.tsx`
- `src/pages/NotFound.tsx`
