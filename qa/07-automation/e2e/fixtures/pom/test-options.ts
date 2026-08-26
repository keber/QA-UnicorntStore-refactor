import { test as base } from '@playwright/test';
import { test as pageObjectFixture } from './page-object-fixture';

/**
 * Single import point for every test file (Constitution MUST: Imports).
 * Never import `test`/`expect` from `@playwright/test` directly in a
 * `.spec.ts` file - always import from here.
 *
 * Only one fixture module today (page objects + `clearCart`) - this app has
 * no login and no backend/API, so there is nothing to merge in yet. If a
 * future refactor adds a backend, reintroduce an `apiRequest` fixture per
 * the "dormant" section of the qa-automation skill's
 * `type-safety-and-data-strategy.md` reference, and merge it here with
 * `mergeTests()`.
 */
const test = pageObjectFixture;

const expect = base.expect;
export { test, expect };
