import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('should display login form with all elements', async ({ page }) => {
    // Vérifier le titre
    await expect(page.getByRole('heading', { name: 'Quel plaisir de te revoir' })).toBeVisible();

    // Vérifier les champs de formulaire
    await expect(page.getByLabel('Identifiant')).toBeVisible();
    await expect(page.getByLabel('Mot de passe')).toBeVisible();

    // Vérifier les boutons
    await expect(page.getByRole('button', { name: 'Connexion' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Se connecter sans mot de passe' })).toBeVisible();

    // Vérifier les liens
    await expect(page.getByRole('button', { name: 'Mot de passe oublié ?' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Créer un compte' })).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Cliquer sur le bouton de connexion sans remplir les champs
    await page.getByRole('button', { name: 'Connexion' }).click();

    // Vérifier les messages d'erreur
    await expect(page.getByText('Ce champ est obligatoire')).toHaveCount(2);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Remplir le formulaire avec des identifiants invalides
    await page.getByLabel('Identifiant').fill('wronguser');
    await page.getByLabel('Mot de passe').fill('wrongpass');
    await page.getByRole('button', { name: 'Connexion' }).click();

    // Attendre que le toast de chargement disparaisse
    await page.waitForTimeout(1000);

    // Attendre que le toast d'erreur apparaisse
    await expect(page.locator('[role="status"]')).toContainText("L'identifiant ou le mot de passe est incorrect.");
  });

  test('should navigate to register page', async ({ page }) => {
    // Cliquer sur le lien d'inscription
    await page.getByRole('button', { name: 'Créer un compte' }).click();

    // Vérifier la redirection
    await expect(page).toHaveURL('/register');
  });

  test('should navigate to forgot password page', async ({ page }) => {
    // Cliquer sur le lien de mot de passe oublié
    await page.getByRole('button', { name: 'Mot de passe oublié ?' }).click();

    // Vérifier la redirection
    await expect(page).toHaveURL('/forgot-password');
  });

  test('should validate email format for magic link', async ({ page }) => {
    // Remplir l'email avec un format invalide
    await page.getByLabel('Identifiant').fill('invalid-email');
    
    // Cliquer sur le bouton de connexion sans mot de passe
    await page.getByRole('button', { name: 'Se connecter sans mot de passe' }).click();

    // Vérifier le message d'erreur
    await expect(page.getByText('Format d\'email invalide')).toBeVisible();
  });

  test('should handle magic link login', async ({ page }) => {
    // Remplir l'email
    await page.getByLabel('Identifiant').fill('testuser@example.com');
    
    // Cliquer sur le bouton de connexion sans mot de passe
    await page.getByRole('button', { name: 'Se connecter sans mot de passe' }).click();

    // Attendre que le toast de chargement disparaisse
    await page.waitForTimeout(1000);

    // Attendre que le toast de succès apparaisse
    await expect(page.locator('[role="status"]')).toContainText('Email envoyé avec succès !');

    // Vérifier que la page de confirmation est visible
    await expect(page.getByRole('heading', { name: 'Email envoyé !' })).toBeVisible();
    await expect(page.getByText('Un lien de connexion a été envoyé à votre adresse email')).toBeVisible();
    await expect(page.getByText(/Vous pourrez en demander un nouveau dans \d+ secondes/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Retour à la connexion' })).toBeVisible();
  });

  test('should prevent access to protected routes without authentication', async ({ page }) => {
    // Essayer d'accéder à une route protégée
    await page.goto('/');
    
    // Vérifier la redirection vers la page de login
    await expect(page).toHaveURL('/login');
  });

  test('should disable form during loading state', async ({ page }) => {
    // Intercepter la requête de login pour la retarder
    await page.route('**/api/auth/login', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre 1 seconde
      await route.continue();
    });

    // Remplir le formulaire avec des identifiants valides
    await page.getByLabel('Identifiant').fill('testuser@example.com');
    await page.getByLabel('Mot de passe').fill('password123');
    
    // Cliquer sur le bouton de connexion
    await page.getByRole('button', { name: 'Connexion' }).click();

    // Vérifier que les champs sont désactivés
    await expect(page.getByLabel('Identifiant')).toBeDisabled();
    await expect(page.getByLabel('Mot de passe')).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Connexion...' })).toBeDisabled();
  });

  test('should disable magic link button during sending', async ({ page }) => {
    // Intercepter la requête de magic link pour la retarder
    await page.route('**/api/auth/magic-link', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre 1 seconde
      await route.continue();
    });

    // Remplir l'email
    await page.getByLabel('Identifiant').fill('testuser@example.com');
    
    // Cliquer sur le bouton de connexion sans mot de passe
    await page.getByRole('button', { name: 'Se connecter sans mot de passe' }).click();

    // Vérifier que le bouton est désactivé pendant l'envoi
    await expect(page.getByRole('button', { name: 'Se connecter sans mot de passe' })).toBeDisabled();
  });

  test('should redirect to home page after successful login', async ({ page }) => {
    // Remplir le formulaire avec des identifiants valides
    await page.getByLabel('Identifiant').fill('testuser@example.com');
    await page.getByLabel('Mot de passe').fill('password123');
    await page.getByRole('button', { name: 'Connexion' }).click();

    // Vérifier la redirection vers la page d'accueil
    await expect(page).toHaveURL('/');
  });

  test('should handle browser back button correctly', async ({ page }) => {
    // Remplir le formulaire avec des identifiants valides
    await page.getByLabel('Identifiant').fill('testuser@example.com');
    await page.getByLabel('Mot de passe').fill('password123');
    await page.getByRole('button', { name: 'Connexion' }).click();

    // Attendre la redirection vers la page d'accueil
    await expect(page).toHaveURL('/');

    // Cliquer sur le bouton retour du navigateur
    await page.goBack();

    // Vérifier que nous sommes redirigés vers la page de login
    await expect(page).toHaveURL('/login');
  });

  test('should persist login state after page reload', async ({ page }) => {
    // Remplir le formulaire avec des identifiants valides
    await page.getByLabel('Identifiant').fill('testuser@example.com');
    await page.getByLabel('Mot de passe').fill('password123');
    await page.getByRole('button', { name: 'Connexion' }).click();

    // Attendre la redirection vers la page d'accueil
    await expect(page).toHaveURL('/');

    // Recharger la page
    await page.reload();

    // Vérifier que nous sommes toujours sur la page d'accueil
    await expect(page).toHaveURL('/');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simuler une erreur réseau en interrompant la connexion
    await page.route('**/api/auth/login', route => route.abort('failed'));
    
    // Remplir le formulaire avec des identifiants valides
    await page.getByLabel('Identifiant').fill('testuser@example.com');
    await page.getByLabel('Mot de passe').fill('password123');
    await page.getByRole('button', { name: 'Connexion' }).click();

    // Vérifier le message d'erreur
    await expect(page.locator('[role="status"]')).toContainText('Une erreur est survenue. Veuillez réessayer.');
  });

  test.describe('Registration', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/register');
      await page.waitForLoadState('networkidle');
    });

    test('should display registration form with all elements', async ({ page }) => {
      // Vérifier le titre
      await expect(page.getByRole('heading', { name: 'Créer un compte' })).toBeVisible();

      // Vérifier les champs de formulaire
      await expect(page.getByLabel('Nom d\'utilisateur')).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Mot de passe')).toBeVisible();

      // Vérifier les boutons
      await expect(page.getByRole('button', { name: 'S\'inscrire' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Connecte-toi' })).toBeVisible();
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      // Cliquer sur le bouton d'inscription sans remplir les champs
      await page.getByRole('button', { name: 'S\'inscrire' }).click();

      // Vérifier les messages d'erreur
      await expect(page.getByText('Ce champ est obligatoire')).toHaveCount(3);
    });

    test('should validate email format', async ({ page }) => {
      // Remplir le formulaire avec un email invalide
      await page.getByLabel('Nom d\'utilisateur').fill('testuser');
      await page.getByLabel('Email').fill('invalid-email');
      await page.getByLabel('Mot de passe').fill('password123');
      await page.getByRole('button', { name: 'S\'inscrire' }).click();

      // Vérifier le message d'erreur
      await expect(page.getByText('Adresse email invalide')).toBeVisible();
    });

    test('should disable form during loading state', async ({ page }) => {
      // Intercepter la requête d'inscription pour la retarder
      await page.route('**/api/auth/register', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre 1 seconde
        await route.continue();
      });

      // Remplir le formulaire avec des données valides
      await page.getByLabel('Nom d\'utilisateur').fill('testuser');
      await page.getByLabel('Email').fill('testuser@example.com');
      await page.getByLabel('Mot de passe').fill('password123');
      
      // Cliquer sur le bouton d'inscription et vérifier l'état désactivé
      await Promise.all([
        page.getByRole('button', { name: 'S\'inscrire' }).click(),
        expect(page.getByLabel('Nom d\'utilisateur')).toBeDisabled(),
        expect(page.getByLabel('Email')).toBeDisabled(),
        expect(page.getByLabel('Mot de passe')).toBeDisabled(),
        expect(page.getByRole('button', { name: 'Inscription...' })).toBeDisabled()
      ]);
    });

    test('should show success message after registration', async ({ page }) => {
      // Remplir le formulaire avec des données valides
      await page.getByLabel('Nom d\'utilisateur').fill('testuser');
      await page.getByLabel('Email').fill('testuser@example.com');
      await page.getByLabel('Mot de passe').fill('password123');
      await page.getByRole('button', { name: 'S\'inscrire' }).click();

      // Vérifier le message de succès
      await expect(page.getByRole('heading', { name: 'Inscription réussie !' })).toBeVisible();
      await expect(page.getByText('Un email de confirmation a été envoyé à votre adresse email')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Retour à la connexion' })).toBeVisible();
    });

    test('should navigate to login page from success message', async ({ page }) => {
      // Remplir le formulaire avec des données valides
      await page.getByLabel('Nom d\'utilisateur').fill('testuser');
      await page.getByLabel('Email').fill('testuser@example.com');
      await page.getByLabel('Mot de passe').fill('password123');
      await page.getByRole('button', { name: 'S\'inscrire' }).click();

      // Cliquer sur le bouton retour à la connexion
      await page.getByRole('button', { name: 'Retour à la connexion' }).click();

      // Vérifier la redirection
      await expect(page).toHaveURL('/login');
    });

    test('should navigate to login page from registration form', async ({ page }) => {
      // Cliquer sur le lien de connexion
      await page.getByRole('button', { name: 'Connecte-toi' }).click();

      // Vérifier la redirection
      await expect(page).toHaveURL('/login');
    });

    test('should handle network errors gracefully', async ({ page }) => {
      // Simuler une erreur réseau en interrompant la connexion
      await page.route('**/api/auth/register', route => route.abort('failed'));
      
      // Remplir le formulaire avec des données valides
      await page.getByLabel('Nom d\'utilisateur').fill('testuser');
      await page.getByLabel('Email').fill('testuser@example.com');
      await page.getByLabel('Mot de passe').fill('password123');
      await page.getByRole('button', { name: 'S\'inscrire' }).click();

      // Vérifier le message d'erreur
      await expect(page.locator('[role="status"]')).toContainText('Une erreur est survenue. Veuillez réessayer.');
    });
  });
}); 