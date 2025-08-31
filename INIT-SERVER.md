# 🚀 Guide d'Initialisation du Serveur Poppy Music

## Si GitHub Actions échoue, suivez ces étapes :

### 1. Connexion au serveur
```bash
ssh root@161.35.43.87
```

### 2. Installation des prérequis
```bash
# Mise à jour du système
apt update && apt upgrade -y

# Installation de Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Installation de PM2
npm install -g pm2

# Installation de Nginx
apt install -y nginx git
```

### 3. Configuration du projet
```bash
# Création du répertoire
mkdir -p /var/www
cd /var/www

# Clonage du repository
git clone https://github.com/wardogz-dev/poppymusic.git
cd poppymusic

# Installation et build
npm install
npm run build
```

### 4. Configuration PM2
```bash
# Démarrage de l'application
pm2 start npm --name "poppymusic" -- run preview
pm2 save
pm2 startup
```

### 5. Configuration Nginx
```bash
# Création du fichier de configuration
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

# Activation du site
ln -sf /etc/nginx/sites-available/poppymusic /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test et redémarrage
nginx -t && systemctl reload nginx
```

### 6. Configuration du firewall
```bash
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable
```

### 7. Vérification finale
```bash
# Statut PM2
pm2 status

# Test local
curl http://localhost:4321

# Test externe
curl http://161.35.43.87
```

## ✅ Une fois configuré

Après cette initialisation manuelle, GitHub Actions fonctionnera automatiquement pour les prochains déploiements !
