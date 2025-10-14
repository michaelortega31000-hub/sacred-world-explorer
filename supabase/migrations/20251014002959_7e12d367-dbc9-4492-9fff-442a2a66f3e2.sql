-- Rendre le bucket memory-photos public pour permettre l'affichage des photos
UPDATE storage.buckets 
SET public = true 
WHERE id = 'memory-photos';

-- S'assurer que les politiques d'accès permettent la lecture publique
DROP POLICY IF EXISTS "Public Access to view memory photos" ON storage.objects;
CREATE POLICY "Public Access to view memory photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'memory-photos');

-- Politique pour permettre aux utilisateurs authentifiés d'uploader leurs photos
DROP POLICY IF EXISTS "Users can upload their memory photos" ON storage.objects;
CREATE POLICY "Users can upload their memory photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'memory-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique pour permettre aux utilisateurs de supprimer leurs propres photos
DROP POLICY IF EXISTS "Users can delete their memory photos" ON storage.objects;
CREATE POLICY "Users can delete their memory photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'memory-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);