# QA — QA-UnicorntStore-refactor

> Framework: `@keber/qa-framework` v1.11.3
> Language: es | Base URL: `https://unicornt-store.keber.cl`
> CI: GitHub Actions (`.github/workflows/qa-e2e.yml`) — no usa Azure DevOps.
> App front-end puro: sin login, sin backend/API. Ver `qa/memory/arquitectura-unicornstore-2026-08-26.md`.

---

## Module Status

| Module | Submodule | TCs Total | TCs Automated | Plan | Status | Last Run |
|---|---|---|---|---|---|---|
| CAT (Catálogo) | LISTADO | 50 | 0 | ⬜ | ✅ Stage 1 done | — |
| CAT (Catálogo) | DETALLE | 55 | 0 | ⬜ | ✅ Stage 1 done | — |
| CARR (Carrito) | CARRITO | 55 | 0 | ⬜ | ✅ Stage 1 done | — |

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

---

## Last Run

| Suite | Date | Pass | Fail | Skip | CI Link |
|---|---|---|---|---|---|
| E2E | — | — | — | — | — |

> Update this table after each significant run. The CI Link is a GitHub Actions run URL
> (`.github/workflows/qa-e2e.yml`) or a path to a local report file.

## Last Execution

| Date | Suite | Pass | Skip | Fail | Duration | Report |
|---|---|---|---|---|---|---|
| — | — | — | — | — | — | — |

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

_No sprints completed yet._

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
