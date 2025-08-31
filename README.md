# Poppy Music - Studio de Production Musicale Premium

Un site web premium pour **Poppy Music**, un studio de production musicale qui transforme vos idées en œuvres musicales authentiques grâce à l'alliance de l'intelligence artificielle et de l'expertise humaine.

## 🎵 Fonctionnalités

- **Design Premium** : Esthétique sombre inspirée des labels musicaux modernes comme Ninja Tune
- **Responsive** : Optimisé pour mobile, tablette et desktop
- **Performance** : Construit avec Astro.js pour une vitesse optimale
- **Accessibilité** : Contrastes AA, navigation clavier, sémantique HTML
- **Animations** : Micro-interactions fluides et effets de parallax subtils

## 🎨 Design System

- **Couleurs** :
  - Fond principal : `#0B0B0B`
  - Fond secondaire : `#121212`  
  - Accent or : `#E7C873`
  - Texte principal : `#F3F4F6`
  - Texte secondaire : `#D1D5DB`

- **Typographie** :
  - Titres : Fraunces (serif contrastée)
  - Corps : Inter (sans-serif moderne)

- **Style** : Grands espaces, grilles 12 colonnes, arrondis 2xl, ombres douces

## 🚀 Installation et lancement

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Démarrage rapide
```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Le site sera accessible sur http://localhost:4321
```

### Commandes disponibles
```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualiser le build
npm run astro        # CLI Astro
```

## 📱 Sections du site

1. **Hero** - Titre accrocheur avec CTAs
2. **Comparaisons** - Références vs nos productions
3. **Processus** - 4 étapes IA + Humain
4. **Showcase** - 6 exemples avec lecteurs audio
5. **Offre & Prix** - Tarification transparente à 199€
6. **Témoignages** - Avis clients authentiques
7. **FAQ** - Questions légales et pratiques
8. **Footer** - Navigation et contact

## 🎧 Fonctionnalités audio

- Lecteurs audio HTML5 intégrés
- Pause automatique des autres pistes
- Interface personnalisée
- Placeholders pour les fichiers audio

## 📝 Personnalisation

Pour adapter le site à votre marque :

1. **Variables** dans `src/pages/index.astro` :
   ```javascript
   const BRAND_NAME = "VotreMarque";
   const PRICE = "199€";
   const PRIMARY_CTA = "Votre CTA";
   const CONTACT = "contact@votremarque.com";
   ```

2. **Couleurs** dans `src/styles/global.css` :
   - Modifiez les variables CSS custom properties
   - Adaptez les classes Tailwind

3. **Contenu** :
   - Remplacez les textes par vos propres contenus
   - Ajoutez vos vrais fichiers audio
   - Personnalisez les témoignages

## 🛠 Technologies utilisées

- **Astro.js** - Framework web moderne
- **Tailwind CSS** - Framework CSS utilitaire
- **TypeScript** - Typage statique
- **HTML5 Audio** - Lecteurs audio natifs

## 📦 Structure du projet

```
src/
├── pages/
│   └── index.astro          # Page principale
├── styles/
│   └── global.css           # Styles globaux + variables
└── components/              # Composants réutilisables (à créer)
```

## 🚀 Déploiement

Pour déployer en production :

```bash
npm run build
```

Le dossier `dist/` contiendra les fichiers optimisés prêts pour la production.

Compatible avec :
- Netlify
- Vercel  
- GitHub Pages
- Tout hébergeur statique

## 📄 Licence

Ce projet est créé pour usage commercial. Adaptez selon vos besoins.

---

**Poppy Music** - Devenez producteur de votre chanson. 🎵✨

*Déployé automatiquement sur Digital Ocean via GitHub Actions*
