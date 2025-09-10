# 📧 Configuration Domaine Resend - PoppyMusic

## ⚠️ PROBLÈME IDENTIFIÉ
Les emails ne sont pas envoyés car le domaine `poppymusic.fr` n'est pas encore vérifié dans Resend.

## 🔧 SOLUTIONS POSSIBLES

### **Option 1: Utiliser le domaine par défaut Resend (RAPIDE)**
✅ **Déjà configuré** dans le code : `onboarding@resend.dev`
✅ **Fonctionne immédiatement** sans configuration
✅ **Pour tester** et commencer rapidement

### **Option 2: Configurer ton propre domaine (PROFESSIONNEL)**

#### **Étapes dans Resend Dashboard :**
1. **Aller sur** https://resend.com/domains
2. **Ajouter un domaine** : `poppymusic.fr`
3. **Configurer les enregistrements DNS** :
   - **SPF** : `v=spf1 include:_spf.resend.com ~all`
   - **DKIM** : Clé fournie par Resend
   - **DMARC** : `v=DMARC1; p=quarantine;`

#### **Dans ton DNS (chez ton hébergeur) :**
```
Type: TXT
Nom: @
Valeur: v=spf1 include:_spf.resend.com ~all

Type: TXT  
Nom: resend._domainkey
Valeur: [Clé DKIM fournie par Resend]

Type: TXT
Nom: _dmarc
Valeur: v=DMARC1; p=quarantine; rua=mailto:hello@poppymusic.fr
```

#### **Une fois vérifié, modifier le code :**
```typescript
from: 'Poppy Music <noreply@poppymusic.fr>'
```

## 🧪 TEST RAPIDE

### **Pour tester maintenant avec le domaine par défaut :**
```bash
# Sur le serveur
ssh root@161.35.43.87
cd /var/www/poppymusic

# Ajouter ta clé Resend
nano ecosystem.config.cjs
# RESEND_API_KEY: "re_VOTRE_VRAIE_CLE"

# Redémarrer
npm run build
pm2 restart ecosystem.config.cjs

# Tester l'API
curl -X POST https://poppymusic.fr/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"briefId":"test-123","testType":"client"}'
```

## 📊 VÉRIFICATION

### **Logs à surveiller :**
```bash
pm2 logs poppymusic | grep -i email
```

### **Messages attendus :**
```
✅ Email confirmation envoyé au client
✅ Notification équipe envoyée
```

### **En cas d'erreur :**
```
❌ RESEND_API_KEY non définie
❌ Erreur envoi email: [détails]
```

## 🎯 RECOMMANDATION

**Pour démarrer rapidement :**
1. ✅ Utilise `onboarding@resend.dev` (déjà configuré)
2. ✅ Configure ta clé API sur le serveur
3. ✅ Teste un vrai paiement
4. 🔜 Configure ton domaine personnalisé plus tard

**Les emails fonctionneront immédiatement avec le domaine par défaut !** 📧🚀
