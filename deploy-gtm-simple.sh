#!/bin/bash

# 🚀 Déploiement simple de Google Tag Manager
# Ajoute manuellement le composant GTM aux pages principales

echo "🚀 Déploiement simple Google Tag Manager"
echo "======================================="

# Créer le composant GTM s'il n'existe pas
if [ ! -f "src/components/GTM.astro" ]; then
    echo "❌ Composant GTM manquant"
    exit 1
fi

echo "📝 Modification des pages principales..."

# Fonction pour ajouter GTM à une page
add_gtm_to_page() {
    local file="$1"
    local import_line="import GTM from '../components/GTM.astro';"

    if [ -f "$file" ]; then
        echo "  🔧 Modification de $file..."

        # Ajouter l'import si pas déjà présent
        if ! grep -q "import GTM" "$file"; then
            sed -i "1a $import_line" "$file"
        fi

        # Ajouter le composant GTM dans le head si pas déjà présent
        if ! grep -q "<GTM" "$file"; then
            sed -i '/<head>/a \    <GTM />' "$file"
        fi

        echo "  ✅ $file modifié"
    fi
}

# Modifier les pages principales
add_gtm_to_page "src/pages/index.astro"
add_gtm_to_page "src/pages/brief-new.astro"
add_gtm_to_page "src/pages/brief.astro"
add_gtm_to_page "src/pages/confirmation.astro"
add_gtm_to_page "src/pages/payment.astro"
add_gtm_to_page "src/pages/cgv.astro"

# Modifier les pages story
for story_file in src/pages/story/*.astro; do
    if [[ "$story_file" != *"admin"* ]]; then
        add_gtm_to_page "$story_file"
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
    echo "🎉 Google Tag Manager déployé avec succès !"
    echo ""
    echo "📊 Pages modifiées :"
    echo "  ✅ Accueil (/)"
    echo "  ✅ Création brief (/brief-new)"
    echo "  ✅ Pages story (/story/*)"
    echo "  ✅ Confirmation (/confirmation)"
    echo "  ✅ Paiement (/payment)"
    echo "  ✅ CGV (/cgv)"
    echo ""
    echo "🧪 Test :"
    echo "  - Ouvrez https://poppymusic.fr"
    echo "  - Vérifiez le code source (<head>)"
    echo "  - Cherchez 'GTM-NGZ6SCTP'"
else
    echo "❌ Échec du build"
    exit 1
fi
