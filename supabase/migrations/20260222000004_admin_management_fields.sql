-- Migration: Add admin management fields + DELETE policies
-- Adds status tracking, admin notes, and archive capability

-- Demandes: add statut + notes
ALTER TABLE public.demandes
  ADD COLUMN IF NOT EXISTS statut TEXT DEFAULT 'nouveau',
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS lu BOOLEAN DEFAULT false;

-- Contacts: add statut + notes + lu
ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS statut TEXT DEFAULT 'nouveau',
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS lu BOOLEAN DEFAULT false;

-- Newsletter: add active flag
ALTER TABLE public.newsletter
  ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Allow authenticated users to UPDATE demandes (change statut, notes, lu)
CREATE POLICY "Authenticated can update demandes"
  ON public.demandes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to DELETE demandes
CREATE POLICY "Authenticated can delete demandes"
  ON public.demandes FOR DELETE
  TO authenticated
  USING (true);

-- Allow authenticated users to UPDATE contacts
CREATE POLICY "Authenticated can update contacts"
  ON public.contacts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to DELETE contacts
CREATE POLICY "Authenticated can delete contacts"
  ON public.contacts FOR DELETE
  TO authenticated
  USING (true);

-- Allow authenticated users to UPDATE newsletter
CREATE POLICY "Authenticated can update newsletter"
  ON public.newsletter FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to DELETE newsletter
CREATE POLICY "Authenticated can delete newsletter"
  ON public.newsletter FOR DELETE
  TO authenticated
  USING (true);
