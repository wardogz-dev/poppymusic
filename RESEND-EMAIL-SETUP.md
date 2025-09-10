# 📧 Configuration Resend Email - PoppyMusic

## 🎯 FONCTIONNALITÉS EMAIL AJOUTÉES

### ✅ **Emails automatiques après paiement :**
- **Client** : Email de confirmation avec détails de commande
- **Équipe** : Notification de nouvelle commande payée
- **Design** : Template HTML professionnel aux couleurs Poppy Music

## 🔧 CONFIGURATION REQUISE

### 1. **Clé API Resend**
Tu as déjà configuré ton sous-domaine et ta clé API Resend.

### 2. **Variables d'environnement**
Ajouter dans `ecosystem.config.cjs` sur le serveur :
```javascript
RESEND_API_KEY: "VOTRE_VRAIE_CLE_RESEND_ICI"
```

### 3. **Domaine d'envoi configuré**
- **From** : `noreply@poppymusic.fr`
- **Reply-to** : `hello@poppymusic.fr`

## 📨 EMAILS ENVOYÉS

### **1. Email client (confirmation de commande) :**
- **Objet** : `🎵 Confirmation de commande - [Titre chanson]`
- **Contenu** :
  - Confirmation de paiement
  - Détails du projet (destinataire, catégorie, montant)
  - Prochaines étapes (48h validation, 5j composition, 7j livraison)
  - Contact équipe
- **Design** : HTML responsive aux couleurs Poppy Music

### **2. Email équipe (notification interne) :**
- **Objet** : `🔔 Nouvelle commande payée - [Nom client]`
- **Contenu** :
  - Informations client complètes
  - Détails du projet
  - Lien direct vers l'admin
- **Destinataire** : `hello@poppymusic.fr`

## 🚀 DÉCLENCHEMENT AUTOMATIQUE

### **Workflow complet :**
1. **Client** termine le formulaire brief
2. **Paiement** via Stripe Checkout
3. **Webhook Stripe** confirme le paiement
4. **Base de données** mise à jour (`is_paid = true`)
5. **Emails automatiques** envoyés via Resend
6. **Admin** mis à jour avec statut payé

## ⚙️ CONFIGURATION SERVEUR

### **Étapes de déploiement :**
```bash
# 1. SSH sur le serveur
ssh root@161.35.43.87
cd /var/www/poppymusic

# 2. Pull des modifications
git pull origin main
npm install

# 3. Configurer ecosystem.config.cjs
nano ecosystem.config.cjs
# Ajouter : RESEND_API_KEY: "re_VOTRE_VRAIE_CLE"

# 4. Build et restart
npm run build
pm2 restart ecosystem.config.cjs

# 5. Vérifier les logs
pm2 logs poppymusic
```

## 🧪 TEST

### **Pour tester l'envoi d'emails :**
1. Remplir un formulaire brief complet
2. Effectuer un vrai paiement Stripe
3. Vérifier réception des 2 emails
4. Contrôler les logs PM2 pour confirmation

## 📊 LOGS & MONITORING

### **Messages de succès attendus :**
```
✅ Brief marqué comme payé: [brief-id]
✅ Email confirmation envoyé au client
✅ Notification équipe envoyée
```

### **En cas d'erreur :**
```
❌ RESEND_API_KEY non définie
❌ Erreur envoi email: [détails]
```

**Emails automatiques professionnels prêts !** 📧✨
