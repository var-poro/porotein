import { test, expect } from '@playwright/test';

test.describe('Timer Component', () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers la page d'accueil
    await page.goto('/');
    
    // Attendre que l'application soit chargée
    await page.waitForLoadState('networkidle');
  });

  test('should display timer in exercise view', async ({ page }) => {
    // Cliquer sur le bouton pour démarrer un exercice
    const startButton = page.getByRole('button', { name: /démarrer/i });
    await startButton.click();

    // Attendre que le timer soit visible
    const timerInput = page.getByRole('textbox', { name: 'Temps restant' });
    await expect(timerInput).toBeVisible();
    await expect(timerInput).toHaveValue('00:00');
  });

  test('should start timer when play button is clicked', async ({ page }) => {
    // Démarrer un exercice
    const startButton = page.getByRole('button', { name: /démarrer/i });
    await startButton.click();

    // Attendre que le timer soit visible
    const timerInput = page.getByRole('textbox', { name: 'Temps restant' });
    await expect(timerInput).toBeVisible();

    // Cliquer sur le bouton play
    const playButton = page.getByRole('button', { name: 'Démarrer le timer' });
    await playButton.click();

    // Vérifier que le bouton pause est visible
    const pauseButton = page.getByRole('button', { name: 'Mettre en pause' });
    await expect(pauseButton).toBeVisible();
  });

  test('should pause timer when pause button is clicked', async ({ page }) => {
    // Démarrer un exercice
    const startButton = page.getByRole('button', { name: /démarrer/i });
    await startButton.click();

    // Attendre que le timer soit visible
    const timerInput = page.getByRole('textbox', { name: 'Temps restant' });
    await expect(timerInput).toBeVisible();

    // Démarrer le timer
    const playButton = page.getByRole('button', { name: 'Démarrer le timer' });
    await playButton.click();

    // Mettre en pause
    const pauseButton = page.getByRole('button', { name: 'Mettre en pause' });
    await pauseButton.click();

    // Vérifier que le bouton play est visible
    await expect(playButton).toBeVisible();
  });

  test('should reset timer when reset button is clicked', async ({ page }) => {
    // Démarrer un exercice
    const startButton = page.getByRole('button', { name: /démarrer/i });
    await startButton.click();

    // Attendre que le timer soit visible
    const timerInput = page.getByRole('textbox', { name: 'Temps restant' });
    await expect(timerInput).toBeVisible();

    // Démarrer le timer
    const playButton = page.getByRole('button', { name: 'Démarrer le timer' });
    await playButton.click();

    // Mettre en pause
    const pauseButton = page.getByRole('button', { name: 'Mettre en pause' });
    await pauseButton.click();

    // Réinitialiser
    const resetButton = page.getByRole('button', { name: 'Réinitialiser le timer' });
    await resetButton.click();

    // Vérifier que le timer est réinitialisé
    await expect(timerInput).toHaveValue('00:00');
  });
}); 