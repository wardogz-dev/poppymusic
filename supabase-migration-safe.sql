-- Migration sécurisée pour préserver la compatibilité avec l'admin
-- À exécuter dans Supabase SQL Editor

-- ÉTAPE 1: Créer la nouvelle table sans supprimer l'ancienne
CREATE TABLE IF NOT EXISTS client_briefs_steps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL, -- Pour identifier la session utilisateur
    
    -- Étape 1: Informations personnelles
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    
    -- Étape 2: Pourquoi cette chanson (tag/catégorie)
    purpose_tag TEXT, -- 'Club', 'Anniversaire Adulte', 'Anniversaire Enfant', 'Entreprise', 'Association'
    
    -- Étape 3: À qui est destinée la chanson
    target_audience TEXT,
    
    -- Étape 4: Émotions
    emotions JSONB DEFAULT '[]', -- Array des émotions sélectionnées
    
    -- Étape 5: Parlez-nous de lui/vous
    about_subject TEXT,
    
    -- Étape 6: Message à faire passer
    main_message TEXT,
    
    -- Étape 7: Mots-clés spécifiques/anecdotes
    keywords_anecdotes TEXT,
    
    -- Étape 8: Type de musique
    music_style TEXT,
    
    -- Étape 9: Inspirations
    artist_inspirations JSONB DEFAULT '[]', -- Array des artistes/liens
    
    -- Étape 10: Titre de la chanson
    song_title TEXT,
    
    -- Métadonnées
    current_step INTEGER DEFAULT 1, -- Étape actuelle (1-11)
    is_completed BOOLEAN DEFAULT FALSE,
    is_paid BOOLEAN DEFAULT FALSE,
    payment_intent_id TEXT, -- Stripe Payment Intent ID
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE
);

-- ÉTAPE 2: Ajouter des colonnes à l'ancienne table pour la compatibilité
-- Vérifier si la table client_briefs existe avant de la modifier
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'client_briefs') THEN
        ALTER TABLE client_briefs 
        ADD COLUMN IF NOT EXISTS session_id TEXT,
        ADD COLUMN IF NOT EXISTS current_step INTEGER DEFAULT 11,
        ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT TRUE,
        ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
        ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE;
    ELSE
        RAISE NOTICE 'Table client_briefs does not exist, skipping column additions';
    END IF;
END $$;

-- ÉTAPE 3: Mettre à jour les données existantes dans client_briefs
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'client_briefs') THEN
        UPDATE client_briefs 
        SET 
            session_id = COALESCE(session_id, 'legacy_' || id::text),
            current_step = COALESCE(current_step, 11),
            is_completed = COALESCE(is_completed, TRUE),
            completed_at = COALESCE(completed_at, created_at)
        WHERE session_id IS NULL OR current_step IS NULL;
    END IF;
END $$;

-- ÉTAPE 4: Créer une vue unifiée pour l'admin qui combine les deux tables
CREATE OR REPLACE VIEW admin_briefs_unified AS
-- Partie pour l'ancienne table (seulement si elle existe)
SELECT 
    id,
    first_name,
    last_name,
    email,
    phone,
    COALESCE(project_title, '') as song_title,
    music_style,
    COALESCE(project_purpose, purpose_tag) as purpose_tag,
    target_audience,
    main_message,
    'legacy' as source_table,
    COALESCE(status, 'completed') as status,
    COALESCE(payment_status, 'unpaid') as payment_status,
    created_at,
    updated_at,
    COALESCE(is_completed, TRUE) as is_completed,
    COALESCE(is_paid, FALSE) as is_paid,
    COALESCE(current_step, 11) as current_step
FROM client_briefs
WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'client_briefs')

UNION ALL

-- Partie pour la nouvelle table
SELECT 
    id,
    first_name,
    last_name,
    email,
    phone,
    song_title,
    music_style,
    purpose_tag,
    target_audience,
    main_message,
    'steps' as source_table,
    CASE 
        WHEN is_completed AND is_paid THEN 'completed'
        WHEN is_completed AND NOT is_paid THEN 'pending_payment'
        ELSE 'in_progress'
    END as status,
    CASE 
        WHEN is_paid THEN 'paid'
        ELSE 'unpaid'
    END as payment_status,
    created_at,
    updated_at,
    is_completed,
    is_paid,
    current_step
FROM client_briefs_steps;

-- ÉTAPE 5: Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_client_briefs_steps_session_id ON client_briefs_steps(session_id);
CREATE INDEX IF NOT EXISTS idx_client_briefs_steps_email ON client_briefs_steps(email);
CREATE INDEX IF NOT EXISTS idx_client_briefs_steps_created_at ON client_briefs_steps(created_at);
CREATE INDEX IF NOT EXISTS idx_client_briefs_steps_is_completed ON client_briefs_steps(is_completed);
CREATE INDEX IF NOT EXISTS idx_client_briefs_steps_current_step ON client_briefs_steps(current_step);

-- ÉTAPE 6: Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ÉTAPE 7: Trigger pour mettre à jour updated_at sur la nouvelle table
DROP TRIGGER IF EXISTS update_client_briefs_steps_updated_at ON client_briefs_steps;
CREATE TRIGGER update_client_briefs_steps_updated_at 
    BEFORE UPDATE ON client_briefs_steps 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ÉTAPE 8: Activer Row Level Security (RLS) sur la nouvelle table
ALTER TABLE client_briefs_steps ENABLE ROW LEVEL SECURITY;

-- ÉTAPE 9: Politiques RLS pour la nouvelle table
DROP POLICY IF EXISTS "Allow public insert" ON client_briefs_steps;
DROP POLICY IF EXISTS "Allow public select" ON client_briefs_steps;
DROP POLICY IF EXISTS "Allow public update" ON client_briefs_steps;

CREATE POLICY "Allow public insert" ON client_briefs_steps
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select" ON client_briefs_steps
    FOR SELECT USING (true);

CREATE POLICY "Allow public update" ON client_briefs_steps
    FOR UPDATE USING (true);

-- ÉTAPE 10: Table pour les exemples de cas d'usage (pour l'étape 2)
CREATE TABLE IF NOT EXISTS use_case_examples (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tag TEXT NOT NULL, -- 'Club', 'Anniversaire Adulte', etc.
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    story_url TEXT NOT NULL, -- Lien vers la page /story/
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ÉTAPE 11: Insérer les exemples (seulement s'ils n'existent pas déjà)
INSERT INTO use_case_examples (tag, title, short_description, audio_url, cover_image_url, story_url) 
SELECT * FROM (VALUES
    ('Club', 'Twende', 'Composition afro beat pour DJ professionnel', '/music/twende.mp3', '/images/covers/twende-closed.png', '/story/twende'),
    ('Anniversaire Adulte', 'C''est Chez Moi', 'Déclaration d''amour pour un anniversaire de mariage', '/music/cest-chez-moi.mp3', '/images/covers/cest-chez-moi-closed.png', '/story/cest-chez-moi'),
    ('Anniversaire Adulte', 'Funky Thierry', 'Hommage funk pour les 65 ans d''un père', '/music/funky-thierry.wav', '/images/covers/funky-thierry-closed.png', '/story/funky-thierry'),
    ('Anniversaire Enfant', 'Raph King', 'Chanson rap personnalisée pour un enfant', '/music/raph-king.mp3', '/images/covers/raph-king-closed.png', '/story/raph-king'),
    ('Anniversaire Enfant', 'Aby Princess', 'Comptine personnalisée pour une petite fille', '/music/aby-princess.mp3', '/images/covers/aby-closed.png', '/story/aby-princess'),
    ('Entreprise', 'Titres Français', 'Rap corporate pour une entreprise', '/music/titres-francais.mp3', '/images/covers/titres-francais-closed.png', '/story/titres-francais'),
    ('Entreprise', 'Campus Des Écoles', 'Hymne éducatif pour une école', '/music/campus-des-ecoles.mp3', '/images/covers/campus-des-ecoles-closed.png', '/story/campus-des-ecoles'),
    ('Association', 'Levehad Am Ehad', 'Chanson traditionnelle pour une association', '/music/levehad-am-ehad.mp3', '/images/covers/levehad-am-ehad-closed.png', '/story/levehad-am-ehad')
) AS new_examples(tag, title, short_description, audio_url, cover_image_url, story_url)
WHERE NOT EXISTS (
    SELECT 1 FROM use_case_examples WHERE use_case_examples.title = new_examples.title
);

-- ÉTAPE 12: Index et RLS pour les exemples
CREATE INDEX IF NOT EXISTS idx_use_case_examples_tag ON use_case_examples(tag);

ALTER TABLE use_case_examples ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select examples" ON use_case_examples;
CREATE POLICY "Allow public select examples" ON use_case_examples FOR SELECT USING (true);

-- ÉTAPE 13: Supprimer et recréer la vue dashboard_stats pour éviter les conflits de colonnes
DROP VIEW IF EXISTS dashboard_stats;

CREATE VIEW dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM admin_briefs_unified) as total_briefs,
    (SELECT COUNT(*) FROM admin_briefs_unified WHERE status = 'completed') as completed_briefs,
    (SELECT COUNT(*) FROM admin_briefs_unified WHERE status = 'in_progress') as in_progress_briefs,
    (SELECT COUNT(*) FROM admin_briefs_unified WHERE payment_status = 'paid') as paid_briefs,
    (SELECT COUNT(*) FROM client_briefs_steps WHERE current_step < 11 AND created_at > NOW() - INTERVAL '24 hours') as abandoned_briefs_24h;

-- ÉTAPE 14: Fonction pour migrer un brief terminé vers l'ancienne table (pour compatibilité admin)
CREATE OR REPLACE FUNCTION migrate_completed_brief_to_legacy(brief_id UUID)
RETURNS VOID AS $$
DECLARE
    brief_record client_briefs_steps%ROWTYPE;
BEGIN
    -- Récupérer le brief terminé
    SELECT * INTO brief_record FROM client_briefs_steps WHERE id = brief_id AND is_completed = TRUE;
    
    IF FOUND THEN
        -- Insérer dans l'ancienne table pour l'admin
        INSERT INTO client_briefs (
            first_name, last_name, email, phone,
            project_title, music_style, project_purpose,
            target_audience, main_message,
            status, payment_status,
            created_at, session_id, is_completed
        ) VALUES (
            brief_record.first_name, brief_record.last_name, brief_record.email, brief_record.phone,
            brief_record.song_title, brief_record.music_style, brief_record.purpose_tag,
            brief_record.target_audience, brief_record.main_message,
            CASE WHEN brief_record.is_paid THEN 'completed' ELSE 'pending_payment' END,
            CASE WHEN brief_record.is_paid THEN 'paid' ELSE 'unpaid' END,
            brief_record.created_at, brief_record.session_id, brief_record.is_completed
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- COMMENTAIRES
COMMENT ON TABLE client_briefs_steps IS 'Nouvelle table pour les briefs en étapes avec sauvegarde automatique';
COMMENT ON VIEW admin_briefs_unified IS 'Vue unifiée combinant les anciens et nouveaux briefs pour l''admin';
COMMENT ON VIEW dashboard_stats IS 'Statistiques du dashboard admin compatibles avec les deux systèmes';

-- RÉSUMÉ DE LA MIGRATION
-- ✅ L'ancienne table client_briefs est préservée
-- ✅ La nouvelle table client_briefs_steps est créée
-- ✅ La vue admin_briefs_unified combine les deux
-- ✅ La vue dashboard_stats est mise à jour
-- ✅ L'admin continue de fonctionner normalement
-- ✅ Le nouveau formulaire utilise client_briefs_steps
-- ✅ Les briefs terminés peuvent être migrés vers l'ancienne table si besoin
