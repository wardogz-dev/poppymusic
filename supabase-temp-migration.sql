-- Migration temporaire pour tester sans le champ sensitive_topics
-- À exécuter dans Supabase SQL Editor pour tester immédiatement

-- ÉTAPE 1: Créer la nouvelle table pour les briefs en étapes (sans sensitive_topics)
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
    
    -- À qui (Étape 4)
    target_audience TEXT,
    
    -- Émotions (Étape 5)
    emotions JSONB DEFAULT '[]',
    
    -- Parlez-nous de cette personne (Étape 6)
    about_subject TEXT,
    
    -- Message (Étape 7)
    main_message TEXT,
    
    -- Mots-clés (Étape 8)
    keywords_anecdotes TEXT,
    
    -- Style musical (Étape 9)
    music_style TEXT,
    
    -- Titre (Étape 10)
    song_title TEXT,
    
    -- Inspirations (Étape 11)
    artist_inspirations JSONB DEFAULT '[]',
    
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
COMMENT ON TABLE client_briefs_steps IS 'Table temporaire pour tester le nouveau formulaire de brief en étapes';

-- SUCCÈS !
-- ✅ Table créée pour tester immédiatement
-- ✅ Le champ sensitive_topics sera ajouté plus tard
-- ✅ Le formulaire peut maintenant sauvegarder en BDD
