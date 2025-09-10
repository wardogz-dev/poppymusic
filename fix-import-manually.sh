#!/bin/bash

# 🔧 Correction manuelle de l'import EmailService
# Usage: ./fix-import-manually.sh

echo "🔧 Correction manuelle de l'import EmailService"
echo "==============================================="

# Vérifier le contenu actuel
echo "📄 Contenu actuel du fichier debug-email.ts :"
head -3 src/pages/api/debug-email.ts

echo ""
echo "🔄 Correction de l'import..."

# Corriger l'import
sed -i 's|../../../lib/emailService|../../lib/emailService|g' src/pages/api/debug-email.ts

echo "✅ Correction appliquée"

# Vérifier la correction
echo ""
echo "📄 Contenu après correction :"
head -3 src/pages/api/debug-email.ts

echo ""
echo "🔨 Rebuild de l'application..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build réussi !"
    echo ""
    echo "🔄 Redémarrage PM2..."
    pm2 restart poppymusic --update-env

    echo ""
    echo "🎉 Tout est corrigé !"
    echo ""
    echo "🧪 Test de l'API :"
    echo "curl -X POST https://poppymusic.fr/api/debug-email -H 'Content-Type: application/json' -d '{}'"
else
    echo ""
    echo "❌ Échec du build"
    exit 1
fi
