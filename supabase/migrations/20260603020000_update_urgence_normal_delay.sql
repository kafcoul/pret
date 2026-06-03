-- Update urgence "normal" delay from 2-4 weeks to 2-6 weeks in demande.form.config JSON
UPDATE site_content
SET valeur = regexp_replace(
    valeur,
    'Normal \(2 à 4 semaines\)',
    'Normal (2 à 6 semaines)',
    'g'
)
WHERE cle = 'demande.form.config';
