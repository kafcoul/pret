-- ═══════════════════════════════════════════════════════════════
-- Migration : Contrôle d'accès admin par liste de courriels
-- ═══════════════════════════════════════════════════════════════
-- Problème : toute personne authentifiée avait un accès admin complet.
-- Solution : table admin_emails + fonction is_admin() + politiques RLS
--            restreintes aux seuls administrateurs autorisés.
-- ═══════════════════════════════════════════════════════════════

-- ── 1. Table des courriels administrateurs ────────────────────
CREATE TABLE IF NOT EXISTS public.admin_emails (
    id    SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL
);

-- Insérer les administrateurs autorisés
INSERT INTO public.admin_emails (email) VALUES
    ('info@solutionsfortier.com')
ON CONFLICT (email) DO NOTHING;

-- Seuls les super-admins (service_role) peuvent modifier cette table.
-- Aucun accès direct pour anon ou authenticated.
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

-- ── 2. Fonction helper : l'utilisateur courant est-il admin ? ─
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.admin_emails ae
        WHERE ae.email = (
            SELECT email FROM auth.users WHERE id = auth.uid()
        )
    );
$$;

-- ── 3. DEMANDES — recréer les politiques avec is_admin() ──────

-- SELECT : remplacer la politique existante
DROP POLICY IF EXISTS "Only authenticated users can read demandes" ON public.demandes;
CREATE POLICY "Admins can read demandes"
    ON public.demandes FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- UPDATE : remplacer
DROP POLICY IF EXISTS "Authenticated can update demandes" ON public.demandes;
CREATE POLICY "Admins can update demandes"
    ON public.demandes FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- DELETE : remplacer
DROP POLICY IF EXISTS "Authenticated can delete demandes" ON public.demandes;
CREATE POLICY "Admins can delete demandes"
    ON public.demandes FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- INSERT anon reste inchangé ✓

-- ── 4. CONTACTS — recréer les politiques avec is_admin() ──────

DROP POLICY IF EXISTS "Only authenticated users can read contacts" ON public.contacts;
CREATE POLICY "Admins can read contacts"
    ON public.contacts FOR SELECT
    TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "Authenticated can update contacts" ON public.contacts;
CREATE POLICY "Admins can update contacts"
    ON public.contacts FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated can delete contacts" ON public.contacts;
CREATE POLICY "Admins can delete contacts"
    ON public.contacts FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- INSERT anon reste inchangé ✓

-- ── 5. NEWSLETTER — recréer les politiques avec is_admin() ────

DROP POLICY IF EXISTS "Allow authenticated select newsletter" ON public.newsletter;
CREATE POLICY "Admins can read newsletter"
    ON public.newsletter FOR SELECT
    TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "Authenticated can update newsletter" ON public.newsletter;
CREATE POLICY "Admins can update newsletter"
    ON public.newsletter FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated can delete newsletter" ON public.newsletter;
CREATE POLICY "Admins can delete newsletter"
    ON public.newsletter FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- INSERT anon reste inchangé ✓

-- ── 6. SITE_CONTENT — corriger + ajouter INSERT/DELETE ────────

-- SELECT public reste inchangé (tout le monde peut lire le contenu) ✓

-- UPDATE : remplacer
DROP POLICY IF EXISTS "site_content_update" ON public.site_content;
CREATE POLICY "Admins can update site_content"
    ON public.site_content FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- INSERT : NOUVEAU (manquait)
CREATE POLICY "Admins can insert site_content"
    ON public.site_content FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- DELETE : NOUVEAU (manquait)
CREATE POLICY "Admins can delete site_content"
    ON public.site_content FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ── 7. FAQ — recréer les politiques avec is_admin() ──────────

-- SELECT public reste inchangé ✓

DROP POLICY IF EXISTS "faq_insert_auth" ON public.faq;
CREATE POLICY "Admins can insert faq"
    ON public.faq FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "faq_update_auth" ON public.faq;
CREATE POLICY "Admins can update faq"
    ON public.faq FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "faq_delete_auth" ON public.faq;
CREATE POLICY "Admins can delete faq"
    ON public.faq FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ═══════════════════════════════════════════════════════════════
-- Pour ajouter un nouvel administrateur, exécuter via le
-- Dashboard Supabase (SQL Editor) ou via service_role :
--
--   INSERT INTO admin_emails (email) VALUES ('nouveau@admin.com');
--
-- Pour retirer un accès :
--
--   DELETE FROM admin_emails WHERE email = 'ancien@admin.com';
-- ═══════════════════════════════════════════════════════════════
