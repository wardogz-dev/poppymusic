-- Script pour corriger les politiques RLS
-- À exécuter dans l'éditeur SQL de Supabase

-- Désactiver RLS temporairement
ALTER TABLE client_briefs DISABLE ROW LEVEL SECURITY;

-- Supprimer TOUTES les anciennes politiques
DROP POLICY IF EXISTS "Admins can view all briefs" ON client_briefs;
DROP POLICY IF EXISTS "Allow public insert" ON client_briefs;
DROP POLICY IF EXISTS "Allow public select" ON client_briefs;
DROP POLICY IF EXISTS "Allow public update" ON client_briefs;

-- Créer des politiques permissives pour les tests
CREATE POLICY "Allow all operations" ON client_briefs
    FOR ALL USING (true) WITH CHECK (true);

-- Réactiver RLS
ALTER TABLE client_briefs ENABLE ROW LEVEL SECURITY;
