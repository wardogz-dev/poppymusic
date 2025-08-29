# 🚀 Guide de Déploiement Automatique Poppy Music

## ÉTAPE 1: Configuration sur votre serveur Digital Ocean

### 1. Connectez-vous à votre serveur :
```bash
ssh root@161.35.43.87
```

### 2. Générez une clé SSH pour GitHub Actions :
```bash
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/github_actions_key -N ""
```

### 3. Copiez la clé publique :
```bash
cat ~/.ssh/github_actions_key.pub >> ~/.ssh/authorized_keys
```

### 4. Affichez la clé privée (à copier pour GitHub) :
```bash
cat ~/.ssh/github_actions_key
```
**⚠️ COPIEZ TOUT LE CONTENU (y compris -----BEGIN et -----END)**

---

## ÉTAPE 2: Configuration GitHub Secrets

### Allez sur GitHub : https://github.com/wardogz-dev/poppymusic/settings/secrets/actions

### Créez ces 3 secrets :

1. **HOST** : `161.35.43.87`
2. **USERNAME** : `root`
3. **SSH_PRIVATE_KEY** : *[La clé privée copiée à l'étape 4]*

---

## ÉTAPE 3: Correction mobile + Premier test

### 1. Corrigez le problème mobile sur votre serveur :
```bash
# Sur le serveur
cd /var/www/poppymusic

# Ajoutez le fix mobile au CSS
cat >> src/styles/global.css << 'EOF'

/* Fix mobile overflow */
html, body {
  overflow-x: hidden !important;
}

@media (max-width: 768px) {
  .container, .max-w-7xl, .max-w-4xl {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
}
EOF

# Rebuild
npm run build
pm2 reload poppymusic
```

### 2. Testez le déploiement automatique :
```bash
# Sur votre machine locale
git add .
git commit -m "🚀 Configuration déploiement automatique"
git push origin main
```

---

## ✅ RÉSULTAT

Dès que vous ferez un `git push`, GitHub Actions va automatiquement :
1. Installer les dépendances
2. Builder le projet  
3. Se connecter à votre serveur
4. Mettre à jour le code
5. Redémarrer l'application

**Votre site sera mis à jour automatiquement !** 🎉
