#!/bin/bash

# 🚀 Script de déploiement rapide avec ecosystem.config.cjs
# Usage: bash deploy-fix.sh

echo "🚀 Déploiement PoppyMusic avec correction Analytics..."

# Connexion et déploiement sur le serveur
ssh root@161.35.43.87 << 'ENDSSH'
cd /var/www/poppymusic

echo "📥 Récupération des dernières modifications..."
git pull origin main

echo "📦 Installation des dépendances..."
npm install

echo "🔨 Build de l'application..."
npm run build

echo "🔄 Redémarrage PM2 avec ecosystem.config.cjs..."
pm2 restart ecosystem.config.cjs

echo "✅ Vérification du statut..."
pm2 status

echo "📊 Logs récents..."
pm2 logs poppymusic --lines 10

echo "🎉 Déploiement terminé !"
ENDSSH

echo "🌐 Site mis à jour : https://poppymusic.fr"
echo "📋 Formulaire : https://poppymusic.fr/brief-new"
