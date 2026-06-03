-- Rewrite all Quebec-specific content to Canada-wide scope

UPDATE site_content SET valeur = 'Prêteur Alternatif au Canada — Toutes les Régions'
WHERE cle = 'regions.hero.titre';

UPDATE site_content SET valeur = 'Solutions Financement Fortier dessert l''ensemble du Canada. Trouvez le financement alternatif dont vous avez besoin, peu importe votre province ou votre ville.'
WHERE cle = 'regions.hero.soustitre';

UPDATE site_content SET valeur = 'Depuis 1998, Solutions Financement Fortier offre des prêts avec garantie immobilière partout au Canada. Que vous soyez à Toronto, Vancouver, Calgary, Montréal, Ottawa ou dans une petite municipalité, nous pouvons vous aider avec un financement rapide, approuvé en 48 heures.'
WHERE cle = 'regions.intro';

UPDATE site_content SET valeur = 'Peu importe votre province ou votre ville au Canada, nous pouvons vous aider. Réponse en 48 heures.'
WHERE cle = 'regions.cta.soustitre';

UPDATE site_content SET valeur = 'Notre bureau est situé à Fossambault-sur-le-Lac (QC), à environ {distance} km de {city}. Nous servons l''ensemble du Canada avec des prêts garantis par des actifs immobiliers. Nos dossiers sont traités rapidement, avec une approbation possible en 48 heures.'
WHERE cle = 'city.intro.body2_template';

UPDATE site_content SET valeur = 'Disponible pour les résidents de {city} et des environs.'
WHERE cle = 'city.services.card_desc_template';

UPDATE site_content SET valeur = 'Société par actions (Canada)'
WHERE cle = 'legal.editor.legal_form_value';

UPDATE site_content SET valeur = 'Canada'
WHERE cle = 'legal.editor.address_value';

UPDATE site_content SET valeur = 'Le présent site et ses mentions légales sont régis par les lois fédérales canadiennes applicables et les lois de la province de Québec. Tout litige sera soumis à la compétence exclusive des tribunaux compétents.'
WHERE cle = 'legal.law.body';

UPDATE site_content SET valeur = 'Solutions Financement Fortier Inc. exerce ses activités conformément à la législation canadienne en matière de prêt hypothécaire privé, incluant notamment le Code civil du Québec, la Loi sur la protection du consommateur et les réglementations provinciales applicables dans chaque province desservie.'
WHERE cle = 'legal.regulation.body';
