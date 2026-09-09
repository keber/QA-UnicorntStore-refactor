import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

// -------------------------------------------------------------------
// Validate required environment variables at config load time
// -------------------------------------------------------------------
// The 2026-09-06 refactor added a real backend (Spring Boot + JWT). The
// suite targets the isolated QA stack (QA_BASE_URL = unicornt-qa.keber.cl,
// QA_API_URL = api-unicornt-qa.keber.cl) so throwaway users and test orders
// stay off prod. Auth tests register a fresh user per run - no QA_USER_*
// needed. See qa/memory/arquitectura-unicornstore-2026-09-06.md and the
// (now live) `apiRequest` fixture in fixtures/api/.
const required = ['QA_BASE_URL', 'QA_API_URL'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`[qa-framework] Missing required env var: ${key}. Check your .env file.`);
  }
}

export default defineConfig({
  // ------ Test discovery ------
  testDir: './tests',
  testIgnore: ['**/helpers/debug/**', '**/seeds/**'],

  // ------ Code coverage: PARKED since the 2026-09-06 Vite refactor ------
  // The app ships hashed, minified bundles with no sourcemaps and its build
  // is not in this repo, so MCR can no longer map coverage to real source.
  // global-setup/teardown + coverage-fixture + mcr.config are left in the
  // tree (unwired) for the eventual restore - see qa/AGENT-NEXT-STEPS.md.

  // ------ Parallelism ------
  // Each test gets a fresh context (guest cart in localStorage) or its own
  // registered user - safe to parallelize. Local is capped at 2 (matches
  // qa-framework.config.json integrations.playwright.workers.local): the
  // per-test MCR().add() in the old coverage fixture caused browserContext
  // teardown timeouts under the default worker count. Coverage is parked
  // now (see mcr.config.ts header) but the cap stays as a sane default.
  fullyParallel: true,
  workers: process.env.CI ? 1 : 2,

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
