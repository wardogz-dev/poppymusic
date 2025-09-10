#!/bin/bash

# 🔧 Script de correction rapide pour le serveur PoppyMusic
# Usage: ./quick-fix-server.sh

echo "🚀 Correction rapide PoppyMusic Server"
echo "====================================="

# Forcer la synchronisation complète
echo "📥 Synchronisation Git forcée..."
git fetch origin
git reset --hard origin/main

# Vérifier la correction
echo "🔍 Vérification du fichier debug-email.ts..."
head -3 src/pages/api/debug-email.ts

# Rebuild
echo "🔨 Rebuild de l'application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi !"

    # Redémarrer PM2
    echo "🔄 Redémarrage PM2..."
    pm2 restart poppymusic --update-env

    echo ""
    echo "🎉 Déploiement terminé !"
    echo ""
    echo "🧪 Test de l'API :"
    echo "curl -X POST https://poppymusic.fr/api/debug-email -H 'Content-Type: application/json' -d '{}'"
else
    echo "❌ Échec du build"
    exit 1
fi
