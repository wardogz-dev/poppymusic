#!/bin/bash

# 🚀 Script de déploiement des corrections email Resend/Stripe
# Usage: ./deploy-email-fix.sh

echo "🚀 Déploiement des corrections email Resend/Stripe"
echo "=================================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si on est dans le bon répertoire
if [ ! -f "package.json" ] || [ ! -f "astro.config.mjs" ]; then
    log_error "Ce script doit être exécuté depuis la racine du projet PoppyMusic"
    exit 1
fi

log_info "Vérification du statut Git..."
if [ -n "$(git status --porcelain)" ]; then
    log_warning "Il y a des changements non committés. Committez-les d'abord:"
    echo "  git add ."
    echo "  git commit -m 'Fix: Correction integration email Resend/Stripe'"
    echo "  git push origin main"
    exit 1
fi

log_info "Pull des dernières modifications..."
git pull origin main

if [ $? -ne 0 ]; then
    log_error "Erreur lors du git pull"
    exit 1
fi

log_success "Git pull réussi"

log_info "Installation des dépendances..."
npm install

if [ $? -ne 0 ]; then
    log_error "Erreur lors de l'installation des dépendances"
    exit 1
fi

log_success "Dépendances installées"

log_info "Build du projet..."
npm run build

if [ $? -ne 0 ]; then
    log_error "Erreur lors du build"
    exit 1
fi

log_success "Build réussi"

log_info "Restart PM2 avec les nouvelles variables d'environnement..."
pm2 restart poppymusic --update-env

if [ $? -ne 0 ]; then
    log_error "Erreur lors du restart PM2"
    exit 1
fi

log_success "PM2 redémarré"

log_info "Vérification du statut PM2..."
pm2 status

echo ""
log_success "🎉 Déploiement terminé avec succès !"
echo ""
log_info "Prochaines étapes:"
echo "1. Tester l'API de debug: curl -X POST https://poppymusic.fr/api/debug-email"
echo "2. Surveiller les logs: pm2 logs poppymusic --lines 0 --raw"
echo "3. Tester un paiement réel pour vérifier les emails"
echo ""
log_info "📋 Logs importants à surveiller:"
echo "  - '🎯 Webhook Stripe reçu'"
echo "  - '📧 Tentative d\\'envoi email à:'"
echo "  - '✅ Email confirmation envoyé au client'"
echo ""
log_warning "N'oubliez pas de vérifier:"
echo "  - Configuration Resend Dashboard (domaine vérifié)"
echo "  - Configuration webhook Stripe"
echo "  - Variables d'environnement dans ecosystem.config.cjs"
