#!/bin/bash

# 🚀 Script de configuration initiale du serveur Digital Ocean pour Poppy Music
# Usage: bash setup-server.sh

set -e

echo "🎵 Configuration du serveur Poppy Music..."

# Mise à jour du système
echo "📦 Mise à jour du système..."
apt update && apt upgrade -y

# Installation de Node.js 18
echo "🔧 Installation de Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Installation de PM2
echo "⚙️ Installation de PM2..."
npm install -g pm2

# Installation de Nginx
echo "🌐 Installation de Nginx..."
apt install -y nginx

# Création du répertoire de l'application
echo "📁 Création du répertoire d'application..."
mkdir -p /var/www
cd /var/www

# Clonage du repository
echo "📥 Clonage du repository GitHub..."
git clone https://github.com/wardogz-dev/poppymusic.git
cd poppymusic

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm install

# Build initial
echo "🏗️ Build initial du site..."
npm run build

# Configuration PM2
echo "⚡ Configuration PM2..."
pm2 start npm --name "poppymusic" -- run preview
pm2 save
pm2 startup

# Configuration Nginx
echo "🌐 Configuration Nginx..."
cat > /etc/nginx/sites-available/poppymusic << 'EOF'
server {
    listen 80;
    server_name 161.35.43.87;
    
    location / {
        proxy_pass http://localhost:4321;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Activation du site Nginx
ln -sf /etc/nginx/sites-available/poppymusic /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test et redémarrage de Nginx
nginx -t && systemctl reload nginx

# Configuration du firewall
echo "🔒 Configuration du firewall..."
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

echo "✅ Configuration terminée !"
echo "🎵 Votre site Poppy Music est accessible sur : http://161.35.43.87"
echo "📊 Gestion PM2 : pm2 status"
echo "📝 Logs : pm2 logs poppymusic"
