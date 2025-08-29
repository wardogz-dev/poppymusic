#!/bin/bash

# 🎵 Installation automatique Poppy Music Studio
# À exécuter sur le serveur Digital Ocean : curl -sSL https://raw.githubusercontent.com/wardogz-dev/poppymusic/main/install.sh | bash

set -e

echo "🎵 =================================================="
echo "🎵 INSTALLATION POPPY MUSIC STUDIO"
echo "🎵 =================================================="

# Variables
REPO_URL="https://github.com/wardogz-dev/poppymusic.git"
APP_DIR="/var/www/poppymusic"
APP_NAME="poppymusic"

# Mise à jour système
echo "📦 Mise à jour du système..."
apt update && apt upgrade -y

# Installation Node.js 18
echo "🔧 Installation Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs git

# Vérification versions
echo "✅ Node.js version: $(node -v)"
echo "✅ NPM version: $(npm -v)"

# Installation PM2
echo "⚙️ Installation PM2..."
npm install -g pm2

# Installation Nginx
echo "🌐 Installation Nginx..."
apt install -y nginx

# Clonage du projet
echo "📥 Clonage du repository..."
rm -rf $APP_DIR
git clone $REPO_URL $APP_DIR
cd $APP_DIR

# Installation dépendances
echo "📦 Installation des dépendances..."
npm install

# Build du site
echo "🏗️ Build du site..."
npm run build

# Configuration PM2
echo "⚡ Configuration PM2..."
pm2 delete $APP_NAME 2>/dev/null || true
pm2 start npm --name "$APP_NAME" -- run preview
pm2 save
pm2 startup

# Configuration Nginx
echo "🌐 Configuration Nginx..."
cat > /etc/nginx/sites-available/$APP_NAME << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;
    
    location / {
        proxy_pass http://localhost:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Activation du site
ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test et redémarrage Nginx
nginx -t
systemctl reload nginx
systemctl enable nginx

# Configuration firewall
echo "🔒 Configuration firewall..."
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

echo ""
echo "🎵 =================================================="
echo "✅ INSTALLATION TERMINÉE !"
echo "🎵 =================================================="
echo ""
echo "🌐 Votre site est accessible sur :"
echo "   👉 http://161.35.43.87"
echo ""
echo "📊 Commandes utiles :"
echo "   pm2 status              - État de l'application"
echo "   pm2 logs $APP_NAME      - Voir les logs"
echo "   pm2 reload $APP_NAME    - Redémarrer l'app"
echo ""
echo "🔄 Pour les mises à jour automatiques :"
echo "   cd $APP_DIR && bash deploy/quick-deploy.sh"
echo ""
echo "🎵 Poppy Music Studio est en ligne ! ✨"
