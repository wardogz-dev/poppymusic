# 🔧 Configuration Stripe pour développement local

## ⚠️ PROBLÈME ACTUEL
L'erreur `500 Internal Server Error` sur `/api/stripe/create-checkout-session` indique que les variables d'environnement Stripe ne sont pas configurées localement.

## 🚀 SOLUTION RAPIDE

### Option 1: Configuration locale complète (recommandée)

1. **Créer le fichier .env :**
```bash
cp .env.example .env
```

2. **Récupérer vos clés Stripe :**
   - Allez sur https://dashboard.stripe.com
   - **Développeurs** → **Clés API**
   - Copiez votre **clé secrète** (commence par `sk_test_...` ou `sk_live_...`)
   - Créez un **produit 199€** et récupérez le **Price ID**

3. **Éditer .env :**
```bash
# Remplacez par vos vraies clés
STRIPE_SECRET_KEY=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
STRIPE_PRICE_ID=price_1S5oeRLDQESNqm4mfoBbVcLE
STRIPE_PUBLIC_KEY=pk_live_51S5keeLDQESNqm4mNxe4ekuWI77PFdwX9G9XyH3rX4768RjkCMXfoazummquveR8aNIxqsCPE8xVllhS52mQnALU00O7Cp7LFy
NODE_ENV=development
```

4. **Redémarrer le serveur :**
```bash
# Arrêter le serveur (Ctrl+C)
npm run dev
```

### Option 2: Test direct en production
Si tu veux juste tester rapidement, utilise directement la version de production sur `poppymusic.fr` où Stripe est configuré.

## 🔍 VÉRIFICATION

Après configuration, l'erreur devrait disparaître et le bouton "PAYER 199€" devrait rediriger vers Stripe Checkout.

## 📝 NOTES

- **Clés de test** : Commencent par `sk_test_` et `pk_test_`
- **Clés de production** : Commencent par `sk_live_` et `pk_live_`
- **Sécurité** : Le fichier `.env` est ignoré par git (ne sera pas committé)

## 🆘 BESOIN D'AIDE ?

Si tu n'as pas encore de compte Stripe ou de clés configurées, on peut :
1. Configurer ton compte Stripe ensemble
2. Créer le produit 199€
3. Récupérer toutes les clés nécessaires

**L'intégration Stripe est prête, il manque juste la configuration des clés !** 🎯
