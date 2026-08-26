# QA — QA-UnicorntStore-refactor

> Framework: `@keber/qa-framework` v1.11.3
> Language: es | Base URL: `https://unicornt-store.keber.cl`
> CI: GitHub Actions (`.github/workflows/qa-e2e.yml`) — no usa Azure DevOps.
> App front-end puro: sin login, sin backend/API. Ver `qa/memory/arquitectura-unicornstore-2026-08-26.md`.
> Reporte E2E en vivo (publicado por CI en cada push a `main`): https://keber.dev/QA-UnicorntStore-refactor/
> Reporte de code coverage en vivo (JS/CSS propio de la app, ver `../README.md → Code Coverage`): https://keber.dev/QA-UnicorntStore-refactor/coverage/
> Ver [README.md](../README.md) (raíz, en inglés) para la vista general del proyecto.

---

## Module Status

| Module | Submodule | TCs Total | TCs Automated | Plan | Status | Last Run |
|---|---|---|---|---|---|---|
| CAT (Catálogo) | LISTADO | 50 | 49 (10 @P0 + 39 @P1-P3, 1 Bloqueado) | ✅ | ✅ Stage 5 P0+P1-P3 done | 2026-08-26 (150/150 pass, 6 fixme) |
| CAT (Catálogo) | DETALLE | 55 | 52 (8 @P0 + 44 @P1-P3, 3 Bloqueado) | ✅ | ✅ Stage 5 P0+P1-P3 done | 2026-08-26 (150/150 pass, 6 fixme) |
| CARR (Carrito) | CARRITO | 55 | 55 (14 @P0 + 41 @P1-P3) | ✅ | ✅ Stage 5 P0+P1-P3 done | 2026-08-26 (150/150 pass, 6 fixme) |

**Legend**: ✅ Done · ⚠️ Partial · 🔲 Not started · ⛔ Blocked

---

## Quick-Start Commands

```bash
# Run all automated tests (from the e2e sub-project - playwright.config.ts lives here)
cd qa/07-automation/e2e
npx playwright test

# Run a specific module
npx playwright test tests/{module-folder}/

# Run with UI (debug mode)
npx playwright test --ui

# Generate HTML report
npx playwright show-report

# Re-run only failed tests
npx playwright test --last-failed
```

> Copy `qa/07-automation/e2e/.env.example` to `.env` and set `QA_BASE_URL` — no credentials
> needed, this app has no login (see `qa/memory/arquitectura-unicornstore-2026-08-26.md`).

---

## Active Blockers

| ID | Description | Affects | Opened | Status |
|---|---|---|---|---|
| DEF-001 | Límite máximo de cantidad (99) no se respeta al agregar al carrito | CAT/LISTADO, CAT/DETALLE | 2026-08-26 | Open (Low/P2) |
| DEF-002 | Entrada de carrito con producto inexistente deja la UI inconsistente (sin filas ni mensaje de vacío, footer y "Finalizar compra" activos) | CARR/CARRITO | 2026-08-26 | Open (Low/P3) |
| DEF-003 | `product.html` desborda horizontalmente (~12px) en viewport móvil de 375px (`.row.g-5` de `#product-content`) | CAT/DETALLE | 2026-08-26 | Open (Low/P3) |

---

## Last Run

| Suite | Date | Pass | Fail | Skip | CI Link |
|---|---|---|---|---|---|
| E2E (@P0-@P3, full suite) | 2026-08-26 | 150 | 0 | 6 (`test.fixme()` - DEF-001/002/003) | [run 1](https://github.com/keber/QA-UnicorntStore-refactor/actions/runs/33004443001), [run 2](https://github.com/keber/QA-UnicorntStore-refactor/actions/runs/33013887052) — both green, 0 flake |

> Update this table after each significant run. The CI Link is a GitHub Actions run URL
> (`.github/workflows/qa-e2e.yml`) or a path to a local report file.

## Last Execution

| Date | Suite | Pass | Skip | Fail | Duration | Report |
|---|---|---|---|---|---|---|
| 2026-08-26 | `tests/catalogo tests/carrito` (@P0) | 32 | 0 | 0 | ~24s | `qa/07-automation/e2e/playwright-report/` (local, gitignored) |
| 2026-08-26 | `tests/catalogo tests/carrito` (@P0-@P3, full suite) | 150 | 6 | 0 | ~90s (×2 consecutive runs, 0 flake) | `qa/07-automation/e2e/playwright-report/` (local, gitignored) |

## Flaky Tests

> Mark known flaky tests with this inline annotation directly in the table or spec file.
> Format: `[flaky] <test-id-or-name> - <root cause> - last seen <YYYY-MM-DD>`
>
> Example:
> `[flaky] TC-MOD-012 - timing issue on slow CI agents - last seen 2026-01-15`
>
> Remove the annotation once the test has been stable for 2+ consecutive CI runs.

---

## Sprint History

<!-- Completed sprint checklists are moved here from AGENT-NEXT-STEPS.md -->
<!-- Format per sprint: -->
<!--
### Sprint N — {SPRINT_NAME} ({YYYY-MM-DD})

**Submodules**: {list}
**TCs automated**: {N} P0 + {M} P1
**Execution report**: `qa/05-test-execution/automated/{date-slug}.md`

Checklist (completed):
- [x] {Task 1}
- [x] {Task 2}
-->

### Sprint 1 — CAT + CARR Regression Baseline (2026-08-26)

**Submodules**: CAT/LISTADO, CAT/DETALLE, CARR/CARRITO
**TCs automated**: 32 P0 + 124 P1-P3 = 156 total (150 pass + 6 `test.fixme()` for DEF-001/002/003)
**Execution report**: local Playwright HTML report (gitignored) + [CI run](https://github.com/keber/QA-UnicorntStore-refactor/actions/runs/33004443001) (150 passed, 6 skipped)

Checklist (completed):
- [x] Stage 1 (`qa-module-analysis`): CAT/LISTADO, CAT/DETALLE, CARR/CARRITO analyzed via live exploration. Found DEF-001, DEF-002.
- [x] Stage 2 (`qa-spec-generation`): 4 business rules + 1 error-path workflow formalized in CAT; CARR unchanged.
- [x] Stage 3 (`qa-test-plan`): Plan de Pruebas Sprint 1 for CAT (105 TCs) and CARR (55 TCs).
- [x] Stage 5 (`qa-automation`), first pass: 32/32 P0 TCs automated, all gates green.
- [x] Stage 5, second pass: 124 P1-P3 TCs automated (156 total). Found DEF-003.
- [x] Confirmed `qa-e2e.yml` (CI) passes green on a real push to `main` — repo created at `keber/QA-UnicorntStore-refactor`, [run succeeded](https://github.com/keber/QA-UnicorntStore-refactor/actions/runs/33004443001) (150 passed, 6 skipped, lint + tsc clean).
- [x] Business decision on the 4 `Bloqueado` TCs (Tazón category; detail variants/reviews/related products): **confirmed out of scope** — documented as permanently blocked pending feature implementation, not automated further.

_No other sprints completed yet._

---

## Resources

| Resource | Link |
|---|---|
| QA Structure Guide | `qa/QA-STRUCTURE-GUIDE.md` |
| Naming Conventions | `qa/00-standards/naming-conventions.md` |
| Memory Index | `qa/memory/INDEX.md` |
| Agent Next Steps | `qa/AGENT-NEXT-STEPS.md` |
| Automation Config | `qa/07-automation/e2e/playwright.config.ts` |
| CI Workflow | `.github/workflows/qa-e2e.yml` |
| Architecture Findings | `qa/memory/arquitectura-unicornstore-2026-08-26.md` |
| Sprint 001 Test Plans | `qa/02-test-plans/sprints/Sprint-001/` |
| Coverage Mapping (CAT) | `qa/07-automation/e2e/tests/catalogo/COVERAGE-MAPPING.md` |
| Coverage Mapping (CARR) | `qa/07-automation/e2e/tests/carrito/COVERAGE-MAPPING.md` |
