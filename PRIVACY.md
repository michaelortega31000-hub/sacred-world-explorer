# Privacy & Data Protection — SacredWorld

_Last updated: 2026-05-02 (Phase 2.4)._

This document describes what data SacredWorld collects, why, where it lives, who processes it, how long it is retained, and how a user erases it. It is the canonical reference; product copy and consent UIs must reflect it.

## 1. What we collect

| Category | Data | Source | Why |
|---|---|---|---|
| Identity | email, username, denomination/track, denomination change history | sign-up, onboarding, /settings | account, content scoping, audit trail |
| Profile | avatar URL, bio, language preference | /settings | personalization |
| Preferences | trip plan, saved POIs, restaurant favorites, journal entries | in-app actions | feature surface |
| Gamification | XP, badges, current/longest streak, last quest date, visited places | server-side via edge functions only | progression, leaderboards |
| Geolocation — at rest | `home_location` (PostGIS Point, opt-in) | onboarding step 2 or /settings | distance multiplier on check-ins |
| Geolocation — at moment of check-in | precise lat/lng | browser geolocation API | one-shot validation only; **never persisted** as raw GPS |
| Check-in records | `(user_id, location_id, distance_km, multiplier, raw_xp, normalized_xp, photo_url?)` | check-in flow | leaderboard, history |
| Location history (optional) | timestamped lat/lng pings | only if user explicitly enables continuous tracking | friend activity / community map (default off) |
| Forum & community | posts, comments, reports, reactions | in-app actions | moderation, social features |
| AI assistant | message text, response, optional voice transcript | sacred-assistant edge fn | conversation continuity |
| Push subscriptions | VAPID endpoint per device | service worker registration | notifications |
| Audit & security | event_type, severity, endpoint, status, IP, user agent | every protected endpoint | abuse detection, auto-ban |

## 2. What we do NOT store

- The user's raw GPS at the moment of a check-in. Only the resolved `location_id`, the computed `distance_km` from `home_location`, the multiplier, and the awarded XP are persisted. The browser-supplied lat/lng exists only in-memory inside the `claim-checkin` edge function for the duration of a single request.
- Bank account numbers, social-security numbers, full credit-card data. Payment data is delegated to Stripe; we store only the Stripe customer/subscription IDs.
- Full session-recording or replay data.
- Browser-fingerprint signals beyond user agent + IP necessary for abuse detection.

## 3. Consent model

Granular consents are stored on `profiles.consents` (jsonb, versioned). They are independent and revocable in `/settings → Privacy`.

| Toggle | Default | What it controls |
|---|---|---|
| `geolocation_checkin` | **off** until granted (granted in onboarding step 3 by default) | Allows the browser to read precise GPS at the moment of a check-in. |
| `geolocation_friends` | **off** | Lets your friends see your approximate (city-level) position. |
| `community_map` | **off** | Lets your profile appear on the community map of your tradition. |

A user may proceed past onboarding without granting any of the three. Check-in features that require precise GPS will then show a one-shot prompt asking for `geolocation_checkin` at the moment of use.

The TOS acceptance is a separate event from any of the above.

## 4. Where data lives — third-party processors

| Processor | Role | Data sent | Region |
|---|---|---|---|
| Supabase | Postgres, Auth, Storage, Edge Functions | all of section 1 except as noted | EU (project default — confirm) |
| Mapbox | Tiles & routing | viewport coordinates, search queries (no user identifier sent) | global CDN |
| OpenAI / Lovable AI | `sacred-assistant` chat, photo moderation | message text, photo bytes (transient) | US |
| ElevenLabs | TTS for audio guides | the text to be spoken | US |
| Resend (Phase 2.11) | Transactional email (denomination-change confirm) | email address, token | EU |
| Cloudflare Turnstile (Phase 2.11) | Captcha on sensitive flows | minimal challenge metadata | global |
| Stripe (Phase 2.12) | Payments | name, email, payment method | global |

If you are a user reading this and any processor's region is unacceptable to you, contact us — we'll honor the request to delete and refuse to recreate.

## 5. Retention

| Data | Retention |
|---|---|
| Identity, profile, preferences | until account deletion |
| Gamification (XP, badges, streaks) | until account deletion |
| `location_history` (raw GPS pings) | 90 days, then auto-purged via `cleanup_old_location_history()` |
| `check_ins` | until account deletion or user-initiated erasure |
| Forum content | retained; deletions are soft-delete with audit (Phase 2.10) |
| `security_logs` | 365 days, then archived |
| AI assistant transcripts | 30 days, then anonymized |

## 6. Right to erasure

A user can:

- **Erase only location data** without losing the account: `/settings → Privacy → Erase location history`. Calls `erase_my_location_history()` RPC. Wipes `location_history`, `check_ins`, `home_location`, `home_location_set_at`. **Aggregate XP earned from check-ins is retained** (the gameplay outcome is not undone).
- **Delete the entire account**: contact form / email. We hard-delete from `auth.users` (CASCADE wipes all owned rows under FK constraints). Forum content authored by the deleted user is preserved as `[deleted]` with no user_id link. Audit logs are retained per legal requirement and pseudonymized.

## 7. Data subject access

A user can request a JSON export of all their data via support. Export includes everything in §1 except processor-internal IDs.

## 8. Security posture

- All tables have RLS enabled. Owner-only or admin-only by default.
- Gamification columns on `user_progress` are protected by a BEFORE INSERT/UPDATE trigger that rejects client-side mutation; only service-role (edge functions) may write them.
- Edge functions enforce JWT and rate-limit via `security_logs`.
- Auto-ban is fed by `rate_limit_exceeded`, `suspicious_activity`, `unauthorized_access` events.
- Secrets live in Supabase Edge Function secrets, never in client bundles. The previously-hardcoded Mapbox token has been removed and must be rotated and domain-restricted.

## 9. Children

The app is not directed at users under 13. We do not knowingly collect data from such users. Reports trigger account suspension and erasure.

## 10. Contact

privacy@<your-domain>.<tld>

---

This is a living document. Changes are tracked in git history and material changes are surfaced to existing users via in-app notice + email.
