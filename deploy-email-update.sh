#!/bin/bash

# 🚀 Déploiement de la mise à jour email client professionnel
# Usage: ./deploy-email-update.sh

echo "🚀 Déploiement email client professionnel"
echo "========================================"

# Récupérer les dernières modifications
echo "📥 Récupération des mises à jour..."
git pull origin main

# Rebuild
echo "🔨 Rebuild de l'application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi !"

    # Redémarrer PM2
    echo "🔄 Redémarrage PM2..."
    pm2 restart poppymusic --update-env

    echo ""
    echo "🎉 Mise à jour déployée !"
    echo ""
    echo "📧 Nouvelles fonctionnalités de l'email client :"
    echo "  ✅ Design professionnel sans emojis"
    echo "  ✅ Accusé de réception élégant"
    echo "  ✅ Timeline visuelle des étapes"
    echo "  ✅ Informations de contact claires"
    echo "  ✅ Template responsive et moderne"
    echo ""
    echo "🧪 Test des emails :"
    echo "curl -X POST https://poppymusic.fr/api/debug-email -H 'Content-Type: application/json' -d '{}'"
    echo ""
    echo "📨 Prochain paiement déclenchera l'envoi du nouvel email !"

else
    echo "❌ Échec du build"
    exit 1
fi
