## Phase 32 — Rebuild Splash page as pure HTML/CSS (no background image)

### Goal
Recreate the splash page exactly as shown in the reference screenshot, but rendered entirely with HTML, Tailwind CSS, and SVG — removing the dependency on the `splash-hero.webp` background image. The result must be visually identical: deep blue gradient, golden "rising figure in sun" emblem with green halo, "SacredWorld" wordmark, tagline, glowing CTA, language selector, and the three top buttons (Hors ligne / Tutoriel / Déconnexion).

### Changes

**`src/pages/Splash.tsx`** (single file edit)
- Remove the three `splash-hero*.webp` imports and the `<img>` element rendering them.
- Keep the deep blue gradient background already on the root `div`.
- Add subtle decorative SVG flower-of-life motifs on the left/right edges (low opacity, like in the screenshot).
- Replace the invisible "click zones" (currently transparent buttons overlaid on the image) with **real, visible UI elements** stacked vertically and centered:
  1. **Logo emblem** — inline SVG: golden circle with a stylized "rising person with arms raised" silhouette and radiating sun rays, surrounded by a soft green/turquoise concentric halo glow (CSS `radial-gradient` + `blur` + `box-shadow`).
  2. **"SacredWorld"** wordmark — large serif (`font-cinzel`), warm cream color, drop shadow.
  3. **Tagline** (two lines): "La plateforme mondiale pour explorer, comprendre et collectionner le patrimoine sacré, culturel et naturel." (white, centered, max-width constrained).
  4. **CTA button** "Commencer l'exploration" / "Continuer" — pill-shaped, semi-transparent dark teal background, golden border, golden glow halo, large readable text. Wired to existing `handleStartExploration`.
  5. **Language selector** below CTA — globe icon + current language name (e.g. "🌐 Français"), text-button style. Wired to existing `handleLanguageClick`.
- Keep the existing top button row (Hors ligne / Tutoriel / Déconnexion) and both dialogs (language picker, tutorial) **unchanged**.
- Keep all existing logic untouched: auth check, denomination redirect, tutorial open via `?tutorial=true`, language state, offline mode handler, logout.

### Visual details
- Background: existing `linear-gradient(180deg, #0A1628 0%, #0E1B3F 30%, #1a3a52 60%, #0E1B3F 100%)`.
- Halo around emblem: layered `div`s with `bg-[#3a8a6b]/30 blur-3xl` and `bg-primary/20 blur-2xl` for the green glow + golden inner glow.
- CTA halo: `shadow-[0_0_40px_rgba(234,179,8,0.4)]` plus a wrapping blurred gradient ring.
- Decorative side ornaments: two small inline SVG flower-of-life patterns at `opacity-10`, positioned `absolute left-4 top-1/3` and `absolute right-4 top-2/3`.

### Files touched
- `src/pages/Splash.tsx` — only file modified.
- The `src/assets/splash-hero*.webp` files are left in place (not deleted) in case other code references them; imports are simply removed from `Splash.tsx`.

### Out of scope
- No changes to routing, auth flow, tutorial steps, language list, or dialog contents.
- No changes to other pages, components, or styles.
- No deletion of the legacy `.webp` assets.

### Risk
Low. Single-file rewrite of presentational JSX. All handlers and state logic are preserved verbatim.
