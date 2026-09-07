# QA UnicorntStore — E2E Test Automation

[![QA E2E](https://github.com/keber/QA-UnicorntStore-refactor/actions/workflows/qa-e2e.yml/badge.svg)](https://github.com/keber/QA-UnicorntStore-refactor/actions/workflows/qa-e2e.yml)
[![E2E Report](https://img.shields.io/badge/E2E%20report-live-brightgreen)](https://keber.dev/QA-UnicorntStore-refactor/)
[![Powered by qa-framework](https://img.shields.io/badge/powered%20by-qa--framework%20v1.11.3-blue)](https://github.com/keber/qa-framework)
[![Playwright](https://img.shields.io/badge/tested%20with-Playwright-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev)
[![Language](https://img.shields.io/badge/docs-Spanish%20%28es%29-informational)](qa/README.md)

QA and end-to-end test automation for **unicornt-store**, a geek-apparel e-commerce demo. This
repo holds the full QA process for **Catálogo** (product listing + detail) and **Carrito**
(shopping cart): from live exploration and specifications through a regression suite that runs in
CI on every push.

> **The 2026-09-06 refactor completed the migration:** the app is now a Vite multipage frontend
> (`index/product/login/register.html`) plus a real backend — Spring Boot + JWT, a paginated
> product API, category filtering, and a real `POST /api/v1/orders` checkout. The suite targets
> the **isolated QA stack** (`unicornt-qa.keber.cl` + `api-unicornt-qa.keber.cl`) so its
> throwaway users and test orders never touch production. It was re-baselined against this app in
> the "green first" Stage 6 pass — see
> [`qa/05-test-execution/STAGE6-REBASELINE-FINDINGS-2026-09-06.md`](qa/05-test-execution/STAGE6-REBASELINE-FINDINGS-2026-09-06.md).
> A dedicated **AUTH** module, server-side Cart API coverage, an API contract-test layer, and the
> code-coverage report restore are the **Sprint 2** backlog in
> [`qa/AGENT-NEXT-STEPS.md`](qa/AGENT-NEXT-STEPS.md).

**[→ Browse the live E2E test report](https://keber.dev/QA-UnicorntStore-refactor/)**
(published from the latest `main` run, see [Report Publishing](#report-publishing) below)

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
cp .env.example .env   # QA_BASE_URL=https://unicornt-qa.keber.cl, QA_API_URL=https://api-unicornt-qa.keber.cl
                       # checkout/auth tests register a fresh user per run - no fixed credentials

npx playwright test              # run the full suite
npx playwright test --grep @P0   # smoke suite only
npx playwright test --ui         # debug mode
npx playwright show-report       # open the last local HTML report
```

## Code Coverage — parked

E2E V8 code coverage (via `page.coverage` + [`monocart-coverage-reports`](https://github.com/cenfun/monocart-coverage-reports))
ran against the pre-refactor app's unbundled `assets/js/*.js` and reported 93%+ statements /
96%+ lines / 100% functions.

> ⚠️ **Parked since the 2026-09-06 Vite migration.** The app now ships hashed, minified bundles
> with no sourcemaps and its build is not in this repo, so MCR can't map coverage to real
> source. `mcr.config.ts`, `coverage-fixture.ts`, and `global-{setup,teardown}.ts` are left in
> the tree (unwired, with `PARKED` headers) so the restore is a diff, not a rewrite. Restore
> steps (frontend must emit sourcemaps + serve `src/`) are in
> [`qa/AGENT-NEXT-STEPS.md`](qa/AGENT-NEXT-STEPS.md).

## Report Publishing

The `QA E2E` GitHub Actions workflow ([`.github/workflows/qa-e2e.yml`](.github/workflows/qa-e2e.yml))
runs lint + type-check + the suite on every push/PR to `main`. On pushes to `main` a
`publish-report` job deploys the Playwright HTML report to GitHub Pages:
- **[Test report](https://keber.dev/QA-UnicorntStore-refactor/)** — site root

## Status Snapshot

| Module | Submodule | TCs | Automated | `test.fail()` guards |
|---|---|---|---|---|
| Catálogo | LISTADO | 50 | 48 (2 OBSOLETE removed, 1 Bloqueado) | 1 — DEF-001 |
| Catálogo | DETALLE | 55 | 51 (1 OBSOLETE removed, 3 Bloqueado) | 3 — DEF-001 / DEF-003 / DEF-007 |
| Carrito | CARRITO | 56 | 54 (2 OBSOLETE removed) | 4 — 3×DEF-004 / DEF-002 |

Last run vs the QA stack (2026-09-06): **catalogo 98/98 · carrito 54/54**, 0 failures — "pass"
includes the 8 `test.fail()` guards reporting as expected-failure. Open defects (DEF-001..007) in
[`qa/06-defects/open/`](qa/06-defects/open/); full dashboard, run history and Sprint 2 backlog in
[`qa/README.md`](qa/README.md) and [`qa/AGENT-NEXT-STEPS.md`](qa/AGENT-NEXT-STEPS.md).

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
├── workflows/qa-e2e.yml  CI: lint, type-check, run suite, publish test report
└── skills/               qa-framework skill definitions for each pipeline stage
```

`qa/07-automation/e2e/fixtures/api/` holds the `apiRequest` fixture + Zod schemas (derived from
the backend's `docs/openapi.json`) used by the checkout/auth flows. The `mcr.config.ts` /
`coverage-fixture.ts` / `global-*.ts` coverage wiring is present but [parked](#code-coverage--parked).
