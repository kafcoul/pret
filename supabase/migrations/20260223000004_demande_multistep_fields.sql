-- Migration : Ajout des champs détaillés pour le formulaire multi-étapes
-- Nouvelles colonnes sur la table demandes

ALTER TABLE public.demandes
  ADD COLUMN IF NOT EXISTS adresse TEXT,
  ADD COLUMN IF NOT EXISTS code_postal TEXT,
  ADD COLUMN IF NOT EXISTS situation_emploi TEXT,
  ADD COLUMN IF NOT EXISTS revenu_annuel TEXT,
  ADD COLUMN IF NOT EXISTS duree_souhaitee TEXT,
  ADD COLUMN IF NOT EXISTS urgence TEXT,
  ADD COLUMN IF NOT EXISTS valeur_propriete TEXT,
  ADD COLUMN IF NOT EXISTS solde_hypothecaire TEXT,
  ADD COLUMN IF NOT EXISTS adresse_propriete TEXT,
  ADD COLUMN IF NOT EXISTS rang_hypothecaire TEXT,
  ADD COLUMN IF NOT EXISTS consentement BOOLEAN DEFAULT false;
