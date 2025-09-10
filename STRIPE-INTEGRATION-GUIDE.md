# 🔐 Guide d'Intégration Stripe - PoppyMusic

## ÉTAPE 1: Configuration des Clés API Stripe

### 1. Récupérer les clés Stripe
1. **Connectez-vous à votre Dashboard Stripe** : https://dashboard.stripe.com
2. **Allez dans "Développeurs" → "Clés API"**
3. **Récupérez ces clés :**
   - **Clé publique** (commence par `pk_live_...`)
   - **Clé secrète** (commence par `sk_live_...`) - ⚠️ Ne s'affiche qu'une fois !
   - **Webhook secret** (pour les notifications)

### 2. Configuration sécurisée sur le serveur
```bash
# Connexion au serveur
ssh root@161.35.43.87

# Créer le fichier d'environnement
cd /var/www/poppymusic
nano .env

# Ajouter les variables Stripe
STRIPE_PUBLIC_KEY=pk_live_VOTRE_CLE_PUBLIQUE
STRIPE_SECRET_KEY=sk_live_VOTRE_CLE_SECRETE
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_WEBHOOK_SECRET
STRIPE_PRICE_ID=price_VOTRE_PRICE_ID_199EUR
NODE_ENV=production

# Sauvegarder : Ctrl+X, Y, Enter

# Sécuriser le fichier
chmod 600 .env
chown www-data:www-data .env
```

---

## ÉTAPE 2: Créer le Price ID dans Stripe

### 1. Dans le Dashboard Stripe
1. **Allez dans "Catalogue de produits"**
2. **Créez un nouveau produit :**
   - Nom : "Chanson Personnalisée Poppy Music"
   - Description : "Création d'une chanson personnalisée avec paroles, mélodie et arrangement"
3. **Ajoutez un prix :**
   - Montant : 199 EUR
   - Type : Paiement unique
   - **Notez le Price ID** (commence par `price_...`)

---

## ÉTAPE 3: Configuration Webhook

### 1. Créer le webhook dans Stripe
1. **Dashboard Stripe → "Développeurs" → "Webhooks"**
2. **"Ajouter un point de terminaison"**
3. **URL du webhook :** `https://poppymusic.fr/api/stripe/webhook`
4. **Événements à écouter :**
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. **Récupérez le "Signing secret"** (commence par `whsec_...`)

---

## ÉTAPE 4: Installation des dépendances

```bash
# Sur le serveur
cd /var/www/poppymusic
npm install stripe
npm install @types/stripe --save-dev
```

---

## ÉTAPE 5: APIs Stripe à créer

### 1. Création de session de paiement
**Fichier :** `/api/stripe/create-checkout-session.ts`

### 2. Webhook pour les notifications
**Fichier :** `/api/stripe/webhook.ts`

### 3. Vérification de statut
**Fichier :** `/api/stripe/payment-status.ts`

---

## ÉTAPE 6: Intégration Frontend

### 1. Page de paiement
- Bouton "PAYER 199€" → Créer session Stripe
- Redirection vers Stripe Checkout
- Retour sur page de confirmation

### 2. Admin
- Colonne "Statut Paiement" mise à jour en temps réel
- Détails des transactions
- Possibilité de remboursement

---

## ÉTAPE 7: Tests de Sécurité

### Variables d'environnement sécurisées :
```bash
# Vérifier que .env n'est pas dans git
echo ".env" >> .gitignore

# Vérifier les permissions
ls -la .env
# Doit afficher : -rw------- (600)
```

### Test des webhooks :
```bash
# Installer Stripe CLI pour les tests
stripe listen --forward-to localhost:4321/api/stripe/webhook
```

---

## 🔐 SÉCURITÉ CRITIQUE

### ❌ À NE JAMAIS FAIRE :
- Mettre les clés secrètes dans le code
- Commiter le fichier .env
- Exposer les clés dans les logs

### ✅ BONNES PRATIQUES :
- Variables d'environnement uniquement
- Validation des webhooks
- Logs sécurisés (sans clés)
- HTTPS obligatoire

---

## 📊 INTÉGRATION ADMIN

### Nouvelles colonnes à ajouter :
- **Stripe Payment ID**
- **Montant payé**
- **Date de paiement**
- **Statut Stripe** (succeeded, failed, pending)

### Actions admin :
- Voir la transaction Stripe
- Remboursement direct
- Historique des paiements

---

## 🚀 DÉPLOIEMENT

### Ordre de déploiement :
1. ✅ **Configurer .env** sur le serveur
2. ✅ **Créer les APIs** Stripe
3. ✅ **Configurer le webhook** dans Stripe
4. ✅ **Tester** avec un vrai paiement
5. ✅ **Vérifier l'admin** reçoit les statuts

**Prêt pour l'intégration Stripe complète !** 🎉
