// In DEV builds, gate components and "go to /auth" redirects are silently
// bypassed so designers can preview every surface without a Supabase session.
// In production this collapses to `false` and is dead-code-eliminated.
export const isDevAuthBypassed = (): boolean => import.meta.env.DEV;
