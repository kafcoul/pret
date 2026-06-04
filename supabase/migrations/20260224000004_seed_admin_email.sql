-- Ajoute l'adresse courriel administrateur
INSERT INTO admin_emails (email)
VALUES ('leaudouce0@gmail.com')
ON CONFLICT (email) DO NOTHING;
