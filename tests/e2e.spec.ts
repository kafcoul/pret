import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.solutionsfortier.com';

// ─────────────────────────────────────────────
// Pages principales
// ─────────────────────────────────────────────
test.describe('Pages principales', () => {
  test('Accueil charge correctement', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Fortier|Solutions/i);
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('Services particuliers accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/services-particuliers`);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page).not.toHaveURL(/404|not-found/i);
  });

  test('Services entreprises accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/services-entreprises`);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page).not.toHaveURL(/404|not-found/i);
  });

  test('FAQ accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/faq`);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Calculateur de prêt accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/calculateur-pret`);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Demande en ligne accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/demande-en-ligne`);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Page 404 affichée pour URL inconnue', async ({ page }) => {
    await page.goto(`${BASE_URL}/page-qui-nexiste-pas-vraiment-xyz`);
    // Attendre que React hydrate et affiche la page 404
    await expect(page.locator('h1, div').filter({ hasText: /introuvable|404/i }).first()).toBeVisible({ timeout: 10000 });
  });
});

// ─────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────
test.describe('Navigation', () => {
  test('Liens du menu fonctionnent', async ({ page }) => {
    await page.goto(BASE_URL);
    const navLinks = page.locator('nav a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(3);
  });

  test('Logo/lien accueil fonctionne', async ({ page }) => {
    await page.goto(`${BASE_URL}/faq`);
    const logo = page.locator('nav a[href="/"], header a[href="/"]').first();
    if (await logo.count() > 0) {
      await logo.click();
      await expect(page).toHaveURL(/solutionsfortier\.com\/?$/);
    }
  });
});

// ─────────────────────────────────────────────
// Formulaire de contact
// ─────────────────────────────────────────────
test.describe('Formulaire de contact', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/nous-joindre`);
    // Sélecteur précis : le formulaire de contact a l'attribut novalidate
    await expect(page.locator('form[novalidate]')).toBeVisible({ timeout: 10000 });
  });

  test('Le formulaire est présent et les champs visibles', async ({ page }) => {
    await expect(page.locator('[name="prenom"]')).toBeVisible();
    await expect(page.locator('[name="nom"]')).toBeVisible();
    await expect(page.locator('[name="courriel"]')).toBeVisible();
    await expect(page.locator('[name="message"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /envoyer/i })).toBeVisible();
  });

  test('Validation côté client — champs vides', async ({ page }) => {
    await page.getByRole('button', { name: /envoyer/i }).click();
    // Au moins une erreur de validation doit apparaître
    const errors = page.locator('text=/requis|required/i');
    await expect(errors.first()).toBeVisible({ timeout: 3000 });
  });

  test('Validation courriel invalide', async ({ page }) => {
    await page.fill('[name="prenom"]', 'Jean');
    await page.fill('[name="nom"]', 'Test');
    await page.fill('[name="courriel"]', 'pas-un-courriel');
    await page.fill('[name="message"]', 'Message test');
    await page.getByRole('button', { name: /envoyer/i }).click();
    await expect(page.locator('text=/courriel invalide/i')).toBeVisible({ timeout: 3000 });
  });

  test('Soumission réussie du formulaire', async ({ page }) => {
    await page.fill('[name="prenom"]', 'Test');
    await page.fill('[name="nom"]', 'E2E');
    await page.fill('[name="courriel"]', 'test-e2e@example.com');
    await page.fill('[name="message"]', 'Test automatique Playwright — veuillez ignorer ce message.');
    await page.getByRole('button', { name: /envoyer/i }).click();

    // Succès OU erreur explicite (pas le message générique)
    const success = page.locator('text=/message envoyé|succès/i');
    const rateLimitErr = page.locator('text=/trop de messages|patienter/i');
    const genericErr = page.locator('text=/serveur a rencontré une erreur/i');

    await expect(success.or(rateLimitErr).first()).toBeVisible({ timeout: 20000 });
    // Le message générique ne doit PAS apparaître
    await expect(genericErr).not.toBeVisible();
  });
});

// ─────────────────────────────────────────────
// Performance & SEO de base
// ─────────────────────────────────────────────
test.describe('SEO & accessibilité de base', () => {
  test('Meta description présente sur accueil', async ({ page }) => {
    await page.goto(BASE_URL);
    const meta = await page.$('meta[name="description"]');
    expect(meta).not.toBeNull();
    const content = await meta?.getAttribute('content');
    expect(content?.length).toBeGreaterThan(10);
  });

  test('Balises h1 présentes sur les pages principales', async ({ page }) => {
    const pages = ['/', '/services-particuliers', '/nous-joindre', '/faq'];
    for (const path of pages) {
      await page.goto(`${BASE_URL}${path}`);
      const h1 = page.locator('h1');
      await expect(h1.first()).toBeVisible({ timeout: 8000 });
    }
  });

  test('Aucune erreur console critique sur accueil', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    const critical = errors.filter(e => !/favicon|analytics/i.test(e));
    expect(critical).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────
// Formulaire de demande de prêt (wizard 4 étapes)
// ─────────────────────────────────────────────
test.describe('Formulaire de demande de prêt', () => {
  const URL_DEMANDE = `${BASE_URL}/demande-en-ligne`;

  // Helpers pour remplir chaque étape
  async function remplirEtape1(page: import('@playwright/test').Page) {
    await page.fill('[name="prenom"]', 'Marie');
    await page.fill('[name="nom"]', 'Tremblay');
    await page.fill('[name="telephone"]', '450 555-1234');
    await page.fill('[name="courriel"]', 'marie.test-e2e@example.com');
    await page.fill('[name="ville"]', 'Lévis');
  }

  async function remplirEtape2(page: import('@playwright/test').Page) {
    await page.selectOption('[name="typeFinancement"]', 'consolidation-dettes');
    await page.fill('[name="montantSouhaite"]', '75000');
    await page.selectOption('[name="situationEmploi"]', 'salarie');
  }

  async function remplirEtape3(page: import('@playwright/test').Page) {
    await page.selectOption('[name="typePropriete"]', 'maison-unifamiliale');
    await page.fill('[name="valeurPropriete"]', '320000');
    await page.fill('[name="soldeHypothecaire"]', '150000');
  }

  test.beforeEach(async ({ page }) => {
    await page.goto(URL_DEMANDE);
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    // Étape 1 doit être visible
    await expect(page.locator('[name="prenom"]')).toBeVisible();
  });

  // ── Présence et structure ──────────────────────────────────

  test('Étape 1 — champs coordonnées présents', async ({ page }) => {
    await expect(page.locator('[name="prenom"]')).toBeVisible();
    await expect(page.locator('[name="nom"]')).toBeVisible();
    await expect(page.locator('[name="telephone"]')).toBeVisible();
    await expect(page.locator('[name="courriel"]')).toBeVisible();
    await expect(page.locator('[name="ville"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /suivant/i })).toBeVisible();
  });

  // ── Validation step 1 ─────────────────────────────────────

  test('Validation étape 1 — champs obligatoires vides', async ({ page }) => {
    await page.getByRole('button', { name: /suivant/i }).click();
    // Des erreurs de validation doivent apparaître
    const erreurs = page.locator('[role="alert"]');
    await expect(erreurs.first()).toBeVisible({ timeout: 3000 });
    // On reste bien à l'étape 1
    await expect(page.locator('[name="prenom"]')).toBeVisible();
  });

  test('Validation étape 1 — courriel invalide', async ({ page }) => {
    await page.fill('[name="prenom"]', 'Jean');
    await page.fill('[name="nom"]', 'Test');
    await page.fill('[name="telephone"]', '514 000-0000');
    await page.fill('[name="courriel"]', 'courriel-invalide');
    await page.fill('[name="ville"]', 'Montréal');
    await page.getByRole('button', { name: /suivant/i }).click();
    await expect(page.locator('text=/courriel invalide/i')).toBeVisible({ timeout: 3000 });
  });

  test('Validation étape 1 — téléphone invalide', async ({ page }) => {
    await page.fill('[name="prenom"]', 'Jean');
    await page.fill('[name="nom"]', 'Test');
    await page.fill('[name="telephone"]', 'abc');
    await page.fill('[name="courriel"]', 'jean@test.com');
    await page.fill('[name="ville"]', 'Québec');
    await page.getByRole('button', { name: /suivant/i }).click();
    await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 3000 });
  });

  // ── Navigation entre étapes ────────────────────────────────

  test('Navigation — étape 1 → étape 2 après champs valides', async ({ page }) => {
    await remplirEtape1(page);
    await page.getByRole('button', { name: /suivant/i }).click();
    // L'étape 2 doit s'afficher (champ typeFinancement visible)
    await expect(page.locator('[name="typeFinancement"]')).toBeVisible({ timeout: 5000 });
  });

  test('Navigation — bouton Précédent revient à l\'étape 1', async ({ page }) => {
    await remplirEtape1(page);
    await page.getByRole('button', { name: /suivant/i }).click();
    await expect(page.locator('[name="typeFinancement"]')).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: /précédent/i }).click();
    await expect(page.locator('[name="prenom"]')).toBeVisible({ timeout: 3000 });
  });

  // ── Validation step 2 ─────────────────────────────────────

  test('Validation étape 2 — financement incomplet', async ({ page }) => {
    await remplirEtape1(page);
    await page.getByRole('button', { name: /suivant/i }).click();
    await expect(page.locator('[name="typeFinancement"]')).toBeVisible({ timeout: 5000 });
    // Cliquer Suivant sans remplir l'étape 2
    await page.getByRole('button', { name: /suivant/i }).click();
    await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 3000 });
    // On reste à l'étape 2
    await expect(page.locator('[name="typeFinancement"]')).toBeVisible();
  });

  // ── Validation step 3 ─────────────────────────────────────

  test('Validation étape 3 — propriété incomplète', async ({ page }) => {
    await remplirEtape1(page);
    await page.getByRole('button', { name: /suivant/i }).click();
    await expect(page.locator('[name="typeFinancement"]')).toBeVisible({ timeout: 5000 });
    await remplirEtape2(page);
    await page.getByRole('button', { name: /suivant/i }).click();
    await expect(page.locator('[name="typePropriete"]')).toBeVisible({ timeout: 5000 });
    // Cliquer Suivant sans remplir l'étape 3
    await page.getByRole('button', { name: /suivant/i }).click();
    await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 3000 });
  });

  // ── Validation step 4 — consentement ─────────────────────

  test('Validation étape 4 — consentement requis', async ({ page }) => {
    await remplirEtape1(page);
    await page.getByRole('button', { name: /suivant/i }).click();
    await expect(page.locator('[name="typeFinancement"]')).toBeVisible({ timeout: 5000 });
    await remplirEtape2(page);
    await page.getByRole('button', { name: /suivant/i }).click();
    await expect(page.locator('[name="typePropriete"]')).toBeVisible({ timeout: 5000 });
    await remplirEtape3(page);
    await page.getByRole('button', { name: /suivant/i }).click();
    // Étape 4 — révision
    await expect(page.getByRole('button', { name: /soumettre/i })).toBeVisible({ timeout: 5000 });
    // Soumettre sans cocher le consentement
    await page.getByRole('button', { name: /soumettre/i }).click();
    await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 3000 });
  });

  // ── Résumé à l'étape 4 ────────────────────────────────────

  test('Résumé étape 4 — données saisies affichées', async ({ page }) => {
    await remplirEtape1(page);
    await page.getByRole('button', { name: /suivant/i }).click();
    await expect(page.locator('[name="typeFinancement"]')).toBeVisible({ timeout: 5000 });
    await remplirEtape2(page);
    await page.getByRole('button', { name: /suivant/i }).click();
    await expect(page.locator('[name="typePropriete"]')).toBeVisible({ timeout: 5000 });
    await remplirEtape3(page);
    await page.getByRole('button', { name: /suivant/i }).click();
    // Vérifier que le résumé affiche le nom et le type de financement
    await expect(page.locator('text=/Marie Tremblay/i')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=/consolidation/i').first()).toBeVisible();
    await expect(page.locator('text=/Maison unifamiliale/i').first()).toBeVisible();
  });

  // ── Soumission complète ───────────────────────────────────

  test('Soumission complète — redirige vers page de confirmation ou erreur explicite', async ({ page }) => {
    await remplirEtape1(page);
    await page.getByRole('button', { name: /suivant/i }).click();
    await expect(page.locator('[name="typeFinancement"]')).toBeVisible({ timeout: 5000 });
    await remplirEtape2(page);
    await page.getByRole('button', { name: /suivant/i }).click();
    await expect(page.locator('[name="typePropriete"]')).toBeVisible({ timeout: 5000 });
    await remplirEtape3(page);
    await page.getByRole('button', { name: /suivant/i }).click();
    await expect(page.getByRole('button', { name: /soumettre/i })).toBeVisible({ timeout: 5000 });
    await page.check('[name="consentement"]');
    await page.getByRole('button', { name: /soumettre/i }).click();

    // Soit redirection vers /demande-confirmation, soit erreur explicite (429 etc.)
    const redirected = page.waitForURL('**/demande-confirmation', { timeout: 20000 }).then(() => true).catch(() => false);
    const erreurExplicite = page.locator('text=/patienter|spécialiste|réessayer/i');
    const erreurGenerique = page.locator('text=/une erreur est survenue/i');

    const didRedirect = await redirected;
    if (didRedirect) {
      await expect(page.locator('text=/Demande reçue|Merci/i').first()).toBeVisible({ timeout: 5000 });
    } else {
      await expect(erreurExplicite.first()).toBeVisible({ timeout: 5000 });
    }
    await expect(erreurGenerique).not.toBeVisible();
  });
});
