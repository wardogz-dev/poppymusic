-- Ajout des champs Stripe à la table client_briefs_steps
-- À exécuter dans Supabase SQL Editor APRÈS avoir créé la table de base

-- Ajouter les colonnes Stripe
ALTER TABLE client_briefs_steps 
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_customer_email TEXT,
ADD COLUMN IF NOT EXISTS amount_paid INTEGER, -- En centimes (ex: 19900 pour 199€)
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'eur';

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_client_briefs_steps_stripe_session ON client_briefs_steps(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_client_briefs_steps_payment_intent ON client_briefs_steps(payment_intent_id);

-- Commentaires
COMMENT ON COLUMN client_briefs_steps.stripe_session_id IS 'ID de session Stripe Checkout';
COMMENT ON COLUMN client_briefs_steps.stripe_customer_email IS 'Email du client depuis Stripe';
COMMENT ON COLUMN client_briefs_steps.amount_paid IS 'Montant payé en centimes (ex: 19900 = 199€)';
COMMENT ON COLUMN client_briefs_steps.currency IS 'Devise du paiement (eur, usd, etc.)';

-- Fonction pour formater le montant
CREATE OR REPLACE FUNCTION format_amount(amount_cents INTEGER, currency_code TEXT DEFAULT 'eur')
RETURNS TEXT AS $$
BEGIN
    IF amount_cents IS NULL THEN
        RETURN 'Non payé';
    END IF;
    
    CASE currency_code
        WHEN 'eur' THEN
            RETURN (amount_cents / 100.0)::TEXT || '€';
        WHEN 'usd' THEN
            RETURN '$' || (amount_cents / 100.0)::TEXT;
        ELSE
            RETURN (amount_cents / 100.0)::TEXT || ' ' || UPPER(currency_code);
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Vue pour l'admin avec informations de paiement formatées
CREATE OR REPLACE VIEW admin_briefs_with_payment AS
SELECT 
    *,
    format_amount(amount_paid, currency) as formatted_amount,
    CASE 
        WHEN is_paid AND paid_at IS NOT NULL THEN 'Payé le ' || TO_CHAR(paid_at, 'DD/MM/YYYY à HH24:MI')
        WHEN is_completed AND NOT is_paid THEN 'En attente de paiement'
        ELSE 'Brief en cours (étape ' || current_step || '/12)'
    END as payment_status_text
FROM client_briefs_steps
ORDER BY created_at DESC;

-- Commentaires
COMMENT ON VIEW admin_briefs_with_payment IS 'Vue admin avec informations de paiement formatées pour affichage';

-- SUCCÈS !
-- ✅ Champs Stripe ajoutés
-- ✅ Index pour performances
-- ✅ Fonction de formatage montant
-- ✅ Vue admin enrichie
