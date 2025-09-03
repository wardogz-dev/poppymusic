#!/bin/bash

# Script de déploiement en mode server pour Poppy Music
# Usage: bash deploy-server.sh

set -e

echo "🚀 Déploiement Poppy Music en mode server..."

# Aller dans le répertoire du projet
cd /var/www/poppymusic

# Sauvegarder les changements locaux
echo "💾 Sauvegarde des changements..."
git stash

# Nettoyer le cache Git et forcer la mise à jour
echo "🧹 Nettoyage du cache Git..."
git reset --hard HEAD
git clean -fd

# Récupérer les dernières mises à jour
echo "📥 Récupération des mises à jour GitHub..."
git fetch origin main
git reset --hard origin/main

# Installation/mise à jour des dépendances
echo "📦 Mise à jour des dépendances..."
npm ci

# Build du site en mode server
echo "🏗️ Build du site..."
npm run build

# Arrêter l'ancienne instance
echo "🛑 Arrêt de l'ancienne instance..."
pm2 stop poppymusic 2>/dev/null || echo "Aucune instance à arrêter"
pm2 delete poppymusic 2>/dev/null || echo "Aucune instance à supprimer"

# Créer le fichier .env pour la production si nécessaire
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cat > .env << 'EOF'
SUPABASE_URL=https://ntvnhcpkzpovqgcaiawx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50dm5oY3BrenBvdnFnY2FpYXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NTg5OTgsImV4cCI6MjA3MjIzNDk5OH0.GQfgar4VTEz3H73usQRb9Vqa3gBfOfomZgXjPlasTSw
ADMIN_USERNAME=admin
ADMIN_PASSWORD=PoppyMusic2025!
EOF
fi

# Démarrer en mode server
echo "⚡ Démarrage en mode server..."
pm2 start dist/server/entry.mjs --name "poppymusic" -- --host 0.0.0.0 --port 4321
pm2 save

echo "✅ Déploiement terminé !"
echo "🌐 Site accessible : https://poppymusic.fr"
echo "🔐 Admin : https://poppymusic.fr/admin/login"
echo "📊 Status : pm2 status"
