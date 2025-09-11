# 🎯 Guide Événements GTM - Poppy Music

## 📊 Événements Google Analytics (gtag) disponibles

Le site envoie maintenant des événements `gtag` simples que vous pouvez facilement récupérer dans Google Tag Manager.

## 🎯 Événements principaux

### 1. Début du formulaire
```javascript
gtag('event', 'form_started', {
  event_category: 'Brief Form',
  event_label: 'Form Initialized',
  step_number: 1
});
```

### 2. Progression dans les étapes
```javascript
// Étape terminée
gtag('event', 'form_step_completed', {
  event_category: 'Brief Form',
  event_label: 'Step X',
  step_number: X,
  step_name: 'Nom de l\'étape'
});

// Nouvelle étape commencée
gtag('event', 'form_step_started', {
  event_category: 'Brief Form',
  event_label: 'Step X',
  step_number: X,
  step_name: 'Nom de l\'étape'
});
```

### 3. Sélection du type de chanson
```javascript
gtag('event', 'form_purpose_selected', {
  event_category: 'Brief Form',
  event_label: 'Anniversaire Adulte', // ou autre type
  purpose_type: 'Anniversaire Adulte',
  step_number: 3
});
```

### 4. Retour en arrière
```javascript
gtag('event', 'form_step_back', {
  event_category: 'Brief Form',
  event_label: 'Back from Step X to Y',
  step_number: X
});
```

### 5. Formulaire terminé
```javascript
gtag('event', 'form_completed', {
  event_category: 'Brief Form',
  event_label: 'All Steps Completed',
  value: 199
});
```

### 6. Redirection vers paiement
```javascript
gtag('event', 'form_proceed_to_payment', {
  event_category: 'Brief Form',
  event_label: 'Redirect to Payment',
  value: 199
});
```

### 7. Conversion finale (page confirmation)
```javascript
// Événement purchase
gtag('event', 'purchase', {
  event_category: 'Payment',
  transaction_id: 'session_id',
  value: 199,
  currency: 'EUR',
  items: [{
    item_id: 'chanson-personnalisee',
    item_name: 'Chanson Personnalisée',
    category: 'Music Production',
    quantity: 1,
    price: 199
  }]
});

// Page de confirmation
gtag('event', 'conversion_confirmation', {
  event_category: 'Payment',
  event_label: 'Payment Confirmed',
  value: 199
});
```

### 8. Abandon de formulaire
```javascript
gtag('event', 'form_abandoned', {
  event_category: 'Brief Form',
  event_label: 'Abandoned at Step X',
  step_number: X,
  step_name: 'Nom de l\'étape'
});
```

## 🛠️ Configuration GTM recommandée

### Variables personnalisées

#### 1. Event Category
```
Variable Type: Data Layer Variable
Data Layer Variable Name: event_category
```

#### 2. Event Label
```
Variable Type: Data Layer Variable
Data Layer Variable Name: event_label
```

#### 3. Step Number
```
Variable Type: Data Layer Variable
Data Layer Variable Name: step_number
```

#### 4. Transaction Value
```
Variable Type: Data Layer Variable
Data Layer Variable Name: value
```

### Triggers

#### 1. Form Started
```
Trigger Type: Custom Event
Event Name: form_started
```

#### 2. Form Step Completed
```
Trigger Type: Custom Event
Event Name: form_step_completed
```

#### 3. Form Completed
```
Trigger Type: Custom Event
Event Name: form_completed
```

#### 4. Purchase
```
Trigger Type: Custom Event
Event Name: purchase
```

### Tags recommandés

#### Google Ads Conversion
```
Trigger: Purchase event
Conversion Value: {{value}}
Conversion Currency: EUR
```

#### Facebook Pixel
```
Trigger: Form Completed + Purchase
Events: InitiateCheckout, Purchase
Parameters: value, currency, content_name
```

#### LinkedIn Insight
```
Trigger: Form Completed + Purchase
Events: Conversion tracking
```

## 📈 Métriques importantes

### Funnel de conversion
1. **Page visit** → Visite `/brief-new`
2. **Form started** → Clic sur CTA
3. **Form step completed** → Progression (12 étapes)
4. **Form completed** → Formulaire terminé
5. **Proceed to payment** → Redirection paiement
6. **Purchase** → Conversion finale

### Taux de conversion par étape
- Étape 1 → Étape 2 : Engagement initial
- Étape 6 → Étape 7 : Milieu du formulaire
- Étape 12 → Completed : Complétion totale
- Completed → Payment : Intention d'achat
- Payment → Purchase : Conversion finale

### Points d'abandon
- Identifier les étapes avec fort taux d'abandon
- Étapes avec champs obligatoires complexes
- Étapes nécessitant réflexion/creativité

## 🎯 Test des événements

### Console développeur
```javascript
// Sur la page /brief-new
// Ouvrir DevTools > Console
// Commencer le formulaire
// Vous verrez les événements gtag dans la console
```

### GTM Debug
1. Activer le mode Preview dans GTM
2. Visiter le site
3. Voir les événements arriver en temps réel

### Validation
- ✅ Événements arrivent dans GTM
- ✅ Variables personnalisées capturent les données
- ✅ Triggers se déclenchent correctement
- ✅ Tags envoient les données aux plateformes

## 🔧 Debugging

### Événements ne se déclenchent pas
```javascript
// Vérifier dans la console
typeof gtag !== 'undefined' // doit retourner true
```

### Variables vides
```javascript
// Vérifier la structure des données
// dans GTM Debug > Variables
event_category: "Brief Form"
event_label: "Step 1"
step_number: 1
```

### Problèmes de timing
- Événements se déclenchent avant GTM chargé
- Solution : utiliser des triggers avec délai

---

## 📋 Checklist de mise en place

- [ ] Créer les variables personnalisées
- [ ] Configurer les triggers pour chaque événement
- [ ] Créer les tags Google Ads, Facebook, LinkedIn
- [ ] Tester en mode Preview GTM
- [ ] Publier le container GTM
- [ ] Vérifier les conversions dans chaque plateforme
- [ ] Monitorer les taux de conversion par étape

**Prêt pour optimiser vos conversions !** 🚀📊
