# QA UnicorntStore — E2E Test Automation

[![QA E2E](https://github.com/keber/QA-UnicorntStore-refactor/actions/workflows/qa-e2e.yml/badge.svg)](https://github.com/keber/QA-UnicorntStore-refactor/actions/workflows/qa-e2e.yml)
[![E2E Report](https://img.shields.io/badge/E2E%20report-live-brightgreen)](https://keber.dev/QA-UnicorntStore-refactor/)
[![Coverage Report](https://img.shields.io/badge/code%20coverage-live-brightgreen)](https://keber.dev/QA-UnicorntStore-refactor/coverage/)
[![Powered by qa-framework](https://img.shields.io/badge/powered%20by-qa--framework%20v1.11.3-blue)](https://github.com/keber/qa-framework)
[![Playwright](https://img.shields.io/badge/tested%20with-Playwright-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev)
[![Language](https://img.shields.io/badge/docs-Spanish%20%28es%29-informational)](qa/README.md)

QA and end-to-end test automation for [unicornt-store](https://unicornt-store.keber.cl), a
front-end e-commerce demo (Bootstrap 5, vanilla JS, cart in `localStorage`, no login). This repo
holds the full QA process for two modules, **Catálogo** (product listing + detail) and
**Carrito** (shopping cart): from live exploration and specifications through a regression suite
that runs in CI on every push.

> **Refactor in progress (since 2026-08-29):** the app moved to a Vite build and started wiring
> in a real backend. The suite baselines the *pre-refactor* behavior; 7 tests are parked in
> `test.fixme()` as OBSOLETE until the new checkout/contact/API behavior stabilizes, at which
> point the `qa-maintenance` (Stage 6) pass in [`qa/AGENT-NEXT-STEPS.md`](qa/AGENT-NEXT-STEPS.md)
> updates specs and rewrites them. The code-coverage report is also stale (see below) until then.

**[→ Browse the live E2E test report](https://keber.dev/QA-UnicorntStore-refactor/)** ·
**[→ Browse the live code coverage report](https://keber.dev/QA-UnicorntStore-refactor/coverage/)**
(both published from the latest `main` run, see [Report Publishing](#report-publishing) below)

---

## Generated with qa-framework

This project's QA process — specifications, business rules, test plans, and test cases — was
produced using [`@keber/qa-framework`](https://github.com/keber/qa-framework) v1.11.3, an
agent-oriented, spec-driven QA pipeline. The framework drives a 6-stage, human-in-the-loop
workflow (module analysis → spec generation → test planning → test-case authoring → execution →
automation) through a standardized `qa/` directory, with each stage backed by a dedicated skill
under [`.github/skills/`](.github/skills/).

All artifacts below are **framework-generated documentation**, not hand-written docs:

| Stage | What it produced | Where |
|---|---|---|
| 1 — Module Analysis | Live-exploration findings, business rules, user flows, test scenarios per submodule | [`qa/01-specifications/module-catalogo/`](qa/01-specifications/module-catalogo/), [`qa/01-specifications/module-carrito/`](qa/01-specifications/module-carrito/) |
| 2 — Spec Generation | Formalized business rules (RN-\*) and workflows (FL-\*) reviewed against framework rules | same submodule folders (`01-business-rules.md`, `04-user-flows.md`) |
| 3 — Test Plan | Plan de Pruebas (test plan) per module, Sprint 1 | [`qa/02-test-plans/sprints/Sprint-001/`](qa/02-test-plans/sprints/Sprint-001/) |
| 5 — Automation | Playwright suite, page objects, and coverage mapping (which TC maps to which spec/test) | [`qa/07-automation/e2e/`](qa/07-automation/e2e/), coverage mapping: [CAT](qa/07-automation/e2e/tests/catalogo/COVERAGE-MAPPING.md) / [CARR](qa/07-automation/e2e/tests/carrito/COVERAGE-MAPPING.md) |
| — | Defects found during analysis/automation | [`qa/06-defects/open/`](qa/06-defects/open/) |
| — | Sprint status, active blockers, run history (project dashboard) | [`qa/README.md`](qa/README.md) |

> Specs, plans, and business rules are written in Spanish (the framework's configured project
> language); this top-level README and the code/tests are in English.

The full project dashboard — module status, active blockers, run history, and completed-sprint
history — lives in **[`qa/README.md`](qa/README.md)**.

---

## Quick Start

```bash
cd qa/07-automation/e2e
npm install
cp .env.example .env   # set QA_BASE_URL - no credentials needed, this app has no login

npx playwright test              # run the full suite
npx playwright test --grep @P0   # smoke suite only
npx playwright test --ui         # debug mode
npx playwright show-report       # open the last local HTML report
```

## Code Coverage

E2E code coverage is usually associated with unit tests, but it applies here too: every test run
captures real V8 coverage (via Playwright's Chromium CDP `page.coverage` API and
[`monocart-coverage-reports`](https://github.com/cenfun/monocart-coverage-reports)) of the app's
*own* front-end JS/CSS as actually executed by the suite, filtering out vendor code (Bootstrap,
Font Awesome) via `entryFilter`/`sourceFilter` in
[`qa/07-automation/e2e/mcr.config.ts`](qa/07-automation/e2e/mcr.config.ts).

This measures *"how much of the app's own front-end code does the E2E suite exercise"* — a
different signal from the TC/requirements coverage in
[`COVERAGE-MAPPING.md`](qa/07-automation/e2e/tests/catalogo/COVERAGE-MAPPING.md) (which tracks
what fraction of the *documented test cases* are automated). Both matter; neither substitutes for
the other.

> ⚠️ **The coverage report has read 0% since the 2026-08-29 refactor.** The app moved from
> unbundled `assets/js/{app,cart,products}.js` to hashed Vite bundles (`main-*.js`, …), so
> `mcr.config.ts`'s path regex no longer matches anything and MCR emits an empty report without
> failing the pipeline. Fixing it (enable build sourcemaps, rewrite the filters against real
> `src/` paths, exclude bundled Bootstrap) is part of the Stage 6 maintenance pass —
> see [`qa/AGENT-NEXT-STEPS.md`](qa/AGENT-NEXT-STEPS.md). The last valid numbers (pre-refactor)
> were 93%+ statement / 96%+ line / 100% function.

Implementation: [`fixtures/coverage-fixture.ts`](qa/07-automation/e2e/fixtures/coverage-fixture.ts)
(auto fixture, starts/stops coverage per test), [`global-setup.ts`](qa/07-automation/e2e/global-setup.ts)
/ [`global-teardown.ts`](qa/07-automation/e2e/global-teardown.ts) (clean cache before the run,
merge + generate the report after). Chromium-only, same as the suite itself.

## Report Publishing

The `QA E2E` GitHub Actions workflow ([`.github/workflows/qa-e2e.yml`](.github/workflows/qa-e2e.yml))
runs the suite on every push/PR to `main`. On pushes to `main`, a dedicated `publish-report` job
deploys both reports to GitHub Pages, so the latest run's results are always browsable without
downloading an artifact:
- **[Test report](https://keber.dev/QA-UnicorntStore-refactor/)** — site root
- **[Coverage report](https://keber.dev/QA-UnicorntStore-refactor/coverage/)** — `/coverage/`

## Status Snapshot

| Module | Submodule | TCs | Automated | Notes |
|---|---|---|---|---|
| Catálogo | LISTADO | 50 | 49 | 1 `Bloqueado` (absent feature, out of scope); 1 `test.fixme()` OBSOLETE (refactor) |
| Catálogo | DETALLE | 55 | 52 | 3 `Bloqueado` (absent features, out of scope) |
| Carrito | CARRITO | 55 | 55 | 6 `test.fixme()` OBSOLETE (refactor) |

157 tests total: 150 passing (incl. 4 `test.fail()` asserting known open defects
[#19](https://github.com/keber/unicornt-store-frontend/issues/19)/[#20](https://github.com/keber/unicornt-store-frontend/issues/20)/[#21](https://github.com/keber/unicornt-store-frontend/issues/21)
in the app repo), 7 `test.fixme()` parked OBSOLETE by the refactor. See
[`qa/06-defects/open/`](qa/06-defects/open/) and the full dashboard at
[`qa/README.md`](qa/README.md) for details, run history, and known issues.

## Repository Layout

```
qa/
├── 00-standards/         naming conventions, project-wide rules
├── 01-specifications/    per-submodule specs (business rules, user flows, test scenarios)
├── 02-test-plans/        Plan de Pruebas per sprint
├── 06-defects/           defects found during analysis/automation
├── 07-automation/e2e/    Playwright TypeScript suite (this repo's actual test code)
├── memory/               session-to-session project memory (architecture findings, patterns)
├── README.md             project dashboard (status, blockers, run history)
└── AGENT-NEXT-STEPS.md   active sprint checklist
.github/
├── workflows/qa-e2e.yml  CI: lint, type-check, run suite, publish test + coverage reports
└── skills/               qa-framework skill definitions for each pipeline stage
```

`qa/07-automation/e2e/mcr.config.ts`, `global-setup.ts`, and `global-teardown.ts` configure and
drive the [code coverage](#code-coverage) report; `fixtures/coverage-fixture.ts` collects it.
