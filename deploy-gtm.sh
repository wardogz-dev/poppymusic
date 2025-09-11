#!/bin/bash

# 🚀 Déploiement de Google Tag Manager
# Usage: ./deploy-gtm.sh

echo "🚀 Déploiement Google Tag Manager"
echo "================================="

# Récupérer les dernières modifications
echo "📥 Récupération des mises à jour..."
git pull origin main

# Build du projet
echo "🔨 Build du projet..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi !"

    # Redémarrage PM2
    echo "🔄 Redémarrage PM2..."
    pm2 restart poppymusic --update-env

    echo ""
    echo "🎉 Google Tag Manager déployé avec succès !"
    echo ""
    echo "📊 Fonctionnalités activées :"
    echo "  ✅ GTM injecté automatiquement dans toutes les pages"
    echo "  ✅ Exclu des pages admin (/admin/*)"
    echo "  ✅ Compatible avec Google Analytics existant"
    echo "  ✅ Injection dans <head> et <body>"
    echo "  ✅ Configuration via astro.config.mjs"
    echo ""
    echo "🧪 Test du GTM :"
    echo "  - Ouvrez n'importe quelle page du site"
    echo "  - Vérifiez dans les dev tools > Network que gtm.js se charge"
    echo "  - Vérifiez dans Google Tag Manager que les hits arrivent"
    echo ""
    echo "⚠️  Note : Les pages admin n'ont pas le GTM (pour la sécurité)"
    echo ""
    echo "📈 Container ID : GTM-NGZ6SCTP"
else
    echo "❌ Échec du build"
    exit 1
fi
