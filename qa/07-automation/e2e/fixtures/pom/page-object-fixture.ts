import { test as base } from '@playwright/test';
import { CatalogPage } from '../../page-objects/CatalogPage';

/**
 * Framework fixtures for page objects.
 *
 * Add one fixture entry here per Page Object as qa-automation Step 1b
 * creates them. See `.github/skills/qa-automation/references/pom-template.md`
 * for the Page Object template itself, and Step 1b of `qa-automation/SKILL.md`
 * for when a submodule warrants a POM vs. inline locators.
 *
 * `clearCart` exists because this app's cart persists in `localStorage`
 * under the `unicornt_cart` key (see `assets/js/cart.js`), not in cookies -
 * Playwright already isolates cookies/storage per test by default (each
 * test gets a fresh `context`), so this fixture is mainly useful for a
 * test that deliberately wants to assert on a pre-seeded or leftover cart
 * state within a single test, or to reset state mid-test after a reload.
 */
export type FrameworkFixtures = {
  catalogPage: CatalogPage;
  /** Clears the cart's localStorage key mid-test. Requires the page to have navigated once already. */
  clearCart: () => Promise<void>;
};

export const test = base.extend<FrameworkFixtures>({
  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page));
  },
  clearCart: async ({ page }, use) => {
    await use(async () => {
      await page.evaluate(() => localStorage.removeItem('unicornt_cart'));
    });
  },
});
