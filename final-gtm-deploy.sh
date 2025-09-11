#!/bin/bash

# 🎯 Déploiement final Google Tag Manager
# Ajoute GTM aux pages restantes

echo "🎯 Déploiement final Google Tag Manager"
echo "======================================"

# Récupérer les dernières modifications
echo "📥 Récupération des mises à jour..."
git pull origin main

echo "📝 Ajout GTM aux pages restantes..."

# Fonction pour ajouter GTM à une page
add_gtm() {
    local file="$1"
    local import_line="import GTM from '../components/GTM.astro';"

    if [ -f "$file" ]; then
        echo "  🔧 $file..."

        # Ajouter l'import
        if ! grep -q "import GTM" "$file"; then
            sed -i "1a $import_line" "$file"
            echo "    ✅ Import ajouté"
        else
            echo "    ℹ️  Import déjà présent"
        fi

        # Ajouter le composant dans le head
        if ! grep -q "<GTM" "$file"; then
            sed -i '/<head>/a \    <GTM />' "$file"
            echo "    ✅ Composant ajouté"
        else
            echo "    ℹ️  Composant déjà présent"
        fi
    fi
}

# Pages principales
add_gtm "src/pages/confirmation.astro"
add_gtm "src/pages/payment.astro"
add_gtm "src/pages/cgv.astro"

# Pages story (toutes sauf celles contenant 'admin')
for story_file in src/pages/story/*.astro; do
    if [[ "$story_file" != *"admin"* ]]; then
        add_gtm "$story_file"
    fi
done

echo ""
echo "🔨 Build du projet..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi !"

    echo "🔄 Redémarrage PM2..."
    pm2 restart poppymusic --update-env

    echo ""
    echo "🎉 Google Tag Manager déployé sur TOUTES les pages !"
    echo ""
    echo "📊 Pages avec GTM :"
    echo "  ✅ Accueil (index.astro)"
    echo "  ✅ Création brief (brief-new.astro)"
    echo "  ✅ Confirmation (confirmation.astro)"
    echo "  ✅ Paiement (payment.astro)"
    echo "  ✅ CGV (cgv.astro)"
    echo "  ✅ Toutes les pages story (/story/*)"
    echo ""
    echo "❌ Pages exclues (admin) :"
    echo "  - /admin/* (toutes les pages admin)"
    echo ""
    echo "🧪 Test du GTM :"
    echo "1. Ouvrez https://poppymusic.fr"
    echo "2. Inspecter > Console : tapez 'dataLayer'"
    echo "3. DevTools > Network : cherchez 'gtm.js'"
    echo "4. Google Tag Manager : vérifiez les hits"
    echo ""
    echo "📈 Container ID : GTM-NGZ6SCTP"
    echo ""
    echo "💡 Le GTM est maintenant actif sur toutes vos pages !"
else
    echo "❌ Échec du build"
    exit 1
fi
