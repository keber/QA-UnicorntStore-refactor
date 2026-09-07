# QA — QA-UnicorntStore-refactor

> Framework: `@keber/qa-framework` v1.11.3
> Language: es
> **Target: el stack QA** — `QA_BASE_URL=https://unicornt-qa.keber.cl`,
> `QA_API_URL=https://api-unicornt-qa.keber.cl` (Postgres aislado, Swagger abierto). La suite
> registra usuarios desechables y crea órdenes acá, no en prod.
> CI: GitHub Actions (`.github/workflows/qa-e2e.yml`) — no usa Azure DevOps.
> **El refactor 2026-09-06 completó la migración**: frontend Vite multipágina + backend real
> (Spring Boot + JWT), catálogo por API, filtro por categoría, checkout real. Ver
> `qa/memory/arquitectura-unicornstore-2026-09-06.md` (vigente) y
> `qa/05-test-execution/STAGE6-REBASELINE-FINDINGS-2026-09-06.md`.
> Reporte E2E en vivo (publicado por CI en cada push a `main`): https://keber.dev/QA-UnicorntStore-refactor/
> **Reporte de code coverage: EN PAUSA** desde el paso a Vite (bundles minificados sin sourcemap,
> build del frontend fuera de este repo) — ver `qa/AGENT-NEXT-STEPS.md`.
> Ver [README.md](../README.md) (raíz, en inglés) para la vista general del proyecto.

---

## Module Status

| Module | Submodule | TCs Total | Automatizados | Plan | Status | Last Run |
|---|---|---|---|---|---|---|
| CAT (Catálogo) | LISTADO | 50 | 48 (2 OBSOLETE removed) | ✅ (v1.1) | ✅ Stage 6 re-baselined · 1 `test.fail` (DEF-001) | 2026-09-06 (green) |
| CAT (Catálogo) | DETALLE | 55 | 51 (1 OBSOLETE removed, 3 Bloqueado) | ✅ (v1.1) | ✅ Stage 6 re-baselined · 3 `test.fail` (DEF-001/003/007) | 2026-09-06 (green) |
| CARR (Carrito) | CARRITO | 56 | 54 (2 OBSOLETE removed) | ✅ (v1.1) | ✅ Stage 6 re-baselined · 4 `test.fail` (3×DEF-004, DEF-002) | 2026-09-06 (green) |

**Legend**: ✅ Done · ⚠️ Partial · 🔲 Not started · ⛔ Blocked

> **Stage 6 "green first" (2026-09-06)** — suite re-baselined against the fully-migrated app on
> the QA stack. Catalog is API-loaded (20-of-49 default view + category filter); checkout is a
> real `POST /api/v1/orders` flow. 6 scenarios removed as `OBSOLETE-SCENARIO` (no-`/api`,
> no-contact-`<form>`, cosmetic-checkout premises); 4 new `test.fail()` guards for defects the
> re-baseline surfaced/reconfirmed (**DEF-004** checkout broken, **DEF-007** detail 20-cap, plus
> DEF-001/002/003). A dedicated **AUTH** module, the server-side Cart API, category/pagination
> coverage, an API contract-test suite, and the coverage-report restore are the **Sprint 2**
> backlog — see `qa/AGENT-NEXT-STEPS.md`.

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

> Copy `qa/07-automation/e2e/.env.example` to `.env`: `QA_BASE_URL=https://unicornt-qa.keber.cl`
> + `QA_API_URL=https://api-unicornt-qa.keber.cl`. Checkout/auth tests register a fresh user per
> run — no fixed credentials. See `qa/memory/arquitectura-unicornstore-2026-09-06.md`.

---

## Active Blockers

| ID | Sev | Description | Affects | `test.fail()` guard | Issue |
|---|---|---|---|---|---|
| DEF-004 | **High** | Checkout nunca se completa por la UI — el carrito del navegador nunca se sincroniza con el del servidor, así que `POST /api/v1/orders` corre contra un carrito vacío | CARR/CARRITO | TC-CARR-CARRITO-027/028/029 | pendiente |
| DEF-007 | **High** | `product.html` busca el `id` en la primera página de `GET /products` (20) en vez de `GET /products/{id}` → los productos 21–49 redirigen a `index.html` | CAT/DETALLE | TC-CAT-DETALLE-033 | pendiente |
| DEF-001 | Low/P2 | Límite máx. de cantidad (99) no se respeta al agregar sobre un ítem ya en 99 (escenario A corregido en el refactor) | CAT/LISTADO, CAT/DETALLE | TC-CAT-LISTADO-027, TC-CAT-DETALLE-022 | [#19](https://github.com/keber/unicornt-store-frontend/issues/19) |
| DEF-002 | Low/P3 | Residual: el badge del carrito cuenta la `qty` de una entrada fantasma | CARR/CARRITO | TC-CARR-CARRITO-056 | [#20](https://github.com/keber/unicornt-store-frontend/issues/20) |
| DEF-003 | Low/P3 | `product.html` desborda ~12px a 375px (`.row.g-5` de `#product-content`) | CAT/DETALLE | TC-CAT-DETALLE-047 | [#21](https://github.com/keber/unicornt-store-frontend/issues/21) |
| DEF-005 | Low/P3 | Botones de auth en inglés ("Sign in" / "Create account") en UI español | AUTH | — | pendiente |
| DEF-006 | Low/P3 | Clase CSS residual `badge-tazon` en todo badge de categoría | CAT | — | pendiente |

> Reportes formales en `qa/06-defects/open/`. Issues (los que tienen link) en el repo de la
> **app** (`keber/unicornt-store-frontend`), no en este repo de QA. DEF-004/005/006/007 filed
> 2026-09-06 (Stage 6 re-baseline); issues del lado de la app **pendientes de abrir** (el
> clasificador de auto-mode bloquea `gh` outward-facing acá).

---

## Last Run

| Suite | Date | Pass | Fail | Notes |
|---|---|---|---|---|
| E2E full suite vs QA stack (`--workers=2`) | 2026-09-06 | catalogo 98/98 · carrito 54/54 | 0 | Stage 6 re-baseline. "Pass" incluye 8 `test.fail()` guards (DEF-001/002/003/004/007) que reportan como expected-failure. 0 `test.fixme`. |
| E2E (@P0-@P3, full suite) | 2026-09-03 | 150 | 0 | Pre-refactor baseline (rama `suite-maintenance`, contra prod). |
| E2E (@P0-@P3, full suite) | 2026-08-26 | 150 | 0 | [run 1](https://github.com/keber/QA-UnicorntStore-refactor/actions/runs/33004443001), [run 2](https://github.com/keber/QA-UnicorntStore-refactor/actions/runs/33013887052). |

> Update this table after each significant run. The CI Link is a GitHub Actions run URL
> (`.github/workflows/qa-e2e.yml`) or a path to a local report file.

## Flaky Tests

> Format: `[flaky] <test-id-or-name> - <root cause> - last seen <YYYY-MM-DD>`
> Remove once stable for 2+ consecutive CI runs.

_Ninguno abierto._ El flake de teardown por `coverage-fixture` (visto 2026-09-03) quedó resuelto:
coverage está en pausa (fixture desconectada) y `playwright.config.ts` fija `workers` local en 2.
La cadencia de carga async del catálogo se maneja con `CatalogPage.awaitLoaded()` /
`CartPage.open()` (esperan el render de datos de producto antes de interactuar).

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
| Architecture Findings (vigente) | `qa/memory/arquitectura-unicornstore-2026-09-06.md` |
| Stage 6 Re-baseline Findings | `qa/05-test-execution/STAGE6-REBASELINE-FINDINGS-2026-09-06.md` |
| Sprint 001 Test Plans | `qa/02-test-plans/sprints/Sprint-001/` |
| Coverage Mapping (CAT) | `qa/07-automation/e2e/tests/catalogo/COVERAGE-MAPPING.md` |
| Coverage Mapping (CARR) | `qa/07-automation/e2e/tests/carrito/COVERAGE-MAPPING.md` |
