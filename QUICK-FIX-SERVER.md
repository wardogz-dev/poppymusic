# 🚀 Résolution Rapide Conflit Serveur

## ⚠️ PROBLÈME
Conflit avec `ecosystem.config.cjs` existant sur le serveur.

## ✅ SOLUTION (à exécuter sur le serveur)

```bash
# 1. Sauvegarder l'ancien fichier avec tes vraies clés
cp ecosystem.config.cjs ecosystem.config.cjs.backup

# 2. Supprimer le fichier en conflit
rm ecosystem.config.cjs

# 3. Récupérer les nouvelles modifications
git pull origin main

# 4. Restaurer tes vraies clés Stripe
cp ecosystem.config.cjs.backup ecosystem.config.cjs
# OU éditer manuellement :
nano ecosystem.config.cjs

# 5. Build et redémarrage
npm run build
pm2 restart ecosystem.config.cjs

# 6. Vérifier que ça fonctionne
pm2 logs poppymusic --lines 10
```

## 🔧 ALTERNATIVE RAPIDE

Si tu veux juste remettre tes clés rapidement :

```bash
# Supprimer le conflit
rm ecosystem.config.cjs

# Pull des modifs
git pull origin main

# Éditer avec tes vraies clés
nano ecosystem.config.cjs
# Remplacer les "REMPLACER_PAR_VOTRE_*" par tes vraies clés

# Redémarrer
npm run build
pm2 restart ecosystem.config.cjs
```

**Le formulaire devrait ensuite fonctionner !** 🎯
