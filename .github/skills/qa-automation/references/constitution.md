# Reference: The Automation Constitution

> Adopted (adapted) from `Playwright-Scaffold-AI-Assisted-Development` — see
> `FRAMEWORK-FIXES-qa-framework*.md`, reviewed earlier in this project's setup
> and no longer present in the repo, for the original provenance write-up.
> This is the agent-facing rule set; two mechanical layers enforce the subset that
> can be checked without false positives:
> - `.claude/scripts/enforce_constitution.py` — Claude Code `PreToolUse` hook,
>   blocks a violating `Write`/`Edit`/`MultiEdit` before it lands.
> - `qa/07-automation/e2e/eslint-rules/scaffold-plugin.mts` — AST-level
>   ESLint rules, same checks, survive formatting/aliasing, gate `npm run
>   lint` and CI too.
> Both layers cover only the mechanically-detectable rules below (marked
> **[enforced]**). Everything else is prose — hold yourself and reviewers to
> it the same way.
>
> **This app has no login and no backend/API** (confirmed 2026-08-26, see
> `qa/memory/arquitectura-unicornstore-2026-08-26.md`). The API/schema rules
> below (Strict schemas, Response validation, No loose schemas) are
> currently dormant — no `fixtures/api/`, no Zod dependency, no
> `no-loose-schema` rule wired in `eslint.config.mts` or the hook. Kept here
> as the pattern to reintroduce if the refactor this project validates ever
> adds a backend — see the "dormant" note in `type-safety-and-data-strategy.md`
> for what this project had before it was found unnecessary.

All code in `qa/07-automation/e2e/` (human- or AI-generated) follows these
rules on top of the qa-framework-wide rules in
`.github/instructions/qa-framework.instructions.md`.

## MUST

| Rule | Description |
|---|---|
| **Dependency Injection** | Always use custom fixtures from `fixtures/pom/test-options.ts`. Never instantiate page objects manually (`new LoginPage(page)` is forbidden in test files). **[enforced]** |
| **Imports** | Always import `test`/`expect` from `fixtures/pom/test-options.ts`, never directly from `@playwright/test`, in any `.spec.ts` or `.setup.ts` file. `import type` from `@playwright/test` is fine. **[enforced]** |
| **Selectors** | Prioritize semantic locators: `getByRole()` > `getByLabel()` > `getByPlaceholder()` > `getByText()` > `getByTestId()` (fallback). |
| **Type safety** | Strict TypeScript. All API response types are Zod schemas in `fixtures/api/schemas/`. |
| **Strict schemas** | Always `z.strictObject()`, never `z.object()`/`z.looseObject()`/`.catchall()` — a strict schema rejects unknown keys instead of silently stripping them. **[enforced]** |
| **Response validation** | Assert with `expect(SchemaName.parse(body)).toBeTruthy();` — a bare `.parse(body)` with no assertion, or an `as` cast, is insufficient. |
| **Sources of truth** | URLs and credentials come from `process.env.*` (`QA_BASE_URL` today; `QA_USER_EMAIL`/`QA_USER_PASSWORD`/`QA_API_URL` only if this project ever gains login or a backend — see `qa/memory/`). Never hardcode a URL literal in `goto()`, `baseUrl`, or `baseURL`. **[enforced]** |
| **Assertions** | Explicit web-first assertions (`expect(locator).toBeVisible()`), never a bare truthy check on a manually-polled DOM read. |
| **State cleanup** | Any test that mutates persistent state (`@destructive` or not) MUST revert it in `afterEach`/`afterAll`. |
| **Explore before generate** | Before creating or editing a page object or writing selectors for a live app, explore it first (Playwright MCP / `playwright-cli`) — do not invent selectors from memory or from source code alone (qa-framework's own "UI is the source of truth" principle). |

## SHOULD

| Rule | Description |
|---|---|
| **Data generation** | Use Faker via `test-data/factories/{module}/` for happy-path data, or `EXEC_IDX`/`uniqueName()`/`uniqueEmail()` from `fixtures/test-helpers.ts` for simpler cases. |
| **Test isolation** | Independent tests; `beforeEach` for setup, not shared state between tests. |
| **Test steps** | `test.step()` with Given/When/Then structure. |
| **Comments** | JSDoc on action methods (not on locator getters). |

## WON'T

| Rule | Description |
|---|---|
| **No XPath** | Never use XPath selectors in `page-objects/**` or `tests/**`. **[enforced]** |
| **No hard waits** | Never `page.waitForTimeout()` or a `new Promise(setTimeout ...)` sleep, anywhere in `qa/07-automation/e2e/`. **[enforced]** |
| **No `any`** | No `any` type — use proper types, `unknown`, or a Zod schema. |
| **No manual instantiation** | Never `new PageObject(page)` inside a test file — inject via `fixtures/pom/test-options.ts`. **[enforced]** |
| **No hardcoded secrets** | Never commit credentials or environment-specific URLs. |
| **No tags on describe** | Tags go on individual tests (`{ tag: '@P0' }`), never on `test.describe()`. **[enforced]** |
| **No multiple tags / no `@functional`** | Exactly one tag per test: `@P0`/`@P1`/`@P2`/`@P3`/`@destructive` — see `references/tag-taxonomy.md`. `@functional` is forbidden. **[enforced]** |
| **No loose schemas** | Never `z.object()`/`z.looseObject()`/`.catchall()` in `fixtures/api/schemas/**`. **[enforced]** |
| **No JSON static data** | `test-data/static/**` must be `.ts` with `as const` exports, never `.json`. **[enforced]** |
| **No inline universal invalids** | Import `INVALID_*` from `test-data/static/util/invalid-values.ts`, never redefine the array inline in a spec. **[enforced]** |
