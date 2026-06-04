import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  XCircle,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────
export interface Demande {
  id: number;
  prenom: string;
  nom: string;
  telephone: string;
  courriel: string;
  adresse: string | null;
  ville: string | null;
  code_postal: string | null;
  type_financement: string | null;
  montant_souhaite: string | null;
  duree_souhaitee: string | null;
  urgence: string | null;
  situation_emploi: string | null;
  revenu_annuel: string | null;
  type_propriete: string | null;
  valeur_propriete: string | null;
  solde_hypothecaire: string | null;
  adresse_propriete: string | null;
  rang_hypothecaire: string | null;
  commentaire: string | null;
  consentement: boolean;
  statut: string;
  notes: string | null;
  lu: boolean;
  created_at: string;
}

export interface Contact {
  id: number;
  prenom: string;
  nom: string;
  courriel: string;
  telephone: string | null;
  message: string;
  statut: string;
  notes: string | null;
  lu: boolean;
  created_at: string;
}

export interface NewsletterSub {
  id: string;
  courriel: string;
  active: boolean;
  created_at: string;
}

export type Tab =
  | "dashboard"
  | "demandes"
  | "contacts"
  | "newsletter"
  | "contenu"
  | "faq";
export type SortDir = "asc" | "desc";

export const STATUTS = [
  {
    value: "nouveau",
    label: "Nouveau",
    color: "bg-blue-100 text-blue-700",
    icon: AlertCircle,
  },
  {
    value: "en_cours",
    label: "En cours",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },
  {
    value: "approuve",
    label: "Approuvé",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  {
    value: "refuse",
    label: "Refusé",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
  {
    value: "archive",
    label: "Archivé",
    color: "bg-gray-100 text-gray-500",
    icon: FileText,
  },
];

export function getStatutInfo(statut: string) {
  return STATUTS.find((s) => s.value === statut) || STATUTS[0];
}

export interface FaqRow {
  id: number;
  question: string;
  reponse: string;
  categorie: string;
  ordre: number;
  visible: boolean;
}

export const FAQ_CATEGORIES = [
  { value: "general", label: "Général" },
  { value: "admissibilite", label: "Admissibilité" },
  { value: "processus", label: "Processus de demande" },
  { value: "remboursement", label: "Remboursement" },
];

export interface ContentRow {
  id: number;
  cle: string;
  valeur: string;
  section: string;
  libelle: string;
  type: string;
  ordre: number;
}

export const SECTION_LABELS: Record<string, string> = {
  coordonnees: "📍 Coordonnées",
  accueil: "🏠 Page d'accueil",
  statistiques: "📊 Statistiques",
  processus: "🔄 Processus",
  temoignages: "⭐ Témoignages",
  profil: "🏢 Profil de l'entreprise",
  particuliers: "👤 Services — Particuliers",
  entreprises: "🏗️ Services — Entreprises",
  consolidation: "💳 Consolidation de dettes",
  deuxieme_chance: "🔄 2e chance au crédit",
  faillite: "🛡️ Éviter la faillite",
  temporaire: "⏱️ Financement temporaire",
  contact: "📞 Nous joindre",
  demande: "📝 Demande en ligne",
  confirmation: "✅ Confirmation demande",
  calculateur: "🧮 Calculateur",
  faq: "❓ FAQ",
  footer: "📄 Pied de page",
  navigation: "🧭 Navigation",
  legal: "⚖️ Mentions légales",
  notfound: "🚫 Page introuvable",
  regions: "🗺️ Régions",
  city: "🏙️ Pages ville",
};
