-- Migration: Create contacts table
-- Table for contact form submissions

CREATE TABLE public.contacts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  courriel TEXT NOT NULL,
  telephone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users (website visitors) to INSERT
CREATE POLICY "Anyone can submit a contact"
  ON public.contacts FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users (admin) can SELECT
CREATE POLICY "Only authenticated users can read contacts"
  ON public.contacts FOR SELECT
  TO authenticated
  USING (true);
