-- Migration finale avec tous les nouveaux champs
-- À exécuter dans Supabase SQL Editor

-- ÉTAPE 1: Créer la nouvelle table complète
CREATE TABLE IF NOT EXISTS client_briefs_steps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    
    -- Informations personnelles (Étape 1)
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    
    -- Catégorie/Pourquoi (Étape 3)
    purpose_tag TEXT,
    
    -- Informations personne cible (Étape 4)
    target_first_name TEXT,
    target_last_name TEXT,
    target_birth_date DATE,
    target_gender TEXT,
    target_relation TEXT,
    
    -- Émotions (Étape 5)
    emotions JSONB DEFAULT '[]',
    
    -- Parlez-nous de cette personne (Étape 6)
    about_subject TEXT,
    
    -- Message (Étape 7)
    main_message TEXT,
    
    -- Mots-clés/anecdotes (Étape 8)
    keywords_anecdotes TEXT,
    
    -- Style musical (Étape 9)
    music_style TEXT,
    
    -- Titre (Étape 10)
    song_title TEXT,
    
    -- Inspirations (Étape 11)
    artist_inspirations JSONB DEFAULT '[]',
    
    -- Sujets sensibles (Étape 12)
    sensitive_topics TEXT,
    
    -- Métadonnées
    current_step INTEGER DEFAULT 1,
    is_completed BOOLEAN DEFAULT FALSE,
    is_paid BOOLEAN DEFAULT FALSE,
    payment_intent_id TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE
);

-- ÉTAPE 2: Index pour les performances
CREATE INDEX IF NOT EXISTS idx_client_briefs_steps_session_id ON client_briefs_steps(session_id);
CREATE INDEX IF NOT EXISTS idx_client_briefs_steps_email ON client_briefs_steps(email);
CREATE INDEX IF NOT EXISTS idx_client_briefs_steps_created_at ON client_briefs_steps(created_at);
CREATE INDEX IF NOT EXISTS idx_client_briefs_steps_is_completed ON client_briefs_steps(is_completed);

-- ÉTAPE 3: Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_client_briefs_steps_updated_at ON client_briefs_steps;
CREATE TRIGGER update_client_briefs_steps_updated_at 
    BEFORE UPDATE ON client_briefs_steps 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ÉTAPE 4: RLS (Row Level Security)
ALTER TABLE client_briefs_steps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert" ON client_briefs_steps;
DROP POLICY IF EXISTS "Allow public select" ON client_briefs_steps;
DROP POLICY IF EXISTS "Allow public update" ON client_briefs_steps;

CREATE POLICY "Allow public insert" ON client_briefs_steps FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON client_briefs_steps FOR SELECT USING (true);
CREATE POLICY "Allow public update" ON client_briefs_steps FOR UPDATE USING (true);

-- COMMENTAIRES
COMMENT ON TABLE client_briefs_steps IS 'Table complète pour le nouveau formulaire de brief en 12 étapes';

-- SUCCÈS !
-- ✅ Table avec tous les nouveaux champs
-- ✅ Informations détaillées sur la personne cible
-- ✅ Nouvelles émotions et univers musicaux
-- ✅ Limites de caractères augmentées
