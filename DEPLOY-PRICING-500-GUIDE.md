# 🚀 DÉPLOIEMENT PRICING 500€ - Guide Complet

## 📋 RÉSUMÉ DES CHANGEMENTS

### Nouveau Positionnement Premium
- **Ancien prix :** 199€
- **Nouveau prix :** 500€ (premium exclusif)
- **Nouveau Price ID :** `price_1S8LpSLDQESNqm4m9g9UYuv8`
- **Message :** "Studio de production de tubes" 

### Fichiers Modifiés
- ✅ Page d'accueil (repositionnement premium complet)
- ✅ Page de paiement (500€)
- ✅ Service email (500€)
- ✅ API briefs (50000 centimes)
- ✅ Dashboard admin (calculs)
- ✅ Fichiers de test

---

## 🔄 ÉTAPES DE DÉPLOIEMENT

### ÉTAPE 1: Connexion au Serveur
```bash
ssh root@161.35.43.87
cd /var/www/poppymusic
```

### ÉTAPE 2: Sauvegarde
```bash
# Backup de la configuration actuelle
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# Backup de la version actuelle
git add . && git commit -m "Backup avant pricing 500€"
```

### ÉTAPE 3: Récupération du Code
```bash
# Récupérer les dernières modifications
git pull origin main

# Vérifier les changements
git log --oneline -5
```

### ÉTAPE 4: Mise à Jour Stripe
```bash
# Utiliser le script automatique
bash update-stripe-pricing-500.sh
```

**OU manuellement :**
```bash
# Éditer la configuration
nano .env

# Remplacer la ligne :
STRIPE_PRICE_ID=price_1S8LpSLDQESNqm4m9g9UYuv8

# Sauvegarder : Ctrl+X, Y, Enter
```

### ÉTAPE 5: Build et Redémarrage
```bash
# Installation des dépendances (si nécessaire)
npm install

# Build de l'application
npm run build

# Redémarrage PM2
pm2 restart poppymusic

# Vérifier le statut
pm2 status
pm2 logs poppymusic --lines 10
```

---

## ✅ VÉRIFICATIONS POST-DÉPLOIEMENT

### 1. Test Interface
- [ ] Accéder à https://poppymusic.fr
- [ ] Vérifier que le prix affiché est **500€**
- [ ] Vérifier le message "Studio de production de tubes"
- [ ] Tester le bouton "PRODUIRE MON TUBE"

### 2. Test Paiement
- [ ] Aller sur `/brief-new`
- [ ] Remplir un brief de test
- [ ] Vérifier que le montant est **500€**
- [ ] Tester la redirection Stripe (mode test)

### 3. Test Webhook
- [ ] Effectuer un paiement test
- [ ] Vérifier les logs : `pm2 logs poppymusic`
- [ ] Confirmer la réception du webhook
- [ ] Vérifier l'email de confirmation

### 4. Test Admin
- [ ] Accéder au dashboard admin
- [ ] Vérifier les calculs de revenus
- [ ] Confirmer les montants à 500€

---

## 🔧 CONFIGURATION STRIPE DASHBOARD

### Vérifier le Price ID
1. **Dashboard Stripe :** https://dashboard.stripe.com
2. **Catalogue de produits**
3. **Vérifier le produit :**
   - Price ID : `price_1S8LpSLDQESNqm4m9g9UYuv8`
   - Montant : 500 EUR
   - Type : Paiement unique

### Webhook Configuration
- **URL :** `https://poppymusic.fr/api/stripe/webhook`
- **Événements :**
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`

---

## 🚨 EN CAS DE PROBLÈME

### Rollback Rapide
```bash
# Restaurer l'ancienne configuration
cp .env.backup.* .env

# Rebuild
npm run build

# Redémarrer
pm2 restart poppymusic
```

### Logs de Debug
```bash
# Logs en temps réel
pm2 logs poppymusic --lines 50

# Logs Stripe spécifiques
grep -i "stripe\|payment" /var/log/pm2/poppymusic-error.log

# Test webhook
curl -X POST https://poppymusic.fr/api/debug-email
```

---

## 📊 MONITORING POST-DÉPLOIEMENT

### Métriques à Surveiller
- Taux de conversion (peut baisser temporairement)
- Revenus par commande (+150% attendu)
- Abandon de panier (surveiller l'augmentation)
- Feedback utilisateurs

### Analytics
- Surveiller Google Analytics
- Vérifier les événements GTM (500€)
- Monitorer les performances Stripe

---

## ✨ POINTS CLÉS DU REPOSITIONNEMENT

### Message Premium
- "Nous ne faisons pas des chansons, nous créons des **tubes**"
- "Studio de production d'exception"
- "8h d'artisanat musical d'exception"
- "Excellence garantie"

### Justification Tarif
- Studio premium : 80€/h × 8h = 640€
- Notre tarif : 500€ = **Économie de 140€**
- Distribution premium incluse (150€ de valeur)
- Qualité radio absolue

---

## 📞 SUPPORT

En cas de problème technique :
1. Vérifier les logs PM2
2. Tester le webhook Stripe
3. Confirmer la configuration .env
4. Contacter le support si nécessaire

**Date de mise à jour :** $(date)
**Version :** Premium 500€
**Status :** Prêt pour déploiement
