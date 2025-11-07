-- PHASE 1: SÉCURISATION DES POLITIQUES RLS
-- Correction des accès non authentifiés sur profiles, memories et restaurants

-- =====================================================
-- TABLE: profiles
-- Problème: Profils publics accessibles sans authentification
-- Solution: Exiger l'authentification pour tous les SELECT
-- =====================================================

-- Supprimer l'ancienne politique trop permissive
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Créer une nouvelle politique qui exige l'authentification
CREATE POLICY "Authenticated users can view public profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (is_public = true OR auth.uid() = id);

-- =====================================================
-- TABLE: memories
-- Problème: Souvenirs publics accessibles sans authentification
-- Solution: Exiger l'authentification pour voir les souvenirs
-- =====================================================

-- Supprimer l'ancienne politique trop permissive
DROP POLICY IF EXISTS "Users can view public memories and their own memories" ON public.memories;

-- Créer une nouvelle politique qui exige l'authentification
CREATE POLICY "Authenticated users can view public memories"
ON public.memories
FOR SELECT
TO authenticated
USING (is_public = true OR auth.uid() = user_id);

-- =====================================================
-- TABLE: restaurants
-- Problème: Restaurants vérifiés (avec téléphones/adresses) accessibles sans auth
-- Solution: Exiger l'authentification pour protéger les données de contact
-- =====================================================

-- Supprimer l'ancienne politique trop permissive
DROP POLICY IF EXISTS "Anyone can view verified restaurants" ON public.restaurants;

-- Créer une nouvelle politique qui exige l'authentification
CREATE POLICY "Authenticated users can view verified restaurants"
ON public.restaurants
FOR SELECT
TO authenticated
USING (verified = true);

-- =====================================================
-- AUDIT: Vérifier que RLS est activé sur toutes les tables critiques
-- =====================================================

-- Ces commandes sont idempotentes (pas d'erreur si déjà activé)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visit_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;