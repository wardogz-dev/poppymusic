#!/bin/bash

# 🔄 Script de Mise à Jour Pricing Stripe - Passage à 500€
# Usage: bash update-stripe-pricing-500.sh

echo "🔄 Mise à jour du pricing Stripe vers 500€..."

# Vérifier qu'on est sur le serveur
if [ "$USER" != "root" ]; then
    echo "❌ Ce script doit être exécuté en tant que root sur le serveur"
    exit 1
fi

# Aller dans le répertoire de l'application
cd /var/www/poppymusic

echo "📝 Mise à jour de la configuration Stripe..."

# Backup de l'ancien .env
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# Mettre à jour le STRIPE_PRICE_ID avec le nouveau prix à 500€
sed -i 's/STRIPE_PRICE_ID=.*/STRIPE_PRICE_ID=price_1S8LpSLDQESNqm4m9g9UYuv8/' .env

echo "✅ Configuration mise à jour :"
echo "   - Nouveau Price ID : price_1S8LpSLDQESNqm4m9g9UYuv8"
echo "   - Montant : 500€"

echo "🔧 Rebuild de l'application..."
npm run build

echo "🔄 Redémarrage de l'application..."
pm2 restart poppymusic

echo ""
echo "✅ MISE À JOUR TERMINÉE !"
echo ""
echo "🎯 Vérifications à effectuer :"
echo "1. Testez le paiement sur https://poppymusic.fr"
echo "2. Vérifiez que le montant affiché est 500€"
echo "3. Confirmez que le webhook fonctionne"
echo ""
echo "📋 Configuration actuelle :"
grep "STRIPE_PRICE_ID" .env
echo ""
echo "🔙 En cas de problème, restaurez avec :"
echo "   cp .env.backup.* .env && npm run build && pm2 restart poppymusic"
