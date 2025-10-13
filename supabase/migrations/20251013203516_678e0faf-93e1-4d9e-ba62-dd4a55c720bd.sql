-- Ajouter un champ is_public à la table memories
ALTER TABLE public.memories 
ADD COLUMN is_public boolean NOT NULL DEFAULT false;

-- Créer un index pour optimiser les requêtes de photos publiques
CREATE INDEX idx_memories_place_public ON public.memories(place_id, is_public) WHERE is_public = true;

-- Modifier les RLS policies pour permettre de voir les memories publiques
DROP POLICY IF EXISTS "Users can view their own memories" ON public.memories;

CREATE POLICY "Users can view public memories and their own memories" 
ON public.memories 
FOR SELECT 
USING (is_public = true OR auth.uid() = user_id);