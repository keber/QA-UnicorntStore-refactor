import { test as base, mergeTests } from '@playwright/test';
import { test as pageObjectFixture } from './page-object-fixture';
import { test as apiRequestFixture } from '../api/api-request-fixture';

/**
 * Single import point for every test file (Constitution MUST: Imports).
 * Never import `test`/`expect` from `@playwright/test` directly in a
 * `.spec.ts` file - always import from here.
 *
 * Merged fixture modules:
 * - `page-object-fixture.ts` - page objects + `clearCart`.
 * - `../api/api-request-fixture.ts` - `apiRequest` + `registerViaApi`
 *   against QA_API_URL (the 2026-09-06 refactor added a real backend).
 *
 * The coverage fixture (`../coverage-fixture.ts`) is PARKED - not merged
 * here - since the Vite refactor removed usable sourcemaps. See
 * `qa/AGENT-NEXT-STEPS.md` for the restore task.
 */
const test = mergeTests(pageObjectFixture, apiRequestFixture);

const expect = base.expect;
export { test, expect };
