-- ═══════════════════════════════════════════════════════════
-- Migration : Contraintes de longueur pour les champs multi-étapes de demandes
-- ═══════════════════════════════════════════════════════════

-- Champs ajoutés par les migrations précédentes sans contraintes CHECK

ALTER TABLE public.demandes
  ADD CONSTRAINT chk_demandes_adresse_len CHECK (char_length(adresse) <= 300),
  ADD CONSTRAINT chk_demandes_code_postal_len CHECK (char_length(code_postal) <= 10),
  ADD CONSTRAINT chk_demandes_ville_len CHECK (char_length(ville) <= 100),
  ADD CONSTRAINT chk_demandes_type_financement_len CHECK (char_length(type_financement) <= 100),
  ADD CONSTRAINT chk_demandes_type_propriete_len CHECK (char_length(type_propriete) <= 100),
  ADD CONSTRAINT chk_demandes_montant_souhaite_len CHECK (char_length(montant_souhaite) <= 50),
  ADD CONSTRAINT chk_demandes_duree_souhaitee_len CHECK (char_length(duree_souhaitee) <= 50),
  ADD CONSTRAINT chk_demandes_urgence_len CHECK (char_length(urgence) <= 50),
  ADD CONSTRAINT chk_demandes_situation_emploi_len CHECK (char_length(situation_emploi) <= 100),
  ADD CONSTRAINT chk_demandes_revenu_annuel_len CHECK (char_length(revenu_annuel) <= 50),
  ADD CONSTRAINT chk_demandes_valeur_propriete_len CHECK (char_length(valeur_propriete) <= 50),
  ADD CONSTRAINT chk_demandes_solde_hypothecaire_len CHECK (char_length(solde_hypothecaire) <= 50),
  ADD CONSTRAINT chk_demandes_adresse_propriete_len CHECK (char_length(adresse_propriete) <= 300),
  ADD CONSTRAINT chk_demandes_rang_hypothecaire_len CHECK (char_length(rang_hypothecaire) <= 50);
