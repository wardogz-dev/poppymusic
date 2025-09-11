# 🎯 Configuration Google Tag Manager - Poppy Music

## 📊 Événements disponibles

Après déploiement, votre site enverra automatiquement ces événements vers GTM :

### 1. Événements Formulaire
```javascript
// Début du formulaire
{
  event: 'form_started',
  event_category: 'Brief Form',
  event_label: 'Form Initialized',
  step_number: 1
}

// Étape terminée
{
  event: 'form_step_completed',
  event_category: 'Brief Form',
  event_label: 'Step 2',
  step_number: 2,
  step_name: 'Informations personnelles'
}

// Nouvelle étape commencée
{
  event: 'form_step_started',
  event_category: 'Brief Form',
  event_label: 'Step 3',
  step_number: 3,
  step_name: 'Choix du destinataire'
}

// Sélection du type de chanson
{
  event: 'form_purpose_selected',
  event_category: 'Brief Form',
  event_label: 'Anniversaire Adulte',
  purpose_type: 'Anniversaire Adulte',
  step_number: 3
}
```

### 2. Événement Purchase (Conversion)
```javascript
{
  event: 'purchase',
  transaction_id: 'cs_live_xxxxxxxxxx', // Session ID Stripe réel
  value: 199, // Montant réel en euros
  currency: 'EUR',
  items: [{
    item_id: 'chanson-personnalisee',
    item_name: 'Chanson Personnalisée Poppy Music',
    item_category: 'Music Production',
    item_variant: 'Standard',
    price: 199,
    quantity: 1
  }],
  customer_email: 'client@email.com', // Email réel du client
  payment_method: 'stripe'
}
```

## 🛠️ Configuration GTM

### Variables personnalisées à créer

#### 1. Event Category
```
Type: Data Layer Variable
Name: event_category
Data Layer Variable Name: event_category
```

#### 2. Step Number
```
Type: Data Layer Variable
Name: step_number
Data Layer Variable Name: step_number
```

#### 3. Transaction ID
```
Type: Data Layer Variable
Name: transaction_id
Data Layer Variable Name: transaction_id
```

#### 4. Purchase Value
```
Type: Data Layer Variable
Name: value
Data Layer Variable Name: value
```

#### 5. Currency
```
Type: Data Layer Variable
Name: currency
Data Layer Variable Name: currency
```

#### 6. Items
```
Type: Data Layer Variable
Name: items
Data Layer Variable Name: items
```

### Triggers à créer

#### 1. Form Started
```
Type: Custom Event
Event Name: form_started
```

#### 2. Form Step Completed
```
Type: Custom Event
Event Name: form_step_completed
```

#### 3. Form Purpose Selected
```
Type: Custom Event
Event Name: form_purpose_selected
```

#### 4. Purchase
```
Type: Custom Event
Event Name: purchase
```

### Tags recommandés

#### 1. Google Analytics 4 - Purchase
```
Tag Type: Google Analytics: GA4 Event
Event Name: purchase
Parameters:
  - transaction_id: {{transaction_id}}
  - value: {{value}}
  - currency: {{currency}}
  - items: {{items}}
Trigger: Purchase Event
```

#### 2. Google Ads Conversion
```
Tag Type: Google Ads Conversion Tracking
Conversion ID: [Votre ID de conversion]
Conversion Label: [Votre label de conversion]
Conversion Value: {{value}}
Currency Code: {{currency}}
Trigger: Purchase Event
```

#### 3. Meta Pixel Purchase
```
Tag Type: Custom HTML
HTML:
<script>
fbq('track', 'Purchase', {
  value: {{value}},
  currency: {{currency}},
  content_name: 'Chanson Personnalisée Poppy Music',
  content_type: 'product',
  content_ids: ['chanson-personnalisee'],
  event_id: {{transaction_id}} // Anti-doublon
});
</script>
Trigger: Purchase Event
```

#### 4. LinkedIn Insight Tag
```
Tag Type: Custom HTML
HTML:
<script>
lintrk('track', { conversion_id: YOUR_CONVERSION_ID });
</script>
Trigger: Purchase Event
```

## 🧪 Test et Validation

### 1. Test en mode Preview GTM
1. Activer le mode Preview dans GTM
2. Visiter https://poppymusic.fr/brief-new
3. Commencer le formulaire
4. Vérifier que les événements arrivent dans GTM

### 2. Vérification console
```javascript
// Sur la page brief-new
// Console → voir les logs
🎯 GTM Event: form_started
🎯 GTM Event: form_step_completed - Step 2

// Vérifier dataLayer
console.log(window.dataLayer);
```

### 3. Test de conversion
1. Effectuer un paiement test
2. Arriver sur la page de confirmation
3. Vérifier dans Console :
   ```
   🎯 Page confirmation - Session ID: cs_test_xxx
   🔍 Vérification du paiement Stripe...
   💳 Stripe payment-status: {...}
   🎯 GTM Event: purchase
   ✅ Événements purchase envoyés vers GTM
   ```

## 📈 Métriques importantes

### Funnel de conversion
```
Page View (/brief-new)
    ↓
Form Started
    ↓
Form Step 1 → Step 12 (progression)
    ↓
Form Completed
    ↓
Purchase (conversion finale)
```

### Taux de conversion à mesurer
- **Page → Form Started** : Taux d'engagement CTA
- **Form Started → Step 6** : Taux de progression mi-parcours
- **Step 6 → Form Completed** : Taux de complétion
- **Form Completed → Purchase** : Taux de conversion paiement

### Abandons à analyser
- **Step d'abandon le plus fréquent**
- **Temps moyen avant abandon**
- **Corrélation abandon/type de chanson**

## 🚀 Déploiement

### Sur le serveur
```bash
cd /var/www/poppymusic

# Récupérer les modifications
git fetch --all --prune
git reset --hard origin/main

# Build et déploiement
npm run build
pm2 restart poppymusic --update-env
```

### Vérification post-déploiement
1. ✅ GTM script chargé
2. ✅ dataLayer initialisé
3. ✅ Événements formulaire trackés
4. ✅ Purchase avec données Stripe réelles
5. ✅ Anti-doublon fonctionnel

## 💡 Cas d'usage avancés

### Remarketing
```javascript
// Utilisateur qui abandonne à l'étape 8
// → Audience remarketing "Formulaire abandonné"
// → Campagne ciblée avec offre spéciale
```

### A/B Testing
```javascript
// Tester différentes versions du formulaire
// Comparer les taux de conversion par variante
```

### Attribution
```javascript
// Analyser les sources de trafic
// ROI par canal d'acquisition
```

---

## 📋 Checklist finale

- [ ] Variables personnalisées créées dans GTM
- [ ] Triggers configurés pour chaque événement
- [ ] Tags Google Ads, Meta Pixel, LinkedIn configurés
- [ ] Mode Preview testé avec événements réels
- [ ] Container GTM publié
- [ ] Conversions validées dans chaque plateforme
- [ ] Dashboard Analytics configuré

**Votre système de tracking GTM est maintenant prêt pour optimiser vos conversions !** 🚀📊
