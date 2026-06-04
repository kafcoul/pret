import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: 'https://www.solutionsfortier.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: true,
    locale: 'fr-CA',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium', channel: 'chrome' } },
  ],
});
