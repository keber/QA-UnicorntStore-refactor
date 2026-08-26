import MCR from 'monocart-coverage-reports';
import coverageOptions from './mcr.config';

/**
 * Merges every test's staged coverage data (`fixtures/coverage-fixture.ts`
 * → `mcr.add()` per test) into the final report at
 * `coverageOptions.outputDir` (`coverage-reports/`). Runs once, after every
 * worker has finished - see `global-setup.ts` for the matching cache reset.
 */
export default async function globalTeardown(): Promise<void> {
  await MCR(coverageOptions).generate();
}
