import { test, expect } from '@playwright/test';

test.describe('Users Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL('/users');
  });

  test('should display users table', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Username' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Role' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Created' })).toBeVisible();
  });

  test('should create new user', async ({ page }) => {
    const testUser = {
      username: `testuser${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      password: 'testpass123'
    };

    // Click add user button
    await page.getByRole('button', { name: 'Add User' }).click();

    // Fill the form
    await page.getByLabel('Username').fill(testUser.username);
    await page.getByLabel('Email').fill(testUser.email);
    await page.getByLabel('Password').fill(testUser.password);

    // Submit the form
    await page.getByRole('button', { name: 'Create' }).click();

    // Verify success message
    await expect(page.getByText('User created successfully')).toBeVisible();

    // Verify user appears in table
    await expect(page.getByText(testUser.username)).toBeVisible();
    await expect(page.getByText(testUser.email)).toBeVisible();
  });

  test('should edit user', async ({ page }) => {
    const newUsername = `editeduser${Date.now()}`;

    // Click edit button on first user
    await page.getByRole('button', { name: 'Edit' }).first().click();

    // Update username
    await page.getByLabel('Username').fill(newUsername);
    await page.getByRole('button', { name: 'Update' }).click();

    // Verify changes
    await expect(page.getByText(newUsername)).toBeVisible();
  });

  test('should delete user', async ({ page }) => {
    // Click delete button on first user
    await page.getByRole('button', { name: 'Delete' }).first().click();

    // Verify deletion message
    await expect(page.getByText('Utilisateur supprimé')).toBeVisible();

    // Verify undo button appears
    await expect(page.getByRole('button', { name: 'Annuler' })).toBeVisible();

    // Wait for deletion to complete
    await page.waitForTimeout(10000);

    // Verify user is removed from table
    await expect(page.getByText('Utilisateur supprimé')).not.toBeVisible();
  });

  test('should restore deleted user', async ({ page }) => {
    // Delete a user
    await page.getByRole('button', { name: 'Delete' }).first().click();

    // Click restore button
    await page.getByRole('button', { name: 'Annuler' }).click();

    // Verify user is restored
    await expect(page.getByText('Utilisateur supprimé')).not.toBeVisible();
  });

  test('should resend activation email', async ({ page }) => {
    // Click resend activation button on first user
    await page.getByRole('button', { name: 'Resend activation' }).first().click();

    // Verify success message
    await expect(page.getByText('Email d\'activation envoyé avec succès')).toBeVisible();
  });

  test('should reset password', async ({ page }) => {
    // Click reset password button on first user
    await page.getByRole('button', { name: 'Reset password' }).first().click();

    // Verify success message
    await expect(page.getByText('Email de réinitialisation envoyé avec succès')).toBeVisible();
  });

  test('should filter users', async ({ page }) => {
    // Test search filter
    await page.getByPlaceholder('Search users...').fill('test');
    await expect(page.getByRole('table')).toContainText('test');

    // Test role filter
    await page.getByRole('combobox', { name: 'Role' }).selectOption('admin');
    await expect(page.getByRole('table')).toContainText('admin');

    // Test status filter
    await page.getByRole('combobox', { name: 'Status' }).selectOption('active');
    await expect(page.getByRole('table')).toContainText('Active');
  });

  test('should sort users', async ({ page }) => {
    // Click on username column to sort
    await page.getByRole('columnheader', { name: 'Username' }).click();

    // Verify sorting indicator
    await expect(page.getByRole('columnheader', { name: 'Username' }))
      .toHaveAttribute('data-sort', 'asc');
  });
}); 