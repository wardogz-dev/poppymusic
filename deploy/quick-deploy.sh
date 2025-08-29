#!/bin/bash

# 🚀 Script de déploiement rapide Poppy Music
# Usage: bash quick-deploy.sh

set -e

echo "🎵 Déploiement rapide Poppy Music..."

# Aller dans le répertoire de l'application
cd /var/www/poppymusic

# Sauvegarder les changements locaux
echo "💾 Sauvegarde des changements..."
git stash

# Récupérer les dernières mises à jour
echo "📥 Récupération des mises à jour GitHub..."
git pull origin main

# Installation/mise à jour des dépendances
echo "📦 Mise à jour des dépendances..."
npm install

# Build du site
echo "🏗️ Build du site..."
npm run build

# Redémarrage de l'application
echo "⚡ Redémarrage de l'application..."
pm2 reload poppymusic

echo "✅ Déploiement terminé !"
echo "🌐 Site accessible : http://161.35.43.87"
echo "📊 Status : pm2 status"
