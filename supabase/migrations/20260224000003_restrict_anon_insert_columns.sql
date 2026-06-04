-- ═══════════════════════════════════════════════════════════
-- Migration : Restreindre les colonnes admin sur INSERT anon
-- ═══════════════════════════════════════════════════════════
-- Les utilisateurs anonymes ne doivent pas pouvoir définir
-- statut, notes ou lu lors de la soumission d'un formulaire.
-- ═══════════════════════════════════════════════════════════

-- ── demandes ───────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can submit a demande" ON public.demandes;
CREATE POLICY "Anyone can submit a demande"
  ON public.demandes FOR INSERT
  TO anon
  WITH CHECK (
    statut = 'nouveau'
    AND lu = false
    AND notes IS NULL
  );

-- ── contacts ───────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can submit a contact" ON public.contacts;
CREATE POLICY "Anyone can submit a contact"
  ON public.contacts FOR INSERT
  TO anon
  WITH CHECK (
    statut = 'nouveau'
    AND lu = false
    AND notes IS NULL
  );

-- ── newsletter ─────────────────────────────────────────────
DROP POLICY IF EXISTS "Allow anon insert newsletter" ON public.newsletter;
CREATE POLICY "Allow anon insert newsletter"
  ON public.newsletter FOR INSERT
  TO anon
  WITH CHECK (active = true);

-- ── Optimiser is_admin() — éviter la jointure auth.users ──
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_emails
    WHERE email = (auth.jwt() ->> 'email')
  );
$$;
