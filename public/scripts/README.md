# Scripts Architecture - Poppy Music

## 📁 Structure Modulaire

```
public/scripts/
├── stickyPlayer.js       # Gestion du player audio sticky
├── albumInteractions.js  # Interactions avec les albums/vinyles
└── README.md            # Cette documentation
```

## 🎵 stickyPlayer.js

**Responsabilités :**
- Contrôle du player audio sticky en bas de page
- Gestion de la lecture/pause/navigation entre morceaux
- Synchronisation de l'interface (titre, artiste, cover, progress)
- Auto-play et boucle des morceaux
- Contrôle du volume

**Méthodes principales :**
- `playTrack(index)` - Lance un morceau et met à jour l'interface
- `stopAllTracks()` - Arrête tous les morceaux en cours
- `show()/hide()` - Affiche/cache le player sticky

## 🎨 albumInteractions.js

**Responsabilités :**
- Gestion des clics sur les albums/vinyles
- Animation d'ouverture des covers
- Intégration avec le sticky player
- Navigation smooth scroll

**Fonctions principales :**
- `initAlbumInteractions(stickyPlayer)` - Configure les interactions albums
- `initSmoothScroll()` - Active le défilement fluide

## 🔧 Avantages de cette Architecture

✅ **Modulaire** : Code séparé par responsabilité  
✅ **Maintenable** : Plus facile à déboguer et modifier  
✅ **Réutilisable** : Modules réutilisables dans d'autres projets  
✅ **Scalable** : Facile d'ajouter de nouvelles fonctionnalités  
✅ **Lisible** : index.astro réduit de 820 → 570 lignes  

## 🚀 Utilisation

```javascript
// Dans index.astro
import { StickyPlayer } from '/scripts/stickyPlayer.js';
import { initAlbumInteractions, initSmoothScroll } from '/scripts/albumInteractions.js';

const stickyPlayer = new StickyPlayer();
initAlbumInteractions(stickyPlayer);
initSmoothScroll();
```
