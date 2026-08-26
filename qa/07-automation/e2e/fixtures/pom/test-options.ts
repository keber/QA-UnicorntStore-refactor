import { test as base, mergeTests } from '@playwright/test';
import { test as pageObjectFixture } from './page-object-fixture';
import { test as coverageFixture } from '../coverage-fixture';

/**
 * Single import point for every test file (Constitution MUST: Imports).
 * Never import `test`/`expect` from `@playwright/test` directly in a
 * `.spec.ts` file - always import from here.
 *
 * Two fixture modules merged today: page objects + `clearCart`
 * (`page-object-fixture.ts`), and the auto coverage fixture
 * (`../coverage-fixture.ts`, see there for what it collects and why). If a
 * future refactor adds a backend, reintroduce an `apiRequest` fixture per
 * the "dormant" section of the qa-automation skill's
 * `type-safety-and-data-strategy.md` reference, and merge it in here too.
 */
const test = mergeTests(pageObjectFixture, coverageFixture);

const expect = base.expect;
export { test, expect };
