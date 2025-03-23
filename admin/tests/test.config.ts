import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  use: {
    baseURL: process.env.ADMIN_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 0,
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { 
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { 
        browserName: 'firefox',
        viewport: { width: 1280, height: 720 },
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { 
        browserName: 'webkit',
        viewport: { width: 1280, height: 720 },
      },
      dependencies: ['setup'],
    },
    {
      name: 'mobile',
      use: { 
        browserName: 'chromium',
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
        isMobile: true,
      },
      dependencies: ['setup'],
    },
  ],
}); 