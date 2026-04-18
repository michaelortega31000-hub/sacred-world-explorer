---
name: denomination-and-forum-segmentation
description: Phase 4 — denomination identity (catholique/protestant/curieux), strict Christianisme map filter, and Forum sub-tabs Public/Catholique/Protestant
type: feature
---
- `user_progress.denomination` (text, nullable) holds `catholique` | `protestant` | `curieux`. Persisted via `setDenomination` in AppContext + localStorage fallback.
- New onboarding screen `/onboarding/denomination` reached from Splash CTA when logged-in user has no denomination.
- Map filter (`MonumentFilter.tsx`) is locked to Christianisme only — other religions hidden from UI.
- Forum sub-tabs (`ForumTab.tsx`): **Public** (visibility=global, all users), **Forum Catholique** (denomination==='catholique', topics religion='catholique' visibility='public'), **Forum Protestant** (denomination==='protestant'). Curieux see only Public.
- Edge function `create-forum-topic` accepts `religionOverride: 'catholique' | 'protestant'` and verifies it matches stored denomination server-side.
- DB function `get_user_denomination(uuid)` + additive RLS SELECT policy on `forum_topics` enforce denomination access at the database level.
