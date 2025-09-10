#!/bin/bash

# 🔐 Script de Configuration Stripe sur le Serveur de Production
# Usage: bash setup-stripe-server.sh

echo "🔐 Configuration Stripe pour PoppyMusic..."

# Vérifier qu'on est sur le serveur
if [ "$USER" != "root" ]; then
    echo "❌ Ce script doit être exécuté en tant que root sur le serveur"
    exit 1
fi

# Aller dans le répertoire de l'application
cd /var/www/poppymusic

echo "📦 Installation de Stripe..."
npm install stripe @types/stripe

echo "⚙️ Configuration des variables d'environnement..."

# Créer ou mettre à jour le fichier .env
cat > .env << EOF
# Configuration Stripe Production
STRIPE_PUBLIC_KEY=pk_live_VOTRE_CLE_PUBLIQUE_ICI
STRIPE_SECRET_KEY=sk_live_VOTRE_CLE_SECRETE_ICI
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_WEBHOOK_SECRET_ICI
STRIPE_PRICE_ID=price_VOTRE_PRICE_ID_199EUR_ICI

# Configuration Application
NODE_ENV=production
SITE_URL=https://poppymusic.fr

# Configuration Supabase (déjà existante)
SUPABASE_URL=https://ntvnhcpkzpovqgcaiawx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50dm5oY3BrenBvdnFnY2FpYXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NTg5OTgsImV4cCI6MjA3MjIzNDk5OH0.GQfgar4VTEz3H73usQRb9Vqa3gBfOfomZgXjPlasTSw
EOF

# Sécuriser le fichier .env
chmod 600 .env
chown www-data:www-data .env

# Ajouter .env au .gitignore s'il n'y est pas déjà
if ! grep -q "^\.env$" .gitignore; then
    echo ".env" >> .gitignore
fi

echo "🔒 Sécurisation des fichiers..."
echo "✅ Fichier .env créé avec permissions 600"
echo "✅ Propriétaire : www-data"
echo "✅ .env ajouté au .gitignore"

echo ""
echo "🔧 ÉTAPES SUIVANTES MANUELLES :"
echo "1. Éditez le fichier .env avec vos vraies clés Stripe :"
echo "   nano .env"
echo ""
echo "2. Remplacez ces valeurs :"
echo "   - STRIPE_PUBLIC_KEY=pk_live_..."
echo "   - STRIPE_SECRET_KEY=sk_live_..."
echo "   - STRIPE_WEBHOOK_SECRET=whsec_..."
echo "   - STRIPE_PRICE_ID=price_..."
echo ""
echo "3. Rebuild et redémarrez :"
echo "   npm run build"
echo "   pm2 reload poppymusic"
echo ""
echo "4. Configurez le webhook dans Stripe Dashboard :"
echo "   URL: https://poppymusic.fr/api/stripe/webhook"
echo "   Événements: checkout.session.completed, payment_intent.succeeded"
echo ""
echo "🚀 Configuration Stripe prête !"
