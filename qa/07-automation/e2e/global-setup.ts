import MCR from 'monocart-coverage-reports';
import coverageOptions from './mcr.config';

/**
 * Clears any coverage cached from a previous run before this one starts -
 * otherwise `mcr.add()` calls staged by `fixtures/coverage-fixture.ts`
 * would merge into a stale run's leftover cache dir instead of a clean
 * one. Paired with `global-teardown.ts`, which generates the final report
 * once every worker has finished.
 */
export default async function globalSetup(): Promise<void> {
  await MCR(coverageOptions).cleanCache();
}
