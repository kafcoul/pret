-- ── Table FAQ ─────────────────────────────────────────
CREATE TABLE faq (
    id          SERIAL PRIMARY KEY,
    question    TEXT NOT NULL,
    reponse     TEXT NOT NULL,
    categorie   TEXT NOT NULL DEFAULT 'general',
    ordre       INTEGER NOT NULL DEFAULT 0,
    visible     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

-- ── Trigger updated_at ───────────────────────────────
CREATE OR REPLACE FUNCTION update_faq_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER faq_updated_at
    BEFORE UPDATE ON faq
    FOR EACH ROW EXECUTE FUNCTION update_faq_updated_at();

-- ── RLS ──────────────────────────────────────────────
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;

CREATE POLICY "faq_select_all" ON faq FOR SELECT USING (true);
CREATE POLICY "faq_insert_auth" ON faq FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "faq_update_auth" ON faq FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "faq_delete_auth" ON faq FOR DELETE TO authenticated USING (true);

-- ── Seed : questions fréquentes ──────────────────────
INSERT INTO faq (question, reponse, categorie, ordre) VALUES

-- Général
('Qu''est-ce qu''un prêt alternatif ?',
 'Un prêt alternatif est un financement offert par un prêteur privé plutôt qu''une banque traditionnelle. Chez Solutions Financement Fortier, nos prêts sont garantis par des hypothèques immobilières de 1er ou 2e rang. Ils sont conçus pour les personnes qui ne peuvent pas obtenir de financement auprès des institutions bancaires.',
 'general', 1),

('Combien de temps faut-il pour obtenir une approbation ?',
 'Dans la plupart des cas, nous sommes en mesure de donner une réponse en aussi peu que 48 heures après réception de votre demande complète. La rapidité est l''un de nos principaux avantages.',
 'general', 2),

('Quels sont vos taux d''intérêt ?',
 'Nos taux varient selon la situation de chaque client, le montant demandé, la valeur de la propriété offerte en garantie et le niveau de risque. Pour obtenir une soumission personnalisée, remplissez notre formulaire de demande en ligne ou contactez-nous directement.',
 'general', 3),

('Mes informations sont-elles confidentielles ?',
 'Absolument. Toutes les informations transmises à Solutions Financement Fortier demeurent strictement confidentielles. Nous ne partageons jamais vos données personnelles avec des tiers sans votre consentement.',
 'general', 4),

-- Admissibilité
('Est-ce que je peux obtenir un prêt avec un mauvais crédit ?',
 'Oui. Contrairement aux banques, nous basons principalement nos décisions sur la valeur de l''équité que vous détenez dans votre propriété immobilière, et non uniquement sur votre dossier de crédit. Même avec une faillite antérieure ou une cote de crédit faible, nous pouvons évaluer votre demande.',
 'admissibilite', 10),

('Quels types de propriétés sont acceptés en garantie ?',
 'Nous acceptons les maisons unifamiliales, condos, duplex, triplex, immeubles multi-logements (4+), propriétés commerciales et terrains situés au Québec. La propriété doit avoir une équité suffisante pour garantir le prêt.',
 'admissibilite', 11),

('Dois-je être propriétaire pour obtenir un prêt ?',
 'Oui, vous devez posséder un bien immobilier au Québec qui servira de garantie hypothécaire pour le prêt. Si vous n''êtes pas propriétaire, nous ne pouvons malheureusement pas vous aider directement, mais nous pouvons vous référer à des ressources appropriées.',
 'admissibilite', 12),

('Est-ce que les travailleurs autonomes sont admissibles ?',
 'Oui ! Les travailleurs autonomes sont tout à fait admissibles, même sans les documents de revenus traditionnels exigés par les banques. Nous évaluons votre dossier de façon globale.',
 'admissibilite', 13),

-- Processus
('Comment fonctionne le processus de demande ?',
 'C''est simple : 1) Remplissez notre formulaire en ligne ou appelez-nous. 2) Un spécialiste analysera votre dossier. 3) Vous recevez une réponse en 48 heures. 4) Si approuvé, les fonds sont débloqués rapidement après signature chez le notaire.',
 'processus', 20),

('Quels documents dois-je fournir ?',
 'Les documents requis varient selon votre situation, mais incluent généralement : une pièce d''identité, l''évaluation municipale de la propriété, un relevé hypothécaire récent et une preuve de propriété. Notre équipe vous guidera à travers les documents nécessaires.',
 'processus', 21),

('Y a-t-il des frais de dossier ?',
 'Des frais peuvent s''appliquer selon le type de prêt et la complexité du dossier. Tous les frais sont clairement expliqués avant la signature de toute entente. Il n''y a aucuns frais cachés.',
 'processus', 22),

-- Remboursement
('Quelle est la durée typique d''un prêt ?',
 'Nos prêts sont généralement de nature temporaire, avec des durées allant de 6 mois à 3 ans. L''objectif est de vous aider à traverser une période difficile, le temps de rétablir votre situation financière et de pouvoir ensuite accéder au financement bancaire traditionnel.',
 'remboursement', 30),

('Puis-je rembourser mon prêt par anticipation ?',
 'Oui, le remboursement anticipé est possible. Les conditions de remboursement anticipé sont précisées dans votre contrat de prêt. Nous encourageons nos clients à refinancer auprès d''une institution traditionnelle dès que leur situation le permet.',
 'remboursement', 31),

('Que se passe-t-il si je ne peux pas faire un paiement ?',
 'Communiquez avec nous dès que possible si vous anticipez des difficultés de paiement. Nous sommes compréhensifs et pouvons discuter d''arrangements temporaires selon votre situation. L''important est de ne pas attendre et de nous contacter rapidement.',
 'remboursement', 32);

-- ── Clés CMS pour la page FAQ ────────────────────────
INSERT INTO site_content (cle, valeur, section, libelle, type, ordre) VALUES
('faq.hero.titre', 'Foire aux questions', 'faq', 'Titre hero', 'text', 1),
('faq.hero.soustitre', 'Trouvez rapidement les réponses à vos questions sur nos services de financement', 'faq', 'Sous-titre hero', 'text', 2),
('faq.cta.titre', 'Vous avez d''autres questions ?', 'faq', 'Titre CTA', 'text', 50),
('faq.cta.soustitre', 'N''hésitez pas à nous contacter — notre équipe se fera un plaisir de vous répondre.', 'faq', 'Sous-titre CTA', 'text', 51);
