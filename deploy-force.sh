#!/bin/bash

# 🚀 Déploiement forcé - Résout tous les conflits Git
# Usage: ./deploy-force.sh

echo "🚀 Déploiement forcé - Résolution conflits Git"
echo "==============================================="

# Forcer la récupération complète
echo "📥 Synchronisation forcée avec GitHub..."
git fetch --all --prune
git reset --hard origin/main

if [ $? -ne 0 ]; then
    echo "❌ Échec de la synchronisation Git"
    exit 1
fi

echo "✅ Synchronisation réussie"

# Vérifier les fichiers importants
echo "🔍 Vérification des fichiers..."
if [ -f "deploy-simple.sh" ]; then
    echo "✅ deploy-simple.sh présent"
else
    echo "❌ deploy-simple.sh manquant"
fi

if [ -f "GTM-EVENTS-GUIDE.md" ]; then
    echo "✅ GTM-EVENTS-GUIDE.md présent"
else
    echo "❌ GTM-EVENTS-GUIDE.md manquant"
fi

# Vérifier que les événements GTM sont présents
if grep -q "gtag('event', 'form_started'" src/pages/brief-new.astro; then
    echo "✅ Événements GTM présents dans brief-new.astro"
else
    echo "❌ Événements GTM manquants dans brief-new.astro"
fi

if grep -q "gtag('event', 'purchase'" src/pages/confirmation.astro; then
    echo "✅ Événements purchase présents dans confirmation.astro"
else
    echo "❌ Événements purchase manquants dans confirmation.astro"
fi

# Build du projet
echo "🔨 Build du projet..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi !"

    # Redémarrage PM2
    echo "🔄 Redémarrage PM2..."
    pm2 restart poppymusic --update-env

    echo ""
    echo "🎉 DÉPLOIEMENT RÉUSSI !"
    echo ""
    echo "📊 Événements GTM actifs :"
    echo "  ✅ form_started - Début formulaire"
    echo "  ✅ form_step_completed - Progression"
    echo "  ✅ form_purpose_selected - Choix type"
    echo "  ✅ form_completed - Formulaire terminé"
    echo "  ✅ form_proceed_to_payment - Vers paiement"
    echo "  ✅ purchase - Conversion finale"
    echo "  ✅ form_abandoned - Abandons"
    echo ""
    echo "🧪 Test immédiat :"
    echo "  curl -X POST https://poppymusic.fr/api/debug-email \\"
    echo "    -H 'Content-Type: application/json' -d '{}'"
    echo ""
    echo "📈 Prêt pour configuration GTM !"
    echo ""
    echo "📋 Prochaines étapes :"
    echo "1. Configurer les événements dans GTM (voir GTM-EVENTS-GUIDE.md)"
    echo "2. Tester le formulaire sur https://poppymusic.fr/brief-new"
    echo "3. Vérifier les événements dans GTM Real-time"

else
    echo "❌ Échec du build"
    echo ""
    echo "🔍 Debugging :"
    echo "1. Vérifier les logs d'erreur ci-dessus"
    echo "2. Vérifier que tous les imports sont corrects"
    echo "3. Vérifier que les chemins de fichiers existent"
    exit 1
fi
