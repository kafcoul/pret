"""Generate README.md for the project."""
import os

content = """# Solutions Financement Fortier — Site Web

Site vitrine et formulaire de demande en ligne pour **Solutions Financement Fortier**, prêteur alternatif à Québec depuis 1998.

🔗 [www.solutionsfortier.com](https://www.solutionsfortier.com)

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| **Frontend** | React 19, TypeScript, Vite |
| **Styles** | Tailwind CSS v4 (`@tailwindcss/vite`) |
| **Routage** | React Router DOM v7 |
| **Backend** | Supabase (Postgres + Edge Functions) |
| **Email** | Resend (REST API via Edge Functions) |
| **Icônes** | Lucide React |

## Structure du projet

```
src/
├── components/
│   ├── layout/       # Header, Navbar, Footer, Layout
│   └── ui/           # Composants réutilisables
├── lib/              # Client Supabase, utilitaires
├── pages/            # Pages (1:1 avec les routes)
└── assets/           # Fichiers statiques côté build
supabase/
├── migrations/       # Migrations SQL (Postgres)
└── functions/        # Edge Functions (Deno/TypeScript)
public/               # Fichiers statiques servis tels quels
scripts/              # Scripts utilitaires (génération d'assets)
```

## Prérequis

- **Node.js** ≥ 18
- **npm** ≥ 9
- **Supabase CLI** ≥ 2.x (pour le backend)

## Installation

```bash
# 1. Cloner le projet
git clone <repo-url> && cd honore

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.local.example .env.local
# Remplir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY

# 4. Lancer le serveur de développement
npm run dev
```

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | URL du projet Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clé anonyme Supabase |
| `VITE_GA_MEASUREMENT_ID` | (optionnel) ID Google Analytics |

Les variables des Edge Functions sont configurées dans le tableau de bord Supabase :

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Clé API Resend |
| `SENDER_EMAIL` | Adresse d'envoi des notifications |
| `ADMIN_EMAIL` | Adresse de réception des demandes |

## Scripts disponibles

```bash
npm run dev       # Serveur de développement (Vite)
npm run build     # Build de production (TypeScript + Vite)
npm run preview   # Prévisualiser le build de production
npm run lint      # Vérification ESLint
```

## Supabase

### Lier le projet

```bash
supabase login
supabase link --project-ref <ref>
```

### Appliquer les migrations

```bash
supabase db push
```

### Déployer les Edge Functions

```bash
supabase functions deploy submit-demande
supabase functions deploy submit-contact
supabase functions deploy subscribe-newsletter
```

## Déploiement Frontend

Le build génère un dossier `dist/` prêt à être déployé sur :

- **Netlify** — fichier `public/_redirects` inclus pour SPA
- **Vercel** — fichier `public/vercel.json` inclus pour SPA
- **Tout hébergeur statique** — configurer le fallback vers `index.html`

```bash
npm run build
# Le contenu de dist/ est prêt à déployer
```

## Génération des assets PNG

Les icônes PNG (OG image, apple-touch-icon, PWA) sont générées à partir des SVG sources :

```bash
node scripts/generate-assets.mjs
```

## Pages

| Route | Page |
|-------|------|
| `/` | Accueil |
| `/profil` | Profil de l'entreprise |
| `/services/particuliers` | Services pour particuliers |
| `/services/financement-temporaire` | Financement temporaire |
| `/services/consolidation-dettes` | Consolidation de dettes |
| `/services/deuxieme-chance-credit` | 2e chance au crédit |
| `/services/entreprises` | Services pour entreprises |
| `/services/eviter-faillite` | Éviter la faillite |
| `/demande-en-ligne` | Formulaire de demande |
| `/nous-joindre` | Coordonnées et formulaire de contact |
| `/politique-confidentialite` | Politique de confidentialité |
| `/admin` | Tableau de bord administrateur |

## Licence

Projet privé — Tous droits réservés © Solutions Financement Fortier
"""

readme_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'README.md')
with open(readme_path, 'w', encoding='utf-8') as f:
    f.write(content.lstrip())
print('README.md generated')
