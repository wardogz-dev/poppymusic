# 🧪 Test CLI Resend - Guide d'utilisation

## 📋 Description

Script Node.js pour tester l'intégration Resend sans passer par Astro/Stripe. Permet de valider rapidement que votre clé API Resend fonctionne correctement.

## 🚀 Utilisation

### Installation des dépendances
```bash
npm install dotenv resend
```

### Tests de base

```bash
# Test email client (par défaut)
node test-resend.js

# Test notification équipe
node test-resend.js hello@poppymusic.fr team

# Test avec email spécifique
node test-resend.js votremail@test.com client
```

## 📧 Types d'emails testés

### 1. Email client (`client`)
- Template HTML professionnel
- Confirmation de commande fictive
- Design Poppy Music
- Données de test réalistes

### 2. Notification équipe (`team`)
- Format simple pour l'équipe
- Informations client
- Lien vers l'admin (simulé)
- Style professionnel

## 🔧 Configuration requise

### Variables d'environnement (.env)
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
SITE_URL=https://poppymusic.fr
```

### Dépendances package.json
```json
{
  "dependencies": {
    "dotenv": "^16.0.0",
    "resend": "^2.0.0"
  }
}
```

## 📊 Exemples d'utilisation

### Test rapide
```bash
node test-resend.js
```
Output:
```
🚀 Script de test Resend CLI
================================
ℹ️  Configuration:
  - Email destinataire: hello@poppymusic.fr
  - Type de test: client
  - Site URL: https://poppymusic.fr
  - API Key présente: true

ℹ️  Début du test client...
✅ RESEND_API_KEY trouvée
ℹ️  Client Resend initialisé
ℹ️  Envoi d'email de confirmation client...
✅ Email envoyé avec succès !
✅ ID de l'email: xxxxxxxxxxxxxxxx
ℹ️  Destinataire: hello@poppymusic.fr
ℹ️  Type: client

✅ Test client réussi ! 🎉
ℹ️  Vérifiez votre boîte mail: hello@poppymusic.fr
```

### Test avec email personnalisé
```bash
node test-resend.js monemail@test.com team
```

### Test en mode debug
```bash
DEBUG=* node test-resend.js
```

## 🔍 Dépannage

### Erreur: RESEND_API_KEY non trouvée
```bash
❌ RESEND_API_KEY non trouvée dans les variables d'environnement
❌ Assurez-vous que le fichier .env existe et contient RESEND_API_KEY
```

**Solution:**
- Vérifier que le fichier `.env` existe
- Vérifier que la variable `RESEND_API_KEY` est définie
- Recharger les variables avec `source .env`

### Erreur: Module 'resend' non trouvé
```bash
Error: Cannot find module 'resend'
```

**Solution:**
```bash
npm install resend dotenv
```

### Erreur: Domaine non vérifié
```bash
❌ Erreur lors de l'envoi: Domain not verified
```

**Solution:**
- Vérifier dans le dashboard Resend que `poppymusic.fr` est vérifié
- Vérifier les enregistrements DNS (SPF, DKIM, DMARC)

## 📋 Données de test utilisées

```javascript
{
  id: "test-[timestamp]",
  firstName: "Test",
  lastName: "CLI",
  email: "hello@poppymusic.fr",
  songTitle: "Test CLI - Ma Chanson Personnalisée",
  targetFirstName: "Marie",
  targetLastName: "Dupont",
  targetRelation: "ma sœur",
  purposeTag: "Anniversaire",
  amountPaid: 19900, // 199€ en centimes
  stripeSessionId: "cs_test_cli_[timestamp]"
}
```

## 🎯 Cas d'usage

- ✅ **Validation initiale**: Tester que Resend fonctionne
- ✅ **Debug production**: Vérifier les emails sans paiement
- ✅ **Test domaine**: Valider la configuration DNS
- ✅ **CI/CD**: Intégration dans le pipeline de déploiement

## 📞 Support

En cas de problème:
1. Vérifier les logs détaillés du script
2. Consulter le dashboard Resend pour les logs d'envoi
3. Vérifier la configuration DNS du domaine
4. Tester avec l'API `/api/debug-email` d'Astro

---

**Note**: Ce script utilise les mêmes templates HTML que votre vraie application pour garantir la cohérence visuelle.
