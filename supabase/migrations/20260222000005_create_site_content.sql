-- ═══════════════════════════════════════════════════════════
-- Site Content CMS — Editable from Admin Dashboard
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS site_content (
    id SERIAL PRIMARY KEY,
    cle TEXT UNIQUE NOT NULL,
    valeur TEXT NOT NULL DEFAULT '',
    section TEXT NOT NULL,
    libelle TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'textarea', 'tel', 'email', 'url')),
    ordre INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast section grouping
CREATE INDEX idx_site_content_section ON site_content(section, ordre);

-- RLS policies
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Anyone can read (public content)
CREATE POLICY "site_content_select" ON site_content FOR SELECT USING (true);

-- Only authenticated users can update
CREATE POLICY "site_content_update" ON site_content FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════
-- SEED DATA
-- ═══════════════════════════════════════════════════════════

-- ── Coordonnées (global) ──────────────────────────────────
INSERT INTO site_content (cle, valeur, section, libelle, type, ordre) VALUES
('coord.telephone1', '450 914-5709', 'coordonnees', 'Téléphone principal', 'tel', 1),
('coord.telephone2', '450 914-5709', 'coordonnees', 'Cellulaire', 'tel', 2),
('coord.telecopieur', '450 914-5709', 'coordonnees', 'Télécopieur', 'tel', 3),
('coord.courriel', 'info@solutionsfortier.com', 'coordonnees', 'Courriel principal', 'email', 4),
('coord.adresse.ligne1', '490, rue de Kilkenny', 'coordonnees', 'Adresse ligne 1', 'text', 5),
('coord.adresse.ligne2', 'Fossambault-sur-le-Lac, QC G3N 3C4', 'coordonnees', 'Adresse ligne 2', 'text', 6),
('coord.facebook.url', 'https://www.facebook.com/solutionsfortier', 'coordonnees', 'Page Facebook (URL)', 'url', 7),
('coord.nom.entreprise', 'Solutions Financement Fortier', 'coordonnees', 'Nom de l''entreprise', 'text', 8),
('coord.slogan', 'Prêteur alternatif à Québec depuis 1998', 'coordonnees', 'Slogan', 'text', 9);

-- ── Accueil ───────────────────────────────────────────────
INSERT INTO site_content (cle, valeur, section, libelle, type, ordre) VALUES
('accueil.hero.badge', 'Prêteur alternatif depuis 1998', 'accueil', 'Badge hero', 'text', 1),
('accueil.hero.titre', 'La solution de financement temporaire à Québec', 'accueil', 'Titre principal', 'text', 2),
('accueil.hero.soustitre', 'Prêts rapides à obtenir avec garanties immobilières. Financement approuvé en aussi peu que 48 heures, sans égard à votre dossier de crédit.', 'accueil', 'Sous-titre hero', 'textarea', 3),
('accueil.hero.cta1', 'Faire une demande en ligne', 'accueil', 'Bouton CTA principal', 'text', 4),
('accueil.hero.cta2', 'Nous joindre', 'accueil', 'Bouton CTA secondaire', 'text', 5),
('accueil.services.titre', 'Nos services de financement', 'accueil', 'Titre section services', 'text', 10),
('accueil.services.soustitre', 'Des solutions de financement ajustées à vos besoins, avec garanties immobilières en 1er ou 2e rang.', 'accueil', 'Sous-titre section services', 'textarea', 11),
('accueil.courtiers.titre', 'Courtiers hypothécaires', 'accueil', 'Titre section courtiers', 'text', 20),
('accueil.courtiers.desc', 'Vous êtes courtier hypothécaire ? Joignez-vous à notre réseau de collaborateurs indépendants. Nous offrons des conditions avantageuses et un service rapide pour vos clients.', 'accueil', 'Description courtiers', 'textarea', 21),
('accueil.courtiers.cta', 'Communiquez avec nous →', 'accueil', 'Lien courtiers', 'text', 22),
('accueil.cta.titre', 'Des solutions de financement ajustées à vos besoins', 'accueil', 'Titre CTA final', 'text', 30),
('accueil.cta.soustitre', 'Remplissez notre formulaire en ligne et un spécialiste vous contactera rapidement.', 'accueil', 'Sous-titre CTA final', 'textarea', 31);

-- ── Profil ────────────────────────────────────────────────
INSERT INTO site_content (cle, valeur, section, libelle, type, ordre) VALUES
('profil.hero.titre', 'Profil de l''entreprise', 'profil', 'Titre hero', 'text', 1),
('profil.hero.soustitre', 'Plus de 25 ans d''expertise en financement alternatif au Québec', 'profil', 'Sous-titre hero', 'text', 2),
('profil.citation', 'Solutions Financement Fortier inc. est une entreprise québécoise spécialisée dans le prêt alternatif avec garanties immobilières depuis 1998.', 'profil', 'Citation vedette', 'textarea', 3),
('profil.histoire.titre', 'Notre histoire', 'profil', 'Titre section histoire', 'text', 10),
('profil.histoire.p1', 'Fondée en 1998 par M. Claude Gosselin, Solutions Financement Fortier inc. est une entreprise québécoise de financement alternatif. Fort de plus de 30 années d''expérience dans le domaine financier et immobilier, M. Gosselin a développé une expertise reconnue dans le financement temporaire avec garanties immobilières.', 'profil', 'Paragraphe histoire 1', 'textarea', 11),
('profil.histoire.p2', 'Cette expertise, transmise d''une génération à l''autre, nous permet d''offrir un service personnalisé et adapté aux besoins de chaque client. Notre approche se distingue des institutions bancaires traditionnelles par notre flexibilité et notre rapidité d''exécution.', 'profil', 'Paragraphe histoire 2', 'textarea', 12),
('profil.approche.titre', 'Notre approche', 'profil', 'Titre section approche', 'text', 20),
('profil.approche.p1', 'Contrairement aux banques traditionnelles, nous basons nos décisions de prêt sur la valeur de l''équité que vous détenez dans votre propriété, et non uniquement sur votre dossier de crédit. Cette approche nous permet d''aider des clients que les institutions traditionnelles ne peuvent pas servir.', 'profil', 'Paragraphe approche', 'textarea', 21),
('profil.mission.titre', 'Notre mission', 'profil', 'Titre section mission', 'text', 30),
('profil.mission.texte', 'Aider nos clients à traverser des périodes financières difficiles en leur offrant des solutions de financement temporaire rapides, confidentielles et adaptées à leur situation.', 'profil', 'Texte mission', 'textarea', 31),
('profil.valeurs.titre', 'Nos valeurs', 'profil', 'Titre section valeurs', 'text', 40),
('profil.valeurs.texte', 'Rapidité, confidentialité, flexibilité et respect du client. Nous traitons chaque dossier avec le plus grand soin et la plus grande discrétion.', 'profil', 'Texte valeurs', 'textarea', 41),
('profil.cta.titre', 'Besoin de financement ?', 'profil', 'Titre CTA', 'text', 50),
('profil.cta.soustitre', 'Faites une demande en ligne et recevez une réponse en 48 heures.', 'profil', 'Sous-titre CTA', 'text', 51);

-- ── Services Particuliers ─────────────────────────────────
INSERT INTO site_content (cle, valeur, section, libelle, type, ordre) VALUES
('particuliers.hero.titre', 'Services financiers pour particuliers', 'particuliers', 'Titre hero', 'text', 1),
('particuliers.hero.soustitre', 'Un large éventail de produits de financement adaptés à vos besoins personnels', 'particuliers', 'Sous-titre hero', 'text', 2),
('particuliers.intro.titre', 'Financement rapide pour particuliers', 'particuliers', 'Titre intro', 'text', 10),
('particuliers.intro.p1', 'Solutions Financement Fortier offre un large éventail de produits de financement pour les particuliers. Nos prêts alternatifs avec garantie immobilière s''adressent à ceux que les banques traditionnelles ne peuvent pas aider.', 'particuliers', 'Paragraphe intro 1', 'textarea', 11),
('particuliers.intro.p2', 'Que vous soyez travailleur autonome, en projet de construction ou d''agrandissement, en achat de terrain, en démarrage d''entreprise, ou en rétablissement après une faillite, nous avons une solution pour vous.', 'particuliers', 'Paragraphe intro 2', 'textarea', 12),
('particuliers.cta.titre', 'Faites une demande de financement en ligne', 'particuliers', 'Titre CTA', 'text', 50),
('particuliers.cta.bouton', 'Demande de financement pour particuliers', 'particuliers', 'Bouton CTA', 'text', 52);

-- ── Services Entreprises ──────────────────────────────────
INSERT INTO site_content (cle, valeur, section, libelle, type, ordre) VALUES
('entreprises.hero.titre', 'Services financiers pour entreprises', 'entreprises', 'Titre hero', 'text', 1),
('entreprises.hero.soustitre', 'Solutions de financement alternatif pour vos projets d''affaires', 'entreprises', 'Sous-titre hero', 'text', 2),
('entreprises.intro.titre', 'Financement alternatif pour entreprises', 'entreprises', 'Titre intro', 'text', 10),
('entreprises.intro.p1', 'Solutions Financement Fortier offre des solutions de financement alternatif pour les entreprises et les projets commerciaux. Nos prêts sont garantis par des hypothèques immobilières de 1er ou 2e rang.', 'entreprises', 'Paragraphe intro 1', 'textarea', 11),
('entreprises.cta.titre', 'Financement pour votre entreprise', 'entreprises', 'Titre CTA', 'text', 50),
('entreprises.cta.soustitre', 'Des solutions rapides et flexibles pour vos projets d''affaires.', 'entreprises', 'Sous-titre CTA', 'text', 51),
('entreprises.cta.bouton', 'Demande de financement entreprise', 'entreprises', 'Bouton CTA', 'text', 52);

-- ── Consolidation ─────────────────────────────────────────
INSERT INTO site_content (cle, valeur, section, libelle, type, ordre) VALUES
('consolidation.hero.titre', 'Consolidation de dettes', 'consolidation', 'Titre hero', 'text', 1),
('consolidation.hero.soustitre', 'Regroupez toutes vos dettes en un seul paiement mensuel', 'consolidation', 'Sous-titre hero', 'text', 2),
('consolidation.quest.titre', 'Qu''est-ce que la consolidation de dettes ?', 'consolidation', 'Titre définition', 'text', 10),
('consolidation.quest.texte', 'La consolidation de dettes consiste à regrouper l''ensemble de vos dettes (cartes de crédit, prêts personnels, marges de crédit, etc.) en un seul prêt avec un seul paiement mensuel. C''est une solution temporaire qui vous permet de reprendre le contrôle de vos finances.', 'consolidation', 'Texte définition', 'textarea', 11),
('consolidation.cta.titre', 'Besoin de consolider vos dettes ?', 'consolidation', 'Titre CTA', 'text', 50),
('consolidation.cta.soustitre', 'Nous pouvons vous aider à regrouper vos dettes et retrouver la tranquillité d''esprit.', 'consolidation', 'Sous-titre CTA', 'text', 51),
('consolidation.cta.bouton', 'Demande de consolidation de dettes', 'consolidation', 'Bouton CTA', 'text', 52);

-- ── 2e Chance au Crédit ───────────────────────────────────
INSERT INTO site_content (cle, valeur, section, libelle, type, ordre) VALUES
('deuxieme.hero.titre', '2e chance au crédit', 'deuxieme_chance', 'Titre hero', 'text', 1),
('deuxieme.hero.soustitre', 'Vous avez un mauvais dossier de crédit ? Nous pouvons vous aider.', 'deuxieme_chance', 'Sous-titre hero', 'text', 2),
('deuxieme.retablir.titre', 'Rétablissez votre crédit', 'deuxieme_chance', 'Titre rétablir', 'text', 10),
('deuxieme.retablir.p1', 'Vous avez des problèmes de crédit, une faillite antérieure, ou une cote de crédit insuffisante pour obtenir un prêt bancaire traditionnel ? Solutions Financement Fortier peut vous offrir une deuxième chance.', 'deuxieme_chance', 'Paragraphe 1', 'textarea', 11),
('deuxieme.cta.titre', 'Prêt pour une 2e chance au crédit ?', 'deuxieme_chance', 'Titre CTA', 'text', 50),
('deuxieme.cta.soustitre', 'Faites le premier pas vers votre rétablissement financier.', 'deuxieme_chance', 'Sous-titre CTA', 'text', 51),
('deuxieme.cta.bouton', 'Demande de 2e chance au crédit', 'deuxieme_chance', 'Bouton CTA', 'text', 52);

-- ── Éviter la Faillite ────────────────────────────────────
INSERT INTO site_content (cle, valeur, section, libelle, type, ordre) VALUES
('faillite.hero.titre', 'Éviter la faillite', 'faillite', 'Titre hero', 'text', 1),
('faillite.hero.soustitre', 'Des alternatives existent — nous pouvons vous aider à éviter la faillite', 'faillite', 'Sous-titre hero', 'text', 2),
('faillite.intro.titre', 'Ne laissez pas la faillite ruiner votre avenir', 'faillite', 'Titre intro', 'text', 10),
('faillite.intro.texte', 'La faillite est une solution de dernier recours qui comporte des conséquences importantes et durables. Si vous possédez de l''équité dans un bien immobilier, un prêt temporaire pourrait vous permettre d''éviter la faillite et de vous remettre sur pied financièrement.', 'faillite', 'Texte intro', 'textarea', 11),
('faillite.cta.titre', 'N''attendez pas qu''il soit trop tard', 'faillite', 'Titre CTA', 'text', 50),
('faillite.cta.soustitre', 'Contactez-nous dès maintenant pour une consultation gratuite et confidentielle.', 'faillite', 'Sous-titre CTA', 'text', 51),
('faillite.cta.bouton', 'Demande d''aide pour éviter la faillite', 'faillite', 'Bouton CTA', 'text', 52);

-- ── Financement Temporaire ────────────────────────────────
INSERT INTO site_content (cle, valeur, section, libelle, type, ordre) VALUES
('temporaire.hero.titre', 'Financement et refinancement temporaire', 'temporaire', 'Titre hero', 'text', 1),
('temporaire.hero.soustitre', 'Des solutions de prêt à court terme pour vos besoins financiers immédiats', 'temporaire', 'Sous-titre hero', 'text', 2),
('temporaire.intro.titre', 'Prêts relais avec garanties immobilières', 'temporaire', 'Titre intro', 'text', 10),
('temporaire.intro.p1', 'Vous avez été refusé par une banque ? Vous avez besoin de financement rapidement ? Nos prêts relais sont conçus pour les personnes qui ont besoin d''une solution de financement temporaire, le temps de régulariser leur situation.', 'temporaire', 'Paragraphe intro 1', 'textarea', 11),
('temporaire.cta.titre', 'Besoin de financement temporaire ?', 'temporaire', 'Titre CTA', 'text', 50),
('temporaire.cta.soustitre', 'Remplissez notre formulaire en ligne pour une évaluation rapide et confidentielle.', 'temporaire', 'Sous-titre CTA', 'text', 51),
('temporaire.cta.bouton', 'Demande de financement temporaire', 'temporaire', 'Bouton CTA', 'text', 52);

-- ── Contact ───────────────────────────────────────────────
INSERT INTO site_content (cle, valeur, section, libelle, type, ordre) VALUES
('contact.hero.titre', 'Nous joindre', 'contact', 'Titre hero', 'text', 1),
('contact.hero.soustitre', 'Contactez-nous pour toute question ou demande d''information', 'contact', 'Sous-titre hero', 'text', 2);

-- ── Demande en ligne ──────────────────────────────────────
INSERT INTO site_content (cle, valeur, section, libelle, type, ordre) VALUES
('demande.hero.titre', 'Demande de financement en ligne', 'demande', 'Titre hero', 'text', 1),
('demande.hero.soustitre', 'Remplissez le formulaire ci-dessous et un spécialiste vous contactera rapidement', 'demande', 'Sous-titre hero', 'text', 2);

-- ── Footer ────────────────────────────────────────────────
INSERT INTO site_content (cle, valeur, section, libelle, type, ordre) VALUES
('footer.description', 'Prêteur alternatif à Québec depuis 1998. Prêts rapides avec garanties immobilières, approuvés en 48 heures.', 'footer', 'Description entreprise', 'textarea', 1),
('footer.newsletter.titre', 'Restez informé', 'footer', 'Titre infolettre', 'text', 10),
('footer.newsletter.soustitre', 'Recevez nos conseils financiers et nouvelles offres.', 'footer', 'Sous-titre infolettre', 'text', 11);
