-- Migration: Performance indexes + data integrity constraints
-- Adds indexes for admin dashboard queries & CHECK constraints for data quality

-- ── Indexes for common admin queries ──────────────────────

-- Demandes: filter/sort by status + unread + date
CREATE INDEX IF NOT EXISTS idx_demandes_statut ON public.demandes (statut);
CREATE INDEX IF NOT EXISTS idx_demandes_lu ON public.demandes (lu) WHERE lu = false;
CREATE INDEX IF NOT EXISTS idx_demandes_created_at ON public.demandes (created_at DESC);

-- Contacts: filter/sort by status + unread + date
CREATE INDEX IF NOT EXISTS idx_contacts_statut ON public.contacts (statut);
CREATE INDEX IF NOT EXISTS idx_contacts_lu ON public.contacts (lu) WHERE lu = false;
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts (created_at DESC);

-- Newsletter: filter by active + lookup by email
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON public.newsletter (active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_newsletter_courriel ON public.newsletter (courriel);

-- Site content: lookup by key (already unique but adding explicit index)
CREATE INDEX IF NOT EXISTS idx_site_content_cle ON public.site_content (cle);

-- FAQ: order display
CREATE INDEX IF NOT EXISTS idx_faq_ordre ON public.faq (ordre);

-- ── CHECK constraints for data integrity ──────────────────

-- Email format basic validation (contains @)
ALTER TABLE public.demandes
  ADD CONSTRAINT chk_demandes_courriel CHECK (courriel ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');

ALTER TABLE public.contacts
  ADD CONSTRAINT chk_contacts_courriel CHECK (courriel ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');

ALTER TABLE public.newsletter
  ADD CONSTRAINT chk_newsletter_courriel CHECK (courriel ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');

-- Status must be one of allowed values
ALTER TABLE public.demandes
  ADD CONSTRAINT chk_demandes_statut CHECK (statut IN ('nouveau', 'en_cours', 'approuve', 'refuse', 'archive'));

ALTER TABLE public.contacts
  ADD CONSTRAINT chk_contacts_statut CHECK (statut IN ('nouveau', 'en_cours', 'repondu', 'archive'));

-- Max field lengths to prevent abuse
ALTER TABLE public.demandes
  ADD CONSTRAINT chk_demandes_prenom_len CHECK (char_length(prenom) <= 100),
  ADD CONSTRAINT chk_demandes_nom_len CHECK (char_length(nom) <= 100),
  ADD CONSTRAINT chk_demandes_telephone_len CHECK (char_length(telephone) <= 30),
  ADD CONSTRAINT chk_demandes_courriel_len CHECK (char_length(courriel) <= 254),
  ADD CONSTRAINT chk_demandes_commentaire_len CHECK (char_length(commentaire) <= 5000);

ALTER TABLE public.contacts
  ADD CONSTRAINT chk_contacts_prenom_len CHECK (char_length(prenom) <= 100),
  ADD CONSTRAINT chk_contacts_nom_len CHECK (char_length(nom) <= 100),
  ADD CONSTRAINT chk_contacts_telephone_len CHECK (char_length(telephone) <= 30),
  ADD CONSTRAINT chk_contacts_courriel_len CHECK (char_length(courriel) <= 254),
  ADD CONSTRAINT chk_contacts_message_len CHECK (char_length(message) <= 5000);

ALTER TABLE public.newsletter
  ADD CONSTRAINT chk_newsletter_courriel_len CHECK (char_length(courriel) <= 254);
