#!/bin/bash

# 🚀 Script de déploiement manuel Poppy Music
# À utiliser si GitHub Actions ne fonctionne pas

set -e

echo "🎵 Déploiement manuel Poppy Music"
echo "=================================="

SERVER="161.35.43.87"
USER="root"

echo "📡 Test de connectivité SSH..."
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes $USER@$SERVER exit 2>/dev/null; then
    echo "❌ Impossible de se connecter en SSH"
    echo "💡 Solutions :"
    echo "   1. Vérifiez que votre clé SSH est ajoutée : ssh-add ~/.ssh/id_rsa"
    echo "   2. Ou copiez votre clé : ssh-copy-id $USER@$SERVER"
    echo "   3. Ou testez manuellement : ssh $USER@$SERVER"
    exit 1
fi

echo "✅ Connexion SSH OK"

echo "🏗️ Déploiement sur le serveur..."
ssh $USER@$SERVER << 'ENDSSH'
set -e

echo "📁 Vérification du répertoire..."
if [ ! -d "/var/www/poppymusic" ]; then
    echo "❌ Répertoire /var/www/poppymusic n'existe pas"
    echo "🔧 Initialisation du serveur nécessaire..."
    
    # Création du répertoire et clonage
    mkdir -p /var/www
    cd /var/www
    git clone https://github.com/wardogz-dev/poppymusic.git
fi

cd /var/www/poppymusic

echo "📥 Mise à jour du code..."
git pull origin main

echo "📦 Installation des dépendances..."
npm ci

echo "🏗️ Build du projet..."
npm run build

echo "⚡ Gestion PM2..."
# Vérifier si PM2 est installé
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installation de PM2..."
    npm install -g pm2
fi

# Vérifier si l'application existe
if pm2 describe poppymusic > /dev/null 2>&1; then
    echo "🔄 Rechargement de l'application existante..."
    pm2 reload poppymusic
else
    echo "🚀 Création de l'application PM2..."
    pm2 start npm --name "poppymusic" -- run preview
    pm2 save
fi

echo "📊 Statut final :"
pm2 status poppymusic

echo "🌐 Test du port local..."
sleep 3
if curl -f http://localhost:4321 > /dev/null 2>&1; then
    echo "✅ Application répond sur le port 4321"
else
    echo "❌ Application ne répond pas sur le port 4321"
    echo "📋 Logs PM2 :"
    pm2 logs poppymusic --lines 10
fi

ENDSSH

echo "🧪 Test final du site..."
sleep 5
if curl -f http://$SERVER > /dev/null 2>&1; then
    echo "🎉 SUCCÈS ! Site accessible sur http://$SERVER"
else
    echo "⚠️ Site pas encore accessible, vérification en cours..."
    curl -I http://$SERVER
fi

echo "✅ Déploiement manuel terminé !"
