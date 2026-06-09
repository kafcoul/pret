# Plan de refactor : Éliminer les contenus hardcodés restants

## 1. Résumé

Le site utilise déjà un système CMS via `SiteContentContext` et une table `site_content` dans Supabase. Cependant, plusieurs zones restent hardcodées dans le code :

- **FAQ** : 8 questions/réponses hardcodées
- **Statistiques** : Compteurs de performance (années, prêts approuvés, etc.)
- **Témoignages** : 4 témoignages clients hardcodés
- **Étapes du processus** : 4 étapes du workflow hardcodées
- **Configuration formulaire** : Structure complète avec ~100 lignes de config JSON
- **Données SEO** : 100+ villes québécoises pour landing pages programmatiques
- **Navigation** : Menus et liens de services hardcodés
- **Listes de propriétés** : Types de garanties acceptées

**Objectif** : Migrer ces contenus vers le CMS pour permettre l'édition sans toucher au code.

---

## 2. Architecture actuelle

### CMS existant
```typescript
// Table Supabase : site_content
{
  id: number,
  cle: string,           // ex: "accueil.hero.titre"
  valeur: string,        // Texte ou JSON stringifié
  section: string,       // Groupe logique
  libelle: string,       // Label admin
  ordre: number,         // Ordre d'affichage
  created_at: timestamp,
  updated_at: timestamp
}
```

### Hook React
```typescript
const { c } = useSiteContent();
c('cle', 'valeur par défaut')  // Retourne valeur du CMS ou fallback
```

### Éditeur admin
- Route : `/admin/content`
- Filtrage par section
- Édition en ligne avec validation
- Sauvegarde par élément ou globale
- Validation JSON pour les configs structurées

---

## 3. Zones hardcodées identifiées

### 3.1 FAQ (priorité haute)
**Fichier** : `src/components/ui/FAQ.tsx`  
**Contenu** : Tableau `faqs` avec 8 questions/réponses
```typescript
const faqs = [
  { question: "Qu'est-ce qu'un prêteur alternatif ?", answer: "..." },
  // ... 7 autres
];
```

**Impact** : Contenu éditorial fréquemment mis à jour, actuellement nécessite un redéploiement.

---

### 3.2 Statistiques (priorité haute)
**Fichier** : `src/components/ui/StatsCounter.tsx`  
**Contenu** : 4 compteurs hardcodés dans le composant
```typescript
// Probablement dans Accueil.tsx ou StatsCounter.tsx
[
  { value: 25, suffix: '+', label: 'Années d'expérience', icon: Clock },
  { value: 5000, suffix: '+', label: 'Prêts approuvés', icon: Handshake },
  { value: 250, suffix: 'M$', label: 'En financement', icon: TrendingUp },
  { value: 98, suffix: '%', label: 'Clients satisfaits', icon: Users }
]
```

**Impact** : Chiffres marketing qui évoluent annuellement.

---

### 3.3 Témoignages (priorité moyenne)
**Fichier** : `src/components/ui/Testimonials.tsx`  
**Contenu** : Tableau `DEFAULTS` avec 4 témoignages
```typescript
const DEFAULTS: Testimonial[] = [
  { name: 'Marie-Claire D.', location: 'Québec', text: "...", rating: 5, service: 'Consolidation' },
  // ... 3 autres
];
```

**Impact** : Contenu social proof qui devrait pouvoir être enrichi sans redéploiement.

---

### 3.4 Étapes du processus (priorité moyenne)
**Fichier** : `src/components/ui/ProcessSteps.tsx`  
**Contenu** : Tableau `DEFAULTS` avec 4 étapes
```typescript
const DEFAULTS = [
  { label: 'Remplissez le formulaire', description: '...' },
  { label: 'Analyse rapide', description: '...' },
  { label: 'Entente de prêt', description: '...' },
  { label: 'Recevez votre financement', description: '...' }
];
```

**Impact** : Workflow métier qui pourrait évoluer.

---

### 3.5 Configuration formulaire (priorité haute)
**Fichier** : `src/lib/demandeFormConfig.ts`  
**Contenu** : Objet complexe avec ~100 lignes
```typescript
interface DemandeFormConfig {
  steps: StepConfig[];           // 4 étapes du wizard
  sections: {...};               // Titres de sections
  fields: {...};                 // Labels et placeholders de 20+ champs
  options: {...};                // Listes déroulantes (6 types)
  review: {...};                 // Labels de révision (15+ champs)
  documents: {...};              // Liste des documents requis
  consent: {...};                // Texte de consentement
  buttons: {...};                // Labels des boutons
  success: {...};                // Messages de succès
  trustBadges: {...};            // Badges de confiance
}
```

**Statut actuel** : Déjà éditable via CMS avec clé `demande.form.config` (JSON stringifié)  
**Problème** : Interface admin non optimale pour éditer du JSON complexe

---

### 3.6 Données SEO - Villes (priorité basse)
**Fichier** : `src/data/cities.ts`  
**Contenu** : Tableau `CITIES` avec 100+ objets
```typescript
export const CITIES: City[] = [
  {
    slug: "quebec",
    name: "Québec",
    region: "Capitale-Nationale",
    population: 549459,
    distance: 25,
    lat: 46.8139,
    lng: -71.2080,
    nearby: ["levis", "beauport", "charlesbourg"]
  },
  // ... 100+ autres
];
```

**Impact** : Données SEO programmatiques, rarement modifiées mais volumineuses.

---

### 3.7 Navigation & Menus (priorité moyenne)
**Fichiers** : 
- `src/components/layout/Footer.tsx` : Liens de services hardcodés
- `src/components/layout/Header.tsx` : Menu principal (probablement)
- `src/components/layout/Navbar.tsx` : Navigation (à vérifier)

**Contenu** : Listes de liens avec labels et URLs
```typescript
// Dans Footer.tsx
<Link to="/services/particuliers">Financement pour particuliers</Link>
<Link to="/services/entreprises">Financement pour entreprises</Link>
// ... 10+ liens
```

**Impact** : Structure du site qui peut évoluer (nouveaux services, pages).

---

### 3.8 Autres composants UI (priorité basse)
- `PropertyGuaranteeList` : Types de propriétés acceptées en garantie
- `TrustBadges` : Badges de confiance/sécurité
- Textes des boutons CTA réutilisables
- Messages d'erreur génériques

---

## 4. Stratégie de migration

### Principes directeurs

1. **Minimalisme** : Ne migrer que ce qui a une vraie valeur business d'être éditable
2. **Performance** : Garder le cache Context pour éviter les requêtes répétées
3. **Fallbacks** : Toujours garder des valeurs par défaut pour la résilience
4. **Types** : Maintenir la validation TypeScript côté front
5. **UX Admin** : Interfaces adaptées au type de contenu (texte vs JSON vs tableaux)

### Approche par type de contenu

| Type | Stockage | Interface Admin | Validation |
|------|----------|-----------------|------------|
| Textes simples | `valeur: string` | Textarea | Longueur min/max |
| Listes d'items | JSON stringifié | Éditeur de liste | JSON Schema |
| Config structurée | JSON stringifié | Formulaire visuel | Zod/Yup |
| Données volumineuses | Table dédiée | Interface spécialisée | SQL contraintes |

---

## 5. Phases d'implémentation

### Phase 1 : Contenus textuels simples (2-3h)

**Objectif** : Migrer FAQ, statistiques, témoignages, étapes du processus

#### Phase 1.1 : FAQ
1. Créer le hook `useFAQ()` qui lit depuis CMS
2. Ajouter 8 entrées dans `site_content` avec clés `faq.1.question`, `faq.1.answer`, etc.
3. Modifier `FAQ.tsx` pour utiliser le hook
4. Tester en prod avec fallbacks

**Fichiers à modifier** :
- `src/lib/hooks/useFAQ.ts` (nouveau)
- `src/components/ui/FAQ.tsx`
- SQL : INSERT INTO `site_content`

**Structure CMS** :
```
section: "faq"
cle: "faq.1.question" | "faq.1.answer"
cle: "faq.2.question" | "faq.2.answer"
...
ordre: 1, 2, 3...
```

#### Phase 1.2 : Statistiques
1. Ajouter 4 entrées dans `site_content` pour les compteurs
2. Créer `useStats()` hook
3. Modifier `StatsCounter.tsx`

**Structure CMS** :
```
section: "stats"
cle: "stats.experience.valeur" | "stats.experience.label"
cle: "stats.prets.valeur" | "stats.prets.label"
cle: "stats.financement.valeur" | "stats.financement.label"
cle: "stats.satisfaction.valeur" | "stats.satisfaction.label"
```

#### Phase 1.3 : Témoignages
1. Stocker en JSON array dans une seule clé ou en entrées séparées
2. Créer `useTestimonials()` hook
3. Modifier `Testimonials.tsx`

**Option A - JSON unique** :
```
section: "temoignages"
cle: "temoignages.liste"
valeur: '[{"name":"...","text":"...","rating":5}]'
```

**Option B - Entrées séparées** (recommandé) :
```
section: "temoignages"
cle: "temoignage.1.nom" | "temoignage.1.ville" | "temoignage.1.texte" | "temoignage.1.service"
ordre: 1, 2, 3, 4
```

#### Phase 1.4 : Étapes du processus
- Déjà partiellement fait via `processus.1.titre`, `processus.1.desc`
- Vérifier que tous les defaults sont bien mappés
- Nettoyer les hardcoded `DEFAULTS` restants

---

### Phase 2 : Configuration formulaire (3-4h)

**Objectif** : Améliorer l'UX d'édition de la config JSON du formulaire de demande

#### Problème actuel
- La config est déjà dans le CMS (`demande.form.config`)
- Mais éditer ~100 lignes de JSON brut est pénible et error-prone
- La validation JSON existe mais feedback limité

#### Solution proposée
Créer une interface admin dédiée pour le formulaire :

1. **UI par sections** :
   - Onglet "Étapes du wizard" : 4 étapes, labels + descriptions
   - Onglet "Champs" : 20+ champs, labels + placeholders
   - Onglet "Options" : 6 listes déroulantes éditables
   - Onglet "Révision" : Labels de la page de révision
   - Onglet "Textes divers" : Boutons, succès, consentement

2. **Composants réutilisables** :
   - `<FieldEditor>` : Éditer label + placeholder d'un champ
   - `<OptionsEditor>` : Éditer une liste d'options (value/label)
   - `<TextEditor>` : Éditer un texte long (markdown support)

3. **Validation temps réel** :
   - Utiliser le validateur existant `validateDemandeFormConfigInput`
   - Afficher les erreurs par section
   - Bloquer la sauvegarde si invalide

4. **Preview** :
   - Bouton "Prévisualiser" qui ouvre le formulaire en modal
   - Permet de tester les changements avant sauvegarde

**Fichiers à créer** :
- `src/pages/admin/FormConfigEditor.tsx` (nouveau)
- `src/components/admin/form-config/FieldEditor.tsx`
- `src/components/admin/form-config/OptionsEditor.tsx`
- `src/components/admin/form-config/StepsEditor.tsx`

**Fichiers à modifier** :
- `src/pages/admin/ContentEditor.tsx` : Ajouter lien "Éditeur visuel" pour la clé `demande.form.config`
- `src/lib/demandeFormConfig.ts` : Export des schémas de validation

---

### Phase 3 : Navigation & Menus (2h)

**Objectif** : Rendre la structure de navigation éditable

#### Phase 3.1 : Menu Footer
1. Extraire les liens de services dans le CMS
2. Créer `useNavigation()` hook
3. Modifier `Footer.tsx`

**Structure CMS** :
```json
section: "navigation"
cle: "footer.services"
valeur: '[
  {"label":"Financement pour particuliers","to":"/services/particuliers"},
  {"label":"Financement pour entreprises","to":"/services/entreprises"},
  ...
]'
```

**Alternative - Entrées séparées** :
```
section: "navigation"
cle: "footer.service.1.label" | "footer.service.1.url"
ordre: 1, 2, 3...
```

#### Phase 3.2 : Menu principal Header
- Même approche que Footer
- Ajouter support pour sous-menus (dropdown)

**Structure avec sous-menus** :
```json
{
  "label": "Services",
  "dropdown": [
    {"label":"Particuliers","to":"/services/particuliers"},
    {"label":"Entreprises","to":"/services/entreprises"}
  ]
}
```

---

### Phase 4 : SEO - Villes (optionnel, 4-5h)

**Objectif** : Migrer les 100+ villes dans une table dédiée pour faciliter la gestion

#### Option A : Table SQL dédiée (recommandé pour volume)
```sql
CREATE TABLE seo_cities (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  population INTEGER,
  distance REAL,
  lat REAL,
  lng REAL,
  nearby TEXT[], -- Array PostgreSQL
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cities_slug ON seo_cities(slug);
CREATE INDEX idx_cities_region ON seo_cities(region);
```

**Avantages** :
- Requêtes SQL puissantes (filtres, tri, recherche)
- Contraintes d'intégrité (UNIQUE slug)
- Pagination native
- Pas de parsing JSON

**Inconvénients** :
- Nouvelle table à gérer
- Interface admin CRUD à créer

#### Option B : Garder dans `site_content` (JSON)
```
section: "seo"
cle: "cities.data"
valeur: '[{"slug":"quebec","name":"Québec",...}]' (stringifié)
```

**Avantages** :
- Réutilise l'infrastructure existante
- Pas de nouvelle table

**Inconvénients** :
- Parsing JSON côté client (performance)
- Éditeur JSON complexe
- Pas de validation SQL

#### Recommandation
Si < 100 villes → Option B  
Si > 100 villes ou ajouts fréquents → Option A

**Interface admin pour Option A** :
- Page `/admin/seo-cities` avec table triable
- Formulaire CRUD avec validation
- Import/Export CSV pour migrations en masse
- Recherche par nom/région

---

## 6. Risques & dépendances

### Risques

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Perte de contenu lors de la migration | Faible | Critique | Backups SQL avant chaque phase |
| Régression UX si fallbacks mal gérés | Moyenne | Haute | Tests E2E sur tous les composants migrés |
| Performance dégradée (trop de requêtes) | Faible | Moyenne | Cache Context existant + batching |
| Erreurs de saisie admin (JSON invalide) | Haute | Moyenne | Validation temps réel + preview |
| Conflits de merge pendant la migration | Moyenne | Faible | Branches feature par phase |

### Dépendances

- **Technique** : Aucune nouvelle bibliothèque requise (Supabase déjà en place)
- **Accès** : Droits admin Supabase pour créer/modifier tables
- **Tests** : Seed data pour environnement de dev/staging

---

## 7. Stratégie de tests

### Tests unitaires
```typescript
// src/lib/hooks/__tests__/useFAQ.test.ts
describe('useFAQ', () => {
  it('retourne les FAQs du CMS', () => {...});
  it('utilise les fallbacks si CMS vide', () => {...});
  it('trie les FAQs par ordre', () => {...});
});
```

### Tests d'intégration
```typescript
// src/components/ui/__tests__/FAQ.integration.test.tsx
describe('FAQ Component', () => {
  it('affiche les FAQs depuis le CMS', async () => {
    render(<FAQ />);
    await waitFor(() => {
      expect(screen.getByText(/Qu'est-ce qu'un prêteur/)).toBeInTheDocument();
    });
  });
});
```

### Tests E2E (Playwright/Cypress)
```typescript
test('FAQ est éditable via admin et visible sur le site', async ({ page }) => {
  // 1. Login admin
  await page.goto('/admin/login');
  // 2. Modifier une FAQ
  await page.fill('[data-testid="faq-1-question"]', 'Nouvelle question');
  await page.click('[data-testid="save-faq-1"]');
  // 3. Vérifier sur le site public
  await page.goto('/');
  await expect(page.locator('text=Nouvelle question')).toBeVisible();
});
```

### Checklist pré-production
- [ ] Backup complet de la table `site_content`
- [ ] Migration SQL testée en local et staging
- [ ] Tests E2E passés sur staging
- [ ] Validation des fallbacks (désactiver temporairement le CMS)
- [ ] Performance : temps de chargement < 2s (Lighthouse)
- [ ] Accessibilité : score WCAG AA maintenu
- [ ] SEO : Pas de régression sur pages critiques (Google Search Console)

---

## 8. Plan de déploiement

### Stratégie de rollout

**Phase 1 : Contenus textuels** (risque faible)
1. Déployer le code avec fallbacks
2. Migrer les données via SQL scripts
3. Tester en prod
4. Monitoring pendant 24h

**Phase 2 : Config formulaire** (risque moyen)
1. Feature flag pour nouvelle interface
2. Déploiement progressif (10% → 50% → 100% des admins)
3. Garder l'ancien éditeur JSON en fallback

**Phase 3 : Navigation** (risque moyen)
1. Déployer avec feature flag
2. Tester tous les liens (script automatisé)
3. Rollback facile : restaurer ancien code

**Phase 4 : SEO Villes** (risque faible, optionnel)
1. Créer nouvelle table sans toucher au code
2. Migrer données progressivement
3. Basculer le code une fois 100% migré

### Rollback plan

Pour chaque phase :
```bash
# 1. Restaurer la DB (< 5 min downtime)
psql -U postgres -d honore_db < backups/pre-migration-phase1.sql

# 2. Revert le code (Git)
git revert <commit-sha>
git push origin main

# 3. Redéployer (CI/CD automatique)
# Vercel/Netlify rebuildera automatiquement
```

---

## 9. Critères de succès

### Fonctionnels
- [ ] Tous les contenus identifiés sont éditables via l'admin sans toucher au code
- [ ] Aucune régression visuelle ou fonctionnelle sur le site public
- [ ] Les fallbacks fonctionnent si le CMS est indisponible
- [ ] L'interface admin est intuitive (testée avec 2+ admins réels)

### Techniques
- [ ] Tests unitaires : couverture > 80% sur les nouveaux hooks
- [ ] Tests E2E : couvrent tous les workflows critiques (FAQ, formulaire, navigation)
- [ ] Performance : Aucune requête > 500ms
- [ ] Lighthouse score : > 90 (Performance, Accessibility, Best Practices, SEO)

### Business
- [ ] Temps de mise à jour d'une FAQ : < 2 min (vs redéploiement actuel ~10-15 min)
- [ ] Taux d'erreur admin : < 5% (validation JSON)
- [ ] Satisfaction admin : Score NPS > 8/10

---

## 10. Estimation & priorisation

### Effort total : 11-14 heures développeur

| Phase | Priorité | Effort | Risque | Value business |
|-------|----------|--------|--------|----------------|
| Phase 1.1 : FAQ | ⚡ Haute | 2h | Faible | Haute (édito fréquent) |
| Phase 1.2 : Stats | ⚡ Haute | 1h | Faible | Moyenne (annual update) |
| Phase 1.3 : Témoignages | 🔹 Moyenne | 1.5h | Faible | Haute (social proof) |
| Phase 1.4 : Process Steps | 🔹 Moyenne | 0.5h | Faible | Faible (stable) |
| Phase 2 : Form Config | ⚡ Haute | 4h | Moyen | Haute (UX admin) |
| Phase 3 : Navigation | 🔹 Moyenne | 2h | Moyen | Moyenne (structure site) |
| Phase 4 : SEO Villes | ⚪ Basse | 5h | Faible | Faible (rarement modifié) |

### Roadmap suggérée

**Sprint 1 (1 semaine)** :
- Phase 1.1 + 1.2 + 1.3 (FAQ + Stats + Témoignages)
- Déploiement en prod avec monitoring

**Sprint 2 (1 semaine)** :
- Phase 2 (Form Config Editor)
- Tests intensifs avec les admins

**Sprint 3 (optionnel)** :
- Phase 3 (Navigation)
- Phase 4 si besoin business confirmé

---

## 11. Checklist de démarrage

Avant de commencer la Phase 1 :

### Environnement
- [ ] Accès Supabase avec droits INSERT/UPDATE sur `site_content`
- [ ] Base de données de staging avec seed data
- [ ] Branch Git `feature/cms-refactor-phase1`

### Code
- [ ] Lire `src/lib/SiteContentContext.tsx` pour comprendre le cache
- [ ] Vérifier la validation JSON existante dans `ContentEditor.tsx`
- [ ] Documenter le schéma actuel de `site_content` (colonnes, contraintes)

### Tests
- [ ] Setup Vitest/Jest si pas déjà en place
- [ ] Setup Playwright/Cypress pour tests E2E
- [ ] Créer fixtures pour les tests (mock Supabase)

### Backup
- [ ] Export SQL complet de `site_content` : `pg_dump --table=site_content > backup.sql`
- [ ] Commit Git propre avant toute modification

---

## 12. Ressources & références

### Documentation externe
- [Supabase Realtime](https://supabase.com/docs/guides/realtime) - Pour invalidation cache
- [React Query](https://tanstack.com/query/latest) - Si besoin de remplacer le Context
- [JSON Schema](https://json-schema.org/) - Pour validation config complexe

### Fichiers clés à comprendre
```
src/lib/SiteContentContext.tsx      # Cœur du système CMS
src/pages/admin/ContentEditor.tsx   # Interface admin actuelle
src/lib/demandeFormConfig.ts        # Config JSON la plus complexe
src/components/ui/FAQ.tsx            # Exemple de composant à migrer
```

### Exemples de patterns
```typescript
// Pattern 1 : Hook custom pour contenu structuré
export function useFAQ() {
  const { c } = useSiteContent();
  return useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      question: c(`faq.${i + 1}.question`, DEFAULT_FAQS[i].question),
      answer: c(`faq.${i + 1}.answer`, DEFAULT_FAQS[i].answer),
    })),
    [c]
  );
}

// Pattern 2 : Hook avec parsing JSON
export function useNavigation() {
  const { c } = useSiteContent();
  const jsonString = c('footer.services', '[]');
  return useMemo(() => {
    try {
      return JSON.parse(jsonString) as NavLink[];
    } catch {
      return DEFAULT_NAV_LINKS;
    }
  }, [jsonString]);
}
```

---

## Conclusion

Ce plan découpe le refactor en phases incrémentales, chacune déployable indépendamment. La priorité est donnée aux contenus éditoriaux fréquemment modifiés (FAQ, stats, témoignages) avant les configurations techniques.

La stratégie de fallbacks garantit la résilience, et les tests E2E préviennent les régressions. L'effort total est raisonnable (11-14h) pour un gain business significatif : réduction du temps de mise à jour de 15 min → 2 min.

**Prochaine étape** : Valider les priorités avec le PO, puis démarrer Phase 1.1 (FAQ).
