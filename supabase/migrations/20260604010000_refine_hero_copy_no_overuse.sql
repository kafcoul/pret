-- Refine hero copy: remove mechanical "partout au Canada" repetition, keep it natural

UPDATE site_content SET valeur = 'Obtenez votre financement en aussi peu que 48 heures'
WHERE cle = 'accueil.cta.titre';

UPDATE site_content SET valeur = 'Prêteur alternatif de confiance fondé en 1998 — plus de 25 ans au service des particuliers et des entreprises à travers le pays'
WHERE cle = 'profil.hero.soustitre';

UPDATE site_content SET valeur = 'Refusé par votre banque ? Prêts alternatifs garantis par votre propriété — nous aidons les particuliers d''un bout à l''autre du pays, peu importe votre dossier de crédit.'
WHERE cle = 'particuliers.hero.soustitre';

UPDATE site_content SET valeur = 'Solutions de financement alternatif pour vos projets d''affaires — rapides, flexibles, garantis par vos actifs immobiliers.'
WHERE cle = 'entreprises.hero.soustitre';

UPDATE site_content SET valeur = 'Regroupez toutes vos dettes en un seul paiement mensuel — peu importe votre historique de crédit, nous vous aidons à reprendre le contrôle.'
WHERE cle = 'consolidation.hero.soustitre';

UPDATE site_content SET valeur = 'Faillite, mauvais crédit, revenus atypiques ? Nous évaluons votre dossier sur la valeur de votre propriété — pas sur votre cote de crédit.'
WHERE cle = 'deuxieme.hero.soustitre';

UPDATE site_content SET valeur = 'Si vous détenez de l''équité dans votre propriété, un prêt temporaire peut vous éviter la faillite — nous vous aidons à trouver une sortie avant qu''il ne soit trop tard.'
WHERE cle = 'faillite.hero.soustitre';

UPDATE site_content SET valeur = 'Prêts relais à court terme pour ceux que les banques ont refusés — approbation en 48 heures, garantis par l''équité de votre propriété.'
WHERE cle = 'temporaire.hero.soustitre';
