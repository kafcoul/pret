-- ═══════════════════════════════════════════════════════════
-- Migration : Table rate_limits pour le contrôle de débit par IP
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.rate_limits (
    id         BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    ip         TEXT NOT NULL,
    action     TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour les requêtes de vérification (IP + action + fenêtre de temps)
CREATE INDEX idx_rate_limits_lookup
    ON public.rate_limits (ip, action, created_at DESC);

-- Nettoyage automatique : supprimer les entrées de plus de 1 heure
-- (les Edge Functions vérifient sur 5-10 min, mais on garde 1h par sécurité)
CREATE OR REPLACE FUNCTION clean_old_rate_limits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
    DELETE FROM public.rate_limits
    WHERE created_at < now() - INTERVAL '1 hour';
$$;

-- Appeler le nettoyage périodiquement via pg_cron si disponible
-- (sur Supabase hosted, pg_cron est activé)
SELECT cron.schedule(
    'clean-rate-limits',
    '*/15 * * * *',       -- toutes les 15 minutes
    'SELECT clean_old_rate_limits();'
);

-- RLS : seul le service_role peut accéder (les Edge Functions l'utilisent)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Pas de politique pour anon/authenticated = aucun accès direct
-- Le service_role bypass le RLS automatiquement
