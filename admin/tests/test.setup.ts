import { test as setup, expect } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', process.env.ADMIN_EMAIL || 'admin@example.com');
  await page.fill('[name="password"]', process.env.ADMIN_PASSWORD || 'admin123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/users');
}); 