import { test, expect } from '@playwright/test';

test.describe('Notifications and Error Messages', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL('/users');
  });

  test('should show success notification when creating user', async ({ page }) => {
    // Create a new user
    await page.getByRole('button', { name: 'Add User' }).click();
    await page.getByLabel('Username').fill(`testuser${Date.now()}`);
    await page.getByLabel('Email').fill(`test${Date.now()}@example.com`);
    await page.getByLabel('Password').fill('testpass123');
    await page.getByRole('button', { name: 'Create' }).click();

    // Verify success notification
    await expect(page.getByText('User created successfully')).toBeVisible();
  });

  test('should show error notification when creating user with invalid data', async ({ page }) => {
    // Try to create user without required fields
    await page.getByRole('button', { name: 'Add User' }).click();
    await page.getByRole('button', { name: 'Create' }).click();

    // Verify error notification
    await expect(page.getByText('Failed to create user')).toBeVisible();
  });

  test('should show success notification when resending activation email', async ({ page }) => {
    // Click resend activation button
    await page.getByRole('button', { name: 'Resend activation' }).first().click();

    // Verify success notification
    await expect(page.getByText('Email d\'activation envoyé avec succès')).toBeVisible();
  });

  test('should show error notification when resending activation email too frequently', async ({ page }) => {
    // Click resend activation button twice
    await page.getByRole('button', { name: 'Resend activation' }).first().click();
    await page.getByRole('button', { name: 'Resend activation' }).first().click();

    // Verify error notification
    await expect(page.getByText('Un email a déjà été envoyé récemment')).toBeVisible();
  });

  test('should show success notification when resetting password', async ({ page }) => {
    // Click reset password button
    await page.getByRole('button', { name: 'Reset password' }).first().click();

    // Verify success notification
    await expect(page.getByText('Email de réinitialisation envoyé avec succès')).toBeVisible();
  });

  test('should show error notification when resetting password too frequently', async ({ page }) => {
    // Click reset password button twice
    await page.getByRole('button', { name: 'Reset password' }).first().click();
    await page.getByRole('button', { name: 'Reset password' }).first().click();

    // Verify error notification
    await expect(page.getByText('Un email a déjà été envoyé récemment')).toBeVisible();
  });

  test('should show success notification when restoring user', async ({ page }) => {
    // Delete a user
    await page.getByRole('button', { name: 'Delete' }).first().click();

    // Click restore button
    await page.getByRole('button', { name: 'Annuler' }).click();

    // Verify success notification
    await expect(page.getByText('User restored successfully')).toBeVisible();
  });

  test('should show error notification when network is offline', async ({ page }) => {
    // Simulate offline mode
    await page.route('**/*', (route) => route.abort('failed'));

    // Try to perform an action
    await page.getByRole('button', { name: 'Add User' }).click();

    // Verify error notification
    await expect(page.getByText('Network error')).toBeVisible();
  });

  test('should show error notification for server errors', async ({ page }) => {
    // Simulate server error
    await page.route('**/api/users', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ message: 'Internal server error' })
      });
    });

    // Try to perform an action
    await page.getByRole('button', { name: 'Add User' }).click();

    // Verify error notification
    await expect(page.getByText('Internal server error')).toBeVisible();
  });
}); 