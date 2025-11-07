-- PHASE 2: CORRECTION DES VUES SECURITY DEFINER
-- Les vues avec SECURITY DEFINER contournent les RLS et créent des risques de sécurité

-- =====================================================
-- Recréer les vues publiques SANS security definer
-- Ces vues exposent des données publiques de manière contrôlée
-- =====================================================

-- Vue: public_user_stats
-- Objectif: Exposer les statistiques publiques des utilisateurs
DROP VIEW IF EXISTS public.public_user_stats CASCADE;

CREATE VIEW public.public_user_stats 
WITH (security_invoker=true) AS
SELECT 
  p.id,
  p.username,
  p.avatar_url,
  p.created_at,
  up.total_points,
  up.current_streak,
  up.longest_streak,
  up.selected_religion,
  COALESCE(array_length(up.visited_places, 1), 0) as visited_places_count,
  COALESCE(array_length(up.badges, 1), 0) as badges_count
FROM public.profiles p
LEFT JOIN public.user_progress up ON p.id = up.user_id
WHERE p.is_public = true;

-- Vue: avatar_collector_stats  
-- Objectif: Classement des collectionneurs d'avatars
DROP VIEW IF EXISTS public.avatar_collector_stats CASCADE;

CREATE VIEW public.avatar_collector_stats
WITH (security_invoker=true) AS
SELECT 
  p.id as user_id,
  p.username,
  p.avatar_url,
  COUNT(DISTINCT uua.avatar_id) as total_unlocked,
  COUNT(DISTINCT CASE WHEN da.rarity = 'legendary' THEN uua.avatar_id END) as legendary_count,
  COUNT(DISTINCT CASE WHEN da.rarity = 'epic' THEN uua.avatar_id END) as epic_count,
  COUNT(DISTINCT CASE WHEN da.rarity = 'rare' THEN uua.avatar_id END) as rare_count,
  COUNT(DISTINCT CASE WHEN da.rarity = 'common' THEN uua.avatar_id END) as common_count,
  MAX(uua.unlocked_at) as last_unlock_at
FROM public.profiles p
LEFT JOIN public.user_unlocked_default_avatars uua ON p.id = uua.user_id
LEFT JOIN public.default_avatars da ON uua.avatar_id = da.id
WHERE p.is_public = true
GROUP BY p.id, p.username, p.avatar_url;

-- Vue: public_profiles
-- Objectif: Profils publics simplifiés
DROP VIEW IF EXISTS public.public_profiles CASCADE;

CREATE VIEW public.public_profiles
WITH (security_invoker=true) AS
SELECT 
  id,
  username,
  created_at
FROM public.profiles
WHERE is_public = true;

-- Vue: user_profile (si elle existe)
-- Objectif: Profil utilisateur complet (accessible uniquement par l'utilisateur lui-même)
DROP VIEW IF EXISTS public.user_profile CASCADE;

CREATE VIEW public.user_profile
WITH (security_invoker=true) AS
SELECT 
  p.id,
  p.username,
  p.avatar_url,
  p.is_public,
  p.created_at,
  p.updated_at
FROM public.profiles p
WHERE p.id = auth.uid();

-- =====================================================
-- Ajouter des politiques RLS sur les vues (optionnel mais recommandé)
-- Note: Les vues héritent maintenant des politiques des tables sous-jacentes
-- grâce à security_invoker=true
-- =====================================================

COMMENT ON VIEW public.public_user_stats IS 'Vue publique des statistiques utilisateurs. Utilise security_invoker pour respecter les RLS des tables sous-jacentes.';
COMMENT ON VIEW public.avatar_collector_stats IS 'Classement des collectionneurs d''avatars. Utilise security_invoker pour respecter les RLS.';
COMMENT ON VIEW public.public_profiles IS 'Profils publics simplifiés. Utilise security_invoker pour respecter les RLS.';
COMMENT ON VIEW public.user_profile IS 'Profil complet de l''utilisateur connecté. Utilise security_invoker pour respecter les RLS.';