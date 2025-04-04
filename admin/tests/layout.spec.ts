import { test, expect } from '@playwright/test';

test.describe('Layout and Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL('/users');
  });

  test('should display navbar with all sections', async ({ page }) => {
    // Check if all navigation items are visible
    await expect(page.getByRole('link', { name: 'Users' })).toBeVisible();
  });

  test('should toggle navbar collapse', async ({ page }) => {
    // Click collapse button
    await page.getByRole('button', { name: 'Toggle sidebar' }).click();

    // Verify navbar is collapsed
    await expect(page.getByRole('navigation')).toHaveClass(/collapsed/);

    // Click expand button
    await page.getByRole('button', { name: 'Toggle sidebar' }).click();

    // Verify navbar is expanded
    await expect(page.getByRole('navigation')).not.toHaveClass(/collapsed/);
  });

  test('should toggle dark mode', async ({ page }) => {
    // Click dark mode toggle
    await page.getByRole('button', { name: 'Toggle dark mode' }).click();

    // Verify dark mode is active
    await expect(page.locator('body')).toHaveClass(/dark/);

    // Click light mode toggle
    await page.getByRole('button', { name: 'Toggle dark mode' }).click();

    // Verify light mode is active
    await expect(page.locator('body')).not.toHaveClass(/dark/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify navbar is collapsed by default
    await expect(page.getByRole('navigation')).toHaveClass(/collapsed/);

    // Click burger menu
    await page.getByRole('button', { name: 'Toggle navigation' }).click();

    // Verify navbar is expanded
    await expect(page.getByRole('navigation')).not.toHaveClass(/collapsed/);
  });

  test('should show loading state', async ({ page }) => {
    // Navigate to a page that loads data
    await page.goto('/users');

    // Verify loading overlay is visible
    await expect(page.getByRole('progressbar')).toBeVisible();

    // Wait for loading to complete
    await expect(page.getByRole('progressbar')).not.toBeVisible();
  });

  test('should handle navigation errors', async ({ page }) => {
    // Try to navigate to a non-existent route
    await page.goto('/non-existent');

    // Should redirect to users page
    await expect(page).toHaveURL('/users');
  });
}); 