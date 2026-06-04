-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    courriel TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (website visitors)
CREATE POLICY "Allow anon insert newsletter" ON newsletter
    FOR INSERT TO anon WITH CHECK (true);

-- Only authenticated users can view subscribers
CREATE POLICY "Allow authenticated select newsletter" ON newsletter
    FOR SELECT TO authenticated USING (true);
