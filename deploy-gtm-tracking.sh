#!/bin/bash

# 🚀 Déploiement du système de tracking GTM complet
# Usage: ./deploy-gtm-tracking.sh

echo "🚀 Déploiement système de tracking GTM"
echo "====================================="

# Récupérer les dernières modifications
echo "📥 Récupération des mises à jour..."
git pull origin main

# Vérifier que tous les composants sont présents
echo "🔍 Vérification des composants..."

if [ ! -f "src/components/GTM.astro" ]; then
    echo "❌ Composant GTM.astro manquant"
    exit 1
fi

if [ ! -f "src/components/GTMTracker.js" ]; then
    echo "❌ GTMTracker.js manquant"
    exit 1
fi

if [ ! -f "src/components/GTMInit.astro" ]; then
    echo "❌ GTMInit.astro manquant"
    exit 1
fi

echo "✅ Tous les composants présents"

# Build du projet
echo "🔨 Build du projet..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi !"

    # Redémarrage PM2
    echo "🔄 Redémarrage PM2..."
    pm2 restart poppymusic --update-env

    echo ""
    echo "🎉 Système de tracking GTM déployé avec succès !"
    echo ""
    echo "📊 Événements maintenant trackés :"
    echo "  ✅ Session start - Début de session"
    echo "  ✅ Page view - Vue de page"
    echo "  ✅ Form started - Début du formulaire"
    echo "  ✅ Form step - Chaque étape (1-12)"
    echo "  ✅ Form submission - Soumission du brief"
    echo "  ✅ Begin checkout - Accès au paiement"
    echo "  ✅ Purchase - Validation du paiement"
    echo "  ✅ Form abandon - Abandons de formulaire"
    echo "  ✅ User interactions - Interactions utilisateur"
    echo "  ✅ Button clicks - Clics sur boutons"
    echo "  ✅ Error tracking - Erreurs et validations"
    echo ""
    echo "📈 Métriques disponibles :"
    echo "  • Taux de conversion par étape"
    echo "  • Temps passé par étape"
    echo "  • Points d'abandon"
    echo "  • Valeur des transactions"
    echo "  • Revenus générés"
    echo ""
    echo "🧪 Test du tracking :"
    echo "1. Visitez https://poppymusic.fr/brief-new"
    echo "2. Commencez le formulaire"
    echo "3. Ouvrez DevTools > Console"
    echo "4. Tapez 'dataLayer' pour voir les événements"
    echo "5. Vérifiez GTM > Real-time > Events"
    echo ""
    echo "📋 Container GTM : GTM-NGZ6SCTP"
    echo ""
    echo "💡 Les données arrivent maintenant dans votre dashboard GTM !"

else
    echo "❌ Échec du build"
    exit 1
fi
