I checked the current preview behavior and confirmed the app itself can render: the sandbox browser loads the app and shows the Explore globe screen. That means the previous onboarding fix is not the only issue anymore.

The embedded Lovable preview problem still appears to be related to the preview iframe / auth bridge state, but I also found two app-side issues that can make this worse or confusing:

1. The app can still keep an old service worker from before the latest change. Even though `src/main.tsx` no longer clears caches in production, any service worker already installed in the browser can keep serving old cached content until it updates.
2. `/place/:id` was being opened literally in the preview session. React treats `:id` as the actual place id, so the app may redirect or load the wrong fallback route. The real route should be `/place/<actual-place-id>`.
3. `AppContext` loads onboarding profile fields correctly, but then the separate `user_progress` load path resets `track` and `onboardedAt` back to `null`. That can reintroduce the onboarding redirect race after the profile fetch succeeds.

Plan:

1. Harden the onboarding state merge
   - Update `src/contexts/AppContext.tsx` so loading `user_progress` preserves the existing `track` and `onboardedAt` values instead of resetting them to `null`.
   - This prevents a later progress fetch from wiping the completed onboarding state.

2. Add a one-time service worker/cache refresh for existing stale preview installs
   - Keep production/offline behavior intact long-term.
   - Add a guarded, versioned cleanup that runs once for this fix only, so browsers that already installed the old service worker stop serving stale bundles.
   - Avoid continuously deleting caches on every load.

3. Make the protected-route loading state visible instead of blank
   - Replace the current `return null` while auth/profile is loading with a small SacredWorld loading screen.
   - This way the embedded preview will not look like an empty broken app while authentication/profile state is being resolved.

4. Verify routing behavior
   - Check that the app does not redirect completed users back to onboarding after profile load.
   - Check that protected routes show a loader briefly instead of a blank page.
   - Note that `/place/:id` is a route pattern, not a usable URL; the app needs an actual place id in the URL.

After approval I will implement these small targeted changes. If the Lovable iframe itself still fails after that, the remaining workaround is still to use “open in full screen/new tab”, because that part is controlled by the Lovable editor iframe/auth bridge rather than the app code.