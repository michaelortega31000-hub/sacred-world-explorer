-- Ajouter la colonne continent à la table restaurants
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS continent text;

-- Ajouter un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_restaurants_continent ON public.restaurants(continent);
CREATE INDEX IF NOT EXISTS idx_restaurants_country ON public.restaurants(country);
CREATE INDEX IF NOT EXISTS idx_restaurants_city ON public.restaurants(city);