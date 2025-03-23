import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Welcome to Porotein Admin' })).toBeVisible();
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.getByLabel('Username').fill('wronguser');
    await page.getByLabel('Password').fill('wrongpass');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('Invalid username or password')).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Should redirect to users page
    await expect(page).toHaveURL('/users');
    
    // Should show admin interface
    await expect(page.getByRole('heading', { name: 'Users Management' })).toBeVisible();
  });

  test('should prevent access to admin pages without authentication', async ({ page }) => {
    // Try to access users page directly
    await page.goto('/users');
    
    // Should redirect to login page
    await expect(page).toHaveURL('/login');
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Click logout button
    await page.getByRole('button', { name: 'Logout' }).click();

    // Should redirect to login page
    await expect(page).toHaveURL('/login');
  });
}); 