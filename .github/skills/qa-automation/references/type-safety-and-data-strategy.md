# Reference: Type Safety & Data Strategy

> Adopted from `Playwright-Scaffold-AI-Assisted-Development`. Covers the
> `apiRequest` fixture + Zod validation pattern, and the three-tier test
> data rule.
>
> **The API section below is currently dormant for this project** — this
> app has no backend/API (confirmed 2026-08-26, see
> `qa/memory/arquitectura-unicornstore-2026-08-26.md`). There is no
> `fixtures/api/` tree and no `zod` dependency in `package.json` right now.
> The **Test data** section further down still applies in full. Reintroduce
> the API section's pattern only if a real endpoint appears.

## API calls: `apiRequest` fixture (dormant — no backend today, see note above)

Use the `apiRequest` fixture (`fixtures/api/api-request-fixture.ts`) for
**all** API calls in tests — assertions, `beforeEach`/`afterEach`, one-off
calls. Do not write a separate helper for every endpoint; see
`fixtures/helper/helper-fixture.ts` for when a dedicated helper fixture IS
warranted (critical, multi-step setup/teardown reused across 3+ files).

```typescript
import { expect, test } from '../../../fixtures/pom/test-options';
import { UserResponse, UserResponseSchema } from '../../../fixtures/api/schemas/app/userSchema';

test('should return user data', { tag: '@P1' }, async ({ apiRequest }) => {
    const { status, body } = await apiRequest<UserResponse>({
        method: 'GET',
        url: '/users/me',
        baseUrl: process.env.QA_API_URL,
        headers: process.env.QA_ACCESS_TOKEN,
    });

    expect(status).toBe(200);
    expect(UserResponseSchema.parse(body)).toBeTruthy();
});
```

## Schemas: `z.strictObject()` only [enforced]

```typescript
import { z } from 'zod/v4';
import type { output as zOutput } from 'zod/v4';

export const UserResponseSchema = z.strictObject({
    id: z.uuid(),
    email: z.email(),
    token: z.string(),
});
export type UserResponse = zOutput<typeof UserResponseSchema>;
```

`z.strictObject()` rejects unknown keys instead of silently stripping them
(`z.object()`/`z.looseObject()` would). `.catchall()`/`.passthrough()`
reopen a strict schema and are equally forbidden. Enforced by
`eslint-rules/scaffold-plugin.mts`'s `no-loose-schema` rule and by
`.claude/scripts/enforce_constitution.py`.

**Explore before schema-writing**: OpenAPI/Swagger is the source of truth
when it exists. Only when no documentation exists, capture the live
response shape via a real `apiRequest` call as a fallback, and flag the
missing docs (see `fixtures/api/schemas/util/errorResponseSchema.ts` for an
example of a schema written this way, with its `FIXME` markers).

## Test data: the three-tier rule

See `qa/07-automation/e2e/test-data/README.md` for the full folder layout.
Summary:

1. **Universal type-mismatch arrays** (wrong type for any field of a given
   primitive) → `test-data/static/util/invalid-values.ts`, `as const`
   tuples. Import; never redefine inline **[enforced]**.
2. **Domain-specific curated invalid sets** (invalid emails, weak
   passwords, forbidden enum values) → `test-data/static/{module}/*.ts`.
3. **Field-specific boundary values** used in exactly one place may stay
   inline in the spec file.

Static data files (`test-data/static/**`) are literals-only — no Faker
calls, no runtime imports, no function calls, no `Date.now()` **[enforced
by `static-data-literals-only`]**. Dynamic/generated data belongs in
`test-data/factories/{module}/*.factory.ts` (Faker + Zod-validated output),
or in `fixtures/test-helpers.ts`'s `EXEC_IDX`/`uniqueName()`/`uniqueEmail()`
for simpler unique-value needs.
