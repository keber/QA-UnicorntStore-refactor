---
name: qa-automation
description: >
  Stage 5 of the QA pipeline. Implements Playwright test automation from
  approved specifications. Generates spec files, page objects, fixtures, and
  configures the test runner.
  Use when asked to automate tests, write Playwright specs, implement automation,
  implement test scripts, code the e2e suite, or generate .spec.ts files.
  Requires completed specifications with no PENDING-CODE sections (Stage 2 complete,
  Stage 4 recommended).
---

# QA Skill: Automation Generation (Stage 5 of 6)

**Stage**: 5 — Automation  
**Prerequisite**: All specs for the target submodule are complete and contain no `PENDING-CODE` sections  
**Output**: `qa/07-automation/e2e/tests/{module}/{submodule}.spec.ts` + supporting files  
**Next stage**: Stage 6 — Maintenance (`qa-maintenance`) or Stage 5b — Stabilization (`qa-test-stabilization`) if tests fail

> **Pipeline rule**: Never automate a TC whose spec contains `PENDING-CODE`. Resolve spec gaps first.

---

## Inputs Required

1. `qa/01-specifications/{module}/` — full spec set for target submodule
2. `qa/07-automation/e2e/playwright.config.ts` — confirm project name maps to submodule tag
3. `qa/07-automation/e2e/fixtures/pom/test-options.ts` — the single import point for `test`/`expect` (see `references/constitution.md`); `fixtures/auth.ts` for the in-test `loginAs(page, role)` helper, if this app has login (check `qa/qa-framework.config.json` → `testUsers` and `qa/memory/` — this project's app does not)
4. TC list (from test plan or Stage 4) — defines which TCs to automate in this session
5. `qa/qa-framework.config.json` → screenshotPath, automationRoot

> **Constitution**: this stage is governed by a mechanical enforcement layer, not just prose —
> see `references/constitution.md`. A `PreToolUse` hook (`.claude/scripts/enforce_constitution.py`)
> blocks violating writes before they land; an ESLint layer (`eslint-rules/scaffold-plugin.mts`)
> catches the same violations in code review and CI. Read it once before writing the first spec
> in a fresh session — the rules below assume it.

---

## Process

### Step 0 — Pre-inspection (MANDATORY before writing any test code)

For every new submodule, run a dedicated inspection script before writing tests.
**Template**: `references/dom-inspection-template.js` — copy, set the 4 constants at the top, run.

1. Copy `references/dom-inspection-template.js` → `qa/07-automation/e2e/_inspect-{submodule}.js`
2. Set the 4 constants at the top of the script:
   - `MODULE_ROUTE` — the submodule's URL path (e.g. `'/Users'`, `'/Products/list'`)
   - `APP_SHELL_SEL` — a selector that confirms the SPA has loaded (nav, sidebar, app shell)
   - `CREATE_BTN` — regex matching the create/new button label in this app
   - `BASE_URL` — already read from `process.env.QA_BASE_URL`
3. Run: `QA_BASE_URL=<env> node _inspect-{submodule}.js`
4. Paste key findings as a comment block at the **top of the `.spec.ts` file** before writing any test:
   ```
   // INSPECTION: {date}
   // Grid headers: [...]
   // Create form: inputs[0]=Name(maxLen=100), dd[0]=Category(lazy=true)
   // Validation msg: "El campo Nombre es obligatorio."
   // API: POST /api/{Entity} { pageNumber, pageSize }
   ```

The template covers 5 inspection areas automatically: SPA warmup, list view (grid headers + seed row + buttons), create form (all input types, tabs, validation messages), unauth redirect, and API call interception. Adapt the script for tabs or nested forms by adding steps after the create form section.

**Never skip this step for submodules inside complex forms (tabs, dialogs, nested entities).
The cost of one inspection run is far lower than 10+ debugging iterations.**

### Step 1 — Scan for blockers

Before writing a line of code:
- Search all spec files for `PENDING-CODE` — stop and flag if found
- Confirm `playwright.config.ts` exists; scaffold it if missing using `references/config-checklist.md`
- If the app under test has login/roles, verify `fixtures/auth.ts` has them (build it from `qa/qa-framework.config.json` → `testUsers` if missing, following the env-var-driven selector pattern already used elsewhere in this project). Check `qa/qa-framework.config.json` → `testUsers` and `qa/memory/` first — some projects (e.g. this one, per `qa/memory/arquitectura-unicornstore-2026-08-26.md`) have no login at all, and `fixtures/auth.ts` should not exist for them.

### Step 1b — Decide POM vs inline locators

Create a Page Object in `qa/07-automation/e2e/page-objects/{SubmoduleName}Page.ts` when ANY of these is true:
- The submodule has a form with 5+ fields (locators will be reused across P0 + P1 suites)
- The submodule is referenced as a precondition by another submodule (BP, tabs, modals)
- The submodule requires navigation to 2+ distinct URLs (list + create + edit)

Otherwise, inline locators are acceptable for simple catalog submodules (single URL, < 5 fields).

POM template: `references/pom-template.md`

### Step 2 — Scaffold spec file

Full spec file template and 7 implementation patterns: `references/patterns.md`

Required scaffold elements:
- `import { test, expect } from '../../fixtures/pom/test-options'` — **never** `from '@playwright/test'` directly (Constitution MUST: Imports; blocked mechanically, see `references/constitution.md`)
- `const EXEC_IDX = Math.floor(Date.now() / 60_000) % 100_000` (prevents DB conflicts in parallel runs) — or `uniqueName()`/`uniqueEmail()` from `fixtures/test-helpers.ts`
- `test.describe('{Submodule Name}', () => { ... })`
- Use fixture-based auth (never hardcode credentials)

### Step 3 — Implement tests in priority order

Implement P0 TCs first, then P1. Within each priority, follow scenario order from `05-test-scenarios.md`.

For each TC:
1. Map TC preconditions to `beforeAll`/`beforeEach` setup
2. Write navigation to the starting URL (use relative paths, not hardcoded base URL)
3. Use `test.step()` to group logical sub-actions — improves traceability
4. Assert observable outcomes — avoid asserting internal implementation details

### Step 4 — Apply stability rules

- Never use `waitForTimeout` — use `waitForSelector`, `waitForResponse`, or role-based locators
- Prefer `getByRole`, `getByLabel`, `getByTestId` over CSS selectors
- Locators attached to dynamic data must use `EXEC_IDX` suffix
- All test data cleared in `afterAll` — never leave residue

### Step 4b — Assertion polarity check (MANDATORY before committing any test)

Every assertion must be verified against the spec, not against the app's 
observed output.

**Rule**: if the app does X but the spec requires NOT X, use `test.fail()` 
with the correct assertion — do not adapt the assertion to match the app.

Red flags that require review before proceeding:
- `expect(X).toBe(false)` where the spec describes a positive condition
- Assertions with `|| fallback`, `?.`, or `Math.max(a, b)` to avoid zero/falsy
- Assertions inside an `if (condition)` that only execute on the happy path
- A test that starts passing after a refactor without a clear spec justification

### Step 5 — Static, Smoke & Completion Checklist

Before marking the submodule as done, run these two gates in order:

1. Run `npx tsc --noEmit` over the automation project (`qa/07-automation/e2e`). Must exit 0. If it
   fails, fix the errors before continuing — do not proceed with pending TypeScript errors.
2. Run each new or modified spec at least once against the official runner in smoke mode:
   `npx playwright test {spec} --project={module} --reporter=list`. The goal is to catch
   reference/import/syntax errors that only surface at execution time, not to achieve a full
   passing run — that is Stage 5b's job.

Only if both checks come back clean should you proceed to the completion checklist below.

Before marking the submodule as ✅ Automation Complete:
- [ ] All P0 TCs passing in CI
- [ ] All P1 TCs passing or explicitly deferred (with reason in spec)
- [ ] No `test.skip` without a linked issue or `PENDING-CODE` tag
- [ ] `playwright.config.ts` project includes submodule tag
- [ ] `qa/README.md` automation status updated
- [ ] AGENT-NEXT-STEPS.md active sprint updated (remove completed items)
- [ ] `tsc --noEmit` run and 0 errors
- [ ] New/modified specs run at least once via `npx playwright test` (smoke)

---

## Key Patterns (reference names for Layer 3)

| Pattern | When to use |
|---|---|
| `EXEC_IDX` | Any TC that creates persistent data |
| `auth-fixture` | All authenticated TCs |
| `fast-fail` | Element state checks where the default timeout would cause silent hangs |
| `email-intercept` | Email verification flows |
| `skip-conditional` | TCs blocked by a known app defect (DEF-xxx) |
| `beforeAll-setup` | Shared precondition across TC group |
| `password-env` | Any credential usage |
| `afterAll-cleanup` | When a test assigns, creates, or modifies persistent data |
| `debug-screenshots` | beforeAll warmup verification, catch blocks in setup, and inspection scripts |
| `apiRequest` + Zod | If this app has a backend/API (this project's does not — see `qa/memory/`) — see `references/type-safety-and-data-strategy.md` |
| tag (`@P0`-`@P3`/`@destructive`) | Every test, exactly one — see `references/tag-taxonomy.md` |

See `references/patterns.md` for full TypeScript implementations.

---

## Outputs

- `qa/07-automation/e2e/tests/{module}/{submodule}.spec.ts`
- `qa/07-automation/e2e/page-objects/{SubmoduleName}Page.ts`  (when POM criteria met)
- `qa/07-automation/e2e/playwright.config.ts` (updated or confirmed)
- `qa/README.md` automation status updated
