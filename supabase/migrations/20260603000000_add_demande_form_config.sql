INSERT INTO site_content (cle, valeur, section, libelle, type, ordre)
VALUES (
    'demande.form.config',
    $$
{
  "steps": [
    {
      "label": "Vos coordonnées",
      "description": "Informations personnelles"
    },
    {
      "label": "Financement",
      "description": "Détails du prêt souhaité"
    },
    {
      "label": "Propriété",
      "description": "Garantie immobilière"
    },
    {
      "label": "Révision",
      "description": "Vérification et envoi"
    }
  ],
  "sections": {
    "contact": {
      "title": "Vos coordonnées",
      "subtitle": "Comment pouvons-nous vous joindre ?"
    },
    "financing": {
      "title": "Détails du financement",
      "subtitle": "Quel type de prêt recherchez-vous ?",
      "financialSituationTitle": "Situation financière"
    },
    "property": {
      "title": "Propriété offerte en garantie",
      "subtitle": "Informations sur le bien immobilier",
      "notice": "Avec garanties immobilières seulement. La propriété doit être située au Québec et avoir une équité suffisante pour garantir le prêt."
    },
    "review": {
      "title": "Révision de votre demande",
      "subtitle": "Vérifiez vos informations avant de soumettre"
    }
  },
  "fields": {
    "prenom": {
      "label": "Prénom",
      "placeholder": "Votre prénom"
    },
    "nom": {
      "label": "Nom",
      "placeholder": "Votre nom de famille"
    },
    "telephone": {
      "label": "Téléphone",
      "placeholder": "450 000-0000"
    },
    "courriel": {
      "label": "Courriel",
      "placeholder": "votre@courriel.com"
    },
    "adresse": {
      "label": "Adresse",
      "placeholder": "123, rue Exemple"
    },
    "ville": {
      "label": "Ville",
      "placeholder": "Québec, Lévis, Beauport..."
    },
    "codePostal": {
      "label": "Code postal",
      "placeholder": "G1A 1A1"
    },
    "typeFinancement": {
      "label": "Type de financement",
      "placeholder": "Choisir un type"
    },
    "montantSouhaite": {
      "label": "Montant souhaité ($)",
      "placeholder": "ex. 150 000"
    },
    "dureeSouhaitee": {
      "label": "Durée souhaitée",
      "placeholder": "Choisir une durée"
    },
    "urgence": {
      "label": "Urgence du financement",
      "placeholder": "Choisir un délai"
    },
    "situationEmploi": {
      "label": "Situation d'emploi",
      "placeholder": "Choisir"
    },
    "revenuAnnuel": {
      "label": "Revenu annuel brut ($)",
      "placeholder": "ex. 55 000"
    },
    "typePropriete": {
      "label": "Type de propriété",
      "placeholder": "Choisir un type"
    },
    "valeurPropriete": {
      "label": "Valeur estimée de la propriété ($)",
      "placeholder": "ex. 350 000"
    },
    "soldeHypothecaire": {
      "label": "Solde hypothécaire actuel ($)",
      "placeholder": "ex. 180 000 (0 si aucun)"
    },
    "adressePropriete": {
      "label": "Adresse de la propriété",
      "placeholder": "Si différente de votre adresse personnelle"
    },
    "rangHypothecaire": {
      "label": "Rang hypothécaire",
      "placeholder": "Choisir"
    },
    "commentaire": {
      "label": "Commentaire ou précisions",
      "placeholder": "Décrivez brièvement votre besoin ou toute information utile..."
    }
  },
  "options": {
    "typeFinancement": [
      {
        "value": "pret-renovation",
        "label": "Prêt rénovation"
      },
      {
        "value": "achat-immobilier",
        "label": "Achat immobilier"
      },
      {
        "value": "refinancement",
        "label": "Refinancement"
      },
      {
        "value": "consolidation-dettes",
        "label": "Consolidation de dettes"
      },
      {
        "value": "financement-temporaire",
        "label": "Financement temporaire / relais"
      },
      {
        "value": "deuxieme-chance",
        "label": "2e chance au crédit"
      },
      {
        "value": "financement-entreprise",
        "label": "Financement entreprise"
      },
      {
        "value": "construction",
        "label": "Construction"
      },
      {
        "value": "autre",
        "label": "Autre"
      }
    ],
    "typePropriete": [
      {
        "value": "maison-unifamiliale",
        "label": "Maison unifamiliale"
      },
      {
        "value": "condo",
        "label": "Condominium"
      },
      {
        "value": "duplex-triplex",
        "label": "Duplex / Triplex"
      },
      {
        "value": "multilogements",
        "label": "Multi-logements (4+)"
      },
      {
        "value": "commercial",
        "label": "Commercial"
      },
      {
        "value": "terrain",
        "label": "Terrain"
      },
      {
        "value": "autre",
        "label": "Autre"
      }
    ],
    "situationEmploi": [
      {
        "value": "salarie",
        "label": "Salarié(e)"
      },
      {
        "value": "autonome",
        "label": "Travailleur(euse) autonome"
      },
      {
        "value": "retraite",
        "label": "Retraité(e)"
      },
      {
        "value": "sans-emploi",
        "label": "Sans emploi"
      },
      {
        "value": "autre",
        "label": "Autre"
      }
    ],
    "dureeSouhaitee": [
      {
        "value": "6-mois",
        "label": "6 mois"
      },
      {
        "value": "1-an",
        "label": "1 an"
      },
      {
        "value": "2-ans",
        "label": "2 ans"
      },
      {
        "value": "3-ans",
        "label": "3 ans"
      },
      {
        "value": "indetermine",
        "label": "Indéterminé"
      }
    ],
    "urgence": [
      {
        "value": "urgent",
        "label": "Urgent (moins de 2 semaines)"
      },
      {
        "value": "normal",
        "label": "Normal (2 à 4 semaines)"
      },
      {
        "value": "flexible",
        "label": "Flexible (pas de date précise)"
      }
    ],
    "rangHypothecaire": [
      {
        "value": "1er-rang",
        "label": "1er rang (aucune hypothèque existante)"
      },
      {
        "value": "2e-rang",
        "label": "2e rang (hypothèque existante)"
      },
      {
        "value": "incertain",
        "label": "Je ne suis pas certain(e)"
      }
    ]
  },
  "review": {
    "contactTitle": "Coordonnées",
    "financingTitle": "Financement",
    "propertyTitle": "Propriété en garantie",
    "commentLabel": "Commentaire :",
    "editButtonLabel": "Modifier",
    "fullNameLabel": "Nom complet",
    "addressLabel": "Adresse",
    "typeLabel": "Type",
    "amountLabel": "Montant",
    "durationLabel": "Durée",
    "urgencyLabel": "Urgence",
    "employmentLabel": "Emploi",
    "annualIncomeLabel": "Revenu annuel",
    "estimatedValueLabel": "Valeur estimée",
    "mortgageBalanceLabel": "Solde hypothécaire",
    "propertyAddressLabel": "Adresse propriété",
    "mortgageRankLabel": "Rang",
    "sameAddressFallback": "Même que l'adresse personnelle"
  },
  "documents": {
    "title": "Documents à préparer pour votre rencontre",
    "footnote": "Ces documents seront demandés lors de votre rencontre avec le spécialiste. Vous n'avez pas besoin de les fournir maintenant.",
    "items": [
      "Pièce d'identité avec photo (permis de conduire ou passeport)",
      "Évaluation municipale de la propriété",
      "Relevé hypothécaire récent (si applicable)",
      "Preuve de propriété (acte de vente)",
      "Preuve de revenus (derniers relevés de paie ou avis de cotisation)"
    ]
  },
  "consent": {
    "text": "J'atteste que les informations fournies sont exactes et je consens à ce que Solutions Financement Fortier me contacte pour discuter de ma demande de financement. Mes informations demeurent strictement confidentielles."
  },
  "buttons": {
    "previous": "Précédent",
    "next": "Suivant",
    "submit": "Soumettre la demande",
    "submitLoading": "Envoi en cours...",
    "submitAnother": "Soumettre une autre demande"
  },
  "success": {
    "title": "Demande envoyée avec succès !",
    "message": "Un spécialiste en financement vous contactera dans les 48 heures ouvrables pour discuter de vos options."
  },
  "trustBadges": {
    "confidentiality": "Données 100 % confidentielles",
    "response": "Réponse en 48h ouvrables"
  },
  "validation": {
    "prenomRequired": "Le prénom est requis.",
    "nomRequired": "Le nom est requis.",
    "telephoneRequired": "Le téléphone est requis.",
    "telephoneInvalid": "Format de téléphone invalide.",
    "courrielRequired": "Le courriel est requis.",
    "courrielInvalid": "Adresse courriel invalide.",
    "villeRequired": "La ville est requise.",
    "typeFinancementRequired": "Veuillez choisir un type de financement.",
    "montantRequired": "Le montant est requis.",
    "situationEmploiRequired": "Veuillez indiquer votre situation.",
    "typeProprieteRequired": "Veuillez choisir un type de propriété.",
    "valeurProprieteRequired": "La valeur estimée est requise.",
    "consentementRequired": "Vous devez accepter pour soumettre votre demande."
  },
  "submitErrors": {
    "retryLater": "Veuillez patienter avant de soumettre à nouveau.",
    "validation": "Veuillez corriger les erreurs avant de soumettre.",
    "network": "Impossible de joindre le serveur. Vérifiez votre connexion Internet.",
    "server": "Le serveur a rencontré une erreur. Veuillez réessayer ou nous appeler au {phone}.",
    "relay": "Service temporairement indisponible. Réessayez dans quelques instants."
  }
}
$$,
    'demande',
    'Configuration complète du formulaire (JSON)',
    'textarea',
    100
)
ON CONFLICT (cle) DO NOTHING;