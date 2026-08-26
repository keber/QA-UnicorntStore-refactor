# test-data

Shared, cross-module test data — factories and static fixtures used by more
than one submodule's specs. Per-submodule data (specific to one TC or one
submodule) belongs in that submodule's own
`qa/01-specifications/module-{name}/submodule-{name}/04-test-data.md`, not
here (see `qa/QA-STRUCTURE-GUIDE.md`, `04-test-data/`).

## Three-tier rule

1. **Universal type-mismatch arrays** (wrong type for any field of a given
   primitive type) live in `static/util/invalid-values.ts` as exported
   `as const` tuples. Import; never redefine inline.
2. **Domain-specific curated invalid sets** (invalid email formats, weak
   passwords, forbidden enum values, locale strings, etc.) live under
   `static/{module}/*.ts` — create these once a real module needs a shared
   negative-data set across its specs.
3. **Field-specific boundary/range values** (e.g., out-of-range for a
   `1..5` number) may stay inline in the spec file when used in exactly one
   place.

## Static vs. factories

- `static/` — immutable `.ts` files with `as const` exports for curated
  boundary/invalid data. JSON is forbidden here: it cannot represent
  `undefined`, has no comments, no type safety, and no narrow literal
  autocomplete. Enforced by
  `eslint-rules/scaffold-plugin.mts`'s `static-data-literals-only` rule and
  `.claude/scripts/enforce_constitution.py`.
- `factories/` — TypeScript functions using Faker (+ Zod validation of the
  generated shape) for unique, valid data per test run — prevents
  collisions in parallel execution. Create `factories/{module}/*.factory.ts`
  once a real module needs generated happy-path data; the EXEC_IDX pattern
  in `fixtures/test-helpers.ts` covers simpler cases (a unique name/email)
  without needing a full factory.

No module-specific static data or factories exist yet — Stage 1 (module
analysis) has not run for this project (see `qa/AGENT-NEXT-STEPS.md`).
