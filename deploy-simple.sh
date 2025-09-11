#!/bin/bash

# 🚀 Déploiement simple - Événements GTM pour formulaire
# Usage: ./deploy-simple.sh

echo "🚀 Déploiement événements GTM simplifiés"
echo "========================================"

# Récupérer les dernières modifications
echo "📥 Récupération des mises à jour..."
git pull origin main

# Vérifier que les événements sont présents
echo "🔍 Vérification des événements GTM..."

if grep -q "gtag('event', 'form_started'" src/pages/brief-new.astro; then
    echo "✅ Événement form_started trouvé"
else
    echo "❌ Événement form_started manquant"
    exit 1
fi

if grep -q "gtag('event', 'purchase'" src/pages/confirmation.astro; then
    echo "✅ Événement purchase trouvé"
else
    echo "❌ Événement purchase manquant"
    exit 1
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
    echo "🎉 Événements GTM déployés avec succès !"
    echo ""
    echo "📊 Événements disponibles :"
    echo "  ✅ form_started - Début du formulaire"
    echo "  ✅ form_step_completed - Chaque étape terminée"
    echo "  ✅ form_step_started - Chaque étape commencée"
    echo "  ✅ form_purpose_selected - Choix du type de chanson"
    echo "  ✅ form_completed - Formulaire terminé"
    echo "  ✅ form_proceed_to_payment - Redirection paiement"
    echo "  ✅ purchase - Conversion finale"
    echo "  ✅ form_abandoned - Abandons de formulaire"
    echo "  ✅ conversion_confirmation - Page de confirmation"
    echo ""
    echo "🧪 Test des événements :"
    echo "1. Visitez https://poppymusic.fr/brief-new"
    echo "2. Commencez le formulaire"
    echo "3. Ouvrez DevTools > Console"
    echo "4. Tapez 'dataLayer' pour voir les événements"
    echo ""
    echo "📋 Configuration GTM :"
    echo "  - Container ID : GTM-NGZ6SCTP (déjà configuré)"
    echo "  - Voir GTM-EVENTS-GUIDE.md pour la configuration"
    echo ""
    echo "🎯 Les événements sont maintenant prêts pour GTM !"

else
    echo "❌ Échec du build"
    echo ""
    echo "🔍 Détails de l'erreur :"
    echo "Vérifiez que tous les imports sont corrects"
    echo "Vérifiez que les chemins de fichiers existent"
    exit 1
fi
