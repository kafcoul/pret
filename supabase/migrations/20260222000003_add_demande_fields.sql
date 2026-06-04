-- Migration: Add missing form fields to demandes table
-- Fields: ville, type_financement, type_propriete, montant_souhaite

ALTER TABLE public.demandes
  ADD COLUMN IF NOT EXISTS ville TEXT,
  ADD COLUMN IF NOT EXISTS type_financement TEXT,
  ADD COLUMN IF NOT EXISTS type_propriete TEXT,
  ADD COLUMN IF NOT EXISTS montant_souhaite TEXT;
