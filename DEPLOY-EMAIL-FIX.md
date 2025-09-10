# 🚀 Déploiement des corrections email Resend/Stripe

## ✅ Statut: Build réussi

Le projet s'est compilé avec succès après toutes les corrections apportées.

## 📋 Résumé des corrections

### 1. ✅ Import corrigé dans le webhook Stripe
- **Fichier:** `src/pages/api/stripe/webhook.ts`
- **Correction:** Import path corrigé de `'../../lib/emailService'` vers `'../../../lib/emailService'`

### 2. ✅ Domaine email corrigé
- **Fichier:** `src/lib/emailService.ts`
- **Correction:** Changement de `onboarding@resend.dev` vers `hello@poppymusic.fr`

### 3. ✅ Logs de debug ajoutés
- Logs détaillés dans le webhook pour tracer l'exécution
- Logs dans EmailService pour suivre l'envoi des emails
- Informations sur les métadonnées de session Stripe

### 4. ✅ Route de debug créée
- **Fichier:** `src/pages/api/debug-email.ts`
- Permet de tester l'envoi d'emails sans paiement réel

### 5. ✅ Import test-email corrigé
- **Fichier:** `src/pages/api/test-email.ts`
- Import path corrigé

## 🚀 Commandes de déploiement

### Sur votre serveur Ubuntu/DigitalOcean:

```bash
# 1. Se connecter au serveur
ssh root@YOUR_SERVER_IP

# 2. Aller dans le répertoire du projet
cd /var/www/poppymusic

# 3. Puller les modifications depuis Git
git pull origin main

# 4. Installer les dépendances
npm install

# 5. Builder le projet
npm run build

# 6. Restart PM2 avec les nouvelles variables d'environnement
pm2 restart poppymusic --update-env

# 7. Vérifier que PM2 fonctionne
pm2 status
pm2 logs poppymusic --lines 20
```

## 🧪 Tests post-déploiement

### 1. Test de l'API de debug
```bash
curl -X POST https://poppymusic.fr/api/debug-email \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 2. Vérifier les logs PM2 en temps réel
```bash
pm2 logs poppymusic --lines 0 --raw
```

### 3. Test de paiement réel
- Créer un brief de test
- Effectuer un paiement
- Vérifier que l'email de confirmation arrive

## 🔍 Points de vérification importants

### Configuration Resend Dashboard
- Vérifier que le domaine `poppymusic.fr` est **vérifié**
- Vérifier que l'adresse `hello@poppymusic.fr` est **autorisée**
- Vérifier les enregistrements DNS (SPF, DKIM, DMARC)

### Configuration Stripe Dashboard
- Webhook URL: `https://poppymusic.fr/api/stripe/webhook`
- Événements: `checkout.session.completed` (obligatoire)
- Signing secret: Copié dans `.env` comme `STRIPE_WEBHOOK_SECRET`

### Variables d'environnement
Vérifier dans `ecosystem.config.cjs` et `.env`:
```javascript
env: {
  STRIPE_PUBLIC_KEY: "...",
  STRIPE_SECRET_KEY: "...",
  STRIPE_WEBHOOK_SECRET: "...",
  STRIPE_PRICE_ID: "...",
  RESEND_API_KEY: "...",
  SITE_URL: "https://poppymusic.fr",
  NODE_ENV: "production"
}
```

## 📊 Logs à surveiller

Après un paiement réussi, vous devriez voir ces logs dans PM2:

```
🎯 Webhook Stripe reçu: checkout.session.completed ID: cs_live_...
💳 Traitement checkout.session.completed
📋 Session Stripe reçue: { id: 'cs_live_...', customer_email: '...', ... }
🔍 Brief ID trouvé: [brief_id]
✅ Brief marqué comme payé: [brief_id]
📧 Données brief récupérées pour email: { ... }
📧 Tentative d'envoi email à: customer@email.com
✅ Email confirmation envoyé au client
📧 Envoi notification équipe pour: [brief_id]
✅ Notification équipe envoyée
```

## 🚨 En cas de problème

### Si les emails ne partent pas:
1. **Vérifier les logs PM2:** `pm2 logs poppymusic --lines 50`
2. **Tester l'API debug:** `curl -X POST https://poppymusic.fr/api/debug-email`
3. **Vérifier Resend:** Dashboard Resend pour les logs d'envoi
4. **Vérifier Stripe:** Dashboard Stripe pour les événements webhook

### Si le webhook ne se déclenche pas:
1. Vérifier l'URL du webhook dans Stripe Dashboard
2. Vérifier le signing secret
3. Vérifier que l'événement `checkout.session.completed` est activé

## 🎯 Prochaines étapes

1. **Déployer les corrections** avec les commandes ci-dessus
2. **Tester avec un paiement réel** en mode production
3. **Surveiller les logs** pour confirmer que tout fonctionne
4. **Mettre à jour la documentation** si nécessaire

## 📞 Support

Si vous rencontrez des problèmes après le déploiement:
- Consultez les logs PM2 en priorité
- Testez l'API de debug
- Vérifiez les configurations Resend et Stripe
- Utilisez le guide de debug détaillé dans `DEBUG-WEBHOOK-STRIPE.md`
