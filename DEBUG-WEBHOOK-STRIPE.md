# 🔧 Debug Webhook Stripe - Guide de vérification

## ✅ Corrections apportées

### 1. Import corrigé dans le webhook
- **Avant:** `import { EmailService } from '../../lib/emailService';`
- **Après:** `import { EmailService } from '../../../lib/emailService';`

### 2. Domaine email corrigé
- **Avant:** `onboarding@resend.dev` (domaine par défaut, souvent bloqué)
- **Après:** `hello@poppymusic.fr` (votre domaine)

### 3. Logs de debug ajoutés
- Logs détaillés dans le webhook Stripe
- Logs dans EmailService pour tracer l'envoi
- Informations sur les métadonnées de session

## 🧪 Tests à effectuer

### 1. Test de l'API debug email
```bash
curl -X POST https://poppymusic.fr/api/debug-email \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 2. Vérifier les logs PM2
```bash
pm2 logs poppymusic --lines 50
```

### 3. Test webhook local (si nécessaire)
```bash
# Installer Stripe CLI
stripe login
stripe listen --forward-to localhost:4321/api/stripe/webhook
```

## 🔍 Configuration Stripe à vérifier

### 1. Dans le Dashboard Stripe (https://dashboard.stripe.com)

**Webhooks → Endpoints:**
- URL: `https://poppymusic.fr/api/stripe/webhook`
- Événements écoutés:
  - ✅ `checkout.session.completed`
  - ✅ `payment_intent.succeeded` (optionnel)
  - ✅ `payment_intent.payment_failed` (optionnel)

**Signing secret:**
- Copier le signing secret dans votre `.env` comme `STRIPE_WEBHOOK_SECRET`

### 2. Variables d'environnement à vérifier

Dans votre `.env` et `ecosystem.config.cjs`:
```bash
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
RESEND_API_KEY=re_...
```

### 3. Configuration du domaine Resend

**Important:** Vérifiez dans Resend Dashboard que:
- Le domaine `poppymusic.fr` est vérifié
- Les enregistrements DNS sont correctement configurés
- L'adresse `hello@poppymusic.fr` est autorisée

## 🐛 Points de vérification pour les métadonnées

### Dans votre code de création de session Stripe

Assurez-vous que les métadonnées sont bien passées:
```javascript
const session = await stripe.checkout.sessions.create({
  // ... autres paramètres
  metadata: {
    briefId: briefId, // ou sessionId selon votre logique
    sessionId: sessionId // si vous utilisez cette approche
  }
});
```

## 📋 Checklist de debug

- [ ] Build du projet sans erreurs: `npm run build`
- [ ] Restart PM2: `pm2 restart poppymusic --update-env`
- [ ] Test API debug: `curl -X POST https://poppymusic.fr/api/debug-email`
- [ ] Vérifier logs PM2: `pm2 logs poppymusic`
- [ ] Configuration webhook Stripe correcte
- [ ] Domaine Resend vérifié
- [ ] Variables d'environnement présentes
- [ ] Test paiement réel avec observation des logs

## 🔄 Processus de test complet

1. **Test email direct:**
   ```bash
   curl -X POST https://poppymusic.fr/api/debug-email
   ```

2. **Créer un brief de test**
3. **Effectuer un paiement test**
4. **Observer les logs PM2 en temps réel:**
   ```bash
   pm2 logs poppymusic --lines 0 --raw
   ```

## 📞 Points de contact pour debug

Si les emails ne partent toujours pas:
1. Vérifier les logs PM2 pour les erreurs
2. Tester l'API debug-email
3. Vérifier la configuration Resend Dashboard
4. Vérifier les métadonnées dans les logs Stripe
