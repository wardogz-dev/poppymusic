-- Configuration de la base de données Poppy Music
-- À exécuter dans l'éditeur SQL de Supabase

-- Table pour stocker les briefs clients
CREATE TABLE client_briefs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Informations client
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    
    -- Projet musical
    project_title VARCHAR(200),
    music_style VARCHAR(50) NOT NULL,
    project_purpose VARCHAR(50) NOT NULL,
    target_audience TEXT NOT NULL,
    
    -- Message et contenu
    main_message TEXT NOT NULL,
    emotions TEXT[], -- Array des émotions sélectionnées
    key_words TEXT,
    personal_story TEXT NOT NULL,
    
    -- Références
    reference_artists VARCHAR(500),
    musical_references TEXT,
    avoid_elements TEXT,
    
    -- Délais et budget
    deadline DATE NOT NULL,
    package VARCHAR(20) NOT NULL, -- 'standard' ou 'premium'
    additional_notes TEXT,
    
    -- Statut du projet
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
    admin_notes TEXT,
    
    -- Paiement
    payment_status VARCHAR(20) DEFAULT 'unpaid', -- 'unpaid', 'paid', 'refunded'
    stripe_session_id VARCHAR(200),
    amount_paid INTEGER, -- En centimes
    
    -- Métadonnées
    ip_address INET,
    user_agent TEXT
);

-- Index pour les recherches fréquentes
CREATE INDEX idx_client_briefs_status ON client_briefs(status);
CREATE INDEX idx_client_briefs_email ON client_briefs(email);
CREATE INDEX idx_client_briefs_created_at ON client_briefs(created_at DESC);
CREATE INDEX idx_client_briefs_deadline ON client_briefs(deadline);

-- Table pour les utilisateurs admin
CREATE TABLE admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(20) DEFAULT 'admin', -- 'admin', 'super_admin'
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Insérer l'admin par défaut (mot de passe: PoppyMusic2025!)
-- Le hash bcrypt pour 'PoppyMusic2025!' est généré côté application
INSERT INTO admin_users (username, password_hash, email, role) 
VALUES ('admin', '$2b$10$placeholder_hash', 'admin@poppymusic.fr', 'super_admin');

-- Table pour les logs d'activité admin
CREATE TABLE admin_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    admin_id UUID REFERENCES admin_users(id),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50), -- 'brief', 'user', etc.
    target_id UUID,
    details JSONB,
    ip_address INET
);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour client_briefs
CREATE TRIGGER update_client_briefs_updated_at 
    BEFORE UPDATE ON client_briefs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - Optionnel pour plus tard
ALTER TABLE client_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Politique pour que les admins puissent tout voir
CREATE POLICY "Admins can view all briefs" ON client_briefs
    FOR ALL USING (auth.role() = 'authenticated');

-- Vues pour le dashboard
CREATE VIEW dashboard_stats AS
SELECT 
    COUNT(*) as total_briefs,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_briefs,
    COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_briefs,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_briefs,
    COUNT(*) FILTER (WHERE payment_status = 'paid') as paid_briefs,
    SUM(amount_paid) FILTER (WHERE payment_status = 'paid') as total_revenue
FROM client_briefs;
