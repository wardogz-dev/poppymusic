#!/bin/bash

# 🚀 Déploiement des corrections du player sticky
# Usage: ./deploy-sticky-fix.sh

echo "🎵 Déploiement corrections player sticky"
echo "======================================="

# Récupérer les dernières modifications
echo "📥 Récupération des mises à jour..."
git pull origin main

# Vérifier que le fichier a été mis à jour
echo "🔍 Vérification du fichier stickyPlayer.js..."
if grep -q "setVolume" public/scripts/stickyPlayer.js; then
    echo "✅ Méthode setVolume trouvée"
else
    echo "❌ Méthode setVolume manquante"
    exit 1
fi

if grep -q "touchstart" public/scripts/stickyPlayer.js; then
    echo "✅ Support tactile trouvé"
else
    echo "❌ Support tactile manquant"
    exit 1
fi

echo ""
echo "🎵 Corrections appliquées :"
echo "  ✅ Gestion du drag souris (mousedown/mousemove/mouseup)"
echo "  ✅ Support tactile mobile (touchstart/touchmove/touchend)"
echo "  ✅ Volume initialisé à 70% au démarrage"
echo "  ✅ Méthodes setVolume() et getCurrentVolume()"
echo "  ✅ Application automatique volume aux nouveaux tracks"
echo "  ✅ Logs détaillés pour debugging"
echo "  ✅ Prévention sélection texte pendant drag"
echo ""
echo "🎧 Test du player :"
echo "  - Ouvrez la page avec les albums"
echo "  - Cliquez sur un album pour lancer le player sticky"
echo "  - Le volume devrait être à 70% par défaut"
echo "  - Cliquez n'importe où sur le slider de volume"
echo "  - Faites glisser le curseur de volume"
echo "  - Testez sur mobile/tactile"
echo ""
echo "🔊 Le contrôle du volume devrait maintenant fonctionner parfaitement !"
