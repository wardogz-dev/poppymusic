# 🔐 Configuration Stripe - Guide Étape par Étape

## PHASE 1: Récupération des Clés Stripe

### 1. Dashboard Stripe
1. **Allez sur** https://dashboard.stripe.com
2. **Développeurs** → **Clés API**
3. **Récupérez ces 4 éléments :**
   - ✅ **Clé publique** : `pk_live_...`
   - ✅ **Clé secrète** : `sk_live_...` (⚠️ Ne s'affiche qu'une fois !)
   - ✅ **Price ID** : Créer un produit "Chanson Personnalisée" à 199€
   - ✅ **Webhook Secret** : À récupérer après création du webhook

### 2. Créer le produit 199€
1. **Catalogue de produits** → **Ajouter un produit**
2. **Nom** : "Chanson Personnalisée Poppy Music"
3. **Prix** : 199 EUR (paiement unique)
4. **Notez le Price ID** : `price_...`

---

## PHASE 2: Configuration Serveur

### 1. Connexion au serveur
```bash
ssh root@161.35.43.87
cd /var/www/poppymusic
```

### 2. Lancer le script de configuration
```bash
# Télécharger et exécuter le script
bash setup-stripe-server.sh
```

### 3. Éditer les clés (MANUEL)
```bash
nano .env

# Remplacer par vos vraies clés :
STRIPE_PUBLIC_KEY=pk_live_VOTRE_VRAIE_CLE
STRIPE_SECRET_KEY=sk_live_VOTRE_VRAIE_CLE
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_VRAIE_CLE
STRIPE_PRICE_ID=price_VOTRE_VRAIE_PRICE_ID
```

---

## PHASE 3: Configuration Webhook Stripe

### 1. Créer le webhook
1. **Dashboard Stripe** → **Développeurs** → **Webhooks**
2. **Ajouter un point de terminaison**
3. **URL** : `https://poppymusic.fr/api/stripe/webhook`
4. **Événements** :
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

### 2. Récupérer le Webhook Secret
1. **Cliquez sur votre webhook créé**
2. **Section "Signing secret"**
3. **Cliquez "Révéler"**
4. **Copiez** le secret (`whsec_...`)
5. **Ajoutez-le** dans votre `.env`

---

## PHASE 4: Mise à jour Base de Données

### 1. Exécuter le script Supabase
**Dans Supabase SQL Editor, exécutez :**
```sql
-- Contenu de supabase-stripe-fields.sql
ALTER TABLE client_briefs_steps 
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_customer_email TEXT,
ADD COLUMN IF NOT EXISTS amount_paid INTEGER,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'eur';
-- [+ index et vues...]
```

---

## PHASE 5: Déploiement

### 1. Push du code
```bash
git add .
git commit -m "feat: Intégration Stripe complète"
git push origin main
```

### 2. Rebuild sur le serveur
```bash
# Sur le serveur
npm run build
pm2 reload poppymusic
```

---

## PHASE 6: Tests

### 1. Test du paiement
1. **Allez sur** https://poppymusic.fr/brief-new
2. **Remplissez** le formulaire complet
3. **Cliquez** "Procéder au paiement"
4. **Payez** avec une vraie carte
5. **Vérifiez** la confirmation

### 2. Test de l'admin
1. **Allez sur** https://poppymusic.fr/admin/briefs
2. **Vérifiez** que le statut est "Payé"
3. **Montant** affiché (199€)

---

## 🎯 RÉSULTAT FINAL

### Flux utilisateur complet :
1. **Formulaire** → 12 étapes avec auto-save
2. **Paiement** → Stripe Checkout sécurisé
3. **Confirmation** → Email + page de succès
4. **Admin** → Statut temps réel + détails transaction

### Sécurité maximale :
- ✅ Clés en variables d'environnement
- ✅ Webhook signature vérifiée
- ✅ HTTPS obligatoire
- ✅ Aucune clé dans le code

**Intégration Stripe professionnelle prête !** 🚀
