# 🚀 Guide de Déploiement Poppy Music

## 📋 Prérequis

- Serveur Digital Ocean : `161.35.43.87`
- Repository GitHub : `https://github.com/wardogz-dev/poppymusic`
- Accès SSH au serveur

## 🛠 Configuration Initiale du Serveur

### 1. Connexion au serveur
```bash
ssh root@161.35.43.87
```

### 2. Exécution du script de setup
```bash
# Télécharger et exécuter le script de configuration
curl -sSL https://raw.githubusercontent.com/wardogz-dev/poppymusic/main/deploy/setup-server.sh | bash
```

### 3. Configuration des secrets GitHub (dans GitHub → Settings → Secrets)
```
DO_HOST = 161.35.43.87
DO_USERNAME = root
DO_SSH_KEY = [votre clé SSH privée]
```

## 🔄 Déploiement Automatique

### Via GitHub Actions (Recommandé)
- ✅ **Push vers main** → Déploiement automatique
- ✅ **Build + Deploy** → Automatisé
- ✅ **PM2 reload** → Zero downtime

### Via Script Manuel
```bash
# Sur le serveur
bash /var/www/poppymusic/deploy/quick-deploy.sh
```

## 📊 Gestion de l'Application

### Commandes PM2 utiles
```bash
pm2 status              # Voir l'état de l'app
pm2 logs poppymusic     # Voir les logs
pm2 reload poppymusic   # Redémarrer sans downtime
pm2 stop poppymusic     # Arrêter l'app
pm2 start poppymusic    # Démarrer l'app
```

### Nginx
```bash
systemctl status nginx  # État de Nginx
systemctl reload nginx  # Recharger la config
nginx -t               # Tester la config
```

## 🌐 URLs d'Accès

- **Site principal** : http://161.35.43.87
- **Cas d'usage exemple** : http://161.35.43.87/cas-usage/funky-thierry

## 🔧 Dépannage

### Site inaccessible
```bash
# Vérifier PM2
pm2 status

# Vérifier Nginx
systemctl status nginx

# Vérifier les ports
netstat -tulpn | grep :80
netstat -tulpn | grep :4321
```

### Logs d'erreur
```bash
# Logs PM2
pm2 logs poppymusic

# Logs Nginx
tail -f /var/log/nginx/error.log
```

## 📱 Structure de Déploiement

```
Serveur Digital Ocean (161.35.43.87)
├── Nginx (Port 80) → Reverse Proxy
└── PM2 → Astro App (Port 4321)
    └── GitHub Actions → Auto Deploy
```

## ⚡ Commandes Rapides

```bash
# Déploiement complet depuis votre machine
git add . && git commit -m "Update" && git push

# Redémarrage rapide sur le serveur
pm2 reload poppymusic

# Mise à jour manuelle
cd /var/www/poppymusic && git pull && npm run build && pm2 reload poppymusic
```

---

🎵 **Votre studio Poppy Music est maintenant en ligne !** ✨
