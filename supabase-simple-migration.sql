-- Migration super simple et sûre pour Supabase
-- Exécuter ce script pour créer les nouvelles tables sans toucher aux anciennes

-- ÉTAPE 1: Créer la nouvelle table pour les briefs en étapes
CREATE TABLE IF NOT EXISTS client_briefs_steps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    
    -- Informations personnelles (Étape 1)
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    
    -- Catégorie/Pourquoi (Étape 2)
    purpose_tag TEXT,
    
    -- À qui (Étape 3)
    target_audience TEXT,
    
    -- Émotions (Étape 4)
    emotions JSONB DEFAULT '[]',
    
    -- Parlez-nous de lui/vous (Étape 5)
    about_subject TEXT,
    
    -- Message (Étape 6)
    main_message TEXT,
    
    -- Mots-clés (Étape 7)
    keywords_anecdotes TEXT,
    
    -- Style musical (Étape 8)
    music_style TEXT,
    
    -- Inspirations (Étape 9)
    artist_inspirations JSONB DEFAULT '[]',
    
    -- Titre (Étape 10)
    song_title TEXT,
    
    -- Sujets sensibles (Étape 11)
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

-- ÉTAPE 5: Table des exemples pour l'étape 2
CREATE TABLE IF NOT EXISTS use_case_examples (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tag TEXT NOT NULL,
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    story_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ÉTAPE 6: Insérer les exemples (sans doublons)
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

-- ÉTAPE 7: Index et RLS pour les exemples
CREATE INDEX IF NOT EXISTS idx_use_case_examples_tag ON use_case_examples(tag);
ALTER TABLE use_case_examples ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select examples" ON use_case_examples;
CREATE POLICY "Allow public select examples" ON use_case_examples FOR SELECT USING (true);

-- COMMENTAIRES
COMMENT ON TABLE client_briefs_steps IS 'Table pour les nouveaux briefs en étapes avec sauvegarde automatique';
COMMENT ON TABLE use_case_examples IS 'Exemples de cas d''usage pour l''étape 2 du formulaire';

-- SUCCÈS !
-- ✅ Nouvelles tables créées
-- ✅ Aucune modification des tables existantes
-- ✅ L'admin continue de fonctionner normalement
-- ✅ Le nouveau formulaire peut maintenant fonctionner
