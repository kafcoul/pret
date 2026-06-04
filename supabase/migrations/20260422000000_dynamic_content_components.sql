-- ═══════════════════════════════════════════════════════════════
-- Migration : Contenu dynamique — StatsCounter, ProcessSteps,
--             Testimonials, ServiceCards, Trust indicators,
--             et sections manquantes des sous-pages
-- ═══════════════════════════════════════════════════════════════

-- ── Statistiques (StatsCounter) ───────────────────────────────
INSERT INTO site_content (cle, valeur, section, libelle, type, ordre) VALUES
('stats.1.end',    '25',                    'statistiques', 'Stat 1 — Valeur numérique',    'text',     1),
('stats.1.suffix', '+',                     'statistiques', 'Stat 1 — Suffixe',             'text',     2),
('stats.1.label',  'Années d''expérience',  'statistiques', 'Stat 1 — Libellé',             'text',     3),
('stats.2.end',    '5000',                  'statistiques', 'Stat 2 — Valeur numérique',    'text',     4),
('stats.2.suffix', '+',                     'statistiques', 'Stat 2 — Suffixe',             'text',     5),
('stats.2.label',  'Clients financés',      'statistiques', 'Stat 2 — Libellé',             'text',     6),
('stats.3.end',    '48',                    'statistiques', 'Stat 3 — Valeur numérique',    'text',     7),
('stats.3.suffix', 'h',                     'statistiques', 'Stat 3 — Suffixe',             'text',     8),
('stats.3.label',  'Délai d''approbation',  'statistiques', 'Stat 3 — Libellé',             'text',     9),
('stats.4.end',    '150',                   'statistiques', 'Stat 4 — Valeur numérique',    'text',    10),
('stats.4.suffix', '+',                     'statistiques', 'Stat 4 — Suffixe',             'text',    11),
('stats.4.label',  'Courtiers partenaires', 'statistiques', 'Stat 4 — Libellé',             'text',    12)
ON CONFLICT (cle) DO NOTHING;

-- ── Processus (ProcessSteps) ──────────────────────────────────
INSERT INTO site_content (cle, valeur, section, libelle, type, ordre) VALUES
('processus.titre',     'Un processus simple et rapide',                                                                           'processus', 'Titre de la section',     'text',     1),
('processus.soustitre', 'Obtenez votre financement en 4 étapes faciles',                                                           'processus', 'Sous-titre',              'text',     2),
('processus.1.titre',   'Remplissez le formulaire',                                                                                 'processus', 'Étape 1 — Titre',         'text',     3),
('processus.1.desc',    'Soumettez votre demande de financement en ligne en quelques minutes.',                                     'processus', 'Étape 1 — Description',   'textarea', 4),
('processus.2.titre',   'Analyse rapide',                                                                                           'processus', 'Étape 2 — Titre',         'text',     5),
('processus.2.desc',    'Un spécialiste en financement vous contacte rapidement pour évaluer votre dossier.',                       'processus', 'Étape 2 — Description',   'textarea', 6),
('processus.3.titre',   'Entente de prêt',                                                                                          'processus', 'Étape 3 — Titre',         'text',     7),
('processus.3.desc',    'Conclusion de l''entente de prêt avec des conditions ajustées à vos besoins.',                            'processus', 'Étape 3 — Description',   'textarea', 8),
('processus.4.titre',   'Recevez votre financement',                                                                                'processus', 'Étape 4 — Titre',         'text',     9),
('processus.4.desc',    'Obtenez votre prêt relais en aussi peu que 48 heures.',                                                    'processus', 'Étape 4 — Description',   'textarea', 10)
ON CONFLICT (cle) DO NOTHING;

-- ── Témoignages (Testimonials) ────────────────────────────────
INSERT INTO site_content (cle, valeur, section, libelle, type, ordre) VALUES
('temoignage.titre',      'Ce que nos clients disent de nous',                                                                                                                                                       'temoignages', 'Titre de la section',         'text',      1),
('temoignage.soustitre',  'Des milliers de Québécois nous font confiance depuis 1998',                                                                                                                               'temoignages', 'Sous-titre',                  'text',      2),
('temoignage.1.nom',      'Marie-Claire D.',                                                                                                                                                                         'temoignages', 'Témoignage 1 — Nom',          'text',      3),
('temoignage.1.ville',    'Québec',                                                                                                                                                                                  'temoignages', 'Témoignage 1 — Ville',        'text',      4),
('temoignage.1.texte',    'Après avoir été refusée par ma banque, l''équipe m''a aidée à consolider mes dettes en moins d''une semaine. Le service est rapide, confidentiel et professionnel. Je recommande à 100 %.', 'temoignages', 'Témoignage 1 — Texte',        'textarea',  5),
('temoignage.1.service',  'Consolidation de dettes',                                                                                                                                                                 'temoignages', 'Témoignage 1 — Service',      'text',      6),
('temoignage.2.nom',      'Jean-François T.',                                                                                                                                                                         'temoignages', 'Témoignage 2 — Nom',          'text',      7),
('temoignage.2.ville',    'Lévis',                                                                                                                                                                                    'temoignages', 'Témoignage 2 — Ville',        'text',      8),
('temoignage.2.texte',    'En tant que travailleur autonome, obtenir du financement bancaire était impossible. Grâce à eux, j''ai pu acheter mon duplex et le rénover. Approuvé en 48 heures, comme promis !',       'temoignages', 'Témoignage 2 — Texte',        'textarea',  9),
('temoignage.2.service',  'Financement temporaire',                                                                                                                                                                   'temoignages', 'Témoignage 2 — Service',      'text',     10),
('temoignage.3.nom',      'Stéphanie R.',                                                                                                                                                                             'temoignages', 'Témoignage 3 — Nom',          'text',     11),
('temoignage.3.ville',    'Beauport',                                                                                                                                                                                 'temoignages', 'Témoignage 3 — Ville',        'text',     12),
('temoignage.3.texte',    'Après ma faillite, je pensais ne plus jamais pouvoir obtenir de prêt. L''équipe m''a guidée avec respect et m''a offert une 2e chance. Aujourd''hui, ma cote de crédit est rétablie.',   'temoignages', 'Témoignage 3 — Texte',        'textarea', 13),
('temoignage.3.service',  '2e chance au crédit',                                                                                                                                                                      'temoignages', 'Témoignage 3 — Service',      'text',     14),
('temoignage.4.nom',      'Patrick L.',                                                                                                                                                                               'temoignages', 'Témoignage 4 — Nom',          'text',     15),
('temoignage.4.ville',    'Charlesbourg',                                                                                                                                                                             'temoignages', 'Témoignage 4 — Ville',        'text',     16),
('temoignage.4.texte',    'J''avais besoin de fonds rapidement pour saisir une opportunité d''affaires. Le processus a été simple et transparent. Un service exceptionnel que je recommande à tous les entrepreneurs.', 'temoignages', 'Témoignage 4 — Texte',    'textarea', 17),
('temoignage.4.service',  'Financement entreprise',                                                                                                                                                                   'temoignages', 'Témoignage 4 — Service',      'text',     18)
ON CONFLICT (cle) DO NOTHING;

-- ── Accueil — Trust indicators ────────────────────────────────
INSERT INTO site_content (cle, valeur, section, libelle, type, ordre) VALUES
('accueil.trust.1.titre', 'Approbation en 48h',           'accueil', 'Trust 1 — Titre',      'text', 40),
('accueil.trust.1.desc',  'Réponse rapide garantie',       'accueil', 'Trust 1 — Description','text', 41),
('accueil.trust.2.titre', 'Confidentialité assurée',       'accueil', 'Trust 2 — Titre',      'text', 42),
('accueil.trust.2.desc',  'Vos informations sont protégées','accueil','Trust 2 — Description','text', 43),
('accueil.trust.3.titre', 'Depuis 1998',                   'accueil', 'Trust 3 — Titre',      'text', 44),
('accueil.trust.3.desc',  'Plus de 25 ans d''expérience',  'accueil', 'Trust 3 — Description','text', 45)
ON CONFLICT (cle) DO NOTHING;

-- ── Accueil — Cartes de services ─────────────────────────────
INSERT INTO site_content (cle, valeur, section, libelle, type, ordre) VALUES
('accueil.carte.1.titre', 'Particuliers',
 'accueil', 'Carte 1 — Titre', 'text', 50),
('accueil.carte.1.desc',  'Financement adapté aux besoins des particuliers, même avec un dossier de crédit difficile.',
 'accueil', 'Carte 1 — Description', 'textarea', 51),
('accueil.carte.1.items', 'Prêt rénovation' || chr(10) || 'Achat immobilier' || chr(10) || 'Refinancement' || chr(10) || 'Consolidation de dettes' || chr(10) || 'Lettre de caution',
 'accueil', 'Carte 1 — Items (1 par ligne)', 'textarea', 52),
('accueil.carte.2.titre', 'Entreprises',
 'accueil', 'Carte 2 — Titre', 'text', 53),
('accueil.carte.2.desc',  'Solutions de financement pour les entreprises et les projets commerciaux.',
 'accueil', 'Carte 2 — Description', 'textarea', 54),
('accueil.carte.2.items', 'Prêt fonds de roulement' || chr(10) || 'Prêt équipements' || chr(10) || 'Affacturage' || chr(10) || 'Acquisition d''immobilisations' || chr(10) || 'Lettre de garantie',
 'accueil', 'Carte 2 — Items (1 par ligne)', 'textarea', 55),
('accueil.carte.3.titre', 'Construction',
 'accueil', 'Carte 3 — Titre', 'text', 56),
('accueil.carte.3.desc',  'Financement spécialisé pour les projets de construction et les contracteurs.',
 'accueil', 'Carte 3 — Description', 'textarea', 57),
('accueil.carte.3.items', 'Achat de terrain' || chr(10) || 'Bridge de construction' || chr(10) || 'Financement d''infrastructure' || chr(10) || 'Accommodation pour clients acheteurs' || chr(10) || 'Cautionnement permis',
 'accueil', 'Carte 3 — Items (1 par ligne)', 'textarea', 58)
ON CONFLICT (cle) DO NOTHING;

-- ── Accueil — Stat courtiers ──────────────────────────────────
INSERT INTO site_content (cle, valeur, section, libelle, type, ordre) VALUES
('accueil.courtiers.stat.chiffre', '25+',                    'accueil', 'Courtiers — Chiffre vedette', 'text', 60),
('accueil.courtiers.stat.label',   'années d''expérience',   'accueil', 'Courtiers — Label chiffre',   'text', 61)
ON CONFLICT (cle) DO NOTHING;

-- ── Consolidation — sections manquantes ───────────────────────
INSERT INTO site_content (cle, valeur, section, libelle, type, ordre) VALUES
('consolidation.intro.bandeau',
 'Faites une demande de financement en ligne pour consolider vos dettes — un spécialiste en financement vous contactera rapidement.',
 'consolidation', 'Bandeau d''intro', 'textarea', 5),
('consolidation.avantages.titre', 'Les avantages', 'consolidation', 'Titre section avantages', 'text', 12),
('consolidation.avantages.items',
 'Tous vos créanciers sont payés rapidement' || chr(10) ||
 'Un seul prêt, un seul paiement par mois' || chr(10) ||
 'Préservation de votre cote de crédit (si vous agissez rapidement)' || chr(10) ||
 'Alternative à la faillite' || chr(10) ||
 'Réduction du stress financier',
 'consolidation', 'Avantages (1 par ligne)', 'textarea', 13),
('consolidation.piege.titre', 'Piège à éviter !', 'consolidation', 'Titre avertissement', 'text', 14),
('consolidation.piege.texte',
 'Attention ! Après avoir consolidé vos dettes, il est crucial de ne pas retomber dans le même cycle d''endettement. Ne réutilisez pas vos cartes de crédit et marges de crédit une fois qu''elles sont payées. Établissez un budget strict et respectez-le.',
 'consolidation', 'Texte avertissement', 'textarea', 15)
ON CONFLICT (cle) DO NOTHING;

-- ── Éviter la faillite — sections manquantes ─────────────────
INSERT INTO site_content (cle, valeur, section, libelle, type, ordre) VALUES
('faillite.evaluation.titre', 'Évaluation de votre situation', 'faillite', 'Titre évaluation', 'text', 12),
('faillite.evaluation.texte',
 'Si vous possédez un bien immobilier, nous évaluerons l''équité disponible pour garantir un prêt.',
 'faillite', 'Texte évaluation', 'textarea', 13),
('faillite.consolidation.titre', 'Prêt de consolidation', 'faillite', 'Titre consolidation', 'text', 14),
('faillite.consolidation.texte',
 'Un prêt de consolidation vous permet de rembourser tous vos créanciers et de n''avoir qu''un seul paiement mensuel.',
 'faillite', 'Texte consolidation', 'textarea', 15)
ON CONFLICT (cle) DO NOTHING;

-- ── Services Particuliers — sections manquantes ───────────────
INSERT INTO site_content (cle, valeur, section, libelle, type, ordre) VALUES
('particuliers.service.1.titre', 'Financement et refinancement temporaire',                                                                        'particuliers', 'Service 1 — Titre', 'text', 20),
('particuliers.service.1.desc',  'Solutions de financement à court terme pour répondre à vos besoins immédiats, même si les institutions bancaires ne peuvent vous aider.', 'particuliers', 'Service 1 — Description', 'textarea', 21),
('particuliers.service.2.titre', 'Consolidation de dettes',                                                                                        'particuliers', 'Service 2 — Titre', 'text', 22),
('particuliers.service.2.desc',  'Regroupez toutes vos dettes en un seul prêt avec un seul paiement mensuel. Une solution temporaire pour reprendre le contrôle.', 'particuliers', 'Service 2 — Description', 'textarea', 23),
('particuliers.service.3.titre', '2e chance au crédit',                                                                                            'particuliers', 'Service 3 — Titre', 'text', 24),
('particuliers.service.3.desc',  'Vous avez un mauvais dossier de crédit ou une faillite antérieure ? Nous pouvons vous aider à vous rétablir financièrement.', 'particuliers', 'Service 3 — Description', 'textarea', 25),
('particuliers.objectif.texte',  'Notre objectif est d''aider nos clients à se rétablir financièrement en leur proposant des solutions adaptées à leur situation personnelle.', 'particuliers', 'Texte objectif', 'textarea', 30)
ON CONFLICT (cle) DO NOTHING;
