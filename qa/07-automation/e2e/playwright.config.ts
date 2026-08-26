import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

// -------------------------------------------------------------------
// Validate required environment variables at config load time
// -------------------------------------------------------------------
// Only QA_BASE_URL: this app has no login and no backend/API (confirmed
// 2026-08-26 via live exploration - see qa/memory/ for the finding). No
// setup/auth project, no storageState, no QA_USER_* vars needed. If a
// future refactor adds a login or a backend, this project previously had a
// setup-project + apiRequest pattern (removed 2026-08-26 once found
// unnecessary here) - see qa/memory/arquitectura-unicornstore-2026-08-26.md
// and the "dormant" note in the qa-automation skill's
// type-safety-and-data-strategy.md reference for what to rebuild.
const required = ['QA_BASE_URL'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`[qa-framework] Missing required env var: ${key}. Check your .env file.`);
  }
}

export default defineConfig({
  // ------ Test discovery ------
  testDir: './tests',
  testIgnore: ['**/helpers/debug/**', '**/seeds/**'],

  // ------ Code coverage (fixtures/coverage-fixture.ts stages per-test data
  // via mcr.add(); these merge it into the final report once - see
  // mcr.config.ts for what's in/out of scope) ------
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',

  // ------ Parallelism ------
  // No shared session/storageState to worry about - safe to parallelize.
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,

  // ------ Retry strategy ------
  retries: process.env.CI ? 1 : 0,

  // ------ Reporter ------
  reporter: [['html', { open: 'never' }], ['list']],

  // ------ Global settings ------
  use: {
    baseURL: process.env.QA_BASE_URL,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  // ------ Projects ------
  // Single project - no auth/setup dependency needed.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // ------ Output directories ------
  outputDir: 'test-results/',
  snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}',
});
