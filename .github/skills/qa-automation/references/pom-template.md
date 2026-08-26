# Reference: Page Object Model Template

> Loaded by `skills/qa-automation/` (Step 1b) when a submodule meets any of the POM criteria
> in `SKILL.md` (5+ field form, precondition for another submodule, or 2+ distinct URLs).
>
> **Local fix note**: this file did not exist anywhere in `@keber/qa-framework` (confirmed up to
> v1.11.3) even though `qa-automation/SKILL.md` referenced it — the framework has a POM *decision
> rule* but no POM *template*. Added locally (originally documented in a `FRAMEWORK-FIXES-qa-framework.md`
> item 6, no longer present in the repo) so the reference resolves; `npx qa-framework upgrade`
> will not remove this file (it is not framework-owned), but a future framework version may
> ship its own — reconcile if so.

---

## File location and naming

`qa/07-automation/e2e/page-objects/{SubmoduleName}Page.ts` — one class per submodule, PascalCase,
suffixed `Page`.

## Template

```typescript
import { type Page, type Locator, expect } from '@playwright/test';

/**
 * @module {MODULE_CODE}
 * @submodule {SUBMODULE_CODE}
 * @spec qa/01-specifications/module-{name}/submodule-{name}/00-inventory.md
 */
export class {SubmoduleName}Page {
  readonly page: Page;

  // List view
  readonly createButton: Locator;
  readonly searchInput: Locator;
  readonly gridRows: Locator;

  // Create/edit form
  readonly nameInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Prefer getByRole/getByLabel/getByTestId over CSS selectors (SKILL.md Step 4)
    this.createButton = page.getByRole('button', { name: /crear|nuevo/i });
    this.searchInput = page.getByRole('textbox', { name: /buscar/i });
    this.gridRows = page.getByRole('row');

    this.nameInput = page.getByLabel(/nombre/i);
    this.saveButton = page.getByRole('button', { name: /guardar/i });
    this.cancelButton = page.getByRole('button', { name: /cancelar/i });
  }

  async goto(baseUrl: string) {
    await this.page.goto(`${baseUrl}/{route}`);
  }

  async openCreateForm() {
    await this.createButton.click();
  }

  async fillCreateForm(data: { name: string }) {
    await this.nameInput.fill(data.name);
  }

  async save() {
    await this.saveButton.click();
  }

  async expectRowVisible(text: string) {
    await expect(this.gridRows.filter({ hasText: text })).toBeVisible();
  }
}
```

## Usage from a spec file

```typescript
import { test } from '@playwright/test';
import { {SubmoduleName}Page } from '../../page-objects/{SubmoduleName}Page';

test('[TC-{MODULE}-{SUB}-001] Crear registro exitosamente @P0', async ({ page }) => {
  const pom = new {SubmoduleName}Page(page);
  await pom.goto(process.env.QA_BASE_URL!);
  await pom.openCreateForm();
  await pom.fillCreateForm({ name: `Test-${EXEC_IDX}` });
  await pom.save();
  await pom.expectRowVisible(`Test-${EXEC_IDX}`);
});
```

## Rules

| Rule | Correct | Wrong |
|---|---|---|
| Locator strategy | `getByRole`/`getByLabel`/`getByTestId` inside the POM | CSS selectors scattered across specs |
| Ownership | POM exposes actions (`save()`, `openCreateForm()`) | Spec reaches into POM internals to build its own flow |
| Assertions | Live in the spec file (`expect(...)` in the test) | Buried inside POM methods, hiding failures |
| Scope | One POM per submodule | One giant POM per module covering every submodule |
| Reuse | Constructor takes `page` only; no hardcoded URLs/credentials | Base URL or credentials hardcoded in the POM |
