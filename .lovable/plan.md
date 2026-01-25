
# Plan : Repositionner les onglets et agrandir la carte

## Objectif
1. Positionner les 6 onglets d'exploration en bas, juste au-dessus de la navigation principale
2. Agrandir la zone de contenu (map et autres vues) pour éliminer les espaces vides
3. Corriger le bug des icônes manquantes dans BottomNavigation

---

## Calcul des hauteurs pour optimiser l'espace

| Élément | Hauteur estimée |
|---------|-----------------|
| Header (compact sur /explore) | ~48px |
| BottomNavigation | ~72px |
| TabsList (6 onglets) | ~56px |
| **Total réservé** | ~176px |

**Hauteur disponible pour le contenu** : `calc(100vh - 176px)` ou `calc(100dvh - 176px)` pour mobile

---

## Structure visuelle finale

```text
┌─────────────────────────────────┐
│ Header compact (~48px)          │
├─────────────────────────────────┤
│                                 │
│                                 │
│   CONTENU (Map/AR/Lieux...)     │
│   calc(100dvh - 176px)          │
│                                 │
│                                 │
├─────────────────────────────────┤
│ 6 onglets exploration (~56px)   │  ← fixed, z-40
├─────────────────────────────────┤
│ 4 nav principale (~72px)        │  ← fixed, z-50
└─────────────────────────────────┘
```

---

## Modifications à apporter

### 1. `src/pages/Explore.tsx`

**Changements :**

- Supprimer le padding-bottom inutile (sera calculé dynamiquement)
- Supprimer le container wrapper qui ajoute des marges
- Sortir `TabsList` de `TabsContent` pour le rendre fixe et visible sur toutes les vues
- Calculer la hauteur du contenu pour remplir tout l'espace disponible
- Utiliser `100dvh` (dynamic viewport height) pour mieux gérer les barres d'adresse mobiles

```typescript
const Explore = () => {
  // ... hooks existants

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        {/* Contenu qui remplit l'espace disponible */}
        <div className="flex-1 overflow-hidden" style={{ height: 'calc(100dvh - 176px)' }}>
          <TabsContent value="map" className="h-full m-0 p-0">
            <div className="h-full w-full">
              <Globe3D tripPlaces={userProgress.tripPlaces} onCountryClick={handleCountryClick} />
            </div>
          </TabsContent>

          <TabsContent value="ar" className="h-full m-0 p-0">
            <ARCameraView onClose={() => setActiveTab('map')} />
          </TabsContent>

          <TabsContent value="nearby" className="h-full m-0 p-2 overflow-auto">
            <ProximityDetector />
          </TabsContent>

          <TabsContent value="locations" className="h-full m-0 p-2 overflow-auto">
            <LocationsTab />
          </TabsContent>

          <TabsContent value="challenges" className="h-full m-0 p-2 overflow-auto">
            <ChallengesTab />
          </TabsContent>

          <TabsContent value="rankings" className="h-full m-0 p-2 overflow-auto">
            <RankingsTab />
          </TabsContent>
        </div>

        {/* TabsList FIXE au-dessus de BottomNavigation */}
        <TabsList className="fixed bottom-[72px] left-2 right-2 z-40 
          grid grid-cols-6 bg-background/95 backdrop-blur-md 
          shadow-2xl border-2 border-primary/40 p-1.5 rounded-lg">
          <TabsTrigger value="map" className="flex flex-col items-center gap-0.5 py-1.5">
            <Globe className="w-4 h-4" />
            <span className="text-[10px]">Carte</span>
          </TabsTrigger>
          <TabsTrigger value="ar" className="flex flex-col items-center gap-0.5 py-1.5">
            <Camera className="w-4 h-4" />
            <span className="text-[10px]">AR</span>
          </TabsTrigger>
          <TabsTrigger value="nearby" className="flex flex-col items-center gap-0.5 py-1.5">
            <Compass className="w-4 h-4" />
            <span className="text-[10px]">Proche</span>
          </TabsTrigger>
          <TabsTrigger value="locations" className="flex flex-col items-center gap-0.5 py-1.5">
            <MapPin className="w-4 h-4" />
            <span className="text-[10px]">Lieux</span>
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex flex-col items-center gap-0.5 py-1.5">
            <Target className="w-4 h-4" />
            <span className="text-[10px]">Défis</span>
          </TabsTrigger>
          <TabsTrigger value="rankings" className="flex flex-col items-center gap-0.5 py-1.5">
            <Trophy className="w-4 h-4" />
            <span className="text-[10px]">Rang</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <BottomNavigation />
    </div>
  );
};
```

### 2. `src/components/BottomNavigation.tsx`

**Problème** : L'icône n'est pas rendue (ligne 47 est vide après `<Icon>`)

**Correction** : Ajouter le rendu de l'icône

```typescript
return (
  <button key={item.path} onClick={() => navigate(item.path)} className={...}>
    <Icon className="w-5 h-5" />  {/* ← Ajouter cette ligne */}
    <span className="text-[10px] font-medium">{item.label}</span>
  </button>
);
```

---

## Fichiers à modifier

| Fichier | Modifications |
|---------|---------------|
| `src/pages/Explore.tsx` | Restructurer layout, sortir TabsList, utiliser 100dvh |
| `src/components/BottomNavigation.tsx` | Ajouter le rendu de l'icône manquante |

---

## Améliorations apportées

1. **Map plein écran** : La carte occupe maintenant tout l'espace vertical disponible sans bordures ni marges inutiles

2. **Onglets toujours visibles** : Les 6 onglets sont fixes et accessibles depuis toutes les vues

3. **Labels toujours affichés** : Chaque onglet a une icône + label visible (même sur mobile)

4. **Navigation cohérente** : Les icônes de Journal/Calendrier/Profil/Réglages seront à nouveau visibles

5. **Compatibilité mobile** : Utilisation de `100dvh` pour gérer correctement la barre d'adresse mobile

---

## Résultat attendu

- La carte 3D remplira tout l'espace entre le header et les barres de navigation
- Aucun espace vide visible
- Navigation fluide entre les 6 modes d'exploration
- Interface cohérente sur mobile et desktop
