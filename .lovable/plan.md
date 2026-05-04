I can see the issue now: your screenshot shows the Lovable embedded preview is still rendering a white rounded phone frame, while the app itself renders correctly in my direct preview test. Instead of leaving this as a workaround, I’ll make the app much more resistant to embedded-preview blank states.

Plan:

1. Add a real pre-React fallback inside `index.html`
   - Put a small SacredWorld splash/loading shell directly inside `<div id="root">`.
   - This means the preview will immediately show a dark SacredWorld screen instead of a white empty box, even before React finishes loading.
   - React will replace it once the app mounts.

2. Harden the base page sizing and background
   - Add explicit `html`, `body`, and `#root` sizing (`min-height: 100%`, `width: 100%`) in `src/index.css`.
   - Set the base background color at the raw CSS level, not only through Tailwind classes, so the embedded iframe cannot default to white.
   - Add safe overflow behavior so the 390px mobile preview remains usable.

3. Add a mount watchdog in `src/main.tsx`
   - Add a tiny `data-app-mounted="true"` marker on `#root` once React renders.
   - If mounting fails or stalls, keep the static SacredWorld fallback visible rather than leaving a blank white frame.

4. Keep the existing app logic intact
   - I will not refactor routing, authentication, onboarding, or backend logic.
   - This is a small defensive rendering fix only, aimed specifically at the blank embedded preview.

5. Verify visually after implementation
   - Open the app at `/` in a 390px-wide preview.
   - Confirm the embedded/phone-sized view shows either the SacredWorld splash or the app, never a white blank screen.
   - Check browser console for runtime errors after the change.