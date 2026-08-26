# Reference: Tag Taxonomy

> Adapted from `Playwright-Scaffold-AI-Assisted-Development`'s single-tag
> rule, merged with this project's existing priority-based tagging
> (`testNamingPattern: "[{ID}] {title} @{priority}"` in
> `qa/qa-framework.config.json`) instead of replacing it.

## The single-tag rule

Every test carries **exactly one** tag, via Playwright's structured option —
`{ tag: '@P0' }` — never embedded only in the title, and never on
`test.describe()`.

| Tag | Meaning | npm command |
|---|---|---|
| `@P0` | Primary happy path; show-stopper risk; critical data corruption | `npm run test:p0` |
| `@P1` | Common negative scenarios; cross-module dependencies; state transitions | `npm run test:p1` (runs `@P0\|@P1`) |
| `@P2` | Secondary features (export, pagination, search) | `--grep @P2` |
| `@P3` | Edge cases, cosmetic, exploratory charters | `--grep @P3` |
| `@destructive` | Mutates **shared/global** state — overrides the priority tag | `npm run test:destructive` |

Priority (`P0`-`P3`) comes straight from the TC's priority in
`05-test-scenarios.md` / the Plan de Pruebas table — this is not a new
classification, it is the existing one now expressed as a real Playwright
tag instead of only living inside the title string.

## `@destructive` — adopted as-is from the source scaffold

Reserved for tests that mutate **shared/global** state: state that lives
outside the test and that other tests, users, or sessions depend on —
changing the locale, granting/removing permissions or roles, toggling
feature flags or global settings, mutating shared seed data every test
reads.

- **Always wins.** A test that would otherwise be `@P1` but flips a
  feature flag for everyone is tagged `@destructive` only, not `@P1`.
- **Excluded from the parallel suite.** `npm test` should run with
  `--grep-invert @destructive`; run destructive tests separately with
  `--workers=1`.
- **Not destructive:** a test that creates its own record, asserts, then
  deletes only that record in cleanup is isolated, not destructive — tag
  it by priority.
- **Cleanup is still mandatory** either way — `afterEach`/`afterAll` must
  revert what the test wrote (Constitution MUST: State Cleanup).

## Forbidden patterns [enforced]

```typescript
// FORBIDDEN — @functional is not a valid tag
test('should login', { tag: '@functional' }, async ({ appPage }) => { ... });

// FORBIDDEN — combining tags is not allowed
test('should authenticate', { tag: ['@P0', '@destructive'] }, async ({ apiRequest }) => { ... });

// FORBIDDEN — tag on the title AND the option counts as two tags
test('smoke check @P0', { tag: '@destructive' }, async () => { ... });

// FORBIDDEN — tags belong on the test, not on the describe
test.describe('Feature @P0', () => { ... });
```
