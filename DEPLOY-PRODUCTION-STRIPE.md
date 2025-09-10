# 🚀 Déploiement Production avec Stripe - PoppyMusic

## ⚠️ PROBLÈME RÉSOLU
- **Analytics** : Ajout de vérifications `typeof gtag !== 'undefined'` 
- **PM2** : Configuration via `ecosystem.config.cjs` 
- **Variables** : Injection directe dans PM2 (pas .env)

## 🔧 ÉTAPES DE DÉPLOIEMENT

### 1. Sur le serveur (SSH)
```bash
ssh root@161.35.43.87
cd /var/www/poppymusic

# Récupérer les modifications
git pull origin main
npm install
npm run build
```

### 2. Configurer ecosystem.config.cjs avec tes vraies clés
```bash
nano ecosystem.config.cjs

# Remplacer dans le fichier par tes vraies clés Stripe :
STRIPE_PUBLIC_KEY: "pk_live_VOTRE_CLE_PUBLIQUE_ICI"
STRIPE_SECRET_KEY: "sk_live_VOTRE_CLE_SECRETE_ICI"
STRIPE_WEBHOOK_SECRET: "whsec_VOTRE_WEBHOOK_SECRET_ICI"
STRIPE_PRICE_ID: "price_VOTRE_PRICE_ID_ICI"
```

### 3. Redémarrer PM2
```bash
pm2 restart ecosystem.config.cjs
pm2 status
pm2 logs poppymusic --lines 20
```

### 4. Vérifier que ça fonctionne
```bash
# Attendre ce message dans les logs :
# "Server listening on http://localhost:4321"

# Tester le formulaire :
curl -I https://poppymusic.fr/brief-new
```

## ✅ CORRECTIONS APPORTÉES

### 🔒 **Analytics sécurisés :**
- Vérification `typeof gtag !== 'undefined'` partout
- Pas d'erreur côté serveur (SSR)
- Fonctionnement uniquement côté client

### ⚙️ **Configuration PM2 :**
- `ecosystem.config.cjs` pour injection variables
- Script de lancement : `node ./dist/server/entry.mjs`
- Variables Stripe directement dans la config PM2

### 🚀 **Script automatisé :**
- `deploy-fix.sh` pour déploiement rapide
- Toutes les étapes automatisées
- Vérification du statut incluse

## 🎯 **RÉSULTAT ATTENDU**

Après déploiement :
- ✅ Formulaire brief-new fonctionnel
- ✅ Analytics trackant chaque étape
- ✅ Paiements Stripe opérationnels
- ✅ Admin avec statuts mis à jour

**Le formulaire devrait maintenant fonctionner parfaitement !** 🎵
