# 🚀 DÉPLOIEMENT PRODUCTION - Formulaire Brief Révolutionnaire

## ⚠️ IMPORTANT - MISE À JOUR MAJEURE
Cette mise à jour introduit un nouveau formulaire de brief en 12 étapes avec auto-save et interface admin mise à jour.

---

## ÉTAPE 1: Préparer Supabase (OBLIGATOIRE)

### 1. Ouvrez Supabase Console
- Allez sur https://supabase.com/dashboard
- Projet : PoppyMusic
- Section : SQL Editor

### 2. Exécutez le script de migration
**Copiez-collez EXACTEMENT le contenu de `supabase-temp-migration.sql` :**

```sql
-- Migration temporaire pour tester sans le champ sensitive_topics
CREATE TABLE IF NOT EXISTS client_briefs_steps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    purpose_tag TEXT,
    target_audience TEXT,
    emotions JSONB DEFAULT '[]',
    about_subject TEXT,
    main_message TEXT,
    keywords_anecdotes TEXT,
    music_style TEXT,
    song_title TEXT,
    artist_inspirations JSONB DEFAULT '[]',
    current_step INTEGER DEFAULT 1,
    is_completed BOOLEAN DEFAULT FALSE,
    is_paid BOOLEAN DEFAULT FALSE,
    payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE
);
-- [+ index et RLS...]
```

### 3. Vérifiez la création
```sql
SELECT COUNT(*) FROM client_briefs_steps;
```
**→ Doit retourner 0 (table vide mais créée)**

---

## ÉTAPE 2: Déploiement Automatique

### 1. Le code est déjà pushé sur GitHub
```bash
# Derniers commits :
# fcdf4bd - Formulaire révolutionnaire complet
# 7bcb5b1 - Hero section optimisée
# 6782b4c - Migration routes /story/
```

### 2. Déploiement via script existant
```bash
# Connexion au serveur
ssh root@161.35.43.87

# Lancement du déploiement
cd /var/www/poppymusic
bash deploy/quick-deploy.sh
```

---

## ÉTAPE 3: Nouvelles URLs en Production

### Nouvelles pages disponibles :
- ✅ **https://poppymusic.fr/brief-new** - Nouveau formulaire optimisé
- ✅ **https://poppymusic.fr/payment** - Page de paiement avec récap
- ✅ **https://poppymusic.fr/admin/brief-detail** - Admin détail briefs

### URLs mises à jour :
- ✅ **Tous les CTA** pointent maintenant vers `/brief-new`
- ✅ **Pages /story/** au lieu de `/cas-usage/`
- ✅ **Navigation complète** mise à jour

---

## ÉTAPE 4: Tests Post-Déploiement

### 1. Tests fonctionnels
```bash
# Testez ces URLs :
curl -I https://poppymusic.fr/brief-new
curl -I https://poppymusic.fr/payment
curl -I https://poppymusic.fr/story/twende
```

### 2. Test du formulaire complet
- Allez sur https://poppymusic.fr/brief-new
- Remplissez les 12 étapes
- Vérifiez l'auto-save dans Supabase
- Testez la page de paiement

### 3. Test de l'admin
- https://poppymusic.fr/admin/login
- Vérifiez la liste des briefs
- Testez la page de détail

---

## ÉTAPE 5: Monitoring

### 1. Vérifiez les logs
```bash
# Sur le serveur
pm2 logs poppymusic --lines 50
```

### 2. Vérifiez les APIs
- `/api/briefs/save-step` - Auto-save formulaire
- `/api/briefs/get-brief` - Récap paiement
- `/api/admin/briefs-steps` - Liste admin

---

## 🎯 NOUVELLES FONCTIONNALITÉS EN PROD

### Formulaire Révolutionnaire
- **12 étapes guidées** avec barre de progression
- **Auto-save temps réel** en base de données
- **Interface mobile-first** parfaite
- **13 catégories** + champ "Autre"
- **14 émotions** avec descriptions
- **12 univers musicaux** détaillés
- **Validation progressive** intelligente

### Interface Admin Modernisée
- **Colonnes adaptées** aux nouveaux champs
- **Page de détail** complète
- **APIs dédiées** performantes

### Optimisations UX
- **Boutons sticky** toujours accessibles
- **Compteurs caractères** temps réel
- **Placeholders adaptatifs** par catégorie
- **Récapitulatif** focus personne cible

---

## 🛡️ SÉCURITÉ & ROLLBACK

### En cas de problème
```bash
# Rollback rapide
cd /var/www/poppymusic
git reset --hard 7bcb5b1  # Version précédente stable
npm run build
pm2 reload poppymusic
```

### L'ancien formulaire reste accessible
- **https://poppymusic.fr/brief** - Ancien formulaire (backup)
- **Migration progressive** possible

---

## ✅ CHECKLIST DÉPLOIEMENT

- [ ] Script SQL exécuté dans Supabase
- [ ] Table `client_briefs_steps` créée
- [ ] Code déployé sur le serveur
- [ ] Application redémarrée (PM2)
- [ ] Tests fonctionnels OK
- [ ] Admin fonctionnel
- [ ] Auto-save testé

**🚀 Production prête !**
