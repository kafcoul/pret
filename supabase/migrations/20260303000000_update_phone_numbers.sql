-- Migration: Mise à jour des numéros de téléphone vers 450 914-5709
-- Date: 2026-03-03

UPDATE site_content SET valeur = '450 914-5709' WHERE cle = 'coord.telephone1';
UPDATE site_content SET valeur = '450 914-5709' WHERE cle = 'coord.telephone2';
UPDATE site_content SET valeur = '450 914-5709' WHERE cle = 'coord.telecopieur';
