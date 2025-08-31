#!/bin/bash

# 🔍 Script de diagnostic de déploiement Poppy Music

echo "🔍 Diagnostic de déploiement Poppy Music"
echo "========================================"

# Test de connectivité
echo "📡 Test de connectivité au serveur..."
if ping -c 1 161.35.43.87 > /dev/null 2>&1; then
    echo "✅ Serveur accessible"
else
    echo "❌ Serveur inaccessible"
    exit 1
fi

# Test du port 80 (Nginx)
echo "🌐 Test du port 80 (Nginx)..."
if nc -zv 161.35.43.87 80 2>/dev/null; then
    echo "✅ Nginx fonctionne (port 80)"
else
    echo "❌ Nginx ne répond pas (port 80)"
fi

# Test du port 4321 (Application)
echo "⚡ Test du port 4321 (Application PM2)..."
if nc -zv 161.35.43.87 4321 2>/dev/null; then
    echo "✅ Application PM2 fonctionne (port 4321)"
else
    echo "❌ Application PM2 ne répond pas (port 4321)"
fi

# Test HTTP
echo "🌍 Test HTTP complet..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://161.35.43.87)
echo "Status HTTP: $HTTP_STATUS"

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Site accessible !"
elif [ "$HTTP_STATUS" = "502" ]; then
    echo "❌ Erreur 502 - Application PM2 probablement arrêtée"
else
    echo "⚠️  Status inattendu: $HTTP_STATUS"
fi

echo ""
echo "🎯 Recommandations:"
echo "1. Vérifiez que les secrets GitHub sont configurés:"
echo "   - HOST: 161.35.43.87"
echo "   - USERNAME: root"
echo "   - SSH_PRIVATE_KEY: [votre clé privée]"
echo ""
echo "2. Si les secrets sont OK, le serveur doit être initialisé:"
echo "   ssh root@161.35.43.87"
echo "   curl -sSL https://raw.githubusercontent.com/wardogz-dev/poppymusic/main/deploy/setup-server.sh | bash"
echo ""
echo "3. Vérifiez les logs GitHub Actions:"
echo "   https://github.com/wardogz-dev/poppymusic/actions"
