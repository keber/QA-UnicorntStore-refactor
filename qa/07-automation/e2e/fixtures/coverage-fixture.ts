// ⚠️ PARKED since the 2026-09-06 Vite refactor - this fixture is NOT merged
// into fixtures/pom/test-options.ts any more. See ../mcr.config.ts header
// and qa/AGENT-NEXT-STEPS.md for the restore task.
import { test as base, type Page } from '@playwright/test';
import MCR from 'monocart-coverage-reports';
import coverageOptions from '../mcr.config';

type CoverageFixtures = {
  /** Auto fixture - no test requests this directly, see `test-options.ts`. */
  autoCoverage: void;
};

/**
 * Collects V8 JS/CSS coverage of this app's own front-end assets for every
 * test (see `mcr.config.ts`'s `entryFilter` for what's in/out of scope).
 * Adapted from the package's own Playwright example:
 * https://github.com/cenfun/playwright-coverage/blob/main/fixtures.ts
 *
 * Scoped to `context`, not `page`, so a test that opens more than one
 * page/tab still gets full coverage. Chromium-only: the CDP-backed
 * `page.coverage` API `@playwright/test` exposes has no Firefox/WebKit
 * equivalent - harmless today since `playwright.config.ts` only defines a
 * `chromium` project, but the guard keeps this fixture safe to reuse if
 * that ever changes.
 *
 * `mcr.add()` only stages this test's coverage in MCR's on-disk cache;
 * `global-teardown.ts` calls `mcr.generate()` once, after every worker has
 * finished, to produce the final merged report.
 */
export const test = base.extend<CoverageFixtures>({
  autoCoverage: [
    async ({ context }, use, testInfo): Promise<void> => {
      const isChromium = testInfo.project.name === 'chromium';

      const startCoverage = async (page: Page): Promise<void> => {
        await Promise.all([
          page.coverage.startJSCoverage({ resetOnNavigation: false }),
          page.coverage.startCSSCoverage({ resetOnNavigation: false }),
        ]);
      };
      const onPage = (page: Page): void => {
        void startCoverage(page);
      };

      if (isChromium) {
        context.on('page', onPage);
      }

      await use();

      if (isChromium) {
        context.off('page', onPage);
        const coverageList = await Promise.all(
          context.pages().map(async (page) => {
            const [jsCoverage, cssCoverage] = await Promise.all([
              page.coverage.stopJSCoverage(),
              page.coverage.stopCSSCoverage(),
            ]);
            return [...jsCoverage, ...cssCoverage];
          })
        );
        await MCR(coverageOptions).add(coverageList.flat());
      }
    },
    { scope: 'test', auto: true },
  ],
});
