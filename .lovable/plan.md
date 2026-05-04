Le problème visible est maintenant isolé : l’application finit par démarrer dans une session propre, mais le démarrage est trop fragile et trop lourd dans l’aperçu intégré. Le shell de chargement s’affiche, puis l’app attend le chargement de beaucoup de modules avant de masquer l’écran. Chez toi, cela reste bloqué sur “Chargement…” malgré les boutons de récupération.

Plan de correction :

1. Rendre l’écran de démarrage autonome et non bloquant
- Ne plus dépendre uniquement de l’attribut React `data-app-mounted` pour cacher l’écran “Chargement…”.
- Ajouter une logique de secours qui masque le shell dès que `#root` contient réellement du contenu React.
- Si React échoue, afficher un message clair avec un bouton de récupération, mais ne pas masquer une app déjà rendue.

2. Alléger fortement le chargement initial
- Modifier `src/App.tsx` pour charger les pages lourdes à la demande avec `React.lazy` et `Suspense`.
- Garder les pages critiques du démarrage rapides : `/`, `/auth`, `/welcome`.
- Charger seulement les pages nécessaires quand l’utilisateur navigue vers elles : globe 3D, journal, profil, admin, paramètres, pays, lieux, planner, etc.
- Cela évite que l’écran d’accueil doive télécharger presque toute l’application avant d’apparaître.

3. Corriger la cause probable liée au cache/service worker
- Ajuster `public/sw.js` pour ne jamais servir `index.html`, `/`, les scripts Vite/React, ni les modules `/src/...` en mode cache-first.
- Passer ces fichiers en “network-first” ou les exclure du cache afin qu’une ancienne version ne puisse pas coincer l’iframe.
- Garder le cache utile pour les images et l’offline, sans bloquer le démarrage.

4. Désactiver l’enregistrement du service worker dans l’aperçu de développement
- Adapter `src/hooks/usePushNotifications.ts` pour éviter `navigator.serviceWorker.register('/sw.js')` en environnement de preview/dev.
- Les notifications resteront disponibles en production, mais l’aperçu Lovable ne sera plus piégé par un ancien service worker.

5. Remplacer le reset actuel par une récupération plus sûre
- Supprimer le comportement qui peut recharger automatiquement au mauvais moment.
- Utiliser une purge de cache explicite et non destructive, sans boucle de reload.
- Conserver les préférences utilisateur importantes dans `localStorage` autant que possible.

6. Vérification après correction
- Recharger la route `/` à la taille actuelle de ton aperçu.
- Vérifier que l’écran SacredWorld apparaît sans rester bloqué.
- Vérifier que le bouton “Continuer” reste visible et fonctionnel.
- Vérifier qu’aucune erreur console ne bloque le rendu.

Résultat attendu : l’app doit s’ouvrir directement sur la page SacredWorld au lieu de rester sur “SACREDWORLD — CHARGEMENT…”, même dans l’aperçu intégré.