-- ═══════════════════════════════════════════════════════════
-- Migration: Mise à jour des informations de l'entreprise
-- Solutions Financement Fortier (anciennement Prêts Relais Capital)
-- NEQ : 2271887236
-- Adresse : 490, rue de Kilkenny, Fossambault-sur-le-Lac (Québec) G3N 3C4
-- ═══════════════════════════════════════════════════════════

-- ── Coordonnées ───────────────────────────────────────────
UPDATE site_content SET valeur = 'Solutions Financement Fortier' WHERE cle = 'coord.nom.entreprise';
UPDATE site_content SET valeur = 'info@solutionsfortier.com' WHERE cle = 'coord.courriel';
UPDATE site_content SET valeur = '490, rue de Kilkenny' WHERE cle = 'coord.adresse.ligne1';
UPDATE site_content SET valeur = 'Fossambault-sur-le-Lac, QC G3N 3C4' WHERE cle = 'coord.adresse.ligne2';
UPDATE site_content SET valeur = 'https://www.facebook.com/solutionsfortier' WHERE cle = 'coord.facebook.url';

-- ── Profil ────────────────────────────────────────────────
UPDATE site_content SET valeur = 'Solutions Financement Fortier inc. est une entreprise québécoise spécialisée dans le prêt alternatif avec garanties immobilières depuis 1998.'
  WHERE cle = 'profil.citation';

UPDATE site_content SET valeur = 'Fondée en 1998 par M. Claude Gosselin, Solutions Financement Fortier inc. est une entreprise québécoise de financement alternatif. Fort de plus de 30 années d''expérience dans le domaine financier et immobilier, M. Gosselin a développé une expertise reconnue dans le financement temporaire avec garanties immobilières.'
  WHERE cle = 'profil.histoire.p1';

-- ── Services Particuliers ─────────────────────────────────
UPDATE site_content SET valeur = 'Solutions Financement Fortier offre un large éventail de produits de financement pour les particuliers. Nos prêts alternatifs avec garantie immobilière s''adressent à ceux que les banques traditionnelles ne peuvent pas aider.'
  WHERE cle = 'particuliers.intro.p1';

-- ── Services Entreprises ──────────────────────────────────
UPDATE site_content SET valeur = 'Solutions Financement Fortier offre des solutions de financement alternatif pour les entreprises et les projets commerciaux. Nos prêts sont garantis par des hypothèques immobilières de 1er ou 2e rang.'
  WHERE cle = 'entreprises.intro.p1';

-- ── 2e Chance au Crédit ───────────────────────────────────
UPDATE site_content SET valeur = 'Vous avez des problèmes de crédit, une faillite antérieure, ou une cote de crédit insuffisante pour obtenir un prêt bancaire traditionnel ? Solutions Financement Fortier peut vous offrir une deuxième chance.'
  WHERE cle = 'deuxieme.retablir.p1';

-- ── FAQ (table faq) ──────────────────────────────────────
UPDATE faq SET reponse = 'Un prêt alternatif est un financement offert par un prêteur privé plutôt qu''une banque traditionnelle. Chez Solutions Financement Fortier, nos prêts sont garantis par des hypothèques immobilières de 1er ou 2e rang. Ils sont conçus pour les personnes qui ne peuvent pas obtenir de financement auprès des institutions bancaires.'
  WHERE question LIKE 'Qu''est-ce qu''un prêt alternatif%';

UPDATE faq SET reponse = 'Absolument. Toutes les informations transmises à Solutions Financement Fortier demeurent strictement confidentielles. Nous ne partageons jamais vos données personnelles avec des tiers sans votre consentement.'
  WHERE question LIKE 'Mes informations sont-elles confidentielles%';
