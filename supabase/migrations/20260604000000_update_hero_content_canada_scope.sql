-- Update all hero/subtitle content to Canada-wide scope

UPDATE site_content SET valeur = 'Prêteur alternatif canadien depuis 1998'
WHERE cle = 'accueil.hero.badge';

UPDATE site_content SET valeur = 'La solution de financement alternatif partout au Canada'
WHERE cle = 'accueil.hero.titre';

UPDATE site_content SET valeur = 'Financement approuvé en aussi peu que 48 heures, garanti par vos actifs immobiliers. Peu importe votre province, votre situation d''emploi ou votre dossier de crédit — nous trouvons une solution.'
WHERE cle = 'accueil.hero.soustitre';

UPDATE site_content SET valeur = 'Prêteur alternatif canadien de confiance depuis 1998 — au service des particuliers et des entreprises partout au Canada'
WHERE cle = 'profil.hero.soustitre';

UPDATE site_content SET valeur = 'Prêts alternatifs avec garantie immobilière pour particuliers partout au Canada — refusé par votre banque ? Nous avons la solution.'
WHERE cle = 'particuliers.hero.soustitre';

UPDATE site_content SET valeur = 'Solutions de financement alternatif pour vos projets d''affaires — rapides, flexibles, garantis par vos actifs immobiliers partout au Canada.'
WHERE cle = 'entreprises.hero.soustitre';

UPDATE site_content SET valeur = 'Regroupez toutes vos dettes en un seul paiement mensuel — une solution temporaire accessible aux Canadiens de toutes les provinces, même avec un mauvais crédit.'
WHERE cle = 'consolidation.hero.soustitre';

UPDATE site_content SET valeur = 'Faillite, mauvais crédit, revenus atypiques ? Partout au Canada, nous évaluons votre dossier sur la valeur de votre propriété — pas sur votre cote de crédit.'
WHERE cle = 'deuxieme.hero.soustitre';

UPDATE site_content SET valeur = 'Des alternatives existent partout au Canada — si vous détenez de l''équité immobilière, un prêt temporaire peut vous éviter la faillite et protéger votre avenir financier.'
WHERE cle = 'faillite.hero.soustitre';

UPDATE site_content SET valeur = 'Solutions de prêt relais rapides et flexibles pour particuliers et entreprises — approuvées en 48 heures, partout au Canada.'
WHERE cle = 'temporaire.hero.soustitre';
