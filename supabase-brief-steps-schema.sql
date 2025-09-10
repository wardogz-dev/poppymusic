-- Nouveau schéma pour le formulaire de brief en étapes
-- À exécuter dans Supabase SQL Editor

-- Supprimer l'ancienne table si elle existe
DROP TABLE IF EXISTS client_briefs;

-- Créer la nouvelle table pour les briefs en étapes
CREATE TABLE client_briefs_steps (
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

-- Index pour les performances
CREATE INDEX idx_client_briefs_steps_session_id ON client_briefs_steps(session_id);
CREATE INDEX idx_client_briefs_steps_email ON client_briefs_steps(email);
CREATE INDEX idx_client_briefs_steps_created_at ON client_briefs_steps(created_at);
CREATE INDEX idx_client_briefs_steps_is_completed ON client_briefs_steps(is_completed);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_client_briefs_steps_updated_at 
    BEFORE UPDATE ON client_briefs_steps 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Activer Row Level Security (RLS)
ALTER TABLE client_briefs_steps ENABLE ROW LEVEL SECURITY;

-- Politique RLS : permettre l'insertion et la lecture pour tous (formulaire public)
CREATE POLICY "Allow public insert" ON client_briefs_steps
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select" ON client_briefs_steps
    FOR SELECT USING (true);

CREATE POLICY "Allow public update" ON client_briefs_steps
    FOR UPDATE USING (true);

-- Table pour les exemples de cas d'usage (pour l'étape 2)
CREATE TABLE use_case_examples (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tag TEXT NOT NULL, -- 'Club', 'Anniversaire Adulte', etc.
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    story_url TEXT NOT NULL, -- Lien vers la page /story/
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer les exemples existants
INSERT INTO use_case_examples (tag, title, short_description, audio_url, cover_image_url, story_url) VALUES
('Club', 'Twende', 'Composition afro beat pour DJ professionnel', '/music/twende.mp3', '/images/covers/twende-closed.png', '/story/twende'),
('Anniversaire Adulte', 'C''est Chez Moi', 'Déclaration d''amour pour un anniversaire de mariage', '/music/cest-chez-moi.mp3', '/images/covers/cest-chez-moi-closed.png', '/story/cest-chez-moi'),
('Anniversaire Adulte', 'Funky Thierry', 'Hommage funk pour les 65 ans d''un père', '/music/funky-thierry.wav', '/images/covers/funky-thierry-closed.png', '/story/funky-thierry'),
('Anniversaire Enfant', 'Raph King', 'Chanson rap personnalisée pour un enfant', '/music/raph-king.mp3', '/images/covers/raph-king-closed.png', '/story/raph-king'),
('Anniversaire Enfant', 'Aby Princess', 'Comptine personnalisée pour une petite fille', '/music/aby-princess.mp3', '/images/covers/aby-closed.png', '/story/aby-princess'),
('Entreprise', 'Titres Français', 'Rap corporate pour une entreprise', '/music/titres-francais.mp3', '/images/covers/titres-francais-closed.png', '/story/titres-francais'),
('Entreprise', 'Campus Des Écoles', 'Hymne éducatif pour une école', '/music/campus-des-ecoles.mp3', '/images/covers/campus-des-ecoles-closed.png', '/story/campus-des-ecoles'),
('Association', 'Levehad Am Ehad', 'Chanson traditionnelle pour une association', '/music/levehad-am-ehad.mp3', '/images/covers/levehad-am-ehad-closed.png', '/story/levehad-am-ehad');

-- Index pour les exemples
CREATE INDEX idx_use_case_examples_tag ON use_case_examples(tag);

-- RLS pour les exemples (lecture publique)
ALTER TABLE use_case_examples ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select examples" ON use_case_examples FOR SELECT USING (true);

-- Commentaires pour documentation
COMMENT ON TABLE client_briefs_steps IS 'Table pour stocker les briefs clients en mode étapes avec sauvegarde automatique';
COMMENT ON COLUMN client_briefs_steps.session_id IS 'Identifiant de session pour suivre le formulaire en cours';
COMMENT ON COLUMN client_briefs_steps.current_step IS 'Étape actuelle du formulaire (1-11)';
COMMENT ON TABLE use_case_examples IS 'Exemples de cas d''usage pour inspirer les clients à l''étape 2';
