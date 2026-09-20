import { defineConfig, devices } from '@playwright/test';
import { env } from './config/env';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: env.uiBaseUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true
  },
  projects: [
  {
    name: 'chromium',
    testIgnore: [
      '**/api/transfers.spec.ts',
      '**/ui/transfer-funds.spec.ts',
      '**/integration/transfer-e2e.spec.ts'
    ],
    use: { ...devices['Desktop Chrome'] }
  },
  {
    name: 'chromium-stateful',
    testMatch: [
      '**/api/transfers.spec.ts',
      '**/ui/transfer-funds.spec.ts',
      '**/integration/transfer-e2e.spec.ts'
    ],
    fullyParallel: false,
    workers: 1,
    use: { ...devices['Desktop Chrome'] }
  }
]
});
