-- Ajouter le NEQ dans les coordonnées du site_content
INSERT INTO site_content (cle, valeur, section, libelle, type, ordre)
VALUES ('coord.neq', '2271887236', 'coordonnees', 'Numéro d''entreprise (NEQ)', 'text', 10)
ON CONFLICT (cle) DO NOTHING;
