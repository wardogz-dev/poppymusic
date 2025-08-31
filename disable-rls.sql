-- Script pour désactiver temporairement RLS et permettre les insertions
-- À exécuter dans l'éditeur SQL de Supabase

-- Désactiver RLS sur la table client_briefs
ALTER TABLE client_briefs DISABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Admins can view all briefs" ON client_briefs;

-- Créer des politiques plus permissives pour les tests
CREATE POLICY "Allow public insert" ON client_briefs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select" ON client_briefs
    FOR SELECT USING (true);

CREATE POLICY "Allow public update" ON client_briefs
    FOR UPDATE USING (true);

-- Réactiver RLS avec les nouvelles politiques
ALTER TABLE client_briefs ENABLE ROW LEVEL SECURITY;
