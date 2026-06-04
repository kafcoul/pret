-- Migration: Create demandes table
-- Table for online loan application form submissions

CREATE TABLE public.demandes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  telephone TEXT NOT NULL,
  courriel TEXT NOT NULL,
  commentaire TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.demandes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users (website visitors) to INSERT
CREATE POLICY "Anyone can submit a demande"
  ON public.demandes FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users (admin) can SELECT
CREATE POLICY "Only authenticated users can read demandes"
  ON public.demandes FOR SELECT
  TO authenticated
  USING (true);
