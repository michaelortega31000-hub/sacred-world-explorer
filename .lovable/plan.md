
# Plan : Intégrer les suggestions prédéfinies dans l'assistant

## Résumé

Ajouter les fonctions `normalizeRoute` et `getInitialSuggestions` fournies par l'utilisateur, puis afficher des boutons de suggestions cliquables dans l'état vide de l'assistant.

---

## Modifications

### Fichier : `src/components/AssistantChat.tsx`

**1. Ajouter le type `Suggestion` et les fonctions utilitaires**

Après le type `Mode` (ligne 48), ajouter :
- Type `Suggestion` avec `label` et `message`
- Fonction `normalizeRoute` pour matcher les routes dynamiques
- Fonction `getInitialSuggestions` avec le mapping complet

**2. Créer un `useMemo` pour les suggestions initiales**

Dans le composant, après les hooks existants :

```tsx
const initialSuggestions = useMemo(
  () => getInitialSuggestions(location.pathname, mode),
  [location.pathname, mode]
);
```

**3. Modifier l'état vide (lignes 168-177)**

Remplacer le simple texte par :
- L'icône et le texte d'accueil
- Des boutons cliquables pour chaque suggestion
- Au clic, envoyer le message et démarrer la conversation

Nouveau rendu :

```tsx
{messages.length === 0 && (
  <div className="text-center py-6">
    <MessageCircle className="h-10 w-10 mx-auto mb-3 opacity-50" />
    <p className="text-sm text-muted-foreground mb-4">
      {mode === "help" 
        ? "Posez vos questions sur l'application !" 
        : "Découvrez l'histoire des lieux sacrés !"}
    </p>
    <div className="flex flex-wrap gap-2 justify-center">
      {initialSuggestions.map((suggestion, idx) => (
        <Button
          key={idx}
          variant="outline"
          size="sm"
          className="text-xs h-auto py-1.5 px-3"
          disabled={isLoading}
          onClick={() => {
            const userMessage: Message = {
              id: crypto.randomUUID(),
              role: "user",
              content: suggestion.message,
            };
            setMessages((prev) => [...prev, userMessage]);
            handleSendWithMessage(suggestion.message);
          }}
        >
          {suggestion.label}
        </Button>
      ))}
    </div>
  </div>
)}
```

---

## Résultat

| Route | Mode | Suggestions affichées |
|-------|------|----------------------|
| `/country/Kazakhstan` | help | 🗺️ Lieux sacrés, 📚 Traditions, 📅 3 faits |
| `/country/Kazakhstan` | history | 🗺️ Lieux sacrés, 📚 Traditions, 📅 3 faits |
| `/place/123` | help | 📅 Dates clés, 📜 Anecdote, 🗺️ Voir autour |
| `/explore` | help | 🔎 Près de moi, 🧭 Filtrer, ✨ Itinéraire |
| Autre | history | 📚 Lieu célèbre, ✨ Anecdote, 🔎 Lieu méconnu |

---

## Fichier modifié

| Fichier | Changements |
|---------|-------------|
| `src/components/AssistantChat.tsx` | +60 lignes (types + fonctions + rendu) |
