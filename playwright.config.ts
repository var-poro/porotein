import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

export default defineConfig({
  testDir: '.',
  testMatch: ['**/tests/**/*.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
    launchOptions: {
      slowMo: 50,
    },
  },

  projects: [
    {
      name: 'app-chromium',
      use: { ...devices['Desktop Chrome'] },
      testDir: './app',
      testMatch: ['**/tests/**/*.spec.ts'],
    },
    {
      name: 'app-firefox',
      use: { ...devices['Desktop Firefox'] },
      testDir: './app',
      testMatch: ['**/tests/**/*.spec.ts'],
    },
    {
      name: 'app-webkit',
      use: { ...devices['Desktop Safari'] },
      testDir: './app',
      testMatch: ['**/tests/**/*.spec.ts'],
    },
    {
      name: 'admin-chromium',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: process.env.VITE_APP_URL || 'http://localhost:3000',
      },
      testDir: './admin',
      testMatch: ['**/tests/**/*.spec.ts'],
    },
    {
      name: 'admin-firefox',
      use: { 
        ...devices['Desktop Firefox'],
        baseURL: process.env.VITE_APP_URL || 'http://localhost:3000',
      },
      testDir: './admin',
      testMatch: ['**/tests/**/*.spec.ts'],
    },
    {
      name: 'admin-webkit',
      use: { 
        ...devices['Desktop Safari'],
        baseURL: process.env.VITE_APP_URL || 'http://localhost:3000',
      },
      testDir: './admin',
      testMatch: ['**/tests/**/*.spec.ts'],
    },
  ],

  webServer: [
    {
      command: 'pnpm run dev:app',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      command: 'pnpm run dev:admin',
      url: process.env.VITE_APP_URL || 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      command: 'pnpm run dev:api',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
  ],
}); 