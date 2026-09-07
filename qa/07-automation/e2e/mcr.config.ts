import type { CoverageReportOptions, V8CoverageEntry } from 'monocart-coverage-reports';

/**
 * ⚠️ PARKED since the 2026-09-06 Vite refactor. This file is NOT wired into
 * the run any more (playwright.config.ts dropped globalSetup/teardown and
 * test-options.ts no longer merges coverage-fixture). The app now ships
 * hashed, minified bundles under `/assets/` with no sourcemaps, and its
 * build is not in this repo, so the `entryFilter`/`sourceFilter` below
 * (written for the old unbundled `/assets/js|css/`) match nothing. Restore
 * task (needs the frontend to emit sourcemaps + serve `src/`) is in
 * `qa/AGENT-NEXT-STEPS.md`. Kept in the tree so the restore is a diff, not
 * a rewrite.
 *
 * Config for `monocart-coverage-reports` (https://github.com/cenfun/monocart-coverage-reports).
 *
 * Collects V8 code coverage of this app's *own* front-end assets while the
 * E2E suite runs (`fixtures/coverage-fixture.ts` stages per-test data,
 * `global-teardown.ts` merges it into the final report on
 * `mcr.generate()`). Scoped to `assets/js/` and `assets/css/` only -
 * excludes the Bootstrap/Font Awesome CDN bundles the pages also load
 * (`cdn.jsdelivr.net`, `cdnjs.cloudflare.com`), which are vendor code this
 * suite has no business "covering".
 *
 * The app's own JS is unminified, unbundled vanilla JS (confirmed live -
 * see `qa/memory/arquitectura-unicornstore-2026-08-26.md`), so no
 * sourcemap wiring is needed: reported lines map straight to the real
 * source files served by the app.
 */
const coverageOptions: CoverageReportOptions = {
  name: 'QA UnicorntStore E2E Coverage',
  reports: ['v8', 'console-summary'],
  entryFilter: (entry: V8CoverageEntry): boolean => /\/assets\/(js|css)\//.test(entry.url),
  sourceFilter: (sourcePath: string): boolean => /\/assets\/(js|css)\//.test(sourcePath),
  outputDir: './coverage-reports',
};

export default coverageOptions;
