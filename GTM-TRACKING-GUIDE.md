# 🎯 Guide Google Tag Manager - Poppy Music

## 📊 Vue d'ensemble du système de tracking

Google Tag Manager est maintenant intégré dans Poppy Music pour tracker le comportement des utilisateurs à travers le funnel de conversion complet.

## 🏗️ Architecture technique

### Composants créés

#### 1. `GTMTracker.js` - Moteur de tracking
```javascript
// Instance globale accessible via window.GTMTracker
const tracker = getGTMTracker();

// Événements principaux
tracker.trackEvent('nom_evenement', { parametres });
tracker.trackFormStep(stepNumber, stepName, direction);
tracker.trackPaymentStart(amount, currency);
tracker.trackPaymentComplete(sessionData);
```

#### 2. `GTMInit.astro` - Initialisation automatique
- Injecté automatiquement dans les pages avec GTM
- Configure les listeners d'événements
- Initialise le tracking des interactions utilisateur

#### 3. `GTM.astro` - Injection du script GTM
- Container ID : `GTM-NGZ6SCTP`
- Exclusion automatique des pages admin
- Compatible avec Google Analytics existant

## 🎯 Événements trackés

### 1. Session & Navigation
```javascript
// Au chargement de page
session_start: {
  page_url: "/brief-new",
  page_title: "Créer ma chanson - Poppy Music",
  referrer: "...",
  user_agent: "..."
}

// Vue de page formulaire
page_view: {
  page_type: "form",
  form_name: "brief_creation"
}
```

### 2. Formulaire (12 étapes)
```javascript
// Début du formulaire
form_started: {
  event_category: "Brief Form",
  event_label: "Form Initialized",
  step_number: 1
}

// Progression dans les étapes
form_step: {
  step_number: 3,
  step_name: "Choix du destinataire",
  direction: "forward",
  time_spent: 45000, // ms
  completion_rate: 25 // %
}

// Étapes spécifiques
form_purpose_selected: {
  purpose_type: "Anniversaire Adulte",
  step_number: 3
}

// Soumission finale
form_submission: {
  form_name: "brief_creation",
  song_title: "Ma Chanson Personnalisée",
  purpose_tag: "Anniversaire",
  estimated_value: 19900
}
```

### 3. Paiement & Conversion
```javascript
// Début du processus de paiement
begin_checkout: {
  currency: "EUR",
  value: 199,
  items: [{
    item_name: "Chanson personnalisée Poppy Music",
    item_category: "Music Production",
    price: 199,
    quantity: 1
  }]
}

// Validation du paiement
purchase: {
  transaction_id: "cs_live_xxx",
  currency: "EUR",
  value: 199,
  tax: 0,
  shipping: 0,
  customer_email: "client@email.com",
  payment_method: "stripe",
  items: [...]
}
```

### 4. Interactions utilisateur
```javascript
// Focus sur un champ
user_interaction: {
  action: "field_focus",
  element: "email",
  field_type: "email"
}

// Clic sur bouton
button_click: {
  button_name: "cta_hero",
  page_context: "/brief-new"
}

// Erreur de validation
error: {
  error_type: "form_validation",
  error_message: "Champ requis non rempli",
  field_name: "email"
}
```

### 5. Abandon de formulaire
```javascript
form_abandon: {
  step_number: 5,
  step_name: "Informations personnelles",
  time_spent: 120000, // 2 minutes
  completion_rate: 42,
  last_step: 5
}
```

## 📈 Métriques disponibles dans GTM

### Funnel de conversion
1. **Session start** → Visite de la page
2. **Form started** → Clic sur CTA
3. **Form step 1-12** → Progression dans le formulaire
4. **Form submission** → Soumission du brief
5. **Begin checkout** → Accès au paiement
6. **Purchase** → Validation du paiement

### Taux de conversion par étape
- Étape 1 → Étape 2 : Taux d'engagement initial
- Étape 6 → Étape 7 : Point médian du formulaire
- Étape 12 → Soumission : Taux de complétion
- Soumission → Paiement : Taux de conversion paiement
- Paiement → Purchase : Taux de succès Stripe

### Métriques comportementales
- **Temps moyen par étape** : Identifier les blocages
- **Taux d'abandon par étape** : Points d'optimisation
- **Temps total du formulaire** : Expérience utilisateur
- **Interactions par champ** : Usabilité des formulaires

## 🛠️ Configuration GTM recommandée

### Triggers à créer

#### 1. Form Step Progression
```
Trigger Type: Custom Event
Event Name: form_step
Conditions:
  - step_number equals [numéro d'étape]
```

#### 2. Form Abandon
```
Trigger Type: Custom Event
Event Name: form_abandon
Conditions:
  - step_number less than 12
  - completion_rate less than 100
```

#### 3. Purchase Conversion
```
Trigger Type: Custom Event
Event Name: purchase
Conditions:
  - transaction_id does not equal (empty)
```

### Variables personnalisées

#### 1. Form Progress
```
Variable Type: Data Layer Variable
Data Layer Variable Name: step_number
```

#### 2. Completion Rate
```
Variable Type: Data Layer Variable
Data Layer Variable Name: completion_rate
```

#### 3. Transaction Value
```
Variable Type: Data Layer Variable
Data Layer Variable Name: value
```

### Tags recommandés

#### 1. Google Analytics 4
- Configuration automatique
- Événements améliorés activés
- Suivi des conversions e-commerce

#### 2. Facebook Pixel
- Événements : InitiateCheckout, Purchase
- Paramètres : value, currency, content_name

#### 3. LinkedIn Insight Tag
- Suivi des conversions B2B
- Remarketing professionnel

## 🎯 Cas d'usage avancés

### A/B Testing
```javascript
// Version A vs B du formulaire
tracker.trackEvent('form_variant', {
  variant: 'version_a',
  step_number: currentStep
});
```

### Remarketing
```javascript
// Utilisateur abandon à l'étape 8
tracker.trackEvent('remarketing_eligible', {
  abandon_step: 8,
  estimated_value: 199,
  days_since_abandon: 0
});
```

### Personnalisation
```javascript
// Préférences utilisateur
tracker.trackEvent('user_preference', {
  music_genre: selectedGenre,
  song_type: selectedType,
  target_audience: selectedAudience
});
```

## 🔧 Debugging & Maintenance

### Console logs
```javascript
// Voir les événements trackés
console.log('GTM Event:', eventName, parameters);

// Vérifier si GTM est disponible
console.log('GTM Available:', window.dataLayer ? 'Yes' : 'No');
```

### Validation des événements
```javascript
// Vérifier la structure des données
window.GTMTracker.getUserJourney();
```

### Tests manuels
1. Ouvrir les dev tools
2. Aller dans Console
3. Taper `dataLayer` pour voir les événements
4. Vérifier Network → gtm.js se charge
5. Vérifier GTM → Real-time → Events arrivent

## 📊 Dashboard Analytics recommandé

### 1. Vue d'ensemble du funnel
```
Sessions → Form Starts → Form Completions → Checkouts → Purchases
```

### 2. Analyse des abandons
```
Abandon Rate par étape
Temps moyen avant abandon
Pages de sortie les plus fréquentes
```

### 3. Performance du formulaire
```
Temps de complétion moyen
Taux de conversion par étape
Erreurs de validation par champ
```

### 4. Revenus
```
Valeur moyenne des commandes
Taux de conversion global
ROI par canal d'acquisition
```

## 🚀 Déploiement

### Sur le serveur
```bash
cd /var/www/poppymusic
git pull origin main
npm run build
pm2 restart poppymusic --update-env
```

### Vérifications post-déploiement
- ✅ GTM script chargé sur les pages
- ✅ dataLayer initialisé
- ✅ Événements arrivent dans GTM
- ✅ Conversions trackées dans Analytics
- ✅ Pas de GTM sur les pages admin

---

## 🎯 Résumé

Le système de tracking GTM de Poppy Music fournit maintenant :

✅ **Suivi complet du funnel** : Visite → Formulaire → Paiement → Conversion
✅ **Métriques détaillées** : Taux de conversion, temps passé, abandons
✅ **Événements riches** : Données structurées pour l'analyse
✅ **Intégration transparente** : Compatible avec tous les outils marketing
✅ **Maintenance facile** : Architecture modulaire et extensible

**Prêt pour optimiser les conversions et améliorer l'expérience utilisateur !** 🚀
